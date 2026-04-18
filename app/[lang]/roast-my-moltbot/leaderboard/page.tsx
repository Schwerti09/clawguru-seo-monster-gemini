import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Trophy, Medal, Crown, TrendingUp, Flame, Loader2 } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/leaderboard"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE ? "Roast Leaderboard | ClawGuru" : "Roast Leaderboard | ClawGuru"
  const description = isDE
    ? "Die Top-Performer der Roast-Community. Wer hat den höchsten Score?"
    : "Top performers in the roast community. Who has the highest score?"
  return {
    title,
    description,
    keywords: ["roast leaderboard", "top scores", "security ranking", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

async function getRoastStatistics() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
    const response = await fetch(`${baseUrl}/api/roast-statistics`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })
    if (!response.ok) {
      return null
    }
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch roast statistics:", error)
    return null
  }
}

export default async function LeaderboardPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const stats = await getRoastStatistics()

  // Use topScores as leaderboard (anonymized)
  const topUsers = stats?.topScores?.slice(0, 10).map((entry: any, idx: number) => ({
    rank: idx + 1,
    name: `Stack #${idx + 1}`,
    score: entry.score,
    industry: "Anonymized",
    streak: "-",
    avatar: idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "🔒",
  })) || []

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/40 border border-amber-700/50 rounded-full text-sm mb-4">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200">
              {stats ? `🏆 ${stats.totalRoasts.toLocaleString()} Teilnehmer weltweit` : <Loader2 className="w-4 h-4 animate-spin inline" />}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-2">{isDE ? "Roast Leaderboard" : "Roast Leaderboard"}</h1>
          <p className="text-lg text-gray-300">
            {isDE ? "Die Elite der Security-Community. Wer rostet am besten?" : "The elite of the security community. Who roasts best?"}
          </p>
        </div>

        {/* Top 3 Podium */}
        {!stats || topUsers.length === 0 ? (
          <div className="text-center text-zinc-500 py-8 mb-10">
            {isDE ? "Keine Daten verfügbar" : "No data available"}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {topUsers.slice(0, 3).map((user: any, idx: number) => {
              const sizes = ["scale-100", "scale-110", "scale-100"]
              const orders = [2, 1, 3]
              const medals = ["bg-gray-400", "bg-amber-400", "bg-orange-400"]
              
              return (
                <div 
                  key={user.name}
                  className={`${sizes[idx]} ${orders[idx] === 1 ? "md:-mt-4" : ""} bg-gray-800 rounded-xl border border-gray-700 p-6 text-center relative`}
                >
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 ${medals[idx]} rounded-full flex items-center justify-center font-bold text-gray-900`}>
                    {user.rank}
                  </div>
                  <div className="text-4xl mb-2">{user.avatar}</div>
                  <div className="font-semibold text-gray-100">{user.name}</div>
                  <div className="text-3xl font-bold text-amber-400 my-2">{user.score}</div>
                  <div className="text-sm text-zinc-500">{user.industry}</div>
                </div>
              )
            })}
          </div>
        )}

        {/* Full Leaderboard */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            {isDE ? "Top 10" : "Top 10"}
          </h2>
          {!stats || topUsers.length === 0 ? (
            <div className="text-center text-zinc-500 py-8">
              {isDE ? "Keine Daten verfügbar" : "No data available"}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              {topUsers.map((user: any) => (
                <div 
                  key={user.name} 
                  className="flex items-center gap-4 p-4 border-b border-gray-700/50 last:border-0 hover:bg-gray-700/30 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center font-bold text-sm text-gray-300">
                    {user.rank}
                  </div>
                  <div className="text-2xl">{user.avatar}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-100">{user.name}</div>
                    <div className="text-sm text-zinc-500">{user.industry}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${
                      user.score >= 90 ? "text-amber-400" :
                      user.score >= 80 ? "text-green-400" : "text-cyan-400"
                    }`}>
                      {user.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Rising Stars */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            {isDE ? "Rising Stars" : "Rising Stars"}
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
            <p className="text-zinc-400 text-sm">{isDE ? "Rising Stars Tracking in Kürze verfügbar" : "Rising Stars tracking coming soon"}</p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-900/40 to-red-900/40 border border-amber-700/50 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-amber-300 mb-2">
            {isDE ? "Schaffst du es in die Top 10?" : "Can you make it to the Top 10?"}
          </h3>
          <p className="text-sm text-amber-200/70 mb-4">
            {isDE ? "Roste deinen Stack und zeig, was du kannst" : "Roast your stack and show what you've got"}
          </p>
          <Link 
            href={`/${locale}/roast-my-moltbot`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg font-semibold text-white transition-colors"
          >
            <Flame className="w-5 h-5" />
            {isDE ? "Jetzt rosten" : "Roast now"}
          </Link>
        </div>
      </div>
    </div>
  )
}
