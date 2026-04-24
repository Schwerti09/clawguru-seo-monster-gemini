import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot-vs-haystack"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "Moltbot vs Haystack: Sicheres AI-Agent-Framework vs NLP-Pipeline | ClawGuru", "Moltbot vs Haystack: Secure AI Agent Framework vs NLP Pipeline | ClawGuru")
  const description = pick(isDE, "Moltbot vs Haystack Vergleich: Security-First AI-Agent-Orchestrierung vs flexibler NLP-Pipeline-Builder. Prompt Injection Defense, RBAC, RAG-Security und Self-Hosted-Betrieb im Direktvergleich.", "Moltbot vs Haystack comparison: security-first AI agent orchestration vs flexible NLP pipeline builder. Prompt injection defense, RBAC, RAG security and self-hosted operation in direct comparison.")
  return {
    title, description,
    keywords: ["moltbot vs haystack", "haystack alternative", "haystack security", "ai agent framework comparison", "moltbot haystack", "haystack rag security"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Primary focus", moltbot: "Security-first AI agent orchestration", haystack: "Flexible NLP pipeline building (RAG, QA, search)" },
  { feature: "Prompt injection defense", moltbot: "Built-in: instruction hierarchy, input sanitization, output validation", haystack: "No built-in defense — must implement manually" },
  { feature: "Agent RBAC", moltbot: "Native role-based tool access control", haystack: "No RBAC — all pipeline components have equal access" },
  { feature: "Multi-model trust boundaries", moltbot: "Configurable trust levels per model in pipeline", haystack: "No trust model — all nodes trusted equally" },
  { feature: "Audit logging", moltbot: "HMAC-signed, append-only, all tool calls + LLM interactions", haystack: "Basic logging — no integrity guarantees" },
  { feature: "RAG security", moltbot: "Tenant isolation, content scanning, untrusted-doc wrapping", haystack: "No built-in RAG content security controls" },
  { feature: "Self-hosted", moltbot: "✓ — designed for self-hosted first", haystack: "✓ — open source, self-hostable" },
  { feature: "Pipeline flexibility", moltbot: "Structured agent workflows with security gates", haystack: "Highly flexible DAG-based pipelines" },
  { feature: "LLM provider support", moltbot: "OpenAI, Anthropic, self-hosted (Ollama, vLLM)", haystack: "Wide: OpenAI, Cohere, HuggingFace, self-hosted" },
  { feature: "Compliance automation", moltbot: "SOC 2, ISO 27001, GDPR evidence collection built-in", haystack: "No compliance tooling" },
  { feature: "Incident response", moltbot: "AI incident response playbooks + automatic containment", haystack: "No incident response capabilities" },
  { feature: "Secret management", moltbot: "Vault integration, K8s secrets, credential rotation", haystack: "Manual — user responsibility" },
]

const FAQ = [
  { q: "What is Haystack and what is it primarily used for?", a: "Haystack (by deepset) is an open-source NLP/AI framework primarily designed for building: Retrieval-Augmented Generation (RAG) pipelines, document search and question answering systems, semantic search applications. It uses a pipeline abstraction (DAG-based) where components (retrievers, readers, generators) are chained together. Haystack is strong on flexibility and NLP capabilities but was not designed with enterprise security controls as a primary goal. It excels for data science teams building search and RAG applications; Moltbot is designed for security teams deploying AI agents in regulated environments." },
  { q: "Can Haystack be made secure enough for production AI agents?", a: "Yes, but it requires significant security engineering on top: 1) Prompt injection defense must be implemented manually as Haystack pipeline components. 2) RBAC for pipeline operations must be built externally. 3) Audit logging must be added as custom components. 4) RAG security (tenant isolation, content scanning) must be built into retriever components. 5) Secret management must be handled by the deployment layer (K8s secrets, Vault). This is feasible but puts the security burden on the development team. Moltbot provides these as first-class features, reducing time-to-secure-production from months to days." },
  { q: "Is Moltbot compatible with Haystack's RAG capabilities?", a: "Moltbot and Haystack can be used together: Haystack handles the RAG pipeline (document processing, embedding, retrieval) while Moltbot provides the security layer (input validation, output filtering, audit logging, agent RBAC). Architecture: User input → Moltbot (input validation) → Haystack RAG pipeline → Moltbot (output validation + audit) → User response. This gives you Haystack's mature RAG capabilities with Moltbot's security controls. Alternatively, Moltbot's native RAG integration supports Pinecone, Weaviate, pgvector, Qdrant for simpler deployments that don't need Haystack's full pipeline flexibility." },
  { q: "Which framework handles multi-tenant deployments better?", a: "Moltbot. Multi-tenant security is a first-class feature: per-tenant context isolation with cryptographic key separation, tenant-scoped RAG namespaces (retrieved documents isolated per tenant), RBAC roles assignable per tenant, audit logs partitioned by tenant for compliance reporting. Haystack's pipeline architecture does not have built-in tenant isolation — implementing it requires custom retriever components that filter by tenant ID, custom authentication middleware, and manual audit log partitioning. For SaaS products serving multiple enterprise customers from a single AI deployment, Moltbot's multi-tenant model is significantly easier to implement securely." },
]

export default function MoltbotVsHaystackPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/${locale}/compare` },
      { "@type": "ListItem", position: 3, name: "Moltbot vs Haystack", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Objektiver Produktvergleich für Kaufentscheidungen.", "Objective product comparison for purchasing decisions.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 13</span></div>
        <h1 className="text-4xl font-bold mb-2 text-gray-100">Moltbot vs Haystack</h1>
        <p className="text-xl text-cyan-400 mb-4">{pick(isDE, "Security-First-Orchestrierung vs flexible NLP-Pipeline", "Security-First Orchestration vs Flexible NLP Pipeline")}</p>
        <p className="text-lg text-gray-300 mb-8">
          {pick(isDE, "Haystack ist hervorragend für RAG und NLP-Pipelines — aber ohne eingebaute Sicherheitskontrollen. Moltbot bringt Prompt-Injection-Defense, RBAC, Audit-Logging und Multi-Tenant-Isolation out-of-the-box.", "Haystack excels at RAG and NLP pipelines — but without built-in security controls. Moltbot delivers prompt injection defense, RBAC, audit logging and multi-tenant isolation out of the box.")}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Direktvergleich", "Direct Comparison")}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase">Moltbot</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Haystack</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm text-gray-300 font-medium">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-cyan-300">{row.moltbot}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{row.haystack}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Wann welches Framework?", "When to Use Which Framework?")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-cyan-900 border border-cyan-700 p-4 rounded-lg">
              <h3 className="font-bold text-cyan-300 mb-2">{pick(isDE, "Moltbot wenn…", "Moltbot when…")}</h3>
              <ul className="text-sm text-cyan-200 space-y-1">
                <li>▸ {pick(isDE, "Sicherheit ist nicht verhandelbar", "Security is non-negotiable")}</li>
                <li>▸ {pick(isDE, "Multi-Tenant AI SaaS-Produkt", "Multi-tenant AI SaaS product")}</li>
                <li>▸ {pick(isDE, "Regulierte Industrie (HIPAA, PCI, ISO)", "Regulated industry (HIPAA, PCI, ISO)")}</li>
                <li>▸ {pick(isDE, "AI-Agenten mit Tool-Zugriff", "AI agents with tool access")}</li>
                <li>▸ {pick(isDE, "Compliance-Evidenz erforderlich", "Compliance evidence required")}</li>
              </ul>
            </div>
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-gray-300 mb-2">{pick(isDE, "Haystack wenn…", "Haystack when…")}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>▸ {pick(isDE, "Maximale Pipeline-Flexibilität gefragt", "Maximum pipeline flexibility needed")}</li>
                <li>▸ {pick(isDE, "Reines RAG/Dokumentensuche-Projekt", "Pure RAG/document search project")}</li>
                <li>▸ {pick(isDE, "Data-Science-Team, kein DevSecOps", "Data science team, no DevSecOps")}</li>
                <li>▸ {pick(isDE, "Prototyp oder interne Nutzung", "Prototype or internal use")}</li>
              </ul>
            </div>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weitere Vergleiche", "More Comparisons")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot-vs-langchain`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs LangChain</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Ähnlicher Framework-Vergleich", "Similar framework comparison")}</div>
            </a>
            <a href={`/${locale}/moltbot-vs-semantic-kernel`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs Semantic Kernel</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Microsoft vs Security-First", "Microsoft vs security-first")}</div>
            </a>
            <a href={`/${locale}/moltbot-vs-llamaindex`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs LlamaIndex</div>
              <div className="text-sm text-gray-300">{pick(isDE, "RAG-Framework-Vergleich", "RAG framework comparison")}</div>
            </a>
            <a href={`/${locale}/moltbot/agentic-rag-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Agentic RAG Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "RAG sicher implementieren", "Implement RAG securely")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
