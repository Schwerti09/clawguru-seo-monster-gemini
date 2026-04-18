import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { dbQuery } from "@/lib/db"
import { BarChart3, TrendingUp, Shield, Clock, Globe } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-statistics"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Roast Statistics — Data Insights aus echten Roasts | ClawGuru"
    : "Roast Statistics — Data Insights from Real Roasts | ClawGuru"
  const description = isDE
    ? "Daten-basierte Security-Insights aus echten Roast-Results. Durchschnitts-Score, Trends, Top-Stacks. Keine Mock-Daten."
    : "Data-driven security insights from real roast results. Average score, trends, top stacks. No mock data."
  return {
    title,
    description,
    keywords: ["roast statistics", "data insights", "security metrics", "roast trends", "security analytics"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

async function getRoastStatistics() {
  try {
    // Total roasts
    const totalResult = await dbQuery(`SELECT COUNT(*) as count FROM roast_results`)
    const totalRoasts = parseInt(totalResult.rows[0]?.count || "0")

    // Average score
    const avgResult = await dbQuery(`SELECT AVG(score) as avg_score FROM roast_results`)
    const avgScore = parseFloat(avgResult.rows[0]?.avg_score || "0")

    // Elite stacks (score >= 90)
    const eliteResult = await dbQuery(`SELECT COUNT(*) as count FROM roast_results WHERE score >= 90`)
    const eliteStacks = parseInt(eliteResult.rows[0]?.count || "0")

    // Roasts today
    const todayResult = await dbQuery(`SELECT COUNT(*) as count FROM roast_results WHERE DATE(created_at) = CURRENT_DATE`)
    const roastsToday = parseInt(todayResult.rows[0]?.count || "0")

    // Roasts this week
    const weekResult = await dbQuery(`SELECT COUNT(*) as count FROM roast_results WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'`)
    const roastsThisWeek = parseInt(weekResult.rows[0]?.count || "0")

    // Roasts this month
    const monthResult = await dbQuery(`SELECT COUNT(*) as count FROM roast_results WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)`)
    const roastsThisMonth = parseInt(monthResult.rows[0]?.count || "0")

    // Score distribution
    const scoreDistResult = await dbQuery(`
      SELECT 
        CASE 
          WHEN score >= 90 THEN 'elite'
          WHEN score >= 70 THEN 'good'
          WHEN score >= 50 THEN 'average'
          ELSE 'poor'
        END as category,
        COUNT(*) as count
      FROM roast_results
      GROUP BY category
      ORDER BY category DESC
    `)

    const scoreDistribution = scoreDistResult.rows.reduce((acc: any, row: any) => {
      acc[row.category] = parseInt(row.count)
      return acc
    }, { elite: 0, good: 0, average: 0, poor: 0 })

    // Top stacks by score
    const topStacksResult = await dbQuery(`
      SELECT stack_summary, score, created_at
      FROM roast_results
      ORDER BY score DESC, created_at DESC
      LIMIT 10
    `)

    // Locale distribution
    const localeDistResult = await dbQuery(`
      SELECT locale, COUNT(*) as count
      FROM roast_results
      GROUP BY locale
      ORDER BY count DESC
    `)

    const localeDistribution = localeDistResult.rows.map((row: any) => ({
      locale: row.locale,
      count: parseInt(row.count),
    }))

    return {
      totalRoasts,
      avgScore,
      eliteStacks,
      roastsToday,
      roastsThisWeek,
      roastsThisMonth,
      scoreDistribution,
      topStacks: topStacksResult.rows,
      localeDistribution,
    }
  } catch (error) {
    console.error("Error fetching roast statistics:", error)
    return null
  }
}

export default async function RoastStatisticsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const stats = await getRoastStatistics()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Roast Statistics — Data Insights" : "Roast Statistics — Data Insights"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Daten-basierte Security-Insights aus echten Roast-Results. Real-time Statistiken ohne Mock-Daten."
              : "Data-driven security insights from real roast results. Real-time statistics without mock data."}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {isDE ? "→ 100% echte Daten aus roast_results Tabelle." : "→ 100% real data from roast_results table."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Diese Daten dienen zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This data is for hardening your own systems. No attack tools."}
        </div>

        {!stats ? (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              {isDE ? "Keine Statistiken verfügbar." : "No statistics available."}
            </p>
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Übersicht" : "Overview"}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-gray-100">{isDE ? "Gesamt" : "Total"}</h3>
                  </div>
                  <div className="text-3xl font-bold text-cyan-400">{stats.totalRoasts.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">{isDE ? "Roasts insgesamt" : "Total roasts"}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-gray-100">{isDE ? "Ø Score" : "Avg Score"}</h3>
                  </div>
                  <div className="text-3xl font-bold text-cyan-400">{stats.avgScore.toFixed(1)}</div>
                  <div className="text-sm text-gray-400">{isDE ? "Durchschnitt" : "Average"}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-gray-100">{isDE ? "Elite" : "Elite"}</h3>
                  </div>
                  <div className="text-3xl font-bold text-cyan-400">{stats.eliteStacks.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">{isDE ? "Score ≥ 90" : "Score ≥ 90"}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-gray-100">{isDE ? "Heute" : "Today"}</h3>
                  </div>
                  <div className="text-3xl font-bold text-cyan-400">{stats.roastsToday.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">{isDE ? "Roasts heute" : "Roasts today"}</div>
                </div>
              </div>
            </section>

            {/* Time Trends */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Zeit-Trends" : "Time Trends"}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-bold text-gray-100 mb-2">{isDE ? "Diese Woche" : "This Week"}</h3>
                  <div className="text-2xl font-bold text-cyan-400">{stats.roastsThisWeek.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">{isDE ? "Roasts" : "Roasts"}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-bold text-gray-100 mb-2">{isDE ? "Diesen Monat" : "This Month"}</h3>
                  <div className="text-2xl font-bold text-cyan-400">{stats.roastsThisMonth.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">{isDE ? "Roasts" : "Roasts"}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="font-bold text-gray-100 mb-2">{isDE ? "Gesamt" : "All Time"}</h3>
                  <div className="text-2xl font-bold text-cyan-400">{stats.totalRoasts.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">{isDE ? "Roasts" : "Roasts"}</div>
                </div>
              </div>
            </section>

            {/* Score Distribution */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Score-Verteilung" : "Score Distribution"}</h2>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{isDE ? "Elite (≥90)" : "Elite (≥90)"}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-48 h-3 bg-gray-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${(stats.scoreDistribution.elite / stats.totalRoasts) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 w-12 text-right">{stats.scoreDistribution.elite.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{isDE ? "Gut (70-89)" : "Good (70-89)"}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-48 h-3 bg-gray-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500"
                          style={{ width: `${(stats.scoreDistribution.good / stats.totalRoasts) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 w-12 text-right">{stats.scoreDistribution.good.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{isDE ? "Durchschnitt (50-69)" : "Average (50-69)"}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-48 h-3 bg-gray-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{ width: `${(stats.scoreDistribution.average / stats.totalRoasts) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 w-12 text-right">{stats.scoreDistribution.average.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{isDE ? "Schlecht (<50)" : "Poor (<50)"}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-48 h-3 bg-gray-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${(stats.scoreDistribution.poor / stats.totalRoasts) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 w-12 text-right">{stats.scoreDistribution.poor.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Top Stacks */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Top Stacks" : "Top Stacks"}</h2>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="space-y-3">
                  {stats.topStacks.map((stack: any, index: number) => (
                    <div key={stack.id || index} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm text-gray-300">{stack.stack_summary}</div>
                        <div className="text-xs text-gray-500">{new Date(stack.created_at).toLocaleDateString(locale)}</div>
                      </div>
                      <div className="text-2xl font-bold text-cyan-400 ml-4">{stack.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Locale Distribution */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Regionale Verteilung" : "Locale Distribution"}</h2>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="space-y-3">
                  {stats.localeDistribution.map((item: any, index: number) => (
                    <div key={item.locale} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-gray-300">{item.locale.toUpperCase()}</span>
                      </div>
                      <span className="text-sm text-gray-400">{item.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Further Resources */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further resources"}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href={`/${locale}/roast-my-moltbot/hall-of-fame`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                  <div className="font-semibold text-cyan-400">{isDE ? "Hall of Fame" : "Hall of Fame"}</div>
                  <div className="text-sm text-gray-300">{isDE ? "Top Stacks anzeigen" : "View top stacks"}</div>
                </Link>
                <Link href={`/${locale}/roast-my-moltbot/leaderboard`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                  <div className="font-semibold text-cyan-400">{isDE ? "Leaderboard" : "Leaderboard"}</div>
                  <div className="text-sm text-gray-300">{isDE ? "Rangliste" : "Rankings"}</div>
                </Link>
                <Link href={`/${locale}/roast-my-moltbot/trends`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                  <div className="font-semibold text-cyan-400">{isDE ? "Trends" : "Trends"}</div>
                  <div className="text-sm text-gray-300">{isDE ? "Aktuelle Trends" : "Current trends"}</div>
                </Link>
                <Link href={`/${locale}/api-pricing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                  <div className="font-semibold text-cyan-400">{isDE ? "API Pricing" : "API Pricing"}</div>
                  <div className="text-sm text-gray-300">{isDE ? "API-Zugang" : "API access"}</div>
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
