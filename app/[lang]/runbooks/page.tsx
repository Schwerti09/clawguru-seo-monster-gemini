// Locale runbooks listing pages: /en/runbooks, /es/runbooks, etc.
// Renders the same runbooks listing so locale navigation doesn't 404.

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import RunbooksPageContent from "@/components/pages/RunbooksPageContent"

export const revalidate = 86400

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return {
    title: "Runbooks | ClawGuru",
    description:
      "ClawGuru Runbooks: Security, Ops, Incident Response, Setup & Fix guides. Score → Runbook → Fix → Re-Check.",
    alternates: { canonical: `/${locale}/runbooks` },
  }
}

export default async function LocaleRunbooksPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return <RunbooksPageContent locale={locale} />
}
