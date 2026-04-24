import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-api-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM API Security: LLM-API-Sicherheit | ClawGuru Moltbot", "LLM API Security: LLM API Security | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-API-Security: API Key Management, Request Authentication, API Gateway Hardening und API Rate Limiting für LLM-API-Endpunkte.", "LLM API security: API key management, request authentication, API gateway hardening and API rate limiting for LLM API endpoints.")
  return {
    title, description,
    keywords: ["llm api security", "api key management", "llm api authentication", "api gateway security", "api rate limiting", "moltbot api security"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "AS-1", title: "API Key Management", desc: "Securely manage API keys for LLM access. Use short-lived tokens, key rotation, and secure storage to prevent unauthorised access.", code: `# Moltbot API key management:
api_key_management:
  enabled: true

  # Key generation:
  key_generation:
    algorithm: "AES-256-GCM"
    key_length: 256
    # Generate cryptographically secure keys

  # Key expiration:
  expiration:
    default_ttl_hours: 24
    max_ttl_hours: 168  # 7 days max
    # Keys must be rotated regularly

  # Key storage:
  storage:
    # Never store keys in plaintext
    # Use: HashiCorp Vault, AWS Secrets Manager, or encrypted database
    encryption: true
    encryption_algorithm: "AES-256-GCM"
    # Hash keys for verification (one-way hash)
    hash_for_verification: true

  # Key rotation:
  rotation:
    enabled: true
    auto_rotate: true
    rotation_interval_days: 30
    # Rotate keys every 30 days
    notify_before_rotation_days: 7

  # Key revocation:
  revocation:
    enabled: true
    # Allow immediate revocation of compromised keys
    revoke_on: security_event, user_request, key_expiry` },
  { id: "AS-2", title: "Request Authentication", desc: "Authenticate all LLM API requests. Use JWT tokens, mTLS, or API keys with proper validation.", code: `# Moltbot request authentication:
authentication:
  enabled: true

  # Authentication methods:
  methods:
    # 1. JWT tokens
    jwt:
      enabled: true
      issuer: "https://clawguru.org"
      audience: "moltbot-api"
      algorithm: "RS256"
      # Validate JWT signature, issuer, audience, expiration

    # 2. API keys
    api_key:
      enabled: true
      header_name: "X-API-Key"
      # Validate against hashed keys in database

    # 3. mTLS
    mtls:
      enabled: true
      # Require valid client certificate
      validate_cert_chain: true
      validate_cert_expiry: true

  # Multi-factor authentication:
  mfa:
    enabled: false
    # For high-security use cases, require MFA
    # Example: JWT + API key required together

  # Authentication middleware:
  middleware:
    # Apply authentication to all API endpoints
    except_health_check: true
    # Health check endpoint may be exempted` },
  { id: "AS-3", title: "API Gateway Hardening", desc: "Harden your API gateway to protect LLM endpoints. Enable WAF, input validation, and request/response filtering.", code: `# Moltbot API gateway hardening:
gateway_hardening:
  enabled: true

  # Web Application Firewall (WAF):
  waf:
    enabled: true
    # Block common attack patterns:
    # - SQL injection
    # - XSS
    # - Command injection
    # - Path traversal
    rules: "OWASP ModSecurity Core Rule Set"

  # Input validation:
  input_validation:
    enabled: true
    # Validate all request parameters:
    # - Type checking (string, integer, boolean)
    # - Length limits
    # - Format validation (email, URL, UUID)
    # - Allowlist for enum values

  # Request size limits:
  request_limits:
    max_request_size_bytes: 1048576  # 1MB
    max_header_size_bytes: 8192  # 8KB
    # Reject oversized requests

  # Response filtering:
  response_filtering:
    enabled: true
    # Remove sensitive data from responses:
    # - Internal error messages
    # - Stack traces
    # - System information
    # - Debug data` },
  { id: "AS-4", title: "API Rate Limiting", desc: "Rate limit API requests to prevent abuse and control costs. Use token-based or request-based rate limiting.", code: `# Moltbot API rate limiting:
api_rate_limiting:
  enabled: true

  # Rate limiting strategies:
  strategies:
    # 1. Token-based rate limiting
    token_based:
      enabled: true
      # Rate limit based on API key
      per_key_per_minute: 100
      per_key_per_hour: 1000

    # 2. IP-based rate limiting
    ip_based:
      enabled: true
      # Rate limit per IP address
      per_ip_per_minute: 50
      per_ip_per_hour: 500

    # 3. User-based rate limiting
    user_based:
      enabled: true
      # Rate limit per user ID
      per_user_per_minute: 100
      per_user_per_hour: 1000

  # Enforcement:
  enforcement:
    action: throttle  # Options: block, throttle, queue
    throttle_factor: 0.5  # Reduce speed to 50% when over quota
    block_message: "Rate limit exceeded. Please wait."

  # Burst allowance:
  burst:
    enabled: true
    burst_multiplier: 2  # Allow 2x quota for short bursts
    burst_duration_seconds: 30` },
]

const FAQ = [
  { q: "What is the difference between API key management and request authentication?", a: "API key management is about securely generating, storing, rotating, and revoking the keys themselves. It includes: key generation with cryptographic algorithms, secure storage (encrypted at rest), key rotation policies, and key revocation procedures. Request authentication is about validating that an incoming request is authorised using the credentials presented. It includes: validating JWT tokens, checking API keys against a database, verifying mTLS certificates, and enforcing authentication middleware. Both are necessary: secure key management ensures keys cannot be stolen, while request authentication ensures only valid requests are processed." },
  { q: "How do I implement secure API key storage?", a: "Secure API key storage requires: 1) Never store keys in plaintext in code, config files, or environment variables. 2) Use a secrets manager: HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, or Google Secret Manager. 3) Encrypt keys at rest using AES-256-GCM or similar. 4) Hash keys for verification — store a one-way hash of the key, compare hashes during authentication. 5) Use short-lived tokens — keys expire after a set time (24 hours recommended). 6) Implement key rotation — automatically rotate keys every 30 days. 7) Log all key access for audit trails." },
  { q: "What are the best practices for API gateway hardening?", a: "API gateway hardening best practices: 1) Enable WAF — use OWASP ModSecurity Core Rule Set to block common attack patterns. 2) Input validation — validate all request parameters for type, length, format, and allowlist. 3) Request size limits — reject oversized requests to prevent DoS. 4) Response filtering — remove sensitive data (stack traces, debug info) from responses. 5) Enable TLS 1.3 — encrypt all traffic in transit. 6) Enable CORS with strict origin validation. 7) Enable security headers: HSTS, X-Frame-Options, X-Content-Type-Options. 8) Monitor gateway logs for suspicious activity." },
  { q: "How do I choose between token-based and request-based rate limiting?", a: "Token-based rate limiting limits based on the API key or JWT token. It is user-specific and fair — each user gets their own quota. It prevents token sharing by limiting per-key usage. Request-based rate limiting limits based on the number of HTTP requests. It is simpler but less fair — a single user with many requests can exhaust the quota. Recommendation: use token-based rate limiting for authenticated APIs (LLM APIs are typically authenticated). Use request-based rate limiting only for public endpoints or as a secondary layer of defense. Token-based rate limiting is more accurate for controlling costs and preventing abuse." },
]

export default function LlmApiSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM API Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "API-Security-Guide für eigene KI-Systeme.", "API security guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 16</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "LLM API Security", "LLM API Security")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "LLM-APIs sind Einfallstore für Angriffe — ohne Security können API-Keys gestohlen werden und Requests manipuliert werden. Vier Kontrollen: Key Management, Request Authentication, Gateway Hardening und Rate Limiting.", "LLM APIs are entry points for attacks — without security, API keys can be stolen and requests manipulated. Four controls: key management, request authentication, gateway hardening and rate limiting.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 API-Security-Kontrollen", "4 API Security Controls")}</h2>
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
            <a href={`/${locale}/moltbot/llm-api-gateway-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM API Gateway Hardening</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Gateway-Security", "Gateway security")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-rate-limiting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Rate Limiting</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Token-Based-Limits", "Token-based limits")}</div>
            </a>
            <a href={`/${locale}/moltbot/api-key-leak-response-playbook`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">API Key Leak Response Playbook</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Key-Rotation", "Key rotation")}</div>
            </a>
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{pick(isDE, "API-Security-Check", "API security check")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
