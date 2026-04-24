import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/roast-score-methodology"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Roast Score Methodology: So bewertet ClawGuru deine Moltbot-Security", "Roast Score Methodology: How ClawGuru scores your Moltbot security")
  const description = pick(isDE, "Transparente Scoring-Logik: Gewichtung, Risiko-Kategorien und Quick Wins für schnellen Score-Boost.", "Transparent scoring: weighting, risk categories and quick wins for a fast score boost.")
  return {
    title,
    description,
    keywords: ["roast score", "security scoring", "moltbot security", "risk categories", "score methodology"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function RoastScoreMethodologyPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "Roast Score Methodology", "Roast Score Methodology")}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "Keine Blackbox: Du siehst exakt, warum dein Score so ist und wie du ihn schnell pushst.", "No black box: see exactly why your score is what it is and how to boost it fast.")}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Score-Kategorien (Gewichtung)", "Score categories (weighting)")}</h2>
          <div className="space-y-4">
            {[
              [pick(isDE, "30% Exposure & Network", "30% Exposure & Network"), pick(isDE, "Öffentliche Endpoints, Egress-Policy, unnötige Ports.", "Public endpoints, egress policy, unnecessary ports.")],
              [pick(isDE, "25% Secrets & Credentials", "25% Secrets & Credentials"), pick(isDE, "Hardcoded Secrets, fehlende Rotation, Privilege Drift.", "Hardcoded secrets, missing rotation, privilege drift.")],
              [pick(isDE, "20% Identity & Access", "20% Identity & Access"), pick(isDE, "RBAC/ABAC, JIT-Access, Token TTL.", "RBAC/ABAC, JIT access, token TTL.")],
              [pick(isDE, "15% Monitoring & Detection", "15% Monitoring & Detection"), pick(isDE, "Audit Logs, SIEM Hooks, Alert Noise.", "Audit logs, SIEM hooks, alert noise.")],
              [pick(isDE, "10% Resilience & Recovery", "10% Resilience & Recovery"), pick(isDE, "Backups, Rollback, IR-Readiness.", "Backups, rollback, IR readiness.")],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Quick Wins (schneller Score-Boost)", "Quick wins (fast score boost)")}</h2>
          <div className="space-y-6">
            {[
              [1, pick(isDE, "Secrets sofort rotieren", "Rotate secrets immediately"), pick(isDE, "Der schnellste Hebel für +10–15 Punkte.", "Fastest lever for +10–15 points.")],
              [2, pick(isDE, "Egress auf Allowlist", "Lock egress to allowlists"), pick(isDE, "Stoppt Data-Exfiltration-Risiko.", "Stops data exfiltration risk.")],
              [3, pick(isDE, "mTLS intern erzwingen", "Enforce mTLS internally"), pick(isDE, "Beendet laterale Bewegung im Cluster.", "Stops lateral movement in the cluster.")],
              [4, pick(isDE, "Audit-Logs + SIEM", "Audit logs + SIEM"), pick(isDE, "Sofortige Detect-Fähigkeit.", "Instant detect capability.")],
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Roast My Moltbot</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Roast starten", "Start the roast")}</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Fixes automatisieren", "Automate fixes")}</div>
            </a>
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Infrastruktur prüfen", "Check infrastructure")}</div>
            </a>
            <a href={`/${locale}/academy`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Academy</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Roast + Learn", "Roast + Learn")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
