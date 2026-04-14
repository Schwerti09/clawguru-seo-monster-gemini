import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import OracleClientPage from "@/app/oracle/page"

const SITE_URL = "https://clawguru.org"
const PAGE_TITLE = "The Oracle | ClawGuru AI Security Intelligence"
const PAGE_DESC = "Ask the Mycelium. Get answers from 600+ security runbooks and live CVE data. AI-powered Oracle with RAG search across the entire ClawGuru knowledge graph."

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  return {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    alternates: buildLocalizedAlternates(locale, "/oracle"),
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESC,
      url: `${SITE_URL}/${locale}/oracle`,
      type: "website",
      images: [{ url: `${SITE_URL}/og/oracle.png`, width: 1200, height: 630, alt: "ClawGuru Oracle — AI Security Intelligence" }],
    },
    twitter: {
      card: "summary_large_image",
      title: PAGE_TITLE,
      description: PAGE_DESC,
      images: [`${SITE_URL}/og/oracle.png`],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  }
}

export default function LocaleOraclePage() {
  return <OracleClientPage />
}
