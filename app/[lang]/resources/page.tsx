// Locale resources pages: /de/resources, /en/resources, /es/resources, etc.
// Renders the same resources page with locale-aware dictionary so content is translated.

import { SUPPORTED_LOCALES, localeAlternates, normalizeLocale, getLocaleHrefLang } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"
import ResourcesPage from "@/app/resources/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }) {
  const locale = normalizeLocale(props.params.lang)
  const alternates = localeAlternates("/resources")
  const localeHrefLang = getLocaleHrefLang(locale)
  const canonical = alternates.languages[localeHrefLang] ?? alternates.canonical

  return {
    title: locale === "de" 
      ? "Community Resources | ClawBot & MoltBot Downloads & Tools"
      : "Community Resources | ClawBot & MoltBot Downloads & Tools",
    description: locale === "de"
      ? "Download Center für ClawBot & MoltBot. Agent Templates, Dev Tools, CLI Utilities, Documentation und Community Ressourcen."
      : "Download Center for ClawBot & MoltBot. Agent Templates, Dev Tools, CLI Utilities, Documentation and Community Resources.",
    alternates: {
      canonical,
      languages: alternates.languages,
    },
  }
}

export default async function LocaleResourcesPage(props: { params: { lang: string } }) {
  const locale = normalizeLocale(props.params.lang)
  const dict = await getDictionary(locale)

  return <ResourcesPage dict={dict} locale={locale} />
}
