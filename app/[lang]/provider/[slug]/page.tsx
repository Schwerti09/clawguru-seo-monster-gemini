// Localized provider pages: /de/provider/[slug], /en/provider/[slug], etc.
// Delegates to the base provider page so all locales resolve without 404.

// Korrekte relative Imports für app/[lang]/provider/[slug]/page.tsx
import { localeAlternates, SUPPORTED_LOCALES, type Locale } from "../../../../lib/i18n"
import ProviderPage from "../../../../app/provider/[slug]/page"

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const { allProviders } = await import("../../../../lib/pseo")
  return SUPPORTED_LOCALES.flatMap((lang) =>
    allProviders().map((p) => ({ lang, slug: p.slug }))
  )
}

export async function generateMetadata(props: {
  params: { lang: string; slug: string }
}) {
  const { slug, lang } = props.params
  const { allProviders } = await import("../../../../lib/pseo")
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  const p = allProviders().find((x) => x.slug === slug.toLowerCase())
  if (!p) return {}
  const alternates = localeAlternates(`/provider/${encodeURIComponent(slug)}`)

  return {
    title: `${p.name} Runbooks | ClawGuru`,
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  }
}

export default async function LocaleProviderPage(props: {
  params: { lang: string; slug: string }
}) {
  const { slug } = props.params
  return <ProviderPage params={{ slug }} />
}