import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import RootPage from "@/app/tools/check-[service_name]/page"

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: { params: { lang: string; service_name: string } }
): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return {
    alternates: { canonical: `/tools/check-:service_name/page` }
  }
}

export default function LocaleServiceCheckPage(props: { params: { lang: string; service_name: string } }) {
  return <RootPage params={{ service_name: props.params.service_name }} />
}
