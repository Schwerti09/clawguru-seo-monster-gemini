import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import RootPage from "@/app/tags/page"

export const dynamic = "force-static"
export const revalidate = 3600
export const dynamicParams = false
export const runtime = "nodejs"
export const maxDuration = 180

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return {
    alternates: { canonical: `/${locale}/tags` },
  }
}

export default function LocaleTagsPage() {
  return <RootPage />
}
