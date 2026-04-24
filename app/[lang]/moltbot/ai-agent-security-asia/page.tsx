import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-security-asia"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Security Asia: Tokyo, Singapore, Bangalore | ClawGuru", "AI Agent Security Asia: Tokyo, Singapore, Bangalore | ClawGuru")
  const description = pick(isDE, "Asia Security Hub für AI-Agents: lokale Compliance, Zero-Trust und ausführbare Fixes für Moltbot-Deployments.", "Asia security hub for AI agents: local compliance, zero-trust and executable fixes for Moltbot deployments.")
  return {
    title,
    description,
    keywords: ["ai agent security asia", "tokyo security", "singapore security", "bangalore security", "ai compliance asia"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: { index: false, follow: true },
  }
}

export default function AIAgentSecurityAsiaPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "AI Agent Security Asia", "AI Agent Security Asia")}</h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "Asia Hub für AI-Agent-Security: regulatorische Anforderungen, Zero-Trust und praxisnahe Fixes für Moltbot.", "Asia hub for AI agent security: regulatory requirements, zero-trust and practical fixes for Moltbot.")}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Regionaler Fokus", "Regional focus")}</h2>
          <div className="space-y-4">
            {[
              [pick(isDE, "Data Residency", "Data residency"), pick(isDE, "Datenhaltung und lokale Verarbeitung sind in vielen Regionen Pflicht (APPI, PDPA, DPDP).", "Local data residency and processing are required in many regions (APPI, PDPA, DPDP).")],
              [pick(isDE, "Third-Party Risk", "Third-party risk"), pick(isDE, "B2B-Integrationen mit regionalen Providern brauchen klare Allowlist-Strategien.", "B2B integrations with regional providers need strict allowlist strategies.")],
              [pick(isDE, "Supply Chain Hardening", "Supply chain hardening"), pick(isDE, "Modell- und Dependency-Trust sichern, bevor sie in Produktions-Agents gehen.", "Secure model and dependency trust before production agents.")],
              [pick(isDE, "Zero-Trust Networking", "Zero-trust networking"), pick(isDE, "mTLS und Micro-Segmentation sind Pflicht für multi-region Deployments.", "mTLS and micro-segmentation are mandatory for multi-region deployments.")],
              [pick(isDE, "Incident Response Readiness", "Incident response readiness"), pick(isDE, "Cross-border Incident Handling braucht klare Playbooks und Ownership.", "Cross-border incident handling needs clear playbooks and ownership.")],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Sofort-Fixes für Asia Deployments", "Immediate fixes for Asia deployments")}</h2>
          <div className="space-y-6">
            {[
              [1, pick(isDE, "Regional Keys pro Zone", "Regional keys per zone"), pick(isDE, "Separiere Secrets pro Region. Kein globales Credential-Sharing.", "Separate secrets per region. No global credential sharing.")],
              [2, pick(isDE, "Egress-Policies aktivieren", "Enable egress policies"), pick(isDE, "Nur erlaubte Endpoints erreichen. Blocke exfiltration by default.", "Only allowed endpoints reachable. Block exfiltration by default.")],
              [3, pick(isDE, "mTLS zwischen Agents", "mTLS between agents"), pick(isDE, "Kryptografisch gesicherter Ost-West-Traffic.", "Cryptographically secured east-west traffic.")],
              [4, pick(isDE, "Audit Logs an SIEM", "Audit logs to SIEM"), pick(isDE, "Regionale Compliance braucht lückenlose Audit Trails.", "Regional compliance requires complete audit trails.")],
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
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Infrastruktur prüfen", "Check infrastructure")}</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Fixes automatisieren", "Automate fixes")}</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Security Framework", "Security framework")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
