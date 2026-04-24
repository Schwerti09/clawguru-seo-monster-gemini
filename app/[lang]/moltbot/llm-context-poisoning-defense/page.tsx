import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-context-poisoning-defense"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Context Poisoning Defense: LLM-Kontext-Poisoning-Defense | ClawGuru Moltbot", "LLM Context Poisoning Defense: LLM Context Poisoning Defense | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-Kontext-Poisoning-Defense: Context Source Validation, Retrieval Integrity, Context Sanitization und Context Audit Logging für LLM-Kontext-Poisoning-Defense.", "LLM context poisoning defense: context source validation, retrieval integrity, context sanitization and context audit logging for LLM context poisoning defense.")
  return {
    title, description,
    keywords: ["llm context poisoning defense", "context source validation", "retrieval integrity", "context sanitization", "context audit", "moltbot context poisoning"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "CPD-1", title: "Context Source Validation", desc: "Validate all context sources before inclusion. Allow-list trusted sources and verify authenticity.", code: `# Moltbot context source validation:
source_validation:
  enabled: true

  # Source Allow-listing:
  allowlist:
    enabled: true
    # Define: trusted context sources
    # Sources: internal docs, trusted APIs
    # Validate: source authenticity
    # Block: untrusted sources

  # Source Authentication:
  authentication:
    enabled: true
    # Authenticate: all context sources
    # Method: API keys, certificates
    # Verify: source identity
    # Prevents: source impersonation

  # Source Integrity:
  integrity:
    enabled: true
    # Verify: source integrity
    # Method: hash verification, signatures
    # Block: tampered sources
    # Prevents: source tampering` },
  { id: "CPD-2", title: "Retrieval Integrity", desc: "Ensure integrity of retrieved context. Verify retrieval results have not been manipulated.", code: `# Moltbot retrieval integrity:
retrieval_integrity:
  enabled: true

  # Retrieval Verification:
  verification:
    enabled: true
    # Verify: retrieved content integrity
    # Method: hash, signature
    # Block: tampered content
    # Prevents: retrieval manipulation

  # RAG Pipeline Security:
  rag_security:
    enabled: true
    # Secure: RAG pipeline
    # Validate: vector store integrity
    # Monitor: retrieval anomalies
    # Alert: on suspicious retrieval

  # Content Provenance:
  provenance:
    enabled: true
    # Track: content provenance
    # Include: source, timestamp, hash
    # Verify: provenance on use
    # Log: provenance chain` },
  { id: "CPD-3", title: "Context Sanitization", desc: "Sanitize context before LLM processing. Remove prompt injections and malicious content.", code: `# Moltbot context sanitization:
sanitization:
  enabled: true

  # Prompt Injection Removal:
  injection_removal:
    enabled: true
    # Detect: prompt injection patterns
    # Methods: pattern matching, classifier
    # Remove: injected content
    # Log: injection attempts

  # Content Filtering:
  content_filtering:
    enabled: true
    # Filter: malicious content
    # Categories: XSS, SQLi, code injection
    # Block: harmful patterns
    # Allow: clean content

  # Context Length Limits:
  length_limits:
    enabled: true
    # Enforce: max context length
    # Prevent: context flooding
    # Truncate: excess context
    # Alert: on flooding attempts` },
  { id: "CPD-4", title: "Context Audit Logging", desc: "Log all context operations for audit. Track context sources, retrieval, and sanitization.", code: `# Moltbot context audit logging:
context_audit:
  enabled: true

  # Source Logging:
  source_logging:
    enabled: true
    # Log: all context source events
    # Include: source, timestamp, hash
    # Retain: logs for audit (90 days)
    # Protect: log access

  # Retrieval Logging:
  retrieval_logging:
    enabled: true
    # Log: all retrieval events
    # Include: query, results, scores
    # Retain: logs for audit (90 days)
    # Protect: log access

  # Sanitization Logging:
  sanitization_logging:
    enabled: true
    # Log: all sanitization events
    # Include: original, sanitized, reason
    # Retain: logs for audit (90 days)
    # Protect: log access` },
]

const FAQ = [
  { q: "What is context poisoning and how does it differ from prompt injection?", a: "Context poisoning is an attack where malicious content is injected into the retrieval context (e.g., RAG database, knowledge base) before it reaches the LLM. Prompt injection is direct manipulation of the prompt at inference time. Context poisoning is harder to detect because the attack happens at the data layer, not at inference time. A poisoned knowledge base can affect many subsequent queries. Both require defense: context source validation and sanitization for poisoning, prompt injection detection for direct injection." },
  { q: "How do I secure my RAG pipeline against context poisoning?", a: "Secure your RAG pipeline by: 1) Source validation — only allow trusted sources in your vector store. 2) Ingestion filtering — sanitize content during ingestion, not just at inference. 3) Content signatures — sign documents before ingestion and verify at retrieval. 4) Retrieval monitoring — monitor retrieval results for anomalous patterns. 5) Provenance tracking — track content provenance through the pipeline. 6) Regular audits — periodically audit your knowledge base for poisoned content." },
  { q: "How do I detect context poisoning in production?", a: "Detect context poisoning by: 1) Anomaly detection — monitor for unexpected content in retrieval results. 2) Response monitoring — detect LLM responses that violate expected output patterns. 3) Source monitoring — track which sources are retrieved most frequently. 4) Canary documents — inject known documents and monitor if they appear in results. 5) Regular audits — periodically sample and review retrieval results. 6) User feedback — monitor for user reports of incorrect or unexpected responses." },
  { q: "What are common context poisoning attack vectors?", a: "Common context poisoning attack vectors: 1) Web scraping attacks — poisoned web pages scraped into knowledge base. 2) Document injection — upload malicious documents to shared repositories. 3) Database poisoning — inject malicious records into data sources. 4) API poisoning — compromise third-party APIs that feed context. 5) Indirect prompt injection via poisoned context — attacker-controlled content tricks LLM into harmful actions. Defense: strict source allow-listing, content signing, and continuous monitoring." },
]

export default function LlmContextPoisoningDefensePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Context Poisoning Defense", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Context-Poisoning-Defense-Guide für eigene KI-Systeme.", "Context poisoning defense guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 26</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "LLM Context Poisoning Defense", "LLM Context Poisoning Defense")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Context Poisoning ist der unterschätzte Angriff auf RAG-Pipelines — Angreifer vergiften den Kontext bevor er das LLM erreicht. Vier Kontrollen: Context Source Validation, Retrieval Integrity, Context Sanitization und Context Audit Logging.", "Context poisoning is the underestimated attack on RAG pipelines — attackers poison context before it reaches the LLM. Four controls: context source validation, retrieval integrity, context sanitization and context audit logging.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Context-Poisoning-Defense-Kontrollen", "4 Context Poisoning Defense Controls")}</h2>
          <div className="space-y-5">
            {CONTROLS.map((c) => (
              <div key={c.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{c.id}</span>
                  <span className="font-bold text-gray-100">{c.title}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-3">{c.desc}</p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto"><pre>{c.code}</pre></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Häufige Fragen", "Frequently Asked Questions")}</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <summary className="font-semibold text-gray-100 cursor-pointer">{f.q}</summary>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further Resources")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/llm-prompt-injection-detection`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Prompt Injection Detection</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Prompt-Injection", "Prompt injection")}</div>
            </a>
            <a href={`/${locale}/moltbot/agentic-rag-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Agentic RAG Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "RAG-Security", "RAG security")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-context-manipulation-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Context Manipulation Defense</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Context-Defense", "Context defense")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Poisoning-Overview", "Poisoning overview")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
