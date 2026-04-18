import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { TrendingUp, Brain, Sparkles, AlertTriangle } from "lucide-react"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/predictions-2025`
  const isDE = locale === "de"
  const title = isDE ? "Roast Predictions 2025 | ClawGuru" : "Roast Predictions 2025 | ClawGuru"
  const description = isDE 
    ? "Zukunftsprognosen — Was kommt als nächstes?" 
    : "Future predictions — What's next?"
  return {
    title,
    description,
    keywords: ["predictions", "2025", "future", "trends", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/predictions-2025"),
    robots: "index, follow",
  }
}

const predictions = [
  {
    id: "1",
    category: "AI Security",
    prediction: "LLM vulnerabilities will become the #1 attack vector",
    confidence: 85,
    timeline: "Q2 2025",
    impact: "critical",
    reasoning: "As AI adoption explodes, prompt injection and model poisoning attacks will scale exponentially",
  },
  {
    id: "2",
    category: "Cloud Security",
    prediction: "Multi-cloud adoption will decrease — companies will consolidate",
    confidence: 72,
    timeline: "Q3 2025",
    impact: "high",
    reasoning: "Cost optimization and complexity management will drive consolidation to single cloud providers",
  },
  {
    id: "3",
    category: "DevSecOps",
    prediction: "Security will shift left to design phase — not just code",
    confidence: 78,
    timeline: "Q4 2025",
    impact: "high",
    reasoning: "Threat modeling and secure design will become mandatory before any code is written",
  },
  {
    id: "4",
    category: "Zero Trust",
    prediction: "Zero Trust will become default, not optional",
    confidence: 90,
    timeline: "Q2 2025",
    impact: "critical",
    reasoning: "Regulatory pressure and breach statistics will make Zero Trust a compliance requirement",
  },
  {
    id: "5",
    category: "Supply Chain",
    prediction: "SBOM (Software Bill of Materials) will be legally required",
    confidence: 88,
    timeline: "Q3 2025",
    impact: "critical",
    reasoning: "New regulations will mandate SBOMs for all software in critical infrastructure",
  },
]

export default function Predictions2025Page({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Roast Predictions 2025" : "Roast Predictions 2025"}
          </h1>
          <p className="text-lg text-gray-300">
            {isDE 
              ? "Zukunftsprognosen — Was kommt als nächstes?" 
              : "Future predictions — What's next?"}
          </p>
        </div>

        {/* Predictions */}
        <div className="space-y-6">
          {predictions.map((prediction) => (
            <div key={prediction.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-gray-100">{prediction.category}</div>
                    <div className="text-sm text-zinc-500">{prediction.timeline}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  prediction.impact === "critical" ? "bg-red-900/50 text-red-400" : "bg-amber-900/50 text-amber-400"
                }`}>
                  {prediction.impact}
                </div>
              </div>

              {/* Prediction */}
              <div className="mb-4">
                <div className="text-lg text-gray-100 mb-2">{prediction.prediction}</div>
                <div className="text-sm text-zinc-500">{prediction.reasoning}</div>
              </div>

              {/* Confidence */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-zinc-500 mb-2">
                  <span>{isDE ? "Vertrauen" : "Confidence"}</span>
                  <span>{prediction.confidence}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{ width: `${prediction.confidence}%` }}
                  />
                </div>
              </div>

              {/* Impact Badge */}
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-zinc-500">
                  {isDE ? "Auswirkung" : "Impact"}: {prediction.impact}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-gradient-to-r from-cyan-900/30 to-gray-800 rounded-xl border border-cyan-700/50 p-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <div>
              <div className="text-sm text-zinc-500 mb-1">
                {isDE ? "Fazit" : "Summary"}
              </div>
              <div className="text-xl font-bold text-gray-100">
                {isDE 
                  ? "5 kritische Prognosen für 2025 — AI Security und Zero Trust dominieren" 
                  : "5 critical predictions for 2025 — AI Security and Zero Trust dominate"}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mt-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE 
            ? "Predictions basieren auf Trend-Analysen und Experten-Meinungen." 
            : "Predictions are based on trend analysis and expert opinions."}
        </div>
      </div>
    </div>
  )
}
