import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-context-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Context Security: Kontext-Sicherheit für AI-Agents | ClawGuru"
    : "AI Agent Context Security: Context Security for AI Agents | ClawGuru"
  const description = isDE
    ? "AI Agent Context Security für Moltbot. Context Window Isolation, Prompt Injection Prevention, Cross-Session Contamination und Kontext-Manipulation verhindern."
    : "AI agent context security for Moltbot. Context window isolation, prompt injection prevention, cross-session contamination and context manipulation prevention."
  return {
    title, description,
    keywords: ["ai agent context security", "context window isolation", "prompt injection", "cross session contamination", "context manipulation", "moltbot security", "context security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentContextSecurityPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "AI Agent Context Security" : "AI Agent Context Security"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "AI Agent Context Security für Moltbot. Context Window Isolation, Prompt Injection Prevention, Cross-Session Contamination und Kontext-Manipulation verhindern."
              : "AI agent context security for Moltbot. Context window isolation, prompt injection prevention, cross-session contamination and context manipulation prevention."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools." : "This guide is for hardening your own systems. No attack tools."}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kernkonzepte" : "Core Concepts"}</h2>
          <div className="space-y-4">
            {[
              ["1. Context Window Isolation", isDE ? "Strikte Isolierung von Kontext-Fenstern zwischen verschiedenen Nutzern und Sessions. Verhindert Cross-Tenant Datenlecks." : "Strict isolation of context windows between different users and sessions. Prevents cross-tenant data leaks."],
              ["2. Prompt Injection Prevention", isDE ? "Schutz vor Prompt Injection durch Input Sanitization und Instruction Hierarchies. System Prompt Integrität sicherstellen." : "Protection against prompt injection through input sanitization and instruction hierarchies. Ensure system prompt integrity."],
              ["3. Cross-Session Contamination", isDE ? "Verhinderung von Datenkontamination zwischen unabhängigen Agent-Sessions. Memory Isolation und Session Cleanup." : "Prevention of data contamination between independent agent sessions. Memory isolation and session cleanup."],
              ["4. Context Validation", isDE ? "Validierung aller Kontext-Inputs auf Malicious Content. Schema-Validierung und Content-Filterung für Agent-Prompts." : "Validation of all context inputs for malicious content. Schema validation and content filtering for agent prompts."],
              ["5. System Prompt Hardening", isDE ? "Härtung des System-Prompts gegen Manipulation. Jailbreak-resistente Formulierungen und Instruction Defense." : "Hardening of the system prompt against manipulation. Jailbreak-resistant formulations and instruction defense."],
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
              <h3 className="font-semibold text-green-300 mb-2">{isDE ? "Instruction Hierarchy Enforcement" : "Instruction Hierarchy Enforcement"}</h3>
              <p className="text-sm text-green-200">{isDE ? "Durchsetzung einer klaren Instruction Hierarchy: System > Developer > User. Verhindert User-Override von System-Anweisungen." : "Enforcement of a clear instruction hierarchy: System > Developer > User. Prevents user override of system instructions."}</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">{isDE ? "Context Integrity Monitoring" : "Context Integrity Monitoring"}</h3>
              <p className="text-sm text-blue-200">{isDE ? "Real-time Monitoring der Kontext-Integrität. Erkennung von Injection-Versuchen und manipulierten Inputs." : "Real-time monitoring of context integrity. Detection of injection attempts and manipulated inputs."}</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "Secure Context Handoff" : "Secure Context Handoff"}</h3>
              <p className="text-sm text-yellow-200">{isDE ? "Sicherer Kontext-Transfer zwischen Agents in Multi-Agent-Systemen. Signierte Kontext-Pakete und Integritätsprüfung." : "Secure context transfer between agents in multi-agent systems. Signed context packages and integrity verification."}</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{isDE ? "Context Poisoning Defense" : "Context Poisoning Defense"}</h3>
              <p className="text-sm text-red-200">{isDE ? "Schutz vor gezielter Vergiftung des Agent-Kontexts durch externe Datenquellen (Web, RAG, Tools)." : "Protection against deliberate poisoning of agent context through external data sources (web, RAG, tools)."}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Implementierungsschritte" : "Implementation Steps"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "Context Boundaries definieren" : "Define context boundaries", isDE ? "Klare Grenzen zwischen System-, Developer- und User-Kontext definieren. Isolation auf Ebene der LLM API." : "Define clear boundaries between system, developer and user context. Isolation at the LLM API level."],
              [2, isDE ? "Input Sanitization implementieren" : "Implement input sanitization", isDE ? "Alle User-Inputs bereinigen bevor sie in den Kontext einfließen. Filterung von Injection-Patterns." : "Sanitize all user inputs before they flow into context. Filter injection patterns."],
              [3, isDE ? "Session Isolation sicherstellen" : "Ensure session isolation", isDE ? "Jede Agent-Session vollständig isolieren. Kein Kontext-Sharing zwischen verschiedenen Nutzern." : "Fully isolate every agent session. No context sharing between different users."],
              [4, isDE ? "System Prompt härten" : "Harden system prompt", isDE ? "System Prompt mit Anti-Jailbreak-Formulierungen versehen. Regelmäßige Tests gegen bekannte Jailbreak-Patterns." : "Equip system prompt with anti-jailbreak formulations. Regular tests against known jailbreak patterns."],
              [5, isDE ? "Context Monitoring aktivieren" : "Enable context monitoring", isDE ? "Alle Kontext-Manipulationsversuche loggen und alerten. Integration mit SIEM für Korrelation." : "Log and alert all context manipulation attempts. Integration with SIEM for correlation."],
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
