import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { TrendingUp, Flame, AlertTriangle, Zap, ArrowUpRight, Loader2 } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/trends"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Roast Trends: Was ist heiß | ClawGuru"
    : "Roast Trends: What's Hot | ClawGuru"
  const description = isDE
    ? "Trending Stacks, heiße Vulnerabilities und die schnellsten Score-Sprünge."
    : "Trending stacks, hot vulnerabilities, and fastest score jumps."
  return {
    title,
    description,
    keywords: ["roast trends", "trending stacks", "security trends", "moltbot"],
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

export default async function RoastTrendsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const stats = await getRoastStatistics()

  // Use topScores as trending stacks (anonymized)
  const trendingStacks = stats?.topScores?.slice(0, 4).map((entry: any) => ({
    name: entry.stack_summary,
    score: entry.score,
    change: 0,
    volume: "N/A",
  })) || []

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-900/50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-100">{isDE ? "Roast Trends" : "Roast Trends"}</h1>
              <p className="text-amber-400">
                {stats ? `Live: ${stats.totalRoasts.toLocaleString()} aktive Roasts` : <Loader2 className="w-4 h-4 animate-spin inline" />}
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-300">
            {isDE
              ? "Was gerade heiß läuft: Trending Stacks, neue Vulnerabilities, Score-Sprünge."
              : "What's hot right now: trending stacks, new vulnerabilities, score jumps."}
          </p>
        </div>

        {/* Trending Stacks */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-400" />
            {isDE ? "Top Stacks" : "Top Stacks"}
          </h2>
          {!stats || trendingStacks.length === 0 ? (
            <div className="text-center text-zinc-500 py-8">
              {isDE ? "Keine Daten verfügbar" : "No data available"}
            </div>
          ) : (
            <div className="space-y-3">
              {trendingStacks.map((stack: any) => (
                <div key={stack.name} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-100">{stack.name}</div>
                      <div className="text-sm text-zinc-500">{isDE ? "Anonymisiert" : "Anonymized"}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        stack.score >= 80 ? "text-green-400" : 
                        stack.score >= 50 ? "text-amber-400" : "text-red-400"
                      }`}>
                        {stack.score}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Hot Vulnerabilities */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            {isDE ? "Heiße Vulnerabilities" : "Hot Vulnerabilities"}
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
            <p className="text-zinc-400 text-sm">{isDE ? "CVE-Tracking in Kürze verfügbar" : "CVE tracking coming soon"}</p>
          </div>
        </section>

        {/* Top Score Jumps */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            {isDE ? "Top Scores" : "Top Scores"}
          </h2>
          {!stats || trendingStacks.length === 0 ? (
            <div className="text-center text-zinc-500 py-8">
              {isDE ? "Keine Daten verfügbar" : "No data available"}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {trendingStacks.slice(0, 3).map((stack: any, idx: number) => (
                <div key={stack.name} className="bg-gradient-to-br from-green-900/30 to-gray-800 rounded-xl border border-green-700/50 p-4">
                  <div className="text-sm text-zinc-400 mb-1">#{idx + 1}</div>
                  <div className="text-2xl font-bold text-green-400">{stack.score}</div>
                  <div className="text-xs text-green-300">{isDE ? "Elite Score" : "Elite Score"}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-900/40 to-red-900/40 border border-amber-700/50 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-amber-300 mb-2">
            {isDE ? "Mach mit bei den Trends" : "Join the trends"}
          </h3>
          <p className="text-sm text-amber-200/70 mb-4">
            {isDE ? "Roast deinen Stack und sieh, wo du im Ranking stehst" : "Roast your stack and see where you rank"}
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
