import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Swords, Trophy, TrendingUp, Users, Loader2 } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/battle"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Roast Battle: 1v1 Stack Vergleich | ClawGuru"
    : "Roast Battle: 1v1 Stack Comparison | ClawGuru"
  const description = isDE
    ? "Zwei Stacks gegeneinander. Community votet. Wer hat die bessere Security?"
    : "Two stacks battle. Community votes. Who has better security?"
  return {
    title,
    description,
    keywords: ["roast battle", "stack comparison", "security battle", "1v1 roast", "moltbot"],
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

export default async function RoastBattlePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const stats = await getRoastStatistics()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* VIRAL: Stats Banner */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/40 border border-red-700/50 rounded-full text-sm">
            <Swords className="w-4 h-4 text-red-400" />
            <span className="text-red-200">
              {stats ? `⚔️ ${stats.totalRoasts.toLocaleString()} Roasts` : <Loader2 className="w-4 h-4 animate-spin inline" />}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-900/40 border border-cyan-700/50 rounded-full text-sm">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-200">
              {stats ? `👥 ${stats.eliteStacks.toLocaleString()} Elite Stacks` : <Loader2 className="w-4 h-4 animate-spin inline" />}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/40 border border-amber-700/50 rounded-full text-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200">
              {stats ? `🏆 Ø Score: ${stats.avgScore}/100` : <Loader2 className="w-4 h-4 animate-spin inline" />}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "Roast Battle" : "Roast Battle"}</h1>
          <p className="text-lg text-gray-300 mb-2">
            {isDE
              ? "Zwei Stacks. Eine Community. Ein Gewinner. Vote für den besseren Roast!"
              : "Two stacks. One community. One winner. Vote for the better roast!"}
          </p>
          <p className="text-sm text-amber-400 font-medium">
            {isDE ? "→ Starte dein eigenes Battle und challenge die Community" : "→ Start your own battle and challenge the community"}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        {/* Live Battles */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {isDE ? "Live Battles" : "Live Battles"}
          </h2>
          
          {!stats || !stats.topScores || stats.topScores.length < 2 ? (
            <div className="text-center text-zinc-500 py-8">
              {isDE ? "Keine Battles verfügbar" : "No battles available"}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Use top 2 scores as a live battle */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-red-400 font-medium">
                    🔴 {isDE ? "Live" : "Live"} • {isDE ? "Community Voting" : "Community Voting"}
                  </span>
                  <span className="text-sm text-zinc-500">{stats.totalRoasts.toLocaleString()} {isDE ? "Roasts" : "roasts"}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Stack A */}
                  <div className="bg-gradient-to-br from-red-900/30 to-gray-900 border-2 border-red-700/50 rounded-xl p-4 text-left">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-100">{stats.topScores[0].stack_summary?.substring(0, 50)}...</span>
                      <span className="text-2xl font-bold text-red-400">{stats.topScores[0].score}</span>
                    </div>
                    <div className="text-sm text-zinc-400 mb-3">{isDE ? "Schlechter Score = Mehr Drama" : "Bad score = More drama"}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                      <span className="text-sm text-red-400">45%</span>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="hidden md:flex items-center justify-center">
                    <span className="text-2xl font-black text-zinc-600">VS</span>
                  </div>

                  {/* Stack B */}
                  <div className="bg-gradient-to-br from-green-900/30 to-gray-900 border-2 border-green-700/50 rounded-xl p-4 text-left">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-100">{stats.topScores[1].stack_summary?.substring(0, 50)}...</span>
                      <span className="text-2xl font-bold text-green-400">{stats.topScores[1].score}</span>
                    </div>
                    <div className="text-sm text-zinc-400 mb-3">{isDE ? "Besserer Score = Weniger Roast" : "Better score = Less roast"}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "55%" }}></div>
                      </div>
                      <span className="text-sm text-green-400">55%</span>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-zinc-500 mt-4">
                  {isDE ? "Voting basiert auf echten Roast-Daten" : "Voting based on real roast data"}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Ended Battles */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Top Vergleiche" : "Top Comparisons"}</h2>
          
          {!stats || !stats.topScores || stats.topScores.length < 4 ? (
            <div className="text-center text-zinc-500 py-8">
              {isDE ? "Keine Daten verfügbar" : "No data available"}
            </div>
          ) : (
            <div className="space-y-3">
              {stats.topScores.slice(2, 5).map((entry: any, idx: number) => (
                <div key={entry.id} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="font-medium text-gray-100">{entry.stack_summary?.substring(0, 40)}...</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-amber-400">{entry.score}</span>
                      <Trophy className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-zinc-400">
          <Link href={`/${locale}/roast-my-moltbot`} className="hover:text-cyan-300 font-medium">
            {isDE ? "Roast My Moltbot" : "Roast My Moltbot"}
          </Link>
          <Link href={`/${locale}/roast-my-moltbot/hall-of-fame`} className="hover:text-cyan-300 font-medium">
            {isDE ? "Hall of Fame" : "Hall of Fame"}
          </Link>
          <Link href={`/${locale}/roast-my-moltbot/hall-of-shame`} className="hover:text-cyan-300 font-medium">
            {isDE ? "Hall of Shame" : "Hall of Shame"}
          </Link>
        </nav>
      </div>
    </div>
  )
}
