import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Cloud, DollarSign, Zap, Shield, TrendingUp } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/cloud-wars`
  const isDE = locale === "de"
  const title = pick(isDE, "Cloud Wars | ClawGuru", "Cloud Wars | ClawGuru")
  const description = pick(isDE, "AWS vs GCP vs Azure — Der ultimative Cloud-Vergleich", "AWS vs GCP vs Azure — The ultimate cloud comparison")
  return {
    title,
    description,
    keywords: ["cloud", "aws", "gcp", "azure", "comparison", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/cloud-wars"),
    robots: "index, follow",
  }
}

const cloudProviders = [
  {
    name: "AWS",
    icon: "🟠",
    score: 91,
    marketShare: 32,
    cost: 75,
    performance: 88,
    security: 92,
    strengths: ["Largest ecosystem", "Mature services", "Global infrastructure"],
    weaknesses: ["Complex pricing", "Steep learning curve", "Vendor lock-in"],
  },
  {
    name: "GCP",
    icon: "🔵",
    score: 87,
    marketShare: 11,
    cost: 82,
    performance: 90,
    security: 88,
    strengths: ["Kubernetes-native", "Better pricing", "AI/ML leadership"],
    weaknesses: ["Smaller ecosystem", "Fewer regions", "Less documentation"],
  },
  {
    name: "Azure",
    icon: "🔷",
    score: 84,
    marketShare: 23,
    cost: 78,
    performance: 85,
    security: 90,
    strengths: ["Enterprise integration", "Hybrid cloud", "Microsoft ecosystem"],
    weaknesses: ["Complex setup", "Legacy features", "Inconsistent UX"],
  },
]

export default function CloudWarsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "Cloud Wars", "Cloud Wars")}
          </h1>
          <p className="text-lg text-gray-300">
            {pick(isDE, "AWS vs GCP vs Azure — Der ultimative Cloud-Vergleich", "AWS vs GCP vs Azure — The ultimate cloud comparison")}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 py-3 px-4">{pick(isDE, "Provider", "Provider")}</th>
                <th className="text-center text-gray-400 py-3 px-4">{pick(isDE, "Score", "Score")}</th>
                <th className="text-center text-gray-400 py-3 px-4">{pick(isDE, "Marktanteil", "Market Share")}</th>
                <th className="text-center text-gray-400 py-3 px-4">{pick(isDE, "Kosten", "Cost")}</th>
                <th className="text-center text-gray-400 py-3 px-4">{pick(isDE, "Performance", "Performance")}</th>
                <th className="text-center text-gray-400 py-3 px-4">{pick(isDE, "Sicherheit", "Security")}</th>
              </tr>
            </thead>
            <tbody>
              {cloudProviders.map((provider) => (
                <tr key={provider.name} className="border-b border-gray-700">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{provider.icon}</span>
                      <span className="font-semibold text-gray-100">{provider.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-xl font-bold text-cyan-400">{provider.score}</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full"
                          style={{ width: `${provider.marketShare}%` }}
                        />
                      </div>
                      <span className="text-sm text-zinc-500">{provider.marketShare}%</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{provider.cost}</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-gray-300">{provider.performance}</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{provider.security}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Provider Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {cloudProviders.map((provider) => (
            <div key={provider.name} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{provider.icon}</div>
                <div className="font-semibold text-gray-100">{provider.name}</div>
                <div className="text-3xl font-bold text-cyan-400">{provider.score}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-zinc-500 mb-2">{pick(isDE, "Stärken", "Strengths")}</div>
                <div className="space-y-1">
                  {provider.strengths.map((strength, index) => (
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
                  {provider.weaknesses.map((weakness, index) => (
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
                AWS — {pick(isDE, "Beste Balance aus Ökosystem und Reife", "Best balance of ecosystem and maturity")}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mt-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Cloud Wars sind subjektive Bewertungen basierend auf öffentlichen Daten.", "Cloud wars are subjective ratings based on public data.")}
        </div>
      </div>
    </div>
  )
}
