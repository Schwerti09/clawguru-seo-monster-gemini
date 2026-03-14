// Locale runbooks listing pages: /en/runbooks, /es/runbooks, etc.
// Renders the same runbooks listing so locale navigation doesn't 404.

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import RunbooksPageContent from "@/components/pages/RunbooksPageContent"
import { getDictionary } from "@/lib/getDictionary"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }) {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return {
    title: "Runbooks | ClawGuru",
    description:
      "ClawGuru Runbooks: Security, Ops, Incident Response, Setup & Fix guides. Score → Runbook → Fix → Re-Check.",
    alternates: { canonical: `/${locale}/runbooks` },
  }
}

export default async function LocaleRunbooksPage(props: { params: { lang: string } }) {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const dict = await getDictionary(locale)
  return <RunbooksPageContent locale={locale} subtitle={dict.runbooks.subtitle} />
}
