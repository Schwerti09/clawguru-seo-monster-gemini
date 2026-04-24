import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { TrendingUp, Users, Activity, AlertTriangle, CheckCircle } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/will-it-scale`
  const isDE = locale === "de"
  const title = pick(isDE, "Will it Scale? | ClawGuru", "Will it Scale? | ClawGuru")
  const description = pick(isDE, "Skalierungs-Roasts — Welche Stacks skalieren wirklich?", "Scaling roasts — Which stacks actually scale?")
  return {
    title,
    description,
    keywords: ["scale", "scaling", "performance", "growth", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/will-it-scale"),
    robots: "index, follow",
  }
}

const scalingCases = [
  {
    id: "1",
    stack: "Node.js + Redis + PostgreSQL",
    users: "1M → 10M",
    timeToScale: "2 weeks",
    verdict: "✓ Scales",
    cost: "$5K → $50K",
    challenges: ["Connection pooling", "Read replicas", "Cache invalidation"],
    solution: "Horizontal scaling with read replicas and Redis cache",
  },
  {
    id: "2",
    stack: "Python Django + SQLite",
    users: "10K → 100K",
    timeToScale: "Failed",
    verdict: "✗ Failed",
    cost: "$1K → $20K",
    challenges: ["SQLite locks", "GIL limitations", "No horizontal scaling"],
    solution: "Migrate to PostgreSQL + Celery + Redis",
  },
  {
    id: "3",
    stack: "Go + Microservices + PostgreSQL",
    users: "100K → 10M",
    timeToScale: "1 month",
    verdict: "✓ Scales",
    cost: "$10K → $100K",
    challenges: ["Service mesh complexity", "Distributed tracing", "API gateway"],
    solution: "Kubernetes + Istio + Prometheus",
  },
  {
    id: "4",
    stack: "PHP + Laravel + MySQL",
    users: "50K → 500K",
    timeToScale: "3 weeks",
    verdict: "✓ Scales",
    cost: "$3K → $30K",
    challenges: ["PHP-FPM limits", "MySQL connections", "Cache strategy"],
    solution: "Nginx + Redis + Read replicas",
  },
]

export default function WillItScalePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "Will it Scale?", "Will it Scale?")}
          </h1>
          <p className="text-lg text-gray-300">
            {pick(isDE, "Skalierungs-Roasts — Welche Stacks skalieren wirklich?", "Scaling roasts — Which stacks actually scale?")}
          </p>
        </div>

        {/* Scaling Cases */}
        <div className="space-y-6">
          {scalingCases.map((case_) => (
            <div key={case_.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-semibold text-gray-100 mb-1">{case_.stack}</div>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{case_.users}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      <span>{case_.timeToScale}</span>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  case_.verdict === "✓ Scales" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                }`}>
                  {case_.verdict === "✓ Scales" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <span className="font-semibold">{case_.verdict}</span>
                </div>
              </div>

              {/* Cost */}
              <div className="mb-4">
                <div className="text-sm text-zinc-500 mb-2">{pick(isDE, "Kosten", "Cost")}</div>
                <div className="text-gray-300">{case_.cost}</div>
              </div>

              {/* Challenges */}
              <div className="mb-4">
                <div className="text-sm text-zinc-500 mb-2">
                  {pick(isDE, "Herausforderungen", "Challenges")}
                </div>
                <div className="space-y-1">
                  {case_.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="text-amber-400 mt-0.5">⚠️</div>
                      <span>{challenge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solution */}
              <div>
                <div className="text-sm text-zinc-500 mb-2">
                  {pick(isDE, "Lösung", "Solution")}
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-cyan-400">{case_.solution}</div>
                </div>
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
                {pick(isDE, "Fazit", "Summary")}
              </div>
              <div className="text-xl font-bold text-gray-100">
                {pick(isDE, "3 von 4 Stacks skalieren erfolgreich — Python/Django+SQLite scheitert", "3 out of 4 stacks scale successfully — Python/Django+SQLite fails")}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mt-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Will it Scale? sind reale Skalierungs-Szenarien basierend auf öffentlichen Daten.", "Will it Scale? are real scaling scenarios based on public data.")}
        </div>
      </div>
    </div>
  )
}
