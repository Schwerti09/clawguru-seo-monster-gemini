import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/compare/moltbot-vs-semantic-kernel"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "Moltbot vs Semantic Kernel: Security-Vergleich 2026 | ClawGuru"
    : "Moltbot vs Semantic Kernel: Security Comparison 2026 | ClawGuru"
  const description = isDE
    ? "Moltbot vs Microsoft Semantic Kernel im Security-Vergleich: AI-Agent Security, Self-Hosted vs Azure, Audit Logging, RBAC und Compliance 2026 direkt verglichen."
    : "Moltbot vs Microsoft Semantic Kernel security comparison: AI agent security, self-hosted vs Azure, audit logging, RBAC and compliance 2026."
  return {
    title, description,
    keywords: ["moltbot vs semantic kernel", "semantic kernel security", "microsoft semantic kernel comparison", "semantic kernel vs moltbot", "ai agent framework security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Deployment", moltbot: "100% Self-Hosted", sk: "Azure-first, self-host possible", winner: "moltbot" },
  { feature: "GDPR / Data Sovereignty", moltbot: "Full control, no cloud egress", sk: "Azure OpenAI sends data to Microsoft", winner: "moltbot" },
  { feature: "Enterprise Integration", moltbot: "API-first, agnostic", sk: "Deep Microsoft 365 / Azure integration", winner: "sk" },
  { feature: "Audit Logging", moltbot: "Native tamper-evident logs", sk: "Azure Monitor integration required", winner: "moltbot" },
  { feature: "Agent Memory Security", moltbot: "Encrypted, isolated per agent", sk: "Pluggable memory — security varies by plugin", winner: "moltbot" },
  { feature: "Plugin / Tool Control", moltbot: "Per-agent tool allowlists enforced", sk: "Plugin permissions developer-managed", winner: "moltbot" },
  { feature: "Prompt Injection Defense", moltbot: "Built-in input sanitization", sk: "Developer responsibility", winner: "moltbot" },
  { feature: "Multi-Model Support", moltbot: "OpenAI, Anthropic, local models", sk: "OpenAI, Azure OpenAI, Hugging Face", winner: "tie" },
  { feature: "Language Support", moltbot: "Python, Go, REST API", sk: "C#, Python, Java (Microsoft ecosystem)", winner: "sk" },
  { feature: "Compliance Certifications", moltbot: "Self-managed compliance", sk: "Azure: ISO 27001, SOC 2, FedRAMP", winner: "sk" },
]

const FAQ = [
  {
    q: "What are the key security differences between Moltbot and Semantic Kernel?",
    a: "Key security differences: 1) Deployment — Moltbot is always self-hosted with zero cloud egress; Semantic Kernel is designed for Azure and sends data to Microsoft when using Azure OpenAI. 2) Agent isolation — Moltbot enforces process-level isolation between agents; Semantic Kernel agents share a runtime environment by default. 3) Plugin security — Moltbot enforces per-agent tool allowlists at the framework level; Semantic Kernel plugin security is the developer's responsibility. 4) Audit logging — Moltbot has native tamper-evident logs; Semantic Kernel requires Azure Monitor or custom logging setup. 5) Data sovereignty — Moltbot gives full control; Semantic Kernel with Azure requires trusting Microsoft's data handling.",
  },
  {
    q: "Is Microsoft Semantic Kernel suitable for security-sensitive workloads?",
    a: "Semantic Kernel can be used for security-sensitive workloads, especially within the Microsoft enterprise ecosystem. Strengths: Azure compliance certifications (ISO 27001, SOC 2, FedRAMP), enterprise identity integration (Entra ID/Azure AD), and managed infrastructure. Weaknesses for high-security use: data leaves your infrastructure when using Azure OpenAI, plugin permissions require custom enforcement, and agent isolation must be implemented externally. For organizations already in Azure with existing Microsoft compliance, Semantic Kernel is viable. For GDPR-strict or air-gapped environments, Moltbot's self-hosted model is safer.",
  },
  {
    q: "How does Semantic Kernel's plugin system compare to Moltbot's tool allowlists?",
    a: "Semantic Kernel's plugin system is powerful and flexible: plugins expose functions that the kernel can call, with OpenAPI support for external services. Security model: plugins are registered at kernel level and any agent can call any registered plugin — there is no per-agent capability enforcement by default. Moltbot's tool allowlists: each agent has an explicit list of permitted tools enforced at the framework level. Unauthorized tool calls are blocked before execution. For security: Semantic Kernel requires developers to implement their own capability enforcement; Moltbot enforces it by default. In production, this means Moltbot requires significantly less custom security code.",
  },
  {
    q: "When should I choose Semantic Kernel over Moltbot?",
    a: "Choose Semantic Kernel when: 1) Your organization is Microsoft-first (Azure, M365, Entra ID). 2) You need deep integration with Office documents, Teams, or SharePoint. 3) Your dev team is primarily C# or .NET. 4) You need Microsoft's compliance certifications (FedRAMP for US government). 5) Enterprise support via Microsoft is a requirement. Choose Moltbot when: 1) GDPR and data sovereignty require no cloud data egress. 2) Self-hosted on-premises or private cloud is mandatory. 3) Security-first agent architecture with enforced capability controls. 4) Regulated industry requiring full auditability. 5) Multi-cloud or cloud-agnostic strategy.",
  },
]

export default function MoltbotVsSemanticKernelPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/${locale}/compare` },
        { "@type": "ListItem", position: 3, name: "Moltbot vs Semantic Kernel", item: `${SITE_URL}/${locale}${PATH}` },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}

      <div className="max-w-5xl mx-auto px-4 py-16">
        <nav className="text-sm text-gray-500 mb-8">
          <a href={`/${locale}`} className="hover:text-cyan-400">ClawGuru</a>
          <span className="mx-2">/</span>
          <a href={`/${locale}/compare`} className="hover:text-cyan-400">Compare</a>
          <span className="mx-2">/</span>
          <span className="text-gray-300">Moltbot vs Semantic Kernel</span>
        </nav>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This is a security-focused comparison for your own infrastructure decisions. No attack tools.
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? "Moltbot vs Semantic Kernel: Security-Vergleich 2026" : "Moltbot vs Semantic Kernel: Security Comparison 2026"}
        </h1>
        <p className="text-lg text-gray-300 mb-10">
          {isDE
            ? "Microsoft Semantic Kernel ist ein Enterprise-SDK für AI-Agenten, tief integriert in Azure und M365. Moltbot ist ein Security-first AI-Agent-Framework für Self-Hosted-Umgebungen. Welches passt zu deiner Security-Anforderung?"
            : "Microsoft Semantic Kernel is an enterprise SDK for AI agents, deeply integrated with Azure and M365. Moltbot is a security-first AI agent framework for self-hosted environments. Which fits your security requirements?"}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Direkt-Vergleich" : "Head-to-Head Comparison"}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Moltbot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Semantic Kernel</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-300">{row.feature}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={row.winner === "moltbot" ? "text-green-400 font-semibold" : "text-gray-300"}>
                        {row.winner === "moltbot" && "✓ "}{row.moltbot}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={row.winner === "sk" ? "text-green-400 font-semibold" : "text-gray-300"}>
                        {row.winner === "sk" && "✓ "}{row.sk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Wann welches Tool wählen?" : "When to Choose Which?"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-green-900 p-5 rounded-lg border border-green-700">
              <h3 className="font-bold text-green-300 mb-3">✓ Moltbot wählen wenn…</h3>
              <ul className="space-y-2 text-sm text-green-200">
                <li>DSGVO erfordert vollständige Datenkontrolle</li>
                <li>Self-Hosted on-prem oder private Cloud zwingend</li>
                <li>Security-first mit erzwungenen Agent-Capabilities</li>
                <li>Regulierte Industrie (Finance, Healthcare)</li>
                <li>Cloud-agnostische Strategie</li>
              </ul>
            </div>
            <div className="bg-blue-900 p-5 rounded-lg border border-blue-700">
              <h3 className="font-bold text-blue-300 mb-3">✓ Semantic Kernel wählen wenn…</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>Microsoft-First-Organisation (Azure, M365, Entra)</li>
                <li>Deep Office/Teams/SharePoint-Integration nötig</li>
                <li>Dev-Team primär C# / .NET</li>
                <li>Microsoft-Compliance-Zertifikate benötigt (FedRAMP)</li>
                <li>Enterprise-Support via Microsoft erforderlich</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Häufige Fragen" : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-4">
            {FAQ.map((entry, i) => (
              <details key={i} className="bg-gray-800 rounded-lg border border-gray-700">
                <summary className="px-5 py-4 cursor-pointer font-bold text-gray-200 list-none flex items-center justify-between">
                  <span>{entry.q}</span>
                  <span className="text-gray-500 text-xs">▼</span>
                </summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">{entry.a}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Weiterführende Ressourcen" : "Further Resources"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/ai-agent-sandboxing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Sandboxing</div>
              <div className="text-sm text-gray-300">{isDE ? "Runtime-Isolation für KI-Agenten" : "Runtime isolation for AI agents"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-gateway-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Gateway Hardening</div>
              <div className="text-sm text-gray-300">{isDE ? "API-Gateway für LLMs absichern" : "Secure your LLM API gateway"}</div>
            </a>
            <a href={`/${locale}/compare/moltbot-vs-crewai`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs CrewAI</div>
              <div className="text-sm text-gray-300">{isDE ? "Weiterer Agent-Framework-Vergleich" : "Another agent framework comparison"}</div>
            </a>
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Security Check starten" : "Start Security Check"}</div>
              <div className="text-sm text-gray-300">{isDE ? "AI-Infrastruktur in 30 Sekunden prüfen" : "Check AI infrastructure in 30 seconds"}</div>
            </a>
          </div>
        </section>

        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-cyan-300 mb-2">
            {isDE ? "Moltbot für deine Umgebung evaluieren?" : "Evaluate Moltbot for your environment?"}
          </h2>
          <p className="text-gray-300 mb-4 text-sm">
            {isDE
              ? "ClawGuru zeigt dir, welches AI-Agent-Framework zu deinen Security-Anforderungen passt."
              : "ClawGuru shows you which AI agent framework fits your security requirements."}
          </p>
          <a href={`/${locale}/securitycheck`} className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-lg transition-colors">
            {isDE ? "🛡️ Kostenloser Security Check" : "🛡️ Free Security Check"}
          </a>
        </div>
      </div>
    </div>
  )
}
