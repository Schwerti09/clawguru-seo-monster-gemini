import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-multi-modal-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Multi-Modal Security: KI-Agenten-Multi-Modal-Security | ClawGuru Moltbot"
    : "AI Agent Multi-Modal Security: AI Agent Multi-Modal Security | ClawGuru Moltbot"
  const description = isDE
    ? "KI-Agenten-Multi-Modal-Security: Multi-Modal Input Validation, Cross-Modal Attack Detection, Multi-Modal Output Filtering und Multi-Modal Policy Enforcement für KI-Agenten-Multi-Modal-Security."
    : "AI agent multi-modal security: multi-modal input validation, cross-modal attack detection, multi-modal output filtering and multi-modal policy enforcement for AI agent multi-modal security."
  return {
    title, description,
    keywords: ["ai agent multi-modal security", "multi-modal input validation", "cross-modal attack detection", "multi-modal output filtering", "multi-modal policy", "moltbot multi-modal"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "MMS-1", title: "Multi-Modal Input Validation", desc: "Validate all multi-modal inputs (text, images, audio, video). Sanitise each modality independently and cross-modally.", code: `# Moltbot multi-modal input validation:
multi_modal_validation:
  enabled: true

  # Text validation:
  text_validation:
    enabled: true
    # Validate: text format, length, content
    # Sanitise: remove dangerous patterns
    # Method: regex, ML classifier

  # Image validation:
  image_validation:
    enabled: true
    # Validate: image format, size, content
    # Sanitise: remove embedded threats
    # Method: steganography detection, EXIF removal

  # Audio validation:
  audio_validation:
    enabled: true
    # Validate: audio format, duration, content
    # Sanitise: remove embedded commands
    # Method: spectral analysis, command detection

  # Video validation:
  video_validation:
    enabled: true
    # Validate: video format, duration, content
    # Sanitise: remove embedded threats
    # Method: frame-by-frame analysis` },
  { id: "MMS-2", title: "Cross-Modal Attack Detection", desc: "Detect attacks that exploit cross-modal interactions. Monitor for adversarial examples across modalities.", code: `# Moltbot cross-modal attack detection:
cross_modal_detection:
  enabled: true

  # Cross-modal consistency check:
  consistency:
    enabled: true
    # Check: consistency across modalities
    # Example: text should match image content
    # Detect: adversarial inconsistencies
    # Alert: on suspicious patterns

  # Adversarial example detection:
  adversarial_detection:
    enabled: true
    # Detect: adversarial examples across modalities
    # Method: perturbation analysis, gradient-based detection
    # Alert: on suspected adversarial inputs

  # Cross-modal injection detection:
  injection_detection:
    enabled: true
    # Detect: injection attacks across modalities
    # Example: hidden commands in audio/video
    # Method: steganography analysis, hidden command detection` },
  { id: "MMS-3", title: "Multi-Modal Output Filtering", desc: "Filter multi-modal outputs for safety. Apply content filtering to each modality independently and cross-modally.", code: `# Moltbot multi-modal output filtering:
multi_modal_filtering:
  enabled: true

  # Text output filtering:
  text_filtering:
    enabled: true
    # Filter: text for malicious content
    # Methods: content safety classifier, PII scan
    # Block: unsafe text outputs

  # Image output filtering:
  image_filtering:
    enabled: true
    # Filter: images for malicious content
    # Methods: NSFW detection, watermark detection
    # Block: unsafe image outputs

  # Audio output filtering:
  audio_filtering:
    enabled: true
    # Filter: audio for malicious content
    # Methods: command detection, PII scan
    # Block: unsafe audio outputs

  # Video output filtering:
  video_filtering:
    enabled: true
    # Filter: videos for malicious content
    # Methods: frame-by-frame analysis, NSFW detection
    # Block: unsafe video outputs` },
  { id: "MMS-4", title: "Multi-Modal Policy Enforcement", desc: "Enforce security policies across all modalities. Define modality-specific and cross-modal policies.", code: `# Moltbot multi-modal policy enforcement:
policy_enforcement:
  enabled: true

  # Modality-specific policies:
  modality_policies:
    enabled: true
    # Define: policies for each modality
    # Text: max length, content restrictions
    # Image: format, size, content restrictions
    # Audio: duration, content restrictions
    # Video: duration, content restrictions

  # Cross-modal policies:
  cross_modal_policies:
    enabled: true
    # Define: policies for cross-modal interactions
    # Example: text-image consistency requirements
    # Enforce: cross-modal policy violations

  # Policy violation handling:
  violation_handling:
    enabled: true
    # Action: block, warn, or flag violations
    # Alert: on policy violations
    # Audit: policy violation history` },
]

const FAQ = [
  { q: "What is the difference between multi-modal and single-modal security?", a: "Single-modal security focuses on one modality (e.g., text only). Multi-modal security handles multiple modalities (text, images, audio, video) and their interactions. Multi-modal security is more complex because: 1) Each modality has unique vulnerabilities (e.g., steganography in images, hidden commands in audio). 2) Cross-modal interactions can be exploited (e.g., adversarial text-image pairs). 3) Filtering and validation must be applied to each modality independently and cross-modally. Multi-modal security requires modality-specific and cross-modal controls." },
  { q: "How does cross-modal attack detection work?", a: "Cross-modal attack detection monitors interactions between modalities for suspicious patterns. Consistency checks verify that modalities are consistent (e.g., text describes the image accurately). Adversarial example detection looks for perturbations across modalities. Injection detection searches for hidden threats (e.g., steganography, hidden commands). By analysing cross-modal patterns, the system can detect attacks that would be invisible when analysing each modality independently." },
  { q: "How do I filter multi-modal outputs for safety?", a: "Multi-modal output filtering applies content filtering to each modality: 1) Text — content safety classifier, PII scan. 2) Images — NSFW detection, watermark detection, steganography analysis. 3) Audio — command detection, PII scan, spectral analysis. 4) Video — frame-by-frame analysis, NSFW detection. Cross-modal filtering verifies consistency across modalities. Each modality is filtered independently, then cross-modal consistency is verified before output." },
  { q: "What are common multi-modal attack vectors?", a: "Common multi-modal attack vectors: 1) Cross-modal adversarial examples — perturb one modality to cause misclassification in another. 2) Steganography — embed malicious content in images/audio/video. 3) Hidden commands — embed commands in audio/video that are executed by the agent. 4) Cross-modal injection — inject malicious content through one modality to affect another. 5) Modal inconsistency — exploit inconsistencies between modalities to bypass filters. Defense: multi-modal input validation, cross-modal attack detection, multi-modal output filtering." },
]

export default function AiAgentMultiModalSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent Multi-Modal Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Multi-Modal-Security-Guide für eigene KI-Systeme." : "Multi-modal security guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 23</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Multi-Modal Security" : "AI Agent Multi-Modal Security"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "KI-Agenten ohne Multi-Modal-Security sind anfällig für Cross-Modal-Attacken — ohne Multi-Modal-Security bleiben Cross-Modal-Interaktionen ungeschützt. Vier Kontrollen: Multi-Modal Input Validation, Cross-Modal Attack Detection, Multi-Modal Output Filtering und Multi-Modal Policy Enforcement."
            : "AI agents without multi-modal security are vulnerable to cross-modal attacks — without multi-modal security, cross-modal interactions remain unprotected. Four controls: multi-modal input validation, cross-modal attack detection, multi-modal output filtering and multi-modal policy enforcement."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Multi-Modal-Security-Kontrollen" : "4 Multi-Modal Security Controls"}</h2>
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
            <a href={`/${locale}/moltbot/llm-input-validation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Input Validation</div>
              <div className="text-sm text-gray-300">{isDE ? "Input-Safety" : "Input safety"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-adversarial-robustness`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Adversarial Robustness</div>
              <div className="text-sm text-gray-300">{isDE ? "Adversarial-Defense" : "Adversarial defense"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Multi-Modal-Overview" : "Multi-modal overview"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
