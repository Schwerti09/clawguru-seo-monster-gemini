import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import NeuroClientPage from "@/app/neuro/page"

const SITE_URL = "https://clawguru.org"
const PAGE_TITLE = "Stack MRI | ClawGuru Predictive Security Cortex"
const PAGE_DESC = "Scan your tech stack for vulnerabilities, CVEs, and security issues. Live threat intelligence with automated runbook recommendations."

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  return {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    alternates: buildLocalizedAlternates(locale, "/neuro"),
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESC,
      url: `${SITE_URL}/${locale}/neuro`,
      type: "website",
      images: [{ url: `${SITE_URL}/og/neuro.png`, width: 1200, height: 630, alt: "ClawGuru Neuro Stack MRI" }],
    },
    twitter: {
      card: "summary_large_image",
      title: PAGE_TITLE,
      description: PAGE_DESC,
      images: [`${SITE_URL}/og/neuro.png`],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  }
}

export default function LocaleNeuroPage() {
  return <NeuroClientPage />
}
