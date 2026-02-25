// WORLD BEAST: app/[lang]/runbook/[slug]/page.tsx
// Localised runbook page – serves /en/runbook/..., /es/runbook/..., /fr/runbook/...
// Falls back to the default German content if translation is unavailable.

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { RUNBOOKS, getRunbook } from "@/lib/pseo"
import { notFound } from "next/navigation"
import {
  isValidLocale,
  t,
  translateRunbookSnippet,
  hreflangUrls,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/i18n"

export const revalidate = 60 * 60 * 24 // 24h ISR
export const dynamicParams = true

export async function generateStaticParams() {
  // WORLD BEAST: pre-render top 100 per locale; rest served via ISR
  const slugs = RUNBOOKS.slice(0, 100).map((r) => r.slug)
  const params: { lang: string; slug: string }[] = []
  // skip "de" – that's handled by /runbook/[slug]
  for (const lang of SUPPORTED_LOCALES.filter((l) => l !== "de")) {
    for (const slug of slugs) {
      params.push({ lang, slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string }
}) {
  if (!isValidLocale(params.lang)) return {}
  const locale = params.lang as Locale
  const r = getRunbook(params.slug)
  if (!r) return {}

  const translated = await translateRunbookSnippet({
    title: r.title,
    summary: r.summary,
    targetLocale: locale,
  })
  const title = translated?.title ?? r.title
  const description = translated?.summary ?? r.summary
  const hreflangs = hreflangUrls(`/runbook/${r.slug}`)

  return {
    title: `${title.slice(0, 60)} | ClawGuru Runbook`,
    description: description.slice(0, 160),
    alternates: {
      canonical: `/${locale}/runbook/${r.slug}`,
      languages: Object.fromEntries(
        hreflangs.map(({ locale: l, url }) => [l === "de" ? "x-default" : l, url])
      ),
    },
    openGraph: {
      title: `${title} | ClawGuru`,
      description,
      type: "article",
      locale:
        locale === "en" ? "en_US" : locale === "es" ? "es_ES" : locale === "fr" ? "fr_FR" : "de_DE",
    },
  }
}

export default async function LocalizedRunbookPage({
  params,
}: {
  params: { lang: string; slug: string }
}) {
  if (!isValidLocale(params.lang)) return notFound()
  const locale = params.lang as Locale

  const r = getRunbook(params.slug)
  if (!r) return notFound()

  // WORLD BEAST: translate title + summary; fall back to German on failure
  const translated = await translateRunbookSnippet({
    title: r.title,
    summary: r.summary,
    targetLocale: locale,
  })
  const displayTitle = translated?.title ?? r.title
  const displaySummary = translated?.summary ?? r.summary

  const url = `https://clawguru.org/${locale}/runbook/${r.slug}`
  const encodedUrl = encodeURIComponent(url)
  const tweetText = encodeURIComponent(`${displayTitle} – ClawGuru Runbook`)

  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/" className="hover:text-cyan-400">
                ClawGuru
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/runbooks" className="hover:text-cyan-400">
                {t("runbook.breadcrumb", locale)}
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-300">{displayTitle}</li>
          </ol>
        </nav>

        {/* Language switcher */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SUPPORTED_LOCALES.map((l) => (
            <a
              key={l}
              href={l === "de" ? `/runbook/${r.slug}` : `/${l}/runbook/${r.slug}`}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                l === locale
                  ? "border-cyan-500 text-cyan-400 bg-cyan-500/10"
                  : "border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {l.toUpperCase()}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-gray-600">Stand: {r.lastmod}</span>
          <span className="text-xs text-gray-500">⚡ {r.clawScore}/100</span>
        </div>

        <SectionTitle kicker="Runbook" title={displayTitle} subtitle={displaySummary} />

        {/* Share buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs text-gray-500 self-center">{t("runbook.share", locale)}:</span>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${tweetText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl border border-gray-700 bg-black/30 text-xs text-gray-300 hover:border-sky-500 hover:text-sky-400 transition-colors"
          >
            𝕏 Twitter
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${tweetText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl border border-gray-700 bg-black/30 text-xs text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
          >
            💼 LinkedIn
          </a>
        </div>

        {/* Steps */}
        <div className="mt-10 p-6 rounded-3xl border border-gray-800 bg-black/25">
          <div className="text-xs uppercase tracking-widest text-gray-500">
            {t("runbook.stepByStep", locale)}
          </div>
          <ol className="mt-4 list-decimal pl-6 space-y-3 text-gray-200">
            {r.howto.steps.map((s, i) => (
              <li key={i} className="leading-relaxed">
                {s}
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/check"
              className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90"
            >
              {t("runbook.recheck", locale)}
            </a>
            <a
              href="/copilot"
              className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200"
            >
              {t("runbook.copilot", locale)}
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {r.tags.map((tag) => (
              <a
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="px-2 py-1 rounded-lg border border-gray-800 bg-black/30 text-xs text-gray-300 hover:bg-black/40"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>

        {/* FAQ */}
        {r.faq?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-black mb-6 text-gray-100">
              {t("runbook.faq", locale)}
            </h2>
            <div className="space-y-4">
              {r.faq.map((entry, i) => (
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
        )}

        <div className="mt-12 p-6 rounded-3xl border border-gray-800 bg-black/20 text-sm text-gray-400">
          {t("runbook.notice", locale)}
        </div>
      </div>
    </Container>
  )
}
