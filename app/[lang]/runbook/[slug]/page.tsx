// Localized runbook pages: /de/runbook/[slug], /en/runbook/[slug], etc.

// Relative Imports – korrekt für app/[lang]/runbook/[slug]/page.tsx
import Container from "../../../../components/shared/Container"
import { getRunbook, RUNBOOKS } from "../../../../lib/pseo"
import { notFound } from "next/navigation"
import { type Locale, SUPPORTED_LOCALES, translateRunbook, t, localeDir, LOCALE_HREFLANG } from "../../../../lib/i18n"

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((lang) =>
    RUNBOOKS.map((r) => ({ lang, slug: r.slug }))
  )
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { slug, lang } = await props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  const runbook = RUNBOOKS.find((r) => r.slug === slug.toLowerCase())
  if (!runbook) return {}

  const translated = await translateRunbook({
    ...runbook,
    targetLocale: locale
  })

  return {
    title: `${translated.title} | ClawGuru Runbooks`,
    description: runbook.summary || "Runbook-Beschreibung für ClawGuru", // Fallback, da description fehlt
    alternates: { canonical: `/${locale}/runbook/${runbook.slug}` },
    openGraph: {
      title: translated.title,
      description: runbook.summary || "Runbook-Beschreibung für ClawGuru",
      url: `/${locale}/runbook/${runbook.slug}`,
    },
  }
}

export default async function LocaleRunbookPage(props: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { slug, lang } = await props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale

  const runbook = getRunbook(slug)
  if (!runbook) notFound()

  const translated = await translateRunbook({
    ...runbook,
    targetLocale: locale
  })

  return (
    <Container>
      <div className="py-16 max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-black">{translated.title}</h1>
          <p className="mt-4 text-xl text-gray-400">{runbook.summary || "Keine Beschreibung verfügbar"}</p>
        </div>

        {/* Hier kommt der eigentliche Runbook-Inhalt – später erweitern */}
        <div className="mt-12 prose prose-invert max-w-none">
          <p>Runbook-Inhalt für {translated.title} (übersetzt nach {localeDir[locale]}).</p>
          {/* Placeholder – füge später realen Inhalt ein */}
        </div>
      </div>
    </Container>
  )
}