import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-api-gateway-hardening"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM API Gateway Hardening: Sicherer Zugang zu KI-Modellen | ClawGuru Moltbot", "LLM API Gateway Hardening: Secure Access to AI Models | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-API-Gateway absichern: API-Key-Management, Rate-Limiting-Strategien, Request/Response-Logging, Credential-Rotation und Zero-Trust-Zugang zu OpenAI, Anthropic und Self-Hosted-Modellen.", "Harden your LLM API gateway: API key management, rate limiting strategies, request/response logging, credential rotation and zero-trust access to OpenAI, Anthropic and self-hosted models.")
  return {
    title, description,
    keywords: ["llm api gateway hardening", "ai api gateway security", "openai api security", "llm gateway", "ai api key management", "llm rate limiting gateway"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const HARDENING_CONTROLS = [
  { id: "GW-1", title: "API Key Vault Integration & Rotation", desc: "LLM API keys (OpenAI, Anthropic, etc.) must never be hardcoded or stored in environment variables long-term. Vault integration with automatic rotation eliminates static secrets.", code: `# Moltbot: Vault-backed LLM API key management
llm_providers:
  openai:
    key_source: vault               # Never: env_var or hardcoded
    vault_path: "secret/llm/openai-api-key"
    rotation_interval_days: 30      # Auto-rotate every 30 days
    rotation_overlap_hours: 2       # Old key valid 2h after rotation (no downtime)

  anthropic:
    key_source: vault
    vault_path: "secret/llm/anthropic-api-key"
    rotation_interval_days: 30

# Vault dynamic secrets for LLM API keys (if provider supports it):
# Generate short-lived API keys on-demand — expire after 1h
vault write llm-provider/openai/creds/moltbot-agent \\
  ttl=1h
# Returns: api_key=sk-... (valid for 1h only)

# Emergency key revocation (if compromised):
moltbot secrets revoke --provider openai --reason "key_suspected_compromise"
# Immediately rotates key, logs revocation event, alerts team

# Kubernetes: never use env vars for LLM keys in pod spec
# WRONG:
env:
- name: OPENAI_API_KEY
  value: "sk-..."  # Visible in kubectl describe pod

# CORRECT:
env:
- name: OPENAI_API_KEY
  valueFrom:
    secretKeyRef:
      name: llm-api-keys   # K8s secret (encrypted at rest)
      key: openai-key` },
  { id: "GW-2", title: "Request Authentication & Per-Client Quotas", desc: "Every client calling the LLM gateway must authenticate. Different clients get different rate limits and model access — not a shared API key for all.", code: `# Moltbot gateway: per-client authentication and quota
gateway:
  auth:
    method: jwt                    # JWT tokens, not shared API keys
    jwt_issuer: "https://auth.internal"
    jwt_audience: "moltbot-gateway"
    require_claims:
      - client_id
      - scope                      # Must include "llm:access"

  per_client_limits:
    default:
      requests_per_minute: 60
      tokens_per_hour: 100000
      max_concurrent_requests: 5
      allowed_models: ["gpt-4o-mini"]  # Default: smaller model only

    tier_premium:
      requests_per_minute: 600
      tokens_per_hour: 2000000
      max_concurrent_requests: 50
      allowed_models: ["gpt-4o", "claude-3-5-sonnet", "llama3-70b"]

    service_account_analytics:
      requests_per_minute: 30
      tokens_per_hour: 50000
      max_concurrent_requests: 3
      allowed_models: ["gpt-4o-mini"]
      allowed_operations: ["completion"]  # No: embeddings, fine-tuning

  # Block unauthenticated requests
  on_auth_failure:
    action: reject
    response_code: 401
    log: true` },
  { id: "GW-3", title: "Request & Response Logging (Privacy-Safe)", desc: "Log all gateway traffic for security monitoring and abuse detection — without storing raw prompts that may contain PII.", code: `# Moltbot gateway logging config (privacy-safe):
logging:
  request:
    log_metadata: true          # client_id, timestamp, model, token_count
    log_prompt_hash: true       # SHA-256 of prompt — enables correlation without PII
    log_prompt_raw: false       # NEVER in production — GDPR/HIPAA risk
    log_headers: [              # Log only safe headers
      "x-client-id",
      "x-request-id",
      "content-type"
    ]

  response:
    log_metadata: true          # status_code, latency_ms, output_token_count
    log_response_hash: true
    log_response_raw: false
    log_error_details: true     # Full error for debugging (sanitized)

  # Structured log format (JSON, ships to SIEM):
  format: json
  destination: fluentbit        # → Elasticsearch / Splunk / Datadog

  # Example log entry:
  # {
  #   "timestamp": "2026-04-14T20:00:00Z",
  #   "client_id": "moltbot-agent-07",
  #   "model": "gpt-4o",
  #   "prompt_hash": "sha256:abc...",
  #   "tokens_in": 1247, "tokens_out": 342,
  #   "latency_ms": 1840,
  #   "status": 200,
  #   "flagged": false
  # }

  # Anomaly alerts from log stream:
  anomaly_detection:
    - rule: "token_spike"
      condition: "tokens_per_hour > 5x_baseline"
      action: alert_and_throttle` },
  { id: "GW-4", title: "Upstream Provider Failover & Security", desc: "When using cloud LLM APIs, enforce TLS pinning, implement failover to self-hosted models, and validate provider TLS certificates to prevent MITM attacks on AI traffic.", code: `# Moltbot: secure upstream LLM provider configuration
upstream_providers:
  openai:
    base_url: "https://api.openai.com"
    tls:
      verify: true                 # Always verify TLS
      min_version: "TLS1.3"       # Require TLS 1.3 minimum
      # Certificate pinning (advanced — breaks on provider cert rotation):
      # pin_sha256: "abc123..."
    timeout_seconds: 30
    retry:
      max_attempts: 3
      backoff: exponential
    circuit_breaker:
      failure_threshold: 5        # Open circuit after 5 failures
      reset_timeout_seconds: 60

  # Fallback to self-hosted when cloud provider is unavailable:
  self_hosted_fallback:
    base_url: "http://ollama.moltbot-infra:11434"
    model_map:
      "gpt-4o": "llama3-70b"     # Use local llama3-70b as gpt-4o fallback
      "gpt-4o-mini": "llama3-8b"
    enabled_when: "openai_circuit_open OR openai_error_rate > 0.1"

  # Proxy configuration (for air-gapped environments):
  proxy:
    http_proxy: "http://squid-proxy.internal:3128"
    no_proxy: ["*.internal", "localhost"]
    # Squid proxy: whitelist only LLM provider domains
    # Blocks: arbitrary external API calls from gateway` },
]

const FAQ = [
  { q: "Why use a gateway instead of calling LLM APIs directly from the application?", a: "Direct API calls from applications create multiple security problems that a gateway solves: 1) API key sprawl: every service needs its own API key (or shares one) — gateway centralizes key management. 2) No rate limiting: a buggy application can exhaust your API quota and generate enormous cloud costs. 3) No audit trail: direct calls leave no centralized record of who called what and when. 4) No failover: if the cloud LLM is unavailable, every application fails independently. 5) No input/output filtering: prompt injection and PII exfiltration can't be caught without a central inspection point. 6) Cost attribution: gateway tracks per-client token usage — enables showback/chargeback. The gateway acts as a security perimeter for all AI model access, similar to how an API gateway protects backend services." },
  { q: "How do I prevent API key leakage in the LLM gateway?", a: "API key leakage prevention at the gateway level: 1) Never log API keys: strip Authorization headers from all logs. Gateway rewrites requests — the application's JWT authenticates to the gateway; the gateway uses its own API key for the upstream provider. 2) Key isolation: gateway holds the LLM provider API keys — applications only hold gateway JWTs. If an application is compromised, the attacker gets only a JWT (scoped, expiring) not the actual API key. 3) Vault integration: API keys stored in Vault, not in environment variables or config files. 4) Key usage monitoring: alert on unusual usage patterns (calls from unexpected IPs, unusual times). 5) Immediate rotation on suspicion: single command to rotate the key — gateway handles overlap. 6) Audit all key accesses: every time the gateway fetches a key from Vault, log it." },
  { q: "What is circuit breaking and why is it important for LLM gateways?", a: "Circuit breaking prevents cascading failures when an upstream LLM provider is experiencing issues. Without circuit breaking: a degraded provider causes every request to wait for the full timeout (e.g., 30 seconds) before failing. With 100 concurrent requests, this consumes 3000 request-seconds of capacity. With circuit breaking (from Moltbot's example): after 5 consecutive failures, the circuit 'opens' — subsequent requests immediately fail or route to the fallback model instead of waiting for the timeout. After 60 seconds, the circuit 'half-opens' — one request is allowed through to test if the provider has recovered. If it succeeds, the circuit closes (normal operation resumes). Impact: eliminates timeout-induced resource exhaustion. Paired with a self-hosted fallback model, users see minimal disruption even during cloud LLM provider outages." },
  { q: "How do I handle multi-region LLM API gateway deployment?", a: "Multi-region gateway considerations: 1) API key per region: use separate API keys for each region (easier incident isolation). Store in region-specific Vault instances. 2) Latency routing: route to nearest LLM provider region (US traffic → OpenAI US endpoint, EU traffic → OpenAI EU endpoint). 3) Data residency: if GDPR requires data to stay in EU, ensure gateway routes EU requests exclusively to EU-region LLM providers. Document which providers have EU data residency commitments. 4) Cross-region failover: if EU LLM endpoint fails, failover to self-hosted model in EU (not to US endpoint — may violate data residency). 5) Centralized audit log: all regions ship logs to a centralized SIEM (with data residency compliance — store EU logs in EU SIEM). 6) Rate limit coordination: per-client limits must be enforced globally (not per-region) — use Redis with cross-region replication for rate limit counters." },
]

export default function LlmApiGatewayHardeningPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM API Gateway Hardening", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "API-Gateway-Hardening-Guide für eigene KI-Infrastruktur.", "API gateway hardening guide for your own AI infrastructure.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 11</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "LLM API Gateway Hardening", "LLM API Gateway Hardening")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Direkter Zugriff auf LLM-APIs aus Anwendungen ist unsicher: kein Rate-Limiting, keine Audit-Logs, kein Key-Management. Ein zentrales Gateway löst alle diese Probleme auf einmal.", "Direct LLM API access from applications is insecure: no rate limiting, no audit logs, no key management. A central gateway solves all these problems at once.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Gateway-Hardening-Controls", "4 Gateway Hardening Controls")}</h2>
          <div className="space-y-5">
            {HARDENING_CONTROLS.map((c) => (
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
            <a href={`/${locale}/moltbot/llm-rate-limiting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Rate Limiting</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Token-Budget-Enforcement", "Token budget enforcement")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-gateway-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Gateway Hardening</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Erweiterte Gateway-Config", "Advanced gateway config")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-audit-logging`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Audit Logging</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Gateway-Logs auditieren", "Audit gateway logs")}</div>
            </a>
            <a href={`/${locale}/openclaw/network-segmentation-guide`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Network Segmentation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Gateway-Netzwerk-Isolation", "Gateway network isolation")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
