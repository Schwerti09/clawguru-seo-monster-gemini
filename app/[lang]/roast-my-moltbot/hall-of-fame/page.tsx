import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Trophy, TrendingUp, Users, Share2, Loader2 } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/hall-of-fame"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Roast Hall of Fame: Elite Moltbot Security Scores | ClawGuru", "Roast Hall of Fame: Elite Moltbot Security Scores | ClawGuru")
  const description = pick(isDE, "Die besten Moltbot Security Scores – anonymisiert, shareable, mit klaren Fix-Playbooks.", "The best Moltbot security scores — anonymized, shareable, with clear fix playbooks.")
  return {
    title,
    description,
    keywords: ["roast hall of fame", "moltbot security score", "security leaderboard", "shareable roast", "ai agent security"],
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

export default async function RoastHallOfFamePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const stats = await getRoastStatistics()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* VIRAL: Stats Banner */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/40 border border-green-700/50 rounded-full text-sm">
            <Trophy className="w-4 h-4 text-green-400" />
            <span className="text-green-200">
              {stats ? `🏆 ${stats.eliteStacks} Elite Stacks` : <Loader2 className="w-4 h-4 animate-spin" />}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-900/40 border border-cyan-700/50 rounded-full text-sm">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-200">
              {stats ? `📈 ${stats.totalRoasts.toLocaleString()} Roasts total` : <Loader2 className="w-4 h-4 animate-spin" />}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/40 border border-amber-700/50 rounded-full text-sm">
            <Share2 className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200">
              {stats ? `🔥 Ø Score: ${stats.avgScore}/100` : <Loader2 className="w-4 h-4 animate-spin" />}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "Roast Hall of Fame", "Roast Hall of Fame")}</h1>
          <p className="text-lg text-gray-300 mb-2">
            {pick(isDE, "Die härtesten Moltbot-Setups. Nur Score, kein Name. Verdient wird hier nichts außer Respekt.", "The hardest Moltbot setups. Score only, no names. Earned respect, not hype.")}
          </p>
          <p className="text-sm text-amber-400 font-medium">{pick(isDE, "→ Hol dir den Badge und zeig, wer wirklich liefert", "→ Get the badge and show who actually delivers")}</p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Warum Hall of Fame?", "Why a Hall of Fame?")}</h2>
          <div className="space-y-4">
            {[
              [pick(isDE, "Social Proof", "Social proof"), pick(isDE, "Zeige, dass du Security nicht nur predigst, sondern lieferst.", "Show you actually deliver security, not just talk.")],
              [pick(isDE, "Accountability", "Accountability"), pick(isDE, "Teams sehen ihren Score und wollen ihn sichtbar pushen.", "Teams see their score and want to push it publicly.")],
              [pick(isDE, "Viral Loop", "Viral loop"), pick(isDE, "Score + Badge sind die perfekte Share-Unit.", "Score + badge is the perfect share unit.")],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Score Tiers", "Score tiers")}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">{pick(isDE, "90–100: Elite", "90–100: Elite")}</h3>
              <p className="text-sm text-green-200">{pick(isDE, "Hall of Fame + Badge + Shareable Report.", "Hall of Fame + badge + shareable report.")}</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">{pick(isDE, "80–89: Hardened", "80–89: Hardened")}</h3>
              <p className="text-sm text-blue-200">{pick(isDE, "Starker Score, aber noch 1–2 Fixes möglich.", "Strong score, but 1–2 fixes still possible.")}</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">{pick(isDE, "70–79: Fixable", "70–79: Fixable")}</h3>
              <p className="text-sm text-yellow-200">{pick(isDE, "Gute Basis, aber Exposure noch zu hoch.", "Good base, but exposure still too high.")}</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{pick(isDE, "<70: Roast Zone", "<70: Roast Zone")}</h3>
              <p className="text-sm text-red-200">{pick(isDE, "Roast ehrlich nehmen und Fix in 30 Min starten.", "Take the roast seriously and start the 30-min fix.")}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "So kommst du rein", "How to get in")}</h2>
          <div className="space-y-6">
            {[
              [1, pick(isDE, "Roast starten", "Start the roast"), pick(isDE, "Hole deinen Score und die Findings.", "Get your score and findings.")],
              [2, pick(isDE, "Fixes anwenden", "Apply fixes"), pick(isDE, "Top 5 Findings beheben, Score pushen.", "Fix the top 5 findings and push the score.")],
              [3, pick(isDE, "Shareable Report", "Shareable report"), pick(isDE, "Report exportieren und anonymisiert teilen.", "Export and share the report anonymously.")],
              [4, pick(isDE, "Hall of Fame Badge", "Hall of Fame badge"), pick(isDE, "Badge sichern und sichtbar machen.", "Claim the badge and make it visible.")],
            ].map(([n, t, d]) => (
              <div key={n as number} className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{n}</div>
                <div>
                  <div className="font-semibold text-gray-100 mb-2">{t}</div>
                  <div className="text-sm text-gray-300">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top 10 Leaderboard */}
        {stats?.topScores && stats.topScores.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Top 10 Elite Stacks", "Top 10 Elite Stacks")}</h2>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="space-y-3">
                {stats.topScores.map((entry: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? "bg-amber-500 text-black" :
                        index === 1 ? "bg-gray-400 text-black" :
                        index === 2 ? "bg-amber-700 text-white" :
                        "bg-gray-700 text-gray-300"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="text-sm text-gray-300 max-w-xs truncate">{entry.stack_summary}</div>
                    </div>
                    <div className="text-2xl font-bold text-cyan-400">{entry.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/roast-my-moltbot/shareable-roast-report`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Shareable Roast Report</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Report exportieren", "Export your report")}</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot/roast-score-methodology`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Score Methodology</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Score verstehen", "Understand the score")}</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Roast My Moltbot</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Roast starten", "Start the roast")}</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Fixes automatisieren", "Automate fixes")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
