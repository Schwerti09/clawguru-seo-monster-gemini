import type { Metadata } from "next"

import { buildLocalizedAlternates, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import RootPage from "@/app/year/[year]/page"

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: { params: { lang: string; year: string } }
): Promise<Metadata> {
  const { lang, year } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  return {
    alternates: buildLocalizedAlternates(locale, `/year/${encodeURIComponent(year)}`),
  }
}

export default function LocaleYearHubPage(props: { params: { lang: string; year: string } }) {
  return <RootPage params={{ year: props.params.year }} />
}
