import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import RootPage, { metadata as rootMetadata } from "@/app/emergency/page"
import { pick } from "@/lib/i18n-pick"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  const title = pick(isDE, "Emergency Security Response — ClawGuru Day Pass", "Emergency Security Response — ClawGuru Day Pass")

  const description = pick(isDE, "Security Incident? Log4j-Check, Ransomware Runbook, Key Rotation, Intrusion Response – alles sofort verfügbar. Day Pass: aktiv in 60 Sekunden, kein Abo-Approval nötig.", "Security incident? Log4j check, ransomware runbook, key rotation, intrusion response – all instantly available. Day Pass: active in 60 seconds, no subscription approval needed.")

  return {
    title,
    description,
    keywords: [
      "log4j quick check",
      "log4j vulnerability check",
      "ransomware runbook download",
      "ransomware incident response",
      "security incident emergency",
      "emergency incident response playbook",
      "cve quick check",
      "it security emergency",
      "security breach response",
      "incident runbook",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "de" ? "de_DE" : "en_US",
      alternateLocale: SUPPORTED_LOCALES.map((l) => (l === "de" ? "de_DE" : "en_US")),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: buildLocalizedAlternates(locale, "/emergency"),
  }
}

export default function LocaleEmergencyPage() {
  return <RootPage />
}
