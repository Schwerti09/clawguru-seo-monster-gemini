import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/shareable-roast-report"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Shareable Security Roast Report: Mach deine Moltbot-Security viral | ClawGuru"
    : "Shareable Security Roast Report: Make your Moltbot security go viral | ClawGuru"
  const description = isDE
    ? "Erzeuge einen teilbaren Roast-Report mit Score, Findings und Fix-Plan. Perfekt für Teams, Social Share und schnelle Verbesserungen."
    : "Create a shareable roast report with score, findings and a fix plan. Perfect for teams, social share and fast improvements."
  return {
    title,
    description,
    keywords: ["roast report", "moltbot roast", "security score", "shareable report", "ai agent security"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function ShareableRoastReportPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Shareable Security Roast Report" : "Shareable Security Roast Report"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Score, Findings, Fix-Plan. Ein Report, den dein Team sofort versteht und den du ohne Scham teilen kannst."
              : "Score, findings, fix plan. A report your team understands instantly and you can share without shame."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Was drin ist" : "What’s inside"}</h2>
          <div className="space-y-4">
            {[
              [isDE ? "Scorecard + Heatmap" : "Scorecard + Heatmap", isDE ? "0–100 Score mit Heatmap pro Risiko-Bereich. Keine Blackbox." : "0–100 score with heatmap per risk area. No black box."],
              [isDE ? "Top 5 Findings" : "Top 5 Findings", isDE ? "Die härtesten Schwachstellen, priorisiert nach Impact." : "The most critical weaknesses prioritized by impact."],
              [isDE ? "Fix-Plan in 30–60 Min" : "Fix plan in 30–60 min", isDE ? "Konkrete Schritte, direkt umsetzbar." : "Concrete steps you can execute immediately."],
              [isDE ? "Share-Badge" : "Share badge", isDE ? "Kurzfassung + Badge für LinkedIn, Slack, Teams." : "Short summary + badge for LinkedIn, Slack, Teams."],
              [isDE ? "Before/After Delta" : "Before/After delta", isDE ? "Sieh den Score-Boost nach Fixes in Echtzeit." : "See the score boost after fixes in real time."],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Advanced Moves" : "Advanced moves"}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">{isDE ? "Share-Link mit Ablauf" : "Share link with expiry"}</h3>
              <p className="text-sm text-green-200">{isDE ? "Öffentliche Reports laufen automatisch aus. Sicherheit + Viralität." : "Public reports expire automatically. Security + virality."}</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">{isDE ? "Watermark + Audit" : "Watermark + audit"}</h3>
              <p className="text-sm text-blue-200">{isDE ? "Jeder Report hat eindeutige ID und Audit-Trail." : "Every report has a unique ID and audit trail."}</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "Team-Delta Tracking" : "Team delta tracking"}</h3>
              <p className="text-sm text-yellow-200">{isDE ? "Zeige Score-Progress pro Team, Sprint oder Projekt." : "Show score progress per team, sprint or project."}</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{isDE ? "No-Secret Mode" : "No-secret mode"}</h3>
              <p className="text-sm text-red-200">{isDE ? "Reports werden automatisch redacted. Zero data leakage." : "Reports are auto-redacted. Zero data leakage."}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Implementierungsschritte" : "Implementation steps"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "Roast starten" : "Start the roast", isDE ? "Analyse starten und Baseline-Score erstellen." : "Run the analysis and generate a baseline score."],
              [2, isDE ? "Quick-Fixes anwenden" : "Apply quick fixes", isDE ? "Top 5 Findings beheben, Score sichtbar pushen." : "Fix the top 5 findings and push the score up."],
              [3, isDE ? "Share-Link generieren" : "Generate share link", isDE ? "Shareable Report mit Badge erzeugen." : "Create a shareable report with badge."],
              [4, isDE ? "Team aktivieren" : "Activate your team", isDE ? "Report teilen, Ownership klar machen." : "Share the report and set clear ownership."],
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
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Roast My Moltbot</div>
              <div className="text-sm text-gray-300">{isDE ? "Roast starten" : "Start the roast"}</div>
            </a>
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{isDE ? "Infrastruktur prüfen" : "Check infrastructure"}</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">{isDE ? "Fixes automatisieren" : "Automate fixes"}</div>
            </a>
            <a href={`/${locale}/academy`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Academy</div>
              <div className="text-sm text-gray-300">{isDE ? "Roast + Learn" : "Roast + Learn"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
