import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-observability-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Observability Security: Sicherheits-Observability für AI-Agents | ClawGuru"
    : "AI Agent Observability Security: Security Observability for AI Agents | ClawGuru"
  const description = isDE
    ? "AI Agent Observability Security für Moltbot. Metrics, Traces, Logs und Security Events für AI-Agents. OpenTelemetry, SIEM-Integration und Anomaly Detection in Echtzeit."
    : "AI agent observability security for Moltbot. Metrics, traces, logs and security events for AI agents. OpenTelemetry, SIEM integration and real-time anomaly detection."
  return {
    title, description,
    keywords: ["ai agent observability", "security monitoring", "opentelemetry", "siem integration", "anomaly detection", "moltbot security", "observability security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentObservabilitySecurityPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "AI Agent Observability Security" : "AI Agent Observability Security"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "AI Agent Observability Security für Moltbot. Metrics, Traces, Logs und Security Events für AI-Agents. OpenTelemetry, SIEM-Integration und Anomaly Detection in Echtzeit."
              : "AI agent observability security for Moltbot. Metrics, traces, logs and security events for AI agents. OpenTelemetry, SIEM integration and real-time anomaly detection."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools." : "This guide is for hardening your own systems. No attack tools."}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kernkonzepte" : "Core Concepts"}</h2>
          <div className="space-y-4">
            {[
              ["1. Security Metrics", isDE ? "Sicherheits-relevante Metriken für AI-Agents. Error Rates, Latency, Token Usage, Tool-Call Frequency und Anomalie-Indikatoren." : "Security-relevant metrics for AI agents. Error rates, latency, token usage, tool-call frequency and anomaly indicators."],
              ["2. Distributed Tracing", isDE ? "End-to-End Tracing für Multi-Agent-Workflows. Vollständige Sichtbarkeit über Agent-Ketten und Tool-Aufrufe." : "End-to-end tracing for multi-agent workflows. Full visibility over agent chains and tool calls."],
              ["3. Structured Security Logging", isDE ? "Strukturiertes Logging aller sicherheitsrelevanten Agent-Aktionen. JSON-Format für SIEM-Kompatibilität." : "Structured logging of all security-relevant agent actions. JSON format for SIEM compatibility."],
              ["4. Anomaly Detection", isDE ? "Automatische Erkennung ungewöhnlicher Agent-Verhaltensweisen. ML-basierte Baseline-Modelle und Rule-basierte Alerts." : "Automatic detection of unusual agent behaviors. ML-based baseline models and rule-based alerts."],
              ["5. SIEM Integration", isDE ? "Integration mit Security Information and Event Management Systemen. Splunk, Elastic SIEM oder Microsoft Sentinel." : "Integration with Security Information and Event Management systems. Splunk, Elastic SIEM or Microsoft Sentinel."],
            ].map(([title, desc]) => (
              <div key={title as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{title}</h3>
                <p className="text-sm text-gray-300">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Fortgeschrittene Techniken" : "Advanced Techniques"}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">{isDE ? "OpenTelemetry für AI-Agents" : "OpenTelemetry for AI Agents"}</h3>
              <p className="text-sm text-green-200">{isDE ? "Standardisierte Observability mit OpenTelemetry. Einheitliche Traces, Metrics und Logs über alle Agent-Komponenten." : "Standardized observability with OpenTelemetry. Unified traces, metrics and logs across all agent components."}</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">{isDE ? "Behavioral Baselines" : "Behavioral Baselines"}</h3>
              <p className="text-sm text-blue-200">{isDE ? "ML-basierte Verhaltens-Baselines für jeden Agent. Erkennung von Drift und abnormalem Verhalten in Echtzeit." : "ML-based behavioral baselines for each agent. Detection of drift and abnormal behavior in real-time."}</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "Security Dashboards" : "Security Dashboards"}</h3>
              <p className="text-sm text-yellow-200">{isDE ? "Echtzeit Security Dashboards mit Grafana oder Kibana. SOC-ready Visualisierungen für AI-Agent-Security." : "Real-time security dashboards with Grafana or Kibana. SOC-ready visualizations for AI agent security."}</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{isDE ? "Alert Fatigue vermeiden" : "Avoid Alert Fatigue"}</h3>
              <p className="text-sm text-red-200">{isDE ? "Intelligente Alert-Aggregation und Priorisierung. ML-basiertes Alert Scoring und automatische Deduplizierung." : "Intelligent alert aggregation and prioritization. ML-based alert scoring and automatic deduplication."}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Implementierungsschritte" : "Implementation Steps"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "OpenTelemetry SDK integrieren" : "Integrate OpenTelemetry SDK", isDE ? "OTel SDK in alle Agent-Komponenten einbinden. Auto-Instrumentation wo möglich, manuell für Custom Spans." : "Integrate OTel SDK into all agent components. Auto-instrumentation where possible, manual for custom spans."],
              [2, isDE ? "Security Events definieren" : "Define security events", isDE ? "Katalog sicherheitsrelevanter Events erstellen. Tool-Calls, Fehler, Auth-Events und Policy-Verletzungen." : "Create catalog of security-relevant events. Tool calls, errors, auth events and policy violations."],
              [3, isDE ? "SIEM verbinden" : "Connect SIEM", isDE ? "Logs und Events an SIEM weiterleiten. Format normalisieren (CEF oder LEEF) für einfache Korrelation." : "Forward logs and events to SIEM. Normalize format (CEF or LEEF) for easy correlation."],
              [4, isDE ? "Anomaly Detection konfigurieren" : "Configure anomaly detection", isDE ? "ML-Modelle für Baseline-Verhalten trainieren. Alerts bei Abweichungen > 2 Standardabweichungen." : "Train ML models for baseline behavior. Alerts on deviations > 2 standard deviations."],
              [5, isDE ? "Incident Response verknüpfen" : "Link incident response", isDE ? "Alerts direkt mit IR-Playbooks verknüpfen. PagerDuty, Opsgenie oder automatisierte SOAR-Workflows." : "Link alerts directly to IR playbooks. PagerDuty, Opsgenie or automated SOAR workflows."],
            ].map(([n, title, desc]) => (
              <div key={n as number} className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{n}</div>
                <div>
                  <div className="font-semibold text-gray-100 mb-2">{title}</div>
                  <div className="text-sm text-gray-300">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{isDE ? "Infrastruktur auf Schwachstellen prüfen" : "Check infrastructure for vulnerabilities"}</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">{isDE ? "Expert-validierte Security Runbooks" : "Expert-validated security runbooks"}</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw</div>
              <div className="text-sm text-gray-300">{isDE ? "OpenClaw Security Framework" : "OpenClaw Security Framework"}</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Roast My Moltbot</div>
              <div className="text-sm text-gray-300">{isDE ? "Moltbot Security Testing" : "Moltbot security testing"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
