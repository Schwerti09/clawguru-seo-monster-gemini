import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-injection-response"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Injection Response: LLM-Injection-Response | ClawGuru Moltbot", "LLM Injection Response: LLM Injection Response | ClawGuru Moltbot")
  const description = pick(isDE, "LLM-Injection-Response: Automated Injection Response, Incident Triage, Recovery Playbooks und Post-Incident Analysis für Prompt-Injection-Vorfälle.", "LLM injection response: automated injection response, incident triage, recovery playbooks and post-incident analysis for prompt injection incidents.")
  return {
    title, description,
    keywords: ["llm injection response", "prompt injection incident response", "jailbreak response", "llm security incident", "injection recovery", "moltbot incident response"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const RESPONSE_CONTROLS = [
  { id: "IR-1", title: "Automated Injection Response", desc: "Automatically respond to detected prompt injection attempts. Block, flag, or redirect based on severity and context.", code: `# Moltbot automated injection response:
automated_response:
  enabled: true

  # Response actions by severity:
  severity_based:
    critical:
      action: block_and_alert
      # Block request, alert security team, log incident
      block_duration_hours: 24
      # Block user for 24 hours

    high:
      action: block
      # Block request, log incident
      block_duration_hours: 1

    medium:
      action: flag
      # Flag for review, allow request with disclaimer
      add_disclaimer: true

    low:
      action: log
      # Log for monitoring, allow request

  # Context-based response:
  context_aware:
    enabled: true
    # Consider: user history, use case, data sensitivity
    # Escalate response for high-value targets or sensitive data` },
  { id: "IR-2", title: "Incident Triage", desc: "Triage injection incidents to determine severity and impact. Prioritise response based on data sensitivity and user intent.", code: `# Moltbot incident triage:
incident_triage:
  enabled: true

  # Triage criteria:
  criteria:
    # Data sensitivity:
    data_sensitivity:
      public: priority low
      internal: priority medium
      confidential: priority high
      restricted: priority critical

    # User intent:
    user_intent:
      accidental: priority low
      curious: priority medium
      malicious: priority critical

    # Success of injection:
    injection_success:
      failed: priority low
      partial: priority medium
      full: priority critical

  # Triage workflow:
  workflow:
    # 1. Auto-triage based on criteria
    # 2. Assign priority and severity
    # 3. Route to appropriate response team
    # 4. Track resolution time
    auto_triage: true

  # SLA by priority:
  sla:
    critical: response_within_minutes: 15
    high: response_within_minutes: 60
    medium: response_within_hours: 4
    low: response_within_hours: 24` },
  { id: "IR-3", title: "Recovery Playbooks", desc: "Implement recovery playbooks for common injection scenarios. Automated steps to restore service and prevent recurrence.", code: `# Moltbot recovery playbooks:
recovery_playbooks:
  enabled: true

  # Playbook: Jailbreak detected
  jailbreak_detected:
    steps:
      - name: "Block user session"
        action: revoke_session
      - name: "Block user IP"
        action: block_ip
        duration_hours: 24
      - name: "Review recent activity"
        action: review_user_activity
        lookback_hours: 24
      - name: "Escalate to security team"
        action: alert_security
        severity: high

  # Playbook: Data extraction attempt
  data_extraction_attempt:
    steps:
      - name: "Block request"
        action: block_request
      - name: "Audit data access"
        action: audit_data_access
      - name: "Notify data owner"
        action: notify_data_owner
      - name: "Escalate to compliance"
        action: alert_compliance

  # Playbook: System prompt extraction
  system_prompt_extraction:
    steps:
      - name: "Block request"
        action: block_request
      - name: "Rotate system prompt"
        action: rotate_system_prompt
      - name: "Review model configuration"
        action: review_model_config
      - name: "Escalate to security team"
        action: alert_security
        severity: critical` },
  { id: "IR-4", title: "Post-Incident Analysis", desc: "Analyse injection incidents after resolution to identify root causes and prevent recurrence. Generate reports for compliance.", code: `# Moltbot post-incident analysis:
post_incident_analysis:
  enabled: true

  # Analysis steps:
  analysis_steps:
    # 1. Root cause analysis
    root_cause:
      # Identify: how injection succeeded
      # What vulnerability was exploited
      # What detection missed
      enabled: true

    # 2. Impact assessment
    impact_assessment:
      # Assess: data exposure, system compromise, user impact
      # Quantify: number of affected users, data volume
      enabled: true

    # 3. Lessons learned
    lessons_learned:
      # Document: what went wrong, what worked well
      # Identify: process gaps, tool gaps, training needs
      enabled: true

  # Remediation actions:
  remediation:
    # Actions to prevent recurrence:
    # - Patch vulnerabilities
    # - Update detection rules
    # - Improve training
    # - Update documentation
    enabled: true

  # Compliance reporting:
  compliance:
    enabled: true
    # Generate reports for:
    # - SOC 2 (incident response logs)
    # - GDPR (data breach notification)
    # - ISO 27001 (incident management)
    reports:
      - soc2_incident_response
      - gdpr_breach_notification
      - iso27001_incident_management` },
]

const FAQ = [
  { q: "What is the difference between automated response and incident triage?", a: "Automated response is the immediate action taken when an injection is detected. It is predefined and executed automatically without human intervention. Examples: block the request, flag the user, alert the security team. Incident triage is the process of evaluating the incident to determine severity, impact, and appropriate response. It involves analyzing the context (data sensitivity, user intent, injection success) to prioritise the response. Automated response is the 'what to do immediately', triage is the 'how to prioritise and route'. Both are necessary: automated response contains the threat, triage ensures appropriate follow-up." },
  { q: "How do I create effective recovery playbooks?", a: "Effective recovery playbooks should be: 1) Specific to the incident type — different playbooks for jailbreaks, data extraction attempts, system prompt extraction. 2) Step-by-step — clear, actionable steps that can be executed by security analysts or automated systems. 3) Automated where possible — steps that can be automated (blocking, session revocation, alerting) should be automated for speed. 4) Include escalation criteria — when to escalate to higher-level teams or management. 5) Include communication steps — who to notify (security team, compliance, data owners, users). 6) Include verification steps — how to verify the incident is resolved and the system is secure." },
  { q: "What should be included in post-incident analysis?", a: "Post-incident analysis should include: 1) Root cause analysis — how did the injection succeed? What vulnerability was exploited? What detection missed? 2) Impact assessment — what data was exposed? How many users were affected? What systems were compromised? 3) Timeline — when did the incident start, when was it detected, when was it resolved? 4) Lessons learned — what went wrong in detection and response? What worked well? 5) Remediation actions — what changes are needed to prevent recurrence? (patch vulnerabilities, update detection rules, improve training). 6) Compliance reporting — generate reports for SOC 2, GDPR, ISO 27001 as required." },
  { q: "How do I measure the effectiveness of injection response?", a: "Metrics to measure injection response effectiveness: 1) Mean Time to Detect (MTTD) — average time from injection attempt to detection. 2) Mean Time to Respond (MTTR) — average time from detection to resolution. 3) Detection rate — percentage of injection attempts detected. 4) False positive rate — percentage of legitimate requests incorrectly flagged as injection. 5) Containment success rate — percentage of incidents successfully contained before impact. 6) Recurrence rate — percentage of similar incidents recurring after remediation. 7) SLA compliance — percentage of incidents resolved within SLA. Track these metrics over time to identify trends and improve response processes." },
]

export default function LlmInjectionResponsePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Injection Response", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Injection-Response-Guide für eigene KI-Systeme.", "Injection response guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 17</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "LLM Injection Response", "LLM Injection Response")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Prompt-Injection-Vorfälle ohne strukturiertes Response können zu Data Leaks führen. Vier Kontrollen: Automated Response, Incident Triage, Recovery Playbooks und Post-Incident Analysis.", "Prompt injection incidents without structured response can lead to data leaks. Four controls: automated response, incident triage, recovery playbooks and post-incident analysis.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Injection-Response-Kontrollen", "4 Injection Response Controls")}</h2>
          <div className="space-y-5">
            {RESPONSE_CONTROLS.map((c) => (
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
            <a href={`/${locale}/moltbot/llm-prompt-injection-detection`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Prompt Injection Detection</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Injection-Detection", "Injection detection")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-incident-response`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Incident Response</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Incident-Triage", "Incident triage")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-jailbreak-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Jailbreak Defense</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Jailbreak-Response", "Jailbreak response")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "OWASP-LLM-Top-10", "OWASP LLM Top 10")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
