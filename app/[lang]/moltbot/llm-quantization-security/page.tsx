import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-quantization-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Quantization Security: LLM-Quantization-Security | ClawGuru Moltbot", "LLM Quantization Security: LLM Quantization Security | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-Quantization-Security: Quantization Attack Detection, Quantization-Aware Training, Secure Quantization und Quantization Integrity Verification für LLM-Quantization-Security.", "LLM quantization security: quantization attack detection, quantization-aware training, secure quantization and quantization integrity verification for LLM quantization security.")
  return {
    title, description,
    keywords: ["llm quantization security", "quantization attack detection", "quantization aware training", "secure quantization", "quantization integrity", "moltbot quantization"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "QS-1", title: "Quantization Attack Detection", desc: "Detect attacks that exploit quantization vulnerabilities. Monitor for adversarial examples targeting quantized models.", code: `# Moltbot quantization attack detection:
quantization_attack_detection:
  enabled: true

  # Quantization-aware adversarial detection:
  adversarial_detection:
    enabled: true
    # Detect: adversarial examples targeting quantized models
    # Method: quantization-aware gradient analysis
    # Alert: on suspected quantization attacks

  # Precision degradation detection:
  precision_detection:
    enabled: true
    # Detect: abnormal precision degradation
    # Method: statistical analysis of quantization errors
    # Alert: on suspicious precision loss

  # Quantization consistency check:
  consistency:
    enabled: true
    # Check: quantization consistency across runs
    # Method: hash verification of quantized weights
    # Alert: on quantization tampering` },
  { id: "QS-2", title: "Quantization-Aware Training", desc: "Train models with quantization in mind. Use quantization-aware training to maintain accuracy after quantization.", code: `# Moltbot quantization-aware training:
quantization_aware_training:
  enabled: true

  # Simulate quantization during training:
  simulation:
    enabled: true
    # Simulate: quantization during forward pass
    # Method: fake quantization, straight-through estimator
    # Benefit: model learns to be robust to quantization

  # Quantization-aware loss:
  loss:
    enabled: true
    # Include: quantization error in loss function
    # Method: add quantization regularization term
    # Benefit: minimise quantization accuracy loss

  # Calibration:
  calibration:
    enabled: true
    # Calibrate: quantization parameters
    # Method: post-training calibration, entropy calibration
    # Benefit: optimal quantization parameters` },
  { id: "QS-3", title: "Secure Quantization", desc: "Secure the quantization process against tampering. Use signed quantization parameters and integrity verification.", code: `# Moltbot secure quantization:
secure_quantization:
  enabled: true

  # Signed quantization parameters:
  signed_parameters:
    enabled: true
    # Sign: quantization parameters
    # Method: digital signature
    # Verify: signature before using quantized model
    # Prevents: quantization tampering

  # Quantization integrity verification:
  integrity_verification:
    enabled: true
    # Verify: quantized model integrity
    # Method: hash verification, checksum
    # Block: tampered quantized models

  # Secure quantization pipeline:
  pipeline:
    enabled: true
    # Secure: quantization pipeline
    # Use: isolated environment, secure storage
    # Audit: quantization pipeline logs` },
  { id: "QS-4", title: "Quantization Integrity Verification", desc: "Verify quantized model integrity before deployment. Check for tampering and verify quantization parameters.", code: `# Moltbot quantization integrity verification:
integrity_verification:
  enabled: true

  # Hash verification:
  hash_verification:
    enabled: true
    # Compute: hash of quantized model
    # Compare: against expected hash
    # Block: mismatched models
    # Prevents: model tampering

  # Quantization parameter verification:
  parameter_verification:
    enabled: true
    # Verify: quantization parameters
    # Check: scale, zero-point, bit-width
    # Alert: on parameter anomalies

  # Accuracy verification:
  accuracy_verification:
    enabled: true
    # Verify: quantized model accuracy
    # Test: on validation set
    # Block: models with excessive accuracy loss` },
]

const FAQ = [
  { q: "What is the difference between quantization-aware training and post-training quantization?", a: "Quantization-aware training (QAT) simulates quantization during training. The model learns to be robust to quantization by experiencing quantization errors during training. Post-training quantization (PTQ) quantizes a trained model without retraining. QAT typically achieves better accuracy because the model is trained to be quantization-robust. PTQ is faster because it doesn't require retraining. QAT is recommended for production models where accuracy is critical. PTQ is useful for quick prototyping or when retraining is not feasible." },
  { q: "How does quantization affect model security?", a: "Quantization introduces security risks: 1) Quantization reduces precision, making models more vulnerable to adversarial examples. 2) Quantization parameters can be tampered with, degrading model performance. 3) Quantization errors can be exploited to cause incorrect outputs. 4) Quantized models may leak information through quantization patterns. Defense: quantization-aware training, secure quantization pipelines, integrity verification, quantization attack detection." },
  { q: "How do I detect quantization attacks?", a: "Quantization attack detection monitors for: 1) Adversarial examples specifically targeting quantized models — use quantization-aware gradient analysis. 2) Abnormal precision degradation — statistical analysis of quantization errors. 3) Quantization tampering — hash verification of quantized weights. 4) Parameter anomalies — verify scale, zero-point, bit-width. Detection requires baseline measurements of normal quantization behavior." },
  { q: "What are common quantization attack vectors?", a: "Common quantization attack vectors: 1) Quantization-aware adversarial examples — crafted to exploit quantization errors. 2) Quantization parameter tampering — modify scale/zero-point to degrade performance. 3) Quantization precision degradation — force excessive quantization to reduce accuracy. 4) Quantization model extraction — extract model through quantized queries. Defense: quantization-aware training, secure quantization, integrity verification, attack detection." },
]

export default function LlmQuantizationSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Quantization Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Quantization-Security-Guide für eigene KI-Systeme.", "Quantization security guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 23</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "LLM Quantization Security", "LLM Quantization Security")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "LLM-Modelle ohne Quantization-Security sind anfällig für Quantization-Attacken — ohne Quantization-Security bleibt Quantization ungeschützt. Vier Kontrollen: Quantization Attack Detection, Quantization-Aware Training, Secure Quantization und Quantization Integrity Verification.", "LLM models without quantization security are vulnerable to quantization attacks — without quantization security, quantization remains unprotected. Four controls: quantization attack detection, quantization-aware training, secure quantization and quantization integrity verification.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Quantization-Security-Kontrollen", "4 Quantization Security Controls")}</h2>
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
            <a href={`/${locale}/moltbot/llm-adversarial-robustness`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Adversarial Robustness</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Adversarial-Defense", "Adversarial defense")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-model-extraction-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Model Extraction Defense</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Extraction-Defense", "Extraction defense")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-secure-inference`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Secure Inference</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Confidential-Computing", "Confidential computing")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Quantization-Overview", "Quantization overview")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
