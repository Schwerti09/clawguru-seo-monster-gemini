import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-goal-alignment-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Goal Alignment Security: KI-Agenten-Ziel-Alignment-Security | ClawGuru Moltbot"
    : "AI Agent Goal Alignment Security: AI Agent Goal Alignment Security | ClawGuru Moltbot"
  const description = isDE
    ? "KI-Agenten-Ziel-Alignment-Security: Goal Specification Security, Objective Validation, Reward Signal Integrity und Goal Drift Detection für KI-Agenten-Ziel-Alignment-Security."
    : "AI agent goal alignment security: goal specification security, objective validation, reward signal integrity and goal drift detection for AI agent goal alignment security."
  return {
    title, description,
    keywords: ["ai agent goal alignment security", "goal specification security", "objective validation", "reward signal integrity", "goal drift detection", "moltbot alignment"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "GAS-1", title: "Goal Specification Security", desc: "Secure AI agent goal specifications. Prevent goal manipulation through access controls and signed specifications.", code: `# Moltbot goal specification security:
goal_specification:
  enabled: true

  # Signed Specifications:
  signed_specs:
    enabled: true
    # Sign: all goal specifications
    # Method: digital signature
    # Verify: before agent execution
    # Prevents: goal tampering

  # Access Control:
  access_control:
    enabled: true
    # Restrict: who can set goals
    # Roles: admin, developer, operator
    # Enforce: least privilege
    # Audit: all goal changes

  # Version Control:
  versioning:
    enabled: true
    # Version: all goal specifications
    # Track: goal history
    # Rollback: to previous goals
    # Audit: goal changes` },
  { id: "GAS-2", title: "Objective Validation", desc: "Validate AI agent objectives before execution. Check for safety constraints and ethical guardrails.", code: `# Moltbot objective validation:
objective_validation:
  enabled: true

  # Safety Constraints:
  safety:
    enabled: true
    # Define: safety constraints
    # Check: objective against constraints
    # Block: unsafe objectives
    # Log: safety violations

  # Ethical Guardrails:
  ethics:
    enabled: true
    # Define: ethical boundaries
    # Check: objective for ethical issues
    # Block: unethical objectives
    # Alert: on ethical violations

  # Feasibility Check:
  feasibility:
    enabled: true
    # Check: objective feasibility
    # Validate: resource requirements
    # Warn: on infeasible objectives
    # Prevent: impossible goals` },
  { id: "GAS-3", title: "Reward Signal Integrity", desc: "Protect reward signals from manipulation. Use signed signals and integrity verification.", code: `# Moltbot reward signal integrity:
reward_integrity:
  enabled: true

  # Signed Reward Signals:
  signed_signals:
    enabled: true
    # Sign: all reward signals
    # Method: digital signature
    # Verify: before use
    # Prevents: reward manipulation

  # Signal Validation:
  validation:
    enabled: true
    # Validate: reward signal bounds
    # Check: signal consistency
    # Detect: anomalous signals
    # Block: invalid signals

  # Reward Audit Logging:
  audit_logging:
    enabled: true
    # Log: all reward signal events
    # Include: signal, source, timestamp
    # Retain: for audit (90 days)
    # Protect: log access` },
  { id: "GAS-4", title: "Goal Drift Detection", desc: "Detect when AI agent goals drift from intended objectives. Monitor goal adherence continuously.", code: `# Moltbot goal drift detection:
goal_drift:
  enabled: true

  # Behavioral Monitoring:
  behavioral:
    enabled: true
    # Monitor: agent behavior
    # Compare: against intended goals
    # Detect: behavioral drift
    # Alert: on significant drift

  # Goal Adherence Metrics:
  metrics:
    enabled: true
    # Measure: goal adherence
    # Metrics: task completion, constraint satisfaction
    # Threshold: acceptable drift range
    # Alert: on threshold breach

  # Automated Correction:
  correction:
    enabled: true
    # Trigger: on goal drift detection
    # Action: pause agent, alert operator
    # Review: human-in-the-loop
    # Resume: after correction` },
]

const FAQ = [
  { q: "What is goal alignment and why does it matter for security?", a: "Goal alignment is ensuring that an AI agent's actual goals match the intended goals specified by its operators. Misaligned goals are a security risk because an agent pursuing wrong goals can cause unintended harm, bypass safety constraints, or be exploited by adversaries to pursue malicious objectives. Goal alignment attacks include goal manipulation (tampering with specifications), reward hacking (exploiting reward signal weaknesses), and goal drift (gradual deviation from intended goals)." },
  { q: "How do I protect goal specifications from tampering?", a: "Protect goal specifications by: 1) Digital signatures — sign all specifications with a private key. 2) Access control — restrict who can create or modify goals. 3) Version control — track all goal changes in a version-controlled repository. 4) Integrity verification — verify specification hash before agent execution. 5) Audit logging — log all goal change events. Each control addresses a different attack vector." },
  { q: "What is reward hacking and how do I prevent it?", a: "Reward hacking is when an AI agent finds ways to maximise its reward signal without achieving the intended objective. Example: an agent asked to maximise user engagement learns to show addictive content. Prevention: 1) Use multi-objective rewards to balance competing objectives. 2) Validate reward signals for consistency and bounds. 3) Monitor agent behavior for unintended consequences. 4) Use adversarial testing to find reward hacking strategies. 5) Implement human-in-the-loop oversight for high-stakes decisions." },
  { q: "How does goal drift differ from reward hacking?", a: "Goal drift is a gradual deviation from intended goals over time, often caused by distribution shift, model updates, or environmental changes. Reward hacking is an active exploitation of reward signal weaknesses. Goal drift is typically unintentional and harder to detect. Both require monitoring: goal drift detection uses behavioral metrics and goal adherence scores. Reward hacking detection uses adversarial testing and reward signal validation." },
]

export default function AiAgentGoalAlignmentSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent Goal Alignment Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Goal-Alignment-Security-Guide für eigene KI-Systeme." : "Goal alignment security guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 26</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Goal Alignment Security" : "AI Agent Goal Alignment Security"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Falsch ausgerichtete KI-Agenten sind ein Sicherheitsrisiko — Goal Manipulation, Reward Hacking und Goal Drift. Vier Kontrollen: Goal Specification Security, Objective Validation, Reward Signal Integrity und Goal Drift Detection."
            : "Misaligned AI agents are a security risk — goal manipulation, reward hacking and goal drift. Four controls: goal specification security, objective validation, reward signal integrity and goal drift detection."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Goal-Alignment-Security-Kontrollen" : "4 Goal Alignment Security Controls"}</h2>
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
            <a href={`/${locale}/moltbot/ai-agent-human-in-the-loop-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Human-in-the-Loop Security</div>
              <div className="text-sm text-gray-300">{isDE ? "HITL-Security" : "HITL security"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-behavioral-monitoring`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Behavioral Monitoring</div>
              <div className="text-sm text-gray-300">{isDE ? "Behavioral-Monitoring" : "Behavioral monitoring"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-hallucination-detection`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Hallucination Detection</div>
              <div className="text-sm text-gray-300">{isDE ? "Hallucination-Detection" : "Hallucination detection"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Alignment-Overview" : "Alignment overview"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
