import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-continual-learning-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Continual Learning Security: LLM-Continual-Learning-Security | ClawGuru Moltbot", "LLM Continual Learning Security: LLM Continual Learning Security | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-Continual-Learning-Security: Data Poisoning Detection, Learning Rate Security, Model Drift Detection und Continual Learning Audit Logging für LLM-Continual-Learning-Security.", "LLM continual learning security: data poisoning detection, learning rate security, model drift detection and continual learning audit logging for LLM continual learning security.")
  return {
    title, description,
    keywords: ["llm continual learning security", "data poisoning detection", "learning rate security", "model drift detection", "continual learning audit", "moltbot continual"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "CLS-1", title: "Data Poisoning Detection", desc: "Detect poisoned data in continual learning. Use statistical analysis and anomaly detection.", code: `# Moltbot data poisoning detection:
data_poisoning_detection:
  enabled: true

  # Statistical analysis:
  statistical_analysis:
    enabled: true
    # Analyze: incoming data distribution
    # Method: statistical tests (KS test, chi-squared)
    # Detect: distribution shifts
    # Alert: on suspicious patterns

  # Anomaly detection:
  anomaly_detection:
    enabled: true
    # Detect: anomalous data points
    # Methods: isolation forest, local outlier factor
    # Threshold: statistical significance
    # Block: anomalous data

  # Label verification:
  label_verification:
    enabled: true
    # Verify: label consistency
    # Method: cross-validation with known labels
    # Detect: label flipping attacks
    # Block: suspicious labels` },
  { id: "CLS-2", title: "Learning Rate Security", desc: "Secure learning rate parameters against manipulation. Use signed parameters and integrity verification.", code: `# Moltbot learning rate security:
learning_rate_security:
  enabled: true

  # Signed learning rates:
  signed_rates:
    enabled: true
    # Sign: learning rate parameters
    # Method: digital signature
    # Verify: signature before use
    # Prevents: learning rate tampering

  # Learning rate integrity verification:
  integrity_verification:
    enabled: true
    # Verify: learning rate integrity
    # Method: hash verification
    # Block: tampered learning rates
    # Prevents: learning rate corruption

  # Learning rate bounds:
  bounds:
    enabled: true
    # Enforce: learning rate bounds
    # Min: minimum learning rate
    # Max: maximum learning rate
    # Prevents: extreme learning rates` },
  { id: "CLS-3", title: "Model Drift Detection", desc: "Detect model drift during continual learning. Monitor performance metrics and data distribution.", code: `# Moltbot model drift detection:
model_drift_detection:
  enabled: true

  # Performance monitoring:
  performance_monitoring:
    enabled: true
    # Monitor: model performance metrics
    # Metrics: accuracy, loss, F1 score
    # Threshold: performance degradation threshold
    # Alert: on performance drift

  # Data distribution monitoring:
  data_distribution:
    enabled: true
    # Monitor: data distribution
    # Method: statistical tests
    # Detect: distribution shift
    # Alert: on data drift

  # Concept drift detection:
  concept_drift:
    enabled: true
    # Detect: concept drift
    # Method: adaptive windowing, DDM
    # Threshold: drift threshold
    # Alert: on concept drift` },
  { id: "CLS-4", title: "Continual Learning Audit Logging", desc: "Log all continual learning events for audit. Track data ingestion, model updates, and performance changes.", code: `# Moltbot continual learning audit logging:
audit_logging:
  enabled: true

  # Data ingestion logging:
  data_logging:
    enabled: true
    # Log: all data ingestion events
    # Include: data source, timestamp, volume
    # Retain: logs for audit (90 days)
    # Protect: log access

  # Model update logging:
  update_logging:
    enabled: true
    # Log: all model update events
    # Include: version, learning rate, performance
    # Retain: logs for audit (90 days)
    # Protect: log access

  # Performance change logging:
  performance_logging:
    enabled: true
    # Log: all performance changes
    # Include: metric, before, after
    # Retain: logs for audit (90 days)
    # Protect: log access` },
]

const FAQ = [
  { q: "What is the difference between data poisoning detection and model drift detection?", a: "Data poisoning detection identifies malicious or anomalous data that could corrupt the model during continual learning. It focuses on the input data itself. Model drift detection detects changes in model performance or data distribution over time. It focuses on the model's behavior and the data distribution. Data poisoning detection prevents bad data from entering the learning process. Model drift detection detects when the model's performance degrades or the data distribution changes. Both are necessary: data poisoning detection prevents corruption, model drift detection detects performance degradation." },
  { q: "How does learning rate security protect against manipulation?", a: "Learning rate security protects against manipulation by: 1) Signing learning rate parameters — digital signatures ensure parameters are authentic. 2) Verifying signatures — verify signatures before using learning rates. 3) Integrity verification — hash verification detects tampering. 4) Enforcing bounds — learning rate bounds prevent extreme values that could cause instability. Each control addresses a different aspect of learning rate security." },
  { q: "How do I detect model drift in continual learning?", a: "Model drift detection monitors: 1) Performance metrics — accuracy, loss, F1 score. Detect performance degradation beyond threshold. 2) Data distribution — statistical tests detect distribution shift. 3) Concept drift — adaptive windowing or DDM detect concept drift. Detection requires baseline measurements of normal performance and data distribution. Set thresholds based on acceptable performance degradation." },
  { q: "What are common continual learning attack vectors?", a: "Common continual learning attack vectors: 1) Data poisoning — inject malicious data to corrupt model. 2) Learning rate tampering — modify learning rate to cause instability. 3) Label flipping — flip labels to corrupt model. 4) Data drift injection — inject data to cause drift. 5) Model drift exploitation — exploit drift to bypass filters. Defense: data poisoning detection, learning rate security, model drift detection, audit logging." },
]

export default function LlmContinualLearningSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Continual Learning Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Continual-Learning-Security-Guide für eigene KI-Systeme.", "Continual learning security guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 25</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "LLM Continual Learning Security", "LLM Continual Learning Security")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "LLM-Modelle ohne Continual-Learning-Security sind anfällig für Continual-Learning-Attacken — ohne Continual-Learning-Security bleibt Continual-Learning ungeschützt. Vier Kontrollen: Data Poisoning Detection, Learning Rate Security, Model Drift Detection und Continual Learning Audit Logging.", "LLM models without continual learning security are vulnerable to continual learning attacks — without continual learning security, continual learning remains unprotected. Four controls: data poisoning detection, learning rate security, model drift detection and continual learning audit logging.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Continual-Learning-Security-Kontrollen", "4 Continual Learning Security Controls")}</h2>
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
            <a href={`/${locale}/moltbot/llm-fine-tuning-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Fine-Tuning Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Fine-Tuning-Security", "Fine-tuning security")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-adversarial-robustness`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Adversarial Robustness</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Adversarial-Defense", "Adversarial defense")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-hallucination-detection`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Hallucination Detection</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Hallucination-Detection", "Hallucination detection")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Continual-Learning-Overview", "Continual learning overview")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
