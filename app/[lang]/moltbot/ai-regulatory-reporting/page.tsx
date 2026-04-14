import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-regulatory-reporting"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "KI Regulatory Reporting: Automatisierte Compliance-Berichte für LLM-Systeme | ClawGuru"
    : "AI Regulatory Reporting: Automated Compliance Reports for LLM Systems | ClawGuru"
  const description = isDE
    ? "Automatisierte Regulatory-Reports für KI-Systeme: EU AI Act Transparenzbericht, DSGVO Art. 30 Verzeichnis für KI, NIS2 Incident-Report-Automation und SOC2 Evidence-Export für LLMs."
    : "Automated regulatory reports for AI systems: EU AI Act transparency report, GDPR Art. 30 records for AI, NIS2 incident report automation and SOC2 evidence export for LLMs."
  return {
    title, description,
    keywords: ["ai regulatory reporting", "llm compliance reporting", "eu ai act reporting", "gdpr ai systems report", "nis2 ai incident report", "soc2 ai evidence"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const REPORT_TYPES = [
  { id: "RR-1", framework: "EU AI Act", title: "Technical Documentation & Transparency Report", desc: "High-risk AI systems under the EU AI Act must maintain technical documentation. Moltbot auto-generates this from runtime telemetry.", fields: ["System description and intended purpose", "Model provider, version, training data summary", "Risk management measures implemented", "Data governance and training data description", "Accuracy, robustness and cybersecurity measures", "Human oversight mechanisms (HITL gates, kill switches)", "Incident logging and monitoring procedures"], code: `# Moltbot EU AI Act report generation:
moltbot report generate \\
  --framework eu-ai-act \\
  --system-id production-llm-assistant \\
  --output-format pdf \\
  --period 2026-Q1

# Auto-populated fields from runtime telemetry:
# - Model version history (from model registry)
# - HITL gate trigger counts and decision outcomes
# - Incident log summary (from audit chain)
# - DLP events summary (from input/output DLP)
# - Error rates and accuracy metrics (from canary monitoring)
# - Access control audit (from RBAC logs)

# Schedule quarterly generation:
moltbot report schedule \\
  --framework eu-ai-act \\
  --frequency quarterly \\
  --auto-sign true \\     # HMAC-sign for tamper evidence
  --recipients [ciso@company.com, dpo@company.com]` },
  { id: "RR-2", framework: "GDPR / DSGVO", title: "Art. 30 Records of Processing Activities for AI", desc: "Every AI system processing personal data requires an entry in the GDPR Art. 30 Records of Processing Activities (RoPA). Moltbot auto-populates from configuration.", fields: ["Name and contact of data controller / processor", "Categories of data subjects and personal data processed", "Purposes of the AI processing", "Legal basis (Art. 6 / Art. 9 GDPR)", "Third-party LLM provider as sub-processor", "Data retention periods", "Technical security measures (encryption, access control, DLP)"], code: `# Auto-generate GDPR Art. 30 RoPA entry:
moltbot report generate \\
  --framework gdpr-art30 \\
  --system-id customer-support-ai \\
  --output-format docx

# Example auto-populated RoPA entry:
# ---
# Processing Activity: Customer Support AI Assistant
# Controller: [Company Name], [Address]
# Processor: ClawGuru Moltbot (self-hosted — no data transfer)
# Sub-processors: OpenAI Ireland Ltd (DPA signed, EU region API)
# Purpose: Respond to customer support inquiries
# Legal Basis: Art. 6(1)(b) — contract performance
# Data Subjects: Customers, users
# Data Categories: Name, email, order history, support messages
# Retention: Conversation logs 90 days; audit logs 3 years
# Security: AES-256 at rest, TLS 1.3 in transit, DLP active, RBAC
# DPIA: Conducted 2026-01-15 — no high residual risk
# ---` },
  { id: "RR-3", framework: "NIS2", title: "Incident Report Automation (24h / 72h / Final)", desc: "NIS2 requires tiered incident reporting — 24h early warning, 72h notification, 1-month final report. Moltbot auto-drafts reports from AI incident telemetry.", fields: ["Incident timestamp and duration", "Affected systems and services", "Preliminary cause assessment", "Number of affected users / data subjects", "Immediate containment measures taken", "Mitigation actions and timelines", "Preventive measures for recurrence"], code: `# Moltbot NIS2 incident report auto-draft:
# Triggered automatically when AI incident threshold exceeded

# 24h early warning (auto-generated on incident detection):
moltbot incident report \\
  --type nis2-early-warning \\
  --incident-id INC-2026-0042 \\
  --output-format pdf \\
  --submit-to national-authority  # BSI / ANSSI / NCSC endpoint

# 72h notification (enriched with investigation findings):
moltbot incident report \\
  --type nis2-notification \\
  --incident-id INC-2026-0042 \\
  --include-timeline true \\
  --include-affected-users true

# Fields auto-populated from:
# - Moltbot AI incident detection telemetry
# - Audit chain timestamps
# - DLP event logs (data exposure assessment)
# - RBAC access logs (access pattern during incident)
# - Model rollback logs (if model-related incident)` },
  { id: "RR-4", framework: "SOC 2 Type II", title: "Continuous Evidence Collection for AI Controls", desc: "SOC 2 Type II audits require evidence over a 12-month period. Moltbot continuously collects and exports structured evidence for AI-specific Trust Service Criteria.", fields: ["CC6: Logical and Physical Access Controls — RBAC audit logs", "CC7: System Operations — AI incident response logs", "CC8: Change Management — model version audit trail", "CC9: Risk Mitigation — DLP events, jailbreak attempts blocked", "A1: Availability — uptime, failover events", "C1: Confidentiality — DLP classification and blocking evidence"], code: `# Moltbot SOC 2 evidence export:
moltbot compliance export \\
  --framework soc2 \\
  --trust-service-criteria [CC6, CC7, CC8, CC9, A1, C1] \\
  --period 2025-04-01:2026-03-31 \\
  --output-format zip \\
  --include-signatures true   # HMAC-signed — tamper-evident

# Evidence package contents:
# cc6_access_control_log.json  — all RBAC changes + access events
# cc7_incident_log.json        — all AI incidents with resolution
# cc8_model_changes.json       — model version history + approvals
# cc9_dlp_events.json          — DLP blocks + jailbreak attempts
# a1_uptime_metrics.json       — availability SLA evidence
# c1_confidentiality_log.json  — data classification + protection

# Share with SOC 2 auditor via secure portal:
# All files are HMAC-signed — auditor can verify integrity
moltbot compliance verify-package \\
  --package soc2-evidence-2026.zip \\
  --public-key /etc/moltbot/audit-signing.pub` },
]

const FAQ = [
  { q: "Which AI systems require formal regulatory reporting under EU AI Act?", a: "The EU AI Act uses a risk-based tiered approach: Unacceptable risk (banned): social scoring by governments, real-time biometric surveillance in public spaces, manipulation of vulnerable groups. High risk (mandatory documentation + conformity assessment): AI in critical infrastructure, education, employment, essential services, law enforcement, migration, justice. This tier requires full technical documentation, conformity assessment before deployment, registration in EU database, and ongoing monitoring. Limited risk (transparency obligations only): chatbots must disclose AI identity. Deepfake generators must label content. General purpose AI models (GPAI): large-scale models (>10^25 FLOPs training compute) require technical documentation and adversarial testing. Most enterprise AI systems (internal tools, customer support bots, coding assistants) fall in the limited or minimal risk category — transparency obligations only. If your AI makes consequential decisions about people (credit, hiring, healthcare) — high risk tier applies. Moltbot's regulatory reporting module generates the required documentation for any tier." },
  { q: "How do I create an Art. 30 GDPR records of processing entry for an AI system?", a: "GDPR Art. 30 RoPA entry for an AI system requires: 1) Identity: name of the AI system, data controller contact (DPO). 2) Purpose: why is personal data processed by this AI system? Be specific. 3) Legal basis: which Art. 6 basis? (Contract, Legitimate Interest, Consent). 4) Data categories: what personal data does the AI process? Include implicit data (conversation patterns, usage data). 5) Data subjects: who is affected? (customers, employees, users). 6) Processors: which external providers process the data? (OpenAI, Azure, AWS) — each needs a signed DPA. 7) Third country transfers: does data go to non-EU processors? Document transfer mechanisms (SCCs). 8) Retention: how long is the data stored? (prompts, outputs, logs). 9) Technical measures: DLP, encryption, access control, audit logging. Update the RoPA when: you change the AI model provider, add new data categories, change the purpose, or change retention periods. Moltbot auto-extracts most fields from system configuration." },
  { q: "How quickly must AI-related security incidents be reported under NIS2?", a: "NIS2 Art. 23 timeline for significant incidents: Within 24 hours: 'early warning' — notify the competent authority that a significant incident has occurred. Include: preliminary assessment of cause (cyberattack or not), whether cross-border impact is suspected. Within 72 hours: 'incident notification' — update with more details: severity, impact on services, affected systems, initial mitigation. Within 1 month: 'final report' — complete analysis: root cause, full impact assessment, cross-border effects, mitigation measures completed, lessons learned. AI-specific incidents that trigger reporting: AI system downtime exceeding your defined RTO for a critical service, data breach via AI system (prompt injection leading to exfiltration), supply chain compromise of model provider affecting service delivery, AI system producing systematically harmful outputs at scale. Moltbot's NIS2 module automatically detects threshold-crossing events and drafts the 24h early warning within minutes of detection." },
  { q: "How does SOC 2 apply to AI systems and LLM workloads?", a: "SOC 2 doesn't have AI-specific criteria yet — AI systems are evaluated under the existing Trust Service Criteria (TSC): CC6 (Logical Access): who has access to the LLM, model weights, training data, API keys? RBAC logs, key rotation evidence, MFA enforcement. CC7 (System Operations): how are AI incidents detected and responded to? Incident logs, alert configurations, response playbooks. CC8 (Change Management): how are new model versions approved and deployed? Model versioning audit trail, change approval evidence. CC9 (Risk Mitigation): what controls reduce AI-specific risks? DLP events, jailbreak attempt logs, output validation statistics. C1 (Confidentiality): how is confidential data protected in AI systems? Data classification, RAG access controls, DLP blocking evidence. Availability (A1): what are the AI system uptime metrics? Failover tests, canary monitoring, incident recovery times. Collect evidence continuously — auditors want a 12-month record showing controls operated consistently, not a point-in-time snapshot." },
]

export default function AiRegulatoryReportingPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Regulatory Reporting", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Compliance-Reporting-Guide. Keine Rechtsberatung." : "Compliance reporting guide. Not legal advice."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 12</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "KI Regulatory Reporting" : "AI Regulatory Reporting"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "EU AI Act, DSGVO, NIS2 und SOC 2 — alle verlangen strukturierte Nachweise für KI-Systeme. Moltbot automatisiert die Berichts-Generierung aus Runtime-Telemetrie. Vier Report-Typen mit konkreten Feldern und CLI-Befehlen."
            : "EU AI Act, GDPR, NIS2 and SOC 2 — all require structured evidence for AI systems. Moltbot automates report generation from runtime telemetry. Four report types with concrete fields and CLI commands."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Regulatorische Report-Typen" : "4 Regulatory Report Types"}</h2>
          <div className="space-y-5">
            {REPORT_TYPES.map((r) => (
              <div key={r.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{r.id}</span>
                  <span className="font-mono text-xs text-purple-400 bg-purple-900 px-2 py-0.5 rounded">{r.framework}</span>
                  <span className="font-bold text-gray-100 text-sm">{r.title}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-3">{r.desc}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-900 rounded-lg p-3">
                      <div className="text-xs font-bold text-gray-400 uppercase mb-2">Required Fields</div>
                      <ul className="space-y-1">
                        {r.fields.map((f, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                            <span className="text-cyan-400 mt-0.5">→</span>{f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                      <pre>{r.code}</pre>
                    </div>
                  </div>
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
            <a href={`/${locale}/solutions/eu-ai-act-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">EU AI Act Compliance</div>
              <div className="text-sm text-gray-300">{isDE ? "Risikoklassen & Anforderungen" : "Risk classes & requirements"}</div>
            </a>
            <a href={`/${locale}/solutions/nis2-ai-infrastructure`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">NIS2 AI Infrastructure</div>
              <div className="text-sm text-gray-300">{isDE ? "Art. 21 Maßnahmen" : "Art. 21 measures"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-incident-response`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Incident Response</div>
              <div className="text-sm text-gray-300">{isDE ? "Incident-Daten für Reports" : "Incident data for reports"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Compliance Automation</div>
              <div className="text-sm text-gray-300">{isDE ? "EU AI Act / SOC2 / GDPR" : "EU AI Act / SOC2 / GDPR"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
