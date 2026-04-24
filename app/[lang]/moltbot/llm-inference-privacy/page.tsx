import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-inference-privacy"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Inference Privacy: LLM-Inferenz-Datenschutz | ClawGuru Moltbot", "LLM Inference Privacy: LLM Inference Privacy Protection | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-Inferenz-Datenschutz: Query Privacy, Differential Privacy Inference, Private Inference Protocols und Inference Data Minimization für LLM-Inferenz-Datenschutz und DSGVO-Compliance.", "LLM inference privacy: query privacy, differential privacy inference, private inference protocols and inference data minimization for LLM inference privacy and GDPR compliance.")
  return {
    title, description,
    keywords: ["llm inference privacy", "query privacy llm", "differential privacy inference", "private inference protocols", "inference data minimization", "gdpr llm privacy"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "IFP-1", title: "Query Privacy", desc: "Protect the privacy of user queries sent to LLMs. Prevent query logging and exposure.", code: `# Moltbot query privacy:
query_privacy:
  enabled: true

  # PII Scrubbing:
  pii_scrubbing:
    enabled: true
    # Detect: PII in queries (names, emails, SSN)
    # Scrub: before logging
    # Pseudonymize: user identifiers
    # Retain: scrubbed logs only

  # Query Anonymization:
  anonymization:
    enabled: true
    # Remove: identifying information
    # Generalize: specific values
    # Add: k-anonymity to query logs
    # Certify: anonymization effectiveness

  # Minimal Logging:
  minimal_logging:
    enabled: true
    # Log: only what is needed
    # Avoid: logging full query content
    # Retention: shortest required period
    # Delete: after retention period` },
  { id: "IFP-2", title: "Differential Privacy Inference", desc: "Apply differential privacy to LLM inference to prevent membership inference attacks.", code: `# Moltbot differential privacy inference:
differential_privacy:
  enabled: true

  # Output Noise Injection:
  noise:
    enabled: true
    # Apply: calibrated Gaussian noise to outputs
    # Epsilon: privacy budget (e.g., 1.0)
    # Delta: failure probability (e.g., 1e-5)
    # Track: cumulative privacy budget

  # Privacy Budget Management:
  budget:
    enabled: true
    # Define: per-user privacy budget
    # Track: budget consumption
    # Halt: inference when budget exhausted
    # Reset: budget per time period

  # Membership Inference Defense:
  membership_inference:
    enabled: true
    # Detect: membership inference attacks
    # Measure: model memorization
    # Mitigate: with output noise
    # Audit: training data exposure` },
  { id: "IFP-3", title: "Private Inference Protocols", desc: "Use cryptographic protocols to enable private LLM inference. Protect query content from the server.", code: `# Moltbot private inference protocols:
private_inference:
  enabled: true

  # Secure Multi-Party Computation:
  smpc:
    enabled: false  # High overhead — use for highest sensitivity
    # Protocol: secret sharing or garbled circuits
    # Compute: inference without seeing plaintext
    # Use case: medical, legal, financial queries

  # Homomorphic Encryption:
  homomorphic:
    enabled: false  # Very high overhead — research use
    # Encrypt: query before sending
    # Compute: on encrypted data
    # Decrypt: only at client

  # Trusted Execution Environments:
  tee:
    enabled: true   # Practical for production
    # Run: LLM inference in TEE (SGX, TDX)
    # Attest: TEE integrity to client
    # Protect: query from cloud provider
    # Use: for cloud inference privacy` },
  { id: "IFP-4", title: "Inference Data Minimization", desc: "Minimize data collected during LLM inference. Send only what is needed, retain only what is required.", code: `# Moltbot inference data minimization:
data_minimization:
  enabled: true

  # Query Minimization:
  query:
    enabled: true
    # Strip: unnecessary context from queries
    # Truncate: queries to minimum required length
    # Remove: metadata not needed for inference
    # Validate: necessity of each query field

  # Context Window Management:
  context:
    enabled: true
    # Expire: old context after session ends
    # Limit: context window to necessary history
    # Encrypt: stored context
    # Delete: context on user request

  # Retention Minimization:
  retention:
    enabled: true
    # Define: minimum retention per data type
    # Delete: automatically after retention period
    # GDPR: support right to erasure
    # Audit: retention compliance` },
]

const FAQ = [
  { q: "Why is LLM inference privacy a concern?", a: "LLM inference privacy matters because: 1) Queries reveal sensitive information — users share personal, medical, legal, and financial details with LLMs. 2) Query logging exposes this data — every inference may be logged by the LLM provider. 3) Membership inference attacks — attackers can determine whether specific data was in training data by querying the model. 4) Model inversion — attackers can reconstruct training data from model outputs. 5) GDPR implications — processing personal data in queries requires legal basis and must respect data subject rights. 6) Third-party cloud risk — sending queries to cloud LLM APIs exposes data to the provider and its subprocessors." },
  { q: "What is differential privacy for LLM inference?", a: "Differential privacy (DP) for inference adds mathematically calibrated noise to model outputs to prevent privacy attacks. The key guarantee: the probability of any output changes by at most a factor of e^epsilon whether or not any individual's data was in the training set. For inference: DP output perturbation adds noise to logits or output tokens. Privacy budget (epsilon) controls the tradeoff — lower epsilon = stronger privacy but lower utility. Practical challenge: DP for LLMs is computationally expensive and degrades output quality. Used selectively for high-sensitivity applications." },
  { q: "What is a Trusted Execution Environment (TEE) for LLM inference?", a: "A Trusted Execution Environment (TEE) is a secure enclave within a processor where code and data are protected from the host OS and cloud provider. For LLM inference: 1) The LLM runs inside the TEE (e.g., Intel SGX, Intel TDX, AMD SEV). 2) Queries are encrypted by the client and only decrypted inside the TEE. 3) The cloud provider cannot see query content — only the encrypted data. 4) The client can verify TEE integrity via remote attestation. Practical: TEE-based private inference is production-ready and used by services like Azure Confidential Computing, Intel Tiber. It provides strong cloud provider privacy without the extreme overhead of FHE." },
  { q: "How does LLM inference privacy relate to GDPR?", a: "GDPR applies to LLM inference when queries contain personal data (very common): 1) Legal basis — you need a lawful basis to process personal data in queries (consent, contract, legitimate interest). 2) Data minimization (Article 5) — only process personal data necessary for the purpose. 3) Right to erasure (Article 17) — users can request deletion of their inference history. 4) Data transfers — sending queries to non-EU LLM providers requires GDPR-compliant transfer mechanisms (SCCs, adequacy decision). 5) Processor agreements — if using a cloud LLM provider, a Data Processing Agreement is required. Self-hosted LLMs significantly simplify GDPR compliance for inference." },
]

export default function LlmInferencePrivacyPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Inference Privacy", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Inferenz-Datenschutz-Guide für eigene LLM-Systeme. DSGVO-Compliance.", "Inference privacy guide for your own LLM systems. GDPR compliance.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 30</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "LLM Inference Privacy", "LLM Inference Privacy")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Jede LLM-Anfrage enthält potentiell personenbezogene Daten — und ist damit DSGVO-relevant. Vier Kontrollen: Query Privacy, Differential Privacy Inference, Private Inference Protocols und Data Minimization.", "Every LLM query potentially contains personal data — making it GDPR-relevant. Four controls: query privacy, differential privacy inference, private inference protocols and data minimization.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Inferenz-Datenschutz-Kontrollen", "4 Inference Privacy Controls")}</h2>
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
            <a href={`/${locale}/moltbot/llm-privacy-preserving-computation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Privacy Preserving Computation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Privacy-Computation", "Privacy computation")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-data-encryption-at-rest`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Data Encryption at Rest</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Datenverschlüsselung", "Data encryption")}</div>
            </a>
            <a href={`/${locale}/solutions/eu-ai-act-compliance-checklist`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">EU AI Act Compliance</div>
              <div className="text-sm text-gray-300">{pick(isDE, "EU-KI-Gesetz", "EU AI Act")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-data-loss-prevention`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Data Loss Prevention</div>
              <div className="text-sm text-gray-300">{pick(isDE, "DLP für AI", "DLP for AI")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
