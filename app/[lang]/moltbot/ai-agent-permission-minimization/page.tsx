import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-permission-minimization"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Permission Minimization: Least Privilege für KI-Agenten 2026 | ClawGuru", "AI Agent Permission Minimization: Least Privilege for AI Agents 2026 | ClawGuru")
  const description = pick(isDE, "Least-Privilege-Prinzip für KI-Agenten: Tool-Allowlists, dynamische Permission-Scoping, Just-in-Time-Zugriff und Moltbot-RBAC-Konfiguration für sichere AI-Agent-Deployments 2026.", "Least privilege for AI agents: tool allowlists, dynamic permission scoping, just-in-time access, and Moltbot RBAC configuration for secure AI agent deployments 2026.")
  return {
    title, description,
    keywords: ["ai agent permission minimization", "least privilege ai agents", "ai agent rbac", "moltbot permission control", "llm tool access control", "ai agent security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const STEPS = [
  {
    num: "1",
    title: (isDE: boolean) => pick(isDE, "Tool-Allowlists pro Agent definieren", "Define Per-Agent Tool Allowlists"),
    desc: (isDE: boolean) => pick(isDE, "Jeder Agent bekommt nur die Tools, die er für seine spezifische Aufgabe benötigt — nicht alle verfügbaren Tools.", "Each agent receives only the tools required for its specific task — not all available tools."),
    code: `# Moltbot agent permission config
agents:
  data-analyst:
    allowed_tools:
      - read_csv
      - compute_statistics
      - generate_chart
    denied_tools:
      - write_file
      - execute_code
      - http_request
    data_access:
      - "s3://analytics-bucket/reports/**"  # read-only
    denied_data:
      - "s3://prod-secrets/**"
      - "s3://customer-pii/**"

  customer-support:
    allowed_tools:
      - search_knowledge_base
      - create_ticket
      - read_order_status
    denied_tools:
      - delete_order
      - modify_billing
      - access_admin_panel`,
  },
  {
    num: "2",
    title: (isDE: boolean) => pick(isDE, "Dynamisches Permission-Scoping", "Dynamic Permission Scoping"),
    desc: (isDE: boolean) => pick(isDE, "Berechtigungen werden zur Laufzeit basierend auf dem aktuellen Task eingeschränkt — nicht statisch zur Deploy-Zeit.", "Permissions are restricted at runtime based on the current task — not statically at deploy time."),
    code: `# Moltbot dynamic scoping
permission_scoping:
  enabled: true
  strategy: task_based

  task_definitions:
    - task: "summarize_document"
      max_permissions:
        - read_document
        - generate_text
      forbidden:
        - external_http
        - file_write

    - task: "send_notification"
      max_permissions:
        - send_email
        - read_user_preferences
      scope_limit:
        recipients: "verified_users_only"
        rate_limit: "10/hour"

  escalation:
    requires_human_approval: true
    approval_timeout: 300s`,
  },
  {
    num: "3",
    title: (isDE: boolean) => pick(isDE, "Just-in-Time (JIT) Zugriff", "Just-in-Time (JIT) Access"),
    desc: (isDE: boolean) => pick(isDE, "Privilegierte Berechtigungen werden nur für die Dauer einer spezifischen Aufgabe erteilt und danach automatisch entzogen.", "Privileged permissions are granted only for the duration of a specific task, then automatically revoked."),
    code: `# Moltbot JIT access config
jit_access:
  enabled: true

  privileged_tools:
    - name: database_write
      max_duration: 300s
      requires_reason: true
      auto_revoke: true
      audit_all_calls: true

    - name: admin_api
      max_duration: 60s
      requires_human_approval: true
      approval_channel: "slack://security-team"
      log_level: verbose

  default_deny: true
  escalation_audit: true
  revocation_on_anomaly: true`,
  },
  {
    num: "4",
    title: (isDE: boolean) => pick(isDE, "Permission Drift Monitoring", "Permission Drift Monitoring"),
    desc: (isDE: boolean) => pick(isDE, "Automatische Erkennung wenn Agenten mehr Berechtigungen nutzen als ursprünglich definiert.", "Automatic detection when agents use more permissions than originally defined."),
    code: `# Moltbot permission drift detection
drift_monitoring:
  enabled: true
  baseline_window: 7d

  alerts:
    - condition: "tool_usage > baseline * 1.5"
      severity: warning
      action: notify

    - condition: "new_tool_accessed_not_in_allowlist"
      severity: critical
      action: block_and_alert

    - condition: "permission_escalation_attempt"
      severity: critical
      action: terminate_session

  reports:
    schedule: "0 9 * * 1"  # weekly Monday 9am
    recipients: ["security@example.com"]
    include: ["permission_changes", "drift_events", "blocked_attempts"]`,
  },
  {
    num: "5",
    title: (isDE: boolean) => pick(isDE, "Cross-Agent Permission Isolation", "Cross-Agent Permission Isolation"),
    desc: (isDE: boolean) => pick(isDE, "Agenten dürfen ihre Berechtigungen nicht an andere Agenten weitergeben — jede Agent-Instanz hat ihre eigenen, isolierten Rechte.", "Agents must not delegate their permissions to other agents — each agent instance has its own isolated rights."),
    code: `# Moltbot cross-agent isolation
agent_isolation:
  permission_delegation: false  # agents cannot grant perms to sub-agents
  sub_agent_inherit: false       # sub-agents start with zero permissions

  orchestrator_rules:
    - rule: "orchestrator_cannot_exceed_own_permissions"
      enforced: true
    - rule: "tool_call_on_behalf_requires_explicit_scope"
      enforced: true
    - rule: "no_permission_laundering_via_sub_agents"
      enforced: true

  audit:
    log_all_cross_agent_calls: true
    log_permission_context: true`,
  },
]

const FAQ = [
  {
    q: "Why is permission minimization especially important for AI agents?",
    a: "AI agents are more dangerous than traditional software for three reasons: 1) Autonomy — agents make decisions and take actions without human approval for each step. A misconfigured agent with too many permissions can cause large-scale damage automatically. 2) Prompt injection — an attacker can inject instructions into content the agent processes, effectively hijacking the agent's actions. If the agent has write access to production databases, the attacker does too. 3) Emergent behavior — LLMs sometimes take unexpected paths to achieve goals. Minimum permissions limit the blast radius of unexpected behavior. Rule of thumb: give agents exactly the permissions they need for their stated task, nothing more.",
  },
  {
    q: "How do I implement least privilege for an AI agent that needs many tools?",
    a: "For agents that legitimately need many tools: 1) Task-based scoping — break the agent into sub-tasks, each with its own permission set. The orchestrator only grants sub-agent permissions for the current task. 2) Time-limited access — grant broad permissions for a specific job window (e.g., 5 minutes for a data migration task), then automatically revoke. 3) Read-before-write — by default agents get read-only access. Write access requires explicit justification and JIT grant. 4) Staged execution — for high-risk actions, require a planning phase (read-only) and an execution phase (write access, human-approved). 5) Audit everything — if you cannot reduce permissions, at minimum log every tool call with full context.",
  },
  {
    q: "What is permission laundering in multi-agent systems?",
    a: "Permission laundering is when Agent A (with limited permissions) delegates a task to Agent B (with broader permissions) to indirectly gain access it shouldn't have. Example: Customer support agent (can only read orders) asks the admin agent (can delete orders) to 'clean up a test order' — effectively the low-privilege agent causes a high-privilege action. Prevention: 1) Moltbot enforces that orchestrators cannot grant sub-agents more permissions than they themselves have. 2) All cross-agent calls are logged with the originating agent's permission context. 3) Sub-agents always start with zero permissions and must be explicitly granted a scoped set for each task.",
  },
  {
    q: "How often should I review AI agent permissions?",
    a: "Permission review cadence: 1) Weekly — automated drift monitoring report (Moltbot generates this automatically). Review any new tools accessed or permission escalations. 2) Monthly — full permission audit: compare current allowlists against actual usage. Prune unused permissions. 3) On every code change — any change to agent logic should trigger a permission review. Add permission review to CI/CD pipeline. 4) After every security incident — re-evaluate all agent permissions after any incident, even if unrelated. 5) Annually — full red-team exercise against agent permission boundaries. The most common finding: permissions granted during development that were never revoked in production.",
  },
]

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Implement Permission Minimization for AI Agents",
  description: "Step-by-step guide to applying least privilege principles to AI agents using Moltbot.",
  step: [
    { "@type": "HowToStep", position: 1, name: "Define Per-Agent Tool Allowlists", text: "Enumerate exact tools each agent needs. Deny all others explicitly." },
    { "@type": "HowToStep", position: 2, name: "Implement Dynamic Scoping", text: "Restrict permissions at runtime based on current task type." },
    { "@type": "HowToStep", position: 3, name: "Enable JIT Access", text: "Grant privileged permissions only for task duration, auto-revoke after." },
    { "@type": "HowToStep", position: 4, name: "Monitor Permission Drift", text: "Alert when agents access tools outside their baseline usage pattern." },
    { "@type": "HowToStep", position: 5, name: "Enforce Cross-Agent Isolation", text: "Prevent permission delegation between agents. Sub-agents start with zero permissions." },
  ],
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
}

export default function AiAgentPermissionMinimizationPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-5xl mx-auto px-4 py-16">
        <nav className="text-sm text-gray-500 mb-8">
          <a href={`/${locale}`} className="hover:text-cyan-400">ClawGuru</a>
          <span className="mx-2">/</span>
          <a href={`/${locale}/moltbot-hardening`} className="hover:text-cyan-400">Moltbot</a>
          <span className="mx-2">/</span>
          <span className="text-gray-300">AI Agent Permission Minimization</span>
        </nav>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for securing your own AI agent deployments. No attack tools.
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "AI Agent Permission Minimization: Least Privilege 2026", "AI Agent Permission Minimization: Least Privilege 2026")}
        </h1>
        <p className="text-lg text-gray-300 mb-10">
          {pick(isDE, "KI-Agenten mit zu vielen Berechtigungen sind ein Multiplikator für jeden Angriff. Prompt Injection, unerwartetes Verhalten oder kompromittierte Modelle — der Blast Radius hängt direkt von den vergebenen Rechten ab. Least Privilege ist das wichtigste Sicherheitsprinzip für autonome Agenten.", "AI agents with excessive permissions are a force multiplier for every attack. Prompt injection, unexpected behavior, or compromised models — the blast radius depends directly on the permissions granted. Least privilege is the most important security principle for autonomous agents.")}
        </p>

        {STEPS.map((step) => (
          <section key={step.num} className="mb-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{step.num}</div>
                <h2 className="text-xl font-semibold text-gray-100">{step.title(isDE)}</h2>
              </div>
              <p className="text-gray-300 text-sm mb-4">{step.desc(isDE)}</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs whitespace-pre-wrap">{step.code}</pre>
              </div>
            </div>
          </section>
        ))}

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Häufige Fragen", "Frequently Asked Questions")}
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
            {pick(isDE, "Weiterführende Ressourcen", "Further Resources")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/ai-agent-rbac`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent RBAC</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Rollenbasierte Zugriffskontrolle", "Role-based access control for agents")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-sandboxing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Sandboxing</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Runtime-Isolation für Agenten", "Runtime isolation for AI agents")}</div>
            </a>
            <a href={`/${locale}/solutions/zero-trust-ai-architecture`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Zero Trust AI Architecture</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Zero Trust für KI-Systeme", "Zero Trust principles for AI")}</div>
            </a>
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Security Check starten", "Start Security Check")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Agent-Berechtigungen in 30s prüfen", "Audit agent permissions in 30s")}</div>
            </a>
          </div>
        </section>

        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-cyan-300 mb-2">
            {pick(isDE, "Agent-Berechtigungen automatisch erzwingen?", "Enforce agent permissions automatically?")}
          </h2>
          <p className="text-gray-300 mb-4 text-sm">
            {pick(isDE, "Moltbot erzwingt Least Privilege, JIT-Zugriff und Permission-Drift-Alerts für alle deine KI-Agenten.", "Moltbot enforces least privilege, JIT access, and permission drift alerts for all your AI agents.")}
          </p>
          <a href={`/${locale}/securitycheck`} className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-lg transition-colors">
            {pick(isDE, "🛡️ Kostenloser Security Check", "🛡️ Free Security Check")}
          </a>
        </div>
      </div>
    </div>
  )
}
