import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-model-extraction-defense"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Model Extraction Defense: LLM-Modell-Extraction-Defense | ClawGuru Moltbot", "LLM Model Extraction Defense: LLM Model Extraction Defense | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-Modell-Extraction-Defense: Query Rate Limiting, Output Truncation, Watermark Detection und Model Access Control für LLM-Modell-Extraction-Defense.", "LLM model extraction defense: query rate limiting, output truncation, watermark detection and model access control for LLM model extraction defense.")
  return {
    title, description,
    keywords: ["llm model extraction defense", "query rate limiting", "output truncation", "watermark detection", "model access control", "moltbot extraction"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "MED-1", title: "Query Rate Limiting", desc: "Limit the number of queries per user to prevent model extraction. Use token-based and IP-based rate limiting.", code: `# Moltbot query rate limiting:
query_rate_limiting:
  enabled: true

  # Token-based rate limiting:
  token_based:
    enabled: true
    # Limit: queries per API token
    # Window: 1 minute
    # Limit: 100 queries per minute
    # Burst: 10 queries per second

  # IP-based rate limiting:
  ip_based:
    enabled: true
    # Limit: queries per IP address
    # Window: 1 minute
    # Limit: 50 queries per minute
    # Burst: 5 queries per second

  # Rate limiting enforcement:
  enforcement:
    # Action: block, throttle, or warn
    # Block: reject exceeding queries
    # Throttle: delay exceeding queries
    # Warn: alert on exceeding queries
    action: "block"` },
  { id: "MED-2", title: "Output Truncation", desc: "Truncate outputs to prevent model parameter extraction. Limit output length and diversity.", code: `# Moltbot output truncation:
output_truncation:
  enabled: true

  # Output length limit:
  length_limit:
    enabled: true
    # Limit: maximum output tokens
    # Value: 512 tokens
    # Rationale: insufficient for full model extraction
    # Apply: to all outputs

  # Output diversity limit:
  diversity_limit:
    enabled: true
    # Limit: output diversity per session
    # Method: track output entropy
    # Threshold: block low-entropy queries
    # Rationale: prevent systematic probing

  # Output filtering:
  filtering:
    enabled: true
    # Filter: sensitive model information
    # Examples: layer weights, activation patterns
    # Block: queries requesting internal model info` },
  { id: "MED-3", title: "Watermark Detection", desc: "Detect watermark patterns in queries to identify model extraction attempts. Use statistical analysis.", code: `# Moltbot watermark detection:
watermark_detection:
  enabled: true

  # Statistical detection:
  statistical_detection:
    enabled: true
    # Analyze: query patterns for extraction signatures
    # Method: statistical analysis of query distribution
    # Threshold: p-value < 0.01 indicates extraction
    # Alert: on suspected extraction

  # Pattern detection:
  pattern_detection:
    enabled: true
    # Detect: systematic query patterns
    # Examples: grid search, gradient estimation
    # Method: sequence analysis, clustering
    # Block: extraction attempts

  # Detection logging:
  logging:
    enabled: true
    # Log: all detection events
    # Track: detection success/failure
    # Audit: detection history` },
  { id: "MED-4", title: "Model Access Control", desc: "Control access to the model to prevent unauthorised extraction. Use authentication, authorisation, and monitoring.", code: `# Moltbot model access control:
model_access_control:
  enabled: true

  # Authentication:
  authentication:
    enabled: true
    # Require: API key or token
    # Validate: credentials on every request
    # Rotate: credentials periodically
    # Revoke: compromised credentials

  # Authorisation:
  authorisation:
    enabled: true
    # Check: user permissions
    # Roles: admin, user, guest
    # Permissions: read, write, execute
    # Enforce: least privilege

  # Access monitoring:
  monitoring:
    enabled: true
    # Monitor: all model access attempts
    # Log: user, timestamp, query, result
    # Alert: on suspicious access patterns
    # Audit: access history` },
]

const FAQ = [
  { q: "What is the difference between query rate limiting and output truncation?", a: "Query rate limiting limits the number of queries a user can make, preventing attackers from making the large number of queries needed for model extraction. Output truncation limits the amount of information returned per query, making it harder to extract model parameters. Query rate limiting is a quantitative limit on queries. Output truncation is a qualitative limit on outputs. Both are necessary: rate limiting prevents brute-force extraction, truncation limits the information gained per query." },
  { q: "How does watermark detection identify model extraction?", a: "Watermark detection identifies model extraction by analysing query patterns. Model extraction typically involves systematic query patterns (e.g., grid search, gradient estimation) that differ from normal usage. Statistical analysis detects these patterns by comparing the query distribution to expected patterns. Pattern detection uses sequence analysis and clustering to identify systematic probing. When extraction is detected, the system can block the user or alert administrators. Watermark detection is most effective when combined with other defenses." },
  { q: "How do I set effective rate limits for model access?", a: "Effective rate limits balance security with usability: 1) Start with conservative limits (e.g., 100 queries/minute per token, 50 queries/minute per IP). 2) Monitor legitimate usage patterns. 3) Adjust limits based on operational data. 4) Implement burst allowances for legitimate spikes. 5) Use tiered limits for different user roles (higher limits for trusted users). 6) Alert on rate limit violations to detect extraction attempts. 7) Regularly review and update limits as usage patterns evolve." },
  { q: "What are common model extraction attacks?", a: "Common model extraction attacks: 1) Membership inference — determine if data was used in training. 2) Model inversion — reconstruct training data from model outputs. 3) Model extraction — extract model parameters through queries. 4) Gradient estimation — estimate model gradients through queries. 5) Watermark removal — remove embedded watermarks. Defense: query rate limiting, output truncation, watermark detection, model access control, secure inference environments." },
]

export default function LlmModelExtractionDefensePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Model Extraction Defense", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Model-Extraction-Defense-Guide für eigene KI-Systeme.", "Model extraction defense guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 22</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "LLM Model Extraction Defense", "LLM Model Extraction Defense")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "LLM-Modelle ohne Extraction-Defense können extrahiert werden — ohne Extraction-Defense bleiben Modellparameter ungeschützt. Vier Kontrollen: Query Rate Limiting, Output Truncation, Watermark Detection und Model Access Control.", "LLM models without extraction defense can be extracted — without extraction defense, model parameters remain unprotected. Four controls: query rate limiting, output truncation, watermark detection and model access control.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Model-Extraction-Defense-Kontrollen", "4 Model Extraction Defense Controls")}</h2>
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
            <a href={`/${locale}/moltbot/llm-model-watermarking`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Model Watermarking</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Watermarking", "Watermarking")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-api-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM API Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "API-Security", "API security")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-secure-inference`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Secure Inference</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Confidential-Computing", "Confidential computing")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Extraction-Overview", "Extraction overview")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
