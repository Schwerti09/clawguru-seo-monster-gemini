import type { Metadata } from "next"

import { localeAlternates, SUPPORTED_LOCALES } from "@/lib/i18n"
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
  const alternates = localeAlternates(`/year/${encodeURIComponent(params.year)}`)

  return {
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  }
}

export default function LocaleYearHubPage(props: { params: { lang: string; year: string } }) {
  return <RootPage params={{ year: props.params.year }} />
}
