import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-data-loss-prevention"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "AI Data Loss Prevention: Datenverlust durch LLMs verhindern | ClawGuru Moltbot", "AI Data Loss Prevention: Prevent Data Leakage via LLMs | ClawGuru Moltbot")
  const description = pick(isDE, "KI-DLP für Moltbot: PII-Erkennung in Prompts, Secrets-Scanning vor LLM-Übermittlung, Output-Exfiltrations-Erkennung und GDPR-konforme Datenmaskierung für LLM-Systeme.", "AI DLP for Moltbot: PII detection in prompts, secrets scanning before LLM submission, output exfiltration detection and GDPR-compliant data masking for LLM systems.")
  return {
    title, description,
    keywords: ["ai data loss prevention", "llm dlp", "ai dlp moltbot", "pii detection llm", "secrets scanning llm", "ai data exfiltration prevention"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const DLP_LAYERS = [
  { id: "DLP-1", title: "Input DLP: PII & Secrets Scanning Before LLM Submission", desc: "Every prompt must be scanned before being sent to an LLM. Personal data and secrets must be detected, masked or blocked — preventing inadvertent LLM memorisation and external API exposure.", code: `# Moltbot input DLP configuration:
input_dlp:
  enabled: true
  scan_order:
    - secrets_detection     # Highest priority — block immediately
    - pii_detection         # Mask or block depending on policy
    - sensitive_data_labels # Custom org-specific patterns

  secrets_detection:
    patterns:
      - name: aws_access_key
        regex: "(AKIA|ABIA|ACCA|ASIA)[A-Z0-9]{16}"
        action: block           # Never send AWS keys to LLM
      - name: generic_api_key
        regex: "(api[_-]?key|apikey)[\\s:=]+['\"]?[A-Za-z0-9\\-_]{20,}"
        action: block
      - name: private_key_pem
        regex: "-----BEGIN (RSA |EC )?PRIVATE KEY-----"
        action: block
      - name: jwt_token
        regex: "eyJ[A-Za-z0-9\\-_]+\\.eyJ[A-Za-z0-9\\-_]+\\.[A-Za-z0-9\\-_]+"
        action: block
    on_detection:
      action: block
      log: true
      alert_channel: security-dlp-alerts

  pii_detection:
    engine: presidio          # Microsoft Presidio or custom
    entities:
      - PERSON                # Names
      - EMAIL_ADDRESS
      - PHONE_NUMBER
      - IBAN_CODE
      - CREDIT_CARD
      - DE_PERSONAL_ID        # German Personalausweis
      - NRP                   # National Registration Patterns
    action: mask              # Replace with [PERSON], [EMAIL], etc.
    # action: block           # Alternative: reject prompt entirely
    # action: allow           # Allow but log (audit mode)
    min_score: 0.75           # Confidence threshold for detection` },
  { id: "DLP-2", title: "Output DLP: Exfiltration & Memorisation Detection", desc: "LLMs can leak training data or output injected content that routes sensitive data to attackers. Scan every LLM response before returning it to the client.", code: `# Moltbot output DLP — scan LLM responses before delivery:
output_dlp:
  enabled: true

  # 1. Re-scan response for PII that the LLM may have generated or leaked:
  pii_rescan:
    enabled: true
    action_on_detect: redact   # Remove PII from response
    alert_if_not_in_input: true  # Alert if output PII was NOT in input (memorisation)

  # 2. Detect prompt exfiltration patterns (LLM routing data out):
  exfiltration_detection:
    patterns:
      - name: url_with_data
        # Detects: https://attacker.com/?data=<sensitive>
        regex: "https?://[^\\s]+\\?[^\\s]*=(\\w{20,})"
        action: block
      - name: base64_encoded_block
        regex: "(?:[A-Za-z0-9+/]{4}){10,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?"
        action: flag_for_review
      - name: webhook_call_pattern
        regex: "(curl|wget|fetch).*https?://[^\\s]+"
        action: block
    on_block:
      return_safe_response: true  # Return generic error, not blocked content
      log_full_response: true     # Log to secure audit store for investigation

  # 3. Training data memorisation detection:
  memorisation_detection:
    enabled: true
    # Flag responses that contain verbatim sequences unlikely to be generated
    # but likely memorised from training data:
    min_verbatim_chars: 150    # Flag if >150 chars match known sensitive training patterns
    on_detect: redact_and_alert` },
  { id: "DLP-3", title: "RAG Corpus DLP: Prevent Sensitive Documents from LLM Context", desc: "Documents indexed into the RAG vector store may contain PII or confidential data that should never reach an LLM context window. Scan documents at index time.", code: `# Moltbot RAG corpus DLP — scan documents before indexing:
rag_dlp:
  enabled: true
  scan_on_index: true         # Block indexing if DLP fails

  classification:
    # Documents are classified on ingest:
    public:
      allowed_in_llm_context: true
    internal:
      allowed_in_llm_context: true
      requires_user_auth: true    # User must be authenticated to retrieve
    confidential:
      allowed_in_llm_context: false  # Never send to LLM
      human_review_required: true
    restricted:
      allowed_in_llm_context: false
      block_indexing: true

  # Auto-classification rules:
  auto_classify:
    - pattern: "(CONFIDENTIAL|STRICTLY CONFIDENTIAL|TOP SECRET)"
      classification: restricted
    - pattern: "(INTERNAL USE ONLY|FOR INTERNAL DISTRIBUTION)"
      classification: confidential
    - pii_entities_found: true
      pii_count_threshold: 5
      classification: confidential

  # At retrieval time: re-validate classification before injecting into context:
  retrieval_validation:
    check_classification_at_retrieval: true
    # Documents may be reclassified after indexing — always check current label` },
  { id: "DLP-4", title: "DLP Audit Trail & GDPR Evidence", desc: "Every DLP event must be logged for compliance evidence — GDPR Art. 32 requires appropriate technical measures, and the audit trail proves they are active.", code: `# Moltbot DLP audit log structure (GDPR-compliant — no raw PII in logs):
dlp_audit:
  log_format: json
  destination: siem             # → SIEM / Elasticsearch

  # What to log per DLP event:
  event_fields:
    - timestamp
    - event_type                # input_blocked | output_redacted | rag_classified
    - dlp_rule_triggered        # e.g., "pii_detection:EMAIL_ADDRESS"
    - action_taken              # blocked | masked | flagged
    - session_id                # Pseudonymised session (NOT user_id directly)
    - prompt_hash               # SHA-256 of original prompt — NOT the raw prompt
    - entity_types_detected     # e.g., ["EMAIL_ADDRESS", "PERSON"] — NOT the values
    - confidence_scores         # Detection confidence per entity type
    # NOT logged: raw PII values, full prompts, user names (GDPR Art. 5 minimisation)

  # GDPR retention policy for DLP logs:
  retention:
    dlp_event_logs: 90days       # Short retention — operational monitoring
    security_incident_logs: 3years  # Longer if DLP event became security incident
    compliance_evidence: 7years  # For audit/regulatory requirements

  # Monthly DLP effectiveness report (for DPO / CISO):
  reporting:
    monthly_summary: true
    include: [total_events, blocked_count, pii_entity_breakdown, trend_analysis]
    recipients: [dpo@company.com, security-team@company.com]` },
]

const FAQ = [
  { q: "What are the most common ways LLMs cause data loss in enterprise environments?", a: "The four primary LLM data loss vectors: 1) Inadvertent PII submission: users paste customer data, employee records, or medical information directly into LLM prompts (often to 'summarize this data' or 'help me write about this case'). The data is then sent to a cloud LLM provider, stored in their logs, potentially used for training. 2) Secret submission: developers paste code containing API keys, connection strings, or credentials into coding assistants — leaked to the LLM provider. 3) Prompt exfiltration (indirect injection): attacker-controlled content in a document or web page contains hidden instructions that cause the agent to exfiltrate data via a crafted URL or webhook call. 4) Training data memorisation leakage: LLMs can reproduce verbatim text from their training data, which may include private data that was accidentally included in training datasets. DLP addresses vectors 1-3 directly; memorisation detection addresses vector 4." },
  { q: "What is the performance impact of running DLP on every LLM request?", a: "DLP latency depends on the implementation: Regex-based detection (secrets, custom patterns): ~1-5ms per scan — negligible. ML-based PII detection (Presidio, spaCy NER): 10-50ms per scan depending on text length. For a typical 1000-token prompt (750 words), expect ~20-30ms added latency. Optimisations: run DLP scans in parallel with LLM request preparation (not in the serial path). Cache scan results for repeated prompts (use prompt hash as cache key). Scan only new content in multi-turn conversations (not the full history on every turn). Async DLP: for non-blocking use cases, run DLP in background and flag for human review rather than blocking. Moltbot's default configuration runs input DLP inline (blocking) and output DLP with <50ms added latency for 95th percentile requests. Accept that this is a required security cost — the alternative is uncontrolled data exfiltration." },
  { q: "How do I handle false positives in PII detection that block legitimate requests?", a: "False positive management strategies: 1) Tune confidence thresholds: lower the min_score for low-risk actions (masking), keep high thresholds for blocking. Start with 0.85+ for blocking, 0.6+ for masking. 2) Allowlisting: add allow-patterns for known-safe content (e.g., product codes that look like phone numbers). 3) Context-aware detection: configure Presidio to consider surrounding context — 'Order ID: 123-456-789' should not be detected as phone number. 4) Tiered actions: never block without a fallback — mask PII and allow the request rather than rejecting it entirely (unless secrets detection). 5) User feedback loop: implement a 'this was incorrectly flagged' button in your UI — feed corrections back into threshold tuning. 6) Monitor false positive rate in DLP audit logs: target <2% false positive rate. High false positives mean users will find workarounds (defeating the DLP entirely)." },
  { q: "Does AI DLP replace traditional DLP solutions like Symantec or Forcepoint?", a: "No — AI DLP complements, not replaces, traditional DLP. Traditional DLP covers: email attachments, file transfers (USB, cloud upload), web traffic (HTTP/S content inspection), endpoint file access patterns. AI-specific DLP covers: LLM prompt content before submission, LLM response content before delivery, RAG corpus classification and retrieval filtering, agent tool call argument scanning. The gap: traditional DLP tools are not built for LLM interaction patterns — they may see an HTTPS POST to api.openai.com but cannot inspect the semantic content of the prompt (encrypted at transport layer, often structured as JSON). AI-specific DLP integrates at the application layer where it can access prompt content before encryption. Recommended architecture: traditional DLP for endpoint/network + Moltbot AI DLP for LLM-layer — integrated with your SIEM for unified visibility across both data planes." },
]

export default function AiDataLossPreventionPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Data Loss Prevention", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "DLP-Guide für eigene KI-Systeme. Kein Angriffsanleitung.", "DLP guide for your own AI systems. Not an attack guide.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 12</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "AI Data Loss Prevention", "AI Data Loss Prevention")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "LLMs sind undichte Stellen für Unternehmensdaten — Nutzer schicken PII, Secrets und vertrauliche Dokumente in Prompts. Vier DLP-Schichten: Input-Scan, Output-Exfiltrations-Erkennung, RAG-Klassifizierung und GDPR-konformes Audit-Log.", "LLMs are data leakage points for enterprise data — users send PII, secrets and confidential documents in prompts. Four DLP layers: input scan, output exfiltration detection, RAG classification and GDPR-compliant audit log.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 DLP-Schichten", "4 DLP Layers")}</h2>
          <div className="space-y-5">
            {DLP_LAYERS.map((c) => (
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
            <a href={`/${locale}/moltbot/llm-output-validation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Output Validation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Output-Validierung & PII-Scan", "Output validation & PII scan")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-audit-logging`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Audit Logging</div>
              <div className="text-sm text-gray-300">{pick(isDE, "DLP-Events auditieren", "Audit DLP events")}</div>
            </a>
            <a href={`/${locale}/solutions/gdpr-ai-data-processing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">GDPR AI Data Processing</div>
              <div className="text-sm text-gray-300">{pick(isDE, "DSGVO-konforme KI", "GDPR-compliant AI")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-context-isolation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Context Isolation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Mandanten-Datentrennung", "Tenant data separation")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
