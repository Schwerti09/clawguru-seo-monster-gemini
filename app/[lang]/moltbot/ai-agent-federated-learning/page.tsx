import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-federated-learning"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Federated Learning: KI-Agenten-Federated-Learning | ClawGuru Moltbot"
    : "AI Agent Federated Learning: AI Agent Federated Learning | ClawGuru Moltbot"
  const description = isDE
    ? "KI-Agenten-Federated-Learning: Federated Training, Client Selection, Aggregation Security und Privacy Budget Management für KI-Agenten-Federated-Learning."
    : "AI agent federated learning: federated training, client selection, aggregation security and privacy budget management for AI agent federated learning."
  return {
    title, description,
    keywords: ["ai agent federated learning", "federated training", "client selection", "aggregation security", "privacy budget", "moltbot federated"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "AFL-1", title: "Federated Training", desc: "Train AI agents on distributed data without centralising data. Agents train locally, only model updates are shared.", code: `# Moltbot federated training:
federated_training:
  enabled: true

  # Federated learning architecture:
  architecture:
    # Central server coordinates training
    # Edge agents train on local data
    # Model updates aggregated centrally
    # Data never leaves local devices

  # Training protocol:
  protocol:
    # Round-based training
    # Each round: select clients, train locally, aggregate
    # Number of rounds: until convergence or max rounds
    # Convergence threshold: model accuracy delta < 0.001

  # Local training:
  local_training:
    # Local epochs: number of epochs per client
    local_epochs: 5
    # Batch size: local batch size
    batch_size: 32
    # Learning rate: local learning rate
    learning_rate: 0.01` },
  { id: "AFL-2", title: "Client Selection", desc: "Select which agents participate in each training round. Use strategies to ensure data diversity and security.", code: `# Moltbot client selection:
client_selection:
  enabled: true

  # Selection strategy:
  strategy:
    # Random selection: randomly select clients
    # Uniform sampling: equal probability for all clients
    # Importance sampling: weight by data quality or quantity
    # Adaptive selection: based on client performance
    method: "importance_sampling"

  # Selection criteria:
  criteria:
    # Minimum data: clients must have minimum data
    min_data_samples: 100
    # Data quality: filter low-quality data
    quality_threshold: 0.7
    # Availability: select only available clients
    availability_check: true

  # Selection size:
  size:
    # Fraction of clients to select per round
    # Trade-off: more clients = better convergence but slower
    fraction: 0.1` },
  { id: "AFL-3", title: "Aggregation Security", desc: "Securely aggregate model updates from agents. Detect and mitigate malicious or poisoned updates.", code: `# Moltbot aggregation security:
aggregation_security:
  enabled: true

  # Aggregation method:
  method:
    # Federated Averaging (FedAvg): weighted average of updates
    # Krum: detect and reject outliers
    # Trimmed Mean: trim extreme values
    # Byzantine-resilient: robust to malicious clients
    algorithm: "byzantine_resilient"

  # Poisoning detection:
  poisoning_detection:
    enabled: true
    # Detect: malicious model updates
    # Methods: statistical analysis, anomaly detection
    # Threshold: reject updates beyond threshold
    # Alert: on suspected poisoning

  # Update verification:
  verification:
    enabled: true
    # Verify: model updates before aggregation
    # Check: update magnitude, gradient direction
    # Reject: suspicious updates
    # Audit: rejected updates for analysis` },
  { id: "AFL-4", title: "Privacy Budget Management", desc: "Manage privacy budget across federated learning rounds. Use differential privacy to protect individual privacy.", code: `# Moltbot privacy budget management:
privacy_budget:
  enabled: true

  # Privacy budget:
  budget:
    # Epsilon: total privacy budget
    # Lower epsilon = stronger privacy
    # Distribute: across training rounds
    total_epsilon: 10.0
    # Per-round epsilon: budget per round
    per_round_epsilon: 0.1

  # Differential privacy:
  differential_privacy:
    enabled: true
    # Add noise to model updates
    # Mechanism: Gaussian or Laplace
    # Calibrate: based on sensitivity
    # Track: privacy budget consumption

  # Budget tracking:
  tracking:
    enabled: true
    # Track: privacy budget per client
    # Alert: when budget exhausted
    # Reset: budget periodically
    # Audit: budget usage history` },
]

const FAQ = [
  { q: "What is the difference between federated training and centralised training?", a: "Federated training trains models on distributed data without centralising data. Data stays on local devices, and only model updates (gradients or weights) are shared with a central server for aggregation. Centralised training requires all data to be centralised in one location. Federated training addresses data privacy, regulatory constraints, and data sovereignty by keeping data local. Centralised training is simpler but requires data centralisation. Federated training is more complex but enables privacy-preserving training on distributed data." },
  { q: "How does client selection affect federated learning?", a: "Client selection determines which agents participate in each training round. Random selection is simple but may not ensure data diversity. Importance sampling weights clients by data quality or quantity, improving convergence but potentially biasing training. Adaptive selection adjusts selection based on client performance, focusing on high-performing clients. The selection strategy affects convergence speed, model quality, and fairness. Too few clients may slow convergence. Too many clients may increase communication overhead. The optimal selection depends on the use case." },
  { q: "How does aggregation security protect against poisoning attacks?", a: "Aggregation security protects against poisoning attacks by detecting and rejecting malicious model updates. Byzantine-resilient aggregation algorithms (e.g., Krum, Trimmed Mean) are robust to a fraction of malicious clients. Poisoning detection uses statistical analysis and anomaly detection to identify suspicious updates. Update verification checks update magnitude and gradient direction before aggregation. These techniques ensure that malicious or poisoned updates do not affect the global model. However, they add computational overhead and may reject legitimate updates from diverse clients." },
  { q: "What is the role of differential privacy in federated learning?", a: "Differential privacy adds calibrated noise to model updates to protect individual privacy. It ensures that the presence or absence of any individual's data does not significantly affect the model output. In federated learning, differential privacy is applied to model updates before aggregation. The privacy budget (epsilon) is tracked across training rounds. When the budget is exhausted, training must stop or the budget must be reset. Differential privacy provides mathematical privacy guarantees but reduces model accuracy due to added noise. The trade-off between privacy and accuracy must be balanced." },
]

export default function AiAgentFederatedLearningPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent Federated Learning", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Federated-Learning-Guide für eigene KI-Systeme." : "Federated learning guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 21</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Federated Learning" : "AI Agent Federated Learning"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "KI-Agenten ohne Federated Learning zentralisieren Daten — ohne Federated-Learning bleibt Daten-Privacy ungeschützt. Vier Kontrollen: Federated Training, Client Selection, Aggregation Security und Privacy Budget Management."
            : "AI agents without federated learning centralise data — without federated learning, data privacy remains unprotected. Four controls: federated training, client selection, aggregation security and privacy budget management."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Agent-Federated-Learning-Kontrollen" : "4 Agent Federated Learning Controls"}</h2>
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
            <a href={`/${locale}/moltbot/llm-privacy-preserving-computation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Privacy-Preserving Computation</div>
              <div className="text-sm text-gray-300">{isDE ? "Privacy-Techniques" : "Privacy techniques"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-audit-logging`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Audit Logging</div>
              <div className="text-sm text-gray-300">{isDE ? "Training-Logging" : "Training logging"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-data-encryption-at-rest`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Data Encryption at Rest</div>
              <div className="text-sm text-gray-300">{isDE ? "Data-Security" : "Data security"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Federated-Overview" : "Federated overview"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
