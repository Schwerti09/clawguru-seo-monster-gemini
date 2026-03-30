import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import DashboardRootPage from "@/app/dashboard/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return {
    alternates: { canonical: `/dashboard/page` }
  }
}

export default function LocaleDashboardPage() {
  return <DashboardRootPage />
}
