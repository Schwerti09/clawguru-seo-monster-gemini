import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-model-watermarking"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "LLM Model Watermarking: LLM-Modell-Watermarking | ClawGuru Moltbot"
    : "LLM Model Watermarking: LLM Model Watermarking | ClawGuru Moltbot"
  const description = isDE
    ? "LLM-Modell-Watermarking: Watermark Embedding, Watermark Detection, Watermark Robustness und Watermark Verification für LLM-Modell-Authentifizierung."
    : "LLM model watermarking: watermark embedding, watermark detection, watermark robustness and watermark verification for LLM model authentication."
  return {
    title, description,
    keywords: ["llm model watermarking", "watermark embedding", "watermark detection", "watermark robustness", "watermark verification", "moltbot watermarking"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "MW-1", title: "Watermark Embedding", desc: "Embed watermarks into LLM model outputs. Use statistical or syntactic watermarking techniques to mark AI-generated content.", code: `# Moltbot watermark embedding:
watermark_embedding:
  enabled: true

  # Statistical watermarking:
  statistical:
    enabled: true
    # Use statistical patterns in token distribution
    # Example: bias token probabilities toward watermark pattern
    # Detectable: statistical analysis of outputs
    # Robustness: moderate (resists paraphrasing)

  # Syntactic watermarking:
  syntactic:
    enabled: true
    # Use syntactic patterns in output structure
    # Example: specific sentence structures, punctuation patterns
    # Detectable: syntactic analysis of outputs
    # Robustness: high (resists paraphrasing)

  # Embedding strength:
  strength:
    # Balance: watermark detectability vs output quality
    # Higher strength: more detectable, lower quality
    # Lower strength: less detectable, higher quality
    level: 0.5` },
  { id: "MW-2", title: "Watermark Detection", desc: "Detect watermarks in LLM outputs to identify AI-generated content. Use statistical or syntactic analysis.", code: `# Moltbot watermark detection:
watermark_detection:
  enabled: true

  # Statistical detection:
  statistical_detection:
    enabled: true
    # Analyze token distribution for watermark patterns
    # Use: hypothesis testing, p-value calculation
    # Threshold: p-value < 0.01 indicates watermark
    # Output: watermark confidence score

  # Syntactic detection:
  syntactic_detection:
    enabled: true
    # Analyze output structure for watermark patterns
    # Use: parsing, pattern matching
    # Threshold: pattern match > 80% indicates watermark
    # Output: watermark confidence score

  # Combined detection:
  combined:
    enabled: true
    # Combine statistical and syntactic detection
    # Use: weighted average of confidence scores
    # Threshold: combined score > 0.7 indicates watermark` },
  { id: "MW-3", title: "Watermark Robustness", desc: "Ensure watermarks survive attacks like paraphrasing, translation, and modification. Use robust watermarking techniques.", code: `# Moltbot watermark robustness:
watermark_robustness:
  enabled: true

  # Robustness testing:
  testing:
    enabled: true
    # Test watermark against attacks:
    # - Paraphrasing
    # - Translation
    # - Minor modifications
    # - Adversarial attacks
    # Metric: watermark detection rate after attack

  # Robustness enhancement:
  enhancement:
    enabled: true
    # Use: multi-layer watermarking
    # - Statistical + syntactic
    # - Multiple watermark patterns
    # - Adaptive watermarking

  # Attack detection:
  attack_detection:
    enabled: true
    # Detect watermark removal attempts
    # Monitor: sudden changes in watermark detection rate
    # Alert: on suspected watermark removal` },
  { id: "MW-4", title: "Watermark Verification", desc: "Verify watermark authenticity to prevent false positives. Use cryptographic signatures or key-based verification.", code: `# Moltbot watermark verification:
watermark_verification:
  enabled: true

  # Cryptographic verification:
  cryptographic:
    enabled: true
    # Use: digital signature for watermark
    # Sign: watermark pattern with private key
    # Verify: watermark with public key
    # Prevents: false positives from mimicry

  # Key-based verification:
  key_based:
    enabled: true
    # Use: secret key for watermark embedding
    # Embed: watermark using secret key
    # Detect: watermark using secret key
    # Prevents: unauthorized detection

  # Verification logging:
  logging:
    enabled: true
    # Log: all watermark verification attempts
    # Track: verification success/failure
    # Audit: watermark verification history` },
]

const FAQ = [
  { q: "What is the difference between statistical and syntactic watermarking?", a: "Statistical watermarking embeds watermarks in the statistical distribution of tokens. It biases the model's token probabilities toward a watermark pattern, which can be detected through statistical analysis. Syntactic watermarking embeds watermarks in the syntactic structure of outputs. It uses specific sentence structures, punctuation patterns, or other syntactic features. Statistical watermarking is more subtle but less robust to paraphrasing. Syntactic watermarking is more robust but more noticeable. Both can be combined for stronger watermarking: statistical for subtlety, syntactic for robustness." },
  { q: "How does watermark detection work?", a: "Watermark detection analyzes LLM outputs to detect embedded watermark patterns. Statistical detection uses hypothesis testing to determine if the token distribution matches the watermark pattern (e.g., p-value < 0.01 indicates watermark). Syntactic detection uses parsing and pattern matching to detect syntactic watermark patterns (e.g., specific sentence structures). Combined detection uses a weighted average of statistical and syntactic confidence scores. Detection returns a confidence score indicating the likelihood that the output contains a watermark. Thresholds determine the final decision (e.g., score > 0.7 = watermark present)." },
  { q: "How do I improve watermark robustness?", a: "Watermark robustness can be improved by: 1) Multi-layer watermarking — combine statistical and syntactic watermarking. 2) Multiple watermark patterns — embed multiple independent watermark patterns. 3) Adaptive watermarking — adjust watermark strength based on content. 4) Robust embedding techniques — use techniques that resist paraphrasing and translation. 5) Regular testing — test watermark against various attacks (paraphrasing, translation, adversarial attacks). 6) Attack detection — monitor for watermark removal attempts and alert on suspicious activity." },
  { q: "What are the limitations of watermarking?", a: "Watermarking has several limitations: 1) Quality degradation — stronger watermarks can reduce output quality. 2) False positives — natural text may coincidentally match watermark patterns. 3) False negatives — attacks (paraphrasing, translation) can remove watermarks. 4) Detectability — sophisticated attackers can detect and remove watermarks. 5) Trade-offs — there is a trade-off between watermark strength, robustness, and output quality. 6) Standardisation — no standard watermarking protocol exists, making interoperability difficult." },
]

export default function LlmModelWatermarkingPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Model Watermarking", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Model-Watermarking-Guide für eigene KI-Systeme." : "Model watermarking guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 21</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "LLM Model Watermarking" : "LLM Model Watermarking"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "LLM-Modelle ohne Watermarking können nicht authentifiziert werden — ohne Watermarks bleibt AI-generierter Content unmarkiert. Vier Kontrollen: Watermark Embedding, Detection, Robustness und Verification."
            : "LLM models without watermarking cannot be authenticated — without watermarks, AI-generated content remains unmarked. Four controls: watermark embedding, detection, robustness and verification."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Model-Watermarking-Kontrollen" : "4 Model Watermarking Controls"}</h2>
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
            <a href={`/${locale}/moltbot/llm-output-filtering`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Output Filtering</div>
              <div className="text-sm text-gray-300">{isDE ? "Content-Safety" : "Content safety"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-privacy-preserving-computation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Privacy-Preserving Computation</div>
              <div className="text-sm text-gray-300">{isDE ? "Privacy" : "Privacy"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-bias-detection-mitigation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Bias Detection Mitigation</div>
              <div className="text-sm text-gray-300">{isDE ? "Fairness" : "Fairness"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Watermarking-Overview" : "Watermarking overview"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
