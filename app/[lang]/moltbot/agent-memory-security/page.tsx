import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/agent-memory-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "Agent Memory Security: Verschlüsselung & Zugriffskontrolle für KI-Gedächtnis | ClawGuru", "Agent Memory Security: Encryption & Access Control for AI Agent Memory | ClawGuru")
  const description = pick(isDE, "KI-Agenten-Speicher absichern: Verschlüsselung im Ruhezustand, scoped Retrieval, PII-Erkennung, Speicher-Isolation zwischen Agenten und GDPR-konforme Löschung (Right to Erasure).", "Secure AI agent memory: encryption at rest, scoped retrieval, PII detection, memory isolation between agents and GDPR-compliant deletion (Right to Erasure).")
  return {
    title, description,
    keywords: ["agent memory security", "llm memory encryption", "ai agent memory gdpr", "vector store security", "agent memory isolation", "right to erasure ai"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const ATTACK_VECTORS = [
  { id: "M1", name: "Memory Poisoning", severity: "CRITICAL", desc: "Attacker injects malicious content into agent long-term memory. On future retrieval, poisoned memory manipulates agent behavior — persistent across sessions.", fix: "Content validation on memory write. Hash-verified retrieval. Anomaly detection on memory update patterns." },
  { id: "M2", name: "Cross-Agent Memory Exfiltration", severity: "HIGH", desc: "Agent A retrieves memories belonging to Agent B or User B via crafted queries. Common in shared vector databases without namespace isolation.", fix: "Per-agent, per-user namespace isolation in vector DB. Scope enforcement on every retrieval query. No shared embedding spaces." },
  { id: "M3", name: "Memory-Based Prompt Injection", severity: "HIGH", desc: "Injected content stored in memory is later retrieved and included in an LLM prompt — causing injection at retrieval time, not just at input time.", fix: "Scan retrieved memory chunks for injection patterns before including in prompt. Treat memory as untrusted user input." },
  { id: "M4", name: "PII Persistence in Memory", severity: "HIGH", desc: "Personally identifiable information stored in agent memory without expiry or deletion mechanism. Violates GDPR Art. 5 and Right to Erasure (Art. 17).", fix: "PII detection on memory write. Configurable retention. Right-to-erasure API that purges all user-linked embeddings." },
  { id: "M5", name: "Memory Replay Attack", severity: "MEDIUM", desc: "Stale or replayed memories from old sessions used to influence current agent behavior. Old authorization context replayed to bypass current access controls.", fix: "Timestamp-based memory expiry. Session binding on sensitive memories. Version tokens on memory entries." },
  { id: "M6", name: "Embedding Inversion", severity: "MEDIUM", desc: "Vector embeddings stored in DB can be partially inverted to recover original text. Sensitive information recoverable from embeddings alone.", fix: "Encrypt embeddings at rest. Use embedding-only indexes (not raw text) when possible. Access control on vector DB." },
]

const FAQ = [
  { q: "What is agent memory and why is it a security risk?", a: "Agent memory is persistent storage that allows AI agents to retain information across conversations and sessions. It typically uses a vector database (Pinecone, Chroma, Weaviate, pgvector) to store embeddings of past interactions, facts, and user preferences. The security risk: this memory is read back into LLM prompts at retrieval time — making it a persistent attack surface. Any content injected into memory (directly or via a previous conversation) can influence future agent behavior." },
  { q: "How does Moltbot isolate memory between users and agents?", a: "Moltbot enforces namespace isolation at three levels: 1) Agent-level: each agent ID gets its own embedding namespace. An agent cannot query outside its namespace. 2) User-level: within an agent, each user's memories are further isolated by user_id namespace. Retrievals are always scoped to the current user. 3) Permission-level: sensitive memory types (authentication context, financial data) require explicit capability tokens to retrieve, even for the owning agent." },
  { q: "How do I implement GDPR Right to Erasure for agent memory?", a: "GDPR Art. 17 requires deletion of personal data on request within 30 days. For agent memory: 1) Tag all memories with user_id at write time. 2) Maintain a deletion index. 3) On erasure request: delete all embeddings tagged with user_id from vector DB, delete raw text from any backing store, delete from deletion index, generate erasure confirmation log with timestamp. Moltbot's erasure API handles all of this: moltbot.memory.erase_user(user_id='u123', confirm=True)." },
  { q: "Can prompt injection via retrieved memory be fully prevented?", a: "Not 100%, but risk can be reduced to near-zero: 1) Scan every retrieved memory chunk with an injection detection model before including in prompt. 2) Separate trusted memory (agent-written) from untrusted memory (user-sourced) using different namespaces with different trust levels. 3) Use structured memory (key-value facts) instead of raw text where possible — much harder to inject into. 4) Limit retrieved memory context to 20% of total prompt to reduce injection surface. 5) Run memory-retrieved prompts through a separate safety classifier before execution." },
]

export default function AgentMemorySecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "Agent Memory Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Sicherheitsleitfaden für eigene KI-Agent-Systeme.", "Security guide for your own AI agent systems.")}
        </div>

        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 6</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "Agent Memory Security: KI-Gedächtnis absichern", "Agent Memory Security: Securing AI Agent Memory")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Agent-Speicher ist ein persistentes Angriffsziel: einmal vergiftete Erinnerungen beeinflussen jeden zukünftigen Agenten-Aufruf. Sechs Angriffsvektoren, konkrete Mitigations und DSGVO-konforme Löschung.", "Agent memory is a persistent attack surface: once poisoned, memories influence every future agent call. Six attack vectors, concrete mitigations and GDPR-compliant erasure.")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "6", label: pick(isDE, "Angriffsvektoren", "Attack vectors") },
            { value: "AES-256", label: pick(isDE, "Verschlüsselung", "Encryption") },
            { value: "30d", label: "GDPR Erasure SLA" },
            { value: "3", label: pick(isDE, "Isolations-Ebenen", "Isolation levels") },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Angriffsvektoren & Mitigations", "Attack Vectors & Mitigations")}
          </h2>
          <div className="space-y-3">
            {ATTACK_VECTORS.map((v) => (
              <div key={v.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{v.id}</span>
                  <span className="font-semibold text-gray-100">{v.name}</span>
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded ${
                    v.severity === "CRITICAL" ? "bg-red-900 text-red-300"
                    : v.severity === "HIGH" ? "bg-orange-900 text-orange-300"
                    : "bg-yellow-900 text-yellow-300"
                  }`}>{v.severity}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-2">{v.desc}</p>
                  <p className="text-xs text-green-300"><span className="font-semibold">Fix: </span>{v.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Sichere Memory-Konfiguration", "Secure Memory Configuration")}
          </h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`# moltbot.memory.yaml — secure agent memory configuration
memory:
  backend: pgvector          # or chroma, weaviate, qdrant
  encryption:
    at_rest: aes-256-gcm     # Encrypt embeddings + raw text
    key_rotation: 90d        # Rotate encryption keys every 90 days

  isolation:
    namespace_by_agent: true  # Each agent ID → own namespace
    namespace_by_user: true   # Each user ID → own namespace within agent
    cross_agent_reads: false  # Never allow agent A to read agent B's memory

  security:
    injection_scan_on_write: true   # Scan content before storing
    injection_scan_on_read: true    # Scan retrieved chunks before prompt inject
    pii_detection: true             # Detect PII on write, flag for review
    pii_auto_tag: true              # Tag memories containing PII for deletion tracking

  retention:
    default_ttl_days: 90            # Auto-expire memories after 90 days
    user_data_ttl_days: 365         # Configurable per data class
    on_erasure_request: immediate   # GDPR Art. 17 — delete within 24h

  audit:
    log_all_reads: true             # Record every memory retrieval with user+agent+query_hash
    log_all_writes: true
    retention_years: 3              # Audit log retention`}</pre>
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
            <a href={`/${locale}/moltbot/agentic-rag-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Agentic RAG Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Vector DB Zugriffssteuerung", "Vector DB access control")}</div>
            </a>
            <a href={`/${locale}/moltbot/prompt-injection-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Prompt Injection Defense</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Injektionen in Memory-Retrieved Prompts", "Injections in memory-retrieved prompts")}</div>
            </a>
            <a href={`/${locale}/solutions/dsgvo-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">GDPR Compliance</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Art. 17 Right to Erasure", "Art. 17 Right to Erasure")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Compliance Automation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Memory-Logs für Audit", "Memory logs for audit")}</div>
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
