import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-embeddings-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Embeddings Security: Vektor-Embedding-Sicherheit | ClawGuru Moltbot", "LLM Embeddings Security: Vector Embedding Security | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-Embeddings-Security: Embedding Injection Protection, Vector Store Access Control, Embedding Poisoning Detection und Embedding Versioning für RAG-Systeme.", "LLM embeddings security: embedding injection protection, vector store access control, embedding poisoning detection and embedding versioning for RAG systems.")
  return {
    title, description,
    keywords: ["llm embeddings security", "vector store security", "embedding injection", "rag vector security", "embedding poisoning", "moltbot embeddings"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "ES-1", title: "Embedding Injection Protection", desc: "Prevent embedding injection attacks where an attacker crafts input that manipulates the embedding space to trigger malicious behavior in the RAG retrieval or LLM generation.", code: `# Moltbot embedding injection protection:
embedding_injection_protection:
  enabled: true

  # Input sanitisation before embedding:
  input_sanitisation:
    enabled: true
    # Remove known adversarial patterns:
    # - Unicode homographs
    # - Zero-width characters
    # - Invisible characters
    # - Repeated patterns (for embedding flooding)

  # Embedding validation:
  embedding_validation:
    enabled: true
    # Validate embedding dimensions and ranges
    expected_dimensions: 1536  # OpenAI text-embedding-3-small
    expected_range: [-1.0, 1.0]
    # Reject embeddings outside expected range

  # Rate limiting for embedding generation:
  rate_limit:
    enabled: true
    per_user_per_minute: 100
    per_user_per_hour: 1000
    # Prevent embedding flooding attacks

  # Adversarial embedding detection:
  adversarial_detection:
    enabled: true
    # Detect embeddings that are too close to known adversarial patterns
    # Use cosine similarity to detect clustering attacks
    threshold: 0.95  # Alert if similarity > 95%` },
  { id: "ES-2", title: "Vector Store Access Control", desc: "Control access to your vector store. Ensure that RAG queries only retrieve documents the user is authorised to access. Implement per-tenant or per-user vector isolation.", code: `# Moltbot vector store access control:
vector_store_acl:
  enabled: true

  # Per-tenant vector isolation:
  tenant_isolation:
    enabled: true
    # Each tenant has its own vector index or namespace
    # User queries only search within their tenant's vectors

  # User-level access control:
  user_acl:
    enabled: true
    # Check user permissions before retrieving vectors
    # Only return vectors the user is authorised to see
    # Example: user can only access documents in their department

  # Row-level security:
  row_level_security:
    enabled: true
    # Each vector document has metadata: owner_id, department_id
    # Filter results based on user's access rights
    # Example: WHERE department_id = user.department_id

  # Vector store authentication:
  authentication:
    enabled: true
    # Require authentication for all vector store operations
    # Use JWT tokens with user context
    # Validate tokens on each query` },
  { id: "ES-3", title: "Embedding Poisoning Detection", desc: "Detect poisoned embeddings in your vector store. Attackers may inject malicious documents that, when embedded, cluster near legitimate documents and influence RAG retrieval.", code: `# Moltbot embedding poisoning detection:
poisoning_detection:
  enabled: true

  # Outlier detection:
  outlier_detection:
    enabled: true
    # Detect vectors that are outliers in the embedding space
    # Use statistical methods: Z-score, isolation forest
    # Flag vectors with high outlier score for review

  # Cluster analysis:
  cluster_analysis:
    enabled: true
    # Analyse vector clusters for unusual patterns
    # Look for: small clusters with many similar vectors (potential poisoning)
    # Look for vectors that bridge unrelated clusters (potential poisoning)

  # Semantic drift detection:
  semantic_drift:
    enabled: true
    # Detect if document embeddings drift from their original semantic meaning
    # Re-embed documents periodically and compare
    # Alert if semantic similarity drops below threshold

  # Source validation:
  source_validation:
    enabled: true
    # Only accept embeddings from trusted sources
    # Reject embeddings from untrusted or unknown sources
    # Maintain a whitelist of approved embedding sources` },
  { id: "ES-4", title: "Embedding Versioning and Migration", desc: "Manage embedding model updates. When you upgrade to a new embedding model, re-embed your corpus and maintain version control for backward compatibility.", code: `# Moltbot embedding versioning:
embedding_versioning:
  enabled: true
  current_version: "text-embedding-3-small-v2"
  previous_versions: ["text-embedding-3-small-v1", "text-embedding-ada-002"]

  # Embedding model configuration:
  models:
    text-embedding-3-small-v2:
      dimensions: 1536
      provider: "openai"
      deployment_date: "2025-03-01"

  # Migration strategy:
  migration:
    enabled: true
    # When upgrading to a new model:
    # 1. Create new vector index for new model
    # 2. Re-embed all documents with new model
    # 3. Validate new embeddings (semantic drift check)
    # 4. Switch traffic to new index
    # 5. Keep old index for rollback window (30 days)

  # Backward compatibility:
  backward_compatibility:
    enabled: true
    # Support querying across multiple embedding versions
    # Map queries to appropriate index based on model version
    # Fallback to previous version if new version unavailable` },
]

const FAQ = [
  { q: "What is embedding injection and how does it work?", a: "Embedding injection is an attack where an attacker crafts input that, when embedded, produces a vector that is intentionally close to target vectors in the embedding space. This can be used to: 1) Poison RAG retrieval — attacker's input retrieves malicious documents instead of legitimate ones. 2) Bias LLM generation — attacker's input influences the LLM toward malicious outputs. 3) Evade content filters — attacker's input produces an embedding that bypasses safety filters. How it works: the attacker studies the embedding space of your RAG system, identifies target vectors (e.g., vectors for sensitive documents), then crafts input that produces embeddings close to those targets. Defense: input sanitisation, embedding validation, adversarial embedding detection, rate limiting to prevent embedding flooding." },
  { q: "How do I implement per-tenant vector isolation?", a: "Per-tenant vector isolation ensures that each tenant's RAG queries only retrieve their own documents. Implementation: 1) Separate vector indices — create one index per tenant in your vector store (Pinecone, Weaviate, Milvus). 2) Namespace isolation — use vector store namespaces to segregate tenant data (e.g., tenant_id as namespace). 3) Metadata filtering — tag each vector with tenant_id and filter queries by tenant_id. 4) Application-level filtering — enforce tenant isolation at the application layer before querying the vector store. 5) Access control checks — validate user's tenant membership before allowing RAG queries. Risk: if isolation fails, one tenant can retrieve another tenant's documents — a data breach under GDPR." },
  { q: "How do I detect poisoned embeddings in my vector store?", a: "Poisoned embeddings are maliciously crafted vectors that cluster near legitimate vectors to influence RAG retrieval. Detection methods: 1) Outlier detection — use statistical methods (Z-score, isolation forest) to identify vectors that are statistical outliers. 2) Cluster analysis — analyse vector clusters for unusual patterns: small clusters with many similar vectors (potential poisoning), vectors that bridge unrelated clusters. 3) Semantic drift detection — re-embed documents periodically and compare new embeddings to old ones; alert if semantic similarity drops. 4) Source validation — only accept embeddings from trusted sources; maintain a whitelist of approved embedding sources. 5) Manual review — flag suspicious vectors for manual review by security analysts." },
  { q: "How do I handle embedding model upgrades?", a: "Embedding model upgrades require careful planning to avoid breaking RAG functionality. Strategy: 1) Create new vector index — create a new index for the new embedding model, don't overwrite the existing one. 2) Re-embed corpus — re-embed all documents with the new model. 3) Validate embeddings — run semantic drift checks to ensure new embeddings preserve semantic meaning. 4) Canary deployment — switch a small percentage of traffic to the new index, monitor for issues. 5) Full rollout — if canary is successful, switch all traffic to the new index. 6) Rollback window — keep the old index for 30 days in case rollback is needed. 7) Backward compatibility — support querying across multiple embedding versions if needed for gradual migration." },
]

export default function LlmEmbeddingsSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Embeddings Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Embeddings-Security-Guide für eigene KI-Systeme.", "Embeddings security guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 15</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "LLM Embeddings Security", "LLM Embeddings Security")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Vektor-Embeddings sind das Rückgrat von RAG-Systemen — ohne Security können Angreifer Embeddings manipulieren und Poisoning-Attacken durchführen. Vier Kontrollen: Injection Protection, Vector Store ACL, Poisoning Detection und Versioning.", "Vector embeddings are the backbone of RAG systems — without security, attackers can manipulate embeddings and conduct poisoning attacks. Four controls: injection protection, vector store ACL, poisoning detection and versioning.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Embeddings-Security-Kontrollen", "4 Embeddings Security Controls")}</h2>
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
            <a href={`/${locale}/moltbot/multi-tenant-llm-isolation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Multi-Tenant LLM Isolation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "RAG-Tenant-Isolation", "RAG tenant isolation")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-data-loss-prevention`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Data Loss Prevention</div>
              <div className="text-sm text-gray-300">{pick(isDE, "RAG-Poisoning-Detection", "RAG poisoning detection")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-context-isolation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Context Isolation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Vector-Store-ACL", "Vector store ACL")}</div>
            </a>
            <a href={`/${locale}/moltbot/rag-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">RAG Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "End-to-End-RAG-Security", "End-to-end RAG security")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
