import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/iso27001-ai-systems-roadmap"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "ISO 27001 AI Systems Roadmap: ISO-27001-KI-Systeme-Roadmap | ClawGuru Solutions"
    : "ISO 27001 AI Systems Roadmap: ISO 27001 Compliance Roadmap for AI Systems | ClawGuru Solutions"
  const description = isDE
    ? "ISO-27001-Compliance-Roadmap für KI-Systeme: Gap-Analysis, ISMS-Scope für AI, KI-spezifische Controls (A.8.24, A.8.25) und Certification Readiness für Self-Hosted AI."
    : "ISO 27001 compliance roadmap for AI systems: gap analysis, ISMS scope for AI, AI-specific controls (A.8.24, A.8.25) and certification readiness for self-hosted AI."
  return {
    title, description,
    keywords: ["iso 27001 ai compliance", "iso 27001 llm roadmap", "isms ai systems", "iso27001 artificial intelligence", "iso 27001 certification ai", "iso27001 self-hosted"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const ROADMAP_PHASES = [
  { phase: "Phase 1", title: "Gap Analysis & Scope Definition", weeks: "Weeks 1–4", desc: "Identify gaps between current state and ISO 27001 requirements. Define ISMS scope including AI systems.", items: ["Inventory all AI systems and data flows", "Map AI data processing to ISO 27001 clauses", "Identify applicable Annex A controls", "Document AI-specific risks (hallucination, prompt injection, model poisoning)", "Define ISMS scope: include AI training, inference, and monitoring systems", "Perform Statement of Applicability (SoA) first draft"] },
  { phase: "Phase 2", title: "Risk Assessment for AI Systems", weeks: "Weeks 5–8", desc: "Perform ISO 27001 risk assessment with AI-specific threat scenarios.", items: ["Identify AI-specific threats: model theft, training data poisoning, adversarial inputs", "Assess likelihood and impact for each threat", "Prioritise risks using risk matrix", "Define risk treatment plans: accept, mitigate, transfer, avoid", "Document risk register with AI threat scenarios", "Review and approve risk assessment with management"] },
  { phase: "Phase 3", title: "AI-Specific Controls Implementation", weeks: "Weeks 9–16", desc: "Implement ISO 27001 Annex A controls relevant to AI systems.", items: ["A.8.24: Cryptography — encrypt AI model weights and training data", "A.8.25: Secure development — apply to ML pipelines and model training", "A.5.23: Cloud services — assess LLM API providers, get BAAs/DPAs", "A.8.8: Vulnerability management — include AI frameworks in vuln scanning", "A.5.10: Acceptable use — define AI acceptable use policy", "A.8.16: Monitoring — add AI inference monitoring to SIEM"] },
  { phase: "Phase 4", title: "Documentation & Internal Audit", weeks: "Weeks 17–20", desc: "Complete ISO 27001 documentation and perform internal audit.", items: ["Write Information Security Policy with AI section", "Document AI Risk Treatment Plan", "Complete Statement of Applicability with AI controls", "Write AI-specific procedures: incident response, change management", "Perform internal audit against ISO 27001 clauses", "Address all non-conformities from internal audit"] },
]

const CONTROLS = [
  { id: "ISO-1", title: "ISMS Scope for AI Systems", desc: "Define ISMS scope to include all AI systems, data, and processes.", code: `# ISO 27001 ISMS Scope for AI Systems:

scope_definition:
  enabled: true

  # AI Systems in Scope:
  systems:
    - LLM inference infrastructure (Moltbot, OpenClaw)
    - Training data pipelines and storage
    - Model registry and artifact storage
    - AI monitoring and logging systems
    - AI API gateways and access controls
    - CI/CD pipelines for ML models

  # Data in Scope:
  data:
    - Training datasets (including customer data)
    - Model weights and configurations
    - Inference logs and outputs
    - AI system audit logs

  # Exclusions (document justification):
  exclusions:
    - Third-party LLM APIs (covered by supplier agreements)
    - Research environments (separate ISMS scope)` },
  { id: "ISO-2", title: "AI Risk Assessment", desc: "ISO 27001 risk assessment with AI-specific threat catalogue.", code: `# ISO 27001 AI Risk Assessment:

risk_assessment:
  methodology: ISO 27005

  # AI-Specific Threats:
  threats:
    - id: T-AI-01
      threat: Model Theft / Extraction
      likelihood: Medium
      impact: High
      risk: High
      treatment: Implement model access controls + rate limiting

    - id: T-AI-02
      threat: Training Data Poisoning
      likelihood: Low
      impact: Critical
      risk: High
      treatment: Data integrity verification + source validation

    - id: T-AI-03
      threat: Prompt Injection Attack
      likelihood: High
      impact: High
      risk: Critical
      treatment: Input sanitization + output filtering

    - id: T-AI-04
      threat: LLM Output Data Leakage
      likelihood: Medium
      impact: High
      risk: High
      treatment: Output scanning + DLP controls` },
  { id: "ISO-3", title: "Annex A Controls for AI (A.8.24, A.8.25)", desc: "Implement ISO 27001:2022 Annex A controls relevant to AI systems.", code: `# ISO 27001:2022 Annex A - AI Controls:

# A.8.24 Use of Cryptography:
cryptography:
  enabled: true
  # Encrypt: model weights at rest (AES-256)
  # Encrypt: training data at rest (AES-256)
  # Encrypt: inference API traffic (TLS 1.3)
  # Manage: cryptographic keys (HSM or KMS)

# A.8.25 Secure Development Life Cycle:
sdlc:
  enabled: true
  # Apply: secure SDLC to ML pipelines
  # Review: model training code
  # Test: models for security issues (red-teaming)
  # Sign: model artifacts before deployment

# A.5.23 Information Security for Cloud Services:
cloud:
  enabled: true
  # Assess: LLM API providers
  # Require: DPA/BAA with providers
  # Monitor: API usage and anomalies
  # Classify: data before sending to API

# A.8.16 Monitoring Activities:
monitoring:
  enabled: true
  # Monitor: AI inference logs
  # Alert: on anomalous AI behavior
  # Integrate: with SIEM
  # Review: AI audit logs regularly` },
  { id: "ISO-4", title: "AI Incident Response Procedure", desc: "ISO 27001-aligned incident response for AI-specific incidents.", code: `# ISO 27001 AI Incident Response:

incident_response:
  enabled: true

  # AI-Specific Incident Categories:
  categories:
    - Prompt injection detected
    - LLM output data leakage
    - Model theft/extraction suspected
    - Training data poisoning detected
    - AI system unauthorized access
    - Hallucination causing harm

  # Response Process (ISO 27035 aligned):
  process:
    1_detect:
      # Automated: monitoring alerts
      # Manual: user reports
      # Time: detect within 15 minutes

    2_contain:
      # Isolate: affected AI system
      # Disable: compromised API keys
      # Block: malicious inputs/users

    3_investigate:
      # Collect: logs and artifacts
      # Analyze: attack vector
      # Assess: data exposure

    4_recover:
      # Restore: from clean backup
      # Patch: vulnerability
      # Verify: system integrity

    5_report:
      # Internal: within 24 hours
      # Regulatory: per GDPR/HIPAA/NIS2
      # Post-incident: review within 14 days` },
]

const FAQ = [
  { q: "Does ISO 27001 specifically address AI systems?", a: "ISO 27001:2022 (the current version) does not have a dedicated AI clause, but several Annex A controls apply: A.8.24 (cryptography — protecting model weights), A.8.25 (secure development — applying to ML pipelines), A.5.23 (cloud services — assessing LLM API providers). Additionally, ISO/IEC 42001:2023 is a dedicated AI Management System standard that complements ISO 27001. Organizations should implement both for comprehensive AI governance." },
  { q: "How long does ISO 27001 certification take for AI systems?", a: "ISO 27001 certification typically takes 6-18 months depending on organization size and starting maturity. For AI-specific aspects: Gap analysis (4 weeks), Risk assessment with AI threats (4 weeks), Controls implementation including AI controls (8 weeks), Documentation and internal audit (4 weeks), External audit Stage 1 + Stage 2 (4-8 weeks). Total: approximately 6-9 months for a focused AI system scope. Smaller organizations with clear AI system boundaries can achieve certification faster." },
  { q: "What is the Statement of Applicability for AI systems?", a: "The Statement of Applicability (SoA) lists all ISO 27001 Annex A controls and documents whether each is applicable, implemented, and why. For AI systems, ensure the SoA explicitly addresses: A.8.24 (cryptography for model weights), A.8.25 (secure ML development), A.5.23 (cloud LLM providers), A.8.8 (vulnerability management for AI frameworks), A.8.16 (AI monitoring). If you exclude controls, document the justification. The SoA is a mandatory certification requirement." },
  { q: "Should I also pursue ISO 42001 for AI alongside ISO 27001?", a: "Yes, ideally. ISO 42001:2023 is the AI Management System standard — it focuses on AI-specific governance, ethics, transparency, and accountability. ISO 27001 focuses on information security. Together they provide comprehensive coverage: ISO 27001 for security controls, ISO 42001 for AI governance and ethics. Many certification bodies now offer combined ISO 27001 + ISO 42001 audits, which is more efficient. Start with ISO 27001 if you need security certification first, then add ISO 42001 for AI governance." },
]

export default function Iso27001AiSystemsRoadmapPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "ISO 27001 AI Systems Roadmap", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "HowTo", name: "ISO 27001 Certification Roadmap for AI Systems",
      step: ROADMAP_PHASES.map((p) => ({ "@type": "HowToStep", name: p.title, text: p.desc })),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "ISO-27001-Compliance-Roadmap für eigene KI-Systeme." : "ISO 27001 compliance roadmap for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · Batch 9</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "ISO 27001 AI Systems Roadmap" : "ISO 27001 AI Systems Roadmap"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "ISO 27001 für KI-Systeme ist kein Copy-Paste aus dem Standard — AI bringt neue Risiken: Model Theft, Training Data Poisoning, Prompt Injection. Diese Roadmap zeigt den Weg zur Zertifizierung in 4 Phasen."
            : "ISO 27001 for AI systems is not a copy-paste from the standard — AI brings new risks: model theft, training data poisoning, prompt injection. This roadmap shows the path to certification in 4 phases."}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4-Phasen-Roadmap zur Zertifizierung" : "4-Phase Certification Roadmap"}</h2>
          <div className="space-y-4">
            {ROADMAP_PHASES.map((p) => (
              <div key={p.phase} className="bg-gray-800 rounded-lg border border-gray-700 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded font-bold">{p.phase}</span>
                  <span className="font-bold text-gray-100">{p.title}</span>
                  <span className="ml-auto text-xs text-gray-400">{p.weeks}</span>
                </div>
                <p className="text-sm text-gray-300 mb-3">{p.desc}</p>
                <ul className="space-y-1">
                  {p.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">›</span><span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 ISO-27001-Controls für KI" : "4 ISO 27001 Controls for AI"}</h2>
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
            <a href={`/${locale}/solutions/soc2-ai-systems`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">SOC 2 for AI Systems</div>
              <div className="text-sm text-gray-300">{isDE ? "SOC-2-Compliance" : "SOC 2 compliance"}</div>
            </a>
            <a href={`/${locale}/solutions/hipaa-ai-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">HIPAA AI Compliance</div>
              <div className="text-sm text-gray-300">{isDE ? "HIPAA für AI" : "HIPAA for AI"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-regulatory-reporting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Regulatory Reporting</div>
              <div className="text-sm text-gray-300">{isDE ? "Regulatory-Reporting" : "Regulatory reporting"}</div>
            </a>
            <a href={`/${locale}/solutions`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">All Solutions</div>
              <div className="text-sm text-gray-300">{isDE ? "Compliance-Overview" : "Compliance overview"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
