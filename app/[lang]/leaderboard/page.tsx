import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import RootPage, { metadata as rootMetadata } from "@/app/leaderboard/page"

export const revalidate = 60
// Root leaderboard renders live DB + uses headers(); can't prerender.
export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return { ...(rootMetadata as Metadata), alternates: buildLocalizedAlternates(locale, "/leaderboard") }
}

export default function LocaleLeaderboardPage() {
  return <RootPage />
}
