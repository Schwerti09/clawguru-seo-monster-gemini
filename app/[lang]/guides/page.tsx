// Locale guides pages: /de/guides, /en/guides, /es/guides, etc.
// Renders the same guides page with locale-aware dictionary so content is translated.

import { SUPPORTED_LOCALES, buildLocalizedAlternates, normalizeLocale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"
import GuidesPage from "@/app/guides/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }) {
  const locale = normalizeLocale(props.params.lang)
  return {
    title: locale === "de" 
      ? "Integration Guides | ClawBot & MoltBot Setup Anleitungen"
      : "Integration Guides | ClawBot & MoltBot Setup Instructions",
    description: locale === "de"
      ? "Schritt-für-Schritt Integration Guides für ClawBot & MoltBot. Kubernetes, AWS, Docker, CI/CD und mehr. Komplette Setup Anleitungen."
      : "Step-by-step Integration Guides for ClawBot & MoltBot. Kubernetes, AWS, Docker, CI/CD and more. Complete setup instructions.",
    alternates: buildLocalizedAlternates(locale, "/guides"),
  }
}

export default async function LocaleGuidesPage(props: { params: { lang: string } }) {
  const locale = normalizeLocale(props.params.lang)
  const dict = await getDictionary(locale)

  return <GuidesPage dict={dict} locale={locale} />
}
