import type { Metadata } from "next"

import { buildLocalizedAlternates, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import RootPage from "@/app/fix/[slug]/page"

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: { params: { lang: string; slug: string } }
): Promise<Metadata> {
  const { lang, slug } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  return {
    alternates: buildLocalizedAlternates(locale, `/fix/${encodeURIComponent(slug)}`),
  }
}

export default function LocaleFixPage(props: { params: { lang: string; slug: string } }) {
  return <RootPage params={{ slug: props.params.slug }} />
}
