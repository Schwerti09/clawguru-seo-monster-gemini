import type { Metadata } from "next"

import { buildLocalizedAlternates, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
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
  const { lang } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  return {
    alternates: buildLocalizedAlternates(locale, `/provenance/${encodeURIComponent(props.params["runbook-slug"])}`),
  }
}

export default function LocaleProvenanceRunbookPage(
  props: { params: { lang: string; "runbook-slug": string } }
) {
  permanentRedirect(`/provenance/${props.params["runbook-slug"]}`)
}
