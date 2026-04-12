import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import PerfectionRootPage from "@/app/perfection/page"

export const revalidate = 3600

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  return {
    alternates: buildLocalizedAlternates(locale, "/perfection"),
    robots: "noindex, nofollow",
  }
}

export default function LocalePerfectionPage() {
  return <PerfectionRootPage />
}
