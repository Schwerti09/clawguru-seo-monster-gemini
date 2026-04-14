import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot-vs-crewai"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "Moltbot vs CrewAI: Security Comparison for Self-Hosted AI Agents | ClawGuru"
  const description = "Moltbot vs CrewAI: detailed security comparison for multi-agent orchestration. CrewAI lacks built-in hardening — learn how to secure CrewAI deployments or why Moltbot wins for production security."
  return {
    title, description,
    keywords: ["moltbot vs crewai", "crewai security", "crewai self-hosted", "moltbot crewai comparison", "crewai hardening", "multi agent security"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Primary Purpose", moltbot: "Security-first AI agent orchestration", crewai: "Role-based multi-agent collaboration framework" },
  { feature: "Prompt Injection Defense", moltbot: "Built-in input validation + output sanitization", crewai: "None built-in — manual implementation required" },
  { feature: "Agent Sandboxing", moltbot: "Docker isolation, capability dropping, network restriction", crewai: "No isolation — agents run in shared process" },
  { feature: "Tool Use Security", moltbot: "Per-tool scope restriction + HITL for dangerous tools", crewai: "No built-in scope restriction on tools" },
  { feature: "Multi-Agent Trust", moltbot: "mTLS + capability tokens between agents", crewai: "No authentication between agents" },
  { feature: "Audit Logging", moltbot: "Structured JSON logs, full agent trace", crewai: "Basic verbose output, no structured audit trail" },
  { feature: "GDPR / DSGVO", moltbot: "Self-hosted, no data leaves your infra", crewai: "Depends on LLM provider — potential cloud data transfer" },
  { feature: "Memory Security", moltbot: "Encrypted agent memory, scope-limited retrieval", crewai: "No memory encryption or access control" },
  { feature: "Production Readiness", moltbot: "Production-hardened, enterprise deployments", crewai: "Research/prototyping stage, rapidly evolving" },
  { feature: "Open Source", moltbot: "Yes", crewai: "Yes (MIT)" },
  { feature: "Self-Hostable", moltbot: "Yes — full self-hosted", crewai: "Yes, but requires own LLM infrastructure" },
  { feature: "OWASP LLM Coverage", moltbot: "LLM01-LLM10 addressed", crewai: "Partial — LLM07 (plugin design) main gap" },
]

const FAQ = [
  { q: "Is CrewAI secure for production use?", a: "CrewAI is a powerful multi-agent framework but was designed for rapid prototyping, not production security. Key gaps: no agent-to-agent authentication, no built-in prompt injection defense, no sandboxing for tool execution, no structured audit logging. For production deployments, you must wrap CrewAI with security layers — or use Moltbot which includes these by default." },
  { q: "Can Moltbot replace CrewAI?", a: "Moltbot and CrewAI serve different primary use cases. CrewAI excels at rapid prototyping of role-based multi-agent workflows. Moltbot is optimized for security-critical, production AI agent deployments. If your primary concern is building interesting agent interactions quickly, CrewAI is faster to start. If your primary concern is securing those agents in production, Moltbot wins decisively." },
  { q: "How do I harden a CrewAI deployment?", a: "To harden CrewAI: 1) Run each agent in a separate Docker container with --cap-drop=ALL. 2) Add input validation before each agent receives user input. 3) Restrict tool access — only register tools each specific agent needs. 4) Add structured logging (JSON) around all agent invocations. 5) Use Moltbot as a security orchestration layer on top of CrewAI. 6) Never expose CrewAI agent APIs directly to the internet." },
  { q: "What is the main security gap in CrewAI multi-agent systems?", a: "The biggest gap: no authentication between agents. In CrewAI, when one agent delegates to another, there is no cryptographic proof of the caller's identity. A compromised or injected agent can impersonate any other agent, escalate privileges, or cause other agents to take unintended actions. Moltbot addresses this with mTLS + capability tokens on every inter-agent call." },
]

export default function MoltbotVsCrewaiPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot vs CrewAI", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: Security hardening guide for your own AI agent deployments.
        </div>

        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 8</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot vs CrewAI: Security Comparison</h1>
        <p className="text-lg text-gray-300 mb-6">CrewAI makes multi-agent collaboration easy. Moltbot makes it secure. This comparison breaks down exactly where CrewAI's security model falls short for production deployments — and what it takes to close those gaps.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase">Moltbot</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">CrewAI</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-100">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-green-300">{row.moltbot}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{row.crewai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Which Tool When?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-cyan-900 p-4 rounded-lg border border-cyan-700">
              <h3 className="font-semibold text-cyan-300 mb-2">Choose Moltbot when:</h3>
              <ul className="space-y-1 text-sm text-cyan-200">
                <li>▸ Production deployment with real user data</li>
                <li>▸ GDPR / NIS2 / SOC 2 compliance required</li>
                <li>▸ Agents execute tools with system access</li>
                <li>▸ Multi-agent system in internet-facing app</li>
                <li>▸ Audit trail required for all agent actions</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
              <h3 className="font-semibold text-gray-300 mb-2">CrewAI is fine for:</h3>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>▸ Internal prototyping and demos</li>
                <li>▸ Research environments (no sensitive data)</li>
                <li>▸ Exploring multi-agent patterns quickly</li>
                <li>▸ Air-gapped dev environments</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">The Security Gap: Inter-Agent Trust</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
              <pre>{`# CrewAI — no agent authentication:
crew = Crew(agents=[researcher, writer, reviewer])
result = crew.kickoff()
# Any agent can instruct any other. No identity verification.
# Prompt injection in researcher → controls writer output.

# Moltbot — capability token on every delegation:
orchestrator.delegate(
    target="agent-writer",
    capability_token=sign_token(scope=["write:draft"], ttl=300),
    payload=research_output,
    verify_mtls=True  # mTLS client cert required
)`}</pre>
            </div>
            <p className="text-sm text-gray-300">In CrewAI, a compromised agent can instruct other agents without any cryptographic verification. Moltbot requires a signed capability token on every inter-agent call — limiting blast radius to exactly the declared scope.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Hardening CrewAI Deployments</h2>
          <div className="space-y-3">
            {[
              { step: "1", t: "Containerize each agent", d: "Run each CrewAI agent in a separate Docker container. --cap-drop=ALL, --network=isolated, --read-only rootfs. Never run multiple agents in the same container." },
              { step: "2", t: "Add input validation layer", d: "Before any user input reaches a CrewAI agent, pass it through a validation layer that scans for injection patterns, enforces length limits, and sanitizes HTML/markdown." },
              { step: "3", t: "Restrict tool registration", d: "Only register the minimum tools each agent needs. Never give a summarizer agent access to shell or HTTP tools. Apply principle of least tool." },
              { step: "4", t: "Add structured audit logging", d: "Wrap all CrewAI agent invocations with structured JSON logging: agent_id, input_hash, output_hash, tools_called, duration, timestamp." },
              { step: "5", t: "Use Moltbot as security orchestrator", d: "Run Moltbot as the orchestration layer above CrewAI. Moltbot handles auth, logging, sandboxing — CrewAI handles agent collaboration logic." },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</div>
                <div><div className="font-semibold text-gray-100">{s.t}</div><div className="text-sm text-gray-300">{s.d}</div></div>
              </div>
            ))}
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
              <div className="text-sm text-gray-300">OWASP LLM Top 10 defense map</div>
            </a>
            <a href={`/${locale}/moltbot/multi-agent-trust`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Multi-Agent Trust</div>
              <div className="text-sm text-gray-300">Capability tokens & mTLS between agents</div>
            </a>
            <a href={`/${locale}/moltbot-vs-langchain`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs LangChain</div>
              <div className="text-sm text-gray-300">Security comparison</div>
            </a>
            <a href={`/${locale}/moltbot/ai-tool-use-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Tool Use Security</div>
              <div className="text-sm text-gray-300">Secure CrewAI tool execution</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
