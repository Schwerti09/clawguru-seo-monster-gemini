import type { Metadata } from "next"

import { localeAlternates, SUPPORTED_LOCALES } from "@/lib/i18n"
import RootPage from "@/app/swarm/[deployment-id]/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: { params: { lang: string; "deployment-id": string } }
): Promise<Metadata> {
  const params = props.params
  const alternates = localeAlternates(`/swarm/${encodeURIComponent(params["deployment-id"])}`)

  return {
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
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
