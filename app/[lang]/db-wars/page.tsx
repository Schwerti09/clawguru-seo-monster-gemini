import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Database, Zap, Shield, TrendingUp, DollarSign } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/db-wars`
  const isDE = locale === "de"
  const title = pick(isDE, "Database Wars | ClawGuru", "Database Wars | ClawGuru")
  const description = pick(isDE, "PostgreSQL vs MongoDB vs MySQL — Der ultimative Datenbank-Vergleich", "PostgreSQL vs MongoDB vs MySQL — The ultimate database comparison")
  return {
    title,
    description,
    keywords: ["database", "postgresql", "mongodb", "mysql", "comparison", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/db-wars"),
    robots: "index, follow",
  }
}

const databases = [
  {
    name: "PostgreSQL",
    icon: "🐘",
    score: 92,
    popularity: 78,
    performance: 85,
    security: 95,
    cost: 90,
    strengths: ["ACID compliance", "JSON support", "Extensible", "Proven reliability"],
    weaknesses: ["Complex setup", "Memory usage", "Vertical scaling"],
  },
  {
    name: "MongoDB",
    icon: "🍃",
    score: 84,
    popularity: 72,
    performance: 82,
    security: 78,
    cost: 82,
    strengths: ["Flexible schema", "Horizontal scaling", "Document model", "Great for prototypes"],
    weaknesses: ["No ACID by default", "Query complexity", "Memory hungry"],
  },
  {
    name: "MySQL",
    icon: "🐬",
    score: 86,
    popularity: 85,
    performance: 88,
    security: 85,
    cost: 95,
    strengths: ["Widely used", "Fast reads", "Simple setup", "Great documentation"],
    weaknesses: ["Limited features", "No native JSON", "License concerns"],
  },
]

export default function DBWarsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "Database Wars", "Database Wars")}
          </h1>
          <p className="text-lg text-gray-300">
            {pick(isDE, "PostgreSQL vs MongoDB vs MySQL — Der ultimative Datenbank-Vergleich", "PostgreSQL vs MongoDB vs MySQL — The ultimate database comparison")}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 py-3 px-4">{pick(isDE, "Datenbank", "Database")}</th>
                <th className="text-center text-gray-400 py-3 px-4">{pick(isDE, "Score", "Score")}</th>
                <th className="text-center text-gray-400 py-3 px-4">{pick(isDE, "Beliebtheit", "Popularity")}</th>
                <th className="text-center text-gray-400 py-3 px-4">{pick(isDE, "Performance", "Performance")}</th>
                <th className="text-center text-gray-400 py-3 px-4">{pick(isDE, "Sicherheit", "Security")}</th>
                <th className="text-center text-gray-400 py-3 px-4">{pick(isDE, "Kosten", "Cost")}</th>
              </tr>
            </thead>
            <tbody>
              {databases.map((db) => (
                <tr key={db.name} className="border-b border-gray-700">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{db.icon}</span>
                      <span className="font-semibold text-gray-100">{db.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-xl font-bold text-cyan-400">{db.score}</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full"
                          style={{ width: `${db.popularity}%` }}
                        />
                      </div>
                      <span className="text-sm text-zinc-500">{db.popularity}%</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-gray-300">{db.performance}</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{db.security}</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{db.cost}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Database Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {databases.map((db) => (
            <div key={db.name} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{db.icon}</div>
                <div className="font-semibold text-gray-100">{db.name}</div>
                <div className="text-3xl font-bold text-cyan-400">{db.score}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-zinc-500 mb-2">{pick(isDE, "Stärken", "Strengths")}</div>
                <div className="space-y-1">
                  {db.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-green-400">
                      <span>✓</span>
                      <span className="text-gray-300">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm text-zinc-500 mb-2">{pick(isDE, "Schwächen", "Weaknesses")}</div>
                <div className="space-y-1">
                  {db.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-red-400">
                      <span>✗</span>
                      <span className="text-gray-300">{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Winner */}
        <div className="bg-gradient-to-r from-cyan-900/30 to-gray-800 rounded-xl border border-cyan-700/50 p-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <div>
              <div className="text-sm text-zinc-500 mb-1">
                {pick(isDE, "Gewinner", "Winner")}
              </div>
              <div className="text-xl font-bold text-gray-100">
                PostgreSQL — {pick(isDE, "Beste Balance aus Sicherheit und Flexibilität", "Best balance of security and flexibility")}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mt-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Database Wars sind subjektive Bewertungen basierend auf öffentlichen Daten.", "Database wars are subjective ratings based on public data.")}
        </div>
      </div>
    </div>
  )
}
