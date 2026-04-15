import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-inference-cost-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "LLM Inference Cost Security: LLM-Inference-Kosten-Security | ClawGuru Moltbot"
    : "LLM Inference Cost Security: LLM Inference Cost Security | ClawGuru Moltbot"
  const description = isDE
    ? "LLM-Inference-Kosten-Security: Cost Monitoring, Budget Enforcement, Quota Management und Cost Anomaly Detection für LLM-Inference-Kosten-Security."
    : "LLM inference cost security: cost monitoring, budget enforcement, quota management and cost anomaly detection for LLM inference cost security."
  return {
    title, description,
    keywords: ["llm inference cost security", "cost monitoring", "budget enforcement", "quota management", "cost anomaly detection", "moltbot cost"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "ICS-1", title: "Cost Monitoring", desc: "Monitor inference costs in real-time. Track per-model, per-user, and per-tenant costs.", code: `# Moltbot inference cost monitoring:
cost_monitoring:
  enabled: true

  # Per-Model Cost Tracking:
  per_model:
    enabled: true
    # Track: cost per model
    # Metrics: tokens, requests, compute time
    # Alert: on cost threshold breach
    # Report: daily cost summary

  # Per-User Cost Tracking:
  per_user:
    enabled: true
    # Track: cost per user
    # Include: token usage, request count
    # Alert: on user cost spike
    # Enforce: user cost limits

  # Per-Tenant Cost Tracking:
  per_tenant:
    enabled: true
    # Track: cost per tenant
    # Include: all models, users
    # Alert: on tenant budget breach
    # Report: monthly tenant cost` },
  { id: "ICS-2", title: "Budget Enforcement", desc: "Enforce inference budgets. Hard stop on budget breach, soft alerts before limit.", code: `# Moltbot budget enforcement:
budget_enforcement:
  enabled: true

  # Hard Budget Limits:
  hard_limits:
    enabled: true
    # Define: hard budget limits
    # Action: block requests on breach
    # Scope: per user, per tenant
    # Notify: admin on block

  # Soft Budget Alerts:
  soft_alerts:
    enabled: true
    # Define: soft alert thresholds
    # Example: alert at 80% of budget
    # Action: warn user and admin
    # Allow: requests to continue

  # Budget Reset:
  reset:
    enabled: true
    # Define: budget reset period (daily, monthly)
    # Automatic: reset on schedule
    # Notify: users of reset
    # Log: budget events` },
  { id: "ICS-3", title: "Quota Management", desc: "Manage inference quotas per user and tenant. Rate limiting by token count and request count.", code: `# Moltbot quota management:
quota_management:
  enabled: true

  # Token Quotas:
  token_quotas:
    enabled: true
    # Define: max tokens per period
    # Period: per hour, per day
    # Enforce: token quota strictly
    # Alert: on quota approach

  # Request Quotas:
  request_quotas:
    enabled: true
    # Define: max requests per period
    # Period: per minute, per hour
    # Enforce: request quota strictly
    # Alert: on quota approach

  # Priority Queuing:
  priority_queuing:
    enabled: true
    # Define: priority tiers
    # High: critical workloads
    # Normal: standard requests
    # Low: batch workloads` },
  { id: "ICS-4", title: "Cost Anomaly Detection", desc: "Detect unusual inference cost patterns. Identify potential abuse or security incidents.", code: `# Moltbot cost anomaly detection:
cost_anomaly_detection:
  enabled: true

  # Statistical Analysis:
  statistical:
    enabled: true
    # Analyze: cost patterns
    # Baseline: normal cost profile
    # Detect: deviations from baseline
    # Alert: on significant anomaly

  # Abuse Detection:
  abuse:
    enabled: true
    # Detect: potential abuse patterns
    # Patterns: sudden cost spike, unusual model usage
    # Alert: on suspected abuse
    # Block: abusive users/tenants

  # Incident Correlation:
  correlation:
    enabled: true
    # Correlate: cost anomalies with security events
    # Link: cost spikes to auth failures, errors
    # Alert: on correlated incidents
    # Investigate: automatically` },
]

const FAQ = [
  { q: "Why is inference cost a security concern?", a: "Inference cost is a security concern because uncontrolled costs can be exploited for denial-of-service attacks. An attacker can flood your LLM API with requests, causing massive cost overruns (economic denial-of-service). Without cost controls, a single compromised API key can bankrupt your inference budget. Cost anomalies can also indicate security incidents — unusual cost spikes may signal prompt injection attacks, model abuse, or data exfiltration." },
  { q: "How do I set effective budget limits?", a: "Set budget limits based on: 1) Baseline usage — measure normal inference costs over 2-4 weeks. 2) Growth factor — add 20-30% buffer for legitimate growth. 3) Alert threshold — set soft alerts at 80% of budget. 4) Hard limit — set hard stop at 100% of budget. 5) Per-user limits — set individual user limits to prevent single-user abuse. Review and adjust limits monthly as usage patterns evolve." },
  { q: "How does token quota differ from request quota?", a: "Token quota limits the total number of tokens processed (input + output) per period. This directly controls compute cost. Request quota limits the number of API calls per period. This controls throughput and prevents flooding. Use both: token quota prevents cost overruns from long context windows, request quota prevents API flooding. Set tighter limits for high-cost models and looser limits for lightweight models." },
  { q: "How do I detect inference cost abuse?", a: "Detect cost abuse by: 1) Baseline monitoring — establish normal cost patterns per user/tenant. 2) Anomaly detection — alert on significant deviations (>2x normal). 3) Pattern analysis — detect unusual model usage patterns. 4) Correlation — correlate cost spikes with auth failures or errors. 5) Rate limiting — enforce strict rate limits to limit abuse impact. Automated response: block abusive users and alert security team." },
]

export default function LlmInferenceCostSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Inference Cost Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Inference-Cost-Security-Guide für eigene KI-Systeme." : "Inference cost security guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 26</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "LLM Inference Cost Security" : "LLM Inference Cost Security"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Unkontrollierte Inference-Kosten sind ein Sicherheitsrisiko — Economic DoS, API-Abuse und Budget-Overruns. Vier Kontrollen: Cost Monitoring, Budget Enforcement, Quota Management und Cost Anomaly Detection."
            : "Uncontrolled inference costs are a security risk — economic DoS, API abuse and budget overruns. Four controls: cost monitoring, budget enforcement, quota management and cost anomaly detection."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Inference-Cost-Security-Kontrollen" : "4 Inference Cost Security Controls"}</h2>
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
            <a href={`/${locale}/moltbot/llm-api-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM API Security</div>
              <div className="text-sm text-gray-300">{isDE ? "API-Security" : "API security"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-rate-limiting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Rate Limiting</div>
              <div className="text-sm text-gray-300">{isDE ? "Rate-Limiting" : "Rate limiting"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-token-budgeting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Token Budgeting</div>
              <div className="text-sm text-gray-300">{isDE ? "Token-Budgeting" : "Token budgeting"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Cost-Security-Overview" : "Cost security overview"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
