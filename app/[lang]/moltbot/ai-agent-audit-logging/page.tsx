import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-audit-logging"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Audit Logging: Manipulationssicheres LLM-Logging | ClawGuru Moltbot"
    : "AI Agent Audit Logging: Tamper-Proof LLM Audit Trails | ClawGuru Moltbot"
  const description = isDE
    ? "Manipulationssichere Audit-Logs für KI-Agenten: HMAC-signierte LLM-Interaktionen, Tool-Call-Protokollierung, Compliance-Evidenz für SOC 2 / ISO 27001 und forensische Rekonstruktion von AI-Incidents."
    : "Tamper-proof audit logs for AI agents: HMAC-signed LLM interactions, tool call logging, compliance evidence for SOC 2 / ISO 27001 and forensic reconstruction of AI incidents."
  return {
    title, description,
    keywords: ["ai agent audit logging", "llm audit trail", "moltbot audit log", "ai agent compliance logging", "tamper-proof ai logs", "llm interaction logging"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const AUDIT_LAYERS = [
  { id: "AL-1", title: "HMAC-Signed Append-Only Log", desc: "Every log entry is signed with an HMAC-SHA256 key only the logging service holds. Any tampering — deletion, modification, reordering — is immediately detectable.", code: `# Moltbot audit log schema (each entry):
{
  "entry_id": "uuid-v7",           // Time-ordered, monotonic
  "timestamp": "2026-04-14T18:00:00.123Z",
  "agent_id": "moltbot-agent-prod-01",
  "session_id": "sess_abc123",
  "tenant_id": "tenant_xyz",       // Multi-tenant support
  "event_type": "llm_request",
  "payload": {
    "model": "gpt-4o",
    "prompt_hash": "sha256:abc...", // Hash, never raw prompt (PII protection)
    "token_count_in": 1247,
    "token_count_out": 342,
    "latency_ms": 1840,
    "tool_calls": [
      { "name": "search_kb", "args_hash": "sha256:def...", "result_hash": "sha256:ghi..." }
    ]
  },
  "prev_entry_hash": "sha256:...", // Chain: each entry includes prev hash
  "hmac_sha256": "..."             // HMAC over entire entry including prev_entry_hash
}

# Verification: detect tampering anywhere in chain
moltbot audit verify --log-file /var/log/moltbot/audit.jsonl
# Output: OK — 14,823 entries verified, chain intact
# Or:     TAMPERED — entry 9,421 hash mismatch (deletion detected)` },
  { id: "AL-2", title: "Tool Call Audit Trail", desc: "Every tool invocation — file reads, API calls, database queries — logged with agent identity, arguments hash, and result. Enables forensic reconstruction of any AI action.", code: `# Moltbot tool call audit entry:
{
  "event_type": "tool_call",
  "tool_name": "query_database",
  "agent_role": "analyst",
  "agent_id": "moltbot-analyst-07",
  "invocation_id": "inv_xyz789",
  "timestamp": "2026-04-14T18:01:23.456Z",
  "args": {
    "query_hash": "sha256:...",    // Hash of SQL query (not raw — may contain data)
    "table": "customer_orders",
    "limit": 100
  },
  "authorization": {
    "rbac_role": "analyst",
    "allowed": true,
    "policy_matched": "analyst-read-orders"
  },
  "result": {
    "rows_returned": 100,
    "result_hash": "sha256:...",   // Hash of result (not raw data)
    "data_classification": "internal"
  },
  "duration_ms": 45,
  "hmac_sha256": "..."
}

# Query audit trail for specific agent action:
moltbot audit query \\
  --agent-id moltbot-analyst-07 \\
  --tool query_database \\
  --start 2026-04-14T00:00:00Z \\
  --end 2026-04-14T23:59:59Z \\
  --format csv > incident_report.csv` },
  { id: "AL-3", title: "Compliance Evidence Export", desc: "Generate ready-to-use audit evidence for SOC 2 CC7.2, ISO 27001 A.8.15, and GDPR Art. 30 — formatted for auditor review without manual data collection.", code: `# SOC 2 CC7.2 evidence export (Monitoring of System Components)
moltbot audit export \\
  --standard soc2 \\
  --control CC7.2 \\
  --period 2025-01-01/2025-12-31 \\
  --output soc2_cc7.2_evidence.pdf

# ISO 27001 A.8.15 evidence (Logging)
moltbot audit export \\
  --standard iso27001 \\
  --control A.8.15 \\
  --period 2025-01-01/2025-12-31 \\
  --output iso27001_A.8.15_evidence.pdf

# GDPR Art. 30 Records of Processing Activities
moltbot audit export \\
  --standard gdpr \\
  --article art30 \\
  --include-data-subjects true \\
  --output gdpr_art30_ropa.pdf

# Summary metrics included in each export:
# - Log completeness: X% of expected entries present
# - Integrity checks: All HMAC signatures verified
# - Anomaly count: N events flagged for review
# - Retention compliance: Oldest log = X days (required: Y days)` },
  { id: "AL-4", title: "Anomaly Detection on Audit Stream", desc: "Real-time analysis of the audit log stream. Detect: unusual tool call frequency, off-hours agent activity, data access volume spikes, and prompt injection patterns in tool args.", code: `# Moltbot audit anomaly detection rules (YAML config):
anomaly_detection:
  rules:
    - name: excessive_tool_calls
      description: "Agent calling tools more than 10x baseline"
      condition:
        metric: tool_calls_per_minute
        baseline_window: 7d
        threshold_multiplier: 10
      action: alert_and_pause   # Pause agent, alert ops

    - name: off_hours_data_access
      description: "Database queries outside business hours"
      condition:
        tool: query_database
        time_window: "00:00-06:00 weekdays, all weekends"
        min_count: 1
      action: alert             # Alert only (may be legitimate batch jobs)

    - name: data_volume_spike
      description: "Agent returning >10x normal result volume"
      condition:
        metric: result_rows_per_session
        baseline_window: 7d
        threshold_multiplier: 10
      action: alert_and_throttle  # Slow down, alert

    - name: prompt_injection_in_tool_args
      description: "Tool arguments match known injection patterns"
      condition:
        match_patterns:
          - "ignore previous instructions"
          - "system prompt"
          - "jailbreak"
      action: block_and_alert   # Block tool call entirely

# Webhook delivery to SIEM:
webhooks:
  - url: "https://siem.internal/moltbot-alerts"
    events: [anomaly_detected, agent_paused]
    hmac_secret_ref: k8s-secret/moltbot-webhook-secret` },
]

const FAQ = [
  { q: "Why hash prompts and results instead of logging them in plaintext?", a: "Logging raw LLM prompts and results creates significant compliance problems: 1) PII leakage: users often share personal data (names, addresses, health info) in prompts — logging raw text puts this PII in your audit store, creating GDPR/HIPAA data minimization violations. 2) Sensitive business data: LLM outputs may contain confidential analysis, pricing, or strategy information — storing in logs expands the sensitive data surface. 3) Log forwarding risk: audit logs are often shipped to SIEM systems — raw LLM content in a SIEM increases the blast radius if the SIEM is compromised. SHA-256 hashing provides audit integrity (can verify content hasn't changed) without storing the content itself. For incident investigation, the original content is typically available from the application database for a limited window; the hash enables cross-referencing." },
  { q: "What is HMAC chain logging and why is it better than standard logging?", a: "Standard logging: each log entry is independent. An attacker who compromises the logging system can delete specific entries without detection. HMAC chain logging: each entry includes the hash of the previous entry (creating a blockchain-like structure) and an HMAC signature over the entire entry. Properties: Deletion detection: removing any entry breaks the chain — prev_entry_hash won't match. Modification detection: changing any field changes the entry's hash, breaking the HMAC signature. Reordering detection: reordering entries breaks the chain because each entry's hash is computed from its predecessor. Time ordering: UUID v7 provides monotonically increasing timestamps, detecting clock manipulation. The signing key is held only by the audit service — neither the agent nor the application can forge entries." },
  { q: "How long should AI agent audit logs be retained?", a: "Minimum retention requirements by standard: SOC 2 (no specific requirement, typically 1 year for evidence). ISO 27001 A.8.15: organization-defined, typically 1-3 years. GDPR: as long as necessary for the processing purpose + 3 years for legal claim defense. PCI DSS 10.7: 12 months minimum, 3 months immediately accessible. HIPAA: 6 years. NIS2: 3 years for significant incident records. For AI agents: recommend 1 year hot storage (queryable), 3 years cold storage (archived, S3 Glacier or similar). Key consideration: if the AI agent processes personal data, the audit log's retention must align with the data subject's rights — specifically the right to erasure. Audit log entries referencing a deleted data subject's interactions must themselves be deletable without breaking chain integrity (use soft-delete markers)." },
  { q: "How does audit logging help with AI incident forensics?", a: "When an AI incident occurs (unexpected output, data leak, prompt injection, agent acting outside its role), the audit trail enables: 1) Root cause: which exact prompt triggered the behavior? What was the agent's role and tool permissions at that moment? 2) Scope assessment: how many sessions were affected? What data did the agent access? Which tool calls were made? 3) Timeline reconstruction: complete chronological sequence from user input to tool calls to LLM requests to output — every step is recorded with timestamps. 4) Attribution: which agent identity (service account), which session, which tenant? 5) Evidence for regulators: GDPR Art. 33 breach notification requires knowing what data was affected — audit logs provide this. Moltbot's audit export generates incident reports in regulator-ready formats." },
]

export default function AiAgentAuditLoggingPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent Audit Logging", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Audit-Logging-Guide für eigene KI-Agenten-Infrastruktur." : "Audit logging guide for your own AI agent infrastructure."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 10</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? "AI Agent Audit Logging" : "AI Agent Audit Logging"}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Standard-Logs reichen für KI-Agenten nicht aus — sie sind löschbar, fälschbar und nicht compliance-fähig. HMAC-Chain-Logs, Tool-Call-Audit-Trail, Compliance-Evidence-Export und Echtzeit-Anomalie-Erkennung."
            : "Standard logs are insufficient for AI agents — they're deletable, forgeable, and not compliance-ready. HMAC chain logs, tool call audit trail, compliance evidence export and real-time anomaly detection."}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "HMAC", label: isDE ? "Kettensignatur" : "Chain signature" },
            { value: "SOC2", label: isDE ? "Evidence-Export" : "Evidence export" },
            { value: "SHA-256", label: isDE ? "Prompt-Hashing" : "Prompt hashing" },
            { value: "RT", label: isDE ? "Anomalie-Detect." : "Anomaly detect." },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Audit-Logging-Schichten" : "4 Audit Logging Layers"}</h2>
          <div className="space-y-5">
            {AUDIT_LAYERS.map((a) => (
              <div key={a.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{a.id}</span>
                  <span className="font-bold text-gray-100">{a.title}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-3">{a.desc}</p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto"><pre>{a.code}</pre></div>
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
            <a href={`/${locale}/moltbot/ai-incident-response`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Incident Response</div>
              <div className="text-sm text-gray-300">{isDE ? "Logs für Incident-Forensik nutzen" : "Use logs for incident forensics"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Compliance Automation</div>
              <div className="text-sm text-gray-300">{isDE ? "SOC 2 / ISO 27001 Evidenz" : "SOC 2 / ISO 27001 evidence"}</div>
            </a>
            <a href={`/${locale}/openclaw/audit-logging-setup`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Audit Logging Setup</div>
              <div className="text-sm text-gray-300">{isDE ? "OpenClaw Infra-Logging" : "OpenClaw infra logging"}</div>
            </a>
            <a href={`/${locale}/solutions/soc2-type-ii-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">SOC 2 Type II Automation</div>
              <div className="text-sm text-gray-300">{isDE ? "CC7.2 Evidence exportieren" : "Export CC7.2 evidence"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
