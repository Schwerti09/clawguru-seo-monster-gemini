import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/compare/moltbot-vs-autogen"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "Moltbot vs AutoGen: Security-Vergleich 2026 | ClawGuru", "Moltbot vs AutoGen: Security Comparison 2026 | ClawGuru")
  const description = pick(isDE, "Moltbot vs Microsoft AutoGen im Security-Vergleich: Multi-Agent Security, Self-Hosted vs Azure, Audit Logging und GDPR-Compliance im direkten Vergleich 2026.", "Moltbot vs Microsoft AutoGen security comparison: multi-agent security, self-hosted vs Azure, audit logging and GDPR compliance compared 2026.")
  return {
    title, description,
    keywords: ["moltbot vs autogen", "autogen security", "microsoft autogen comparison", "multi-agent security 2026", "autogen vs moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Deployment", moltbot: "100% Self-Hosted", autogen: "Local or Azure-hosted", winner: "moltbot" },
  { feature: "GDPR / Data Sovereignty", moltbot: "Full control, no cloud egress", autogen: "Azure backend dependency risk", winner: "moltbot" },
  { feature: "Multi-Agent Security", moltbot: "Built-in agent isolation", autogen: "Developer responsibility", winner: "moltbot" },
  { feature: "Audit Logging", moltbot: "Native tamper-evident logs", autogen: "Plugin-dependent", winner: "moltbot" },
  { feature: "Conversation History Security", moltbot: "Encrypted, access-controlled", autogen: "In-memory, no encryption", winner: "moltbot" },
  { feature: "Code Execution Sandboxing", moltbot: "Container-isolated execution", autogen: "Local execution (risky)", winner: "moltbot" },
  { feature: "Microsoft Ecosystem Integration", moltbot: "Independent", autogen: "Deep Azure/Teams/Copilot integration", winner: "autogen" },
  { feature: "Multi-Agent Coordination", moltbot: "Security-first orchestration", autogen: "Flexible group chat patterns", winner: "autogen" },
  { feature: "Community Support", moltbot: "Security-focused community", autogen: "Large Microsoft-backed community", winner: "autogen" },
  { feature: "Compliance (SOC2, ISO)", moltbot: "Built-in compliance controls", autogen: "Inherits Azure compliance", winner: "tie" },
]

const FAQ = [
  { q: "What are the security risks of AutoGen code execution?", a: "AutoGen's code execution is a major security concern: by default, AutoGen agents can execute Python code locally on the machine running AutoGen. This means: 1) File system access — agents can read and write local files. 2) Network access — agents can make outbound network connections. 3) Process execution — agents can spawn arbitrary processes. 4) No sandboxing by default. Mitigation: use AutoGen's DockerCommandLineCodeExecutor to sandbox code execution in Docker containers. This is essential for any production deployment." },
  { q: "Is AutoGen suitable for production use?", a: "AutoGen can be used in production but requires significant security hardening: 1) Always use Docker-based code execution (never local). 2) Implement strict agent capability controls. 3) Add conversation logging and monitoring. 4) Restrict agent access to external services. 5) Implement human-in-the-loop for destructive actions. AutoGen is primarily a research/development framework — Moltbot provides production-ready security controls out of the box. For security-sensitive production deployments, Moltbot's security-first architecture requires less custom hardening." },
  { q: "How does AutoGen handle multi-agent trust?", a: "AutoGen does not have built-in multi-agent trust mechanisms — trust between agents is implicit. An agent receiving a message from another agent treats it as trusted input, which creates prompt injection risks: a compromised agent can inject malicious instructions to other agents. Moltbot implements agent isolation and message authentication to prevent cross-agent prompt injection. For secure multi-agent systems, explicit trust boundaries and message authentication are critical." },
  { q: "When should I choose AutoGen over Moltbot?", a: "Choose AutoGen when: 1) Deep Microsoft ecosystem integration (Azure OpenAI, Teams, Copilot Studio). 2) Rapid research prototyping with flexible agent patterns. 3) Your team has existing AutoGen expertise. 4) You need specific AutoGen-exclusive patterns (group chat, nested chats). Choose Moltbot when: 1) Security and compliance are primary requirements. 2) GDPR/self-hosted deployment is required. 3) Production-ready audit logging is needed. 4) Code execution security is critical. 5) Multi-agent trust isolation is required." },
]

export default function MoltbotVsAutogenPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/${locale}/compare` },
      { "@type": "ListItem", position: 3, name: "Moltbot vs AutoGen", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Security-Vergleich für eigene KI-Infrastruktur-Entscheidungen.", "Security comparison to help you choose your own AI infrastructure.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 17</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "Moltbot vs Microsoft AutoGen", "Moltbot vs Microsoft AutoGen")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "AutoGen führt standardmäßig Code lokal aus — ohne Sandboxing. Moltbot isoliert jede Code-Ausführung in Container. Dieser Vergleich zeigt, warum das in Production entscheidend ist.", "AutoGen executes code locally by default — without sandboxing. Moltbot isolates every code execution in containers. This comparison shows why that matters in production.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Feature-Vergleich", "Feature Comparison")}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{pick(isDE, "Merkmal", "Feature")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase">Moltbot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">AutoGen</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-700 ${i % 2 === 0 ? "" : "bg-gray-800/50"}`}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-300">{row.feature}</td>
                    <td className="px-6 py-3 text-sm"><span className={row.winner === "moltbot" ? "text-green-400 font-semibold" : "text-gray-300"}>{row.moltbot}</span></td>
                    <td className="px-6 py-3 text-sm"><span className={row.winner === "autogen" ? "text-green-400 font-semibold" : "text-gray-300"}>{row.autogen}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <a href={`/${locale}/compare/moltbot-vs-langchain-agents`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs LangChain Agents</div>
              <div className="text-sm text-gray-300">{pick(isDE, "LangChain-Vergleich", "LangChain comparison")}</div>
            </a>
            <a href={`/${locale}/compare/openclaw-vs-tenable`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw vs Tenable</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Tenable-Vergleich", "Tenable comparison")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Security-Overview", "Security overview")}</div>
            </a>
            <a href={`/${locale}/compare`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">All Comparisons</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Alle Vergleiche", "All comparisons")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
