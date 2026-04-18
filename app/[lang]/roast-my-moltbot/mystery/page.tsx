import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { HelpCircle, Trophy, Clock, Users, Loader2 } from "lucide-react"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/roast-my-moltbot/mystery`
  const isDE = locale === "de"
  const title = isDE ? "Mystery Stack | ClawGuru" : "Mystery Stack | ClawGuru"
  const description = isDE 
    ? "Rate den Stack anhand des Roasts — Täglich neues Rätsel" 
    : "Guess the stack from the roast — Daily puzzle"
  return {
    title,
    description,
    keywords: ["mystery", "guess", "puzzle", "game", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/roast-my-moltbot/mystery"),
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

export default async function MysteryStackPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const stats = await getRoastStatistics()

  // Use real roast data for mystery
  const mystery = stats?.bottomScores?.[0] || null
  const hints = mystery?.weaknesses?.slice(0, 4) || []
  const topPlayers = stats?.topScores?.slice(0, 3).map((entry: any, idx: number) => ({
    name: `Player #${idx + 1}`,
    score: entry.score,
  })) || []

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Mystery Stack" : "Mystery Stack"}
          </h1>
          <p className="text-lg text-gray-300">
            {isDE 
              ? "Rate den Tech-Stack anhand der Roast-Ergebnisse" 
              : "Guess the tech stack from the roast results"}
          </p>
        </div>

        {/* Game Card */}
        {!mystery ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
            <HelpCircle className="w-16 h-16 text-zinc-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-100 mb-2">{isDE ? "Kein Mystery verfügbar" : "No mystery available"}</h2>
            <p className="text-zinc-400">
              {isDE ? "Noch keine Roast-Daten für Mystery verfügbar" : "No roast data available for mystery yet"}
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
            {/* Stats */}
            <div className="flex gap-4 mb-6 text-sm text-zinc-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{isDE ? "Live" : "Live"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{stats?.totalRoasts || 0} {isDE ? "Roasts" : "roasts"}</span>
              </div>
              <div className="flex items-center gap-1">
                <HelpCircle className="w-4 h-4" />
                <span>{mystery.score < 50 ? "Hard" : mystery.score < 80 ? "Medium" : "Easy"}</span>
              </div>
            </div>

            {/* Hints */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">
                {isDE ? "Hinweise" : "Hints"}
              </h2>
              <div className="space-y-3">
                {hints.length > 0 ? hints.map((hint: string, index: number) => (
                  <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-900/50 text-amber-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-300">{hint}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-zinc-500 py-4">
                    {isDE ? "Keine Hinweise verfügbar" : "No hints available"}
                  </div>
                )}
              </div>
            </div>

            {/* Answer Input */}
            <div className="mb-4">
              <label className="text-sm text-zinc-500 block mb-2">
                {isDE ? "Deine Antwort" : "Your answer"}
              </label>
              <input
                type="text"
                placeholder={isDE ? "z.B. Kubernetes + Docker + Postgres" : "e.g. Kubernetes + Docker + Postgres"}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 placeholder-zinc-500"
              />
            </div>

            {/* Submit */}
            <button className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
              {isDE ? "Antworten" : "Submit"}
            </button>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-gray-100">
              {isDE ? "Top Scores" : "Top Scores"}
            </h3>
          </div>
          {!stats || topPlayers.length === 0 ? (
            <div className="text-center text-zinc-500 py-4">
              {isDE ? "Keine Daten verfügbar" : "No data available"}
            </div>
          ) : (
            <div className="space-y-2">
              {topPlayers.map((player: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">
                    #{index + 1} {player.name}
                  </span>
                  <span className="text-zinc-500">Score: {player.score}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mt-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE 
            ? "Dies ist ein Rätselspiel zum Lernen. Keine echten Angriffe." 
            : "This is a puzzle game for learning. No real attacks."}
        </div>
      </div>
    </div>
  )
}
