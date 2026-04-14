import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-rate-limiting"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Rate Limiting: KI-Agenten-Rate-Limiting | ClawGuru Moltbot"
    : "AI Agent Rate Limiting: AI Agent Rate Limiting | ClawGuru Moltbot"
  const description = isDE
    ? "AI-Agent-Rate-Limiting: Token-Based Rate Limiting, Tool Call Throttling, Agent Session Quotas und Dynamic Rate Adjustment für KI-Agent-Systeme."
    : "AI agent rate limiting: token-based rate limiting, tool call throttling, agent session quotas and dynamic rate adjustment for AI agent systems."
  return {
    title, description,
    keywords: ["ai agent rate limiting", "llm rate limiting", "agent throttling", "tool call rate limit", "token quota", "moltbot rate limiting"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "RL-1", title: "Token-Based Rate Limiting", desc: "Rate limit based on token consumption rather than request count. This prevents token flooding attacks where an attacker sends many small requests to bypass per-request limits.", code: `# Moltbot token-based rate limiting:
token_rate_limit:
  enabled: true

  # Per-user token quota:
  user_quota:
    tokens_per_minute: 10000
    tokens_per_hour: 100000
    tokens_per_day: 1000000

  # Token counting:
  counting:
    # Count: input tokens + output tokens + RAG tokens
    include_rag_tokens: true
    include_system_prompt_tokens: true

  # Enforcement:
  enforcement:
    action: throttle  # Options: block, throttle, queue
    throttle_factor: 0.5  # Reduce speed to 50% when over quota
    block_message: "Token quota exceeded. Please wait."

  # Burst allowance:
  burst:
    enabled: true
    # Allow short bursts above quota for legitimate use
    burst_multiplier: 2  # Allow 2x quota for short bursts
    burst_duration_seconds: 30` },
  { id: "RL-2", title: "Tool Call Throttling", desc: "Rate limit tool calls separately from LLM calls. Tools can be more expensive or dangerous than LLM generation, so they need stricter limits.", code: `# Moltbot tool call throttling:
tool_rate_limit:
  enabled: true

  # Per-tool rate limits:
  tools:
    database_query:
      calls_per_minute: 20
      calls_per_hour: 200

    http_request:
      calls_per_minute: 10
      calls_per_hour: 100

    file_read:
      calls_per_minute: 50
      calls_per_hour: 500

    file_write:
      calls_per_minute: 5
      calls_per_hour: 50
      # File writes are more dangerous — stricter limits

  # Global tool call limit:
  global:
    total_tool_calls_per_minute: 100
    total_tool_calls_per_hour: 1000

  # Enforcement:
  enforcement:
    action: block  # Block tool calls when over quota
    alert_on: repeated_violations
    alert_threshold: 3  # Alert after 3 violations` },
  { id: "RL-3", title: "Agent Session Quotas", desc: "Implement session-based quotas to limit the total resources a single agent session can consume. This prevents long-running agent workflows from exhausting resources.", code: `# Moltbot agent session quotas:
session_quotas:
  enabled: true

  # Per-session limits:
  session:
    max_duration_minutes: 60
    max_total_tokens: 100000
    max_tool_calls: 500
    max_llm_calls: 100

  # Session timeout:
  timeout:
    idle_timeout_minutes: 10  # End session after 10 min idle
    absolute_timeout_minutes: 60  # End session after 60 min total

  # Quota exhaustion action:
  on_quota_exhaustion:
    action: graceful_shutdown  # Complete current task, then end session
    notify_user: true
    notification_message: "Session quota reached. Session will end after current task."

  # Session persistence:
  persistence:
    enabled: false  # Disable long-running sessions for security
    # If enabled, implement session resume with quota carryover` },
  { id: "RL-4", title: "Dynamic Rate Adjustment", desc: "Dynamically adjust rate limits based on system load, user tier, and threat level. Increase limits for trusted users, decrease for suspicious activity.", code: `# Moltbot dynamic rate adjustment:
dynamic_rate_limit:
  enabled: true

  # User tier-based adjustment:
  user_tiers:
    free:
      tokens_per_minute: 1000
      multiplier: 1.0

    pro:
      tokens_per_minute: 10000
      multiplier: 10.0

    enterprise:
      tokens_per_minute: 100000
      multiplier: 100.0

  # System load-based adjustment:
  system_load:
    enabled: true
    # Reduce limits when system is under load
    load_thresholds:
      cpu_percent_80: multiplier 0.8
      cpu_percent_90: multiplier 0.5
      cpu_percent_95: multiplier 0.2

  # Threat-based adjustment:
  threat_level:
    enabled: true
    # Reduce limits for users with suspicious activity
    threat_high: multiplier 0.1
    threat_medium: multiplier 0.5
    threat_low: multiplier 1.0

  # Real-time adjustment:
  adjustment:
    interval_seconds: 60  # Re-evaluate every minute
    notify_on_change: true` },
]

const FAQ = [
  { q: "Why use token-based rate limiting instead of request-based?", a: "Request-based rate limiting counts each HTTP request as one unit, regardless of how much compute it consumes. An attacker can send many small requests (e.g., 1-token prompts) to bypass the limit while still consuming significant resources. Token-based rate limiting counts the actual tokens consumed: input tokens, output tokens, and RAG tokens. This prevents token flooding attacks because the attacker is limited by total token budget, not request count. Example: with request-based limit of 100 requests/min, an attacker could send 100 requests with 10k tokens each = 1M tokens/min. With token-based limit of 10k tokens/min, the attacker is capped at 10k tokens regardless of request count." },
  { q: "How do I set appropriate rate limits for my use case?", a: "Rate limits depend on your use case and business model. General guidance: 1) Measure actual usage — collect metrics on token consumption, tool call frequency, and session duration in production. 2) Set baseline limits based on 95th percentile of normal usage. 3) Add burst allowance (2-3x baseline) for legitimate spikes. 4) Implement tiered limits for different user tiers (free, pro, enterprise). 5) Adjust based on cost — if you're paying per token, set limits to control costs. 6) Monitor violations — if legitimate users hit limits frequently, increase them. If abuse is detected, decrease limits or block." },
  { q: "How do I handle rate limit violations gracefully?", a: "Graceful rate limit handling improves user experience while maintaining security. Strategies: 1) Throttle instead of block — slow down responses rather than reject them outright. 2) Queue requests — put over-quota requests in a queue and process when quota resets. 3) Provide clear feedback — tell the user why they're being rate limited and when they can retry. 4) Offer quota upgrade — for SaaS, offer to upgrade to a higher tier for increased quota. 5) Implement exponential backoff — instruct clients to retry with exponential backoff. 6) Session-aware limits — track quota per session, not per IP, to avoid blocking legitimate users behind NAT." },
  { q: "How does dynamic rate adjustment work?", a: "Dynamic rate adjustment automatically increases or decreases rate limits based on changing conditions. Factors: 1) User tier — enterprise users get higher limits than free users. 2) System load — when the system is under high load (CPU, memory), reduce limits for all users to prevent overload. 3) Threat level — if a user exhibits suspicious behavior (rapid requests, failed auth), reduce their limits. 4) Time of day — increase limits during off-peak hours, decrease during peak hours. 5) Geographic region — adjust limits based on regional capacity. Implementation: monitor metrics in real-time, apply multipliers to base limits, notify users when limits change." },
]

export default function AiAgentRateLimitingPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent Rate Limiting", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Rate-Limiting-Guide für eigene KI-Systeme." : "Rate limiting guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 15</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Rate Limiting" : "AI Agent Rate Limiting"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "KI-Agenten ohne Rate-Limiting können Ressourcen erschöpfen und Angriffe erleichtern. Vier Kontrollen: Token-Based Limits, Tool Call Throttling, Session Quotas und Dynamic Rate Adjustment."
            : "AI agents without rate limiting can exhaust resources and facilitate attacks. Four controls: token-based limits, tool call throttling, session quotas and dynamic rate adjustment."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Rate-Limiting-Kontrollen" : "4 Rate Limiting Controls"}</h2>
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
            <a href={`/${locale}/moltbot/llm-rate-limiting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Rate Limiting</div>
              <div className="text-sm text-gray-300">{isDE ? "Token-Based-Limits" : "Token-based limits"}</div>
            </a>
            <a href={`/${locale}/moltbot/agent-tool-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Agent Tool Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Tool-Call-Throttling" : "Tool call throttling"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-rbac`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent RBAC</div>
              <div className="text-sm text-gray-300">{isDE ? "User-Tier-Quotas" : "User-tier quotas"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-incident-response`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Incident Response</div>
              <div className="text-sm text-gray-300">{isDE ? "Rate-Limit-Violations" : "Rate limit violations"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
