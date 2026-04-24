import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-secure-inference"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Secure Inference: LLM-Secure-Inference | ClawGuru Moltbot", "LLM Secure Inference: LLM Secure Inference | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-Secure-Inference: Secure Enclave Execution, Trusted Execution Environment, Confidential Computing und Input/Output Validation für LLM-Secure-Inference.", "LLM secure inference: secure enclave execution, trusted execution environment, confidential computing and input/output validation for LLM secure inference.")
  return {
    title, description,
    keywords: ["llm secure inference", "secure enclave", "tee", "confidential computing", "input validation", "moltbot secure inference"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "SI-1", title: "Secure Enclave Execution", desc: "Execute LLM inference in secure enclaves. Use Intel SGX, AMD SEV, or ARM TrustZone to protect model and data.", code: `# Moltbot secure enclave execution:
secure_enclave:
  enabled: true

  # Enclave type:
  enclave_type:
    # Intel SGX: Software Guard Extensions
    # AMD SEV: Secure Encrypted Virtualization
    # ARM TrustZone: TrustZone technology
    # Select: based on hardware availability
    type: "intel_sgx"

  # Enclave configuration:
  configuration:
    # Memory: enclave memory size
    memory_size: "128MB"
    # Threads: number of enclave threads
    threads: 4
    # Attestation: remote attestation required
    attestation: true

  # Model protection:
  model_protection:
    # Encrypt: model weights in enclave
    # Decrypt: only in enclave
    # Key: sealed in enclave
    # Prevents: model extraction` },
  { id: "SI-2", title: "Trusted Execution Environment (TEE)", desc: "Use TEE for secure LLM inference. Ensure code and data integrity through hardware-based isolation.", code: `# Moltbot TEE execution:
tee:
  enabled: true

  # TEE framework:
  framework:
    # Nitro Enclaves: AWS Nitro Enclaves
    # Confidential Computing: Azure Confidential Computing
    # Shielded VMs: GCP Shielded VMs
    # Select: based on cloud provider
    provider: "aws_nitro"

  # TEE configuration:
  configuration:
    # CPU: vCPUs allocated to TEE
    vcpus: 4
    # Memory: memory allocated to TEE
    memory: "8GB"
    # Storage: encrypted storage for TEE
    storage: "encrypted"

  # Attestation:
  attestation:
    enabled: true
    # Verify: TEE integrity before inference
    # Use: remote attestation
    # Validate: TEE identity, measurements
    # Block: unattested TEEs` },
  { id: "SI-3", title: "Confidential Computing", desc: "Use confidential computing to protect data in use. Encrypt data during computation with homomorphic encryption or secure multi-party computation.", code: `# Moltbot confidential computing:
confidential_computing:
  enabled: true

  # Homomorphic encryption:
  homomorphic_encryption:
    enabled: true
    # Encrypt: input data before inference
    # Compute: on encrypted data
    # Decrypt: only output
    # Use: FHE or PHE based on requirements

  # Secure multi-party computation:
  smpc:
    enabled: true
    # Split: input data across parties
    # Compute: without revealing inputs
    # Reveal: only final output
    # Use: for collaborative inference

  # Data protection:
  data_protection:
    # Protect: input data, model weights, output
    # Encrypt: at rest and in use
    # Key: secure key management
    # Prevents: data leakage` },
  { id: "SI-4", title: "Input/Output Validation", desc: "Validate all inputs and outputs in the secure enclave. Sanitise inputs to prevent attacks and validate outputs to ensure correctness.", code: `# Moltbot input/output validation:
validation:
  enabled: true

  # Input validation:
  input_validation:
    enabled: true
    # Validate: input format, size, content
    # Sanitise: remove dangerous content
    # Check: for prompt injection, malicious patterns
    # Block: invalid or malicious inputs

  # Output validation:
  output_validation:
    enabled: true
    # Validate: output format, size, content
    # Sanitise: remove dangerous content
    # Check: for hallucinations, bias, PII
    # Flag: suspicious outputs

  # Validation logging:
  logging:
    enabled: true
    # Log: all validation attempts
    # Track: validation success/failure
    # Audit: validation history` },
]

const FAQ = [
  { q: "What is the difference between secure enclaves and TEEs?", a: "Secure enclaves (e.g., Intel SGX, AMD SEV, ARM TrustZone) are hardware-based isolated execution environments that protect code and data from the rest of the system. They provide memory encryption and remote attestation. Trusted Execution Environments (TEEs) are cloud-based confidential computing services (AWS Nitro Enclaves, Azure Confidential Computing, GCP Shielded VMs) that provide similar isolation at the virtual machine level. Both provide hardware-based isolation, but secure enclaves are CPU-level while TEEs are VM-level. Secure enclaves require specific hardware support, while TEEs are cloud-managed services." },
  { q: "How does confidential computing protect LLM inference?", a: "Confidential computing protects data in use during LLM inference. Homomorphic encryption allows computation on encrypted data without decryption. The input data is encrypted, the model computes on the encrypted data, and only the output is decrypted. This ensures that the input data is never exposed to the model or the inference infrastructure. Secure multi-party computation (SMPC) splits input data across parties, computes without revealing inputs, and reveals only the final output. Both techniques provide strong privacy guarantees but are computationally expensive." },
  { q: "How does remote attestation work?", a: "Remote attestation allows a verifier to confirm that a secure enclave or TEE is running genuine, unmodified code. The enclave/TEE generates a cryptographic attestation report that includes measurements of the code and data loaded into the enclave. The verifier validates the attestation report against expected values. If validation succeeds, the verifier knows the enclave is running the expected code in a secure environment. Remote attestation prevents attackers from running malicious code in the enclave or tampering with the enclave." },
  { q: "What are the performance implications of secure inference?", a: "Secure inference using secure enclaves, TEEs, or confidential computing has performance overhead: 1) Enclave isolation adds latency due to context switches and memory encryption. 2) Homomorphic encryption is 100-1000x slower than plaintext computation. 3) SMPC adds communication overhead and computational cost. 4) Input/output validation adds latency. Optimisation strategies: 1) Use hardware-accelerated encryption. 2) Batch operations to amortise overhead. 3) Use PHE instead of FHE when possible. 4) Cache validation results. 5) Use hybrid approaches (partial decryption for intermediate steps)." },
]

export default function LlmSecureInferencePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Secure Inference", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Secure-Inference-Guide für eigene KI-Systeme.", "Secure inference guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 21</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "LLM Secure Inference", "LLM Secure Inference")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "LLM-Inference ohne Secure-Execution kann Modelle und Daten kompromittieren — ohne Secure-Inference bleibt Inference ungeschützt. Vier Kontrollen: Secure Enclave Execution, TEE, Confidential Computing und Input/Output Validation.", "LLM inference without secure execution can compromise models and data — without secure inference, inference remains unprotected. Four controls: secure enclave execution, TEE, confidential computing and input/output validation.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Secure-Inference-Kontrollen", "4 Secure Inference Controls")}</h2>
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
            <a href={`/${locale}/moltbot/llm-privacy-preserving-computation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Privacy-Preserving Computation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Confidential-Computing", "Confidential computing")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-output-validation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Output Validation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Validation", "Validation")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-sandboxing-runtime`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Sandboxing Runtime</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Isolation", "Isolation")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
