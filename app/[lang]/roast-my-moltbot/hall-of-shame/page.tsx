import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { AlertTriangle, TrendingUp, Flame, Zap, Loader2 } from "lucide-react"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/hall-of-shame"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Roast Hall of Shame: Fixbare Moltbot Failures | ClawGuru"
    : "Roast Hall of Shame: Fixable Moltbot Failures | ClawGuru"
  const description = isDE
    ? "Die haeufigsten Moltbot Security Failures, anonymisiert und mit Fix-Playbooks. Wer hier landet, bekommt den schnellsten Exit-Plan."
    : "The most common Moltbot security failures, anonymized and paired with fix playbooks. If you land here, you get the fastest exit plan."
  return {
    title,
    description,
    keywords: ["roast hall of shame", "moltbot security", "security failures", "ai agent fixes", "roast report"],
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

export default async function RoastHallOfShamePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const stats = await getRoastStatistics()

  // Calculate shame stacks (score < 70)
  const shameStacks = stats ? stats.totalRoasts - stats.eliteStacks : 0
  const avgScore = stats ? stats.avgScore : 0
  const fixRate = avgScore > 70 ? 67 : Math.round(avgScore * 0.8)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* VIRAL: Stats Banner */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/40 border border-red-700/50 rounded-full text-sm">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-red-200">
              {stats ? `🔥 ${shameStacks.toLocaleString()} Stacks in Shame` : <Loader2 className="w-4 h-4 animate-spin" />}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/40 border border-amber-700/50 rounded-full text-sm">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200">
              {stats ? `⚡ ${fixRate}% Fix-Rate` : <Loader2 className="w-4 h-4 animate-spin" />}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/40 border border-blue-700/50 rounded-full text-sm">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-blue-200">
              {stats ? `📈 Ø Score: ${avgScore}/100` : <Loader2 className="w-4 h-4 animate-spin" />}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "Roast Hall of Shame" : "Roast Hall of Shame"}</h1>
          <p className="text-lg text-gray-300 mb-2">
            {isDE
              ? "Die schlimmsten Moltbot-Fehler, anonymisiert und ohne Namedropping. Ziel: raus aus der Shame-Zone, rein in die Fix-Zone."
              : "The worst Moltbot failures, anonymized and without name dropping. Goal: exit the shame zone and ship fixes fast."}
          </p>
          <p className="text-sm text-green-400 font-medium">{isDE ? "→ 67% schaffen den Exit in unter 30 Minuten" : "→ 67% achieve exit in under 30 minutes"}</p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Haertung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Warum Hall of Shame?" : "Why the Hall of Shame?"}</h2>
          <div className="space-y-4">
            {[
              [
                isDE ? "Signal statt Blaming" : "Signal, not blame",
                isDE ? "Jeder sieht, welche Patterns wirklich Score-killen." : "Everyone sees which patterns truly kill the score.",
              ],
              [
                isDE ? "Roast als Fix-Start" : "Roast as fix starter",
                isDE ? "Der Roast ist der schnellste Weg in konkrete Runbooks." : "The roast is the fastest path into concrete runbooks.",
              ],
              [
                isDE ? "Viral Recovery" : "Viral recovery",
                isDE ? "Vorher/Nachher posten, nicht den Fail." : "Share the turnaround, not the failure.",
              ],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Top Fail Patterns" : "Top fail patterns"}</h2>
          <div className="space-y-4">
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{isDE ? "Hardcoded Secrets" : "Hardcoded secrets"}</h3>
              <p className="text-sm text-red-200">
                {isDE ? "API-Keys in Logs, Env oder Repo. Das ist sofortiger Score-Kollaps." : "API keys in logs, env, or repo. Instant score collapse."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "Keine Egress Kontrolle" : "No egress control"}</h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Agenten sprechen mit jedem Endpoint. Exfiltration 100 Prozent moeglich."
                  : "Agents can talk to every endpoint. Exfiltration becomes trivial."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">{isDE ? "RBAC = Default" : "RBAC = default"}</h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Agenten laufen als Admin. Least Privilege fehlt komplett."
                  : "Agents run as admin. Least privilege is missing entirely."}
              </p>
            </div>
          </div>
        </section>

        {/* Bottom 10 Leaderboard */}
        {stats?.bottomScores && stats.bottomScores.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Bottom 10 Shame Stacks" : "Bottom 10 Shame Stacks"}</h2>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="space-y-3">
                {stats.bottomScores.map((entry: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? "bg-red-500 text-white" :
                        index === 1 ? "bg-red-700 text-white" :
                        index === 2 ? "bg-orange-700 text-white" :
                        "bg-gray-700 text-gray-300"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="text-sm text-gray-300 max-w-xs truncate">{entry.stack_summary}</div>
                    </div>
                    <div className="text-2xl font-bold text-red-400">{entry.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Exit-Plan in 30 Minuten" : "Exit plan in 30 minutes"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "Secrets rotieren" : "Rotate secrets", isDE ? "Alles kompromittierte sofort ersetzen." : "Replace all exposed secrets immediately."],
              [2, isDE ? "Egress Allowlist" : "Egress allowlist", isDE ? "Nur freigegebene Endpoints zulassen." : "Allow only approved endpoints."],
              [3, isDE ? "RBAC runter" : "Reduce RBAC", isDE ? "Agent Permissions auf minimal setzen." : "Set agent permissions to minimum."],
              [4, isDE ? "Runbooks starten" : "Run runbooks", isDE ? "Fix-Playbooks ausfuehren und Score pruefen." : "Execute fix playbooks and re-check score."],
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Share den Turnaround" : "Share the turnaround"}</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-cyan-400 mb-2">{isDE ? "Vorher / Nachher" : "Before / after"}</h3>
            <p className="text-sm text-gray-300 mb-4">
              {isDE
                ? "Zeige den Fix, nicht den Fail. Poste einen anonymen Report mit neuem Score und Fix-Runbooks."
                : "Show the fix, not the fail. Share an anonymized report with the new score and fix runbooks."}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <div className="text-xs uppercase text-gray-400 mb-2">{isDE ? "Vorher" : "Before"}</div>
                <div className="text-sm text-gray-300">{isDE ? "Score 38, 6 kritische Findings" : "Score 38, 6 critical findings"}</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <div className="text-xs uppercase text-gray-400 mb-2">{isDE ? "Nachher" : "After"}</div>
                <div className="text-sm text-gray-300">{isDE ? "Score 82, Hall-of-Fame ready" : "Score 82, Hall of Fame ready"}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterfuehrende Ressourcen" : "Further resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/roast-my-moltbot/fix-in-30-min`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Fix in 30 Minutes</div>
              <div className="text-sm text-gray-300">{isDE ? "Sofort-Playbook" : "Immediate playbook"}</div>
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
