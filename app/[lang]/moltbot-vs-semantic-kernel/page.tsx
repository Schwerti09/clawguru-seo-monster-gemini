import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot-vs-semantic-kernel"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "Moltbot vs Semantic Kernel: Security for Enterprise AI | ClawGuru"
  const description = "Moltbot vs Microsoft Semantic Kernel: security comparison for enterprise AI agent development. SK integrates with Azure security — but self-hosted deployments need Moltbot's security hardening layer."
  return {
    title, description,
    keywords: ["moltbot vs semantic kernel", "semantic kernel security", "semantic kernel self-hosted", "microsoft semantic kernel hardening", "enterprise ai security", "semantic kernel alternative"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Primary Purpose", moltbot: "Security-first AI agent orchestration", sk: "Enterprise AI SDK for .NET/Python/Java" },
  { feature: "Security Model", moltbot: "Security-native — hardening built in", sk: "Security delegated to Azure/OpenAI platform" },
  { feature: "Self-Hosted Security", moltbot: "Full security stack works self-hosted", sk: "Azure AD / Entra ID dependency for auth" },
  { feature: "Prompt Injection Defense", moltbot: "Built-in input validation + detection", sk: "None built-in — developer responsibility" },
  { feature: "Plugin/Tool Security", moltbot: "Per-plugin scope enforcement, HITL", sk: "Plugin access not scoped by default" },
  { feature: "Audit Logging", moltbot: "Tamper-evident structured JSON audit trail", sk: "ILogger abstraction — no built-in security logging" },
  { feature: "Multi-Agent Auth", moltbot: "mTLS + capability tokens", sk: "No multi-agent authentication primitives" },
  { feature: "Memory Security", moltbot: "Encrypted, namespaced, GDPR-aware", sk: "IMemoryStore abstraction — security per backend" },
  { feature: "GDPR / Data Residency", moltbot: "Self-hosted, zero egress required", sk: "Azure-centric — data to Microsoft cloud by default" },
  { feature: "Observability", moltbot: "Built-in LLM metrics + security events", sk: "OpenTelemetry hooks — no security-specific metrics" },
  { feature: "Language Support", moltbot: "Python-first, REST API for others", sk: ".NET, Python, Java" },
  { feature: "Enterprise Integration", moltbot: "REST + gRPC + webhooks", sk: "Deep Azure ecosystem integration" },
]

const FAQ = [
  { q: "What is Microsoft Semantic Kernel?", a: "Semantic Kernel (SK) is Microsoft's open-source SDK for building AI-powered applications and agents. It provides abstractions for LLM calls, memory (vector stores), planning, and plugins (tools). SK is designed to integrate with the Azure AI ecosystem (Azure OpenAI, Azure Cognitive Search, Azure AD). It supports .NET, Python, and Java. SK is developer productivity focused — it does not address security hardening for AI agents." },
  { q: "Is Semantic Kernel suitable for GDPR-compliant self-hosted deployments?", a: "With significant additional work. Out of the box, SK is designed around Azure services. For GDPR-compliant self-hosted SK: 1) Replace Azure OpenAI with self-hosted Ollama/LocalAI. 2) Replace Azure Cognitive Search with self-hosted Qdrant/Chroma for vector memory. 3) Replace Azure AD with Keycloak for identity. 4) Add Moltbot as a security wrapper for audit logging, prompt injection defense, and GDPR memory handling. The SK abstractions make this possible — but it requires replacing most of the Azure stack." },
  { q: "Can Moltbot and Semantic Kernel work together?", a: "Yes — Moltbot can wrap Semantic Kernel as a security orchestration layer: 1) Moltbot intercepts all SK plugin calls, adding scope enforcement and HITL for dangerous plugins. 2) Moltbot wraps SK's IMemoryStore with encryption, namespace isolation, and GDPR erasure. 3) SK handles the AI orchestration logic (planners, plugins, semantic functions). 4) Moltbot handles security (auth, logging, injection detection, compliance). This is the recommended pattern for teams using SK in regulated or high-security environments." },
  { q: "What are the main security gaps in Semantic Kernel's plugin system?", a: "SK's plugin system allows AI agents to call C# or Python functions — similar to LangChain tools or CrewAI tools. Key security gaps: 1) No per-plugin scope enforcement — if an agent has a plugin registered, it can call it any time. 2) No HITL for dangerous plugins — shell execution, database write plugins can be called without human approval. 3) No plugin call audit trail — ILogger can capture calls but it's not security-structured. 4) Prompt injection can trigger any registered plugin — including dangerous ones. Moltbot addresses all four gaps." },
]

export default function MoltbotVsSemanticKernelPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot vs Semantic Kernel", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: Security comparison for your own AI agent deployments.
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 11</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot vs Semantic Kernel: Enterprise AI Security</h1>
        <p className="text-lg text-gray-300 mb-6">
          Semantic Kernel is Microsoft's enterprise AI SDK — powerful, well-maintained, Azure-native. Moltbot is the security hardening layer that SK is missing for self-hosted, GDPR-compliant, production deployments. This comparison maps exactly where SK falls short and how to fix it.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase">Moltbot</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Semantic Kernel</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-100">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-green-300">{row.moltbot}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{row.sk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Frequently Asked Questions</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Hub</div>
              <div className="text-sm text-gray-300">OWASP LLM Top 10 defense</div>
            </a>
            <a href={`/${locale}/moltbot-vs-autogen`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs AutoGen</div>
              <div className="text-sm text-gray-300">Microsoft AutoGen comparison</div>
            </a>
            <a href={`/${locale}/moltbot/agent-memory-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Agent Memory Security</div>
              <div className="text-sm text-gray-300">Secure IMemoryStore replacement</div>
            </a>
            <a href={`/${locale}/solutions/eu-ai-act-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">EU AI Act Compliance</div>
              <div className="text-sm text-gray-300">Compliance for SK-based systems</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
