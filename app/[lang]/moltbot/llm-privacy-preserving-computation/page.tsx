import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-privacy-preserving-computation"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Privacy-Preserving Computation: LLM-Privacy-Preserving-Computation | ClawGuru Moltbot", "LLM Privacy-Preserving Computation: LLM Privacy-Preserving Computation | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-Privacy-Preserving-Computation: Federated Learning, Differential Privacy, Secure Multi-Party Computation und Homomorphic Encryption für LLM-Datenschutz.", "LLM privacy-preserving computation: federated learning, differential privacy, secure multi-party computation and homomorphic encryption for LLM privacy.")
  return {
    title, description,
    keywords: ["llm privacy preserving computation", "federated learning", "differential privacy", "smpc", "homomorphic encryption", "moltbot privacy"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "PPC-1", title: "Federated Learning", desc: "Train LLMs on distributed data without centralising data. Data stays on local devices, only model updates are shared.", code: `# Moltbot federated learning:
federated_learning:
  enabled: true

  # Federated learning architecture:
  architecture:
    # Central server coordinates training
    # Edge devices train on local data
    # Model updates aggregated centrally
    # Data never leaves local devices

  # Aggregation method:
  aggregation:
    # Use: Federated Averaging (FedAvg)
    # Aggregates: model weights from edge devices
    # Weighted: by number of samples per device
    # Secure: encrypted communication for updates

  # Privacy guarantees:
  privacy:
    # Data: remains on local devices
    # Updates: only model gradients shared
    # Differential privacy: add noise to gradients
    # Minimum clients: required for aggregation` },
  { id: "PPC-2", title: "Differential Privacy", desc: "Add calibrated noise to LLM outputs to protect individual privacy. Use differential privacy to prevent re-identification.", code: `# Moltbot differential privacy:
differential_privacy:
  enabled: true

  # Privacy budget:
  privacy_budget:
    # Epsilon: privacy parameter
    # Lower epsilon = stronger privacy
    # Typical: epsilon = 1.0 to 10.0
    epsilon: 1.0

  # Noise mechanism:
  noise:
    # Use: Gaussian mechanism for continuous data
    # Or: Laplace mechanism for discrete data
    # Add: noise to model outputs or gradients
    # Calibrate: based on sensitivity

  # Privacy tracking:
  tracking:
    # Track: privacy budget consumption
    # Alert: when budget exhausted
    # Reset: budget periodically
    # Audit: privacy budget usage` },
  { id: "PPC-3", title: "Secure Multi-Party Computation (SMPC)", desc: "Compute on encrypted data across multiple parties without revealing individual inputs. Use SMPC for collaborative LLM training.", code: `# Moltbot secure multi-party computation:
smpc:
  enabled: true

  # SMPC protocol:
  protocol:
    # Use: Yao's garbled circuits or secret sharing
    # Parties: 2 or more parties
    # Compute: on encrypted inputs
    # Reveal: only final result

  # Secret sharing:
  secret_sharing:
    # Split: input into shares
    # Distribute: shares to parties
    # Compute: on shares without revealing input
    # Reconstruct: result from shares

  # Security guarantees:
  security:
    # Privacy: inputs remain private
    # Correctness: result is correct
    # Fairness: all parties receive result
    # Verifiability: result can be verified` },
  { id: "PPC-4", title: "Homomorphic Encryption", desc: "Compute on encrypted data without decryption. Use homomorphic encryption for privacy-preserving LLM inference.", code: `# Moltbot homomorphic encryption:
homomorphic_encryption:
  enabled: true

  # Encryption scheme:
  scheme:
    # Use: Fully Homomorphic Encryption (FHE)
    # Or: Partially Homomorphic Encryption (PHE)
    # FHE: supports arbitrary computations
    # PHE: supports limited operations (addition or multiplication)

  # Inference on encrypted data:
  inference:
    # Encrypt: input data
    # Compute: on encrypted data
    # Decrypt: only output
    # Privacy: input data never revealed

  # Performance considerations:
  performance:
    # FHE: computationally expensive
    # PHE: faster but limited operations
    # Hardware: use FHE-accelerated hardware
    # Optimisation: batch processing` },
]

const FAQ = [
  { q: "What is the difference between federated learning and differential privacy?", a: "Federated learning is a training paradigm where data stays on local devices and only model updates are shared. It addresses data centralisation by training on distributed data. Differential privacy is a technique that adds calibrated noise to data or model outputs to protect individual privacy. It addresses re-identification by making it difficult to determine whether a specific individual's data was used. Both are often used together: federated learning keeps data local, differential privacy adds noise to model updates to prevent privacy leaks. Federated learning is about where computation happens. Differential privacy is about how privacy is mathematically guaranteed." },
  { q: "How does secure multi-party computation (SMPC) work?", a: "SMPC allows multiple parties to compute a function on their combined inputs without revealing individual inputs. Each party encrypts their input using secret sharing or garbled circuits. The computation is performed on the encrypted inputs, and only the final result is revealed. No party learns anything about other parties' inputs. Example: Three parties want to compute the average of their salaries without revealing individual salaries. Using SMPC, each party shares encrypted salary data, the average is computed on encrypted data, and only the average is revealed. SMPC is computationally expensive but provides strong privacy guarantees." },
  { q: "What are the performance implications of homomorphic encryption?", a: "Homomorphic encryption allows computation on encrypted data, but it is computationally expensive. Fully Homomorphic Encryption (FHE) supports arbitrary computations but is 100-1000x slower than plaintext computation. Partially Homomorphic Encryption (PHE) is faster (10-100x slower) but supports only limited operations (addition or multiplication, not both). Optimisation strategies: 1) Use FHE-accelerated hardware (GPUs, ASICs). 2) Batch operations to amortise overhead. 3) Use PHE when possible (e.g., only need addition). 4) Pre-compute common operations. 5) Use hybrid approaches (partial decryption for intermediate steps)." },
  { q: "When should I use privacy-preserving techniques for LLMs?", a: "Privacy-preserving techniques are necessary when: 1) Data is sensitive (PII, health data, financial data). 2) Data cannot be centralised (regulatory constraints, data sovereignty). 3) Collaboration is required across multiple parties (multi-party training). 4) Privacy guarantees are required (GDPR, HIPAA). 5) Risk of re-identification is high. Federated learning is suitable for distributed training. Differential privacy is suitable for protecting individual contributions. SMPC is suitable for collaborative computation. Homomorphic encryption is suitable for privacy-preserving inference. Use the technique that matches your use case and constraints." },
]

export default function LlmPrivacyPreservingComputationPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Privacy-Preserving Computation", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Privacy-Preserving-Computation-Guide für eigene KI-Systeme.", "Privacy-preserving computation guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 20</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "LLM Privacy-Preserving Computation", "LLM Privacy-Preserving Computation")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "LLM-Berechnungen ohne Privacy-Preserving können sensible Daten offenlegen — ohne Datenschutztechniken bleibt Privatsphäre ungeschützt. Vier Kontrollen: Federated Learning, Differential Privacy, SMPC und Homomorphic Encryption.", "LLM computations without privacy-preserving can expose sensitive data — without privacy techniques, privacy remains unprotected. Four controls: federated learning, differential privacy, SMPC and homomorphic encryption.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Privacy-Preserving-Computation-Kontrollen", "4 Privacy-Preserving Computation Controls")}</h2>
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
            <a href={`/${locale}/moltbot/llm-data-encryption-at-rest`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Data Encryption at Rest</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Data-Security", "Data security")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-data-loss-prevention`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Data Loss Prevention</div>
              <div className="text-sm text-gray-300">{pick(isDE, "DLP", "DLP")}</div>
            </a>
            <a href={`/${locale}/moltbot/multi-tenant-llm-isolation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Multi-Tenant LLM Isolation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Tenant-Privacy", "Tenant privacy")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Privacy-Overview", "Privacy overview")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
