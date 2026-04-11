import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import RootPage from "@/app/downloads/page"

export const revalidate = 60

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/downloads`
  const title = "Premium Security Downloads 2026 | ClawGuru"
  const description =
    "4 exklusive Mega-Premium Downloads: OpenClaw Fortress Blueprint, Zero-Trust Arsenal, AI Threat Intelligence Kit & IR Warfare Manual. Gratis für Self-Hoster."

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      images: ["/og-image.png"],
    },
    alternates: buildLocalizedAlternates(locale, "/downloads"),
    robots: "index, follow",
  }
}

export default function LocaleDownloadsPage() {
  return <RootPage />
}
