import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale, getLocaleHrefLang, localizePath, stripLocalePrefix } from "@/lib/i18n"
import { logTelemetry } from "@/lib/ops/telemetry"
import { getRequestId } from "@/lib/ops/request-id"
import { getTopCities } from "@/lib/geo-cities"
import { GEO_OPENCLAW_SPRINT_CITIES, geoOpenClawSprintPath } from "@/lib/geo-openclaw-city-sprint"
import { getGeoSitemapRuntimeLimits } from "@/lib/geo-runtime-config"
// lightweight: avoid importing heavy datasets here to keep Edge fast

// IMPORTANT: This route must stay dynamic (Netlify prerender can call it without params)
export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const maxDuration = 180

const SITEMAP_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  // Shorter TTL so sitemap updates are visible faster
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60, max-age=300",
  "X-Debug-Sitemap": "true",
} as const

// NOTE: intentionally no heavy dataset grouping here; we serve lightweight fallbacks quickly.

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

function hashString(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h >>> 0)
}

function rotateList<T>(arr: T[], offset: number): T[] {
  if (!arr.length) return arr
  const start = ((offset % arr.length) + arr.length) % arr.length
  return arr.slice(start).concat(arr.slice(0, start))
}

function getGeoSeedRunbooks(locale: Locale): string[] {
  const base = [
    "aws-ssh-hardening-2026",
    "aws-nginx-csp-2026",
    "aws-kubernetes-zero-trust-2026",
    "cloudflare-nginx-waf-2026",
    "hetzner-ssh-hardening-2026",
    "gcp-kubernetes-rbac-misconfig-2026",
    "azure-docker-hardening-2026",
    "digitalocean-nginx-rate-limiting-2026",
  ]
  const localeExtra: Record<string, string[]> = {
    de: ["hetzner-nginx-firewall-rules-2026", "netlify-oidc-least-privilege-iam-2029"],
    en: ["aws-github-actions-secrets-management-2026", "cloudflare-nginx-hsts-2026"],
    fr: ["ovhcloud-firewall-origin-lockdown-2025", "scaleway-queue-incident-communication-2028"],
    es: ["azure-kubernetes-mfa-enforcement-2026", "gcp-docker-image-signing-2026"],
  }
  return [...base, ...(localeExtra[locale] || [])]
}

function selectGeoSitemapCities<T extends { slug: string; rollout_stage?: string }>(
  allCities: T[],
  locale: Locale,
  limit: number,
  poolLimit: number
): T[] {
  const pool = allCities.slice(0, poolLimit)
  if (pool.length <= limit) return pool

  const dayStamp = isoDate().replace(/-/g, "")
  const offset = hashString(`${locale}:${dayStamp}`)
  const rotated = rotateList(pool, offset).slice(0, limit)
  const canaryShare = Math.max(
    0,
    Math.min(100, parseInt(process.env.GEO_CANARY_SITEMAP_SHARE || "0", 10) || 0)
  )
  const stable = rotated.filter((c) => (c.rollout_stage || "stable") !== "canary")
  const canary = rotated.filter((c) => c.rollout_stage === "canary")
  if (canary.length === 0 || canaryShare >= 100) return rotated
  if (canaryShare <= 0) return stable.slice(0, limit)
  const maxCanary = Math.max(1, Math.floor((limit * canaryShare) / 100))
  return [...stable, ...canary.slice(0, maxCanary)].slice(0, limit)
}

function geoPriorityFromCity(cityPriority: number, rolloutStage?: string): string {
  const normalized = Math.max(1, Math.min(100, cityPriority || 1))
  // Maps 1..100 to roughly 0.55..0.90 to nudge crawl budget toward top cities.
  let p = 0.55 + (normalized / 100) * 0.35
  // Canary URLs get a lower crawl signal until they prove stability.
  if (rolloutStage === "canary") p = Math.min(p, 0.66)
  return p.toFixed(2)
}

function buildAlternateLinks(loc: string): string[] {
  let pathname = "/"
  try {
    pathname = new URL(loc).pathname || "/"
  } catch {
    pathname = "/"
  }

  const canonicalPath = stripLocalePrefix(pathname)
  const links = SUPPORTED_LOCALES.map(
    (locale) =>
      `    <xhtml:link rel="alternate" hreflang="${getLocaleHrefLang(locale)}" href="${BASE_URL}${localizePath(locale, canonicalPath)}" />`
  )
  links.push(
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${localizePath(DEFAULT_LOCALE, canonicalPath)}" />`
  )
  return links
}

function urlset(urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: string }>) {
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    urls
      .map((u) => {
        const alternates = buildAlternateLinks(u.loc)
        const parts = [
          `  <url>`,
          `    <loc>${u.loc}</loc>`,
          u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : "",
          u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>` : "",
          u.priority ? `    <priority>${u.priority}</priority>` : "",
          ...alternates,
          `  </url>`
        ].filter(Boolean)
        return parts.join("\n")
      })
      .join("\n") +
    `\n</urlset>\n`
  return xml
}

function buildLightSlugs(page: number, size: number): string[] {
  const providers = [
    "aws",
    "gcp",
    "azure",
    "hetzner",
    "digitalocean",
    "cloudflare",
    "vercel",
    "netlify",
    "render",
    "railway",
  ]
  const services = [
    "ssh",
    "docker",
    "kubernetes",
    "nginx",
    "cloudflare",
    "postgres",
    "redis",
    "stripe",
    "prometheus",
    "grafana",
  ]
  const issues = [
    "hardening",
    "csp",
    "rate-limit-baseline",
    "api-key-rotation",
    "secrets-management",
    "backup-restore-drill",
    "observability-baseline",
    "incident-communication",
    "zero-trust-network",
    "ci-cd-security",
  ]
  const years = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"]

  const out: string[] = []
  let idx = 0
  const start = page * size
  const end = start + size
  outer: for (const p of providers) {
    for (const s of services) {
      for (const i of issues) {
        for (const y of years) {
          if (idx >= end) break outer
          if (idx >= start) out.push(`${p}-${s}-${i}-${y}`)
          idx++
        }
      }
    }
  }
  return out
}

// Deterministic massive slug generator for 100k+ sitemaps without heavy imports
function genSeedList(base: string[], total: number, prefix: string, pad: number): string[] {
  const out = base.slice()
  let i = 0
  while (out.length < total) {
    out.push(`${prefix}${String(i).padStart(pad, "0")}`)
    i++
  }
  return out
}

function buildMassiveSlugs(page: number, size: number): string[] {
  const STRICT = process.env.SITEMAP_QUALITY_STRICT === '1'
  const baseProviders = [
    "aws","gcp","azure","hetzner","digitalocean","cloudflare","vercel","netlify","render","railway",
    "linode","vultr","ovhcloud","oracle","scaleway","github-actions","gitlab-ci","terraform","vault","prometheus",
    "docker","kubernetes","openstack","proxmox","flyio","upcloud","ionos","exoscale","civo","kamatera",
  ]
  const baseServices = [
    "ssh","docker","kubernetes","nginx","cloudflare","postgres","redis","stripe","prometheus","grafana",
    "s3","r2","ecs","eks","gke","aks","cdn","waf","firewall","cicd","oidc","webhook","tls","csp",
    "hsts","zero-trust","rbac","audit","logging","metrics","alerts","scaling","backup","restore","queue",
    "kafka","elastic","clickhouse",
  ]
  const baseIssues = [
    "hardening","csp","rate-limit-baseline","api-key-rotation","secrets-management","backup-restore-drill",
    "observability-baseline","incident-communication","zero-trust-network","ci-cd-security","jwt-refresh-rotation",
    "session-revocation","waf-bypass","ddos-first-response","bot-mitigation","origin-lockdown","least-privilege-iam",
    "network-policy","log-alerting","thundering-herd","retry-storm","timeout-tuning","connection-pooling",
    "db-migrations-safe","blue-green-deploy","supply-chain-security","image-scanning","sbom","mfa-enforcement",
    "key-rotation",
  ]
  const years = ["2024","2025","2026","2027","2028","2029","2030"]

  // Quality gate: in strict mode we avoid synthetic padding and enforce provider→service compatibility
  const providers = STRICT ? baseProviders : genSeedList(baseProviders, 64, "prov-", 2)
  const services = STRICT ? baseServices : genSeedList(baseServices, 64, "svc-", 2)
  const issues = STRICT ? baseIssues : genSeedList(baseIssues, 128, "issue-", 3)

  // Provider→Service compatibility (keeps quality high). Generic services apply everywhere; some are vendor-specific.
  const AWS_ONLY = new Set(["s3","ecs","eks"]) as Set<string>
  const GCP_ONLY = new Set(["gke"]) as Set<string>
  const AZURE_ONLY = new Set(["aks"]) as Set<string>
  const CF_ONLY = new Set(["r2"]) as Set<string>
  const VENDOR_SPEC = new Set<string>([...AWS_ONLY, ...GCP_ONLY, ...AZURE_ONLY, ...CF_ONLY])
  function serviceAllowed(provider: string, service: string): boolean {
    if (!STRICT) return true
    const p = provider.toLowerCase()
    const s = service.toLowerCase()
    if (!VENDOR_SPEC.has(s)) return true
    if (AWS_ONLY.has(s)) return p === 'aws'
    if (GCP_ONLY.has(s)) return p === 'gcp'
    if (AZURE_ONLY.has(s)) return p === 'azure'
    if (CF_ONLY.has(s)) return p === 'cloudflare'
    return true
  }

  const P = providers.length
  const S = services.length
  const I = issues.length
  const Y = years.length
  const totalComb = P * S * I * Y

  const start = page * size
  const end = start + size
  const out: string[] = []
  if (!STRICT) {
    // Fast arithmetic mapping for padded mode
    for (let idx = start; idx < end && idx < totalComb; idx++) {
      let n = idx
      const y = n % Y; n = Math.floor(n / Y)
      const i = n % I; n = Math.floor(n / I)
      const s = n % S; n = Math.floor(n / S)
      const p = n % P
      out.push(`${providers[p]}-${services[s]}-${issues[i]}-${years[y]}`)
    }
  } else {
    // Strict: iterate deterministically and emit only compatible combos; skip ahead until page window is filled
    let emitted = 0
    let seen = 0
    outer: for (let p = 0; p < P; p++) {
      for (let s = 0; s < S; s++) {
        if (!serviceAllowed(providers[p], services[s])) continue
        for (let i = 0; i < I; i++) {
          for (let y = 0; y < Y; y++) {
            if (seen >= end) break outer
            if (seen >= start) {
              out.push(`${providers[p]}-${services[s]}-${issues[i]}-${years[y]}`)
              emitted++
              if (emitted >= size) break outer
            }
            seen++
          }
        }
      }
    }
  }
  return out
}

// PHASE 1 FIX #2: Lightweight runbook slug validation (prevents dead URLs in sitemap)
// Returns true if slug looks valid and not obviously broken; false if it should be skipped
function isValidRunbookSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false
  // Basic format: at least provider-service (2 parts)
  const parts = slug.split('-')
  if (parts.length < 2) return false
  // If last part looks like a year, validate range; otherwise allow non-year slugs
  const last = parts[parts.length - 1]
  if (/^\d{4}$/.test(last)) {
    const y = parseInt(last, 10)
    if (y < 2020 || y > 2100) return false
  }
  // Characters and length guardrails
  if (!/^[a-z0-9\-]+$/.test(slug)) return false
  if (slug.length > 200) return false
  return true
}

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const requestId = getRequestId(req.headers)
  const startedAt = Date.now()
  const base = BASE_URL
  const lastmod = isoDate()
  const name = params.name.replace(/\.xml$/, "")
  // NOTE: Do NOT import heavy pseo module at the start; it can cause timeouts on Edge.
  // We will return lightweight fallbacks for all sitemap variants to guarantee 200 OK quickly.
  logTelemetry("sitemap.chunk.request", {
    requestId,
    name,
  })

  function respond(xml: string) {
    return new NextResponse(xml, { status: 200, headers: SITEMAP_HEADERS })
  }

  const localeMatch = name.match(/-([a-z]{2})(?:-|$)/i)
  const locale = (SUPPORTED_LOCALES.includes((localeMatch?.[1] ?? "") as Locale) ? localeMatch?.[1] : DEFAULT_LOCALE) as Locale

  if (!name) {
    logTelemetry("sitemap.chunk.error", {
      requestId,
      name,
      reason: "missing_name",
      durationMs: Date.now() - startedAt,
    })
    return new NextResponse("Not Found", { status: 404 })
  }

  try {
    if (name === `main-${locale}` || name === "main") {
      const HUB_SLUGS = ["cloud", "docker", "kubernetes", "security"]
      const hubUrls = HUB_SLUGS.map((hub) => ({
        loc: `${base}/${locale}/runbooks/${hub}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.85",
      }))
      const geoOpenClawSprintUrls =
        locale === "de" || locale === "en"
          ? GEO_OPENCLAW_SPRINT_CITIES.map((city) => {
              const path = geoOpenClawSprintPath(locale, city)
              return {
                loc: `${base}${path}`,
                lastmod,
                changefreq: "weekly" as const,
                priority: "0.86",
              }
            })
          : []
      // Moltbot subpages (29 pages × all locales)
      const MOLTBOT_SLUGS = [
        "hardening-guide-2024","security-framework","threat-detection-setup","network-security-firewall",
        "api-security-protection","authentication-oauth2-jwt","database-security-encryption",
        "container-security-docker-kubernetes","logging-auditing-compliance","incident-response-automation",
        "devsecops-pipeline","monitoring-dashboards","backup-recovery-disaster-recovery","secrets-vault-management",
        "ssl-tls-management","vulnerability-scanning","zero-trust-architecture","compliance-gdpr-setup",
        "api-gateway-security","identity-governance-iam","nis2-compliance-setup","runtime-protection-rasp",
        "security-automation-workflows","security-posture-score","cloud-native-security",
        "cloud-security-posture-management","cryptography-encryption-guide","data-loss-prevention",
        "api-rate-limiting-advanced","ai-agent-threat-model","real-time-cve-feed","bot-security-testing","sbom-generation","compliance-automation-engine","ai-agent-security","ai-agent-threat-model-template",
      ]
      // OpenClaw subpages (10 pages × all locales)
      const OPENCLAW_SLUGS = [
        "server-hardening-checklist","self-hosted-security-checklist","security-headers-guide",
        "firewall-configuration-guide","reverse-proxy-security","docker-swarm-hardening",
        "audit-logging-setup","database-access-control","intrusion-detection-setup","supply-chain-security",
        "service-mesh-security","waf-configuration","cicd-security-pipeline","secrets-rotation-automation","microservices-security",
      ]
      // Specialized security + compare pages
      const SECURITY_SLUGS = [
        "linux-hardening","nginx-hardening","docker-security-hardening","kubernetes-network-policies",
        "terraform-security","postgresql-security","redis-security","mongodb-security","elasticsearch-security",
        "grafana-hardening","prometheus-vpn","keycloak-hardening","vault-hardening","splunk-security",
        "datadog-security","jenkins-security","gitlab-cicd-security","circleci-security","argocd-security",
        "kafka-security","rabbitmq-security","windows-server-security","sonarqube-security",
        "opentelemetry-security","cloudformation-security","tailscale-pam","aws-iam-security",
        "aws-vpc-flow-logs","azure-ad-security","cloudflare-tunnel-firewall-rules",
        "docker-reverse-proxy-hardening-cheatsheet",
      ]
      // Compare pages
      const COMPARE_SLUGS = [
        "clawguru-vs-wiz","openclaw-vs-snyk","openclaw-vs-semgrep","openclaw-vs-sonarqube",
        "moltbot-vs-opsgenie","moltbot-vs-clawbot","clawguru-vs-crowdstrike","clawguru-vs-datadog","openclaw-vs-falco","clawguru-vs-lacework","moltbot-vs-pagerduty",
      ]
      // Solutions pages
      const SOLUTIONS_SLUGS = [
        "soc2-compliance-automation","kubernetes-security-hardening","startup-security-foundation",
        "enterprise-siem-integration","iso27001-certification-roadmap","pci-dss-compliance","hipaa-security-controls",
      ]
      // SEO guide pages
      const GUIDE_SLUGS = [
        "executable-runbook-vs-static-blog","security-check-vs-pentest-guide","nis2-technical-controls-self-hosted",
        "openclaw-top-5-exposure-misconfigs","openclaw-security-2026","moltbot-hardening",
        "ai-agent-security","ai-agent-threat-model-template","api-key-leak-response-playbook",
        "gateway-auth-10-steps","waf-2027","xxe-2026","hetzner-vs-do-security-baseline-2026",
        "check-methodology-30-seconds",
      ]
      const moltbotUrls = MOLTBOT_SLUGS.map((slug) => ({
        loc: `${base}/${locale}/moltbot/${slug}`, lastmod, changefreq: "weekly", priority: "0.88",
      }))
      const openclawSubUrls = OPENCLAW_SLUGS.map((slug) => ({
        loc: `${base}/${locale}/openclaw/${slug}`, lastmod, changefreq: "weekly", priority: "0.87",
      }))
      const securityUrls = SECURITY_SLUGS.map((slug) => ({
        loc: `${base}/${locale}/${slug}`, lastmod, changefreq: "weekly", priority: "0.85",
      }))
      const compareUrls = COMPARE_SLUGS.map((slug) => ({
        loc: `${base}/${locale}/${slug}`, lastmod, changefreq: "monthly", priority: "0.83",
      }))
      const guideUrls = GUIDE_SLUGS.map((slug) => ({
        loc: `${base}/${locale}/${slug}`, lastmod, changefreq: "weekly", priority: "0.84",
      }))
      const solutionsUrls = SOLUTIONS_SLUGS.map((slug) => ({
        loc: `${base}/${locale}/solutions/${slug}`, lastmod, changefreq: "weekly", priority: "0.86",
      }))
      const urls = [
        { loc: `${base}/${locale}`, lastmod, changefreq: "daily", priority: "0.9" },
        { loc: `${base}/${locale}/live`, lastmod, changefreq: "daily", priority: "0.9" },
        { loc: `${base}/${locale}/check`, lastmod, changefreq: "daily", priority: "0.9" },
        { loc: `${base}/${locale}/methodik`, lastmod, changefreq: "monthly", priority: "0.72" },
        { loc: `${base}/${locale}/roast-my-stack`, lastmod, changefreq: "weekly", priority: "0.88" },
        { loc: `${base}/${locale}/roast-my-moltbot`, lastmod, changefreq: "daily", priority: "0.9" },
        { loc: `${base}/${locale}/emergency`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/copilot`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/runbooks`, lastmod, changefreq: "daily", priority: "0.9" },
        { loc: `${base}/${locale}/openclaw`, lastmod, changefreq: "weekly", priority: "0.9" },
        { loc: `${base}/${locale}/oracle`, lastmod, changefreq: "weekly", priority: "0.87" },
        { loc: `${base}/${locale}/neuro`, lastmod, changefreq: "weekly", priority: "0.87" },
        { loc: `${base}/${locale}/solutions`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/tools`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/tags`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/issues`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/services`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/years`, lastmod, changefreq: "monthly", priority: "0.8" },
        { loc: `${base}/${locale}/intel`, lastmod, changefreq: "daily", priority: "0.9" },
        { loc: `${base}/${locale}/academy`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/pricing`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/downloads`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/clawverse`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/universe`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/temporal`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/clawlink`, lastmod, changefreq: "weekly", priority: "0.85" },
        ...hubUrls,
        ...geoOpenClawSprintUrls,
        ...moltbotUrls,
        ...openclawSubUrls,
        ...securityUrls,
        ...compareUrls,
        ...guideUrls,
        ...solutionsUrls,
      ]
      return respond(urlset(urls))
    }


    if (name === `providers-${locale}` || name === "providers") {
      const urls = [
        { loc: `${base}/${locale}/providers`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/provider/aws`, lastmod, changefreq: "weekly", priority: "0.85" },
      ]
      return respond(urlset(urls))
    }

    const rbMap: Record<string, "a-f" | "g-l" | "m-r" | "s-z" | "0-9"> = {
      "runbooks-a-f": "a-f",
      "runbooks-g-l": "g-l",
      "runbooks-m-r": "m-r",
      "runbooks-s-z": "s-z",
      "runbooks-0-9": "0-9"
    }

    const rbLocaleMatch = name.match(/^runbooks-([a-z]{2})-(a-f|g-l|m-r|s-z|0-9)$/i)
    if (rbLocaleMatch?.[1] && rbLocaleMatch?.[2]) {
      const loc = (SUPPORTED_LOCALES.includes(rbLocaleMatch[1] as Locale) ? rbLocaleMatch[1] : DEFAULT_LOCALE) as Locale
      const bucket = rbLocaleMatch[2] as "a-f"|"g-l"|"m-r"|"s-z"|"0-9"
      try {
        const perBucket = Math.max(50, Math.min(5000, parseInt(process.env.SITEMAP_RUNBOOKS_PER_BUCKET || "500", 10) || 500))
        const pseo = await import("@/lib/pseo")
        const list = (pseo.materializedRunbooks?.() || pseo.RUNBOOKS || []) as Array<{ slug: string; lastmod: string; clawScore: number }>
        function inBucket(slug: string): boolean {
          const c = slug[0]?.toLowerCase() || ""
          if (bucket === "0-9") return /[0-9]/.test(c)
          if (bucket === "a-f") return c >= "a" && c <= "f"
          if (bucket === "g-l") return c >= "g" && c <= "l"
          if (bucket === "m-r") return c >= "m" && c <= "r"
          if (bucket === "s-z") return c >= "s" && c <= "z"
          return true
        }
        const filtered = list.filter((r) => inBucket(r.slug) && isValidRunbookSlug(r.slug))
        const sorted = filtered.sort((a, b) => (b.clawScore - a.clawScore) || (b.lastmod.localeCompare(a.lastmod)))
        const top = sorted.slice(0, perBucket)
        if (top.length === 0) {
          const fallback = urlset([
            { loc: `${base}/${loc}/runbook/aws-ssh-hardening-2026`, lastmod, changefreq: "weekly", priority: "0.85" },
          ])
          return respond(fallback)
        }
        const urls = top.map((r) => ({
          loc: `${base}/${loc}/runbook/${r.slug}`,
          lastmod,
          changefreq: "weekly",
          priority: "0.85",
        }))
        return respond(urlset(urls))
      } catch {
        const fallback = urlset([
          { loc: `${base}/${loc}/runbook/aws-ssh-hardening-2026`, lastmod, changefreq: "weekly", priority: "0.85" },
        ])
        return respond(fallback)
      }
    }

    const tgMap: Record<string, "a-f" | "g-l" | "m-r" | "s-z" | "0-9"> = {
      "tags-a-f": "a-f",
      "tags-g-l": "g-l",
      "tags-m-r": "m-r",
      "tags-s-z": "s-z",
      "tags-0-9": "0-9"
    }

    const tgLocaleMatch = name.match(/^tags-([a-z]{2})-(a-f|g-l|m-r|s-z|0-9)$/i)
    if (tgLocaleMatch?.[1] && tgLocaleMatch?.[2]) {
      const loc = (SUPPORTED_LOCALES.includes(tgLocaleMatch[1] as Locale) ? tgLocaleMatch[1] : DEFAULT_LOCALE) as Locale
      const SAMPLE_TAGS = ["security", "docker", "kubernetes", "nginx", "ssh"]
      const urls = SAMPLE_TAGS.map((t) => ({
        loc: `${base}/${loc}/tag/${encodeURIComponent(t)}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.85",
      }))
      return respond(urlset(urls))
    }

    if (rbMap[name]) {
      const bucket = rbMap[name]
      try {
        const perBucket = Math.max(50, Math.min(5000, parseInt(process.env.SITEMAP_RUNBOOKS_PER_BUCKET || "500", 10) || 500))
        const pseo = await import("@/lib/pseo")
        const list = (pseo.materializedRunbooks?.() || pseo.RUNBOOKS || []) as Array<{ slug: string; lastmod: string; clawScore: number }>
        function inBucket(slug: string): boolean {
          const c = slug[0]?.toLowerCase() || ""
          if (bucket === "0-9") return /[0-9]/.test(c)
          if (bucket === "a-f") return c >= "a" && c <= "f"
          if (bucket === "g-l") return c >= "g" && c <= "l"
          if (bucket === "m-r") return c >= "m" && c <= "r"
          if (bucket === "s-z") return c >= "s" && c <= "z"
          return true
        }
        const filtered = list.filter((r) => inBucket(r.slug) && isValidRunbookSlug(r.slug))
        const sorted = filtered.sort((a, b) => (b.clawScore - a.clawScore) || (b.lastmod.localeCompare(a.lastmod)))
        const top = sorted.slice(0, perBucket)
        if (top.length === 0) {
          const fallback = urlset([
            { loc: `${base}/${DEFAULT_LOCALE}/runbook/aws-ssh-hardening-2026`, lastmod, changefreq: "weekly", priority: "0.85" },
          ])
          return respond(fallback)
        }
        const urls = top.map((r) => ({
          loc: `${base}/${DEFAULT_LOCALE}/runbook/${r.slug}`,
          lastmod,
          changefreq: "weekly",
          priority: "0.85",
        }))
        return respond(urlset(urls))
      } catch {
        const fallback = urlset([
          { loc: `${BASE_URL}/${DEFAULT_LOCALE}/runbook/aws-ssh-hardening-2026`, lastmod, changefreq: "weekly", priority: "0.85" },
        ])
        return respond(fallback)
      }
    }

    if (tgMap[name]) {
      const SAMPLE_TAGS = ["security", "docker", "kubernetes", "nginx", "ssh"]
      const urls = SAMPLE_TAGS.map((t) => ({
        loc: `${base}/${DEFAULT_LOCALE}/tag/${encodeURIComponent(t)}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.85",
      }))
      return respond(urlset(urls))
    }

    // 100K CONTENT EMPIRE: paginated runbook sitemaps (runbook100k-<locale>-<page>) — real 50k slugs
    const pageMatch100kLocale = name.match(/^runbook100k-([a-z]{2})-(\d+)$/i)
    const pageMatch100kLegacy = name.match(/^runbook100k-(\d+)$/i)
    if (pageMatch100kLocale || pageMatch100kLegacy) {
      const loc = (pageMatch100kLocale?.[1] && SUPPORTED_LOCALES.includes(pageMatch100kLocale[1] as Locale)
        ? pageMatch100kLocale[1]
        : DEFAULT_LOCALE) as Locale
      const page = parseInt(pageMatch100kLocale?.[2] ?? pageMatch100kLegacy?.[1] ?? "0", 10)
      try {
        // Deterministic generation of 50k slugs per page without heavy imports
        const PAGE_SIZE_100K = 50000
        const slugs: string[] = buildMassiveSlugs(page, PAGE_SIZE_100K)
        // Build a lightweight urlset (no alternates) to keep XML size reasonable
        if (slugs.length > 0) {
          const xml =
            `<?xml version="1.0" encoding="UTF-8"?>\n` +
            `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
            slugs
              .map((slug) => (
                `  <url>\n` +
                `    <loc>${base}/${loc}/runbook/${slug}</loc>\n` +
                `    <lastmod>${lastmod}</lastmod>\n` +
                `    <changefreq>monthly</changefreq>\n` +
                `    <priority>0.8</priority>\n` +
                `  </url>`
              ))
              .join("\n") +
            `\n</urlset>\n`
          return respond(xml)
        } else {
          const fallback = urlset([
            { loc: `${base}/${loc}/runbook/aws-ssh-hardening-2026`, lastmod, changefreq: "monthly", priority: "0.8" },
          ])
          return respond(fallback)
        }
      } catch (e) {
        // Fallback: minimal but valid urlset to avoid 5xx
        const fallback = urlset([
          { loc: `${base}/${loc}/runbook/aws-ssh-hardening-2026`, lastmod, changefreq: "monthly", priority: "0.8" },
        ])
        return respond(fallback)
      }
    }

    // NEXT-LEVEL UPGRADE 2026: Language-specific sitemaps for i18n runbook pages
    if (name.startsWith("i18n-")) {
      const locale = name.slice(5) as Locale
      if (!SUPPORTED_LOCALES.includes(locale)) {
        logTelemetry("sitemap.chunk.error", {
          requestId,
          name,
          reason: "invalid_i18n_locale",
          durationMs: Date.now() - startedAt,
        })
        return new NextResponse("Not Found", { status: 404 })
      }
      const SAMPLE_RUNBOOKS = [
        "aws-ssh-hardening-2026",
        "aws-nginx-csp-2026",
        "aws-kubernetes-zero-trust-2026",
        "cloudflare-nginx-waf-2026",
        "hetzner-ssh-hardening-2026",
      ]
      // PHASE 1 FIX #2: Filter validation for i18n
      const i18nUrls = SAMPLE_RUNBOOKS.filter(isValidRunbookSlug).map((slug) => ({
        loc: `${base}/${locale}/runbook/${slug}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.85",
      }))
      return respond(urlset(i18nUrls))
    }

    // GENESIS PROTOKOLL: Issue hub sitemap
    if (name === "issues") {
      const urls = [
        { loc: `${base}/${DEFAULT_LOCALE}/issues`, lastmod, changefreq: "weekly", priority: "0.85" },
      ]
      return respond(urlset(urls))
    }

    if (name === `issues-${locale}`) {
      const urls = [
        { loc: `${base}/${locale}/issues`, lastmod, changefreq: "weekly", priority: "0.85" },
      ]
      return respond(urlset(urls))
    }

    // GENESIS PROTOKOLL: Service hub sitemap
    if (name === "services") {
      const urls = [
        { loc: `${base}/${DEFAULT_LOCALE}/services`, lastmod, changefreq: "weekly", priority: "0.85" },
      ]
      return respond(urlset(urls))
    }

    if (name === `services-${locale}`) {
      const urls = [
        { loc: `${base}/${locale}/services`, lastmod, changefreq: "weekly", priority: "0.85" },
      ]
      return respond(urlset(urls))
    }

    // GENESIS PROTOKOLL: Year hub sitemap
    if (name === "years") {
      const urls = [
        { loc: `${base}/${DEFAULT_LOCALE}/years`, lastmod, changefreq: "monthly", priority: "0.8" },
      ]
      return respond(urlset(urls))
    }

    if (name === `years-${locale}`) {
      const urls = [
        { loc: `${base}/${locale}/years`, lastmod, changefreq: "monthly", priority: "0.8" },
      ]
      return respond(urlset(urls))
    }

    // PROGRAMMATIC SEO: CVE Solutions sitemap (/solutions/fix-CVE-*)
    if (name === "solutions-cve" || name === "solutions" || name === "cves") {
      const urls = [
        { loc: `${base}/${DEFAULT_LOCALE}/solutions`, lastmod, changefreq: "weekly", priority: "0.85" },
      ]
      return respond(urlset(urls))
    }

    if (name === `solutions-cve-${locale}`) {
      const urls = [
        { loc: `${base}/${locale}/solutions`, lastmod, changefreq: "weekly", priority: "0.85" },
      ]
      return respond(urlset(urls))
    }

    // PROGRAMMATIC SEO: Service Check Tools sitemap (/tools/check-*)
    if (name === "tools-check") {
      const urls = [
        { loc: `${base}/${DEFAULT_LOCALE}/tools`, lastmod, changefreq: "weekly", priority: "0.85" },
      ]
      return respond(urlset(urls))
    }

    if (name === `tools-check-${locale}`) {
      const urls = [
        { loc: `${base}/${locale}/tools`, lastmod, changefreq: "weekly", priority: "0.85" },
      ]
      return respond(urlset(urls))
    }

    // GEO-LIVING MATRIX: curated geo runbook variants (only when explicitly enabled)
    if (name === `geo-runbooks-${locale}` && process.env.GEO_MATRIX_SITEMAP === "1") {
      const runtimeLimits = await getGeoSitemapRuntimeLimits()
      const cityPoolMax = Math.max(runtimeLimits.cityLimit, runtimeLimits.cityPool)
      const topCities = await getTopCities(cityPoolMax)
      const citySelection = selectGeoSitemapCities(
        topCities,
        locale,
        runtimeLimits.cityLimit,
        runtimeLimits.cityPool
      )
      const seeds = getGeoSeedRunbooks(locale).slice(0, runtimeLimits.seedLimit)
      const urls = seeds.flatMap((slug) =>
        citySelection.map((city) => ({
          loc: `${base}/${locale}/runbook/${slug}-${city.slug}`,
          lastmod,
          changefreq: "weekly",
          priority: geoPriorityFromCity(city.priority, city.rollout_stage),
        }))
      )
      return respond(urlset(urls))
    }

    logTelemetry("sitemap.chunk.error", {
      requestId,
      name,
      reason: "sitemap_not_found",
      durationMs: Date.now() - startedAt,
    })
    return new NextResponse("Not Found", { status: 404 })
  } catch (error) {
    // Return a minimal valid urlset with at least one URL so crawlers always get a 200
    logTelemetry("sitemap.chunk.error", {
      requestId,
      name,
      reason: "generator_exception",
      durationMs: Date.now() - startedAt,
    })
    console.error("[sitemap] generator exception", { name, error: String(error) })
    const minimal = urlset([
      { loc: `${BASE_URL}/${DEFAULT_LOCALE}/runbook/aws-ssh-hardening-2026`, lastmod },
    ])
    return new NextResponse(minimal, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "X-Debug-Sitemap": "true",
      }
    })
  }
}
