import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { metadata as rootMetadata } from "@/app/universe/page"
import UniverseRootPage from "@/app/universe/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return { ...(rootMetadata as Metadata), alternates: buildLocalizedAlternates(locale, "/universe") }
}

export default function LocaleUniversePage() {
  return <UniverseRootPage />
}
