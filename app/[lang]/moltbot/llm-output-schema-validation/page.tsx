import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-output-schema-validation"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "LLM Output Schema Validation: Strukturierte Ausgaben absichern 2026 | ClawGuru"
    : "LLM Output Schema Validation: Securing Structured Outputs 2026 | ClawGuru"
  const description = isDE
    ? "LLM-Ausgaben mit Schema-Validierung absichern: JSON Schema, Pydantic, PII-Detection und Moltbot-Output-Pipeline für sichere strukturierte AI-Ausgaben 2026."
    : "Secure LLM outputs with schema validation: JSON Schema, Pydantic, PII detection and Moltbot output pipeline for safe structured AI outputs 2026."
  return {
    title, description,
    keywords: ["llm output schema validation", "structured llm output security", "llm json schema", "llm output validation moltbot", "ai output security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const STEPS = [
  {
    num: "1", title: "Define JSON Schema for LLM Outputs",
    desc: "Define a strict schema for every LLM output type. Reject anything that doesn't conform — never pass unvalidated output downstream.",
    code: `# JSON Schema for agent decision output
{
  "type": "object",
  "required": ["action", "confidence", "reasoning"],
  "additionalProperties": false,
  "properties": {
    "action": { "type": "string", "enum": ["approve","reject","escalate"] },
    "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
    "reasoning": { "type": "string", "maxLength": 500 }
  }
}`,
  },
  {
    num: "2", title: "Moltbot Output Validation Pipeline",
    desc: "Every LLM output passes through schema validation, PII scanning, and content policy checks before reaching downstream systems.",
    code: `# Moltbot output pipeline config
output_pipeline:
  stages:
    - name: schema_validation
      schema_file: "schemas/agent-decision.json"
      on_failure: reject_with_fallback
    - name: pii_scan
      patterns: [email, phone, credit_card, iban]
      on_detection: redact
    - name: content_policy
      rules: [no_system_prompt_leak, no_credentials]
      on_violation: reject_and_log
  fallback:
    action: "escalate"
    confidence: 0
    reasoning: "Validation failed — human review required"`,
  },
  {
    num: "3", title: "Pydantic Type Safety (Python Agents)",
    desc: "Use Pydantic BaseModel for type-safe LLM output parsing with automatic validation and safe fallbacks.",
    code: `from pydantic import BaseModel, Field, validator
from typing import Literal

class AgentDecision(BaseModel):
    action: Literal["approve", "reject", "escalate"]
    confidence: float = Field(ge=0, le=1)
    reasoning: str = Field(max_length=500)

def parse_output(raw: str) -> AgentDecision:
    try:
        return AgentDecision.model_validate_json(raw)
    except Exception as e:
        log_validation_error(e, raw)
        return AgentDecision(
            action="escalate", confidence=0.0,
            reasoning="Validation failed — human review required"
        )`,
  },
  {
    num: "4", title: "PII Detection & Redaction",
    desc: "LLMs can accidentally include PII from context. Automatic detection and redaction before output reaches any downstream system.",
    code: `# Moltbot PII scanner
pii_scanner:
  enabled: true
  mode: redact
  detectors:
    - type: regex
      name: email
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+'
      replacement: "[EMAIL REDACTED]"
    - type: ml_model
      name: presidio
      entities: [PERSON, IBAN, CREDIT_CARD]
      confidence_threshold: 0.8
      action: redact
  audit:
    log_all_detections: true
    alert_on: [CREDIT_CARD, IBAN]`,
  },
]

const FAQ = [
  {
    q: "Why is LLM output schema validation a security control, not just quality control?",
    a: "Schema validation is a security control because: 1) Prompt injection containment — even if an attacker injects instructions, a strict output schema limits what the agent can return. 2) Data exfiltration prevention — schema validation blocks LLMs from including sensitive data in responses. 3) Downstream injection prevention — LLM outputs reaching databases or APIs can carry injected payloads; schema validation sanitizes them. 4) Agentic loop safety — in multi-agent systems, one agent's output is another's input. Schema validation prevents malicious content from propagating through agent chains.",
  },
  {
    q: "How do I handle LLM outputs that fail schema validation?",
    a: "1) Never pass failed outputs downstream — always substitute a safe fallback (e.g., action=escalate, confidence=0). 2) Retry once with an explicit formatting instruction if the failure looks like a formatting error. 3) Log everything — raw output (without PII), the validation error, and the action taken. 4) Alert on patterns — a spike in validation failures could indicate a prompt injection campaign. Set alerts on failure rates >2%. 5) Human escalation — for high-stakes decisions, route validation failures to a human reviewer.",
  },
  {
    q: "What is the difference between output filtering and schema validation?",
    a: "Output filtering removes unwanted content (keyword blocking, PII redaction). Schema validation enforces structure (output must match a defined type and shape). Both are needed: schema validation rejects malformed outputs; content filtering catches injected content within valid-schema responses. Use both in sequence: validate schema first, then filter content on the validated fields.",
  },
]

const howToLd = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Implement LLM Output Schema Validation",
  step: [
    { "@type": "HowToStep", position: 1, name: "Define Output Schema", text: "Create a strict JSON Schema for every LLM output type." },
    { "@type": "HowToStep", position: 2, name: "Deploy Validation Pipeline", text: "Configure Moltbot output pipeline with schema, PII scan, and content policy stages." },
    { "@type": "HowToStep", position: 3, name: "Add Pydantic Models", text: "Use Pydantic BaseModel for type-safe output parsing with safe fallbacks." },
    { "@type": "HowToStep", position: 4, name: "Enable PII Detection", text: "Configure PII scanner with regex and ML detectors for automatic redaction." },
  ],
}

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
}

export default function LlmOutputSchemaValidationPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="max-w-5xl mx-auto px-4 py-16">
        <nav className="text-sm text-gray-500 mb-8">
          <a href={`/${locale}`} className="hover:text-cyan-400">ClawGuru</a>
          <span className="mx-2">/</span>
          <a href={`/${locale}/moltbot-hardening`} className="hover:text-cyan-400">Moltbot</a>
          <span className="mx-2">/</span>
          <span className="text-gray-300">LLM Output Schema Validation</span>
        </nav>
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for securing your own LLM output pipelines. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? "LLM Output Schema Validation: Strukturierte Ausgaben absichern 2026" : "LLM Output Schema Validation: Securing Structured Outputs 2026"}
        </h1>
        <p className="text-lg text-gray-300 mb-10">
          {isDE
            ? "LLM-Ausgaben sind untrusted Input für alle downstream-Systeme. Ohne Schema-Validierung können prompt-injizierte Ausgaben Datenbanken korrumpieren, APIs missbrauchen oder PII leaken."
            : "LLM outputs are untrusted input for all downstream systems. Without schema validation, prompt-injected outputs can corrupt databases, abuse APIs, or leak PII."}
        </p>
        {STEPS.map((step) => (
          <section key={step.num} className="mb-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{step.num}</div>
                <h2 className="text-xl font-semibold text-gray-100">{step.title}</h2>
              </div>
              <p className="text-gray-300 text-sm mb-4">{step.desc}</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs whitespace-pre-wrap">{step.code}</pre>
              </div>
            </div>
          </section>
        ))}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Häufige Fragen" : "Frequently Asked Questions"}</h2>
          <div className="space-y-4">
            {FAQ.map((entry, i) => (
              <details key={i} className="bg-gray-800 rounded-lg border border-gray-700">
                <summary className="px-5 py-4 cursor-pointer font-bold text-gray-200 list-none">{entry.q}</summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">{entry.a}</div>
              </details>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/llm-output-validation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Output Validation</div>
              <div className="text-sm text-gray-300">{isDE ? "Grundlagen der Output-Validierung" : "Output validation fundamentals"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-prompt-hardening-advanced`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Advanced Prompt Hardening</div>
              <div className="text-sm text-gray-300">{isDE ? "Multi-Layer Eingabe-Absicherung" : "Multi-layer input protection"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-permission-minimization`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Permission Minimization</div>
              <div className="text-sm text-gray-300">{isDE ? "Least Privilege für Agenten" : "Least privilege for AI agents"}</div>
            </a>
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Security Check starten" : "Start Security Check"}</div>
              <div className="text-sm text-gray-300">{isDE ? "LLM-Pipeline in 30s prüfen" : "Audit LLM pipeline in 30s"}</div>
            </a>
          </div>
        </section>
        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-cyan-300 mb-2">
            {isDE ? "LLM-Ausgaben automatisch validieren?" : "Validate LLM outputs automatically?"}
          </h2>
          <p className="text-gray-300 mb-4 text-sm">
            {isDE ? "Moltbot erzwingt Schema-Validierung und PII-Redaktion für alle LLM-Ausgaben — konfigurierbar, auditierbar." : "Moltbot enforces schema validation and PII redaction for all LLM outputs — configurable, auditable."}
          </p>
          <a href={`/${locale}/securitycheck`} className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-lg transition-colors">
            {isDE ? "🛡️ Kostenloser Security Check" : "🛡️ Free Security Check"}
          </a>
        </div>
      </div>
    </div>
  )
}
