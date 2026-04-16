import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

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
  const title = isDE
    ? "Roast Hall of Fame: Elite Moltbot Security Scores | ClawGuru"
    : "Roast Hall of Fame: Elite Moltbot Security Scores | ClawGuru"
  const description = isDE
    ? "Die besten Moltbot Security Scores – anonymisiert, shareable, mit klaren Fix-Playbooks."
    : "The best Moltbot security scores — anonymized, shareable, with clear fix playbooks."
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

export default function RoastHallOfFamePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "Roast Hall of Fame" : "Roast Hall of Fame"}</h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Die härtesten Moltbot-Setups. Nur Score, kein Name. Verdient wird hier nichts außer Respekt."
              : "The hardest Moltbot setups. Score only, no names. Earned respect, not hype."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Warum Hall of Fame?" : "Why a Hall of Fame?"}</h2>
          <div className="space-y-4">
            {[
              [isDE ? "Social Proof" : "Social proof", isDE ? "Zeige, dass du Security nicht nur predigst, sondern lieferst." : "Show you actually deliver security, not just talk."],
              [isDE ? "Accountability" : "Accountability", isDE ? "Teams sehen ihren Score und wollen ihn sichtbar pushen." : "Teams see their score and want to push it publicly."],
              [isDE ? "Viral Loop" : "Viral loop", isDE ? "Score + Badge sind die perfekte Share-Unit." : "Score + badge is the perfect share unit."],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Score Tiers" : "Score tiers"}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">{isDE ? "90–100: Elite" : "90–100: Elite"}</h3>
              <p className="text-sm text-green-200">{isDE ? "Hall of Fame + Badge + Shareable Report." : "Hall of Fame + badge + shareable report."}</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">{isDE ? "80–89: Hardened" : "80–89: Hardened"}</h3>
              <p className="text-sm text-blue-200">{isDE ? "Starker Score, aber noch 1–2 Fixes möglich." : "Strong score, but 1–2 fixes still possible."}</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "70–79: Fixable" : "70–79: Fixable"}</h3>
              <p className="text-sm text-yellow-200">{isDE ? "Gute Basis, aber Exposure noch zu hoch." : "Good base, but exposure still too high."}</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{isDE ? "<70: Roast Zone" : "<70: Roast Zone"}</h3>
              <p className="text-sm text-red-200">{isDE ? "Roast ehrlich nehmen und Fix in 30 Min starten." : "Take the roast seriously and start the 30-min fix."}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "So kommst du rein" : "How to get in"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "Roast starten" : "Start the roast", isDE ? "Hole deinen Score und die Findings." : "Get your score and findings."],
              [2, isDE ? "Fixes anwenden" : "Apply fixes", isDE ? "Top 5 Findings beheben, Score pushen." : "Fix the top 5 findings and push the score."],
              [3, isDE ? "Shareable Report" : "Shareable report", isDE ? "Report exportieren und anonymisiert teilen." : "Export and share the report anonymously."],
              [4, isDE ? "Hall of Fame Badge" : "Hall of Fame badge", isDE ? "Badge sichern und sichtbar machen." : "Claim the badge and make it visible."],
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

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/roast-my-moltbot/shareable-roast-report`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Shareable Roast Report</div>
              <div className="text-sm text-gray-300">{isDE ? "Report exportieren" : "Export your report"}</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot/roast-score-methodology`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Score Methodology</div>
              <div className="text-sm text-gray-300">{isDE ? "Score verstehen" : "Understand the score"}</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Roast My Moltbot</div>
              <div className="text-sm text-gray-300">{isDE ? "Roast starten" : "Start the roast"}</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">{isDE ? "Fixes automatisieren" : "Automate fixes"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
