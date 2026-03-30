import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import RootPage from "@/app/year/[year]/page"

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: { params: { lang: string; year: string } }
): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return {
    alternates: { canonical: `/year/:year/page` }
  }
}

export default function LocaleYearHubPage(props: { params: { lang: string; year: string } }) {
  return <RootPage params={{ year: props.params.year }} />
}
