import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/zero-trust-ai-agents"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "Zero Trust für KI-Agenten: Never Trust, Always Verify | ClawGuru Moltbot", "Zero Trust for AI Agents: Never Trust, Always Verify | ClawGuru Moltbot")
  const description = pick(isDE, "Zero-Trust-Architektur für KI-Agenten: jeder Agent muss sich authentifizieren, autorisieren und auditieren lassen — auch interne Agenten. mTLS, Capability-Tokens, Micro-Segmentierung und Continuous Verification mit Moltbot.", "Zero Trust architecture for AI agents: every agent must authenticate, authorize and be audited — including internal agents. mTLS, capability tokens, micro-segmentation and continuous verification with Moltbot.")
  return {
    title, description,
    keywords: ["zero trust ai agents", "zero trust llm", "zero trust moltbot", "never trust always verify ai", "ai agent authentication", "zero trust architecture ai"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const ZT_PRINCIPLES = [
  { num: "1", title: "Verify Explicitly", desc: "Every AI agent call is authenticated — no implicit trust based on network location or agent name. Each agent presents a signed identity token on every request.", impl: "mTLS client certificates for agent identity. JWT capability tokens signed with agent private key. No anonymous agent-to-agent calls." },
  { num: "2", title: "Use Least Privilege Access", desc: "Agents receive only the minimum capabilities required for their specific task. Tool access, data scope, and action permissions are explicitly granted per operation.", impl: "Capability tokens scoped to declared operation. Per-tool allowlists per agent. Time-limited tokens (TTL 5min default). No wildcard permissions." },
  { num: "3", title: "Assume Breach", desc: "Design the system assuming any agent can be compromised at any time. Blast radius must be limited to the agent's declared scope — compromise of one agent must not compromise the system.", impl: "Network micro-segmentation between agents. Memory namespace isolation. No agent can read another agent's memory or credentials. Kill-switch per agent." },
  { num: "4", title: "Continuous Verification", desc: "Trust is not established once at connection time — it is continuously re-evaluated. Long-running agent sessions require periodic re-authentication and scope re-validation.", impl: "Token refresh every N minutes. Behavioral anomaly detection on agent action patterns. Risk score recalculation on every tool call. Auto-suspend on anomaly." },
  { num: "5", title: "Inspect and Log Everything", desc: "All agent actions, all inter-agent communication, all tool calls are logged with cryptographic integrity. No agent has unobserved execution paths.", impl: "Tamper-evident structured logs with hash chain. All inter-agent messages logged before delivery. Tool call input/output hashed. Full trace per user request." },
]

const FAQ = [
  { q: "Why does Zero Trust matter specifically for AI agents?", a: "Traditional Zero Trust was designed for human users accessing resources. AI agents introduce new trust challenges: 1) Agents are non-human — they can't use MFA or recognize social engineering. 2) Agents act autonomously at machine speed — a compromised agent can cause damage orders of magnitude faster than a compromised user. 3) Agents communicate with each other — creating lateral movement paths invisible in human-traffic Zero Trust. 4) Prompt injection can hijack agent identity — an agent following injected instructions is effectively impersonating an attacker. Standard ZTNA tools don't address these AI-specific vectors." },
  { q: "How do capability tokens implement least privilege for AI agents?", a: "A capability token is a short-lived, cryptographically signed JWT that declares exactly what an agent is permitted to do for a specific operation. Example: {agent_id: 'analyst-7', scope: ['read:data.sales_q1', 'write:report.draft'], tools: ['pandas', 'matplotlib'], ttl: 300, issued_by: 'orchestrator', nonce: 'abc123'}. The token is signed by the orchestrator's private key and verified by every service the agent calls. The agent cannot exceed the declared scope — even if prompt-injected to try. Tokens expire after TTL — preventing replay attacks from stale tokens." },
  { q: "What is micro-segmentation for AI agents?", a: "Micro-segmentation places each AI agent in its own network segment with explicit allow-rules for which services it can reach. A summarizer agent might only be allowed to reach: the LLM endpoint and the output storage. It cannot reach the database, secret store, or other agents directly. If the summarizer agent is compromised, the attacker is trapped in that micro-segment — they cannot reach sensitive systems. Implemented with: Kubernetes NetworkPolicy, Linux iptables per-container, or a service mesh (Istio/Linkerd) with per-agent mTLS and authorization policies." },
  { q: "How does Moltbot implement continuous verification for long-running agents?", a: "Moltbot's continuous verification system: 1) Token refresh — capability tokens expire every N minutes; agents must re-request tokens from orchestrator, which re-evaluates current risk context. 2) Behavioral baseline — Moltbot builds a behavioral model of each agent (typical tools used, typical data access patterns, typical response times). Deviation from baseline triggers risk score increase. 3) Risk-threshold actions — at 70/100 risk score, agent is paused and flagged for human review. At 90/100, agent is automatically suspended and all pending actions cancelled." },
]

export default function ZeroTrustAiAgentsPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "Zero Trust AI Agents", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Zero-Trust-Architektur für eigene KI-Systeme.", "Zero Trust architecture guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 7</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "Zero Trust für KI-Agenten", "Zero Trust for AI Agents")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Never Trust, Always Verify — auch für KI-Agenten. Jeder Agent, jeder Tool-Call, jede Agent-zu-Agent-Kommunikation muss explizit authentifiziert, autorisiert und geloggt werden. Kein implizites Vertrauen.", "Never Trust, Always Verify — for AI agents too. Every agent, every tool call, every agent-to-agent message must be explicitly authenticated, authorized and logged. No implicit trust.")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "5", label: pick(isDE, "ZT-Prinzipien", "ZT principles") },
            { value: "5min", label: pick(isDE, "Token-TTL (default)", "Token TTL (default)") },
            { value: "mTLS", label: pick(isDE, "Agent-Identität", "Agent identity") },
            { value: "0", label: pick(isDE, "Implizites Vertrauen", "Implicit trust") },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Die 5 Zero-Trust-Prinzipien für KI-Agenten", "5 Zero Trust Principles for AI Agents")}
          </h2>
          <div className="space-y-4">
            {ZT_PRINCIPLES.map((p) => (
              <div key={p.num} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <div className="bg-cyan-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{p.num}</div>
                  <div className="font-semibold text-gray-100">{p.title}</div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-2">{p.desc}</p>
                  <p className="text-xs text-cyan-300"><span className="font-semibold">Implementation: </span>{p.impl}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Capability Token Beispiel", "Capability Token Example")}
          </h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`# Moltbot orchestrator issues capability tokens per operation:
token = moltbot.issue_token(
    agent_id="analyst-7",
    operation_id="report-2026-q1",
    scope=[
        "read:data.sales_q1_2026",   # Only Q1 2026 sales data
        "write:report.draft.2026q1",  # Only this specific report
    ],
    tools=["pandas", "matplotlib"],   # Only these tools
    forbidden_tools=["bash", "http"], # Explicitly deny
    ttl_seconds=300,                  # 5-minute expiry
    max_tokens=50000,                 # LLM token budget
)

# Every downstream service verifies the token:
# Database: checks scope includes read:data.sales_q1_2026
# LLM Gateway: checks tool allowlist
# Output storage: checks write scope matches report path
# ALL checks cryptographic — no agent can forge a token`}</pre>
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
            <a href={`/${locale}/moltbot/multi-agent-trust`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Multi-Agent Trust</div>
              <div className="text-sm text-gray-300">{pick(isDE, "mTLS zwischen Agenten", "mTLS between agents")}</div>
            </a>
            <a href={`/${locale}/moltbot/agent-memory-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Agent Memory Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Memory-Isolation per Agent", "Memory isolation per agent")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Hub</div>
              <div className="text-sm text-gray-300">OWASP LLM Top 10</div>
            </a>
            <a href={`/${locale}/solutions/zero-trust-architecture`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Zero Trust Architecture</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Zero Trust für die gesamte Infrastruktur", "Zero Trust for full infrastructure")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
