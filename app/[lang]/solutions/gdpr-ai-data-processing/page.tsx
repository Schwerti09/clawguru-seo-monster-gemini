import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/gdpr-ai-data-processing"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "DSGVO & KI: Datenschutzkonforme KI-Datenverarbeitung | ClawGuru", "GDPR & AI: Privacy-Compliant AI Data Processing | ClawGuru")
  const description = pick(isDE, "DSGVO-konforme KI-Datenverarbeitung: Rechtsgrundlagen für LLM-Training, Verarbeitungsverzeichnis für KI-Systeme, Betroffenenrechte in LLM-Kontexten und Datenschutz-Folgenabschätzung für KI.", "GDPR-compliant AI data processing: legal basis for LLM training, records of processing for AI systems, data subject rights in LLM contexts and DPIA for AI systems.")
  return {
    title, description,
    keywords: ["gdpr ai data processing", "dsgvo ki datenverarbeitung", "gdpr llm compliance", "gdpr ai systems", "ai data protection", "dsgvo ki compliance"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const GDPR_REQUIREMENTS = [
  { art: "Art. 6", title: "Legal Basis for AI Data Processing", content: "Every AI system processing personal data needs a specific legal basis. The most applicable for enterprise AI: Legitimate interests (Art. 6(1)(f)): Internal AI tools processing employee data for productivity — conduct LIA (Legitimate Interest Assessment) documenting the balance test. Contract performance (Art. 6(1)(b)): Customer-facing AI that processes data to fulfill a service contract. Consent (Art. 6(1)(a)): Consumer AI chatbots processing personal conversations — obtain explicit consent, allow withdrawal. Avoid: claiming LI for customer-facing AI where the processing is unexpected or highly intrusive. Document: Moltbot's processing activities register should capture the legal basis per processing activity." },
  { art: "Art. 13/14", title: "Transparency & Information Obligations", content: "Users interacting with AI systems must be informed: At point of collection: that an AI system processes their data, what data is processed and why, retention periods, any third-party LLM providers. For AI-specific transparency: if the AI makes automated decisions with significant effects (Art. 22), users have the right to: human review, explanation of the logic, contest the decision. Implementation: add AI disclosure to privacy notice, include in chatbot welcome message, document in DPA with cloud LLM providers. Moltbot: configure disclosure banner on all AI interaction interfaces." },
  { art: "Art. 17", title: "Right to Erasure in AI Systems", content: "The right to erasure creates specific challenges for AI: Conversation history: delete all stored conversation logs containing that user's data. RAG corpus: if documents containing the user's personal data were indexed, remove and re-index without that content. Fine-tuning data: if the model was fine-tuned on data containing the user's information — complex, may require model retraining. LLM memorization: foundation models may have memorized training data — no technical erasure possible (document this limitation in the privacy notice). Practical approach: keep detailed data lineage — know exactly where personal data enters AI systems. Implement erasure workflows for: conversation stores, vector databases, fine-tuning datasets. Moltbot's erasure API automates conversation and RAG corpus deletion." },
  { art: "Art. 25", title: "Privacy by Design for AI Systems", content: "Build privacy into AI system architecture from day one: Data minimization: configure AI to process only minimum required data (don't log full conversations if session hash is sufficient). Storage limitation: define and enforce retention periods for all AI data stores. Access control: minimum privilege for all components that touch personal data. Separation: AI audit logs should contain metadata (hashes) not raw personal data. Pseudonymization: replace user identifiers with pseudonyms in AI training data. Default settings: opt-out of data retention by default (opt-in for personalization features). Architecture review: DPIA (Art. 35) required before deploying high-risk AI systems." },
  { art: "Art. 28", title: "Data Processing Agreements for LLM Providers", content: "Using cloud LLM APIs (OpenAI, Anthropic, Azure OpenAI) requires a DPA with each provider. Key DPA clauses to verify: Data not used for training: confirm in the DPA that your prompts and outputs are not used to train future models (all major providers offer this via API). Data residency: confirm EU data stays in EU (requires EU-region API endpoints). Sub-processor list: obtain and review the provider's sub-processor list. Data retention: confirm the provider's retention period for your data. Breach notification: confirm the provider will notify you within 72 hours of a breach affecting your data. Action: download and sign DPAs with all cloud LLM providers before going live. Store DPAs with your vendor management documentation." },
  { art: "Art. 35", title: "DPIA for High-Risk AI Processing", content: "A Data Protection Impact Assessment is mandatory before deploying AI that: processes personal data at large scale, uses profiling or automated decision-making, processes sensitive data (health, biometric, financial), systematically monitors individuals. DPIA components for AI: Description: what data, what AI model, what processing purpose. Necessity and proportionality: is AI necessary or could less privacy-invasive means achieve the goal? Risk assessment: data breach, discrimination, loss of control, model hallucination creating false records. Mitigation measures: encryption, access control, human oversight, model output validation. Residual risks: after mitigations, document remaining risks and rationale for proceeding. Consult DPA: if residual risks are high, consult your national data protection authority before deployment." },
]

const FAQ = [
  { q: "Can I use personal data to fine-tune AI models under GDPR?", a: "Yes, but with significant constraints: Legal basis: you need a valid GDPR legal basis (most likely: legitimate interest with LIA, or consent). Consent is required if the data subjects would not reasonably expect their data to be used for AI training. Purpose limitation: the fine-tuning purpose must be compatible with the original collection purpose. If data was collected for customer service and you fine-tune an AI on it, document the compatibility assessment. Data minimization: fine-tune on the minimum data necessary — pseudonymize or anonymize where possible. Erasure: implement a process to remove a data subject's contribution from the training dataset on erasure request — this may require model retraining. Data retention: define how long you retain training datasets and implement deletion. Safe option: fine-tune only on synthetic or fully anonymized data — eliminates most GDPR complexity." },
  { q: "Do I need to disclose to users that they are interacting with an AI?", a: "Under GDPR Art. 13/14 (transparency) and increasingly under national AI transparency laws: Yes — you must disclose AI processing in the privacy notice, including the purpose and legal basis. For automated decision-making with significant effects (credit scoring, hiring, medical diagnosis): Art. 22 applies — inform users of the logic, right to human review, and right to contest. EU AI Act (from 2026): chatbots must disclose they are AI systems unless the context makes it obvious. Best practice: add a clear disclosure at the start of every AI interaction ('You are chatting with an AI assistant'), include in privacy notice with specifics (which model, which provider, what data is processed), document the disclosure in your records of processing." },
  { q: "What is the legal basis for using employee data in AI systems?", a: "Employee data in AI systems requires careful legal basis selection: Internal productivity tools (summarization, drafting): Legitimate interest (Art. 6(1)(f)) — document the LIA showing business need outweighs privacy impact. Implement: minimize data logged, short retention, inform employees via works council/employee handbook. Performance monitoring AI: in most EU jurisdictions, this requires works council agreement (Betriebsrat in Germany — §87 BetrVG). Legitimate interest alone is insufficient for systematic employee monitoring. Consent: generally not appropriate as a legal basis for employee processing — employees cannot freely consent to employer data processing (power imbalance). Contractual necessity: AI tools that are genuinely necessary for the employment contract (e.g., remote work monitoring tools explicitly in employment contract)." },
  { q: "How do I handle GDPR data subject access requests (DSARs) for AI systems?", a: "DSARs for AI systems require extending your DSAR process: Identify all AI data stores containing personal data: conversation logs, vector store entries (RAG corpus with personal info), fine-tuning datasets, AI audit logs. Provide in DSAR response: what personal data is processed by AI systems, the purposes and legal basis, retention periods, any automated decisions made about the data subject and their logic. Technical challenges: conversation logs: searchable by user_id — manageable. RAG corpus: may contain the data subject's documents — requires search by name/identifier. Fine-tuning data: may include their communications — requires dataset audit. Model memorization: you cannot provide model weights — document in DSAR response that the model may have been trained on publicly available data. Timeline: 30 days to respond (extendable to 90 days for complex requests). Use Moltbot's data lineage tools to map all personal data flows through AI systems." },
]

export default function GdprAiDataProcessingPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "GDPR AI Data Processing", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "DSGVO-Compliance-Guide für eigene KI-Systeme. Keine Rechtsberatung.", "GDPR compliance guide for your own AI systems. Not legal advice.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · Batch 7</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "DSGVO & KI: Datenschutzkonforme KI-Datenverarbeitung", "GDPR & AI: Privacy-Compliant AI Data Processing")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "KI-Systeme schaffen neue DSGVO-Herausforderungen: Rechtsgrundlagen für LLM-Training, Erasure-Recht in Vektordatenbanken und DPIA für Hochrisiko-KI. Sechs Artikel-Mappings mit konkreten Umsetzungsmaßnahmen.", "AI systems create new GDPR challenges: legal basis for LLM training, erasure rights in vector databases and DPIA for high-risk AI. Six article mappings with concrete implementation measures.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "6 DSGVO-Artikel für KI-Systeme", "6 GDPR Articles for AI Systems")}</h2>
          <div className="space-y-4">
            {GDPR_REQUIREMENTS.map((r) => (
              <div key={r.art} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{r.art}</span>
                  <span className="font-semibold text-gray-100">{r.title}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{r.content}</p>
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
            <a href={`/${locale}/solutions/eu-ai-act-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">EU AI Act Compliance</div>
              <div className="text-sm text-gray-300">{pick(isDE, "DSGVO + EU AI Act Synergie", "GDPR + EU AI Act synergy")}</div>
            </a>
            <a href={`/${locale}/solutions/dsgvo-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">DSGVO Compliance Automation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Automatisierte DSGVO-Kontrollen", "Automated GDPR controls")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-context-isolation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Context Isolation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Datentrennung in KI", "Data separation in AI")}</div>
            </a>
            <a href={`/${locale}/moltbot/agent-memory-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Agent Memory Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "DSGVO-Löschung im KI-Speicher", "GDPR erasure in AI memory")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
