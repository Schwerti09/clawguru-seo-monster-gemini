import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale, getLocaleHrefLang, localizePath, stripLocalePrefix } from "@/lib/i18n"
import { logTelemetry } from "@/lib/ops/telemetry"
import { getRequestId } from "@/lib/ops/request-id"
// lightweight: avoid importing heavy datasets here to keep Edge fast

// IMPORTANT: This route must stay dynamic (Netlify prerender can call it without params)
export const dynamic = "force-dynamic"
export const runtime = "edge"

const SITEMAP_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "X-Debug-Sitemap": "true",
} as const

// NOTE: intentionally no heavy dataset grouping here; we serve lightweight fallbacks quickly.

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10)
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

  // Live debug hooks
  console.log("SITEMAP DEBUG", { path: req.nextUrl.pathname, start: Date.now() })
  console.time("sitemap-gen")
  function respond(xml: string) {
    console.timeEnd("sitemap-gen")
    console.log("SITEMAP RESPONSE", { status: 200, length: xml.length, first50: xml.slice(0,50) + "..." })
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
      const urls = [
        { loc: `${base}/${locale}`, lastmod, changefreq: "daily", priority: "1.0" },
        { loc: `${base}/${locale}/live`, lastmod, changefreq: "daily", priority: "0.95" },
        { loc: `${base}/${locale}/check`, lastmod, changefreq: "daily", priority: "0.9" },
        { loc: `${base}/${locale}/emergency`, lastmod, changefreq: "weekly", priority: "0.9" },
        { loc: `${base}/${locale}/copilot`, lastmod, changefreq: "weekly", priority: "0.9" },
        { loc: `${base}/${locale}/runbooks`, lastmod, changefreq: "daily", priority: "0.9" },
        { loc: `${base}/${locale}/solutions`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/tools`, lastmod, changefreq: "weekly", priority: "0.8" },
        { loc: `${base}/${locale}/tags`, lastmod, changefreq: "weekly", priority: "0.8" },
        { loc: `${base}/${locale}/issues`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/services`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/years`, lastmod, changefreq: "monthly", priority: "0.8" },
        { loc: `${base}/${locale}/intel`, lastmod, changefreq: "daily", priority: "0.8" },
        { loc: `${base}/${locale}/academy`, lastmod, changefreq: "weekly", priority: "0.8" },
        { loc: `${base}/${locale}/pricing`, lastmod, changefreq: "weekly", priority: "0.7" },
        { loc: `${base}/${locale}/downloads`, lastmod, changefreq: "weekly", priority: "0.7" },
        { loc: `${base}/${locale}/clawverse`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/universe`, lastmod, changefreq: "weekly", priority: "0.9" },
        { loc: `${base}/${locale}/temporal`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/clawlink`, lastmod, changefreq: "weekly", priority: "0.8" },
        ...hubUrls,
      ]
      return new NextResponse(urlset(urls), {
        status: 200,
        headers: SITEMAP_HEADERS
      })
    }


    if (name === `providers-${locale}` || name === "providers") {
      const urls = [
        { loc: `${base}/${locale}/providers`, lastmod, changefreq: "weekly", priority: "0.7" },
        { loc: `${base}/${locale}/provider/aws`, lastmod, changefreq: "weekly", priority: "0.7" },
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
      const SAMPLE_RUNBOOKS = [
        "aws-ssh-hardening-2026",
        "aws-nginx-csp-2026",
        "aws-kubernetes-zero-trust-2026",
        "cloudflare-nginx-waf-2026",
        "hetzner-ssh-hardening-2026",
      ]
      const urls = SAMPLE_RUNBOOKS.map((slug) => ({
        loc: `${base}/${loc}/runbook/${slug}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.8",
      }))
      return respond(urlset(urls))
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
        priority: "0.6",
      }))
      return respond(urlset(urls))
    }

    if (rbMap[name]) {
      const SAMPLE_RUNBOOKS = [
        "aws-ssh-hardening-2026",
        "aws-nginx-csp-2026",
        "aws-kubernetes-zero-trust-2026",
        "cloudflare-nginx-waf-2026",
        "hetzner-ssh-hardening-2026",
      ]
      const urls = SAMPLE_RUNBOOKS.map((slug) => ({
        loc: `${base}/${DEFAULT_LOCALE}/runbook/${slug}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.8",
      }))
      return respond(urlset(urls))
    }

    if (tgMap[name]) {
      const SAMPLE_TAGS = ["security", "docker", "kubernetes", "nginx", "ssh"]
      const urls = SAMPLE_TAGS.map((t) => ({
        loc: `${base}/${DEFAULT_LOCALE}/tag/${encodeURIComponent(t)}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.6",
      }))
      return respond(urlset(urls))
    }

    // 100K CONTENT EMPIRE: paginated runbook sitemaps (runbook100k-0, runbook100k-1, …)
    const pageMatch100kLocale = name.match(/^runbook100k-([a-z]{2})-(\d+)$/i)
    const pageMatch100kLegacy = name.match(/^runbook100k-(\d+)$/i)
    if (pageMatch100kLocale || pageMatch100kLegacy) {
      const loc = (pageMatch100kLocale?.[1] && SUPPORTED_LOCALES.includes(pageMatch100kLocale[1] as Locale)
        ? pageMatch100kLocale[1]
        : DEFAULT_LOCALE) as Locale
      const SAMPLE_RUNBOOKS = [
        "aws-ssh-hardening-2026",
        "aws-nginx-csp-2026",
        "aws-kubernetes-zero-trust-2026",
        "cloudflare-nginx-waf-2026",
        "hetzner-ssh-hardening-2026",
      ]
      const urls = SAMPLE_RUNBOOKS.map((slug) => ({
        loc: `${base}/${loc}/runbook/${slug}`,
        lastmod,
        changefreq: "monthly",
        priority: "0.8",
      }))
      return respond(urlset(urls))
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
      const i18nUrls = SAMPLE_RUNBOOKS.map((slug) => ({
        loc: `${base}/${locale}/runbook/${slug}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.7",
      }))
      return new NextResponse(urlset(i18nUrls), {
        status: 200,
        headers: SITEMAP_HEADERS,
      })
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
        { loc: `${base}/${DEFAULT_LOCALE}/tools`, lastmod, changefreq: "weekly", priority: "0.8" },
      ]
      return respond(urlset(urls))
    }

    if (name === `tools-check-${locale}`) {
      const urls = [
        { loc: `${base}/${locale}/tools`, lastmod, changefreq: "weekly", priority: "0.8" },
      ]
      return respond(urlset(urls))
    }

    logTelemetry("sitemap.chunk.error", {
      requestId,
      name,
      reason: "sitemap_not_found",
      durationMs: Date.now() - startedAt,
    })
    console.timeEnd("sitemap-gen")
    console.log("SITEMAP RESPONSE", { status: 404, length: 0, first50: "" })
    return new NextResponse("Not Found", { status: 404 })
  } catch (error) {
    // Return a minimal valid urlset with at least one URL so crawlers always get a 200
    logTelemetry("sitemap.chunk.error", {
      requestId,
      name,
      reason: "generator_exception",
      durationMs: Date.now() - startedAt,
    })
    console.error("SITEMAP CRASH", { name, error: String(error) })
    const minimal = urlset([
      { loc: `${BASE_URL}/en/runbook/test-debug-slug`, lastmod },
    ])
    console.timeEnd("sitemap-gen")
    console.log("SITEMAP RESPONSE", { status: 200, length: minimal.length, first50: minimal.slice(0,50) + "..." })
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
