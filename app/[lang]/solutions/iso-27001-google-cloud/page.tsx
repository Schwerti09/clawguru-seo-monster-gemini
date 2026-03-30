import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import RootPage from "@/app/solutions/iso-27001-google-cloud/page"

export const revalidate = 86400

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  return {
    alternates: { canonical: `/solutions/iso-27001-google-cloud/page` }
  }
}

export default function LocaleISO27001GCPPage() {
  return <RootPage />
}
