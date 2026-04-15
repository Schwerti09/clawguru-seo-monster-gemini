import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-human-in-the-loop-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Human-in-the-Loop Security: KI-Agenten-Human-in-the-Loop-Security | ClawGuru Moltbot"
    : "AI Agent Human-in-the-Loop Security: AI Agent Human-in-the-Loop Security | ClawGuru Moltbot"
  const description = isDE
    ? "KI-Agenten-Human-in-the-Loop-Security: Human Approval Workflow, Override Security, Human Feedback Integrity und Human-Audit-Logging für KI-Agenten-Human-in-the-Loop-Security."
    : "AI agent human-in-the-loop security: human approval workflow, override security, human feedback integrity and human-audit-logging for AI agent human-in-the-loop security."
  return {
    title, description,
    keywords: ["ai agent human in the loop security", "human approval workflow", "override security", "human feedback integrity", "human audit logging", "moltbot hitl"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "HITL-1", title: "Human Approval Workflow", desc: "Require human approval for critical agent actions. Define approval thresholds and escalation paths.", code: `# Moltbot human approval workflow:
human_approval:
  enabled: true

  # Approval thresholds:
  thresholds:
    enabled: true
    # Define: approval thresholds
    # Example: high-risk actions require approval
    # Thresholds: risk level, financial impact
    # Enforce: approval before action

  # Escalation paths:
  escalation:
    enabled: true
    # Define: escalation paths for approval
    # Path: level 1 → level 2 → level 3
    # Timeout: escalate if no response
    # Alert: on escalation

  # Approval tracking:
  tracking:
    enabled: true
    # Track: all approval requests
    # Include: request, approver, decision
    # Retain: for audit (90 days)
    # Protect: approval records` },
  { id: "HITL-2", title: "Override Security", desc: "Secure human override mechanisms. Use authentication, authorisation, and audit logging for overrides.", code: `# Moltbot override security:
override_security:
  enabled: true

  # Override authentication:
  authentication:
    enabled: true
    # Require: authentication for override
    # Method: MFA, SSO
    # Verify: identity before override
    # Prevents: unauthorised override

  # Override authorisation:
  authorisation:
    enabled: true
    # Check: override permissions
    # Roles: only authorised users can override
    # Enforce: least privilege
    # Prevents: unauthorised override

  # Override audit logging:
  audit_logging:
    enabled: true
    # Log: all override events
    # Include: user, action, reason
    # Retain: logs for audit (90 days)
    # Protect: log access` },
  { id: "HITL-3", title: "Human Feedback Integrity", desc: "Protect human feedback from tampering. Use signed feedback and integrity verification.", code: `# Moltbot human feedback integrity:
feedback_integrity:
  enabled: true

  # Signed feedback:
  signed_feedback:
    enabled: true
    # Sign: human feedback
    # Method: digital signature
    # Verify: signature before use
    # Prevents: feedback tampering

  # Feedback integrity verification:
  integrity_verification:
    enabled: true
    # Verify: feedback integrity
    # Method: hash verification
    # Block: tampered feedback
    # Prevents: feedback corruption

  # Feedback audit logging:
  audit_logging:
    enabled: true
    # Log: all feedback events
    # Include: feedback, user, timestamp
    # Retain: logs for audit (90 days)
    # Protect: log access` },
  { id: "HITL-4", title: "Human-Audit-Logging", desc: "Log all human-in-the-loop events for audit. Track approvals, overrides, and feedback.", code: `# Moltbot human-audit-logging:
human_audit_logging:
  enabled: true

  # Approval logging:
  approval_logging:
    enabled: true
    # Log: all approval events
    # Include: request, approver, decision
    # Retain: logs for audit (90 days)
    # Protect: log access

  # Override logging:
  override_logging:
    enabled: true
    # Log: all override events
    # Include: user, action, reason
    # Retain: logs for audit (90 days)
    # Protect: log access

  # Feedback logging:
  feedback_logging:
    enabled: true
    # Log: all feedback events
    # Include: feedback, user, timestamp
    # Retain: logs for audit (90 days)
    # Protect: log access` },
]

const FAQ = [
  { q: "What is the difference between human approval workflow and override security?", a: "Human approval workflow is a proactive control that requires human approval before an agent can take certain actions. This is typically used for high-risk actions. Override security is a reactive control that allows humans to override agent decisions after they are made. Approval workflow prevents unauthorised actions. Override security allows correction of agent errors. Both are necessary: approval workflow prevents bad actions, override security allows correction when mistakes happen." },
  { q: "How do I protect human feedback from tampering?", a: "Protect human feedback by: 1) Signing feedback — digitally sign feedback to ensure integrity. 2) Verifying signatures — verify signatures before using feedback for training. 3) Integrity verification — hash verification to detect tampering. 4) Audit logging — log all feedback events for compliance. 5) Access control — restrict who can provide feedback. Each control addresses a different aspect of feedback security." },
  { q: "How do I set effective approval thresholds?", a: "Effective approval thresholds balance security with usability: 1) Start with conservative thresholds (e.g., approve all actions above $1000). 2) Define risk categories (low, medium, high). 3) Map risk categories to approval levels. 4) Implement escalation paths for timeout. 5) Monitor approval patterns and adjust thresholds. 6) Regularly review and update thresholds as usage evolves. 7) Document approval policies for compliance." },
  { q: "What are common human-in-the-loop attack vectors?", a: "Common human-in-the-loop attack vectors: 1) Approval bypass — bypass approval workflow through technical means. 2) Override abuse — abuse override mechanism to take unauthorised actions. 3) Feedback tampering — tamper with human feedback to influence model. 4) Approval spoofing — spoof approval from legitimate user. 5) Feedback injection — inject malicious feedback. Defense: human approval workflow, override security, human feedback integrity, audit logging." },
]

export default function AiAgentHumanInTheLoopSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent Human-in-the-Loop Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Human-in-the-Loop-Security-Guide für eigene KI-Systeme." : "Human-in-the-loop security guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 25</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Human-in-the-Loop Security" : "AI Agent Human-in-the-Loop Security"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "KI-Agenten ohne Human-in-the-Loop-Security sind anfällig für HITL-Attacken — ohne Human-in-the-Loop-Security bleibt HITL ungeschützt. Vier Kontrollen: Human Approval Workflow, Override Security, Human Feedback Integrity und Human-Audit-Logging."
            : "AI agents without human-in-the-loop security are vulnerable to HITL attacks — without human-in-the-loop security, HITL remains unprotected. Four controls: human approval workflow, override security, human feedback integrity and human-audit-logging."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Human-in-the-Loop-Security-Kontrollen" : "4 Human-in-the-Loop Security Controls"}</h2>
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
            <a href={`/${locale}/moltbot/ai-agent-behavioral-monitoring`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Behavioral Monitoring</div>
              <div className="text-sm text-gray-300">{isDE ? "Behavioral-Monitoring" : "Behavioral monitoring"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-orchestration-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Orchestration Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Orchestration-Security" : "Orchestration security"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-bias-detection-mitigation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Bias Detection & Mitigation</div>
              <div className="text-sm text-gray-300">{isDE ? "Bias-Mitigation" : "Bias mitigation"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "HITL-Overview" : "HITL overview"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
