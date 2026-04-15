import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-bias-fairness-auditing"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "LLM Bias Fairness Auditing: LLM-Bias-Fairness-Auditing | ClawGuru Moltbot"
    : "LLM Bias Fairness Auditing: LLM Bias & Fairness Auditing | ClawGuru Moltbot"
  const description = isDE
    ? "LLM-Bias-Fairness-Auditing: Bias Detection, Fairness Metrics, Demographic Parity Testing und Bias Remediation für LLM-Bias-Fairness-Auditing und EU-KI-Gesetz-Compliance."
    : "LLM bias fairness auditing: bias detection, fairness metrics, demographic parity testing and bias remediation for LLM bias fairness auditing and EU AI Act compliance."
  return {
    title, description,
    keywords: ["llm bias fairness auditing", "bias detection llm", "fairness metrics ai", "demographic parity testing", "bias remediation", "eu ai act fairness"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "BFA-1", title: "Bias Detection", desc: "Detect bias in LLM outputs systematically. Test across demographic groups and use cases.", code: `# Moltbot bias detection:
bias_detection:
  enabled: true

  # Demographic Bias Testing:
  demographic:
    enabled: true
    # Test: outputs across demographic groups
    # Groups: gender, age, ethnicity, religion
    # Compare: output quality and sentiment
    # Detect: disparate treatment

  # Stereotype Detection:
  stereotypes:
    enabled: true
    # Test: model against stereotype benchmarks
    # Benchmarks: WinoBias, BBQ, CrowS-Pairs
    # Score: stereotype amplification rate
    # Alert: on high stereotype scores

  # Occupational Bias:
  occupational:
    enabled: true
    # Test: job-related outputs by demographics
    # Detect: gendered job associations
    # Measure: bias magnitude
    # Report: per-domain bias scores` },
  { id: "BFA-2", title: "Fairness Metrics", desc: "Measure fairness of LLM outputs using quantitative metrics. Track over time.", code: `# Moltbot fairness metrics:
fairness_metrics:
  enabled: true

  # Demographic Parity:
  demographic_parity:
    enabled: true
    # Measure: output distribution by group
    # Formula: P(Y=1|A=0) = P(Y=1|A=1)
    # Threshold: max 5% disparity
    # Alert: on threshold breach

  # Equal Opportunity:
  equal_opportunity:
    enabled: true
    # Measure: true positive rates by group
    # Formula: TPR equal across groups
    # Threshold: max 5% TPR difference
    # Alert: on threshold breach

  # Counterfactual Fairness:
  counterfactual:
    enabled: true
    # Test: same input, different demographics
    # Measure: output change magnitude
    # Target: minimal output changes
    # Report: counterfactual fairness score` },
  { id: "BFA-3", title: "Demographic Parity Testing", desc: "Run systematic demographic parity tests. Ensure equal treatment across protected groups.", code: `# Moltbot demographic parity testing:
parity_testing:
  enabled: true

  # Test Suites:
  test_suites:
    enabled: true
    # Suite 1: Hiring/Employment
    #   Input: identical resumes, different names
    #   Measure: output recommendation bias
    # Suite 2: Credit/Finance
    #   Input: identical profiles, different demographics
    #   Measure: approval recommendation bias
    # Suite 3: Healthcare
    #   Input: identical symptoms, different patients
    #   Measure: treatment recommendation bias

  # Automated Test Execution:
  automation:
    enabled: true
    # Schedule: weekly parity tests
    # Generate: test cases automatically
    # Compare: across all protected groups
    # Report: parity score trends

  # Threshold Enforcement:
  thresholds:
    enabled: true
    # Block: deployment if parity fails
    # Alert: on parity regression
    # Require: sign-off before release` },
  { id: "BFA-4", title: "Bias Remediation", desc: "Remediate detected bias in LLM systems. Apply prompt engineering, fine-tuning, and filtering.", code: `# Moltbot bias remediation:
bias_remediation:
  enabled: true

  # Prompt Engineering:
  prompt_engineering:
    enabled: true
    # Add: explicit fairness instructions
    # Example: "Provide equal consideration..."
    # Test: remediation effectiveness
    # Iterate: until parity achieved

  # Output Post-Processing:
  post_processing:
    enabled: true
    # Filter: biased outputs before serving
    # Rewrite: outputs with bias markers
    # Apply: calibration post-processing
    # Log: all remediations

  # Fine-Tuning:
  fine_tuning:
    enabled: true
    # Curate: balanced fine-tuning data
    # Apply: debiasing techniques
    # Evaluate: bias reduction effectiveness
    # Version: debiased model` },
]

const FAQ = [
  { q: "Why is LLM bias auditing a security concern?", a: "LLM bias is both an ethical and security/compliance concern: 1) EU AI Act — high-risk AI systems (hiring, credit, education, healthcare) must demonstrate non-discrimination. 2) Legal liability — biased AI decisions can violate anti-discrimination laws (GDPR, EEOC, ECHR). 3) Reputational risk — biased outputs cause public trust damage. 4) Regulatory fines — EU AI Act penalties up to 7% of global turnover for prohibited AI. 5) Security angle: bias can be intentionally injected via training data poisoning. Bias auditing is required for any AI system making decisions affecting people." },
  { q: "What are the most common types of LLM bias?", a: "Most common LLM bias types: 1) Representational bias — model underrepresents certain groups (fewer training examples). 2) Stereotyping — model amplifies societal stereotypes (nurses are female, CEOs are male). 3) Sentiment bias — model expresses more positive sentiment toward some groups. 4) Toxicity bias — model generates more toxic content about certain groups. 5) Occupational bias — model associates professions with demographics. 6) Geographic bias — model is better at tasks for some countries/languages. 7) Intersectional bias — bias compounds for people with multiple marginalized identities." },
  { q: "How often should I run LLM bias audits?", a: "Bias audit frequency: 1) Before every model update/fine-tune — model changes can introduce new biases. 2) Weekly automated parity tests — continuous monitoring for regression. 3) Quarterly comprehensive audit — full demographic parity and fairness metric evaluation. 4) After user complaints — investigate specific bias reports immediately. 5) Before high-risk deployment — e.g., before deploying in hiring or credit decisions. For EU AI Act high-risk systems, bias monitoring must be continuous and documented as part of post-market monitoring." },
  { q: "What tools exist for LLM bias auditing?", a: "Key tools for LLM bias auditing: 1) AI Fairness 360 (IBM) — comprehensive fairness metrics library. 2) Fairlearn (Microsoft) — fairness assessment and mitigation. 3) LangFair — LLM-specific fairness evaluation. 4) Perspective API — toxicity measurement. 5) WinoBias / BBQ — bias benchmarks for LLMs. 6) Evaluate (HuggingFace) — includes bias evaluation metrics. 7) Moltbot Bias Module — built-in continuous bias monitoring. For comprehensive auditing, combine automated tools with manual review by domain experts from diverse backgrounds." },
]

export default function LlmBiasFairnessAuditingPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Bias Fairness Auditing", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Bias-Fairness-Auditing-Guide für eigene LLM-Systeme." : "Bias fairness auditing guide for your own LLM systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 29</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "LLM Bias & Fairness Auditing" : "LLM Bias & Fairness Auditing"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Bias in LLMs ist kein akademisches Problem — EU-KI-Gesetz und Antidiskriminierungsgesetze machen es zum Compliance-Risiko. Vier Kontrollen: Bias Detection, Fairness Metrics, Demographic Parity Testing und Bias Remediation."
            : "Bias in LLMs is not an academic problem — EU AI Act and anti-discrimination laws make it a compliance risk. Four controls: bias detection, fairness metrics, demographic parity testing and bias remediation."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Bias-Fairness-Auditing-Kontrollen" : "4 Bias Fairness Auditing Controls"}</h2>
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
            <a href={`/${locale}/moltbot/llm-bias-detection-mitigation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Bias Detection Mitigation</div>
              <div className="text-sm text-gray-300">{isDE ? "Bias-Mitigation" : "Bias mitigation"}</div>
            </a>
            <a href={`/${locale}/solutions/eu-ai-act-compliance-checklist`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">EU AI Act Compliance Checklist</div>
              <div className="text-sm text-gray-300">{isDE ? "EU-KI-Gesetz" : "EU AI Act"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-hallucination-detection`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Hallucination Detection</div>
              <div className="text-sm text-gray-300">{isDE ? "Hallucination-Detection" : "Hallucination detection"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Security-Overview" : "Security overview"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
