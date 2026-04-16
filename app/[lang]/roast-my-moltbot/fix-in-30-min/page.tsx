import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/fix-in-30-min"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Roast Playbook: Fix in 30 Minuten | ClawGuru"
    : "Roast Playbook: Fix in 30 Minutes | ClawGuru"
  const description = isDE
    ? "Der 30-Minuten Fix-Plan nach dem Roast: Score pushen, Exposure killen, Security sofort härten."
    : "The 30-minute fix plan after the roast: boost your score, kill exposure, harden security fast."
  return {
    title,
    description,
    keywords: ["roast playbook", "fix in 30 minutes", "moltbot security", "quick fixes", "ai agent hardening"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function RoastFixIn30MinPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "Roast Playbook: Fix in 30 Minuten" : "Roast Playbook: Fix in 30 Minutes"}</h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "30 Minuten, kein Drama. Die schnellsten Fixes nach dem Roast – sichtbar im Score." 
              : "30 minutes, no drama. The fastest fixes after the roast — visible in your score."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "30-Minuten Plan" : "30-minute plan"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "Secrets rotieren" : "Rotate secrets", isDE ? "Neue API Keys + Tokens ausrollen. Alte sofort invalidieren." : "Roll new API keys + tokens. Invalidate old ones immediately."],
              [2, isDE ? "Egress auf Allowlist" : "Egress allowlist", isDE ? "Nur explizite Ziele erlauben. Exfiltration blocken." : "Allow only explicit destinations. Block exfiltration."],
              [3, isDE ? "mTLS aktivieren" : "Enable mTLS", isDE ? "Agent-zu-Agent Traffic verschlüsseln und authentifizieren." : "Encrypt and authenticate agent-to-agent traffic."],
              [4, isDE ? "Output Schema erzwingen" : "Enforce output schema", isDE ? "Antworten validieren und blocken, wenn sie abweichen." : "Validate outputs and block when they drift."],
              [5, isDE ? "Audit Logs aktivieren" : "Enable audit logs", isDE ? "Prompt + Tool Calls in Logs sichern. SIEM Hook setzen." : "Log prompts + tool calls. Add SIEM hook."],
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Quick Checklist" : "Quick checklist"}</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✅ {isDE ? "Secrets & Tokens rotiert" : "Secrets & tokens rotated"}</li>
              <li>✅ {isDE ? "Egress Allowlist aktiv" : "Egress allowlist active"}</li>
              <li>✅ {isDE ? "mTLS zwischen Agents" : "mTLS between agents"}</li>
              <li>✅ {isDE ? "Output Schema enforced" : "Output schema enforced"}</li>
              <li>✅ {isDE ? "Audit Logs an SIEM" : "Audit logs to SIEM"}</li>
            </ul>
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
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{isDE ? "Infrastruktur prüfen" : "Check infrastructure"}</div>
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
