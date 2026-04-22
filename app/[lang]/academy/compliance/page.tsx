import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { TrackComingSoon } from "@/components/academy/TrackComingSoon"
import { getHubContent } from "@/lib/academy/hubContent"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const SLUG = "compliance"

export const revalidate = 3600
export const dynamic = "force-static"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const copy = getHubContent(locale).tracks[SLUG]
  const pageUrl = `${SITE_URL}/${locale}/academy/${SLUG}`
  const title = `${copy?.title ?? "Compliance"} — Academy ∞ | ClawGuru`
  return {
    title,
    description: copy?.tagline,
    openGraph: { title, description: copy?.tagline, url: pageUrl, type: "website" },
    alternates: buildLocalizedAlternates(locale, `/academy/${SLUG}`),
    robots: "index, follow",
  }
}

export default function ComplianceTrackPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return <TrackComingSoon locale={locale} slug={SLUG} />
}
