import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-security-santiago"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Security Santiago: DP Law, Zero-Trust, Moltbot | ClawGuru", "AI Agent Security Santiago: DP Law, Zero-Trust, Moltbot | ClawGuru")
  const description = pick(isDE, "Santiago Security Guide für AI-Agents: Datenschutz-Compliance, Zero-Trust und schnelle Fixes für Moltbot.", "Santiago security guide for AI agents: data protection compliance, zero-trust and fast fixes for Moltbot.")
  return {
    title,
    description,
    keywords: ["ai agent security santiago", "data protection compliance", "moltbot security", "zero trust ai"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: { index: false, follow: true },
  }
}

export default function AIAgentSecuritySantiagoPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "AI Agent Security Santiago", "AI Agent Security Santiago")}</h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "Santiago Playbook für AI-Agent-Security: Datenschutz, Zero-Trust und schnelle Fixes für Moltbot.", "Santiago playbook for AI agent security: data protection, zero-trust and fast fixes for Moltbot.")}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Santiago Fokus", "Santiago focus")}</h2>
          <div className="space-y-4">
            {[
              [pick(isDE, "Data Protection Law", "Data protection law"), pick(isDE, "Datenschutzanforderungen sauber abbilden und dokumentieren.", "Map and document privacy requirements cleanly.")],
              [pick(isDE, "FinTech Exposure", "FinTech exposure"), pick(isDE, "Payment-Integrationen strikt absichern.", "Lock down payment integrations.")],
              [pick(isDE, "Third-Party Risk", "Third-party risk"), pick(isDE, "Lokale Provider nur per Allowlist integrieren.", "Allowlist-only local providers.")],
              [pick(isDE, "Incident Readiness", "Incident readiness"), pick(isDE, "IR-Playbooks mit klarer Ownership.", "IR playbooks with clear ownership.")],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Sofort-Fixes", "Immediate fixes")}</h2>
          <div className="space-y-6">
            {[
              [1, pick(isDE, "Regionale Secrets", "Regional secrets"), pick(isDE, "Secrets pro Region trennen und rotieren.", "Separate and rotate secrets per region.")],
              [2, pick(isDE, "Egress Allowlist", "Egress allowlist"), pick(isDE, "Nur erlaubte Ziele, Exfiltration blocken.", "Only allowed targets, block exfiltration.")],
              [3, pick(isDE, "mTLS aktivieren", "Enable mTLS"), pick(isDE, "Agent-zu-Agent Traffic absichern.", "Secure agent-to-agent traffic.")],
              [4, pick(isDE, "Audit Logs an SIEM", "Audit logs to SIEM"), pick(isDE, "Compliance-konforme Nachverfolgbarkeit.", "Compliance-grade traceability.")],
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
            <a href={`/${locale}/moltbot/ai-agent-security-latam`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security LatAm</div>
              <div className="text-sm text-gray-300">{pick(isDE, "LatAm Hub", "LatAm hub")}</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Roast My Moltbot</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Roast starten", "Start the roast")}</div>
            </a>
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Infrastruktur prüfen", "Check infrastructure")}</div>
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
