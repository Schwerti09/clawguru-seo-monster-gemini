import type { Metadata } from "next"

import { buildLocalizedAlternates, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import RootPage from "@/app/swarm/[deployment-id]/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: { params: { lang: string; "deployment-id": string } }
): Promise<Metadata> {
  const { lang } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  return {
    alternates: buildLocalizedAlternates(locale, `/swarm/${encodeURIComponent(props.params["deployment-id"])}`),
  }
}

export default function LocaleSwarmDeploymentPage(props: {
  params: { lang: string; "deployment-id": string }
  searchParams: { runbook?: string; target?: string; mode?: string; scope?: string }
}) {
  return (
    <RootPage
      params={{ "deployment-id": props.params["deployment-id"] }}
      searchParams={props.searchParams}
    />
  )
}
