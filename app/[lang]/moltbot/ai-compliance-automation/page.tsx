import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-compliance-automation"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "KI-Compliance-Automatisierung mit Moltbot: EU AI Act, SOC 2, GDPR | ClawGuru", "AI Compliance Automation with Moltbot: EU AI Act, SOC 2, GDPR | ClawGuru")
  const description = pick(isDE, "Automatisiere AI-Compliance mit Moltbot: EU AI Act Art. 12-15, SOC 2 Type II, GDPR. Audit-Logging, Risikomanagement, Robustheitstests und Human-Oversight — kontinuierlich und ohne manuelle Arbeit.", "Automate AI compliance with Moltbot: EU AI Act Art. 12-15, SOC 2 Type II, GDPR. Audit logging, risk management, robustness testing and human oversight — continuously and without manual work.")
  return {
    title, description,
    keywords: ["ai compliance automation", "eu ai act automation", "moltbot compliance", "soc2 ai compliance", "gdpr ai compliance", "ai audit logging"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPLIANCE_MAP = [
  { framework: "EU AI Act", article: "Art. 9", requirement: "Risk Management System", auto: true, impl: "Continuous risk scoring on every agent interaction. Anomaly detection triggers risk reassessment. Risk register updated automatically." },
  { framework: "EU AI Act", article: "Art. 12", requirement: "Record-Keeping / Logging", auto: true, impl: "Tamper-evident structured JSON logs for every AI decision. SHA-256 hash chain. Configurable retention (default 3 years)." },
  { framework: "EU AI Act", article: "Art. 14", requirement: "Human Oversight", auto: true, impl: "Configurable HITL thresholds per risk level. Dangerous tool calls require explicit approval. Auto-pause on anomaly detection." },
  { framework: "EU AI Act", article: "Art. 15", requirement: "Cybersecurity & Robustness", auto: true, impl: "Prompt injection defense, input validation, adversarial robustness testing CI/CD hooks, sandboxed execution." },
  { framework: "SOC 2 Type II", article: "CC4", requirement: "Monitoring Activities", auto: true, impl: "24/7 control failure detection. Structured alert log with response timestamps for auditor evidence package." },
  { framework: "SOC 2 Type II", article: "CC6", requirement: "Logical Access Control", auto: true, impl: "Per-agent capability tokens, MFA enforcement monitoring, access deprovisioning alerts, quarterly review reports." },
  { framework: "SOC 2 Type II", article: "CC7", requirement: "System Operations", auto: true, impl: "Incident detection with structured timeline. Automated response runbooks. Evidence export for audit period." },
  { framework: "GDPR / DSGVO", article: "Art. 5", requirement: "Data Minimisation", auto: true, impl: "PII detection in prompts and responses. Auto-redaction before logging. Purpose limitation enforcement per agent scope." },
  { framework: "GDPR / DSGVO", article: "Art. 30", requirement: "Records of Processing", auto: true, impl: "Automatic processing activity records for all AI data flows. Data subject + purpose + retention per agent." },
  { framework: "GDPR / DSGVO", article: "Art. 35", requirement: "DPIA for high-risk AI", auto: false, impl: "Moltbot generates technical evidence for DPIA; human review and sign-off required for high-risk processing." },
]

const FAQ = [
  { q: "What does 'AI compliance automation' mean in practice?", a: "Instead of manually collecting evidence (screenshots, exports, spreadsheets) before each audit, Moltbot generates a continuous structured evidence stream automatically. For EU AI Act Art. 12: every AI decision is logged with timestamp, input hash, output hash, agent ID, and tool calls — tamper-evidently. For SOC 2 Type II: this log becomes your CC7 evidence. For GDPR: PII detected in any prompt is auto-redacted before logging, satisfying Art. 5 data minimisation automatically." },
  { q: "Which frameworks does Moltbot cover out of the box?", a: "Full automation: EU AI Act Art. 9, 12, 14, 15. SOC 2 Type II: CC3, CC4, CC5, CC6, CC7, CC8. GDPR Art. 5, 25, 30. Partial (technical evidence generated, human review required): EU AI Act Art. 11 (technical documentation), GDPR Art. 35 (DPIA), SOC 2 CC1/CC2 (governance). NIST CSF 2.0: Identify, Protect, Detect, Respond functions fully mapped." },
  { q: "How does Moltbot handle EU AI Act Art. 14 human oversight technically?", a: "Moltbot implements a risk-threshold HITL system: every agent action is scored (0-100 risk). Below threshold: automatic execution + audit log. Above threshold: action queued, human notified via webhook/Slack/email, execution blocked until explicit approval with timestamp and approver identity recorded. The approval record satisfies Art. 14's 'technical measures enabling human oversight' requirement with full audit evidence." },
  { q: "Can Moltbot replace a compliance auditor?", a: "No. Moltbot automates technical evidence collection and control implementation. A qualified auditor is still required to: evaluate whether controls are adequate for your specific risk profile, conduct the formal audit and issue the attestation (SOC 2), sign off on DPIA (GDPR), perform conformity assessment (EU AI Act high-risk). Moltbot makes the auditor's job faster and cheaper by providing structured, complete evidence — instead of you scrambling to produce it manually." },
]

export default function AiComplianceAutomationPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Compliance Automation", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Compliance-Leitfaden — kein Rechtsrat.", "Compliance guide — not legal advice.")}
        </div>

        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 6</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "KI-Compliance-Automatisierung mit Moltbot", "AI Compliance Automation with Moltbot")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "EU AI Act, SOC 2 Type II, GDPR — drei Frameworks, ein Audit-Problem. Moltbot automatisiert die technische Evidenz-Sammlung für alle drei gleichzeitig. Kein manuelles Zusammensuchen vor dem Audit mehr.", "EU AI Act, SOC 2 Type II, GDPR — three frameworks, one audit problem. Moltbot automates technical evidence collection for all three simultaneously. No more manual scramble before audit day.")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "10", label: pick(isDE, "Frameworks abgedeckt", "Requirements automated") },
            { value: "3", label: pick(isDE, "Compliance-Frameworks", "Compliance frameworks") },
            { value: "100%", label: pick(isDE, "Tamper-evident Logs", "Tamper-evident logs") },
            { value: "0", label: pick(isDE, "Manuelle Audit-Exporte", "Manual audit exports") },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Framework-Mapping", "Compliance Framework Mapping")}
          </h2>
          <div className="space-y-3">
            {["EU AI Act", "SOC 2 Type II", "GDPR / DSGVO"].map((fw) => (
              <div key={fw}>
                <h3 className="font-bold text-cyan-400 mb-2 text-sm uppercase tracking-widest">{fw}</h3>
                {COMPLIANCE_MAP.filter((c) => c.framework === fw).map((c) => (
                  <div key={c.article} className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{c.article}</span>
                        <span className="font-semibold text-gray-100 text-sm">{c.requirement}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${c.auto ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-400"}`}>
                        {c.auto ? (pick(isDE, "Automatisch", "Automated")) : (pick(isDE, "Semi-auto", "Semi-auto"))}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{c.impl}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Konfiguration", "Configuration")}
          </h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`# moltbot.compliance.yaml
compliance:
  frameworks:
    - eu_ai_act:
        risk_class: high          # Enables Art. 9, 12, 14, 15
        hitl_threshold: 70        # Risk score 0-100 requiring human approval
        log_retention_years: 3
    - soc2_type_ii:
        criteria: [CC4, CC6, CC7, CC8]
        evidence_export: quarterly
        audit_period_start: "2026-01-01"
    - gdpr:
        pii_auto_redact: true
        processing_records: true  # Art. 30 automatic
        dpia_alerts: true         # Alert when new high-risk processing detected

  audit_log:
    format: structured-json
    hash_chain: sha256
    destination: /var/log/moltbot/compliance/
    tamper_detection: true

  reporting:
    dashboard: true
    export_formats: [pdf, json, csv]
    schedule: weekly`}</pre>
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
            <a href={`/${locale}/solutions/eu-ai-act-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">EU AI Act Guide</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Vollständiger Compliance-Leitfaden", "Full compliance guide")}</div>
            </a>
            <a href={`/${locale}/solutions/soc2-type-ii-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">SOC 2 Type II</div>
              <div className="text-sm text-gray-300">{pick(isDE, "TSC-Mapping und Evidenz", "TSC mapping and evidence")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Hub</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Art. 15 Cybersecurity", "Art. 15 cybersecurity")}</div>
            </a>
            <a href={`/${locale}/solutions/nist-csf-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">NIST CSF 2.0</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Ergänzendes Framework", "Complementary framework")}</div>
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
