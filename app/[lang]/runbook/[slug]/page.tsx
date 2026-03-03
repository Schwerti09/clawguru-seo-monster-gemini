// WORLD BEAST: app/[lang]/runbook/[slug]/page.tsx
// Localized runbook pages: /de/runbook/[slug], /en/runbook/[slug], etc.

import Container from "@/components/shared/Container"
import { getRunbook, RUNBOOKS, type RunbookBlock } from "@/lib/pseo"
import { notFound } from "next/navigation"
import { type Locale, SUPPORTED_LOCALES, translateRunbook, t, localeDir, LOCALE_HREFLANG } from "@/lib/i18n"
import { getTemporalHistory } from "@/lib/temporal-mycelium"
import { validateRunbook } from "@/lib/quality-gate"
import TemporalTimeline from "@/components/visual/TemporalTimeline"
import { ActivateSwarmButton } from "@/components/shared/ActivateSwarmButton"
import Link from "next/link"
import ShareUnlockPanel from "@/components/shared/ShareUnlockPanel"
import { mutateSeoTitle } from "@/app/lib/seo-optimizer"
import { BASE_URL } from "@/lib/config"
import { buildLinkEngine } from "@/lib/seo/link-engine"

export const revalidate = 60 * 60 * 24 // 24h
export const dynamicParams = true
export const fetchCache = "force-cache"

const LINK_ENGINE = buildLinkEngine(RUNBOOKS, {
  maxLinks: 10,
  urlForPage: (page) => `/runbook/${page.slug}`,
  authorityForPage: (page) => page.clawScore ?? 0,
})

export async function generateStaticParams() {
  // All 10 supported locales × top runbooks for full language coverage
  const topRunbooks = RUNBOOKS.slice(0, 50)
  return SUPPORTED_LOCALES.flatMap((lang) =>
    topRunbooks.map((r) => ({ lang, slug: r.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string }
}) {
  const locale = SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? (params.lang as Locale)
    : "de"
  const r = getRunbook(params.slug)
  if (!r) return {}
  const translated = await translateRunbook({
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    targetLocale: locale,
  })
  const mutatedTitle = mutateSeoTitle({ title: translated.title })
  return {
    title: `${mutatedTitle} | ClawGuru Runbook`,
    description: translated.summary,
    alternates: {
      canonical: `/${locale}/runbook/${r.slug}`,
      // NEXT-LEVEL UPGRADE 2026: Proper BCP-47 hreflang for all 10 locales
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [LOCALE_HREFLANG[l], `/${l}/runbook/${r.slug}`])
      ),
    },
    openGraph: {
      title: `${mutatedTitle} | ClawGuru`,
      description: translated.summary,
      type: "article",
    },
  }
}

function breadcrumbJsonLd(title: string, slug: string, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Runbooks", item: `${BASE_URL}/${locale}/runbooks` },
      { "@type": "ListItem", position: 3, name: title, item: `${BASE_URL}/${locale}/runbook/${slug}` },
    ],
  }
}

function techArticleJsonLd(r: { title: string; summary: string; slug: string; lastmod: string }, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: r.title,
    description: r.summary,
    url: `${BASE_URL}/${locale}/runbook/${r.slug}`,
    dateModified: r.lastmod,
    author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
    publisher: { "@type": "Organization", name: "ClawGuru", url: BASE_URL, logo: { "@type": "ImageObject", url: `${BASE_URL}/og-image.png` } },
  }
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

export default async function LocalizedRunbookPage({
  params,
}: {
  params: { lang: string; slug: string }
}) {
  const locale: Locale = SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? (params.lang as Locale)
    : "de"

  const r = getRunbook(params.slug)
  if (!r) notFound()
  const quality = validateRunbook(r)
  if (!quality.pass) notFound()

  const translated = await translateRunbook({
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    targetLocale: locale,
  })

  // TEMPORAL MYCELIUM v3.1 – Overlord AI: deterministic evolution history
  const temporalHistory = getTemporalHistory(r!)
  const relatedLinks = r ? LINK_ENGINE.getLinks(r) : []

  // JSON-LD: HowTo + FAQPage + Speakable schema
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: translated.title,
    description: translated.summary,
    dateModified: r.lastmod,
    author: {
      "@type": "Person",
      name: r.author.name,
      jobTitle: r.author.role,
    },
    step: r.howto.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
  }

  const faqSchema = r.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: r.faq.map((entry) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.a,
      },
    })),
  } : null

  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#direct-answer", "h1"],
    },
    url: `${BASE_URL}/${locale}/runbook/${r.slug}`,
  }

  return (
    // NEXT-LEVEL UPGRADE 2026: RTL support for Arabic (dir attribute)
    <Container>
      {/* JSON-LD Structured Data: HowTo + FAQPage + Speakable */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(translated.title, r.slug, locale)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(techArticleJsonLd({ title: translated.title, summary: translated.summary, slug: r.slug, lastmod: r.lastmod }, locale)),
        }}
      />

      <div className="py-16 max-w-4xl mx-auto" dir={localeDir(locale)}>
        {/* Locale switcher */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {SUPPORTED_LOCALES.map((l) => (
            <Link
              key={l}
              href={`/${l}/runbook/${r.slug}`}
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                l === locale
                  ? "bg-brand-cyan/20 border-brand-cyan text-brand-cyan"
                  : "border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>

        <div className="mb-2 text-xs text-gray-500 uppercase tracking-widest">
          {t(locale, "runbookFor")} · {r.tags.slice(0, 3).join(" · ")}
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-3">{translated.title}</h1>

        {/* AEO: Direct answer in first 100 words */}
        <p id="direct-answer" className="text-gray-300 text-lg mb-4 font-medium border-l-4 border-brand-cyan pl-4">
          {translated.summary}
        </p>

        {/* E-E-A-T: Last updated signal */}
        <div className="mb-8 text-xs text-gray-500">
          {t(locale, "lastUpdated")}: <time dateTime={r.lastmod}>{r.lastmod}</time> · ClawScore: {r.clawScore}/100
        </div>

        {Array.isArray(r.blocks) && r.blocks.length > 0 && (
          <div className="mb-8">
            {r.blocks.map((b: RunbookBlock, i: number) => (
              <BlockView key={i} b={b} />
            ))}
          </div>
        )}

        {/* Steps */}
        {r.howto.steps.length > 0 && (
          <div className="mb-8 p-6 rounded-2xl border border-gray-800 bg-black/30">
            <h2 className="text-xl font-black mb-4">{t(locale, "steps")}</h2>
            <ShareUnlockPanel title={translated.title} slug={r.slug} items={r.howto.steps} locale={locale} />
          </div>
        )}

        {/* FAQ */}
        {r.faq.length > 0 && (
          <div className="mb-8 p-6 rounded-2xl border border-gray-800 bg-black/20">
            <h2 className="text-xl font-black mb-4">{t(locale, "faq")}</h2>
            <div className="space-y-4">
              {r.faq.map((entry, i) => (
                <div key={i}>
                  <h3 className="font-bold text-brand-cyan mb-1">{entry.q}</h3>
                  <p className="text-gray-300 text-sm">{entry.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related – up to 10 contextual links */}
        {relatedLinks.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-black mb-3">{t(locale, "related")}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedLinks.map((link) => (
                <Link
                  key={link.slug}
                  href={`/${locale}${link.url}`}
                  className="p-3 rounded-xl border border-gray-800 hover:border-brand-cyan/40 text-sm text-gray-300 hover:text-white"
                >
                  {(link.title || link.slug).replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author box – E-E-A-T signals */}
        <div className="mt-10 p-6 rounded-2xl border border-gray-700 bg-gray-900/50">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-xl font-black text-brand-cyan">
              RS
            </div>
            <div>
              <div className="font-black text-white">{r.author.name}</div>
              <div className="text-xs text-brand-cyan mb-2">{r.author.role}</div>
              <p className="text-sm text-gray-300 mb-3">{r.author.experience}</p>
              <div className="text-xs text-gray-500">
                <span className="font-bold text-gray-400">{t(locale, "sourcesStandards")}: </span>
                {r.author.sources.join(" · ")}
              </div>
            </div>
          </div>
        </div>

        {/* Share CTA */}
        <div className="mt-10 p-5 rounded-2xl border border-brand-cyan/20 bg-brand-cyan/5 flex flex-wrap gap-3 items-center">
          <span className="font-bold text-brand-cyan">🔗 {t(locale, "share")}</span>
          <Link
            href={`/share/${r!.slug}`}
            className="px-4 py-2 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 hover:bg-brand-cyan/25 text-sm font-bold"
          >
            One-Click Share →
          </Link>
          <Link
            href={`/de/runbook/${r!.slug}`}
            className="px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 text-sm text-gray-400"
          >
            🌍 Original (DE)
          </Link>
          {/* SWARM DEPLOYMENT v3.2 – Overlord AI: One-click swarm activation for Pro users */}
          <ActivateSwarmButton slug={r!.slug} />
        </div>

        {/* TEMPORAL MYCELIUM v3.1 – Overlord AI: Temporal Evolution Timeline */}
        <TemporalTimeline history={temporalHistory} slug={r.slug} lang={locale} />
      </div>
    </Container>
  )
}
