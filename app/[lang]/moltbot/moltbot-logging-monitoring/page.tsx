import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/moltbot-logging-monitoring"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Moltbot Logging & Monitoring: Audit-Logging für AI-Agents | ClawGuru"
    : "Moltbot Logging & Monitoring: Audit Logging for AI Agents | ClawGuru"
  const description = isDE
    ? "Audit-Logging und Echtzeit-Monitoring für Moltbot-Aktivitäten. SIEM-Integration, Anomalie-Erkennung und Alerting für AI-Agents. Mit Moltbot automatisierbar."
    : "Audit logging and real-time monitoring for Moltbot activities. SIEM integration, anomaly detection and alerting for AI agents. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "moltbot logging", "audit logging", "real-time monitoring",
      "siem integration", "anomaly detection", "moltbot security",
      "ai agent monitoring", "security monitoring 2026", "log management",
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

export default function MoltbotLoggingMonitoringPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Moltbot Logging & Monitoring" : "Moltbot Logging & Monitoring"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Audit-Logging und Echtzeit-Monitoring für Moltbot-Aktivitäten. SIEM-Integration, Anomalie-Erkennung und Alerting für AI-Agents."
              : "Audit logging and real-time monitoring for Moltbot activities. SIEM integration, anomaly detection and alerting for AI agents."}
          </p>
        </div>

        {/* Not a Pentest Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        {/* Core Concepts */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Kernkonzepte" : "Core Concepts"}
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "1. Audit-Logging" : "1. Audit Logging"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Komplettes Audit-Logging für alle Moltbot-Aktivitäten. Benutzeraktionen, API-Calls, Systemänderungen und Sicherheitsereignisse."
                  : "Complete audit logging for all Moltbot activities. User actions, API calls, system changes and security events."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "2. Echtzeit-Monitoring" : "2. Real-Time Monitoring"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Echtzeit-Überwachung von Moltbot-Metriken und Logs. Dashboards für Systemzustand und Performance."
                  : "Real-time monitoring of Moltbot metrics and logs. Dashboards for system state and performance."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "3. SIEM-Integration" : "3. SIEM Integration"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Integration mit Security Information and Event Management (SIEM) für zentrale Log-Analyse und Threat Detection."
                  : "Integration with Security Information and Event Management (SIEM) for centralized log analysis and threat detection."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "4. Anomalie-Erkennung" : "4. Anomaly Detection"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "KI-basierte Anomalie-Erkennung für Moltbot-Aktivitäten. Erkennung von ungewöhnlichem Verhalten und Sicherheitsbedrohungen."
                  : "AI-based anomaly detection for Moltbot activities. Detection of unusual behavior and security threats."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "5. Alerting & Notifikation" : "5. Alerting & Notification"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Automatisches Alerting für kritische Sicherheitsereignisse. E-Mail, Slack, PagerDuty und Webhook-Integration."
                  : "Automated alerting for critical security events. Email, Slack, PagerDuty and webhook integration."}
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Best Practices" : "Best Practices"}
          </h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">
                {isDE ? "Strukturierte Logs" : "Structured Logging"}
              </h3>
              <p className="text-sm text-green-200">
                {isDE
                  ? "Verwenden Sie strukturierte Logs (JSON) für bessere Analyse und SIEM-Integration."
                  : "Use structured logs (JSON) for better analysis and SIEM integration."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "Log-Retention Policy" : "Log Retention Policy"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Definieren Sie eine Log-Retention Policy basierend auf Compliance-Anforderungen (90 Tage bis 7 Jahre)."
                  : "Define a log retention policy based on compliance requirements (90 days to 7 years)."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "Log-Sampling" : "Log Sampling"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Verwenden Sie Log-Sampling für High-Volume Events. Vollständiges Logging für kritische Sicherheitsereignisse."
                  : "Use log sampling for high-volume events. Full logging for critical security events."}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Log-Tampering Protection" : "Log Tampering Protection"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Schützen Sie Logs vor Manipulation durch Write-Once-Storage und digitale Signaturen."
                  : "Protect logs from tampering through write-once storage and digital signatures."}
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
                  {isDE ? "Audit-Logging konfigurieren" : "Configure audit logging"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Aktivieren Sie Audit-Logging für alle Moltbot-Komponenten. Definieren Sie Log-Levels und -Formate."
                    : "Enable audit logging for all Moltbot components. Define log levels and formats."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "SIEM-Integration einrichten" : "Set up SIEM integration"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Integrieren Sie Moltbot-Logs mit einem SIEM-System (Splunk, ELK, Datadog)."
                    : "Integrate Moltbot logs with a SIEM system (Splunk, ELK, Datadog)."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Monitoring-Dashboards erstellen" : "Create monitoring dashboards"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Erstellen Sie Dashboards für Moltbot-Metriken, Logs und Sicherheitsereignisse."
                    : "Create dashboards for Moltbot metrics, logs and security events."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Anomalie-Erkennung aktivieren" : "Enable anomaly detection"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Konfigurieren Sie KI-basierte Anomalie-Erkennung für Moltbot-Aktivitäten."
                    : "Configure AI-based anomaly detection for Moltbot activities."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Alerting konfigurieren" : "Configure alerting"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Richten Sie Alerting für kritische Sicherheitsereignisse ein. Definieren Sie Alert-Regeln und -Kanäle."
                    : "Set up alerting for critical security events. Define alert rules and channels."}
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
                {isDE ? "KI-generierte Security Runbooks" : "AI-generated security runbooks"}
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
