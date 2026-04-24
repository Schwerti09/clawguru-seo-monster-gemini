import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-orchestration-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Orchestration Security: KI-Agenten-Orchestration-Security | ClawGuru Moltbot", "AI Agent Orchestration Security: AI Agent Orchestration Security | ClawGuru Moltbot")
  const description = pick(isDE, "KI-Agenten-Orchestration-Security: Orchestration Authentication, Workflow Security, Agent Coordination Security und Orchestration Audit Logging für KI-Agenten-Orchestration-Security.", "AI agent orchestration security: orchestration authentication, workflow security, agent coordination security and orchestration audit logging for AI agent orchestration security.")
  return {
    title, description,
    keywords: ["ai agent orchestration security", "orchestration authentication", "workflow security", "agent coordination", "orchestration audit", "moltbot orchestration"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "AOS-1", title: "Orchestration Authentication", desc: "Authenticate all orchestration requests. Use API keys, OAuth, or mutual TLS for secure orchestration.", code: `# Moltbot orchestration authentication:
orchestration_auth:
  enabled: true

  # API key authentication:
  api_key:
    enabled: true
    # Require: API key for orchestration
    # Validate: key on every request
    # Rotate: keys periodically
    # Revoke: compromised keys

  # OAuth authentication:
  oauth:
    enabled: true
    # Use: OAuth 2.0 for orchestration
    # Scope: limit orchestration permissions
    # Token: validate token on every request
    # Refresh: token refresh mechanism

  # Mutual TLS:
  mTLS:
    enabled: true
    # Require: client certificates
    # Validate: certificate on every request
    # Revoke: compromised certificates
    # Use: for high-security orchestration` },
  { id: "AOS-2", title: "Workflow Security", desc: "Secure agent workflows against tampering. Use signed workflows and integrity verification.", code: `# Moltbot workflow security:
workflow_security:
  enabled: true

  # Signed workflows:
  signed_workflows:
    enabled: true
    # Sign: workflows before deployment
    # Method: digital signature
    # Verify: signature before execution
    # Prevents: workflow tampering

  # Workflow integrity verification:
  integrity_verification:
    enabled: true
    # Verify: workflow integrity
    # Method: hash verification, checksum
    # Block: tampered workflows

  # Workflow isolation:
  isolation:
    enabled: true
    # Isolate: workflow execution
    # Use: containers, sandboxes
    # Prevents: workflow interference` },
  { id: "AOS-3", title: "Agent Coordination Security", desc: "Secure agent-to-agent communication. Use encrypted channels and authentication.", code: `# Moltbot agent coordination security:
coordination_security:
  enabled: true

  # Encrypted communication:
  encryption:
    enabled: true
    # Encrypt: agent-to-agent communication
    # Method: TLS, mTLS
    # Verify: certificates
    # Prevents: eavesdropping

  # Agent authentication:
  agent_auth:
    enabled: true
    # Authenticate: agents before coordination
    # Method: API keys, certificates
    # Verify: identity on every request
    # Prevents: unauthorized coordination

  # Authorization:
  authorization:
    enabled: true
    # Authorize: agent actions
    # Check: agent permissions
    # Enforce: least privilege
    # Prevents: unauthorized actions` },
  { id: "AOS-4", title: "Orchestration Audit Logging", desc: "Log all orchestration events for audit. Track workflow execution and agent coordination.", code: `# Moltbot orchestration audit logging:
audit_logging:
  enabled: true

  # Workflow execution logging:
  workflow_logging:
    enabled: true
    # Log: workflow execution events
    # Include: workflow ID, agent, action, result
    # Retain: logs for audit (90 days)
    # Protect: log access

  # Agent coordination logging:
  coordination_logging:
    enabled: true
    # Log: agent coordination events
    # Include: agents, messages, actions
    # Retain: logs for audit (90 days)
    # Protect: log access

  # Orchestration event logging:
  event_logging:
    enabled: true
    # Log: all orchestration events
    # Include: timestamp, user, action, result
    # Retain: logs for audit (90 days)
    # Protect: log access` },
]

const FAQ = [
  { q: "What is the difference between orchestration authentication and agent authentication?", a: "Orchestration authentication authenticates the orchestration system itself — the component that manages and coordinates agents. This ensures that only authorised orchestration systems can manage agents. Agent authentication authenticates individual agents — ensuring that only authorised agents can participate in orchestration. Both are necessary: orchestration authentication protects the orchestration system, agent authentication protects the agent ecosystem. Orchestration authentication is typically handled by API keys or OAuth. Agent authentication is typically handled by certificates or API keys." },
  { q: "How does workflow security protect against tampering?", a: "Workflow security protects against tampering by: 1) Signing workflows before deployment — digital signatures verify workflow integrity. 2) Verifying signatures before execution — ensures only authorised workflows run. 3) Isolating workflow execution — containers or sandboxes prevent interference. 4) Logging workflow execution — audit trail for compliance. Combined, these controls ensure that workflows cannot be tampered with without detection." },
  { q: "How do I secure agent coordination?", a: "Secure agent coordination requires: 1) Encrypted communication — TLS or mTLS for all agent-to-agent communication. 2) Agent authentication — verify agent identity before coordination. 3) Authorization — check agent permissions before allowing actions. 4) Audit logging — log all coordination events. 5) Rate limiting — prevent abuse. 6) Monitoring — detect suspicious coordination patterns. Each control addresses a different aspect of coordination security." },
  { q: "What are common orchestration attack vectors?", a: "Common orchestration attack vectors: 1) Orchestration authentication bypass — unauthorised orchestration access. 2) Workflow tampering — modify workflows to execute malicious actions. 3) Agent impersonation — impersonate legitimate agents. 4) Coordination interception — intercept or modify agent communication. 5) Orchestration DoS — overload orchestration system. Defense: orchestration authentication, workflow security, agent coordination security, audit logging, rate limiting." },
]

export default function AiAgentOrchestrationSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent Orchestration Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Orchestration-Security-Guide für eigene KI-Systeme.", "Orchestration security guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 24</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "AI Agent Orchestration Security", "AI Agent Orchestration Security")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "KI-Agenten ohne Orchestration-Security sind anfällig für Orchestration-Attacken — ohne Orchestration-Security bleibt Orchestration ungeschützt. Vier Kontrollen: Orchestration Authentication, Workflow Security, Agent Coordination Security und Orchestration Audit Logging.", "AI agents without orchestration security are vulnerable to orchestration attacks — without orchestration security, orchestration remains unprotected. Four controls: orchestration authentication, workflow security, agent coordination security and orchestration audit logging.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Orchestration-Security-Kontrollen", "4 Orchestration Security Controls")}</h2>
          <div className="space-y-5">
            {CONTROLS.map((c) => (
              <div key={c.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{c.id}</span>
                  <span className="font-bold text-gray-100">{c.title}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-3">{c.desc}</p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto"><pre>{c.code}</pre></div>
                </div>
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
            <a href={`/${locale}/moltbot/ai-agent-secure-deployment`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Secure Deployment</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Deployment-Security", "Deployment security")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-communication-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Communication Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Communication-Security", "Communication security")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-audit-logging`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Audit Logging</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Audit-Logging", "Audit logging")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Orchestration-Overview", "Orchestration overview")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
