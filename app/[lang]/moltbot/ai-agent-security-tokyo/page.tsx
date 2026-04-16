import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-security-tokyo"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Security Tokyo: APPI, Zero-Trust, Moltbot | ClawGuru"
    : "AI Agent Security Tokyo: APPI, Zero-Trust, Moltbot | ClawGuru"
  const description = isDE
    ? "Tokyo Security Guide für AI-Agents: APPI-Compliance, Zero-Trust und sofortige Fixes für Moltbot." 
    : "Tokyo security guide for AI agents: APPI compliance, zero-trust and immediate fixes for Moltbot." 
  return {
    title,
    description,
    keywords: ["ai agent security tokyo", "appi compliance", "moltbot security japan", "zero trust ai"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function AIAgentSecurityTokyoPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Security Tokyo" : "AI Agent Security Tokyo"}</h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Tokyo Playbook für AI-Agent-Security: APPI, Zero-Trust und reale Fixes für Moltbot." 
              : "Tokyo playbook for AI agent security: APPI, zero-trust and real fixes for Moltbot."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Tokyo Fokus" : "Tokyo focus"}</h2>
          <div className="space-y-4">
            {[
              [isDE ? "APPI Compliance" : "APPI compliance", isDE ? "Datenzugriff, Logging und Retention klar regeln." : "Define data access, logging and retention clearly."],
              [isDE ? "Vendor Risk" : "Vendor risk", isDE ? "Abhängigkeiten und SaaS-Integrationen hart absichern." : "Lock down dependencies and SaaS integrations."],
              [isDE ? "Zero-Trust by Default" : "Zero-trust by default", isDE ? "mTLS und Micro-Segmentation als Standard." : "mTLS and micro-segmentation as default."],
              [isDE ? "Incident Readiness" : "Incident readiness", isDE ? "Playbooks + On-Call mit klarer Verantwortung." : "Playbooks + on-call with clear ownership."],
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
              [1, isDE ? "Keys in Japan rotieren" : "Rotate keys in Japan", isDE ? "Lokale Secrets getrennt halten und rotieren." : "Separate and rotate local secrets."],
              [2, isDE ? "Egress auf Allowlist" : "Egress allowlist", isDE ? "Nur erlaubte Ziele für Tokyo-Region." : "Only allowed destinations for Tokyo region."],
              [3, isDE ? "mTLS aktivieren" : "Enable mTLS", isDE ? "Agent-zu-Agent Traffic hart absichern." : "Secure agent-to-agent traffic."],
              [4, isDE ? "Audit Logs an SIEM" : "Audit logs to SIEM", isDE ? "APPI-konforme Nachverfolgbarkeit sicherstellen." : "Ensure APPI-compliant traceability."],
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
