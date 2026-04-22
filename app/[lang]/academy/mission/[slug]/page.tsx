import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { MissionRunner } from "@/components/academy/MissionRunner"
import { getMission, listMissionSlugs } from "@/lib/academy/missions"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export const revalidate = 3600
export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  // Claude works on Academy - leave disabled
  return []
}

export async function generateMetadata(
  { params }: { params: { lang: string; slug: string } }
): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const mission = getMission(params.slug)
  if (!mission) return { title: "Mission not found | ClawGuru Academy" }

  const title = `${mission.title} — Mission M-001 | ClawGuru Academy ∞`
  const pageUrl = `${SITE_URL}/${locale}/academy/mission/${params.slug}`

  return {
    title,
    description: mission.brief,
    openGraph: { title, description: mission.brief, url: pageUrl, type: "article" },
    alternates: buildLocalizedAlternates(locale, `/academy/mission/${params.slug}`),
    robots: "index, follow",
  }
}

export default function MissionPage({ params }: { params: { lang: string; slug: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const mission = getMission(params.slug)
  if (!mission) notFound()

  return <MissionRunner mission={mission} backHref={`/${locale}/academy`} locale={locale} />
}
