import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/moltbot-compliance-framework"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Moltbot Compliance Framework: GDPR/DSGVO, SOC2, ISO27001 für AI-Agents | ClawGuru"
    : "Moltbot Compliance Framework: GDPR/DSGVO, SOC2, ISO27001 for AI Agents | ClawGuru"
  const description = isDE
    ? "GDPR/DSGVO, SOC2, ISO27001 für Moltbot-Deployments. Compliance-Automatisierung, Audit-Reporting und Governance für AI-Agents. Mit Moltbot automatisierbar."
    : "GDPR/DSGVO, SOC2, ISO27001 for Moltbot deployments. Compliance automation, audit reporting and governance for AI agents. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "moltbot compliance", "gdpr dsgvo", "soc2 compliance",
      "iso27001", "compliance automation", "audit reporting",
      "moltbot security", "ai agent compliance", "compliance framework 2026",
      "security check", "runbooks", "openclaw"
    ],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: ["/og-image.png"]
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function MoltbotComplianceFrameworkPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Moltbot Compliance Framework" : "Moltbot Compliance Framework"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "GDPR/DSGVO, SOC2, ISO27001 für Moltbot-Deployments. Compliance-Automatisierung, Audit-Reporting und Governance für AI-Agents."
              : "GDPR/DSGVO, SOC2, ISO27001 for Moltbot deployments. Compliance automation, audit reporting and governance for AI agents."}
          </p>
        </div>

        {/* Not a Pentest Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        {/* Core Standards */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Compliance-Standards" : "Compliance Standards"}
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "1. GDPR/DSGVO" : "1. GDPR/DSGVO"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Datenschutz-Grundverordnung für Moltbot-Datenverarbeitung. Data Minimization, Consent Management und Recht auf Löschung."
                  : "General Data Protection Regulation for Moltbot data processing. Data minimization, consent management and right to deletion."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "2. SOC2 Type II" : "2. SOC2 Type II"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "SOC2 Type II Compliance für Moltbot-Sicherheit. Security, Availability, Processing Integrity und Confidentiality."
                  : "SOC2 Type II compliance for Moltbot security. Security, availability, processing integrity and confidentiality."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "3. ISO27001" : "3. ISO27001"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "ISO27001 Information Security Management System für Moltbot-Deployments. ISMS-Implementierung und Zertifizierung."
                  : "ISO27001 Information Security Management System for Moltbot deployments. ISMS implementation and certification."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "4. NIS2" : "4. NIS2"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "NIS2-Richtlinie für kritische Infrastruktur. Incident Reporting und Cybersecurity-Maßnahmen für Moltbot."
                  : "NIS2 directive for critical infrastructure. Incident reporting and cybersecurity measures for Moltbot."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "5. AI Act" : "5. AI Act"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "EU AI Act für KI-Systeme. Risk-Based Classification, Transparency Requirements und Conformity Assessment für Moltbot."
                  : "EU AI Act for AI systems. Risk-based classification, transparency requirements and conformity assessment for Moltbot."}
              </p>
            </div>
          </div>
        </section>

        {/* Compliance Automation */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Compliance-Automatisierung" : "Compliance Automation"}
          </h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">
                {isDE ? "Automated Compliance Checks" : "Automated Compliance Checks"}
              </h3>
              <p className="text-sm text-green-200">
                {isDE
                  ? "Automatisierte Compliance-Checks für Moltbot-Konfigurationen. Continuous Compliance Monitoring."
                  : "Automated compliance checks for Moltbot configurations. Continuous compliance monitoring."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "Audit-Reporting" : "Audit Reporting"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Automatisierte Audit-Reports für Compliance-Standards. SOC2, ISO27001 und GDPR-Reporting."
                  : "Automated audit reports for compliance standards. SOC2, ISO27001 and GDPR reporting."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "Policy Management" : "Policy Management"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Zentralisierte Policy-Verwaltung für Moltbot-Deployments. Policy-as-Code und Versionierung."
                  : "Centralized policy management for Moltbot deployments. Policy-as-code and versioning."}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Evidence Collection" : "Evidence Collection"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Automatisierte Evidence Collection für Audits. Screenshots, Logs und Konfigurationen."
                  : "Automated evidence collection for audits. Screenshots, logs and configurations."}
              </p>
            </div>
          </div>
        </section>

        {/* Implementation Steps */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Implementierungsschritte" : "Implementation Steps"}
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Compliance-Standards identifizieren" : "Identify compliance standards"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Bestimmen Sie die relevanten Compliance-Standards für Ihre Moltbot-Deployments (GDPR, SOC2, ISO27001, NIS2, AI Act)."
                    : "Determine relevant compliance standards for your Moltbot deployments (GDPR, SOC2, ISO27001, NIS2, AI Act)."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Gap-Analyse durchführen" : "Perform gap analysis"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Führen Sie eine Gap-Analyse zwischen aktuellen Moltbot-Konfigurationen und Compliance-Anforderungen durch."
                    : "Perform a gap analysis between current Moltbot configurations and compliance requirements."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Compliance-Kontrollen implementieren" : "Implement compliance controls"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie technische und organisatorische Kontrollen für Compliance-Standards."
                    : "Implement technical and organizational controls for compliance standards."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Compliance-Automatisierung einrichten" : "Set up compliance automation"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Konfigurieren Sie automatisierte Compliance-Checks, Audit-Reporting und Evidence Collection."
                    : "Configure automated compliance checks, audit reporting and evidence collection."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Regelmäßige Audits durchführen" : "Conduct regular audits"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Führen Sie regelmäßige interne und externe Audits durch. Aktualisieren Sie Compliance-Dokumentation."
                    : "Conduct regular internal and external audits. Update compliance documentation."}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Weiterführende Ressourcen" : "Further Resources"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "Security Check" : "Security Check"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "Überprüfen Sie Ihre Infrastruktur auf Schwachstellen" : "Check your infrastructure for vulnerabilities"}
              </div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "Runbooks" : "Runbooks"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "Expert-validierte Security Runbooks" : "Expert-validated security runbooks"}
              </div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "OpenClaw" : "OpenClaw"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "OpenClaw Security Framework" : "OpenClaw Security Framework"}
              </div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "Roast My Moltbot" : "Roast My Moltbot"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "Moltbot Security Testing" : "Moltbot security testing"}
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
