import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Users, Crown, TrendingUp, Target, Zap, Loader2 } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/team"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE ? "Team Roast Challenge | ClawGuru" : "Team Roast Challenge | ClawGuru"
  const description = isDE
    ? "Roste als Team. Challenge deine Kollegen. Wer hat den sichersten Stack?"
    : "Roast as a team. Challenge your colleagues. Who has the most secure stack?"
  return {
    title,
    description,
    keywords: ["team roast", "multiplayer", "security challenge", "moltbot"],
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

export default async function TeamRoastPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const stats = await getRoastStatistics()

  // Use topScores as teams (anonymized)
  const teams = stats?.topScores?.slice(0, 4).map((entry: any, idx: number) => ({
    name: `Team #${idx + 1}`,
    members: "-",
    avgScore: entry.score,
    totalImprovement: "-",
    rank: idx + 1,
  })) || []

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-900/40 border border-cyan-700/50 rounded-full text-sm mb-4">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-200">
              {stats ? `👥 ${stats.totalRoasts.toLocaleString()} Roasts` : <Loader2 className="w-4 h-4 animate-spin inline" />}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-2">{isDE ? "Team Roast" : "Team Roast"}</h1>
          <p className="text-lg text-gray-300">
            {isDE ? "Gemeinsam rosten, gemeinsam wachsen. Challenge dein Team!" : "Roast together, grow together. Challenge your team!"}
          </p>
        </div>

        {/* How it Works */}
        <section className="mb-10">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
              <div className="w-12 h-12 bg-cyan-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-1">{isDE ? "1. Team bilden" : "1. Form Team"}</h3>
              <p className="text-sm text-zinc-500">{isDE ? "Lade Kollegen ein, erstelle ein Team" : "Invite colleagues, create a team"}</p>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
              <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-1">{isDE ? "2. Roaste" : "2. Roast"}</h3>
              <p className="text-sm text-zinc-500">{isDE ? "Jeder rostet seinen Stack" : "Everyone roasts their stack"}</p>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-1">{isDE ? "3. Gewinne" : "3. Win"}</h3>
              <p className="text-sm text-zinc-500">{isDE ? "Sammle Punkte, steige auf" : "Collect points, climb up"}</p>
            </div>
          </div>
        </section>

        {/* Active Teams */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            {isDE ? "Top Stacks" : "Top Stacks"}
          </h2>
          {!stats || teams.length === 0 ? (
            <div className="text-center text-zinc-500 py-8">
              {isDE ? "Keine Daten verfügbar" : "No data available"}
            </div>
          ) : (
            <div className="space-y-3">
              {teams.map((team: any) => (
                <div key={team.name} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-amber-400">
                        #{team.rank}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-100">{team.name}</div>
                        <div className="text-sm text-zinc-500">{isDE ? "Anonymisiert" : "Anonymized"}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">{team.avgScore}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Challenges */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-400" />
            {isDE ? "Aktive Challenges" : "Active Challenges"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-amber-900/30 to-gray-800 rounded-xl border border-amber-700/50 p-4">
              <div className="font-semibold text-amber-300 mb-1">{isDE ? "Elite Score" : "Elite Score"}</div>
              <p className="text-sm text-zinc-400 mb-3">{isDE ? "Erreiche 90+ Punkte" : "Reach 90+ points"}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-amber-400">🏆 Badge</span>
                <span className="text-zinc-500">{stats?.eliteStacks || 0}</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-gray-800 rounded-xl border border-green-700/50 p-4">
              <div className="font-semibold text-green-300 mb-1">{isDE ? "Verbesserung" : "Improvement"}</div>
              <p className="text-sm text-zinc-400 mb-3">{isDE ? "+20 Punkte in einer Woche" : "+20 points in a week"}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-400">🔥 Badge</span>
                <span className="text-zinc-500">{stats?.totalRoasts || 0}</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-900/30 to-gray-800 rounded-xl border border-cyan-700/50 p-4">
              <div className="font-semibold text-cyan-300 mb-1">{isDE ? "Hall of Fame" : "Hall of Fame"}</div>
              <p className="text-sm text-zinc-400 mb-3">{isDE ? "Top 10 erreichen" : "Reach Top 10"}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-cyan-400">👑 Badge</span>
                <span className="text-zinc-500">{stats?.topScores?.length || 0}</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-cyan-300 mb-2">
            {isDE ? "Starte deinen Roast" : "Start your roast"}
          </h3>
          <p className="text-sm text-cyan-200/70 mb-4">
            {isDE ? "Kostenlos. Sofort verfügbar." : "Free. Available now."}
          </p>
          <Link
            href={`/${locale}/roast-my-moltbot`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors"
          >
            <Users className="w-5 h-5" />
            {isDE ? "Jetzt rosten" : "Roast now"}
          </Link>
        </div>
      </div>
    </div>
  )
}
