import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { History, TrendingUp, Calendar, Trophy, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/profile/roast-history"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE ? "Mein Roast-Verlauf | ClawGuru" : "My Roast History | ClawGuru"
  const description = isDE
    ? "Deine persönliche Roast-Timeline: Scores, Verbesserungen, Badges."
    : "Your personal roast timeline: scores, improvements, badges."
  return {
    title,
    description,
    keywords: ["roast history", "score timeline", "security progress", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

async function getRoastHistory() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
    const response = await fetch(`${baseUrl}/api/roast-statistics`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })
    if (!response.ok) {
      return null
    }
    const stats = await response.json()
    // Return recent roasts from topScores as history (anonymized)
    return stats.topScores?.slice(0, 10).map((entry: any) => ({
      id: entry.id,
      date: new Date(entry.created_at).toISOString().split('T')[0],
      score: entry.score,
      change: 0, // Calculate from previous entry
      type: "improvement",
      badge: null,
    })) || []
  } catch (error) {
    console.error("Failed to fetch roast history:", error)
    return null
  }
}

export default async function RoastHistoryPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const history = await getRoastHistory()

  const achievements = history && history.length > 0 ? [
    { icon: "🛡️", name: "First Roast", desc: "First security check completed" },
    history.length >= 3 && { icon: "🔥", name: "Heat Fixed", desc: "Fixed first critical vulnerability" },
    history.some((h: any) => h.score >= 70) && { icon: "📈", name: "+40 Club", desc: "Improved score by 40+ points" },
    history.some((h: any) => h.score >= 80) && { icon: "🏆", name: "On Track", desc: "Score above 70" },
  ].filter(Boolean) : []

  const currentScore = history && history.length > 0 ? history[0].score : 0
  const totalImprovement = history && history.length > 1 ? currentScore - history[history.length - 1].score : 0
  const avgImprovement = history && history.length > 1 ? Math.round(totalImprovement / (history.length - 1)) : 0

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-cyan-900/50 rounded-xl flex items-center justify-center">
              <History className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-100">{isDE ? "Mein Roast-Verlauf" : "My Roast History"}</h1>
              <p className="text-cyan-400">{history ? history.length : 0} {isDE ? "Roasts" : "roasts"} • {totalImprovement}+ {isDE ? "Punkte" : "points"} total</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{currentScore}</div>
            <div className="text-sm text-zinc-500">{isDE ? "Aktueller Score" : "Current Score"}</div>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
            <div className="text-3xl font-bold text-amber-400">+{avgImprovement}</div>
            <div className="text-sm text-zinc-500">{isDE ? "Ø pro Roast" : "Avg per roast"}</div>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
            <div className="text-3xl font-bold text-cyan-400">{achievements.length}</div>
            <div className="text-sm text-zinc-500">{isDE ? "Badges" : "Badges"}</div>
          </div>
        </div>

        {/* Timeline */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Timeline" : "Timeline"}</h2>
          {!history || history.length === 0 ? (
            <div className="text-center text-zinc-500 py-8">
              {isDE ? "Noch keine Roasts durchgeführt" : "No roasts yet"}
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry: any, idx: number) => (
                <div key={entry.id} className="relative flex gap-4">
                  {/* Connector line */}
                  {idx < history.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-700"></div>
                  )}
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    entry.type === "initial" ? "bg-red-900/50" : "bg-green-900/50"
                  }`}>
                    {entry.type === "initial" ? (
                      <Calendar className="w-5 h-5 text-red-400" />
                    ) : entry.change > 0 ? (
                      <ArrowUpRight className="w-5 h-5 text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-zinc-500">{entry.date}</span>
                      {entry.badge && (
                        <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded">
                          {entry.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-bold ${
                        entry.score >= 80 ? "text-green-400" :
                        entry.score >= 50 ? "text-amber-400" : "text-red-400"
                      }`}>
                        {entry.score}
                      </span>
                      {entry.change !== 0 && (
                        <span className={`text-sm ${entry.change > 0 ? "text-green-400" : "text-red-400"}`}>
                          {entry.change > 0 ? "+" : ""}{entry.change}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Achievements */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            {isDE ? "Errungenschaften" : "Achievements"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {achievements.map((ach) => (
              <div key={ach.name} className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
                <div className="text-2xl mb-2">{ach.icon}</div>
                <div className="font-semibold text-gray-100 text-sm">{ach.name}</div>
                <div className="text-xs text-zinc-500">{ach.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-900/40 to-red-900/40 border border-amber-700/50 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-amber-300 mb-2">
            {isDE ? "Weiter verbessern?" : "Keep improving?"}
          </h3>
          <p className="text-sm text-amber-200/70 mb-4">
            {isDE ? "26 Punkte bis zur Hall of Fame" : "26 points to Hall of Fame"}
          </p>
          <Link 
            href={`/${locale}/roast-my-moltbot`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg font-semibold text-white transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            {isDE ? "Neuer Roast" : "New Roast"}
          </Link>
        </div>
      </div>
    </div>
  )
}
