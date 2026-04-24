import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-rbac"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent RBAC: Role-Based Access Control für KI-Agenten | ClawGuru", "AI Agent RBAC: Role-Based Access Control for AI Agents | ClawGuru")
  const description = pick(isDE, "RBAC-Design für KI-Agenten: Rollen, Berechtigungen und Tool-Zugriff nach Least-Privilege-Prinzip. Moltbot RBAC-Konfiguration, Dynamic Permission Scoping und Agent Identity Management.", "RBAC design for AI agents: roles, permissions and tool access following least-privilege principles. Moltbot RBAC configuration, dynamic permission scoping and agent identity management.")
  return {
    title, description,
    keywords: ["ai agent rbac", "llm agent permissions", "ai agent access control", "moltbot rbac", "agent least privilege", "ai agent identity"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const RBAC_ROLES = [
  { role: "read-only-analyst", desc: "Can query data sources and generate reports. No write access to any system.", tools: ["database.query", "files.read", "reports.generate"], denied: ["database.write", "files.write", "api.post", "shell.exec"], color: "green" },
  { role: "support-agent", desc: "Can read customer data, create tickets, send predefined notifications. No access to infrastructure.", tools: ["crm.read", "tickets.create", "notifications.send_template"], denied: ["crm.delete", "billing.modify", "infrastructure.*", "shell.exec"], color: "blue" },
  { role: "ops-agent", desc: "Can read infrastructure state and trigger pre-approved runbooks. No free-form shell access.", tools: ["k8s.get", "k8s.scale_approved", "runbooks.execute_approved", "metrics.read"], denied: ["k8s.delete", "shell.exec", "secrets.read", "iam.modify"], color: "yellow" },
  { role: "security-scanner", desc: "Can scan and report. Cannot modify any security configuration or access sensitive data.", tools: ["trivy.scan", "openclaw.assess", "reports.create"], denied: ["config.modify", "secrets.read", "network.modify", "users.read"], color: "red" },
]

const CONFIG_EXAMPLE = `# Moltbot RBAC configuration
agent_roles:
  read-only-analyst:
    description: "Data analysis agent — read-only"
    tools:
      allowed:
        - database.query
        - files.read
        - reports.generate
      denied:
        - "database.*write*"
        - "files.*write*"
        - "shell.*"
      default_deny: true   # Deny everything not explicitly allowed

  support-agent:
    description: "Customer support agent"
    tools:
      allowed:
        - crm.read
        - tickets.create
        - notifications.send_template
      denied:
        - "crm.delete"
        - "billing.*"
        - "infrastructure.*"
      rate_limits:
        tickets.create: {max: 50, window: "1h"}  # Rate limit sensitive ops
      require_approval:
        - notifications.send_bulk  # Human approval for bulk sends

# Bind agents to roles at deployment time
agents:
  customer-support-prod:
    role: support-agent
    identity:
      type: workload_identity  # K8s ServiceAccount — not API key
      service_account: moltbot-support-agent
      namespace: moltbot-agents`

const FAQ = [
  { q: "Why do AI agents need RBAC instead of just trusting the agent?", a: "AI agents are not deterministic systems — even a well-designed agent can produce unexpected actions due to prompt injection, model drift, or ambiguous instructions. RBAC provides a security layer that is independent of the agent's behavior: even if a prompt injection causes an agent to 'want' to delete a database, the RBAC layer prevents the tool call from executing. This is defense in depth: the agent's prompt hardening tries to prevent malicious behavior, RBAC ensures that even if prompt hardening fails, the blast radius is limited to what the role permits." },
  { q: "How should I scope tool permissions for different agent types?", a: "Follow strict least-privilege: 1) List every tool the agent needs for its normal operation. 2) Start with all denied. 3) Add only the minimum tool permissions for normal operation. 4) For sensitive tools (write, delete, modify): consider requiring human approval or rate limiting. 5) Never grant wildcard permissions (database.*) — enumerate specific operations. 6) Periodically audit: review what tools agents actually used (from audit logs) vs. what they're permitted. Remove unused permissions. The rule: an agent should not be able to do anything that wouldn't be permitted if the worst-case prompt injection succeeds." },
  { q: "How does Moltbot handle agent identity for RBAC?", a: "Moltbot supports three identity types for agents: 1) Workload Identity (recommended for Kubernetes): Kubernetes ServiceAccount → IRSA (AWS) or Workload Identity (GCP/Azure). No API keys stored in the pod. Permissions managed at the RBAC layer. 2) Signed JWT: agent presents a short-lived signed JWT (1-hour TTL) issued by Moltbot's identity service. JWT includes role claim. 3) API Key (not recommended for production): static API key mapped to role. Avoid — keys can be exfiltrated by compromised agents. Moltbot enforces that agents cannot escalate their own permissions — role assignment is only possible via the Moltbot control plane, not from within an agent." },
  { q: "Should different instances of the same agent have different RBAC roles?", a: "Yes, where possible. Context-based role variation: a support agent handling general inquiries vs. one handling VIP/financial customers should have different permission scopes. Environment-based variation: production agents should have more restricted permissions than staging agents. User-context-based variation (dynamic scoping): Moltbot supports dynamic permission scoping — the agent's effective permissions are the intersection of its role permissions and the permissions of the end user it's acting on behalf of. Example: agent role allows crm.read, but if the user only has permission to read their own record, the agent's effective permission is crm.read_own_record only." },
]

export default function AiAgentRbacPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent RBAC", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  const colorMap: Record<string, string> = { green: "bg-green-900 border-green-700", blue: "bg-blue-900 border-blue-700", yellow: "bg-yellow-900 border-yellow-700", red: "bg-red-900 border-red-700" }
  const textMap: Record<string, string> = { green: "text-green-300", blue: "text-blue-300", yellow: "text-yellow-300", red: "text-red-300" }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "RBAC-Leitfaden für eigene KI-Agent-Systeme.", "RBAC guide for your own AI agent systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 9</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "AI Agent RBAC: Role-Based Access Control", "AI Agent RBAC: Role-Based Access Control")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "KI-Agenten brauchen RBAC — nicht weil man ihnen misstraut, sondern weil Prompt Injection passiert. RBAC ist die letzte Verteidigungslinie: selbst ein kompromittierter Agent kann nur tun, was seine Rolle erlaubt.", "AI agents need RBAC — not because you distrust them, but because prompt injection happens. RBAC is the last line of defense: even a compromised agent can only do what its role permits.")}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Standard-Agenten-Rollen", "4 Standard Agent Roles")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RBAC_ROLES.map((r) => (
              <div key={r.role} className={`${colorMap[r.color]} border rounded-lg p-4`}>
                <div className={`font-mono text-sm font-bold ${textMap[r.color]} mb-2`}>{r.role}</div>
                <p className="text-xs text-gray-300 mb-3">{r.desc}</p>
                <div className="text-xs text-green-400 mb-1">✓ {pick(isDE, "Erlaubt:", "Allowed:")}</div>
                <ul className="text-xs text-green-300 mb-2">{r.tools.map((t) => <li key={t}>▸ {t}</li>)}</ul>
                <div className="text-xs text-red-400 mb-1">✗ {pick(isDE, "Blockiert:", "Blocked:")}</div>
                <ul className="text-xs text-red-300">{r.denied.map((d) => <li key={d}>▸ {d}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Moltbot RBAC Konfiguration", "Moltbot RBAC Configuration")}</h2>
          <div className="bg-gray-900 text-green-400 p-5 rounded-lg border border-gray-700 font-mono text-xs overflow-x-auto">
            <pre>{CONFIG_EXAMPLE}</pre>
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
            <a href={`/${locale}/moltbot/zero-trust-ai-agents`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Zero Trust AI Agents</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Capability Tokens", "Capability tokens")}</div>
            </a>
            <a href={`/${locale}/moltbot/secure-agent-deployment`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Secure Agent Deployment</div>
              <div className="text-sm text-gray-300">{pick(isDE, "K8s ServiceAccount Identity", "K8s ServiceAccount identity")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-incident-response`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Incident Response</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Wenn RBAC umgangen wird", "When RBAC gets bypassed")}</div>
            </a>
            <a href={`/${locale}/solutions/zero-trust-architecture`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Zero Trust Architecture</div>
              <div className="text-sm text-gray-300">{pick(isDE, "RBAC im ZT-Kontext", "RBAC in ZT context")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
