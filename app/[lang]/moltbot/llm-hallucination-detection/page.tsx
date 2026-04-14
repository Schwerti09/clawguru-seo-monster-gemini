import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-hallucination-detection"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "LLM Hallucination Detection: LLM-Halluzination-Detection | ClawGuru Moltbot"
    : "LLM Hallucination Detection: LLM Hallucination Detection | ClawGuru Moltbot"
  const description = isDE
    ? "LLM-Halluzination-Detection: Fact-Checking Models, Consistency Verification, Confidence Scoring und Hallucination Mitigation für LLM-Halluzination-Erkennung."
    : "LLM hallucination detection: fact-checking models, consistency verification, confidence scoring and hallucination mitigation for LLM hallucination detection."
  return {
    title, description,
    keywords: ["llm hallucination detection", "fact-checking", "consistency verification", "confidence scoring", "hallucination mitigation", "moltbot hallucination"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "HD-1", title: "Fact-Checking Models", desc: "Use fact-checking models to verify factual claims in LLM outputs. Compare outputs against trusted knowledge bases and flag inconsistencies.", code: `# Moltbot fact-checking models:
fact_checking:
  enabled: true

  # Fact-checking models:
  models:
    # Claim extraction:
    claim_extractor:
      enabled: true
      model: "claim-extractor-v1"
      # Extract factual claims from LLM output
      # Example: "Paris is the capital of France" -> claim: "Paris is the capital of France"

    # Fact verifier:
    fact_verifier:
      enabled: true
      model: "fact-verifier-v1"
      # Verify claims against knowledge base
      # Knowledge base: Wikipedia, trusted sources
      # Output: true (fact) or false (hallucination)

  # Knowledge base:
  knowledge_base:
    # Trusted sources for fact-checking:
    sources:
      - wikipedia
      - wikidata
      - internal_knowledge_base
      # Add custom knowledge bases as needed` },
  { id: "HD-2", title: "Consistency Verification", desc: "Verify consistency within and across LLM outputs. Check for contradictions, logical inconsistencies, and factual inconsistencies.", code: `# Moltbot consistency verification:
consistency_verification:
  enabled: true

  # Internal consistency:
  internal:
    enabled: true
    # Check for contradictions within output
    # Example: "X is true" and "X is false" in same output
    # Check: logical consistency, factual consistency

  # Cross-output consistency:
  cross_output:
    enabled: true
    # Check for contradictions across outputs
    # Example: "X is true" in output 1, "X is false" in output 2
    # Check: consistency across conversation history

  # Consistency with context:
  context_consistency:
    enabled: true
    # Check for consistency with provided context
    # Example: RAG context says "X is true", output says "X is false"
    # Check: output aligns with provided context

  # Verification action:
  action:
    # Flag inconsistent outputs
    # Provide explanation of inconsistency
    # Suggest correction
    enabled: true` },
  { id: "HD-3", title: "Confidence Scoring", desc: "Score LLM outputs based on confidence. Use model logits, ensemble methods, and uncertainty quantification to estimate confidence.", code: `# Moltbot confidence scoring:
confidence_scoring:
  enabled: true

  # Logit-based scoring:
  logit_scoring:
    enabled: true
    # Use model logits to estimate confidence
    # High entropy logits -> low confidence
    # Low entropy logits -> high confidence
    # Method: softmax probability, entropy calculation

  # Ensemble scoring:
  ensemble_scoring:
    enabled: true
    # Use ensemble of models to estimate confidence
    # If models disagree -> low confidence
    # If models agree -> high confidence
    # Method: variance across ensemble predictions

  # Uncertainty quantification:
  uncertainty:
    enabled: true
    # Quantify uncertainty in predictions
    # Methods: Monte Carlo dropout, Bayesian neural networks
    # Output: uncertainty score (0-1)

  # Scoring threshold:
  threshold:
    # Low confidence threshold
    # If confidence < threshold: flag as potential hallucination
    low_confidence_threshold: 0.6` },
  { id: "HD-4", title: "Hallucination Mitigation", desc: "Mitigate hallucinations using retrieval-augmented generation, chain-of-thought prompting, and post-processing correction.", code: `# Moltbot hallucination mitigation:
hallucination_mitigation:
  enabled: true

  # Retrieval-augmented generation (RAG):
  rag:
    enabled: true
    # Use RAG to ground outputs in retrieved facts
    # Retrieve relevant documents from knowledge base
    # Include retrieved context in prompt
    # Reduces hallucination by providing factual grounding

  # Chain-of-thought prompting:
  cot_prompting:
    enabled: true
    # Use chain-of-thought prompting to improve reasoning
    # Prompt: "Think step by step before answering"
    # Reduces hallucination by encouraging reasoning

  # Post-processing correction:
  post_processing:
    enabled: true
    # Correct hallucinations after generation
    # Use fact-checking to identify hallucinations
    # Replace hallucinated content with factual content
    # Or flag for human review` },
]

const FAQ = [
  { q: "What is the difference between fact-checking and consistency verification?", a: "Fact-checking verifies factual claims against an external knowledge base (Wikipedia, trusted sources). It answers the question \"is this claim factually true?\". Consistency verification checks for contradictions within and across outputs, and with provided context. It answers the question \"is this output consistent with itself and the context?\". Both are necessary: fact-checking ensures factual accuracy, consistency verification ensures logical coherence. Example: Fact-checking verifies \"Paris is the capital of France\" against Wikipedia. Consistency verification checks that the output doesn't say both \"X is true\" and \"X is false\"." },
  { q: "How does confidence scoring help detect hallucinations?", a: "Confidence scoring estimates how confident the model is in its output. Low confidence often correlates with hallucination because the model is unsure about the answer. Confidence can be estimated from model logits (high entropy = low confidence), ensemble methods (disagreement between models = low confidence), or uncertainty quantification (Monte Carlo dropout, Bayesian methods). By flagging low-confidence outputs, you can identify potential hallucinations for further review or correction. However, confidence scoring is not perfect — models can be confidently wrong (overconfident hallucinations) or uncertain but correct." },
  { q: "How does RAG reduce hallucinations?", a: "RAG (Retrieval-Augmented Generation) reduces hallucinations by grounding the model's output in retrieved facts. Instead of relying solely on the model's internal knowledge, RAG retrieves relevant documents from a knowledge base and includes them in the prompt. The model can then reference these facts in its output, reducing the likelihood of hallucination. RAG is particularly effective for factual questions where the knowledge base contains accurate, up-to-date information. However, RAG is not a silver bullet — if the retrieved documents are incorrect or irrelevant, the model may still hallucinate. Additionally, RAG adds latency and complexity to the system." },
  { q: "What are the limitations of hallucination detection?", a: "Hallucination detection has several limitations: 1) False positives — fact-checking may flag correct outputs as hallucinations if the knowledge base is outdated or incorrect. 2) False negatives — models can be confidently wrong (overconfident hallucinations) that evade detection. 3) Knowledge base limitations — fact-checking is limited by the coverage and accuracy of the knowledge base. 4) Subjectivity — some claims are subjective or opinion-based, making fact-checking difficult. 5) Latency — fact-checking and consistency verification add latency to the generation process. 6) Cost — ensemble methods and uncertainty quantification increase computational cost." },
]

export default function LlmHallucinationDetectionPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Hallucination Detection", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Halluzination-Detection-Guide für eigene KI-Systeme." : "Hallucination detection guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 19</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "LLM Hallucination Detection" : "LLM Hallucination Detection"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "LLM-Halluzinationen ohne Detection können zu falschen Informationen und Reputationsschäden führen. Vier Kontrollen: Fact-Checking Models, Consistency Verification, Confidence Scoring und Hallucination Mitigation."
            : "LLM hallucinations without detection can lead to misinformation and reputation damage. Four controls: fact-checking models, consistency verification, confidence scoring and hallucination mitigation."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Halluzination-Detection-Kontrollen" : "4 Hallucination Detection Controls"}</h2>
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
            <a href={`/${locale}/moltbot/llm-output-validation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Output Validation</div>
              <div className="text-sm text-gray-300">{isDE ? "Output-Verification" : "Output verification"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-context-window-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Context Window Security</div>
              <div className="text-sm text-gray-300">{isDE ? "RAG-Kontext" : "RAG context"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-prompt-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Prompt Hardening</div>
              <div className="text-sm text-gray-300">{isDE ? "Chain-of-Thought" : "Chain-of-thought"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Halluzination-Overview" : "Hallucination overview"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
