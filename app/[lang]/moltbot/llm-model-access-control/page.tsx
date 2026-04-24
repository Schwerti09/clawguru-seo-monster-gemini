import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-model-access-control"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Model Access Control: LLM-Modell-Zugriffskontrolle | ClawGuru Moltbot", "LLM Model Access Control: LLM Model Access Control | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-Modell-Zugriffskontrolle: Model Allowlisting, Model Permissions, Model Access Auditing und Model Versioning für LLM-Modell-Sicherheit.", "LLM model access control: model allowlisting, model permissions, model access auditing and model versioning for LLM model security.")
  return {
    title, description,
    keywords: ["llm model access control", "model allowlisting", "llm model permissions", "model access auditing", "model versioning", "moltbot model control"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "MAC-1", title: "Model Allowlisting", desc: "Maintain an allowlist of approved LLM models. Block access to unapproved or deprecated models to ensure only vetted models are used.", code: `# Moltbot model allowlisting:
model_allowlist:
  enabled: true

  # Approved models:
  approved_models:
    - id: "gpt-4-turbo-preview"
      provider: "openai"
      version: "latest"
      approved_for: ["production", "staging"]
      approved_by: "security-team"
      approved_date: "2025-01-01"

    - id: "claude-3-opus"
      provider: "anthropic"
      version: "20240229"
      approved_for: ["production"]
      approved_by: "security-team"
      approved_date: "2025-01-15"

  # Blocked models:
  blocked_models:
    - id: "deprecated-model-v1"
      reason: "Security vulnerability"
      blocked_date: "2025-02-01"

  # Enforcement:
  enforcement:
    action: block  # Options: block, warn, allow_with_flag
    block_message: "Model not approved. Use an approved model from the allowlist."` },
  { id: "MAC-2", title: "Model Permissions", desc: "Assign permissions to models based on user tier, use case, and data sensitivity. Restrict access to powerful models for sensitive use cases.", code: `# Moltbot model permissions:
model_permissions:
  enabled: true

  # User tier-based permissions:
  user_tier:
    free:
      allowed_models: ["gpt-3.5-turbo"]
      max_tokens_per_request: 4000

    pro:
      allowed_models: ["gpt-3.5-turbo", "gpt-4-turbo-preview"]
      max_tokens_per_request: 8000

    enterprise:
      allowed_models: ["gpt-3.5-turbo", "gpt-4-turbo-preview", "claude-3-opus"]
      max_tokens_per_request: 32000

  # Use case-based permissions:
  use_case:
    general_chat:
      allowed_models: ["gpt-3.5-turbo"]

    code_generation:
      allowed_models: ["gpt-4-turbo-preview", "claude-3-opus"]

    data_analysis:
      allowed_models: ["gpt-4-turbo-preview", "claude-3-opus"]

  # Data sensitivity-based permissions:
  data_sensitivity:
    public:
      allowed_models: ["gpt-3.5-turbo", "gpt-4-turbo-preview", "claude-3-opus"]

    internal:
      allowed_models: ["gpt-4-turbo-preview", "claude-3-opus"]

    confidential:
      allowed_models: ["claude-3-opus"]` },
  { id: "MAC-3", title: "Model Access Auditing", desc: "Audit all model access events. Log which users accessed which models, when, and for what purpose. Enable compliance and incident response.", code: `# Moltbot model access auditing:
model_access_audit:
  enabled: true

  # Audit logging:
  logging:
    log_all_access: true
    log_fields:
      - user_id
      - model_id
      - model_provider
      - timestamp
      - request_id
      - use_case
      - token_count
      - cost
      - data_sensitivity

  # Audit storage:
  storage:
    type: "database"  # Options: database, file, s3
    retention_days: 365
    encryption: true

  # Audit alerts:
  alerts:
    enabled: true
    # Alert on:
    # - Access to blocked models
    # - Unusual model access patterns
    # - High-cost model usage
    # - Access by unauthorised users
    alert_on:
      - blocked_model_access
      - unusual_pattern
      - high_cost_usage
      - unauthorised_access

  # Compliance reporting:
  compliance:
    enabled: true
    # Generate compliance reports for:
    # - SOC 2 (model access logs)
    # - GDPR (data processing logs)
    # - ISO 27001 (access control logs)
    reports:
      - soc2_model_access
      - gdpr_data_processing
      - iso27001_access_control` },
  { id: "MAC-4", title: "Model Versioning", desc: "Track model versions and enforce version policies. Prevent use of deprecated models and ensure smooth rollouts of new versions.", code: `# Moltbot model versioning:
model_versioning:
  enabled: true

  # Version tracking:
  tracking:
    enabled: true
    # Track: model ID, provider, version, release date, deprecation date
    # Maintain version history for audit trails

  # Deprecation policy:
  deprecation:
    enabled: true
    # Deprecate models after:
    deprecation_after_months: 12
    # Notify users before deprecation:
    notify_before_days: 30
    # Block deprecated models:
    block_deprecated: true

  # Version rollout:
  rollout:
    strategy: "canary"  # Options: canary, blue_green, big_bang
    # Canary rollout: 10% -> 50% -> 100%
    canary_stages:
      - percentage: 10
        duration_hours: 24
      - percentage: 50
        duration_hours: 48
      - percentage: 100
        duration_hours: 0

  # Rollback:
  rollback:
    enabled: true
    # Allow rollback to previous version on issues
    rollback_window_hours: 72
    # Automatic rollback on error rate threshold
    auto_rollback_error_threshold_percent: 5` },
]

const FAQ = [
  { q: "What is the difference between model allowlisting and model permissions?", a: "Model allowlisting is a binary control — a model is either approved or not approved for use in your system. It's a gate that prevents unapproved models from being used at all. Model permissions are granular controls that define which users can use which models, for which use cases, and with what limits. Example: allowlisting says 'GPT-4 is approved for use'. Permissions say 'Enterprise users can use GPT-4 for code generation with 32K tokens, free users cannot use GPT-4 at all'. Both are necessary: allowlisting ensures only vetted models are used, permissions ensure appropriate use of those models." },
  { q: "How do I implement model access auditing for compliance?", a: "Model access auditing for compliance requires: 1) Log all model access events with relevant fields (user_id, model_id, timestamp, use_case, token_count, cost). 2) Store logs securely with encryption at rest and in transit. 3) Retain logs for required period (SOC 2: 90 days minimum, GDPR: as long as needed, ISO 27001: 3 years). 4) Generate compliance reports on demand (SOC 2 reports, GDPR data processing records, ISO 27001 access control logs). 5) Enable audit alerts for suspicious activity (blocked model access, unusual patterns, high-cost usage). 6) Implement log integrity (hash logs, append-only storage) to prevent tampering." },
  { q: "How do I handle model deprecation and version rollouts?", a: "Model deprecation and version rollout strategy: 1) Deprecation policy — deprecate models after a set period (e.g., 12 months) to encourage migration to newer models. 2) Notify users — notify users 30 days before deprecation with migration guidance. 3) Block deprecated models — automatically block access to deprecated models after deprecation date. 4) Version rollout — use canary rollout (10% -> 50% -> 100%) to test new versions before full rollout. 5) Rollback — maintain rollback window (72 hours) to revert to previous version if issues arise. 6) Monitor — monitor error rates and user feedback during rollout." },
  { q: "What are the security risks of uncontrolled model access?", a: "Uncontrolled model access poses several security risks: 1) Data leakage — users may send sensitive data to models that don't meet security requirements (e.g., models that log data). 2) Cost explosion — users may access expensive models without limits, causing uncontrolled costs. 3) Compliance violations — using unapproved models may violate compliance requirements (SOC 2, GDPR, ISO 27001). 4) Deprecated model usage — using deprecated models with known vulnerabilities. 5) Model jailbreaks — powerful models may be more susceptible to jailbreaks, increasing risk. 6) Audit trail gaps — without access logging, you cannot track who used which models for what purpose." },
]

export default function LlmModelAccessControlPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Model Access Control", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Model-Access-Control-Guide für eigene KI-Systeme.", "Model access control guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 17</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "LLM Model Access Control", "LLM Model Access Control")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "LLM-Modelle ohne Zugriffskontrolle können Datenlecks, Kostenexplosionen und Compliance-Verstöße verursachen. Vier Kontrollen: Allowlisting, Permissions, Auditing und Versioning.", "LLM models without access control can cause data leaks, cost explosions, and compliance violations. Four controls: allowlisting, permissions, auditing and versioning.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Model-Access-Control-Kontrollen", "4 Model Access Control Controls")}</h2>
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
            <a href={`/${locale}/moltbot/ai-agent-rbac`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent RBAC</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Model-Permissions", "Model permissions")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-api-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM API Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Model-Allowlisting", "Model allowlisting")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-audit-logging`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Audit Logging</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Model-Access-Auditing", "Model access auditing")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-model-versioning-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Model Versioning Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Model-Versioning", "Model versioning")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
