// Locale runbooks listing pages: /en/runbooks, /es/runbooks, etc.
// Renders the same runbooks listing so locale navigation doesn't 404.

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import RunbooksPage from "@/app/runbooks/page"

export const revalidate = 60 * 60 * 24

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return {
    title: "Runbooks | ClawGuru",
    description:
      "ClawGuru Runbooks: Security, Ops, Incident Response, Setup & Fix guides. Score → Runbook → Fix → Re-Check.",
    alternates: { canonical: `/${locale}/runbooks` },
  }
}

export default function LocaleRunbooksPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return <RunbooksPage locale={locale} />
}
