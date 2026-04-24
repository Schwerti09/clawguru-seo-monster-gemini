import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-token-budgeting"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Token Budgeting: LLM-Token-Budgeting | ClawGuru Moltbot", "LLM Token Budgeting: LLM Token Budgeting | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-Token-Budgeting: Token Quota Management, Cost Control, Token Allocation und Budget Enforcement für LLM-Kostenoptimierung.", "LLM token budgeting: token quota management, cost control, token allocation and budget enforcement for LLM cost optimisation.")
  return {
    title, description,
    keywords: ["llm token budgeting", "llm cost control", "token quota management", "llm cost optimisation", "token allocation", "moltbot budgeting"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const BUDGET_CONTROLS = [
  { id: "TB-1", title: "Token Quota Management", desc: "Manage token quotas per user, per session, and per organisation. Enforce quotas to control costs and prevent abuse.", code: `# Moltbot token quota management:
token_quota:
  enabled: true

  # Per-user quotas:
  user_quota:
    free_tier:
      tokens_per_month: 100000
      tokens_per_day: 5000
      tokens_per_request: 1000

    pro_tier:
      tokens_per_month: 1000000
      tokens_per_day: 50000
      tokens_per_request: 10000

    enterprise_tier:
      tokens_per_month: 10000000
      tokens_per_day: 500000
      tokens_per_request: 100000

  # Per-session quotas:
  session_quota:
    max_tokens_per_session: 50000
    max_tokens_per_request: 10000

  # Enforcement:
  enforcement:
    action: block  # Options: block, throttle, queue
    block_message: "Token quota exceeded. Please upgrade your plan."
    notify_on_exceed: true` },
  { id: "TB-2", title: "Cost Control", desc: "Track and control LLM costs in real-time. Set cost budgets and alerts to prevent overspending.", code: `# Moltbot cost control:
cost_control:
  enabled: true

  # Cost tracking:
  tracking:
    # Track costs by: user, session, model, endpoint
    track_by: ["user", "session", "model", "endpoint"]

  # Cost budgets:
  budgets:
    # Set cost budgets per user, per organisation
    user_monthly_budget_usd: 100
    organisation_monthly_budget_usd: 10000

  # Cost alerts:
  alerts:
    enabled: true
    # Alert when costs reach thresholds
    thresholds:
      - percentage: 50
        notify: true
        message: "50% of budget consumed."
      - percentage: 80
        notify: true
        message: "80% of budget consumed. Approaching limit."
      - percentage: 95
        notify: true
        action: throttle
        message: "95% of budget consumed. Throttling requests."
      - percentage: 100
        notify: true
        action: block
        message: "Budget exceeded. Requests blocked."

  # Cost optimisation:
  optimisation:
    # Automatically switch to cheaper models for non-critical requests
    enable_model_downgrade: true
    # Cache responses to avoid repeated LLM calls
    enable_caching: true` },
  { id: "TB-3", title: "Token Allocation", desc: "Allocate tokens dynamically based on request priority, user tier, and system load. Ensure critical requests get the resources they need.", code: `# Moltbot token allocation:
token_allocation:
  enabled: true

  # Priority-based allocation:
  priority:
    # Allocate tokens based on request priority
    levels:
      critical:
        allocation: 100  # 100% of requested tokens
        queue_priority: 1

      high:
        allocation: 80
        queue_priority: 2

      normal:
        allocation: 50
        queue_priority: 3

      low:
        allocation: 20
        queue_priority: 4

  # User tier-based allocation:
  user_tier:
    # Allocate more tokens to higher-tier users
    free: multiplier 1.0
    pro: multiplier 10.0
    enterprise: multiplier 100.0

  # System load-based allocation:
  system_load:
    # Reduce allocation when system is under load
    cpu_percent_80: multiplier 0.8
    cpu_percent_90: multiplier 0.5
    cpu_percent_95: multiplier 0.2

  # Real-time adjustment:
  adjustment:
    enabled: true
    interval_seconds: 60
    notify_on_change: true` },
  { id: "TB-4", title: "Budget Enforcement", desc: "Enforce token budgets at the API level. Block or throttle requests that exceed quotas. Provide clear feedback to users.", code: `# Moltbot budget enforcement:
enforcement:
  enabled: true

  # Enforcement strategies:
  strategies:
    # 1. Hard block
    hard_block:
      enabled: true
      # Immediately reject requests over quota
      action: block
      message: "Token quota exceeded. Please wait for reset."

    # 2. Soft throttle
    soft_throttle:
      enabled: true
      # Slow down requests over quota instead of blocking
      action: throttle
      throttle_factor: 0.5  # Reduce speed to 50%

    # 3. Queue
    queue:
      enabled: false
      # Queue requests and process when quota resets
      action: queue
      max_queue_size: 100

  # Quota reset:
  reset:
    # Reset quotas at defined intervals
    daily_reset: "00:00 UTC"
    monthly_reset: "first_day_of_month"

  # User notification:
  notification:
    # Notify users when quota is exceeded
    notify_via: ["email", "in_app"]
    # Provide upgrade option
    upgrade_prompt: true` },
]

const FAQ = [
  { q: "How do I calculate the optimal token budget for my use case?", a: "Token budget calculation depends on your use case, user behavior, and cost constraints. General guidance: 1) Measure actual usage — collect metrics on token consumption per user, per session, and per request in production. 2) Calculate cost per token — multiply by your LLM provider's pricing (e.g., GPT-4: $0.03/1K input tokens, $0.06/1K output tokens). 3) Set budget based on cost tolerance — determine your monthly cost budget per user and derive token budget from cost. 4) Add buffer — add 20-30% buffer for unexpected usage spikes. 5) Monitor and adjust — review usage monthly and adjust budgets based on actual data." },
  { q: "What is the difference between token-based and cost-based budgeting?", a: "Token-based budgeting limits the number of tokens a user can consume, regardless of the cost of those tokens. Cost-based budgeting limits the dollar amount a user can spend, accounting for different token costs across models. Example: token-based budget of 100K tokens allows 100K tokens of GPT-4 ($6) or 100K tokens of GPT-3.5 ($0.20). Cost-based budget of $10 allows 333K tokens of GPT-3.5 or 166K tokens of GPT-4. Recommendation: use cost-based budgeting if you use multiple models with different pricing. Use token-based budgeting if you use a single model or want simpler accounting." },
  { q: "How do I handle budget overruns?", a: "Budget overruns occur when users consume more tokens or cost than their allocated budget. Response strategies: 1) Hard block — immediately reject requests when budget is exceeded. This is strict but may frustrate users. 2) Soft throttle — slow down requests (reduce speed to 50%) when budget is exceeded. This allows continued access at reduced capacity. 3) Queue — queue requests and process when budget resets. This delays but doesn't block requests. 4) Graceful degradation — switch to cheaper models for non-critical requests. 5) Upgrade prompt — offer to upgrade to a higher tier for increased budget. 6) Alerting — notify users before budget is exhausted (at 80%, 95%)." },
  { q: "How do I optimise token usage to reduce costs?", a: "Token optimisation strategies: 1) Use cheaper models for non-critical requests (e.g., GPT-3.5 for summarisation, GPT-4 for complex reasoning). 2) Cache responses — avoid repeated LLM calls for identical requests. 3) Prompt engineering — write efficient prompts that get the desired result with fewer tokens. 4) Token budgeting — set per-request token limits to prevent overly long prompts. 5) RAG optimisation — retrieve only the most relevant documents to reduce context window usage. 6) Streaming responses — stop generation when the answer is complete rather than waiting for max tokens. 7) Model selection — choose the smallest model that can handle the task." },
]

export default function LlmTokenBudgetingPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Token Budgeting", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Token-Budgeting-Guide für eigene KI-Systeme.", "Token budgeting guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 16</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "LLM Token Budgeting", "LLM Token Budgeting")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "LLM-Token-Kosten können schnell explodieren — ohne Budgeting können Kosten unkontrolliert steigen. Vier Kontrollen: Quota Management, Cost Control, Token Allocation und Budget Enforcement.", "LLM token costs can explode quickly — without budgeting, costs can rise uncontrollably. Four controls: quota management, cost control, token allocation and budget enforcement.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Token-Budgeting-Kontrollen", "4 Token Budgeting Controls")}</h2>
          <div className="space-y-5">
            {BUDGET_CONTROLS.map((c) => (
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
            <a href={`/${locale}/moltbot/llm-context-window-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Context Window Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Token-Budget-Allocation", "Token budget allocation")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-rate-limiting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Rate Limiting</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Token-Based-Rate-Limiting", "Token-based rate limiting")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-observability`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Observability</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Cost-Monitoring", "Cost monitoring")}</div>
            </a>
            <a href={`/${locale}/pricing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Pricing</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Token-Pläne", "Token plans")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
