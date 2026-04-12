import type { Metadata } from "next"

import { buildLocalizedAlternates, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import RootPage from "@/app/tools/check-[service_name]/page"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: { params: { lang: string; service_name: string } }
): Promise<Metadata> {
  const { lang, service_name } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  return {
    alternates: buildLocalizedAlternates(locale, `/tools/check-${encodeURIComponent(service_name)}`),
  }
}

export default function LocaleServiceCheckPage(props: { params: { lang: string; service_name: string } }) {
  return <RootPage params={{ service_name: props.params.service_name }} />
}
