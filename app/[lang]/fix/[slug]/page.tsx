import type { Metadata } from "next"

import { localeAlternates, SUPPORTED_LOCALES } from "@/lib/i18n"
import RootPage from "@/app/fix/[slug]/page"

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: { params: { lang: string; slug: string } }
): Promise<Metadata> {
  const params = props.params
  const alternates = localeAlternates(`/fix/${encodeURIComponent(params.slug)}`)

  return {
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  }
}

export default function LocaleFixPage(props: { params: { lang: string; slug: string } }) {
  return <RootPage params={{ slug: props.params.slug }} />
}
