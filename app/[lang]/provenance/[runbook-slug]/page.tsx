import type { Metadata } from "next"

import { localeAlternates, SUPPORTED_LOCALES } from "@/lib/i18n"
import { permanentRedirect } from "next/navigation"

export const revalidate = 0
export const dynamic = "force-dynamic"
export const dynamicParams = true

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: { params: { lang: string; "runbook-slug": string } }
): Promise<Metadata> {
  const params = props.params
  const alternates = localeAlternates(
    `/provenance/${encodeURIComponent(params["runbook-slug"])}`
  )

  return {
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  }
}

export default function LocaleProvenanceRunbookPage(
  props: { params: { lang: string; "runbook-slug": string } }
) {
  permanentRedirect(`/provenance/${props.params["runbook-slug"]}`)
}
