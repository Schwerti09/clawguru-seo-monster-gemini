// Localized solutions index: /de/solutions, /en/solutions, etc.
// Delegates to the base solutions page so all locales resolve without 404.

import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import SolutionsPage from "@/app/solutions/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: {
  params: { lang: string }
}) {
  const { lang } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  return {
    title: "CVE Fix Solutions | ClawGuru",
    alternates: buildLocalizedAlternates(locale, "/solutions")
  }
}

export default function LocaleSolutionsPage() {
  return <SolutionsPage />
}
