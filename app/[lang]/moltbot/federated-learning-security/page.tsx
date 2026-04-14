import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/federated-learning-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "Federated Learning Security: Protecting Distributed AI Training | ClawGuru"
  const description = "Secure federated learning pipelines: Byzantine-robust aggregation, differential privacy, gradient poisoning defense, client authentication and model update validation for self-hosted FL systems."
  return {
    title, description,
    keywords: ["federated learning security", "fl security", "gradient poisoning", "byzantine robust aggregation", "differential privacy ai", "federated learning self hosted", "moltbot fl"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const FL_ATTACKS = [
  { id: "FL01", name: "Gradient Poisoning", severity: "CRITICAL", desc: "Malicious FL client submits manipulated gradient updates that embed backdoors or degrade global model performance.", defense: "Byzantine-robust aggregation (Krum, FedMedian, Trimmed Mean). Clip gradient norms. Validate updates statistically before aggregation." },
  { id: "FL02", name: "Model Inversion Attack", severity: "HIGH", desc: "Attacker reconstructs training data from shared gradient updates, violating data privacy of other FL participants.", defense: "Differential privacy (DP-SGD): add calibrated Gaussian noise to gradients before sharing. Set privacy budget (ε ≤ 1.0 for strong privacy)." },
  { id: "FL03", name: "Free-Rider Attack", severity: "MEDIUM", desc: "Client participates in FL without contributing genuine updates — downloads global model without sharing useful gradients.", defense: "Contribution verification: measure cosine similarity of submitted updates vs expected gradient direction. Ban clients below threshold." },
  { id: "FL04", name: "Inference Attack", severity: "HIGH", desc: "Attacker infers membership of specific data points in training set from the global model's behavior.", defense: "Differential privacy provides mathematical membership inference resistance. Limit model query API access. Monitor for systematic probing." },
  { id: "FL05", name: "Communication Channel Attack", severity: "HIGH", desc: "Man-in-the-middle intercepts gradient updates in transit, modifies them, or injects malicious updates.", defense: "mTLS for all FL client-server communication. Authenticate clients with certificates. Sign all gradient updates. Verify signatures before aggregation." },
]

const FAQ = [
  { q: "What is federated learning and why is it relevant for GDPR?", a: "Federated learning trains AI models across multiple data sources without centralizing the raw data. Each participant trains locally and shares only model updates (gradients) — not the underlying data. This makes FL inherently privacy-preserving and GDPR-friendly: personal data never leaves the data controller's systems." },
  { q: "What is differential privacy in federated learning?", a: "Differential privacy (DP) adds mathematically calibrated noise to gradient updates before they are shared, making it computationally infeasible to reconstruct individual training samples. The privacy budget (ε) controls the privacy-utility tradeoff: ε < 1.0 provides strong privacy, ε > 10.0 provides weak privacy. DP-SGD is the standard implementation." },
  { q: "How do I defend against gradient poisoning in federated learning?", a: "Use Byzantine-robust aggregation algorithms instead of simple FedAvg: 1) Krum: selects the update most similar to its k neighbors. 2) Trimmed Mean: removes top/bottom x% of updates before averaging. 3) Median: takes the coordinate-wise median. Also: clip gradient norms before aggregation, monitor per-client update statistics over time." },
  { q: "Can I run federated learning on self-hosted infrastructure?", a: "Yes. Frameworks like Flower (flwr), PySyft and TensorFlow Federated support fully self-hosted deployments. The FL server and all clients run on your infrastructure. No data ever leaves your network. Combine with mTLS client authentication and Moltbot monitoring for a production-grade, GDPR-compliant federated learning setup." },
]

export default function FederatedLearningSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "Federated Learning Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "HowTo", name: "Secure a Federated Learning Pipeline", totalTime: "PT4H", step: [
      { "@type": "HowToStep", name: "Authenticate all FL clients", text: "Issue per-client X.509 certificates. Enforce mTLS for all server connections. Revoke on compromise." },
      { "@type": "HowToStep", name: "Implement DP-SGD", text: "Add differential privacy to gradient sharing. Set ε ≤ 1.0. Calibrate noise to sensitivity and privacy budget." },
      { "@type": "HowToStep", name: "Enable robust aggregation", text: "Replace FedAvg with Trimmed Mean or Krum. Clip gradient norms before aggregation." },
      { "@type": "HowToStep", name: "Monitor client contributions", text: "Track per-client update statistics. Alert on statistical outliers. Auto-ban Byzantine clients." },
      { "@type": "HowToStep", name: "Audit model versions", text: "SHA-256 checksum on every global model version. Behavioral test suite before distribution." },
    ]},
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for securing your own federated learning infrastructure. No attack tools.
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot AI Security · Batch 5</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Federated Learning Security: Protecting Distributed AI Training</h1>
        <p className="text-lg text-gray-300 mb-6">Federated learning distributes AI training across multiple clients — but each junction is a new attack surface. Gradient poisoning, model inversion and free-rider attacks can corrupt your global model while the training data stays "private". This guide covers all 5 FL-specific attack vectors with concrete, implementable defenses.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[{ value: "5", label: "FL attack vectors" }, { value: "ε≤1.0", label: "Strong DP privacy budget" }, { value: "mTLS", label: "Required client auth" }, { value: "GDPR", label: "FL-native compliance" }].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">FL Attack Vectors & Defenses</h2>
          <div className="space-y-4">
            {FL_ATTACKS.map((a) => (
              <div key={a.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-1 rounded">{a.id}</span>
                  <span className="font-semibold text-gray-100">{a.name}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${a.severity === "CRITICAL" ? "bg-red-900 text-red-300" : a.severity === "HIGH" ? "bg-orange-900 text-orange-300" : "bg-yellow-900 text-yellow-300"}`}>{a.severity}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{a.desc}</p>
                <p className="text-sm text-green-300"><strong>Defense:</strong> {a.defense}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Self-Hosted FL Setup (Flower Framework)</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`# Flower (flwr) — production-secure FL server config
import flwr as fl
from flwr.server.strategy import FedTrimmedAvg  # Byzantine-robust

strategy = FedTrimmedAvg(
    fraction_fit=0.3,           # 30% clients per round
    min_fit_clients=5,          # Minimum 5 clients
    min_available_clients=10,
    beta=0.1,                   # Trim top/bottom 10% of updates
    # Add differential privacy wrapper:
    # strategy = DifferentialPrivacyServerSideAdaptiveClipping(
    #   strategy, noise_multiplier=1.1, num_sampled_clients=10
    # )
)

fl.server.start_server(
    server_address="127.0.0.1:8080",  # localhost only
    config=fl.server.ServerConfig(num_rounds=100),
    strategy=strategy,
    # mTLS via nginx reverse proxy in front
)

# Client authentication: verify X.509 cert before accepting updates
# Gradient norm clipping: max_norm=1.0 on all client updates`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">GDPR Compliance Advantages of FL</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">Data Minimisation (Art. 5)</h3>
              <p className="text-sm text-green-200">Only gradient updates leave client systems — never raw personal data. Mathematical proof that reconstruction is computationally infeasible with DP.</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">Purpose Limitation (Art. 5)</h3>
              <p className="text-sm text-blue-200">Data stays in client systems under original purpose. Central server never processes personal data — only model updates.</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">No Third-Country Transfer</h3>
              <p className="text-sm text-yellow-200">Self-hosted FL server in EU. No personal data leaves EU jurisdiction. No Schrems-II concerns, no SCCs required.</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">Residual Risk: Gradient Attacks</h3>
              <p className="text-sm text-red-200">Without DP, gradient updates can still leak training data via model inversion. DP is mandatory for genuine GDPR compliance in FL.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Frequently Asked Questions</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Hub</div>
              <div className="text-sm text-gray-300">OWASP LLM Top 10 — full defense map</div>
            </a>
            <a href={`/${locale}/moltbot/model-poisoning-protection`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Model Poisoning Protection</div>
              <div className="text-sm text-gray-300">Overlapping supply chain threats</div>
            </a>
            <a href={`/${locale}/solutions/dsgvo-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">DSGVO / GDPR Compliance</div>
              <div className="text-sm text-gray-300">FL + GDPR compliance strategy</div>
            </a>
            <a href={`/${locale}/moltbot/secure-agent-communication`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Secure Agent Communication</div>
              <div className="text-sm text-gray-300">mTLS for FL client-server</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
