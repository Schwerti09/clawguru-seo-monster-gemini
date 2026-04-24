import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Calendar, Trophy, Users, TrendingUp, Flame, Loader2 } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/weekly-roast"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Weekly Moltbot Roast: Score Sprint & Fixes | ClawGuru", "Weekly Moltbot Roast: Score Sprint & Fixes | ClawGuru")
  const description = pick(isDE, "Der woechentliche Moltbot Roast: Score sprinten, Fixes sammeln, neue Badge sichern und Share-Report posten.", "The weekly Moltbot roast: sprint your score, capture fixes, secure a new badge, and share the report.")
  return {
    title,
    description,
    keywords: ["weekly roast", "moltbot security", "roast score", "security sprint", "runbooks"],
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

export default async function WeeklyRoastPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const stats = await getRoastStatistics()

  // Calculate current week number
  const now = new Date()
  const weekNumber = Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* VIRAL: Weekly Stats Banner */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/40 border border-amber-700/50 rounded-full text-sm">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200">📅 KW {weekNumber} — Aktuelle Woche</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/40 border border-green-700/50 rounded-full text-sm">
            <Trophy className="w-4 h-4 text-green-400" />
            <span className="text-green-200">
              {stats ? `🏆 ${stats.roastsToday.toLocaleString()} Teilnehmer heute` : <Loader2 className="w-4 h-4 animate-spin" />}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-900/40 border border-cyan-700/50 rounded-full text-sm">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-200">
              {stats ? `📈 Ø Score: ${stats.avgScore}/100` : <Loader2 className="w-4 h-4 animate-spin" />}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/40 border border-red-700/50 rounded-full text-sm">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-red-200">
              {stats && stats.topScores?.length > 0 ? `🔥 Leader: ${stats.topScores[0].score}/100` : <Loader2 className="w-4 h-4 animate-spin" />}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "Weekly Moltbot Roast", "Weekly Moltbot Roast")}</h1>
          <p className="text-lg text-gray-300 mb-2">
            {pick(isDE, "Jede Woche ein Score-Sprint. 30 Minuten Fixes, neue Badge, neuer Shareable Report.", "A weekly score sprint. 30 minutes of fixes, a new badge, and a shareable report.")}
          </p>
          <p className="text-sm text-amber-400 font-medium">{pick(isDE, "→ Diese Woche noch 3 Tage zum Mitmachen", "→ 3 days left to join this week")}</p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Haertung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weekly Sprint Format", "Weekly sprint format")}</h2>
          <div className="space-y-4">
            {[
              [pick(isDE, "Montag: Roast", "Monday: Roast"), pick(isDE, "Score + Findings in 2 Minuten.", "Score + findings in 2 minutes.")],
              [pick(isDE, "Dienstag: Fix", "Tuesday: Fix"), pick(isDE, "Top 3 Findings mit Runbooks beheben.", "Fix top 3 findings with runbooks.")],
              [pick(isDE, "Mittwoch: Re-Check", "Wednesday: Re-check"), pick(isDE, "Score neu ziehen, Badge sichern.", "Re-check score and secure the badge.")],
              [pick(isDE, "Freitag: Share", "Friday: Share"), pick(isDE, "Report posten, Team challengen.", "Post the report and challenge the team.")],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Score Sprint Checklist", "Score sprint checklist")}</h2>
          <div className="space-y-6">
            {[
              [1, pick(isDE, "Secrets rotieren", "Rotate secrets"), pick(isDE, "Alles mit hoher Exposure austauschen.", "Replace everything with high exposure.")],
              [2, pick(isDE, "Egress blocken", "Block egress"), pick(isDE, "Nur allowlisted Endpoints zulassen.", "Allow only allowlisted endpoints.")],
              [3, pick(isDE, "mTLS aktivieren", "Enable mTLS"), pick(isDE, "Agent-to-agent Traffic absichern.", "Secure agent-to-agent traffic.")],
              [4, pick(isDE, "RBAC minimal", "RBAC minimal"), pick(isDE, "Agentenrechte auf Minimum setzen.", "Set agent permissions to minimum.")],
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Team Challenge", "Team challenge")}</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-cyan-400 mb-2">{pick(isDE, "Wer gewinnt die Woche?", "Who wins the week?")}</h3>
            <p className="text-sm text-gray-300 mb-4">
              {pick(isDE, "Teilt die besten Score-Spruenge im Team-Channel. Verlierer hostet den naechsten Fix-Call.", "Share the best score jumps in your team channel. Loser hosts the next fix call.")}
            </p>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <div className="text-sm text-gray-300">{pick(isDE, "Beispiel: 42 -> 77 in 1 Woche", "Example: 42 -> 77 in 1 week")}</div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterfuehrende Ressourcen", "Further resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/roast-my-moltbot/shareable-roast-report`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Shareable Roast Report</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Report exportieren", "Export your report")}</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot/fix-in-30-min`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Fix in 30 Minutes</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Sofort-Playbook", "Immediate playbook")}</div>
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
