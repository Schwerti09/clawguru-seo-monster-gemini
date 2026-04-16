import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-resilience-patterns"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Resilience Patterns: Resilienz-Muster für AI-Agents | ClawGuru"
    : "AI Agent Resilience Patterns: Resilience Patterns for AI Agents | ClawGuru"
  const description = isDE
    ? "AI Agent Resilience Patterns für Moltbot-Deployments. Circuit Breaker, Retry Logic, Fallback Strategies und Graceful Degradation für hochverfügbare AI-Agent-Systeme."
    : "AI agent resilience patterns for Moltbot deployments. Circuit breaker, retry logic, fallback strategies and graceful degradation for high-availability AI agent systems."
  return {
    title, description,
    keywords: ["ai agent resilience", "circuit breaker", "retry logic", "fallback strategies", "graceful degradation", "high availability", "moltbot security", "resilience patterns 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentResiliencePatternsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "AI Agent Resilience Patterns" : "AI Agent Resilience Patterns"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "AI Agent Resilience Patterns für Moltbot-Deployments. Circuit Breaker, Retry Logic, Fallback Strategies und Graceful Degradation für hochverfügbare AI-Agent-Systeme."
              : "AI agent resilience patterns for Moltbot deployments. Circuit breaker, retry logic, fallback strategies and graceful degradation for high-availability AI agent systems."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools." : "This guide is for hardening your own systems. No attack tools."}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kernkonzepte" : "Core Concepts"}</h2>
          <div className="space-y-4">
            {[
              ["1. Circuit Breaker Pattern", isDE ? "Automatisches Unterbrechen von fehlerhaften Agent-Verbindungen. Verhindert Kaskadenfehler in Multi-Agent-Systemen." : "Automatic interruption of faulty agent connections. Prevents cascade failures in multi-agent systems."],
              ["2. Retry Logic mit Backoff", isDE ? "Intelligente Wiederholungsversuche mit exponential Backoff und Jitter. Verhindert Thundering Herd bei Systemausfällen." : "Intelligent retries with exponential backoff and jitter. Prevents thundering herd on system failures."],
              ["3. Fallback Strategies", isDE ? "Definierte Fallback-Verhalten für jeden Agent-Aufruf. Cached Results, Default Responses und Degraded Mode." : "Defined fallback behaviors for every agent call. Cached results, default responses and degraded mode."],
              ["4. Graceful Degradation", isDE ? "AI-Agents liefern reduzierte aber funktionierende Ergebnisse bei Teilausfällen. Kein totales Systemversagen." : "AI agents deliver reduced but functional results on partial failures. No total system failure."],
              ["5. Health Checks & Self-Healing", isDE ? "Automatische Health Checks für Agent-Komponenten. Self-Healing durch automatischen Neustart fehlerhafter Agents." : "Automatic health checks for agent components. Self-healing through automatic restart of failed agents."],
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
              <h3 className="font-semibold text-green-300 mb-2">{isDE ? "Bulkhead Pattern" : "Bulkhead Pattern"}</h3>
              <p className="text-sm text-green-200">{isDE ? "Isolierung von Agent-Ressourcen durch Bulkheads. Fehler in einer Komponente beeinflussen andere nicht." : "Isolation of agent resources through bulkheads. Failures in one component do not affect others."}</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">{isDE ? "Timeout Management" : "Timeout Management"}</h3>
              <p className="text-sm text-blue-200">{isDE ? "Präzises Timeout Management für alle Agent-Aufrufe. Verhindert endloses Warten und Resource Starvation." : "Precise timeout management for all agent calls. Prevents endless waiting and resource starvation."}</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "Chaos Engineering" : "Chaos Engineering"}</h3>
              <p className="text-sm text-yellow-200">{isDE ? "Gezielte Fehlerinjektion in AI-Agent-Systemen. Validierung der Resilience-Patterns unter realen Ausfallbedingungen." : "Targeted fault injection in AI agent systems. Validation of resilience patterns under real failure conditions."}</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{isDE ? "Multi-Region Failover" : "Multi-Region Failover"}</h3>
              <p className="text-sm text-red-200">{isDE ? "Automatischer Failover auf sekundäre Region bei Totalausfall. RTO und RPO für AI-Agent-Systeme definieren." : "Automatic failover to secondary region on total failure. Define RTO and RPO for AI agent systems."}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Implementierungsschritte" : "Implementation Steps"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "Failure Modes kartieren" : "Map failure modes", isDE ? "Identifizieren Sie alle möglichen Ausfallszenarien Ihrer AI-Agents. FMEA (Failure Mode and Effects Analysis)." : "Identify all possible failure scenarios for your AI agents. FMEA (Failure Mode and Effects Analysis)."],
              [2, isDE ? "Circuit Breaker implementieren" : "Implement circuit breaker", isDE ? "Bauen Sie Circuit Breaker für alle externen Agent-Aufrufe. Libraries: Resilience4j, Polly, pybreaker." : "Build circuit breakers for all external agent calls. Libraries: Resilience4j, Polly, pybreaker."],
              [3, isDE ? "Retry-Strategie definieren" : "Define retry strategy", isDE ? "Konfigurieren Sie Retry-Policies mit Backoff. Max Retries, Backoff-Faktor und Jitter festlegen." : "Configure retry policies with backoff. Set max retries, backoff factor and jitter."],
              [4, isDE ? "Fallbacks implementieren" : "Implement fallbacks", isDE ? "Jeden kritischen Agent-Aufruf mit Fallback absichern. Cached Results oder Default-Antworten vorbereiten." : "Secure every critical agent call with a fallback. Prepare cached results or default responses."],
              [5, isDE ? "Chaos Tests durchführen" : "Run chaos tests", isDE ? "Validieren Sie Resilience-Patterns mit Chaos Engineering. Gremlin, Chaos Monkey oder LitmusChaos." : "Validate resilience patterns with chaos engineering. Gremlin, Chaos Monkey or LitmusChaos."],
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
              <div className="text-sm text-gray-300">{isDE ? "KI-generierte Security Runbooks" : "AI-generated security runbooks"}</div>
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
