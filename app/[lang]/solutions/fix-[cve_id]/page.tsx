// Localized CVE fix pages: /de/solutions/fix-[cve_id], /en/solutions/fix-[cve_id], etc.
// Delegates to the base CVE fix page so all locales resolve without 404.

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { KNOWN_CVES } from "@/lib/cve-pseo"
import CveFixPage from "@/app/solutions/fix-[cve_id]/page"

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((lang) =>
    KNOWN_CVES.map((c) => ({ lang, cve_id: c.cveId }))
  )
}

export async function generateMetadata(props: {
  params: { lang: string; cve_id: string }
}) {
  const { cve_id, lang } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  return {
    title: `How to fix ${decodeURIComponent(cve_id)} | ClawGuru`,
    alternates: { canonical: `/solutions/fix-:cve_id/page` }
  }
}

export default async function LocaleCveFixPage(props: {
  params: { lang: string; cve_id: string }
}) {
  const { cve_id } = props.params
  return <CveFixPage params={{ cve_id }} />
}
