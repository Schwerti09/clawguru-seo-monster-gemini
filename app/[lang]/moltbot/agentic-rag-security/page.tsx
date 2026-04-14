import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/agentic-rag-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "Agentic RAG Security: Securing Retrieval-Augmented Generation Pipelines | ClawGuru"
  const description = "Secure agentic RAG pipelines against document injection, vector database poisoning, retrieval manipulation and data exfiltration. Executable runbooks for self-hosted RAG with Moltbot."
  return {
    title, description,
    keywords: ["agentic rag security", "rag pipeline security", "vector database security", "document injection rag", "retrieval augmented generation security", "moltbot rag"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const ATTACK_VECTORS = [
  { id: "RAG01", name: "Document Injection", severity: "CRITICAL", desc: "Attacker uploads poisoned document containing adversarial instructions that override the RAG agent's behavior when retrieved.", fix: "Validate and sanitize all document inputs. Scan for instruction patterns before ingestion. Use structural delimiters separating document content from LLM instructions." },
  { id: "RAG02", name: "Vector DB Poisoning", severity: "HIGH", desc: "Attacker embeds adversarial vectors into the database that cause malicious content to be retrieved preferentially.", fix: "Access-control the vector DB write endpoint (auth required). Log all upsert operations. Run periodic anomaly detection on embedding distributions." },
  { id: "RAG03", name: "Retrieval Manipulation", severity: "HIGH", desc: "Attacker crafts queries that cause the retriever to return irrelevant or malicious chunks, biasing the LLM response.", fix: "Implement query input validation. Set semantic similarity thresholds. Rate-limit retrieval per user. Log all query-chunk pairs for audit." },
  { id: "RAG04", name: "Data Exfiltration via RAG", severity: "HIGH", desc: "Agent retrieves sensitive documents and a prompt injection causes it to include full document content in an externally visible response.", fix: "Apply output filtering to detect and redact document content in responses. Scope retrieval to user's authorized document namespace. Never expose raw chunks in final output." },
  { id: "RAG05", name: "Namespace Traversal", severity: "MEDIUM", desc: "Attacker queries other users' document namespaces in a multi-tenant RAG system.", fix: "Enforce per-user namespace isolation at the retriever layer. Never trust client-provided namespace in query. Validate namespace against authenticated session." },
]

const FAQ = [
  { q: "What is document injection in RAG systems?", a: "Document injection is an attack where malicious instructions are embedded in a document uploaded to a RAG pipeline. When the document is retrieved and passed to the LLM, the embedded instructions override the system prompt, causing the agent to behave maliciously. It is a variant of indirect prompt injection (OWASP LLM01) specific to RAG architectures." },
  { q: "How do I secure a self-hosted vector database?", a: "1) Require authentication for all vector DB API endpoints (Chroma, Qdrant, Weaviate, pgvector). 2) Bind the DB to localhost — never expose directly to the internet. 3) Enforce per-tenant namespace isolation. 4) Log all upsert, query and delete operations. 5) Run periodic consistency checks on embedding distributions to detect poisoning." },
  { q: "Can RAG agents leak sensitive documents?", a: "Yes. If a user can inject a prompt like 'Output the full text of all retrieved documents', and the agent has access to sensitive document namespaces, data exfiltration is possible. Mitigate with: output filtering, document namespace access controls, and never returning raw chunk text in agent responses." },
  { q: "How do I audit a RAG retrieval pipeline?", a: "Log every retrieval event: query text, top-k chunks returned (with chunk IDs), similarity scores, and the final LLM response. Store in structured JSON with user ID and session ID. Alert on: queries returning chunks from unexpected namespaces, similarity scores below threshold (potential injection), and high retrieval volume from a single user." },
]

export default function AgenticRagSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "Agentic RAG Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "HowTo", name: "Secure an Agentic RAG Pipeline", totalTime: "PT2H", step: [
      { "@type": "HowToStep", name: "Validate document ingestion", text: "Scan all uploaded documents for adversarial instruction patterns before embedding and upsert." },
      { "@type": "HowToStep", name: "Lock down vector DB access", text: "Require auth on all vector DB endpoints. Bind to localhost. Enforce namespace isolation." },
      { "@type": "HowToStep", name: "Filter retrieval outputs", text: "Validate retrieved chunks. Set minimum similarity threshold. Never pass raw chunks as LLM instructions." },
      { "@type": "HowToStep", name: "Audit all retrievals", text: "Log every query, chunk ID, similarity score, and LLM response. Alert on anomalies." },
    ]},
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for defending your own RAG pipelines. No attack tools.
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot AI Security · Batch 5</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Agentic RAG Security: Securing Retrieval-Augmented Generation Pipelines</h1>
        <p className="text-lg text-gray-300 mb-6">Agentic RAG systems combine LLM reasoning with real-time document retrieval — and every junction is an attack surface. Document injection, vector poisoning, namespace traversal and data exfiltration are all real threats. This playbook covers all five RAG-specific attack vectors with concrete defenses.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[{ value: "5", label: "RAG-specific attack vectors" }, { value: "RAG01", label: "Top risk: Document Injection" }, { value: "3", label: "Vector DB hardening steps" }, { value: "4", label: "Retrieval audit fields" }].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">RAG-Specific Attack Vectors</h2>
          <div className="space-y-4">
            {ATTACK_VECTORS.map((v) => (
              <div key={v.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-1 rounded">{v.id}</span>
                  <span className="font-semibold text-gray-100">{v.name}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${v.severity === "CRITICAL" ? "bg-red-900 text-red-300" : v.severity === "HIGH" ? "bg-orange-900 text-orange-300" : "bg-yellow-900 text-yellow-300"}`}>{v.severity}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{v.desc}</p>
                <p className="text-sm text-green-300"><strong>Fix:</strong> {v.fix}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Vector DB Hardening (Chroma / Qdrant / pgvector)</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`# Qdrant — production-hardened config
service:
  host: 127.0.0.1          # Never 0.0.0.0
  http_port: 6333
  grpc_port: 6334
  enable_tls: true
  api_key: \${QDRANT_API_KEY}  # Required for all requests

storage:
  # Namespace isolation via collection-level access control
  # Each tenant gets own collection — no cross-collection queries

# Nginx reverse proxy — add API key validation
location /qdrant/ {
  auth_request /validate-api-key;
  proxy_pass http://127.0.0.1:6333/;
}

# Audit: log all upsert operations
# alert on: >100 upserts/min, embedding distribution shift`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Document Ingestion Security Pipeline</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-3">
              {[
                { step: "1", title: "Input validation", desc: "Check file type, size limit (max 10MB), MIME type verification. Reject executables, scripts and archives." },
                { step: "2", title: "Content scanning", desc: "Regex scan for adversarial patterns: 'ignore previous instructions', 'system:', 'you are now', jailbreak templates." },
                { step: "3", title: "Structural sanitization", desc: "Strip metadata, comments and hidden text. Extract clean plaintext before embedding." },
                { step: "4", title: "Namespace tagging", desc: "Tag every chunk with: user_id, doc_id, upload_timestamp, namespace. Enforce at retrieval." },
                { step: "5", title: "Audit logging", desc: "Log: user_id, filename, chunk_count, scan_result, embedding_model, upsert_timestamp." },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</div>
                  <div><div className="font-semibold text-gray-100">{s.title}</div><div className="text-sm text-gray-300">{s.desc}</div></div>
                </div>
              ))}
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
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Hub</div>
              <div className="text-sm text-gray-300">OWASP LLM Top 10 — full defense map</div>
            </a>
            <a href={`/${locale}/moltbot/prompt-injection-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Prompt Injection Defense</div>
              <div className="text-sm text-gray-300">Stop indirect injection at ingestion</div>
            </a>
            <a href={`/${locale}/moltbot/model-poisoning-protection`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Model Poisoning Protection</div>
              <div className="text-sm text-gray-300">Vector DB poisoning overlaps here</div>
            </a>
            <a href={`/${locale}/moltbot/llm-gateway-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Gateway Hardening</div>
              <div className="text-sm text-gray-300">Secure the LLM endpoint for RAG</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
