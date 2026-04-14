import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot-vs-llamaindex"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "Moltbot vs LlamaIndex: Security for RAG & AI Agent Pipelines | ClawGuru"
  const description = "Moltbot vs LlamaIndex: security comparison for RAG pipelines and AI agent deployments. LlamaIndex excels at data ingestion — learn its security gaps and how Moltbot secures production RAG systems."
  return {
    title, description,
    keywords: ["moltbot vs llamaindex", "llamaindex security", "llamaindex rag security", "rag pipeline security", "llamaindex self-hosted", "secure rag"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Primary Purpose", moltbot: "Security-first AI agent orchestration", llama: "Data framework for LLM apps (RAG, agents)" },
  { feature: "RAG Security", moltbot: "Document validation, vector DB access control, retrieval audit", llama: "No built-in RAG security — retrieval is unrestricted" },
  { feature: "Prompt Injection via RAG", moltbot: "Injected documents detected and quarantined", llama: "No injection detection in retrieved documents" },
  { feature: "Vector DB Access Control", moltbot: "Per-user namespace isolation, auth on retrieval", llama: "No built-in access control on vector stores" },
  { feature: "Document Ingestion Security", moltbot: "Content scanning, metadata validation, integrity hashes", llama: "No malicious content scanning during ingestion" },
  { feature: "Agent Tool Security", moltbot: "Scoped tools, HITL for dangerous operations", llama: "Tool security delegated to developer" },
  { feature: "Audit Trail", moltbot: "Full retrieval + generation trace with hashes", llama: "Callbacks only — manual logging required" },
  { feature: "GDPR / Data Residency", moltbot: "Self-hosted, no external data transfer", llama: "Depends on connectors — cloud services possible" },
  { feature: "Query Security", moltbot: "Query validation, scope enforcement", llama: "Raw queries to vector DB without validation" },
  { feature: "PII Detection", moltbot: "PII scanning before storage and retrieval", llama: "No built-in PII detection" },
  { feature: "Self-Hostable", moltbot: "Yes — full self-hosted", llama: "Yes, with self-hosted LLM and vector DB" },
  { feature: "Production Hardening", moltbot: "Built-in", llama: "Requires significant custom security work" },
]

const FAQ = [
  { q: "What are the main security risks in LlamaIndex RAG pipelines?", a: "Three critical RAG security risks in LlamaIndex: 1) Prompt injection via documents — a malicious document in the vector store can inject instructions into retrieved context, hijacking LLM behavior. 2) Data exfiltration — without query-level access control, a user can craft queries that retrieve documents belonging to other users. 3) Poisoned ingestion — no content scanning means malicious documents can be ingested and later served as trusted context. LlamaIndex provides no built-in mitigations for any of these." },
  { q: "How does Moltbot secure RAG pipelines?", a: "Moltbot adds a security layer around RAG operations: 1) Document ingestion: content scanning for injections, PII detection, integrity hashing. 2) Vector DB: per-user namespace isolation so users can only retrieve their own documents. 3) Retrieval: each retrieval is logged with query hash + document hashes retrieved. 4) Context injection detection: retrieved documents scanned for injection patterns before being passed to the LLM. 5) Audit trail: full provenance for every generated response." },
  { q: "Can I use LlamaIndex with Moltbot together?", a: "Yes — the recommended architecture is: LlamaIndex handles data ingestion and indexing (its strength), Moltbot wraps all retrieval and agent operations with security controls. LlamaIndex's connectors, parsers, and chunking logic remain intact. Moltbot adds auth, access control, audit logging, and injection detection as a security layer around LlamaIndex's retrieval API." },
  { q: "What is document-level access control in RAG?", a: "In a multi-user RAG system, document-level access control ensures User A cannot retrieve documents that belong to User B — even with a crafted query. Without it, a query like 'show me all documents about X' might retrieve sensitive documents from other users. The fix: namespace all vector embeddings by user/tenant ID and enforce namespace scoping on every retrieval query. LlamaIndex does not do this by default; Moltbot enforces it automatically." },
]

export default function MoltbotVsLlamaIndexPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot vs LlamaIndex", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: Security hardening guide for your own RAG and AI agent pipelines.
        </div>

        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 8</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot vs LlamaIndex: Security for RAG Pipelines</h1>
        <p className="text-lg text-gray-300 mb-6">LlamaIndex is the best-in-class data framework for building RAG pipelines. But it ships with zero RAG-specific security. This comparison shows exactly where the gaps are — and how Moltbot fills them without sacrificing LlamaIndex's powerful data capabilities.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase">Moltbot</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">LlamaIndex</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-100">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-green-300">{row.moltbot}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{row.llama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">The RAG Security Gap</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
              <pre>{`# LlamaIndex RAG — no access control:
index = VectorStoreIndex.from_documents(all_docs)  # ALL users' docs mixed
query_engine = index.as_query_engine()
result = query_engine.query(user_query)
# User A can retrieve User B's documents via crafted query

# Moltbot-secured RAG:
index = MoltbotSecureIndex(
    base_index=llama_index,
    namespace=f"user-{user_id}",       # Per-user namespace
    pii_scan=True,                       # PII detection on retrieval
    injection_detection=True,            # Scan retrieved docs for injections
    audit_logger=structured_logger,      # Full trace with doc hashes
)
result = index.secure_query(
    user_query,
    scope_token=user_capability_token,  # Auth on every query
)`}</pre>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Which Tool When?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-cyan-900 p-4 rounded-lg border border-cyan-700">
              <h3 className="font-semibold text-cyan-300 mb-2">Use Moltbot when:</h3>
              <ul className="space-y-1 text-sm text-cyan-200">
                <li>▸ Multi-tenant RAG (users must not cross-retrieve)</li>
                <li>▸ Sensitive documents (medical, legal, financial)</li>
                <li>▸ GDPR/HIPAA compliance required</li>
                <li>▸ Audit trail for all retrievals mandatory</li>
                <li>▸ Production RAG with public user access</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
              <h3 className="font-semibold text-gray-300 mb-2">LlamaIndex alone is OK for:</h3>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>▸ Single-user internal RAG systems</li>
                <li>▸ Internal knowledge bases (non-sensitive)</li>
                <li>▸ Prototyping and evaluation</li>
                <li>▸ Research environments</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Frequently Asked Questions</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/agentic-rag-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Agentic RAG Security</div>
              <div className="text-sm text-gray-300">Full RAG security deep-dive</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Hub</div>
              <div className="text-sm text-gray-300">OWASP LLM Top 10 defense map</div>
            </a>
            <a href={`/${locale}/moltbot-vs-langchain`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs LangChain</div>
              <div className="text-sm text-gray-300">Another key RAG framework comparison</div>
            </a>
            <a href={`/${locale}/moltbot-vs-crewai`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs CrewAI</div>
              <div className="text-sm text-gray-300">Multi-agent orchestration security</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
