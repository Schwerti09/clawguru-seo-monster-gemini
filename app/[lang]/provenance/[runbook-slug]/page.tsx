import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { redirect } from "next/navigation"

export const revalidate = 60
export const dynamic = "force-dynamic"
export const dynamicParams = true

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: { params: { lang: string; "runbook-slug": string } }
): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return {
    alternates: { canonical: `/${locale}/provenance/${params["runbook-slug"]}` },
  }
}

export default function LocaleProvenanceRunbookPage(
  props: { params: { lang: string; "runbook-slug": string } }
) {
  redirect(`/provenance/${props.params["runbook-slug"]}`)
}
