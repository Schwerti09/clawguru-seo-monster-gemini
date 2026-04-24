import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/iso27001-ai-systems"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "ISO 27001 für KI-Systeme: Annex A Controls & AI-spezifische Anforderungen | ClawGuru", "ISO 27001 for AI Systems: Annex A Controls & AI-Specific Requirements | ClawGuru")
  const description = pick(isDE, "ISO 27001:2022 Implementierungsleitfaden für KI-Systeme: Annex A Controls für LLMs, AI-Agenten und ML-Pipelines. Gap-Analyse, Control-Mapping und Audit-Evidenz mit Moltbot und OpenClaw.", "ISO 27001:2022 implementation guide for AI systems: Annex A controls for LLMs, AI agents and ML pipelines. Gap analysis, control mapping and audit evidence with Moltbot and OpenClaw.")
  return {
    title, description,
    keywords: ["iso 27001 ai systems", "iso 27001 llm", "iso 27001 machine learning", "iso 27001 ai compliance", "annex a ai controls", "iso 27001 2022 ai"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROL_MAPPINGS = [
  { control: "A.5.23", title: "Information security for use of cloud services", aiContext: "LLM API providers (OpenAI, Anthropic, Azure OpenAI) are cloud services. Document: data classification sent to each provider, contractual security obligations, exit strategy.", tooling: "Moltbot: log all API calls with data classification tags. OpenClaw: cloud provider risk register." },
  { control: "A.5.37", title: "Documented operating procedures", aiContext: "AI systems require documented procedures for: model updates, prompt changes, incident response for AI-specific incidents, RAG corpus updates.", tooling: "Moltbot: automated runbook execution + audit trail. Evidence auto-generated for auditors." },
  { control: "A.8.8", title: "Management of technical vulnerabilities", aiContext: "Extends to: ML framework CVEs (TensorFlow, PyTorch), LLM provider API deprecations, model version end-of-life. Track AI-specific vulnerability databases.", tooling: "OpenClaw: CVE feed with ML framework coverage. Moltbot: model version lifecycle tracking." },
  { control: "A.8.9", title: "Configuration management", aiContext: "AI configuration includes: system prompts (version-controlled), model parameters (temperature, top-p), RAG configuration, tool permissions. All must be version-controlled.", tooling: "Git-controlled prompt versions. Moltbot config stored in IaC (Terraform/Helm). Diff alerts on changes." },
  { control: "A.8.10", title: "Information deletion", aiContext: "GDPR Art. 17 + ISO 27001 convergence: LLM conversation history, fine-tuning data containing personal data, RAG corpus entries must be deletable on request.", tooling: "Moltbot: GDPR erasure API for conversation context. Vector store soft-delete + hard-delete pipeline." },
  { control: "A.8.16", title: "Monitoring activities", aiContext: "AI-specific monitoring: prompt injection attempts, unusual output patterns, token usage anomalies, model behavior drift. Standard SIEM insufficient — needs LLM-aware alerting.", tooling: "Moltbot LLM Observability: anomaly detection on token patterns. OpenClaw: alert routing to SIEM." },
  { control: "A.8.25", title: "Secure development lifecycle", aiContext: "AI-specific SDL additions: adversarial testing (red-teaming), prompt injection testing in CI/CD, model card documentation, bias assessment before production deployment.", tooling: "Moltbot AI red-teaming in CI. OpenClaw: security gate before model promotion to production." },
  { control: "A.8.28", title: "Secure coding", aiContext: "For AI-adjacent code: secure handling of LLM responses (never eval/exec), parameterized tool calls (not string concatenation), output encoding before rendering.", tooling: "OpenClaw SAST rules for AI-adjacent code patterns. Moltbot SDK enforces safe output handling." },
]

const FAQ = [
  { q: "Does ISO 27001:2022 specifically address AI systems?", a: "ISO 27001:2022 (updated from 2013) added 11 new controls in Annex A, several of which directly apply to AI systems: A.5.23 (cloud services security — covers LLM API providers), A.8.9 (configuration management — covers prompt version control), A.8.10 (information deletion — covers AI training data and conversation history deletion). Additionally: ISO/IEC 42001:2023 is the dedicated AI Management System standard (analogous to ISO 27001 for information security). Organizations running AI at scale should consider pursuing ISO 42001 certification alongside ISO 27001. ClawGuru's Moltbot provides evidence collection for both standards." },
  { q: "What audit evidence do I need for AI systems under ISO 27001?", a: "Key evidence categories for AI systems: 1) Asset inventory: register of all AI models, LLM API endpoints, training datasets, vector stores. 2) Risk assessment: documented AI-specific risks (prompt injection, model poisoning, data leakage) with treatment decisions. 3) Configuration records: version history of system prompts, model parameters, tool permissions. 4) Access control records: who can modify AI configurations, model deployment approvals. 5) Monitoring records: LLM observability data showing anomaly detection is active. 6) Incident records: any AI-specific incidents (prompt injection attempts, unexpected outputs) and responses. 7) Supplier assessment: security assessment of LLM API providers (OpenAI, Anthropic SOC 2 reports, data processing agreements). Moltbot auto-generates most of this evidence." },
  { q: "How do I handle the ISO 27001 asset inventory for AI components?", a: "AI asset inventory extensions beyond standard IT assets: Primary assets: AI model files (with version, hash, source), training datasets (with classification, retention policy), vector store contents (classified by sensitivity). Supporting assets: LLM API integrations (provider, endpoint, authentication method, data sent), AI orchestration frameworks (LangChain, Moltbot — version, configuration), Prompt templates (in version control with change history). Third-party services: all external model providers with their DPA (Data Processing Agreement) status, jurisdictions where data is processed, and audit report references (SOC 2, ISO 27001). OpenClaw's asset inventory module supports AI-specific asset types with all required metadata fields." },
  { q: "What is the biggest ISO 27001 gap for organizations adopting AI?", a: "The most common gap: A.8.10 Information Deletion for AI systems. Most organizations have GDPR deletion processes for databases and file systems — but have not extended them to: LLM conversation histories stored in Redis/PostgreSQL, Fine-tuning datasets containing personal data, Vector store entries in Pinecone/Weaviate/pgvector (deletion is non-trivial in vector databases), Model weights that may have memorized personal data from training. ISO 27001 auditors are now actively asking about deletion procedures for AI-specific data stores. Implement before your next surveillance audit — Moltbot's GDPR erasure API covers conversation history and RAG corpus deletion." },
]

export default function Iso27001AiSystemsPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "ISO 27001 AI Systems", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "ISO-27001-Compliance-Leitfaden für eigene KI-Systeme.", "ISO 27001 compliance guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · Batch 6</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "ISO 27001 für KI-Systeme", "ISO 27001 for AI Systems")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "ISO 27001:2022 deckt KI-Systeme nicht vollständig ab — aber die neuen Annex-A-Controls sind direkt anwendbar. 8 kritische Control-Mappings, Audit-Evidenz und die häufigsten Gaps bei KI-Deployments.", "ISO 27001:2022 doesn't fully address AI systems — but the new Annex A controls apply directly. 8 critical control mappings, audit evidence and the most common gaps in AI deployments.")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "8", label: pick(isDE, "Annex-A-Controls", "Annex A controls") },
            { value: "2022", label: pick(isDE, "ISO-Version", "ISO version") },
            { value: "42001", label: pick(isDE, "AI-spezifisch", "AI-specific") },
            { value: "Auto", label: pick(isDE, "Audit-Evidenz", "Audit evidence") },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "ISO 27001 Annex A — AI Control Mapping", "ISO 27001 Annex A — AI Control Mapping")}</h2>
          <div className="space-y-3">
            {CONTROL_MAPPINGS.map((c) => (
              <div key={c.control} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{c.control}</span>
                  <span className="font-semibold text-gray-100 text-sm">{c.title}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2"><strong className="text-gray-100">AI Context:</strong> {c.aiContext}</p>
                <p className="text-xs text-cyan-400"><strong>Tooling:</strong> {c.tooling}</p>
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
            <a href={`/${locale}/solutions/iso27001-certification-roadmap`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">ISO 27001 Roadmap</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Zertifizierungsfahrplan", "Certification roadmap")}</div>
            </a>
            <a href={`/${locale}/solutions/eu-ai-act-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">EU AI Act Compliance</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Risk-Klassen & Anforderungen", "Risk classes & requirements")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Compliance Automation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Automatische Evidenz-Sammlung", "Automated evidence collection")}</div>
            </a>
            <a href={`/${locale}/solutions/soc2-type-ii-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">SOC 2 Type II Automation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "SOC 2 + ISO 27001 Synergie", "SOC 2 + ISO 27001 synergy")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
