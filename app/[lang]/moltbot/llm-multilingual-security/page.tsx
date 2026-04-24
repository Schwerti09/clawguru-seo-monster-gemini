import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-multilingual-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Multilingual Security: LLM-Mehrsprachige-Sicherheit | ClawGuru Moltbot", "LLM Multilingual Security: LLM Multilingual Security | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-Mehrsprachige-Sicherheit: Cross-Language Injection Defense, Multilingual Content Filtering, Language-Specific Bias Detection und Multilingual Audit Logging für LLM-Mehrsprachige-Sicherheit.", "LLM multilingual security: cross-language injection defense, multilingual content filtering, language-specific bias detection and multilingual audit logging for LLM multilingual security.")
  return {
    title, description,
    keywords: ["llm multilingual security", "cross-language injection defense", "multilingual content filtering", "language bias detection", "multilingual audit logging", "moltbot multilingual"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "MLS-1", title: "Cross-Language Injection Defense", desc: "Defend against prompt injection attacks delivered in non-English languages. Most filters are English-only.", code: `# Moltbot cross-language injection defense:
cross_language_injection:
  enabled: true

  # Multi-Language Pattern Detection:
  patterns:
    enabled: true
    # Detect: injection patterns in all languages
    # Languages: DE, EN, FR, ES, ZH, JA, AR, RU
    # Patterns: "Ignoriere vorherige Anweisungen"
    # Update: patterns regularly per language

  # Translation-Based Defense:
  translation:
    enabled: true
    # Translate: input to English for analysis
    # Apply: English injection detection
    # Block: if injection detected post-translation
    # Log: cross-language attack attempts

  # Unicode/Encoding Defense:
  encoding:
    enabled: true
    # Normalize: Unicode before processing
    # Detect: homoglyph attacks
    # Detect: zero-width character injection
    # Detect: RTL override attacks` },
  { id: "MLS-2", title: "Multilingual Content Filtering", desc: "Filter harmful content across all supported languages. Do not rely on English-only filters.", code: `# Moltbot multilingual content filtering:
multilingual_filtering:
  enabled: true

  # Per-Language Content Policies:
  policies:
    enabled: true
    # Apply: same content policy across all languages
    # Adapt: culturally sensitive content per locale
    # Update: policies as regulations change
    # Test: per-language filter effectiveness

  # Toxicity Detection:
  toxicity:
    enabled: true
    # Detect: toxic content in all languages
    # Tools: multilingual models (mBERT, XLM-R)
    # Threshold: consistent across languages
    # Alert: on high toxicity scores

  # Hate Speech Detection:
  hate_speech:
    enabled: true
    # Detect: hate speech per language context
    # Account: for cultural differences
    # Block: globally prohibited content
    # Log: all hate speech detections` },
  { id: "MLS-3", title: "Language-Specific Bias Detection", desc: "Detect bias that manifests differently in different languages. English bias tests miss non-English bias.", code: `# Moltbot language-specific bias detection:
language_bias:
  enabled: true

  # Per-Language Bias Testing:
  testing:
    enabled: true
    # Test: bias in each supported language
    # Use: language-native test datasets
    # Languages: native speaker reviewed
    # Report: per-language bias scores

  # Gendered Language:
  gendered:
    enabled: true
    # Handle: grammatically gendered languages (DE, FR, ES)
    # Test: gendered noun bias
    # Detect: grammatical gender amplifying bias
    # Remediate: with neutral alternatives

  # Cultural Bias:
  cultural:
    enabled: true
    # Detect: culturally specific biases
    # Test: with local cultural context
    # Review: by native speakers
    # Update: bias tests per culture` },
  { id: "MLS-4", title: "Multilingual Audit Logging", desc: "Log AI interactions in all languages with consistent audit trail. Enable cross-language forensics.", code: `# Moltbot multilingual audit logging:
multilingual_audit:
  enabled: true

  # Language-Tagged Logs:
  language_tags:
    enabled: true
    # Tag: each log entry with detected language
    # Include: original text + language ID
    # Normalize: to UTF-8 encoding
    # Preserve: original characters

  # Cross-Language Search:
  search:
    enabled: true
    # Enable: log search across languages
    # Translate: queries to search logs
    # Index: content in original language
    # Support: regex + semantic search

  # Regulatory Compliance:
  compliance:
    enabled: true
    # GDPR: store logs in EU
    # Translate: regulatory reports as needed
    # Retain: per jurisdiction requirements
    # Export: in required formats` },
]

const FAQ = [
  { q: "Why is multilingual security a specific concern for LLMs?", a: "Multilingual security is critical because: 1) Most security filters are English-centric — attackers switch to other languages to bypass them. 2) LLMs have unequal capability across languages — security may be weaker in low-resource languages. 3) Grammatically gendered languages create additional bias vectors. 4) Cultural context affects what constitutes harmful content. 5) Cross-language attacks use translation as an obfuscation layer. 6) Regulations vary by jurisdiction — GDPR, EU AI Act, local laws may have language-specific requirements." },
  { q: "What are the most common cross-language injection attacks?", a: "Most common cross-language injection attacks: 1) Direct translation — same injection in another language (German: 'Ignoriere deine vorherigen Anweisungen'). 2) Mixed-language — English base with key phrases in another language. 3) Transliteration — phonetic transcription bypasses keyword filters. 4) Script switching — Arabic, Chinese, or Cyrillic to bypass Latin script filters. 5) Unicode obfuscation — homoglyphs that look like Latin characters. 6) Low-resource language attacks — languages where model safety training is weakest. Defense: translate inputs before applying injection detection." },
  { q: "How do I test multilingual security for my LLM?", a: "Test multilingual security by: 1) Run your full injection test suite in each supported language. 2) Use native speakers to craft natural-sounding attacks (translators miss cultural nuance). 3) Test all bypass techniques: script switching, mixed language, transliteration. 4) Run bias tests with language-native datasets (not translated English datasets). 5) Test content filter consistency across languages — same harmful content should be blocked in all languages. 6) Check for language-specific jailbreaks (some models have weaker safety in specific languages). Budget for quarterly multilingual security testing." },
  { q: "How does grammatical gender in European languages affect LLM bias?", a: "Grammatically gendered languages (German, French, Spanish, etc.) create unique bias challenges: 1) Occupational nouns — in German, 'Arzt' (male doctor) vs 'Ärztin' (female doctor). Models may default to masculine forms. 2) Default gender assumptions — when generating text about professionals, models may default to masculine grammar. 3) Gendered pronouns — models may assign incorrect genders. 4) Translation bias — translating between gendered/non-gendered languages amplifies bias. Mitigation: use gender-neutral forms where available (e.g., German gender star: Ärzt*in), test explicitly with feminine/diverse inputs, use language-native bias benchmarks." },
]

export default function LlmMultilingualSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Multilingual Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Multilingual-Security-Guide für eigene LLM-Systeme.", "Multilingual security guide for your own LLM systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 29</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "LLM Multilingual Security", "LLM Multilingual Security")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Die meisten Security-Filter sind English-only — Angreifer wechseln einfach die Sprache. Vier Kontrollen: Cross-Language Injection Defense, Multilingual Content Filtering, Language-Specific Bias Detection und Multilingual Audit Logging.", "Most security filters are English-only — attackers simply switch the language. Four controls: cross-language injection defense, multilingual content filtering, language-specific bias detection and multilingual audit logging.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Multilingual-Security-Kontrollen", "4 Multilingual Security Controls")}</h2>
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
            <a href={`/${locale}/moltbot/llm-prompt-injection-detection`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Prompt Injection Detection</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Injection-Detection", "Injection detection")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-bias-fairness-auditing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Bias Fairness Auditing</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Bias-Auditing", "Bias auditing")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-output-filtering`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Output Filtering</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Output-Filtering", "Output filtering")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Security-Overview", "Security overview")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
