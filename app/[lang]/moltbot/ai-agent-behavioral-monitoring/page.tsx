import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-behavioral-monitoring"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Behavioral Monitoring: KI-Agenten-Verhaltensmonitoring | ClawGuru Moltbot"
    : "AI Agent Behavioral Monitoring: AI Agent Behavioral Monitoring | ClawGuru Moltbot"
  const description = isDE
    ? "KI-Agenten-Verhaltensmonitoring: Behavior Baseline, Anomaly Detection, Behavior Profiling und Behavior Enforcement für KI-Agenten-Verhaltensüberwachung."
    : "AI agent behavioral monitoring: behavior baseline, anomaly detection, behavior profiling and behavior enforcement for AI agent behavior monitoring."
  return {
    title, description,
    keywords: ["ai agent behavioral monitoring", "agent behavior baseline", "agent anomaly detection", "behavior profiling", "behavior enforcement", "moltbot monitoring"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "ABM-1", title: "Behavior Baseline", desc: "Establish a baseline of normal agent behavior. Track typical tool calls, API usage, response patterns, and resource consumption for each agent.", code: `# Moltbot agent behavior baseline:
behavior_baseline:
  enabled: true

  # Baseline collection:
  collection:
    enabled: true
    # Collect baseline data over:
    baseline_period_days: 7
    # Collect: tool calls, API calls, response patterns, resource usage

  # Baseline metrics:
  metrics:
    # Tool call frequency:
    tool_call_frequency:
      # Track: calls per minute, per hour, per day
      # Per tool type
      enabled: true

    # API usage patterns:
    api_usage:
      # Track: API calls per endpoint, response times, error rates
      enabled: true

    # Response patterns:
    response_patterns:
      # Track: response length, response time, output format
      enabled: true

    # Resource consumption:
    resource_usage:
      # Track: CPU, memory, network I/O
      enabled: true

  # Baseline update:
  update:
    # Update baseline periodically
    interval_days: 30
    # Use rolling window of recent data` },
  { id: "ABM-2", title: "Anomaly Detection", desc: "Detect anomalous agent behavior using statistical analysis and machine learning. Flag deviations from baseline for investigation.", code: `# Moltbot agent anomaly detection:
anomaly_detection:
  enabled: true

  # Statistical analysis:
  statistical:
    enabled: true
    # Detect anomalies using:
    # - Z-score: values > 3 standard deviations
    # - IQR: values outside Q1-1.5*IQR or Q3+1.5*IQR
    # - Percentile: values outside 1st-99th percentile
    methods:
      - z_score
      - iqr
      - percentile

  # Machine learning detection:
  ml_detection:
    enabled: true
    # Use ML model to detect anomalous behavior
    # Model trained on normal behavior patterns
    model: "agent_anomaly_detector_v1"
    threshold: 0.85  # Alert if anomaly score > 85%

  # Alerting:
  alerting:
    enabled: true
    # Alert on:
    # - High anomaly score
    # - Repeated anomalies from same agent
    # - Anomalies in high-risk agents
    alert_on:
      - high_score
      - repeated_anomaly
      - high_risk_agent` },
  { id: "ABM-3", title: "Behavior Profiling", desc: "Profile agent behavior over time to identify patterns and trends. Track behavior changes and correlate with events.", code: `# Moltbot agent behavior profiling:
behavior_profiling:
  enabled: true

  # Profile collection:
  collection:
    enabled: true
    # Collect profile data:
    # - Behavior patterns over time
    # - Seasonal patterns (time of day, day of week)
    # - Correlations with events (user actions, system changes)
    retention_days: 90

  # Profile analysis:
  analysis:
    enabled: true
    # Analyze:
    # - Behavior trends (increasing/decreasing)
    # - Behavior clusters (similar behavior patterns)
    # - Behavior correlations (correlated metrics)
    # - Behavior seasonality (periodic patterns)

  # Profile comparison:
  comparison:
    enabled: true
    # Compare:
    # - Agent vs baseline
    # - Agent vs other agents
    # - Agent vs previous time periods
    # - Alert on significant deviations` },
  { id: "ABM-4", title: "Behavior Enforcement", desc: "Enforce acceptable behavior limits. Block or throttle agents that exceed thresholds for tool calls, API usage, or resource consumption.", code: `# Moltbot agent behavior enforcement:
behavior_enforcement:
  enabled: true

  # Enforcement limits:
  limits:
    # Tool call limits:
    tool_call_limits:
      # Max tool calls per minute
      per_minute: 100
      # Max tool calls per hour
      per_hour: 1000
      # Action: block, throttle, warn
      action: throttle

    # API usage limits:
    api_limits:
      # Max API calls per minute
      per_minute: 50
      # Max API calls per hour
      per_hour: 500
      action: block

    # Resource limits:
    resource_limits:
      # Max CPU usage (%)
      cpu_percent: 80
      # Max memory usage (MB)
      memory_mb: 512
      action: throttle

  # Enforcement actions:
  actions:
    # Block: deny request
    block:
      message: "Behavior limit exceeded. Request blocked."

    # Throttle: rate limit requests
    throttle:
      # Reduce request rate to 10% of normal
      rate_percent: 10

    # Warn: allow request with warning
    warn:
      message: "Behavior limit approaching. Please reduce usage."` },
]

const FAQ = [
  { q: "What is the difference between behavior baseline and behavior profiling?", a: "Behavior baseline is a snapshot of normal agent behavior collected over a fixed period (e.g., 7 days). It establishes what is \"normal\" for an agent in terms of tool calls, API usage, response patterns, and resource consumption. Behavior profiling is the ongoing analysis of agent behavior over time to identify patterns, trends, and correlations. Profiling looks at how behavior changes over time, seasonal patterns, and correlations with events. Baseline is a static reference point; profiling is a dynamic analysis. Both are necessary: baseline provides a reference for anomaly detection, profiling provides insight into behavior evolution." },
  { q: "How do I set appropriate enforcement limits?", a: "Enforcement limits should be based on: 1) Baseline data — use baseline metrics to set realistic limits (e.g., 95th percentile of normal usage). 2) User tier — enterprise users may have higher limits than free users. 3) Business requirements — limits should align with business constraints (cost, capacity). 4) Risk tolerance — stricter limits for high-risk agents or sensitive use cases. 5) Gradual rollout — start with lenient limits, tighten based on monitoring. Start with limits at the 95th percentile of baseline, monitor false positives, and adjust based on metrics and user feedback." },
  { q: "How does ML-based anomaly detection work?", a: "ML-based anomaly detection uses a model trained on normal behavior patterns to detect deviations. The model learns the distribution of normal behavior (tool calls, API usage, response patterns, resource consumption). When new behavior is observed, the model calculates an anomaly score based on how far it deviates from the learned distribution. If the anomaly score exceeds a threshold, an alert is raised. ML models can detect complex, multi-dimensional anomalies that statistical methods (z-score, IQR) may miss. However, ML models require training data, regular retraining to adapt to concept drift, and careful threshold tuning to balance false positives and false negatives." },
  { q: "What are common agent behavior anomalies?", a: "Common agent behavior anomalies: 1) Excessive tool calls — unusually high frequency of tool calls may indicate a compromised agent or abuse. 2) Unusual API usage — calls to unexpected endpoints or unusual call patterns may indicate malicious activity. 3) Resource spikes — sudden increases in CPU, memory, or network usage may indicate compromise or abuse. 4) Response pattern changes — changes in response length, format, or time may indicate tampering. 5) Temporal anomalies — activity at unusual times (e.g., middle of night for a business agent). 6) Cross-agent anomalies — similar anomalous behavior across multiple agents may indicate a coordinated attack." },
]

export default function AiAgentBehavioralMonitoringPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent Behavioral Monitoring", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Agent-Behavioral-Monitoring-Guide für eigene KI-Systeme." : "Agent behavioral monitoring guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 19</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Behavioral Monitoring" : "AI Agent Behavioral Monitoring"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "KI-Agenten ohne Behavioral Monitoring können kompromittiert werden und missbräuchliche Aktivitäten ausführen — ohne Überwachung bleibt dies unbemerkt. Vier Kontrollen: Behavior Baseline, Anomaly Detection, Behavior Profiling und Behavior Enforcement."
            : "AI agents without behavioral monitoring can be compromised and perform malicious activities — without monitoring, this goes unnoticed. Four controls: behavior baseline, anomaly detection, behavior profiling and behavior enforcement."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Agent-Behavioral-Monitoring-Kontrollen" : "4 Agent Behavioral Monitoring Controls"}</h2>
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
            <a href={`/${locale}/moltbot/ai-agent-audit-logging`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Audit Logging</div>
              <div className="text-sm text-gray-300">{isDE ? "Behavior-Logging" : "Behavior logging"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-testing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Testing</div>
              <div className="text-sm text-gray-300">{isDE ? "Behavior-Testing" : "Behavior testing"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-observability`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Observability</div>
              <div className="text-sm text-gray-300">{isDE ? "Behavior-Tracking" : "Behavior tracking"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Monitoring-Overview" : "Monitoring overview"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
