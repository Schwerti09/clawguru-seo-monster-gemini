import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/compare/moltbot-vs-langchain-agents"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "Moltbot vs LangChain Agents: Security-Vergleich 2026 | ClawGuru"
    : "Moltbot vs LangChain Agents: Security Comparison 2026 | ClawGuru"
  const description = isDE
    ? "Moltbot vs LangChain Agents im Security-Vergleich: Self-Hosted vs Cloud, Security Controls, Audit Logging, GDPR-Compliance und AI-Agent-Hardening im direkten Vergleich 2026."
    : "Moltbot vs LangChain Agents security comparison: self-hosted vs cloud, security controls, audit logging, GDPR compliance and AI agent hardening compared 2026."
  return {
    title, description,
    keywords: ["moltbot vs langchain agents", "langchain security", "moltbot langchain comparison", "ai agent security 2026", "self-hosted vs langchain"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: isDE("Deployment Model", "Deployment Model"), moltbot: "100% Self-Hosted", langchain: "Cloud or Self-Hosted", winner: "moltbot" },
  { feature: "GDPR / Data Sovereignty", moltbot: "Full control, no cloud egress", langchain: "Depends on LLM provider", winner: "moltbot" },
  { feature: "Security Audit Logging", moltbot: "Built-in, tamper-evident", langchain: "Plugin-dependent", winner: "moltbot" },
  { feature: "Prompt Injection Defense", moltbot: "Native guardrails", langchain: "Manual implementation", winner: "moltbot" },
  { feature: "Memory Isolation", moltbot: "Per-tenant memory isolation", langchain: "Developer responsibility", winner: "moltbot" },
  { feature: "Agent Ecosystem", moltbot: "Focused security stack", langchain: "Broad integrations (500+ tools)", winner: "langchain" },
  { feature: "Community & Plugins", moltbot: "Security-first community", langchain: "Massive open ecosystem", winner: "langchain" },
  { feature: "Compliance (SOC 2, ISO)", moltbot: "Built-in compliance controls", langchain: "Framework only", winner: "moltbot" },
  { feature: "Cost at Scale", moltbot: "Fixed infra cost", langchain: "API cost per call", winner: "moltbot" },
  { feature: "Learning Curve", moltbot: "Security-focused docs", langchain: "Extensive tutorials", winner: "tie" },
]

function isDE(de: string, en: string) { return de }

const FAQ = [
  { q: "Is LangChain secure for production AI agents?", a: "LangChain is a powerful framework but security is largely the developer's responsibility. LangChain itself does not provide built-in prompt injection defense, memory isolation, or audit logging — these must be implemented manually. For production use: 1) Add input sanitization before LangChain processing. 2) Implement output filtering. 3) Use separate memory stores with access controls. 4) Add comprehensive audit logging. 5) Review all third-party tools in your agent chain. Moltbot provides these as built-in security controls." },
  { q: "Can LangChain be used in a GDPR-compliant way?", a: "Yes, but it requires careful architecture. LangChain itself is GDPR-neutral — compliance depends on your LLM provider and data handling. GDPR-compliant LangChain setup: 1) Use self-hosted or EU-region LLM providers. 2) Sign DPAs with all data processors. 3) Implement data minimization before LLM calls. 4) Add PII detection and redaction. 5) Implement right-to-erasure for conversation history. Moltbot is designed for self-hosted GDPR-first deployment without these extra steps." },
  { q: "What are the main security risks of LangChain agents?", a: "Main security risks of LangChain agents: 1) Tool abuse — agents can invoke powerful tools (shell, browser, file system). 2) Prompt injection via tool outputs — malicious tool responses can inject instructions. 3) Memory poisoning — conversation history can be manipulated. 4) LLM API key exposure — keys passed through LangChain chains. 5) Insufficient output validation — agent outputs not validated before use. 6) Chain-of-thought leakage — internal reasoning exposed in verbose mode. Mitigation: tool sandboxing, input/output validation, and strict memory controls." },
  { q: "When should I choose LangChain over Moltbot?", a: "Choose LangChain when: 1) You need broad tool integrations (500+ pre-built tools). 2) You want rapid prototyping with minimal setup. 3) Your team is already skilled in LangChain. 4) You need specific LangChain-exclusive integrations. Choose Moltbot when: 1) Security is the primary requirement. 2) You need GDPR/HIPAA/ISO 27001 compliance out-of-the-box. 3) Self-hosting with full data sovereignty is required. 4) You need built-in audit logging and security controls. 5) Prompt injection defense and memory isolation are non-negotiable." },
]

export default function MoltbotVsLangchainAgentsPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/${locale}/compare` },
      { "@type": "ListItem", position: 3, name: "Moltbot vs LangChain Agents", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Security-Vergleich für eigene KI-Infrastruktur-Entscheidungen." : "Security comparison to help you choose your own AI infrastructure."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 16</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "Moltbot vs LangChain Agents" : "Moltbot vs LangChain Agents"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "LangChain ist das beliebteste AI-Agent-Framework — aber Security ist Entwicklersache. Moltbot ist Security-first. Dieser Vergleich zeigt wo die Unterschiede wirklich liegen."
            : "LangChain is the most popular AI agent framework — but security is the developer's job. Moltbot is security-first. This comparison shows where the differences really are."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Feature-Vergleich" : "Feature Comparison"}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{isDE ? "Merkmal" : "Feature"}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase">Moltbot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">LangChain Agents</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-700 ${i % 2 === 0 ? "" : "bg-gray-800/50"}`}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-300">{row.feature}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={row.winner === "moltbot" ? "text-green-400 font-semibold" : "text-gray-300"}>{row.moltbot}</span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className={row.winner === "langchain" ? "text-green-400 font-semibold" : "text-gray-300"}>{row.langchain}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <a href={`/${locale}/compare/moltbot-vs-bedrock-agents`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs Bedrock Agents</div>
              <div className="text-sm text-gray-300">{isDE ? "AWS-Vergleich" : "AWS comparison"}</div>
            </a>
            <a href={`/${locale}/compare/openclaw-vs-prisma-cloud`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw vs Prisma Cloud</div>
              <div className="text-sm text-gray-300">{isDE ? "Cloud-Security-Vergleich" : "Cloud security comparison"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Security-Overview" : "Security overview"}</div>
            </a>
            <a href={`/${locale}/compare`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">All Comparisons</div>
              <div className="text-sm text-gray-300">{isDE ? "Alle Vergleiche" : "All comparisons"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
