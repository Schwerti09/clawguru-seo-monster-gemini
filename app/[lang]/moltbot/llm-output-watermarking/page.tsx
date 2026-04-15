import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-output-watermarking"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "LLM Output Watermarking: LLM-Output-Watermarking | ClawGuru Moltbot"
    : "LLM Output Watermarking: LLM Output Watermarking | ClawGuru Moltbot"
  const description = isDE
    ? "LLM-Output-Watermarking: Statistical Watermarking, Cryptographic Watermarking, Watermark Detection und Watermark Robustness für LLM-Output-Watermarking."
    : "LLM output watermarking: statistical watermarking, cryptographic watermarking, watermark detection and watermark robustness for LLM output watermarking."
  return {
    title, description,
    keywords: ["llm output watermarking", "statistical watermarking", "cryptographic watermarking", "watermark detection", "watermark robustness", "moltbot watermarking"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "OW-1", title: "Statistical Watermarking", desc: "Embed statistical watermarks in LLM output. Bias token selection to create detectable patterns.", code: `# Moltbot statistical output watermarking:
statistical_watermarking:
  enabled: true

  # Token Bias Watermarking:
  token_bias:
    enabled: true
    # Method: bias token selection with secret key
    # Key: cryptographic watermark key
    # Strength: configurable watermark strength
    # Preserves: output quality

  # Green/Red Token List:
  token_lists:
    enabled: true
    # Generate: green/red token lists per context
    # Seed: based on secret key + context hash
    # Apply: prefer green tokens during sampling
    # Detect: measure green token ratio

  # Watermark Parameters:
  parameters:
    enabled: true
    # Strength: 2.0 (default, adjustable)
    # Context_window: 1 (hash context size)
    # Vocabulary_size: full model vocabulary
    # Detect_threshold: configurable p-value` },
  { id: "OW-2", title: "Cryptographic Watermarking", desc: "Embed cryptographic watermarks in LLM output. Use HMAC-based schemes for attribution.", code: `# Moltbot cryptographic output watermarking:
cryptographic_watermarking:
  enabled: true

  # HMAC-Based Watermarking:
  hmac:
    enabled: true
    # Method: HMAC-SHA256 based watermark
    # Key: per-instance secret key
    # Embed: in output token distribution
    # Detect: via key verification

  # Invisible Text Watermarking:
  invisible_text:
    enabled: true
    # Method: zero-width characters
    # Embed: model ID, timestamp, user ID
    # Detect: extract and verify
    # Survives: copy-paste

  # Watermark Metadata:
  metadata:
    enabled: true
    # Include: model ID, timestamp
    # Include: request ID, user ID
    # Sign: with private key
    # Verify: watermark authenticity` },
  { id: "OW-3", title: "Watermark Detection", desc: "Detect watermarks in text to verify LLM output origin. Build detection API.", code: `# Moltbot watermark detection:
detection:
  enabled: true

  # Statistical Detection:
  statistical:
    enabled: true
    # Method: z-test on green token ratio
    # Threshold: p-value < 0.001
    # Output: watermark confidence score
    # API: /detect-watermark endpoint

  # Cryptographic Detection:
  cryptographic:
    enabled: true
    # Method: verify HMAC signature
    # Key: per-instance detection key
    # Output: attribution metadata
    # API: /verify-attribution endpoint

  # Batch Detection:
  batch:
    enabled: true
    # Detect: watermarks in bulk
    # Async: process large batches
    # Report: detection statistics
    # Alert: on suspected misuse` },
  { id: "OW-4", title: "Watermark Robustness", desc: "Harden watermarks against removal attacks. Test watermark persistence under transformations.", code: `# Moltbot watermark robustness:
robustness:
  enabled: true

  # Paraphrasing Resistance:
  paraphrase:
    enabled: true
    # Test: watermark survives paraphrasing
    # Method: test with multiple paraphrasers
    # Target: 80%+ detection after paraphrase
    # Monitor: robustness metrics

  # Translation Resistance:
  translation:
    enabled: true
    # Test: watermark survives translation
    # Pairs: major language pairs
    # Target: 60%+ detection after translation
    # Monitor: cross-language robustness

  # Adversarial Testing:
  adversarial:
    enabled: true
    # Test: known watermark removal attacks
    # Methods: token substitution, paraphrase, crop
    # Report: robustness against each attack
    # Improve: watermark strength as needed` },
]

const FAQ = [
  { q: "What is LLM output watermarking and why does it matter?", a: "LLM output watermarking embeds invisible signals in AI-generated text to enable later detection. It matters for: 1) Disinformation detection — identify AI-generated fake news. 2) Copyright protection — prove text was generated by your system. 3) Usage attribution — track how your LLM outputs are used. 4) Abuse detection — detect when your LLM is used for spam or harmful content. 5) Regulatory compliance — EU AI Act and other regulations may require AI content labeling." },
  { q: "How does statistical watermarking work?", a: "Statistical watermarking works by biasing the LLM's token selection using a secret key. Before generating each token, the vocabulary is split into 'green' and 'red' lists using a pseudorandom function keyed by the secret key and the recent context. The model is nudged to prefer green tokens during sampling. Detection measures the ratio of green tokens in a text — genuine LLM output shows a significantly higher ratio than random text, detectable via a statistical z-test. The quality impact is minimal with appropriate watermark strength." },
  { q: "Can watermarks be removed by paraphrasing?", a: "Paraphrasing can reduce watermark strength but rarely eliminates it entirely. Statistical watermarks are designed to be robust: good watermarking schemes maintain 80%+ detection rate after paraphrasing. Translation resistance is lower (60-70%). Known removal attacks include: token substitution (replace watermarked tokens), paraphrasing, and cropping. Advanced attacks combining multiple techniques can reduce detection rates further. For high-stakes applications, combine statistical and cryptographic watermarking for redundancy." },
  { q: "How does watermarking interact with privacy?", a: "Watermarking can embed user-identifying information (user ID, session ID) in output, which raises privacy concerns. Best practices: 1) Use anonymous watermarks when privacy is required — embed only model ID and timestamp, not user ID. 2) Document watermarking in your privacy policy. 3) Allow users to opt out of personalised watermarks. 4) Comply with GDPR — treat embedded user IDs as personal data. 5) Use key rotation to limit watermark traceability. Watermarking and privacy can coexist with proper design." },
]

export default function LlmOutputWatermarkingPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Output Watermarking", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "LLM-Output-Watermarking-Guide für eigene KI-Systeme." : "LLM output watermarking guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 27</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "LLM Output Watermarking" : "LLM Output Watermarking"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "AI-Content ohne Watermarking ist unsichtbar — Disinformation, Copyright-Verletzungen und Missbrauch. Vier Kontrollen: Statistical Watermarking, Cryptographic Watermarking, Watermark Detection und Watermark Robustness."
            : "AI content without watermarking is invisible — disinformation, copyright violations and abuse. Four controls: statistical watermarking, cryptographic watermarking, watermark detection and watermark robustness."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Output-Watermarking-Kontrollen" : "4 Output Watermarking Controls"}</h2>
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
            <a href={`/${locale}/moltbot/llm-model-watermarking`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Model Watermarking</div>
              <div className="text-sm text-gray-300">{isDE ? "Model-Watermarking" : "Model watermarking"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-output-validation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Output Validation</div>
              <div className="text-sm text-gray-300">{isDE ? "Output-Validation" : "Output validation"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-output-filtering`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Output Filtering</div>
              <div className="text-sm text-gray-300">{isDE ? "Output-Filtering" : "Output filtering"}</div>
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
