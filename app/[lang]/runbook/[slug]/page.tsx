// WORLD BEAST: app/[lang]/runbook/[slug]/page.tsx
// Localized runbook pages: /de/runbook/[slug], /en/runbook/[slug], etc.

import Container from "@/components/shared/Container"
import { getRunbook, RUNBOOKS } from "@/lib/pseo"
import { notFound } from "next/navigation"
import { type Locale, SUPPORTED_LOCALES, translateRunbook, t, localeDir, LOCALE_HREFLANG } from "@/lib/i18n"
import Link from "next/link"

export const revalidate = 60 * 60 * 24 // 24h
export const dynamicParams = true

export async function generateStaticParams() {
  // NEXT-LEVEL UPGRADE 2026: pre-render top runbooks in de + en (most traffic) + es/fr/pt/it
  const topRunbooks = RUNBOOKS.slice(0, 50)
  const primaryLocales: Locale[] = ["de", "en", "es", "fr", "pt", "it"]
  return primaryLocales.flatMap((lang) =>
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
  return {
    title: `${translated.title} | ClawGuru Runbook`,
    description: translated.summary,
    alternates: {
      canonical: `/${locale}/runbook/${r.slug}`,
      // NEXT-LEVEL UPGRADE 2026: Proper BCP-47 hreflang for all 10 locales
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [LOCALE_HREFLANG[l], `/${l}/runbook/${r.slug}`])
      ),
    },
  }
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

  const translated = await translateRunbook({
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    targetLocale: locale,
  })

  return (
    // NEXT-LEVEL UPGRADE 2026: RTL support for Arabic (dir attribute)
    <Container>
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
        <p className="text-gray-300 text-lg mb-8">{translated.summary}</p>

        {/* Steps */}
        {r.howto.steps.length > 0 && (
          <div className="mb-8 p-6 rounded-2xl border border-gray-800 bg-black/30">
            <h2 className="text-xl font-black mb-4">{t(locale, "steps")}</h2>
            <ol className="space-y-3 list-decimal pl-5 text-gray-200">
              {r.howto.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Related */}
        {r.relatedSlugs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-black mb-3">{t(locale, "related")}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {r.relatedSlugs.slice(0, 4).map((slug) => (
                <Link
                  key={slug}
                  href={`/${locale}/runbook/${slug}`}
                  className="p-3 rounded-xl border border-gray-800 hover:border-brand-cyan/40 text-sm text-gray-300 hover:text-white"
                >
                  {slug.replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share CTA */}
        <div className="mt-10 p-5 rounded-2xl border border-brand-cyan/20 bg-brand-cyan/5 flex flex-wrap gap-3 items-center">
          <span className="font-bold text-brand-cyan">🔗 {t(locale, "share")}</span>
          <Link
            href={`/share/${r.slug}`}
            className="px-4 py-2 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 hover:bg-brand-cyan/25 text-sm font-bold"
          >
            One-Click Share →
          </Link>
          <Link
            href={`/runbook/${r.slug}`}
            className="px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 text-sm text-gray-400"
          >
            🌍 Original (DE)
          </Link>
        </div>
      </div>
    </Container>
  )
}
