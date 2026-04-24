import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { TRACKS, getHubContent } from "@/lib/academy/hubContent"
import { TrackShowcase } from "@/components/academy/TrackShowcase"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const TRACK_SLUG = "advanced"

export const revalidate = 3600
export const dynamic = "force-static"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const copy = getHubContent(locale).tracks[TRACK_SLUG]
  const pageUrl = `${SITE_URL}/${locale}/academy/${TRACK_SLUG}`
  const title = `${copy?.title ?? "AI Agent Security"} — Academy ∞ | ClawGuru`
  return {
    title,
    description: copy?.tagline,
    openGraph: { title, description: copy?.tagline, url: pageUrl, type: "website" },
    alternates: buildLocalizedAlternates(locale, `/academy/${TRACK_SLUG}`),
    robots: "index, follow",
  }
}

export default function AIAgentSecurityTrackPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const track = TRACKS.find((t) => t.slug === TRACK_SLUG)
  if (!track) notFound()

  return <TrackShowcase locale={locale} track={track} showWaitlist />
}
