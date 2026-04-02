import type { Metadata } from "next"

import { localeAlternates, SUPPORTED_LOCALES } from "@/lib/i18n"
import RootPage from "@/app/tools/check-[service_name]/page"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: { params: { lang: string; service_name: string } }
): Promise<Metadata> {
  const params = props.params
  const alternates = localeAlternates(`/tools/check-${encodeURIComponent(params.service_name)}`)

  return {
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  }
}

export default function LocaleServiceCheckPage(props: { params: { lang: string; service_name: string } }) {
  return <RootPage params={{ service_name: props.params.service_name }} />
}
