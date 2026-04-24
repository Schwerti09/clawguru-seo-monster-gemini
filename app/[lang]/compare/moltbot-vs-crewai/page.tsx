import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/compare/moltbot-vs-crewai"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "Moltbot vs CrewAI: Security-Vergleich 2026 | ClawGuru", "Moltbot vs CrewAI: Security Comparison 2026 | ClawGuru")
  const description = pick(isDE, "Moltbot vs CrewAI im Security-Vergleich: Multi-Agent Orchestration Security, Self-Hosted vs Cloud, Audit Logging und Role-Based Agent Security direkt verglichen 2026.", "Moltbot vs CrewAI security comparison: multi-agent orchestration security, self-hosted vs cloud, audit logging and role-based agent security compared 2026.")
  return {
    title, description,
    keywords: ["moltbot vs crewai", "crewai security", "crewai comparison 2026", "multi-agent orchestration security", "crewai vs moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Deployment", moltbot: "100% Self-Hosted", crewai: "Cloud or self-hosted", winner: "moltbot" },
  { feature: "GDPR / Data Sovereignty", moltbot: "Full control, no cloud egress", crewai: "Cloud version sends data to CrewAI", winner: "moltbot" },
  { feature: "Agent Role Security", moltbot: "Built-in RBAC for agents", crewai: "Role-based by design (Crew metaphor)", winner: "tie" },
  { feature: "Audit Logging", moltbot: "Native tamper-evident logs", crewai: "Basic task logging only", winner: "moltbot" },
  { feature: "Agent Isolation", moltbot: "Process/container isolation", crewai: "Shared process space", winner: "moltbot" },
  { feature: "Tool Access Control", moltbot: "Per-agent tool allowlists", crewai: "Role-based tool assignment", winner: "tie" },
  { feature: "Prompt Injection Defense", moltbot: "Built-in input sanitization", crewai: "Developer responsibility", winner: "moltbot" },
  { feature: "Multi-Agent Workflows", moltbot: "Security-first orchestration", crewai: "Intuitive crew/task/agent pattern", winner: "crewai" },
  { feature: "Ease of Use", moltbot: "Steeper security config curve", crewai: "Very fast to get started", winner: "crewai" },
  { feature: "Community", moltbot: "Security-focused", crewai: "Large, fast-growing community", winner: "crewai" },
]

const FAQ = [
  { q: "What are the main security differences between Moltbot and CrewAI?", a: "Key security differences: 1) Deployment — Moltbot is always self-hosted; CrewAI cloud version sends conversation and task data to CrewAI servers. 2) Agent isolation — Moltbot runs agents in isolated processes/containers; CrewAI agents run in the same Python process by default. 3) Audit logging — Moltbot has native tamper-evident audit logs; CrewAI logging is basic task output. 4) Prompt injection defense — Moltbot has built-in input sanitization; CrewAI does not. 5) Data sovereignty — Moltbot gives you full control; CrewAI cloud requires trusting CrewAI with your data." },
  { q: "Is CrewAI secure enough for production use?", a: "CrewAI can be used in production with appropriate hardening: 1) Use self-hosted CrewAI (not cloud version). 2) Implement external audit logging (send logs to SIEM). 3) Add input validation before agent tasks. 4) Use Docker to isolate CrewAI execution environment. 5) Implement network egress controls. 6) Add human-in-the-loop for destructive actions. CrewAI is primarily a developer productivity framework. For regulated industries (healthcare, finance) or high-security environments, Moltbot's security-first design requires significantly less custom hardening." },
  { q: "How does CrewAI's role-based approach compare to Moltbot's RBAC?", a: "CrewAI's role-based approach is about workflow design: you define Crews (teams), Agents (roles: researcher, writer, analyst), and Tasks (work items). This creates a natural organizational metaphor. Moltbot's RBAC is about security enforcement: it defines what each agent is permitted to do, which tools it can access, and enforces these boundaries at runtime. CrewAI roles are descriptive; Moltbot RBAC is prescriptive and enforced. For security: you want both — CrewAI's intuitive structure plus Moltbot-style enforcement of capability boundaries." },
  { q: "When should I choose CrewAI over Moltbot?", a: "Choose CrewAI when: 1) Rapid prototyping of multi-agent workflows. 2) Team is familiar with Python and wants quick productivity. 3) Agent workflow complexity is the priority over security controls. 4) Use case is non-sensitive (content creation, research assistants). 5) Community ecosystem and integrations are important. Choose Moltbot when: 1) Security, compliance, and audit are primary requirements. 2) GDPR/data sovereignty requires full self-hosting. 3) Regulated industry (finance, healthcare, critical infrastructure). 4) Production-grade audit logging and monitoring required. 5) Multi-agent trust isolation is critical." },
]

export default function MoltbotVsCrewaiPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/${locale}/compare` },
      { "@type": "ListItem", position: 3, name: "Moltbot vs CrewAI", item: `${SITE_URL}/${locale}${PATH}` },
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
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 18</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "Moltbot vs CrewAI", "Moltbot vs CrewAI")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "CrewAI macht Multi-Agent-Workflows intuitiv — aber Agent Isolation und Audit Logging fehlen out-of-the-box. Moltbot erzwingt Security von Anfang an.", "CrewAI makes multi-agent workflows intuitive — but agent isolation and audit logging are missing out of the box. Moltbot enforces security from the start.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Feature-Vergleich", "Feature Comparison")}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{pick(isDE, "Merkmal", "Feature")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase">Moltbot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">CrewAI</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-700 ${i % 2 === 0 ? "" : "bg-gray-800/50"}`}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-300">{row.feature}</td>
                    <td className="px-6 py-3 text-sm"><span className={row.winner === "moltbot" ? "text-green-400 font-semibold" : "text-gray-300"}>{row.moltbot}</span></td>
                    <td className="px-6 py-3 text-sm"><span className={row.winner === "crewai" ? "text-green-400 font-semibold" : "text-gray-300"}>{row.crewai}</span></td>
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
            <a href={`/${locale}/compare/moltbot-vs-autogen`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs AutoGen</div>
              <div className="text-sm text-gray-300">{pick(isDE, "AutoGen-Vergleich", "AutoGen comparison")}</div>
            </a>
            <a href={`/${locale}/compare/openclaw-vs-aquasec`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw vs Aqua Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Aquasec-Vergleich", "Aquasec comparison")}</div>
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
