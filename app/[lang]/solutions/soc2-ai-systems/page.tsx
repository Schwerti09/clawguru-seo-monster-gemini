import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/soc2-ai-systems"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "SOC 2 für KI-Systeme: SOC 2 Compliance für AI-Systeme | ClawGuru Solutions", "SOC 2 for AI Systems: SOC 2 Compliance for AI Systems | ClawGuru Solutions")
  const description = pick(isDE, "SOC 2 Compliance für KI-Systeme: Trust Services Criteria, Audit Trail, Access Control und Incident Response für SOC 2 Type II. Executable Runbooks für Self-Hosted AI-Infrastruktur.", "SOC 2 compliance for AI systems: Trust Services Criteria, audit trail, access control and incident response for SOC 2 Type II. Executable runbooks for self-hosted AI infrastructure.")
  return {
    title, description,
    keywords: ["soc 2 ai systems", "soc 2 type ii", "ai compliance", "trust services criteria", "audit trail", "incident response", "clawguru solutions"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "SOC2-1", title: "Trust Services Criteria Mapping", desc: "Map AI system controls to SOC 2 Trust Services Criteria. Address Security, Availability, and Confidentiality.", code: `# SOC 2 TSC Mapping for AI Systems:
trust_services_criteria:
  enabled: true

  # Security Criteria:
  security:
    enabled: true
    # CC1.1: Control Environment
    # - Define AI security governance
    # - Establish AI risk management
    # - Document AI security policies

    # CC2.1: Communication and Information
    # - Document AI system architecture
    # - Communicate AI security controls
    # - Report AI security incidents

    # CC3.1: Risk Assessment
    # - Identify AI security risks
    # - Assess AI threat landscape
    # - Document AI risk mitigations

  # Availability Criteria:
  availability:
    enabled: true
    # A1.1: Availability Monitoring
    # - Monitor AI service availability
    # - Track AI model performance
    # - Alert on AI service degradation

    # A2.1: Availability Incident Response
    # - Define AI incident response
    # - Document AI recovery procedures
    # - Test AI disaster recovery

  # Confidentiality Criteria:
  confidentiality:
    enabled: true
    # C1.1: Confidentiality Policies
    # - Define AI data classification
    # - Document AI data handling
    # - Enforce AI data privacy` },
  { id: "SOC2-2", title: "AI Audit Trail", desc: "Implement comprehensive audit trail for AI systems. Log model access, data usage, and decisions.", code: `# SOC 2 AI Audit Trail:
audit_trail:
  enabled: true

  # Model Access Logging:
  model_access:
    enabled: true
    # Log: all model access events
    # Include: user, model, timestamp
    # Retain: logs for audit (90 days)
    # Protect: log integrity

  # Data Usage Logging:
  data_usage:
    enabled: true
    # Log: all data usage events
    # Include: data source, purpose, consent
    # Retain: logs for audit (90 days)
    # Protect: data privacy

  # Decision Logging:
  decision_logging:
    enabled: true
    # Log: all AI decisions
    # Include: input, output, confidence
    # Retain: logs for audit (90 days)
    # Protect: decision accountability` },
  { id: "SOC2-3", title: "Access Control", desc: "Implement role-based access control for AI systems. Enforce least privilege and regular access reviews.", code: `# SOC 2 Access Control for AI Systems:
access_control:
  enabled: true

  # Role-Based Access Control:
  rbac:
    enabled: true
    # Define: AI system roles
    # Roles: admin, developer, auditor, user
    # Grant: least privilege
    # Review: quarterly

  # MFA Enforcement:
  mfa:
    enabled: true
    # Require: MFA for privileged access
    # Methods: TOTP, hardware keys
    # Enforce: for all admin access
    # Monitor: MFA bypass attempts

  # Access Reviews:
  access_reviews:
    enabled: true
    # Conduct: quarterly access reviews
    # Revoke: unnecessary access
    # Document: review results
    # Approve: by manager` },
  { id: "SOC2-4", title: "Incident Response", desc: "Implement AI-specific incident response. Document procedures, test regularly, and improve continuously.", code: `# SOC 2 AI Incident Response:
incident_response:
  enabled: true

  # Incident Response Plan:
  plan:
    enabled: true
    # Document: AI incident response procedures
    # Define: AI incident classification
    # Establish: AI incident response team
    # Test: annually

  # Incident Detection:
  detection:
    enabled: true
    # Monitor: AI system anomalies
    # Detect: AI model drift
    # Alert: on suspicious AI behavior
    # Investigate: promptly

  # Incident Response:
  response:
    enabled: true
    # Contain: AI incident impact
    # Eradicate: AI incident root cause
    # Recover: AI system operations
    # Post-mortem: document lessons learned` },
]

const FAQ = [
  { q: "What is the difference between SOC 2 Type I and Type II for AI systems?", a: "SOC 2 Type I is a point-in-time assessment of AI system controls. It evaluates whether controls are designed effectively at a specific date. SOC 2 Type II is a period assessment (typically 6-12 months) that evaluates whether controls were operating effectively over time. Type II is more comprehensive and required for most AI deployments. Type I is useful for initial assessments, Type II for ongoing compliance. AI systems typically require Type II because AI models and data change over time." },
  { q: "How do I map AI-specific controls to SOC 2 Trust Services Criteria?", a: "Map AI controls to SOC 2 TSC by: 1) Security — AI governance, risk management, access control. 2) Availability — AI service monitoring, disaster recovery. 3) Confidentiality — AI data classification, encryption, privacy. 4) Processing Integrity — AI model validation, data quality. 5) Privacy — AI consent management, data subject rights. Document mappings in your SOC 2 compliance matrix." },
  { q: "What audit trail is required for SOC 2 AI compliance?", a: "SOC 2 AI audit trail requires: 1) Model access logging — who accessed which AI models. 2) Data usage logging — what data was used for training/inference. 3) Decision logging — AI decisions with input/output/confidence. 4) Configuration logging — AI model and system configuration changes. 5) Incident logging — AI security incidents and responses. Logs must be immutable, tamper-evident, and retained for 90 days minimum." },
  { q: "How does ClawGuru help with SOC 2 AI compliance?", a: "ClawGuru provides executable runbooks for SOC 2 AI compliance: 1) Pre-built controls mapped to SOC 2 TSC. 2) Automated audit trail generation. 3) Access control templates for AI systems. 4) AI-specific incident response procedures. 5) Continuous monitoring and alerting. 6) Evidence collection and reporting. ClawGuru reduces SOC 2 preparation time from months to weeks." },
]

export default function Soc2AiSystemsPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "SOC 2 for AI Systems", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "SOC 2 Compliance-Guide für eigene KI-Systeme.", "SOC 2 compliance guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · Batch 8</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "SOC 2 für KI-Systeme", "SOC 2 for AI Systems")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "SOC 2 Compliance für KI-Systeme: Trust Services Criteria, Audit Trail, Access Control und Incident Response für SOC 2 Type II. Executable Runbooks für Self-Hosted AI-Infrastruktur.", "SOC 2 compliance for AI systems: Trust Services Criteria, audit trail, access control and incident response for SOC 2 Type II. Executable runbooks for self-hosted AI infrastructure.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 SOC 2 Compliance-Kontrollen", "4 SOC 2 Compliance Controls")}</h2>
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
            <a href={`/${locale}/moltbot/ai-agent-audit-logging`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Audit Logging</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Audit-Logging", "Audit logging")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-model-access-control`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Model Access Control</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Access-Control", "Access control")}</div>
            </a>
            <a href={`/${locale}/solutions`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">All Solutions</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Solutions-Übersicht", "Solutions overview")}</div>
            </a>
            <a href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Live-Check", "Live check")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
