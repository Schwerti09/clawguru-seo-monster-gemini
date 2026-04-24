import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Code, Zap, Shield, TrendingUp } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/framework-wars`
  const isDE = locale === "de"
  const title = pick(isDE, "Framework Wars | ClawGuru", "Framework Wars | ClawGuru")
  const description = pick(isDE, "React vs Vue vs Angular — Der ultimative Framework-Vergleich", "React vs Vue vs Angular — The ultimate framework comparison")
  return {
    title,
    description,
    keywords: ["framework", "react", "vue", "angular", "comparison", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/framework-wars"),
    robots: "index, follow",
  }
}

const frameworks = [
  {
    name: "React",
    icon: "⚛️",
    score: 89,
    popularity: 95,
    performance: 78,
    security: 85,
    strengths: ["Massive ecosystem", "Huge community", "Job market"],
    weaknesses: ["Complex state management", "Learning curve", "Bundle size"],
  },
  {
    name: "Vue",
    icon: "💚",
    score: 86,
    popularity: 75,
    performance: 85,
    security: 82,
    strengths: ["Easy learning curve", "Great documentation", "Progressive"],
    weaknesses: ["Smaller ecosystem", "Fewer jobs", "TypeScript support"],
  },
  {
    name: "Angular",
    icon: "🅰️",
    score: 78,
    popularity: 60,
    performance: 72,
    security: 90,
    strengths: ["Built-in features", "Enterprise-ready", "TypeScript"],
    weaknesses: ["Steep learning curve", "Complex setup", "Smaller community"],
  },
]

export default function FrameworkWarsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "Framework Wars", "Framework Wars")}
          </h1>
          <p className="text-lg text-gray-300">
            {pick(isDE, "React vs Vue vs Angular — Der ultimative Framework-Vergleich", "React vs Vue vs Angular — The ultimate framework comparison")}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 py-3 px-4">{pick(isDE, "Framework", "Framework")}</th>
                <th className="text-center text-gray-400 py-3 px-4">{pick(isDE, "Score", "Score")}</th>
                <th className="text-center text-gray-400 py-3 px-4">{pick(isDE, "Beliebtheit", "Popularity")}</th>
                <th className="text-center text-gray-400 py-3 px-4">{pick(isDE, "Performance", "Performance")}</th>
                <th className="text-center text-gray-400 py-3 px-4">{pick(isDE, "Sicherheit", "Security")}</th>
              </tr>
            </thead>
            <tbody>
              {frameworks.map((framework) => (
                <tr key={framework.name} className="border-b border-gray-700">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{framework.icon}</span>
                      <span className="font-semibold text-gray-100">{framework.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-xl font-bold text-cyan-400">{framework.score}</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full"
                          style={{ width: `${framework.popularity}%` }}
                        />
                      </div>
                      <span className="text-sm text-zinc-500">{framework.popularity}%</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-gray-300">{framework.performance}</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{framework.security}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Framework Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {frameworks.map((framework) => (
            <div key={framework.name} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{framework.icon}</div>
                <div className="font-semibold text-gray-100">{framework.name}</div>
                <div className="text-3xl font-bold text-cyan-400">{framework.score}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-zinc-500 mb-2">{pick(isDE, "Stärken", "Strengths")}</div>
                <div className="space-y-1">
                  {framework.strengths.map((strength, index) => (
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
                  {framework.weaknesses.map((weakness, index) => (
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
                React — {pick(isDE, "Beste Balance aus Ökosystem und Performance", "Best balance of ecosystem and performance")}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mt-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Framework Wars sind subjektive Bewertungen basierend auf öffentlichen Daten.", "Framework wars are subjective ratings based on public data.")}
        </div>
      </div>
    </div>
  )
}
