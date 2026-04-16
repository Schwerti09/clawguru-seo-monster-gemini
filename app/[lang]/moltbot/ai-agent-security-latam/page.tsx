import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-security-latam"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Security LatAm: São Paulo, Mexico City, Buenos Aires | ClawGuru"
    : "AI Agent Security LatAm: Sao Paulo, Mexico City, Buenos Aires | ClawGuru"
  const description = isDE
    ? "LatAm Security Hub für AI-Agents: lokale Compliance, Zero-Trust und ausführbare Fixes für Moltbot-Deployments."
    : "LatAm security hub for AI agents: local compliance, zero-trust and executable fixes for Moltbot deployments."
  return {
    title,
    description,
    keywords: ["ai agent security latam", "sao paulo security", "mexico city security", "ai compliance latam"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: { index: false, follow: true },
  }
}

export default function AIAgentSecurityLatAmPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Security LatAm" : "AI Agent Security LatAm"}</h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "LatAm Hub für AI-Agent-Security: lokale Compliance, Zero-Trust und schnelle Fixes für Moltbot." 
              : "LatAm hub for AI agent security: local compliance, zero-trust and fast fixes for Moltbot."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Regionaler Fokus" : "Regional focus"}</h2>
          <div className="space-y-4">
            {[
              [isDE ? "LGPD & LFPDPPP" : "LGPD & LFPDPPP", isDE ? "Regionale Datenschutzgesetze bestimmen Datenhaltung und Zugriff." : "Regional privacy laws dictate data residency and access."],
              [isDE ? "Payment & FinTech Exposure" : "Payment & FinTech exposure", isDE ? "Viele Deployments hängen an Payment Providern – besonders hart absichern." : "Many deployments depend on payment providers — lock them down."],
              [isDE ? "Third-Party Risk" : "Third-party risk", isDE ? "Integrationen mit lokalen Anbietern brauchen harte Allowlist-Policies." : "Local vendor integrations need strict allowlist policies."],
              [isDE ? "Cross-Border IR" : "Cross-border IR", isDE ? "Incidents müssen über Ländergrenzen hinweg sauber gehandelt werden." : "Incidents must be handled cleanly across borders."],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Sofort-Fixes" : "Immediate fixes"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "Regionale Secrets" : "Regional secrets", isDE ? "Keys pro Region trennen. Kein globales Shared Secret." : "Separate keys per region. No global shared secret."],
              [2, isDE ? "Egress-Policies" : "Egress policies", isDE ? "Nur erlaubte Ziele, Exfiltration blocken." : "Only allowed destinations, block exfiltration."],
              [3, isDE ? "mTLS Ost-West" : "mTLS east-west", isDE ? "Agent-zu-Agent Traffic verschlüsseln." : "Encrypt agent-to-agent traffic."],
              [4, isDE ? "Audit Trails" : "Audit trails", isDE ? "Lückenlose Logs für Compliance und IR." : "Complete logs for compliance and IR."],
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
            <a href={`/${locale}/moltbot/ai-agent-security-asia`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Asia</div>
              <div className="text-sm text-gray-300">{isDE ? "Asia Hub" : "Asia hub"}</div>
            </a>
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
          </div>
        </section>
      </div>
    </div>
  )
}
