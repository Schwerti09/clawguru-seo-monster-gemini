import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/moltbot-incident-response"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Moltbot Incident Response: Incident Management für AI-Agents | ClawGuru"
    : "Moltbot Incident Response: Incident Management for AI Agents | ClawGuru"
  const description = isDE
    ? "Incident Response für Moltbot-Deployments. Playbooks, Forensik, Recovery und Post-Mortem-Analyse für AI-Agents. Mit Moltbot automatisierbar."
    : "Incident response for Moltbot deployments. Playbooks, forensics, recovery and post-mortem analysis for AI agents. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "moltbot incident response", "incident management", "incident playbooks",
      "forensics", "recovery procedures", "post mortem analysis",
      "moltbot security", "ai agent incident response", "incident response 2026",
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

export default function MoltbotIncidentResponsePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Moltbot Incident Response" : "Moltbot Incident Response"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Incident Response für Moltbot-Deployments. Playbooks, Forensik, Recovery und Post-Mortem-Analyse für AI-Agents."
              : "Incident response for Moltbot deployments. Playbooks, forensics, recovery and post-mortem analysis for AI agents."}
          </p>
        </div>

        {/* Not a Pentest Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        {/* Incident Response Lifecycle */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Incident Response Lifecycle" : "Incident Response Lifecycle"}
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "1. Preparation" : "1. Preparation"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Incident Response Plan erstellen, Team definieren, Playbooks entwickeln und Tools bereitstellen."
                  : "Create incident response plan, define team, develop playbooks and prepare tools."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "2. Detection & Analysis" : "2. Detection & Analysis"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Incident erkennen, klassifizieren und analysieren. Root Cause Analysis und Impact Assessment."
                  : "Detect, classify and analyze incident. Root cause analysis and impact assessment."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "3. Containment" : "3. Containment"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Incident eindämmen und Ausbreitung verhindern. Isolation von betroffenen Systemen."
                  : "Contain incident and prevent spread. Isolate affected systems."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "4. Eradication" : "4. Eradication"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Root Cause eliminieren und Schadsoftware entfernen. Systeme bereinigen und härten."
                  : "Eliminate root cause and remove malware. Clean and harden systems."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "5. Recovery" : "5. Recovery"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Systeme wiederherstellen und validieren. Business Continuity und Disaster Recovery."
                  : "Restore systems and validate. Business continuity and disaster recovery."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "6. Post-Mortem" : "6. Post-Mortem"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Incident analysieren, Lessons Learned dokumentieren und Prozesse verbessern."
                  : "Analyze incident, document lessons learned and improve processes."}
              </p>
            </div>
          </div>
        </section>

        {/* AI-Specific Incidents */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "AI-Spezifische Incidents" : "AI-Specific Incidents"}
          </h2>
          <div className="space-y-4">
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Prompt Injection Attacks" : "Prompt Injection Attacks"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Bösartige Prompts die AI-Verhalten manipulieren. Detection durch Output-Anomalie-Erkennung."
                  : "Malicious prompts that manipulate AI behavior. Detection through output anomaly detection."}
              </p>
            </div>
            <div className="bg-orange-900 p-4 rounded-lg border border-orange-700">
              <h3 className="font-semibold text-orange-300 mb-2">
                {isDE ? "Model Poisoning Incidents" : "Model Poisoning Incidents"}
              </h3>
              <p className="text-sm text-orange-200">
                {isDE
                  ? "Kompromittierte Trainingsdaten oder Modelle. Detection durch Behavioral Drift Analysis."
                  : "Compromised training data or models. Detection through behavioral drift analysis."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "Data Exfiltration" : "Data Exfiltration"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Unbefugter Datenabfluss durch AI-Agents. Detection durch Data Loss Prevention (DLP)."
                  : "Unauthorized data exfiltration through AI agents. Detection through Data Loss Prevention (DLP)."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "Model Extraction" : "Model Extraction"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Extraktion von Modellparametern durch Abfragen. Detection durch Query Pattern Analysis."
                  : "Extraction of model parameters through queries. Detection through query pattern analysis."}
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
                  {isDE ? "Incident Response Plan erstellen" : "Create incident response plan"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Erstellen Sie einen Incident Response Plan für Moltbot-Deployments. Definieren Sie Rollen und Verantwortlichkeiten."
                    : "Create an incident response plan for Moltbot deployments. Define roles and responsibilities."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Playbooks entwickeln" : "Develop playbooks"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Erstellen Sie Playbooks für häufige Moltbot-Incidents (Prompt Injection, Model Poisoning, Data Exfiltration)."
                    : "Create playbooks for common Moltbot incidents (prompt injection, model poisoning, data exfiltration)."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Detection-Mechanismen einrichten" : "Set up detection mechanisms"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Konfigurieren Sie SIEM, Anomalie-Erkennung und Alerting für Moltbot-Incidents."
                    : "Configure SIEM, anomaly detection and alerting for Moltbot incidents."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Forensik-Tools bereitstellen" : "Provide forensics tools"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Bereiten Sie Forensik-Tools für Moltbot-Systeme vor. Log-Analyse und System-Inspektion."
                    : "Prepare forensics tools for Moltbot systems. Log analysis and system inspection."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Post-Mortem-Prozess etablieren" : "Establish post-mortem process"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Etablieren Sie einen Post-Mortem-Prozess für Moltbot-Incidents. Lessons Learned und Prozess-Verbesserungen."
                    : "Establish a post-mortem process for Moltbot incidents. Lessons learned and process improvements."}
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
