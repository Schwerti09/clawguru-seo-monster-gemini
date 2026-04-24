import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-observability"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Observability: Monitoring & Tracing für KI-Agenten | ClawGuru Moltbot", "LLM Observability: Monitoring & Tracing for AI Agents | ClawGuru Moltbot")
  const description = pick(isDE, "Vollständige LLM Observability mit Moltbot: Token-Verbrauch, Latenz, Halluzinationsrate, Prompt-Traces, Security-Events und Cost-Tracking — self-hosted ohne SaaS-Abhängigkeit.", "Full LLM observability with Moltbot: token usage, latency, hallucination rate, prompt traces, security events and cost tracking — self-hosted without SaaS dependency.")
  return {
    title, description,
    keywords: ["llm observability", "llm monitoring", "ai agent tracing", "moltbot observability", "llm cost tracking", "prompt tracing self-hosted"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const METRICS = [
  { category: "Performance", items: [
    { name: "Latency P50/P95/P99", desc: "End-to-end response time per model and agent. Alert on regressions.", unit: "ms" },
    { name: "Time to First Token (TTFT)", desc: "Streaming latency — time until first token arrives at client.", unit: "ms" },
    { name: "Tokens per Second", desc: "Model throughput. Critical for capacity planning and SLA.", unit: "tok/s" },
    { name: "Context Window Utilization", desc: "% of context window used per request. Alert at 80%+ — quality degrades.", unit: "%" },
  ]},
  { category: "Cost", items: [
    { name: "Token Usage", desc: "Input + output tokens per request, agent, user, and time period.", unit: "tokens" },
    { name: "Cost per Request", desc: "Calculated cost based on model pricing. Budget alerts per team/project.", unit: "$" },
    { name: "Cost per Outcome", desc: "Business-level metric: cost per successful task completion.", unit: "$" },
    { name: "Cache Hit Rate", desc: "Semantic cache hits. Higher = lower cost. Track per prompt template.", unit: "%" },
  ]},
  { category: "Quality & Security", items: [
    { name: "Hallucination Rate", desc: "% responses flagged by factual consistency checker. Track per model version.", unit: "%" },
    { name: "Refusal Rate", desc: "% requests refused by model. Spike = prompt engineering issue or injection attempt.", unit: "%" },
    { name: "Injection Detection Rate", desc: "% inputs flagged as potential prompt injection. Spike = active attack.", unit: "%" },
    { name: "PII Exposure Rate", desc: "% responses containing PII before redaction. Must be 0% in production.", unit: "%" },
  ]},
]

const FAQ = [
  { q: "Why is LLM observability different from traditional APM?", a: "Traditional APM measures deterministic systems: same input → same output → same latency. LLMs are stochastic: same input can produce different outputs with different quality levels. This requires new metrics: hallucination rate (did the model make up facts?), refusal rate (is the model refusing valid requests?), semantic similarity (is the output meaningfully different from last week?). Traditional APM tools miss all of these. Moltbot's LLM observability layer was built specifically for probabilistic AI systems." },
  { q: "How does prompt tracing work?", a: "Every LLM call is recorded with: input prompt (hashed + optionally stored), system message, model parameters (temperature, top_p, max_tokens), output tokens generated, latency breakdown (time to first token, generation time), tool calls made, security scan results, and a unique trace ID that links parent agent calls to child LLM calls. This creates a complete causal trace from user request → agent decision → LLM call → tool execution → response." },
  { q: "How do I detect LLM quality regressions?", a: "Moltbot supports three quality regression detection methods: 1) Automated evals — run a fixed test set against every model/prompt change, compare output similarity to golden set. 2) Statistical process control — flag when hallucination rate or refusal rate exceeds 2-sigma from baseline. 3) User feedback correlation — link thumbs down / escalations to specific prompt versions and model settings. Any of these triggers a regression alert in your monitoring dashboard." },
  { q: "Can I run LLM observability without sending data to the cloud?", a: "Yes — this is Moltbot's primary value proposition. All traces, metrics and logs are stored locally in your infrastructure (ClickHouse or PostgreSQL). The observability dashboard runs as a self-hosted web app. No data leaves your network. For air-gapped or high-security environments, Moltbot supports offline mode where even model calls go to local Ollama/LocalAI — full observability with zero external dependencies." },
]

export default function LlmObservabilityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Observability", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Observability-Guide für eigene KI-Systeme.", "Observability guide for your own AI systems.")}
        </div>

        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 6</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "LLM Observability: Monitoring & Tracing für KI-Agenten", "LLM Observability: Monitoring & Tracing for AI Agents")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "LLMs sind nicht deterministisch — klassische APM-Tools versagen. Moltbot bringt vollständige Observability: Prompt-Traces, Qualitätsmetriken, Sicherheits-Events und Cost-Tracking — vollständig self-hosted.", "LLMs are non-deterministic — classical APM tools fail. Moltbot delivers complete observability: prompt traces, quality metrics, security events and cost tracking — fully self-hosted.")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "12+", label: pick(isDE, "Metriken überwacht", "Metrics tracked") },
            { value: "100%", label: pick(isDE, "Self-Hosted", "Self-hosted") },
            { value: "P99", label: pick(isDE, "Latenz-Tracking", "Latency tracking") },
            { value: "0", label: pick(isDE, "Cloud-Abhängigkeiten", "Cloud dependencies") },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Schlüsselmetriken", "Key Metrics")}
          </h2>
          <div className="space-y-6">
            {METRICS.map((cat) => (
              <div key={cat.category}>
                <h3 className="font-bold text-cyan-400 mb-3">{cat.category}</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {cat.items.map((m) => (
                    <div key={m.name} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-100 text-sm">{m.name}</span>
                        <span className="font-mono text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{m.unit}</span>
                      </div>
                      <p className="text-xs text-gray-400">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Prometheus-Integration", "Prometheus Integration")}
          </h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`# Moltbot exposes Prometheus metrics at /metrics
# prometheus.yml scrape config:
scrape_configs:
  - job_name: moltbot_llm
    static_configs:
      - targets: ['moltbot:9090']
    metrics_path: /metrics

# Key metrics exposed:
# moltbot_llm_request_duration_seconds{model, agent, status}
# moltbot_llm_tokens_total{model, type}           # type: input|output
# moltbot_llm_cost_usd_total{model, agent}
# moltbot_security_injections_detected_total
# moltbot_security_pii_redactions_total
# moltbot_agent_tool_calls_total{tool, agent, status}
# moltbot_hitl_pending_approvals

# Grafana dashboard import:
# ClawGuru LLM Dashboard ID: 21847 (grafana.com/dashboards)`}</pre>
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
            <a href={`/${locale}/moltbot/ai-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Compliance Automation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Observability-Daten für Audits nutzen", "Use observability data for audits")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-gateway-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Gateway Hardening</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Gateway-Metriken absichern", "Secure gateway metrics")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Hub</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Security-Events in Observability", "Security events in observability")}</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Roast My Moltbot</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Observability-Setup kostenlos prüfen", "Free observability setup review")}</div>
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
