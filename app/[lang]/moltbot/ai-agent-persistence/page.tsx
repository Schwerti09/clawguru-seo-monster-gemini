import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-persistence"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Persistence: KI-Agenten-Persistenz | ClawGuru Moltbot"
    : "AI Agent Persistence: AI Agent Persistence | ClawGuru Moltbot"
  const description = isDE
    ? "AI-Agent-Persistenz: Memory Management, State Persistence, Long-Term Memory und Agent Session Recovery für KI-Agent-Systeme."
    : "AI agent persistence: memory management, state persistence, long-term memory and agent session recovery for AI agent systems."
  return {
    title, description,
    keywords: ["ai agent persistence", "llm agent memory", "agent state management", "long-term memory llm", "agent session recovery", "moltbot persistence"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const PERSISTENCE_CONTROLS = [
  { id: "AP-1", title: "Memory Management", desc: "Manage agent memory to prevent memory leaks and ensure efficient resource usage. Implement memory limits, garbage collection, and memory sanitisation.", code: `# Moltbot agent memory management:
memory_management:
  enabled: true

  # Memory limits:
  limits:
    max_conversation_turns: 100
    max_memory_mb: 512
    max_messages_in_memory: 50

  # Memory sanitisation:
  sanitisation:
    enabled: true
    # Sanitise memory to prevent data leakage:
    # - Remove PII from memory
    # - Remove sensitive data from memory
    # - Clear memory on session end
    clear_on_session_end: true

  # Garbage collection:
  garbage_collection:
    enabled: true
    # Automatically remove old messages from memory
    # Keep: last N messages, important messages (user-specified)
    keep_recent_n: 20
    keep_important: true
    gc_interval_turns: 10  # Run GC every 10 turns

  # Memory compression:
  compression:
    enabled: true
    # Compress older messages to save memory
    compress_after_turns: 50
    compression_algorithm: "gzip"` },
  { id: "AP-2", title: "State Persistence", desc: "Persist agent state across sessions. Save conversation history, tool results, and agent context to enable session recovery.", code: `# Moltbot agent state persistence:
state_persistence:
  enabled: true

  # What to persist:
  persist:
    - conversation_history
    - tool_results
    - agent_context
    - user_preferences
    - session_metadata

  # Storage backend:
  storage:
    type: "database"  # Options: database, file, s3, redis
    # For production, use encrypted database
    encryption: true
    encryption_algorithm: "AES-256-GCM"

  # Persistence frequency:
  frequency:
    # Persist after every N turns
    persist_every_turns: 5
    # Also persist on session end
    persist_on_session_end: true

  # Session recovery:
  recovery:
    enabled: true
    # Allow users to resume previous sessions
    max_sessions_per_user: 10
    session_retention_days: 30

  # Data minimisation:
  minimisation:
    enabled: true
    # Only persist necessary data
    # Remove: temporary data, debug logs, duplicate data` },
  { id: "AP-3", title: "Long-Term Memory", desc: "Implement long-term memory for agents to remember information across sessions. Use vector databases for semantic search and retrieval.", code: `# Moltbot agent long-term memory:
long_term_memory:
  enabled: true

  # Memory storage:
  storage:
    type: "vector_database"  # Options: vector_database, graph_database, relational
    # For semantic search, use vector database (Pinecone, Weaviate, Milvus)

  # Memory types:
  memory_types:
    - episodic_memory  # Specific events and experiences
    - semantic_memory  # General knowledge and facts
    - procedural_memory  # Skills and procedures

  # Memory encoding:
  encoding:
    # How to store information in long-term memory
    # Extract entities, relationships, and context
    extract_entities: true
    extract_relationships: true
    extract_context: true

  # Memory retrieval:
  retrieval:
    # How to retrieve information from long-term memory
    # Use semantic search with embeddings
    similarity_threshold: 0.80
    max_results: 10

  # Memory consolidation:
  consolidation:
    enabled: true
    # Periodically consolidate and organise memory
    # Remove duplicates, update outdated information
    consolidation_interval_hours: 24` },
  { id: "AP-4", title: "Agent Session Recovery", desc: "Enable agents to recover from failures and resume sessions. Implement checkpointing, rollback, and error recovery mechanisms.", code: `# Moltbot agent session recovery:
session_recovery:
  enabled: true

  # Checkpointing:
  checkpointing:
    enabled: true
    # Save checkpoints at regular intervals
    checkpoint_interval_turns: 10
    # Save checkpoints before critical operations
    checkpoint_before_tool_call: true

  # Rollback:
  rollback:
    enabled: true
    # Rollback to last checkpoint on failure
    rollback_on_error: true
    max_rollback_turns: 5

  # Error recovery:
  recovery:
    # Automatic recovery strategies:
    # - Retry failed operations
    # - Use fallback tools
    # - Ask user for clarification
    retry_attempts: 3
    retry_delay_seconds: 5
    fallback_enabled: true

  # Session timeout:
  timeout:
    idle_timeout_minutes: 30
    absolute_timeout_hours: 24
    # End session after timeout
    on_timeout: save_and_end

  # Session cleanup:
  cleanup:
    enabled: true
    # Clean up resources on session end
    # Clear memory, release locks, close connections` },
]

const FAQ = [
  { q: "What is the difference between short-term and long-term memory in AI agents?", a: "Short-term memory (working memory) is the agent's current context — the conversation history, recent tool results, and the immediate task at hand. It is limited in size (typically 50-100 messages) and is cleared when the session ends. Long-term memory is persistent storage that allows the agent to remember information across sessions. It includes: episodic memory (specific events), semantic memory (general knowledge), and procedural memory (skills). Long-term memory is stored in a vector database for semantic search and retrieval. The agent can query long-term memory to retrieve relevant information from past sessions." },
  { q: "How do I implement secure state persistence?", a: "Secure state persistence requires: 1) Encryption at rest — encrypt all persisted state using AES-256-GCM. 2) Encryption in transit — use TLS 1.3 for all data in transit. 3) Access control — only allow authorised users to access their own persisted state. 4) Data minimisation — only persist necessary data (conversation history, tool results). Remove temporary data, debug logs, and duplicates. 5) Retention policy — automatically delete old sessions after 30 days. 6) Audit logging — log all state persistence operations for accountability. 7) Secure storage — use a secrets manager for encryption keys." },
  { q: "How does long-term memory affect privacy?", a: "Long-term memory stores information across sessions, which can include user data, preferences, and potentially sensitive information. Privacy considerations: 1) User consent — obtain consent before storing information in long-term memory. 2) Data minimisation — only store necessary information. 3) PII detection — scan for PII before storing and either redact or encrypt it. 4) Access control — ensure users can only access their own long-term memory. 5) Right to be forgotten — implement GDPR Art. 17 right to erasure — allow users to delete their long-term memory. 6) Transparency — inform users what is stored in long-term memory and why." },
  { q: "How do I handle agent memory leaks?", a: "Memory leaks occur when an agent accumulates data without releasing it, leading to resource exhaustion. Mitigation: 1) Memory limits — set hard limits on conversation turns, memory size, and message count. 2) Garbage collection — automatically remove old messages from memory, keeping only recent and important messages. 3) Memory compression — compress older messages to save memory. 4) Session timeout — end sessions after a period of inactivity (30 min idle, 24 hours absolute). 5) Memory sanitisation — clear memory on session end, remove PII and sensitive data. 6) Monitoring — monitor memory usage and alert on unusual patterns." },
]

export default function AiAgentPersistencePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent Persistence", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Agent-Persistenz-Guide für eigene KI-Systeme." : "Agent persistence guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 16</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Persistence" : "AI Agent Persistence"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "KI-Agenten ohne Persistenz verlieren nach jedem Session-Ende den Kontext — mit Persistence können Agenten lernen und sich erinnern. Vier Kontrollen: Memory Management, State Persistence, Long-Term Memory und Session Recovery."
            : "AI agents without persistence lose context after every session end — with persistence, agents can learn and remember. Four controls: memory management, state persistence, long-term memory and session recovery."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Agent-Persistenz-Kontrollen" : "4 Agent Persistence Controls"}</h2>
          <div className="space-y-5">
            {PERSISTENCE_CONTROLS.map((c) => (
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Häufige Fragen" : "Frequently Asked Questions"}</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/agent-memory-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Agent Memory Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Memory-Sanitisation" : "Memory sanitisation"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-context-isolation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Context Isolation</div>
              <div className="text-sm text-gray-300">{isDE ? "Session-Isolation" : "Session isolation"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-audit-logging`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Audit Logging</div>
              <div className="text-sm text-gray-300">{isDE ? "State-Persistence-Audit" : "State persistence audit"}</div>
            </a>
            <a href={`/${locale}/moltbot/rag-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">RAG Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Long-Term-Memory-RAG" : "Long-term memory RAG"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
