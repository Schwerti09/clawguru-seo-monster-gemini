import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-model-compression-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "LLM Model Compression Security: LLM-Modell-Compression-Security | ClawGuru Moltbot"
    : "LLM Model Compression Security: LLM Model Compression Security | ClawGuru Moltbot"
  const description = isDE
    ? "LLM-Modell-Compression-Security: Compression Attack Detection, Secure Model Compression, Compression Integrity Verification und Compression-Resistant Training für LLM-Modell-Compression-Security."
    : "LLM model compression security: compression attack detection, secure model compression, compression integrity verification and compression-resistant training for LLM model compression security."
  return {
    title, description,
    keywords: ["llm model compression security", "compression attack detection", "secure model compression", "compression integrity", "compression resistant training", "moltbot compression"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "MCS-1", title: "Compression Attack Detection", desc: "Detect attacks that exploit model compression vulnerabilities. Monitor for adversarial examples targeting compressed models.", code: `# Moltbot compression attack detection:
compression_attack_detection:
  enabled: true

  # Compression-aware adversarial detection:
  adversarial_detection:
    enabled: true
    # Detect: adversarial examples targeting compressed models
    # Method: compression-aware gradient analysis
    # Alert: on suspected compression attacks

  # Compression degradation detection:
  degradation_detection:
    enabled: true
    # Detect: abnormal compression degradation
    # Method: statistical analysis of compression errors
    # Alert: on suspicious accuracy loss

  # Compression consistency check:
  consistency:
    enabled: true
    # Check: compression consistency across runs
    # Method: hash verification of compressed weights
    # Alert: on compression tampering` },
  { id: "MCS-2", title: "Secure Model Compression", desc: "Secure the compression process against tampering. Use signed compression parameters and integrity verification.", code: `# Moltbot secure model compression:
secure_compression:
  enabled: true

  # Signed compression parameters:
  signed_parameters:
    enabled: true
    # Sign: compression parameters
    # Method: digital signature
    # Verify: signature before using compressed model
    # Prevents: compression tampering

  # Compression integrity verification:
  integrity_verification:
    enabled: true
    # Verify: compressed model integrity
    # Method: hash verification, checksum
    # Block: tampered compressed models

  # Secure compression pipeline:
  pipeline:
    enabled: true
    # Secure: compression pipeline
    # Use: isolated environment, secure storage
    # Audit: compression pipeline logs` },
  { id: "MCS-3", title: "Compression Integrity Verification", desc: "Verify compressed model integrity before deployment. Check for tampering and verify compression parameters.", code: `# Moltbot compression integrity verification:
integrity_verification:
  enabled: true

  # Hash verification:
  hash_verification:
    enabled: true
    # Compute: hash of compressed model
    # Compare: against expected hash
    # Block: mismatched models
    # Prevents: model tampering

  # Compression parameter verification:
  parameter_verification:
    enabled: true
    # Verify: compression parameters
    # Check: compression ratio, method, quality
    # Alert: on parameter anomalies

  # Accuracy verification:
  accuracy_verification:
    enabled: true
    # Verify: compressed model accuracy
    # Test: on validation set
    # Block: models with excessive accuracy loss` },
  { id: "MCS-4", title: "Compression-Resistant Training", desc: "Train models with compression in mind. Use compression-resistant training to maintain accuracy after compression.", code: `# Moltbot compression-resistant training:
compression_resistant_training:
  enabled: true

  # Simulate compression during training:
  simulation:
    enabled: true
    # Simulate: compression during forward pass
    # Method: fake compression, pruning simulation
    # Benefit: model learns to be robust to compression

  # Compression-aware loss:
  loss:
    enabled: true
    # Include: compression error in loss function
    # Method: add compression regularization term
    # Benefit: minimise compression accuracy loss

  # Calibration:
  calibration:
    enabled: true
    # Calibrate: compression parameters
    # Method: post-training calibration, entropy calibration
    # Benefit: optimal compression parameters` },
]

const FAQ = [
  { q: "What is the difference between compression-resistant training and post-training compression?", a: "Compression-resistant training (CRT) simulates compression during training. The model learns to be robust to compression by experiencing compression errors during training. Post-training compression (PTC) compresses a trained model without retraining. CRT typically achieves better accuracy because the model is trained to be compression-robust. PTC is faster because it doesn't require retraining. CRT is recommended for production models where accuracy is critical. PTC is useful for quick prototyping or when retraining is not feasible." },
  { q: "How does model compression affect model security?", a: "Model compression introduces security risks: 1) Compression reduces precision, making models more vulnerable to adversarial examples. 2) Compression parameters can be tampered with, degrading model performance. 3) Compression errors can be exploited to cause incorrect outputs. 4) Compressed models may leak information through compression patterns. Defense: compression-resistant training, secure compression pipelines, integrity verification, compression attack detection." },
  { q: "How do I detect compression attacks?", a: "Compression attack detection monitors for: 1) Adversarial examples specifically targeting compressed models — use compression-aware gradient analysis. 2) Abnormal compression degradation — statistical analysis of compression errors. 3) Compression tampering — hash verification of compressed weights. 4) Parameter anomalies — verify compression ratio, method, quality. Detection requires baseline measurements of normal compression behavior." },
  { q: "What are common compression attack vectors?", a: "Common compression attack vectors: 1) Compression-aware adversarial examples — crafted to exploit compression errors. 2) Compression parameter tampering — modify compression parameters to degrade performance. 3) Compression precision degradation — force excessive compression to reduce accuracy. 4) Compression model extraction — extract model through compressed queries. Defense: compression-resistant training, secure compression, integrity verification, attack detection." },
]

export default function LlmModelCompressionSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Model Compression Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Compression-Security-Guide für eigene KI-Systeme." : "Compression security guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 24</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "LLM Model Compression Security" : "LLM Model Compression Security"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "LLM-Modelle ohne Compression-Security sind anfällig für Compression-Attacken — ohne Compression-Security bleibt Compression ungeschützt. Vier Kontrollen: Compression Attack Detection, Secure Model Compression, Compression Integrity Verification und Compression-Resistant Training."
            : "LLM models without compression security are vulnerable to compression attacks — without compression security, compression remains unprotected. Four controls: compression attack detection, secure model compression, compression integrity verification and compression-resistant training."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Compression-Security-Kontrollen" : "4 Compression Security Controls"}</h2>
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
            <a href={`/${locale}/moltbot/llm-quantization-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Quantization Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Quantization-Defense" : "Quantization defense"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-adversarial-robustness`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Adversarial Robustness</div>
              <div className="text-sm text-gray-300">{isDE ? "Adversarial-Defense" : "Adversarial defense"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-secure-inference`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Secure Inference</div>
              <div className="text-sm text-gray-300">{isDE ? "Confidential-Computing" : "Confidential computing"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Compression-Overview" : "Compression overview"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
