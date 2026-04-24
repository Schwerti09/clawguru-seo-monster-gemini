import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/multi-tenant-llm-isolation"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "Multi-Tenant LLM Isolation: Mandanten-Datentrennung für KI-Systeme | ClawGuru Moltbot", "Multi-Tenant LLM Isolation: Tenant Data Separation for AI Systems | ClawGuru Moltbot")
  const description = pick(isDE, "Multi-Tenant-Isolation für LLM-Systeme: Konversations-Isolation, Mandanten-spezifische RAG-Partitionierung, Cross-Tenant-Daten-Leckage-Erkennung und getrennte Verschlüsselungsschlüssel pro Mandant.", "Multi-tenant isolation for LLM systems: conversation isolation, tenant-specific RAG partitioning, cross-tenant data leakage detection and separate encryption keys per tenant.")
  return {
    title, description,
    keywords: ["multi tenant llm isolation", "llm tenant isolation", "ai multi tenant security", "llm data separation", "saas ai security", "tenant isolation moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const ISOLATION_LAYERS = [
  { id: "MT-1", title: "Conversation & Context Isolation per Tenant", desc: "Each tenant's conversation history, system prompts, and context windows must be strictly isolated. No conversation data from Tenant A should ever appear in Tenant B's LLM context.", code: `# Moltbot multi-tenant conversation isolation:
multi_tenant:
  isolation_model: strict     # strict | permissive | none

  # Each request is tagged with tenant_id from authenticated JWT:
  tenant_id_source: jwt_claim  # Extract tenant_id from JWT "sub" or "org_id"
  tenant_id_claim: "org_id"

  conversation_isolation:
    storage_key_prefix: "tenant:{tenant_id}:conv:{session_id}"
    # Conversations physically separated by tenant prefix in storage

    # NEVER allow cross-tenant context injection:
    cross_tenant_context: deny
    # This means: a user cannot reference another tenant's conversation history

    # System prompt isolation:
    system_prompt:
      per_tenant_config: true   # Each tenant has own system prompt
      tenant_cannot_override_base: true  # Base safety rules always apply

  # Session isolation validation (paranoid mode):
  session_validation:
    verify_tenant_on_every_request: true  # Don't trust session cache — re-verify
    session_token_binding: true  # Session token bound to tenant_id at creation

  # Emergency isolation: if cross-tenant leak suspected:
  on_isolation_breach:
    action: terminate_all_tenant_sessions
    alert: immediate
    log_forensic: true` },
  { id: "MT-2", title: "Per-Tenant RAG Partitioning", desc: "Each tenant's vector store (RAG) must be physically or logically isolated. A retrieval query from Tenant A must never return documents from Tenant B's corpus.", code: `# Moltbot RAG multi-tenant partitioning:
rag:
  isolation_strategy: namespace  # namespace | separate_collection | separate_db

  # Strategy: namespace (most common — single vector DB, logical separation):
  namespace_config:
    namespace_key: "tenant_id"
    namespace_format: "t_{tenant_id}"  # e.g., t_acme, t_beta_corp

    # All queries are automatically namespaced:
    # query(text, tenant_id="acme") → searches ONLY in namespace "t_acme"
    # Cannot be overridden by user input

    # Namespace enforcement at query layer (not application layer):
    enforce_at: vector_db_client  # Not at app level — harder to bypass

  # Strategy: separate_collection (stronger isolation, more resources):
  # Each tenant gets their own Chroma/Weaviate/Qdrant collection
  # Physical separation — no shared index structures

  # Strategy: separate_db (strongest — for high-compliance tenants):
  # Each high-value tenant gets dedicated vector DB instance
  # Used for: enterprise tiers, regulated industry tenants

  # Cross-tenant retrieval prevention:
  retrieval_validation:
    verify_namespace_before_return: true  # Double-check every result
    on_namespace_mismatch: drop_and_alert  # Drop result + alert security

  # Tenant data deletion (GDPR Art. 17):
  tenant_offboarding:
    delete_namespace: true       # Delete entire namespace on tenant deletion
    verification_scan: true      # Verify no documents remain after deletion` },
  { id: "MT-3", title: "Per-Tenant Encryption Keys", desc: "Different tenants should have different encryption keys for their stored data — a key compromise for one tenant does not expose another's data.", code: `# Moltbot per-tenant encryption key management via Vault:
encryption:
  key_strategy: per_tenant

  vault_config:
    # Each tenant has a dedicated encryption key in Vault:
    key_path_template: "transit/keys/tenant-{tenant_id}"

    # Create key for new tenant:
    # vault write transit/keys/tenant-acme type=aes256-gcm96

    # Encrypt tenant data:
    # vault write transit/encrypt/tenant-acme plaintext=$(base64 <<< "conversation data")

    # Tenant key rotation (without re-encrypting all data — Vault handles):
    rotation_policy:
      auto_rotate_days: 90
      min_decryption_version: 1  # Keep old versions for decryption

  # What is encrypted per tenant:
  encrypted_per_tenant:
    - conversation_logs          # Full conversation history
    - rag_document_store         # Vector store documents
    - agent_memory               # Persistent agent memory
    - user_preferences           # User-level personalisation data
    - audit_logs                 # Encrypted separately for tamper evidence

  # Key access audit:
  key_access_logging: true
  # Every time tenant key is used, log: tenant_id, operation, timestamp, requestor
  # Alert if: key used from unexpected service, key accessed outside business hours` },
  { id: "MT-4", title: "Cross-Tenant Leakage Detection", desc: "Even with isolation in place, monitor for cross-tenant data leakage — LLMs can inadvertently reproduce data from previous requests if context boundaries fail.", code: `# Moltbot cross-tenant leakage detection:
leakage_detection:
  enabled: true

  # 1. Output scanning for other tenants' data patterns:
  cross_tenant_output_scan:
    # Scan LLM output for content that should only exist in another tenant's corpus
    # Uses tenant-specific fingerprints (hashes of unique phrases per tenant)
    fingerprint_check: true
    fingerprint_store: redis      # In-memory for speed
    action_on_detect: block_and_alert_security

  # 2. Context window validation before LLM submission:
  context_validation:
    # Before sending context to LLM, verify all items in context belong to
    # the current tenant (by checking namespace/tenant_id metadata)
    validate_all_context_items: true
    on_foreign_item: remove_and_log  # Remove foreign item, continue, log

  # 3. Statistical anomaly detection:
  # Track: distribution of tenant_ids in retrieved RAG results per request
  # Alert if: results from unexpected tenant namespaces appear (even 1)
  statistical_monitoring:
    track_namespace_distribution: true
    alert_threshold: 0  # Any cross-namespace result = alert

  # 4. Periodic isolation audit:
  isolation_audit:
    schedule: "0 2 * * 0"  # Weekly Sunday 2am
    test: inject_canary_documents_per_tenant
    # Inject unique canary documents per tenant — verify they never appear
    # in queries from other tenants
    on_canary_detected_cross_tenant: critical_alert` },
]

const FAQ = [
  { q: "What are the biggest risks of multi-tenant LLM deployments?", a: "The four primary multi-tenant LLM security risks: 1) Cross-tenant context contamination: if conversation history or RAG results from Tenant A leak into Tenant B's LLM context, the model may reveal confidential information. This can happen via bugs in context management, shared caching (e.g., KV cache sharing in batch inference), or missing namespace enforcement. 2) Prompt injection cross-tenant escalation: a malicious user in Tenant A crafts a prompt that affects system behaviour for Tenant B — particularly dangerous in shared agent deployments. 3) Shared model memorisation: if a shared fine-tuned model is trained on all tenants' data, the model may reproduce one tenant's data in another tenant's session. Mitigation: tenant-specific fine-tuned models or strictly public/anonymised training data for shared models. 4) Administrative over-privilege: platform administrators with access to all tenant data are a single-point insider risk. Mitigation: tenant-managed encryption keys (zero-knowledge architecture where platform admins cannot decrypt tenant data)." },
  { q: "How does namespace isolation in a vector database work?", a: "Namespace isolation in vector databases: a namespace is a logical partition within a single vector database — all vectors tagged with a namespace identifier. Query enforcement: when a query is executed, the namespace parameter filters results to only return vectors tagged with that namespace. Example with Chroma: collection.query(query_texts=['help'], where={'tenant_id': 'acme'}) — even if the query text would semantically match documents from 'beta_corp', the where filter prevents those results from being returned. Security depends on enforcement layer: application-level enforcement (app adds namespace filter) is weaker — a bug in the application can omit the filter. Client-library enforcement (Moltbot's RAG client always adds namespace) is stronger. Database-level enforcement (row-level security or separate collections) is strongest. Best practice: enforce namespace at the lowest level possible (closer to the database), and validate at retrieval time that every returned result matches the expected tenant namespace." },
  { q: "Can I use a shared LLM model across tenants or does each tenant need their own?", a: "Shared model (single instance serving all tenants): Cost-efficient, easier to maintain. Safe if: tenant data is only passed in the context window (not baked into model weights), context isolation is enforced at the application layer, no KV cache sharing between tenant requests (check your inference framework settings). Risks: KV cache contamination in high-throughput deployments, shared fine-tuning with tenant data (don't do this). Per-tenant model (separate model instances): Higher resource cost. Required when: tenants have fundamentally different use cases requiring different fine-tunes, regulatory requirements mandate data separation at model level, enterprise tenants require dedicated infrastructure for compliance. Recommended architecture: shared base model + per-tenant LoRA adapters. The base model (shared) handles general capabilities. The LoRA adapter (per-tenant, small files) provides tenant-specific knowledge. Tenant-specific RAG handles dynamic knowledge without contaminating the base model." },
  { q: "How do I implement zero-knowledge architecture for maximum tenant isolation?", a: "Zero-knowledge multi-tenant architecture: the platform operator cannot access tenant data even if they wanted to. Components: 1) Tenant-managed encryption keys: tenants hold their own Vault transit keys (or bring-your-own-key). Platform encrypts data with the tenant's key — cannot decrypt without tenant providing the key. 2) Client-side encryption for RAG corpus: tenant-side application encrypts documents before uploading to the vector store. Plaintext never reaches the platform infrastructure. 3) Separate vector DB instances per tenant (for high-compliance tiers): no physical sharing of infrastructure. 4) Audit log encryption with tenant key: audit logs encrypted with tenant's key — tenant can verify their own audit trail but platform cannot read it. Tradeoffs: reduces platform's ability to monitor for abuse (can't inspect encrypted content). Support and debugging are harder. More complex key management for tenants. Practical recommendation: offer standard (platform-managed keys) and premium (customer-managed keys) tiers. Zero-knowledge architecture as an optional enterprise add-on for regulated industries (healthcare, finance, government)." },
]

export default function MultiTenantLlmIsolationPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "Multi-Tenant LLM Isolation", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Multi-Tenant-Isolation-Guide für eigene KI-Plattformen.", "Multi-tenant isolation guide for your own AI platforms.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 13</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "Multi-Tenant LLM Isolation", "Multi-Tenant LLM Isolation")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Shared LLM-Infrastruktur für mehrere Mandanten erfordert strikte Datentrennung auf jeder Schicht — Konversation, RAG, Verschlüsselung und Monitoring. Vier Isolation-Schichten mit konkreter Moltbot-Konfiguration.", "Shared LLM infrastructure for multiple tenants requires strict data separation at every layer — conversation, RAG, encryption and monitoring. Four isolation layers with concrete Moltbot configuration.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Isolation-Schichten", "4 Isolation Layers")}</h2>
          <div className="space-y-5">
            {ISOLATION_LAYERS.map((c) => (
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
            <a href={`/${locale}/moltbot/llm-context-isolation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Context Isolation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Konversations-Isolation", "Conversation isolation")}</div>
            </a>
            <a href={`/${locale}/moltbot/agent-memory-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Agent Memory Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Memory-Trennung pro Mandant", "Memory separation per tenant")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-data-loss-prevention`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Data Loss Prevention</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Cross-Tenant-Leckage-Scan", "Cross-tenant leakage scan")}</div>
            </a>
            <a href={`/${locale}/solutions/gdpr-ai-data-processing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">GDPR AI Data Processing</div>
              <div className="text-sm text-gray-300">{pick(isDE, "DSGVO-konforme Multi-Tenancy", "GDPR-compliant multi-tenancy")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
