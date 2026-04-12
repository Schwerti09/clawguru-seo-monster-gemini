import type { Metadata } from "next"

import { buildLocalizedAlternates, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import RootPage from "@/app/service/[slug]/page"

export const revalidate = 60
export const dynamicParams = true
export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: { params: { lang: string; slug: string } }
): Promise<Metadata> {
  const { lang, slug } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  return {
    alternates: buildLocalizedAlternates(locale, `/service/${encodeURIComponent(slug)}`),
  }
}

export default function LocaleServiceHubPage(props: { params: { lang: string; slug: string } }) {
  return <RootPage params={{ slug: props.params.slug }} locale={props.params.lang as Locale} />
}
