// File: app/runbook/[slug]/page.tsx
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import type { Runbook, RunbookBlock, RunbookFaqEntry } from "@/lib/pseo"
import { validateRunbook, type ClawCertifiedTier } from "@/lib/quality-gate"
import { getTemporalHistory } from "@/lib/temporal-mycelium"
import NextDynamic from "next/dynamic"
import { Suspense } from "react"
import { permanentRedirect, notFound } from "next/navigation"
import { CopyLinkButton } from "./CopyLinkButton"
import { ActivateSwarmButton } from "@/components/shared/ActivateSwarmButton"
import { BASE_URL } from "@/lib/config"
import { buildLinkEngine } from "@/lib/seo/link-engine"
import MyceliumShareCard from "@/components/share/MyceliumShareCard"
import { unstable_cache } from "next/cache"
import { DEFAULT_LOCALE, localeAlternates, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"
import { parseGeoVariantSlug } from "@/lib/geo-matrix"
import { generateGeoVariantContent } from "@/lib/geo-content-generator"
import { getCityBySlug } from "@/lib/geo-cities"
import { isGeoVariantIndexable } from "@/lib/geo-mycelium"
const RunbookMiniTabs = NextDynamic(() => import("@/components/runbook/RunbookMiniTabs"))

const TemporalTimelineLazy = NextDynamic(() => import("@/components/visual/TemporalTimeline"), {
  loading: () => <div className="text-sm text-gray-500 py-6 text-center">Lade Timeline…</div>,
})

const VersionsAndForksTabLazy = NextDynamic(() => import("@/components/runbook/VersionsAndForksTab"), {
  loading: () => <div className="text-sm text-gray-500 py-6 text-center">Lade Tabs…</div>,
})

export const dynamic = "force-static"
export const revalidate = 86400 // reduce rebuild frequency to cut CPU
export const dynamicParams = true // SEO: return 404 for unknown slugs (no redirect spam)
export const runtime = "nodejs"
export const maxDuration = 180
export const preferredRegion = "iad1"

async function buildLinkEngineNow() {
  const { materializedRunbooks } = await import("@/lib/pseo")
  return buildLinkEngine(materializedRunbooks(), {
    maxLinks: 10,
    urlForPage: (page) => `/runbook/${page.slug}`,
    authorityForPage: (page) => page.clawScore,
  })
}

const getTemporalHistoryCached = unstable_cache(
  async (slug: string) => {
    const { getRunbook } = await import("@/lib/pseo")
    const rb = getRunbook(slug)
    return rb ? getTemporalHistory(rb) : null
  },
  ["temporal-history"],
  { revalidate: 3600 }
)

export async function generateStaticParams() {
  // Pre-render top 200 materialized runbooks + key 100k slugs for fast initial crawl
  const { materializedRunbooks } = await import("@/lib/pseo")
  const staticParams = materializedRunbooks().slice(0, 200).map((r) => ({ slug: r.slug }))
  const key100kSlugs = [
    "aws-ssh-hardening-2026",
    "aws-nginx-csp-2026",
    "aws-kubernetes-zero-trust-2026",
    "cloudflare-nginx-waf-2026",
    "hetzner-ssh-hardening-2026",
    "gcp-kubernetes-rbac-misconfig-2026",
    "azure-docker-hardening-2026",
    "digitalocean-nginx-rate-limiting-2026",
    "kubernetes-docker-supply-chain-attack-2026",
    "aws-github-actions-secrets-management-2026",
    "cloudflare-nginx-hsts-2026",
    "aws-kubernetes-sbom-2026",
    "hetzner-nginx-firewall-rules-2026",
    "gcp-docker-image-signing-2026",
    "azure-kubernetes-mfa-enforcement-2026",
  ]
  return [...staticParams, ...key100kSlugs.map((slug) => ({ slug }))]
}

export async function generateMetadata(props: { params: { slug: string } }) {
  const params = props.params
  const { getRunbook } = await import("@/lib/pseo")
  const locale = DEFAULT_LOCALE as Locale
  const geoParsed = parseGeoVariantSlug(params.slug)
  const geoCity = geoParsed.citySlug ? await getCityBySlug(geoParsed.citySlug) : null
  const r = getRunbook(params.slug) ?? getRunbook(geoParsed.baseSlug)
  if (!r) return {}
  const title = r.title.length > 60 ? r.title.slice(0, 57) + "..." : r.title
  const description = r.summary.length > 160 ? r.summary.slice(0, 157) + "..." : r.summary
  const canonicalSlug = geoCity ? `${r.slug}-${geoCity.slug}` : r.slug
  const isIndexableGeoVariant = geoCity
    ? await isGeoVariantIndexable({
        locale,
        variantSlug: canonicalSlug,
        rolloutStage: geoCity.rollout_stage,
      })
    : true
  const alternates = localeAlternates(`/runbook/${canonicalSlug}`)
  return {
    title: `${title} | ClawGuru Runbook`,
    description,
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title: `${title} | ClawGuru`,
      description,
      type: "article",
    },
    robots: {
      index: isIndexableGeoVariant,
      follow: true,
      // Keep canary geo variants crawlable for discovery but out of index until stable.
      nocache: false,
    },
  }
}

function howToJsonLd(opts: { title: string; summary: string; slug: string; steps: string[]; locale: Locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.title,
    description: opts.summary,
    url: `${BASE_URL}/${opts.locale}/runbook/${opts.slug}`,
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s,
      text: s,
    })),
  }
}

function breadcrumbJsonLd(opts: { title: string; slug: string; locale: Locale; runbooksLabel: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${BASE_URL}/${opts.locale}` },
      { "@type": "ListItem", position: 2, name: opts.runbooksLabel, item: `${BASE_URL}/${opts.locale}/runbooks` },
      { "@type": "ListItem", position: 3, name: opts.title, item: `${BASE_URL}/${opts.locale}/runbook/${opts.slug}` },
    ],
  }
}

function techArticleJsonLd(opts: { title: string; summary: string; slug: string; lastmod: string; locale: Locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: opts.title,
    description: opts.summary,
    url: `${BASE_URL}/${opts.locale}/runbook/${opts.slug}`,
    dateModified: opts.lastmod,
    author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
    publisher: { "@type": "Organization", name: "ClawGuru", url: BASE_URL, logo: { "@type": "ImageObject", url: `${BASE_URL}/og-image.png` } },
  }
}

function faqJsonLd(faq: RunbookFaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  }
}

function geoServiceJsonLd(opts: {
  locale: Locale
  slug: string
  title: string
  city: { name_en: string; country_code: string }
  summary: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${opts.title} (${opts.city.name_en})`,
    description: opts.summary,
    inLanguage: opts.locale,
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${opts.city.name_en}, ${opts.city.country_code}`,
    },
    url: `${BASE_URL}/${opts.locale}/runbook/${opts.slug}`,
    isPartOf: `${BASE_URL}/${opts.locale}/runbooks`,
  }
}

function geoSecurityServiceJsonLd(opts: {
  locale: Locale
  slug: string
  title: string
  city: { name_en: string; country_code: string }
  summary: string
  pricingNote?: string
  compliance?: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${opts.title} Security Hardening (${opts.city.name_en})`,
    serviceType: "Security hardening runbook",
    description: opts.summary,
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${opts.city.name_en}, ${opts.city.country_code}`,
    },
    provider: {
      "@type": "Organization",
      name: "ClawGuru",
      url: BASE_URL,
    },
    category: "Cybersecurity",
    termsOfService: `${BASE_URL}/${opts.locale}/methodik`,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/${opts.locale}/check`,
      description: opts.pricingNote || "Operational security check and hardening guidance.",
    },
    additionalProperty: (opts.compliance || []).slice(0, 4).map((c) => ({
      "@type": "PropertyValue",
      name: "Compliance Context",
      value: c,
    })),
    mainEntityOfPage: `${BASE_URL}/${opts.locale}/runbook/${opts.slug}`,
  }
}

function ClawScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" :
    score >= 75 ? "text-cyan-400 border-cyan-500/40 bg-cyan-500/10" :
    "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-black ${color}`}>
      <span>⚡ Claw Score</span>
      <span className="text-base">{score}</span>
      <span className="opacity-60">/100</span>
    </div>
  )
}

/** GENESIS QUALITY GATE 2.0 – Claw Certified badge with Gold/Silver tier colors */
function ClawCertifiedBadge({ score, tier }: { score: number; tier: ClawCertifiedTier }) {
  if (tier === "hidden") return null
  const isGold = tier === "gold"
  const colorStyle = isGold
    ? { color: "#FFD700", borderColor: "rgba(255,215,0,0.4)", backgroundColor: "rgba(255,215,0,0.08)" }
    : { color: "#C0C0C0", borderColor: "rgba(192,192,192,0.4)", backgroundColor: "rgba(192,192,192,0.08)" }
  const label = isGold ? "🏅 Claw Certified Gold" : "🥈 Claw Certified Silver"
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-black"
      style={colorStyle}
    >
      <span>{label}</span>
      <span className="text-base">{score}</span>
      <span style={{ opacity: 0.6 }}>/100</span>
    </div>
  )
}

function ShareButtons({ title, slug, locale }: { title: string; slug: string; locale: Locale }) {
  const url = `${BASE_URL}/${locale}/runbook/${slug}`
  const encoded = encodeURIComponent(url)
  const text = encodeURIComponent(`${title} – ClawGuru Runbook`)
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <span className="text-xs text-gray-500 self-center">Teilen:</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-xl border border-gray-700 bg-black/30 text-xs text-gray-300 hover:border-sky-500 hover:text-sky-400 transition-colors"
        aria-label="Auf Twitter teilen"
      >
        𝕏 Twitter
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-xl border border-gray-700 bg-black/30 text-xs text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
        aria-label="Auf LinkedIn teilen"
      >
        💼 LinkedIn
      </a>
      <CopyLinkButton url={url} />
    </div>
  )
}

function BlockView({ b }: { b: RunbookBlock }) {
  if (b.kind === "h2") return <h2 className="mt-10 text-lg font-black text-gray-100">{b.text}</h2>
  if (b.kind === "h3") return <h3 className="mt-6 text-base font-bold text-gray-200">{b.text}</h3>
  if (b.kind === "h4") return <h4 className="mt-4 text-sm font-semibold text-gray-300 uppercase tracking-wide">{b.text}</h4>

  if (b.kind === "p") return <p className="mt-3 text-gray-200/90 leading-relaxed">{b.text}</p>

  if (b.kind === "ul")
    return (
      <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-200/90">
        {b.items.map((it, i) => (
          <li key={i} className="leading-relaxed">
            {it}
          </li>
        ))}
      </ul>
    )

  if (b.kind === "code")
    return (
      <pre className="mt-4 rounded-2xl border border-gray-800 bg-black/40 p-4 overflow-x-auto text-sm">
        <code>{b.code}</code>
      </pre>
    )

  if (b.kind === "callout")
    return (
      <div
        className={`mt-5 rounded-3xl border p-5 ${
          b.tone === "warn" ? "border-red-500/30 bg-red-500/10" : "border-emerald-500/30 bg-emerald-500/10"
        }`}
      >
        <div className="text-sm font-black tracking-wide text-gray-100">{b.title}</div>
        <div className="mt-2 text-gray-200/90 leading-relaxed">{b.text}</div>
      </div>
    )

  return null
}

function FaqSection({ faq }: { faq: RunbookFaqEntry[] }) {
  if (!faq?.length) return null
  return (
    <div className="mt-12">
      <h2 className="text-xl font-black mb-6 text-gray-100">Häufige Fragen (FAQ)</h2>
      <div className="space-y-4">
        {faq.map((entry, i) => (
          <details key={i} className="rounded-2xl border border-gray-800 bg-black/20 group">
            <summary className="px-5 py-4 cursor-pointer font-bold text-gray-200 list-none flex items-center justify-between">
              <span>{entry.q}</span>
              <span className="text-gray-500 group-open:rotate-180 transition-transform text-xs">▼</span>
            </summary>
            <div className="px-5 pb-4 text-gray-400 leading-relaxed text-sm">{entry.a}</div>
          </details>
        ))}
      </div>
    </div>
  )
}

export default async function RunbookPage(props: { params: { slug: string; lang?: string } }) {
  const params = props.params
  const { getRunbook } = await import("@/lib/pseo")
  const locale = ((params.lang as Locale | undefined) ?? DEFAULT_LOCALE) as Locale
  const dict = await getDictionary(locale)
  const prefix = `/${locale}`
  
  // SEO Fix: Return 404 for non-existent runbooks instead of redirecting to /runbooks
  // (redirects caused Google to see duplicate content on the listing page)
  let r: any
  const geoParsed = parseGeoVariantSlug(params.slug)
  const geoCity = geoParsed.citySlug ? await getCityBySlug(geoParsed.citySlug) : null
  r = getRunbook(params.slug) ?? getRunbook(geoParsed.baseSlug)
  if (!r) {
    notFound()
  }

  const geoVariant =
    process.env.GEO_MATRIX_ENABLED === "1" && geoCity
      ? await generateGeoVariantContent({
          slug: params.slug,
          locale,
          city: geoCity.name_en,
          region: geoCity.name_en,
          country: geoCity.country_code,
          title: r.title,
          summary: r.summary,
        })
      : null
  const displayTitle = geoVariant?.localTitle || r.title
  const displaySummary = geoVariant?.localSummary || r.summary

  // Quality Gate: reject thin content before serving (ClawGuru 2026 Standard)
  const quality = validateRunbook(r)
  if (quality.violations.some((v) => v.severity === "error")) {
    console.warn("quality-gate:violations", {
      slug: r.slug,
      errors: quality.violations.filter((v) => v.severity === "error").map((v) => v.message),
    })
  }

  // TEMPORAL MYCELIUM v3.1 – Overlord AI: compute deterministic evolution history
  const temporalHistory = null as any

  // Embedding-driven internal links (Spider-Web) with relatedSlugs as seed hints
  const linkEngine = null as any
  const engineList = (linkEngine && typeof (linkEngine as any).linksForSlug === "function")
    ? linkEngine.linksForSlug(r.slug)
    : []
  const relatedSlugs = Array.from(
    new Set([
      ...r.relatedSlugs,
      ...engineList.map((link: any) => link.slug),
    ])
  ).slice(0, 10)
  const relatedList = relatedSlugs.length > 0
    ? (relatedSlugs
        .map((s) => getRunbook(s))
        .filter(Boolean) as Runbook[])
    : []
  return (
      <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToJsonLd({ title: displayTitle, summary: displaySummary, slug: params.slug, steps: r.howto.steps, locale })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd({ title: displayTitle, slug: params.slug, locale, runbooksLabel: dict.nav.runbooks })) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd({ title: displayTitle, summary: displaySummary, slug: params.slug, lastmod: r.lastmod, locale })) }}
      />
      {r.faq?.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(r.faq)) }}
        />
      )}
      {geoVariant && geoCity ? (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                geoServiceJsonLd({
                  locale,
                  slug: params.slug,
                  title: displayTitle,
                  summary: displaySummary,
                  city: geoCity,
                })
              ),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                geoSecurityServiceJsonLd({
                  locale,
                  slug: params.slug,
                  title: displayTitle,
                  summary: displaySummary,
                  city: geoCity,
                  pricingNote: geoVariant.localPricingNote,
                  compliance: geoVariant.localCompliance,
                })
              ),
            }}
          />
        </>
      ) : null}
      <div className="py-16 max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href={`${prefix}`} className="hover:text-cyan-400">
                ClawGuru
              </a>
            </li>
            <li>/</li>
            <li>
              <a href={`${prefix}/runbooks`} className="hover:text-cyan-400">
                {dict.nav.runbooks}
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-300">{r.title}</li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <ClawScoreBadge score={r.clawScore} />
          <span className="text-xs text-gray-600">Stand: {r.lastmod}</span>
          <span className="text-xs text-gray-600">·</span>
          <span className="text-xs text-gray-500">Author: ClawGuru Institutional Ops</span>
          <ClawCertifiedBadge score={quality.score} tier={quality.clawCertifiedTier} />
        </div>

        <p className="text-xs font-mono text-cyan-500/80 mb-1 tracking-wide">
          Claw Security Score: {r.clawScore}/100 – {r.title}
        </p>

        <SectionTitle kicker="Runbook" title={displayTitle} subtitle={displaySummary} />

        {geoVariant ? (
          <div className="mt-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
            <div className="text-xs font-black tracking-wider uppercase text-cyan-300">
              Mycelium Geo-Living Matrix
            </div>
            <h3 className="mt-2 text-base font-bold text-cyan-100">{displayTitle}</h3>
            <p className="mt-2 text-sm text-cyan-50/90">{displaySummary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {geoVariant.localCompliance.slice(0, 3).map((item) => (
                <span key={item} className="rounded-full border border-cyan-400/30 px-2 py-0.5 text-xs text-cyan-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Sticky Glass Mini-Tabs + Progress Tracker */}
        <RunbookMiniTabs />

        <ShareButtons title={displayTitle} slug={params.slug} locale={locale} />

        <div
          id="overview"
          className="mt-10 p-6 rounded-3xl border bg-black/25 transition-transform will-change-transform hover:-translate-y-0.5"
          style={{
            borderColor: "rgba(148,163,184,0.25)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.04)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Rich blocks (Tier-2 content) */}
          {Array.isArray(r.blocks) && r.blocks.length > 0 ? (
            <div className="mb-10">
              {r.blocks.map((b: RunbookBlock, i: number) => (
                <BlockView key={i} b={b} />
              ))}
            </div>
          ) : null}

          <div id="steps" className="text-xs uppercase tracking-widest text-gray-500">Schritt-für-Schritt</div>
          <ol className="mt-4 list-decimal pl-6 space-y-3 text-gray-200">
            {r.howto.steps.map((s: string, i: number) => (
              <li key={i} className="leading-relaxed">
                {s}
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`/${locale}/runbook/${r.slug}/temporal`}
              className="group flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all active:scale-95"
              aria-label="Timeline / Versionsgeschichte öffnen"
            >
              <span className="text-lg">📅</span>
              <span className="font-medium">Timeline</span>
              <span className="text-white/60 group-hover:text-white transition-colors">→</span>
            </a>
            <a
              href={`${prefix}/check`}
              className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90"
            >
              Re-Check starten →
            </a>
            <a
              href={`${prefix}/copilot`}
              className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200"
            >
              Copilot Runbook Builder →
            </a>
            {/* SWARM DEPLOYMENT v3.2 – Overlord AI: One-click swarm activation for Pro users */}
            <ActivateSwarmButton slug={r.slug} />
            <a
              href={`${prefix}/intel`}
              className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-gray-200 hover:bg-white/10"
            >
              {dict?.runbook?.back_to_intel ?? "Zurück zu Intel"}
            </a>
            <a
              href={`${prefix}/oracle?scope=${encodeURIComponent((r.tags || []).slice(0,5).join(','))}`}
              className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-gray-200 hover:bg-white/10"
            >
              {dict?.runbook?.back_to_oracle ?? "Zurück zu Oracle"}
            </a>
            <a
              href={`${prefix}/neuro?stack=${encodeURIComponent((r.tags || []).slice(0,5).join(','))}&auto=1`}
              className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-gray-200 hover:bg-white/10"
            >
              {dict?.runbook?.back_to_neuro ?? "Zurück zu Neuro"}
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {r.tags.map((t: string) => (
              <a
                key={t}
                href={`${prefix}/tag/${encodeURIComponent(t)}`}
                className="px-2 py-1 rounded-lg border border-gray-800 bg-black/30 text-xs text-gray-300 hover:bg-black/40"
              >
                {t}
              </a>
            ))}
          </div>
        </div>

        <FaqSection faq={r.faq} />

        {/* TEMPORAL MYCELIUM v3.1 – Overlord AI: Temporal Evolution Timeline */}
        <Suspense fallback={<div className="text-sm text-gray-500 py-6 text-center">Lade Timeline…</div>}>
          {temporalHistory && Array.isArray(temporalHistory.versions) && temporalHistory.versions.length > 0 ? (
            <div id="timeline">
              <TemporalTimelineLazy history={temporalHistory} slug={r.slug} />
            </div>
          ) : null}
        </Suspense>

        {/* MYCELIUM CORE: Runbook Versioning + Community Fork */}
        <Suspense fallback={<div className="text-sm text-gray-500 py-6 text-center">Lade Tabs…</div>}>
          <div id="versions">
            <VersionsAndForksTabLazy slug={r.slug} />
          </div>
        </Suspense>

        {/* PROVENANCE SINGULARITY v3.4 – Overlord AI: Provenance chain link */}
        <div className="mt-6 px-4 py-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 flex items-center gap-3">
          <span className="text-cyan-400 text-lg shrink-0">🔗</span>
          <p className="text-xs text-cyan-300/80">
            <span className="font-black text-cyan-300">Provenance Singularity.</span>{" "}
            This runbook is cryptographically signed and immutably recorded.
          </p>
          <a
            href={`${prefix}/provenance/${r.slug}`}
            className="ml-auto shrink-0 text-xs text-cyan-400 hover:text-cyan-200 underline underline-offset-2 transition-colors"
          >
            View Provenance Chain →
          </a>
        </div>

        {relatedList.length > 0 ? (
          <div className="mt-10">
            <h2 className="text-xl font-black mb-4">Verwandte Runbooks</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedList.slice(0, 10).map((x) => (
                <a
                  key={x.slug}
                  href={`${prefix}/runbook/${x.slug}`}
                  className="p-5 rounded-3xl border bg-black/25 hover:bg-black/35 transition-all duration-200 will-change-transform hover:-translate-y-0.5"
                  style={{
                    borderColor: "rgba(148,163,184,0.25)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.04)",
                    transform: "translateZ(0)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-black text-sm">{x.title}</div>
                    <span className="ml-auto text-xs text-gray-500 shrink-0">⚡{x.clawScore}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-400">{x.summary}</div>
                  <div className="mt-3 text-sm text-cyan-300 underline">Öffnen →</div>
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {geoVariant?.myceliumLinks?.length ? (
          <div className="mt-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-cyan-300">Geo-Mycelium Links</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {geoVariant.myceliumLinks.slice(0, 6).map((path) => (
                <a
                  key={path}
                  href={path}
                  className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-100 hover:bg-cyan-500/20"
                >
                  {path}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-12 p-6 rounded-3xl border border-gray-800 bg-black/20 text-sm text-gray-400">
          Hinweis: Diese Inhalte sind für Ops/Security gedacht. Keine „Namen-Datenbank&quot;, keine Anschuldigungen – nur Runbooks,
          Tools und verifizierbare Checks.
        </div>

        {/* RUNBOOK VIRAL SHARE CARD */}
        <div className="mt-8">
          <MyceliumShareCard
            title={r.title}
            answer={r.summary}
            pageUrl={`${prefix}/runbook/${r.slug}`}
          />
        </div>
      </div>
      </Container>
  )
}
