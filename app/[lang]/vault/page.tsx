import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { BASE_URL } from "@/lib/config"
import RootPage from "@/app/vault/page"
import { pick } from "@/lib/i18n-pick"

export const revalidate = 3600

const PATH = "/vault"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${BASE_URL}/${locale}${PATH}`

  const isDE = locale === "de"
  const title = pick(isDE, "ClawGuru Vault – Secrets Management & Security Scoring 2026", "ClawGuru Vault – Secrets Management & Security Scoring 2026")
  const description = pick(isDE, "Zentrales Secrets Management, automatische Key Rotation und Echtzeit-Security-Scoring für Self-Hosted-Infrastrukturen. DSGVO-konform, Zero-Knowledge, kein Cloud-Lock-in.", "Central secrets management, automatic key rotation and real-time security scoring for self-hosted infrastructure. GDPR-compliant, zero-knowledge, no cloud lock-in.")

  return {
    title,
    description,
    keywords: [
      "Secrets Management",
      "Key Rotation",
      "Security Vault",
      "HashiCorp Vault",
      "Self-Hosted Security",
      "DSGVO Compliance",
      "ClawGuru Vault",
      "Security Score",
      "Firewall Baseline",
    ],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      images: ["/og-image.png"],
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function LocaleVaultPage(props: { params: { lang: string } }) {
  const locale = props.params.lang as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  return <RootPage />
}
