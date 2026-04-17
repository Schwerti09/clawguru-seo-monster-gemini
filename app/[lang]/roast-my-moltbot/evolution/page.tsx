import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { TrendingUp, ArrowRight, Calendar } from "lucide-react"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/roast-my-moltbot/evolution`
  const isDE = locale === "de"
  const title = isDE ? "Stack Evolution | ClawGuru" : "Stack Evolution | ClawGuru"
  const description = isDE 
    ? "Zeige deinen Fortschritt — Before/After Vergleiche deiner Roasts" 
    : "Show your progress — Before/After comparisons of your roasts"
  return {
    title,
    description,
    keywords: ["evolution", "progress", "before-after", "improvement", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/roast-my-moltbot/evolution"),
    robots: "index, follow",
  }
}

const evolutionData = [
  {
    id: "1",
    stackName: "Kubernetes + Istio",
    before: { score: 45, date: "2026-03-01", critical: 8 },
    after: { score: 87, date: "2026-04-15", critical: 1 },
    fixes: ["Added network policies", "Enabled mTLS", "Fixed RBAC", "Rotated secrets"],
  },
  {
    id: "2",
    stackName: "PostgreSQL + pgcrypto",
    before: { score: 62, date: "2026-03-15", critical: 3 },
    after: { score: 94, date: "2026-04-10", critical: 0 },
    fixes: ["Enabled row-level security", "Added encryption at rest", "Updated to latest version"],
  },
]

export default function StackEvolutionPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Stack Evolution" : "Stack Evolution"}
          </h1>
          <p className="text-lg text-gray-300">
            {isDE 
              ? "Zeige deinen Fortschritt — Before/After Vergleiche deiner Roasts" 
              : "Show your progress — Before/After comparisons of your roasts"}
          </p>
        </div>

        {/* Evolution Cards */}
        <div className="space-y-6">
          {evolutionData.map((evolution) => (
            <div key={evolution.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {/* Stack Name */}
              <h3 className="text-xl font-semibold text-gray-100 mb-4">{evolution.stackName}</h3>

              {/* Before/After Comparison */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Before */}
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-800/50">
                  <div className="text-sm text-zinc-500 mb-2">{isDE ? "Vorher" : "Before"}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs text-zinc-500">{evolution.before.date}</span>
                  </div>
                  <div className="text-4xl font-bold text-red-400 mb-1">{evolution.before.score}</div>
                  <div className="text-sm text-zinc-500">
                    {evolution.before.critical} {isDE ? "kritisch" : "critical"}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-cyan-400" />
                </div>

                {/* After */}
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-800/50">
                  <div className="text-sm text-zinc-500 mb-2">{isDE ? "Nachher" : "After"}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs text-zinc-500">{evolution.after.date}</span>
                  </div>
                  <div className="text-4xl font-bold text-green-400 mb-1">{evolution.after.score}</div>
                  <div className="text-sm text-zinc-500">
                    {evolution.after.critical} {isDE ? "kritisch" : "critical"}
                  </div>
                </div>
              </div>

              {/* Improvement Badge */}
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-cyan-400">
                  +{evolution.after.score - evolution.before.score} {isDE ? "Punkte" : "points"}
                </span>
              </div>

              {/* Fixes */}
              <div>
                <div className="text-sm text-zinc-500 mb-2">
                  {isDE ? "Behoben" : "Fixed"}
                </div>
                <div className="space-y-1">
                  {evolution.fixes.map((fix, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="text-green-400 mt-0.5">✓</div>
                      <span>{fix}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New */}
        <div className="mt-6 text-center">
          <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
            {isDE ? "+ Evolution hinzufügen" : "+ Add evolution"}
          </button>
        </div>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mt-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE 
            ? "Evolution zeigt echte Verbesserungen an eigenen Systemen." 
            : "Evolution shows real improvements on your own systems."}
        </div>
      </div>
    </div>
  )
}
