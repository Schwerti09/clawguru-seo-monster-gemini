import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-input-validation"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Input Validation: Eingabevalidierung für AI-Agents | ClawGuru", "AI Agent Input Validation: Input Validation for AI Agents | ClawGuru")
  const description = pick(isDE, "AI Agent Input Validation für Moltbot. Schema Validation, Sanitization, Allowlisting und Multi-Layer Input Defense für sichere AI-Agent-Eingabeverarbeitung.", "AI agent input validation for Moltbot. Schema validation, sanitization, allowlisting and multi-layer input defense for secure AI agent input processing.")
  return {
    title, description,
    keywords: ["ai agent input validation", "schema validation", "input sanitization", "allowlisting", "input defense", "moltbot security", "input validation 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentInputValidationPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "AI Agent Input Validation", "AI Agent Input Validation")}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "AI Agent Input Validation für Moltbot. Schema Validation, Sanitization, Allowlisting und Multi-Layer Input Defense für sichere AI-Agent-Eingabeverarbeitung.", "AI agent input validation for Moltbot. Schema validation, sanitization, allowlisting and multi-layer input defense for secure AI agent input processing.")}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Kernkonzepte", "Core Concepts")}</h2>
          <div className="space-y-4">
            {[
              ["1. Schema-based Validation", pick(isDE, "Strikte Schema-Validierung aller Agent-Inputs. JSON Schema, Pydantic oder Zod für typsichere Eingabeverarbeitung.", "Strict schema validation of all agent inputs. JSON Schema, Pydantic or Zod for type-safe input processing.")],
              ["2. Input Sanitization", pick(isDE, "Bereinigung von Inputs vor Verarbeitung. HTML-Encoding, SQL-Escaping und Shell-Escaping für Tool-Aufrufe.", "Sanitization of inputs before processing. HTML encoding, SQL escaping and shell escaping for tool calls.")],
              ["3. Allowlisting statt Denylisting", pick(isDE, "Allowlist-basierte Validierung ist sicherer als Denylisting. Nur explizit erlaubte Werte und Patterns akzeptieren.", "Allowlist-based validation is safer than denylisting. Accept only explicitly allowed values and patterns.")],
              ["4. Length & Complexity Limits", pick(isDE, "Maximale Länge und Komplexität für alle Inputs begrenzen. Verhindert Token-Flooding und Ressourcen-Erschöpfung.", "Limit maximum length and complexity for all inputs. Prevents token flooding and resource exhaustion.")],
              ["5. Multi-Layer Defense", pick(isDE, "Mehrschichtige Input-Validierung. API Gateway → Application → LLM Layer alle mit eigenen Validierungslogiken.", "Multi-layer input validation. API gateway → application → LLM layer all with their own validation logic.")],
            ].map(([title, desc]) => (
              <div key={title as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{title}</h3>
                <p className="text-sm text-gray-300">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Fortgeschrittene Techniken", "Advanced Techniques")}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">{pick(isDE, "Semantic Input Validation", "Semantic Input Validation")}</h3>
              <p className="text-sm text-green-200">{pick(isDE, "Semantische Validierung von Inputs über reine Syntax hinaus. LLM-basierte Intent-Analyse für Malicious Content Detection.", "Semantic validation of inputs beyond pure syntax. LLM-based intent analysis for malicious content detection.")}</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">{pick(isDE, "Tool Call Validation", "Tool Call Validation")}</h3>
              <p className="text-sm text-blue-200">{pick(isDE, "Strikte Validierung von Tool-Call-Parametern vor Ausführung. Type Checking, Range Validation und Business Logic Checks.", "Strict validation of tool call parameters before execution. Type checking, range validation and business logic checks.")}</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">{pick(isDE, "Rate Limiting per Input Type", "Rate Limiting per Input Type")}</h3>
              <p className="text-sm text-yellow-200">{pick(isDE, "Granulares Rate Limiting je nach Input-Typ und Risikoprofil. Striktere Limits für sensible Operationen.", "Granular rate limiting depending on input type and risk profile. Stricter limits for sensitive operations.")}</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{pick(isDE, "Adversarial Input Testing", "Adversarial Input Testing")}</h3>
              <p className="text-sm text-red-200">{pick(isDE, "Regelmäßiges Testen der Validierungslogik mit Adversarial Inputs. Fuzzing und bekannte Injection-Patterns.", "Regular testing of validation logic with adversarial inputs. Fuzzing and known injection patterns.")}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Implementierungsschritte", "Implementation Steps")}</h2>
          <div className="space-y-6">
            {[
              [1, pick(isDE, "Input-Schemas definieren", "Define input schemas"), pick(isDE, "Alle möglichen Agent-Inputs mit JSON Schema oder Pydantic dokumentieren. Typen, Längen und erlaubte Werte.", "Document all possible agent inputs with JSON Schema or Pydantic. Types, lengths and allowed values.")],
              [2, pick(isDE, "Validierungs-Layer einbauen", "Add validation layer"), pick(isDE, "Zentralen Validierungs-Layer vor alle Agent-Eingaben schalten. Keine direkte LLM-Verarbeitung ohne Validierung.", "Place a central validation layer before all agent inputs. No direct LLM processing without validation.")],
              [3, pick(isDE, "Sanitization-Funktionen implementieren", "Implement sanitization functions"), pick(isDE, "Für jeden Input-Typ eigene Sanitization-Funktion. Encoding, Escaping und Normalisierung.", "Individual sanitization function for each input type. Encoding, escaping and normalization.")],
              [4, pick(isDE, "Tool Parameter validieren", "Validate tool parameters"), pick(isDE, "Jeder Tool-Call-Parameter einzeln validieren bevor Tool ausgeführt wird. Strict Mode für alle Tools.", "Validate each tool call parameter individually before the tool is executed. Strict mode for all tools.")],
              [5, pick(isDE, "Validierung testen & monitoren", "Test and monitor validation"), pick(isDE, "Automatisierte Tests für alle Validierungs-Regeln. Monitoring von Validation-Failures für Security Insights.", "Automated tests for all validation rules. Monitoring of validation failures for security insights.")],
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further Resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Infrastruktur auf Schwachstellen prüfen", "Check infrastructure for vulnerabilities")}</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Expert-validierte Security Runbooks", "Expert-validated security runbooks")}</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw</div>
              <div className="text-sm text-gray-300">{pick(isDE, "OpenClaw Security Framework", "OpenClaw Security Framework")}</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Roast My Moltbot</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Moltbot Security Testing", "Moltbot security testing")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
