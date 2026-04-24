import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/hipaa-ai-compliance"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "HIPAA AI Compliance: HIPAA-KI-Compliance für Self-Hosted AI | ClawGuru Solutions", "HIPAA AI Compliance: HIPAA Compliance for Self-Hosted AI Systems | ClawGuru Solutions")
  const description = pick(isDE, "HIPAA-Compliance für KI-Systeme: PHI-Schutz, Access Controls, Audit Logging und Breach Notification für Self-Hosted AI und LLM-Systeme im Healthcare-Bereich.", "HIPAA compliance for AI systems: PHI protection, access controls, audit logging and breach notification for self-hosted AI and LLM systems in healthcare.")
  return {
    title, description,
    keywords: ["hipaa ai compliance", "hipaa llm compliance", "hipaa self-hosted ai", "phi protection ai", "healthcare ai security", "hipaa technical safeguards"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "HIPAA-1", title: "PHI Protection in AI Systems", desc: "Protect Protected Health Information (PHI) in AI/LLM pipelines. De-identify before processing.", code: `# HIPAA PHI protection for AI:

# 1. PHI De-identification before LLM:
phi_deidentification:
  enabled: true
  # Method: HIPAA Safe Harbor or Expert Determination
  # Remove: 18 HIPAA identifiers before LLM input
  # Identifiers: names, dates, SSN, medical record numbers...
  # Tool: AWS Comprehend Medical, Azure Text Analytics Health

# 2. PHI Detection:
phi_detection:
  enabled: true
  # Scan: all LLM inputs for PHI
  # Alert: on PHI detected in prompt
  # Block: if PHI threshold exceeded
  # Log: PHI detection events

# 3. Output PHI Scanning:
output_scanning:
  enabled: true
  # Scan: LLM outputs for leaked PHI
  # Block: outputs containing PHI
  # Re-generate: if PHI detected
  # Log: output PHI events` },
  { id: "HIPAA-2", title: "Technical Safeguards (§164.312)", desc: "Implement HIPAA Technical Safeguards for AI systems. Access control, encryption, integrity.", code: `# HIPAA Technical Safeguards for AI:

# §164.312(a)(1) Access Control:
access_control:
  enabled: true
  # Unique user IDs: every user, no shared accounts
  # Emergency access: documented break-glass procedure
  # Automatic logoff: session timeout after inactivity
  # Encryption: AES-256 for PHI at rest

# §164.312(b) Audit Controls:
audit_controls:
  enabled: true
  # Log: all PHI access, modification, deletion
  # Include: user, timestamp, action, PHI category
  # Retain: minimum 6 years
  # Protect: log integrity

# §164.312(c)(1) Integrity:
integrity:
  enabled: true
  # Verify: PHI has not been altered
  # Method: hash verification, checksums
  # Detect: unauthorized modifications
  # Alert: on integrity failures

# §164.312(e)(1) Transmission Security:
transmission:
  enabled: true
  # Encrypt: all PHI in transit (TLS 1.3)
  # Verify: certificate validity
  # Block: unencrypted PHI transmission` },
  { id: "HIPAA-3", title: "Minimum Necessary Standard for AI", desc: "Apply Minimum Necessary Standard to AI data access. LLMs should only see minimum PHI needed.", code: `# HIPAA Minimum Necessary for AI:

# Data Minimization:
data_minimization:
  enabled: true
  # Principle: LLM sees only minimum necessary PHI
  # Filter: remove unnecessary PHI fields
  # Aggregate: use aggregate data when possible
  # Document: data minimization decisions

# Role-Based PHI Access:
role_based_access:
  enabled: true
  # Define: PHI access levels by role
  # Doctor: full PHI for their patients
  # Admin: limited PHI (admin tasks only)
  # AI System: only task-specific PHI
  # Enforce: access restrictions strictly

# Data Retention:
retention:
  enabled: true
  # Policy: HIPAA minimum 6 years
  # AI logs: retain as PHI
  # Purge: data per retention schedule
  # Document: retention procedures` },
  { id: "HIPAA-4", title: "HIPAA Breach Notification for AI Incidents", desc: "HIPAA Breach Notification requirements for AI-related PHI breaches.", code: `# HIPAA Breach Notification for AI:

# Breach Detection:
detection:
  enabled: true
  # Monitor: all PHI access patterns
  # Detect: unauthorized PHI access/disclosure
  # AI-specific: LLM output containing PHI
  # Alert: immediate notification to security team

# 60-Day Notification Rule:
notification:
  enabled: true
  # Timeline: notify HHS within 60 days
  # Affected individuals: notify promptly
  # Media: notify if 500+ in a state
  # Document: all breach notification steps

# Breach Risk Assessment:
risk_assessment:
  enabled: true
  # Assess: 4 HIPAA factors
  # 1. Nature and extent of PHI
  # 2. Who accessed/may have accessed
  # 3. Whether PHI was acquired/viewed
  # 4. Extent to which risk mitigated
  # Decision: breach vs. not a breach` },
]

const FAQ = [
  { q: "Does HIPAA apply to AI/LLM systems processing health data?", a: "Yes. HIPAA applies to any system that creates, receives, maintains, or transmits Protected Health Information (PHI) on behalf of a Covered Entity or Business Associate. If your LLM system processes patient data, HIPAA applies. This includes: LLMs used for clinical documentation, medical coding, patient communication, diagnostic support, or any processing of PHI. You must implement Technical Safeguards, sign Business Associate Agreements (BAAs), and comply with all HIPAA rules." },
  { q: "What are the 18 HIPAA identifiers that must be removed for de-identification?", a: "The 18 HIPAA Safe Harbor identifiers: 1) Names, 2) Geographic data (zip codes below 3 digits), 3) Dates (except year) related to individual, 4) Phone numbers, 5) Fax numbers, 6) Email addresses, 7) SSN, 8) Medical record numbers, 9) Health plan beneficiary numbers, 10) Account numbers, 11) Certificate/license numbers, 12) VIN/license plate numbers, 13) Device identifiers, 14) URLs, 15) IP addresses, 16) Biometric identifiers, 17) Full-face photos, 18) Any unique identifying number/code. All must be removed for Safe Harbor de-identification." },
  { q: "Do I need a BAA with my LLM provider?", a: "Yes. If your LLM provider processes PHI on your behalf, they are a Business Associate and you must have a signed Business Associate Agreement (BAA). This applies to: cloud LLM APIs (OpenAI, Anthropic, Google), hosted inference services, and vector database providers that store PHI. Some providers offer HIPAA-eligible services with BAAs (AWS, Azure, Google Cloud). Open-source self-hosted LLMs on your own infrastructure do not require a BAA." },
  { q: "How do I log AI system access to PHI for HIPAA compliance?", a: "HIPAA §164.312(b) requires audit controls. For AI systems: 1) Log every PHI query to the LLM — include user, timestamp, query hash (not full PHI). 2) Log PHI retrieved from databases for LLM context. 3) Log LLM outputs that contain PHI. 4) Use tamper-evident logging (append-only, signed). 5) Retain logs for minimum 6 years. 6) Protect log access — only compliance officers should have full access. Tools: SIEM integration, CloudTrail, Elasticsearch with access controls." },
]

export default function HipaaAiCompliancePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "HIPAA AI Compliance", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "HIPAA-Compliance-Guide für eigene KI-Systeme im Healthcare-Bereich.", "HIPAA compliance guide for your own AI systems in healthcare.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · Batch 9</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "HIPAA AI Compliance", "HIPAA AI Compliance")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "KI-Systeme im Healthcare-Bereich müssen HIPAA einhalten — PHI-Schutz, Technical Safeguards, Minimum Necessary Standard und Breach Notification sind nicht optional. Vier Kontrollen für HIPAA-konforme AI-Systeme.", "AI systems in healthcare must comply with HIPAA — PHI protection, technical safeguards, minimum necessary standard and breach notification are not optional. Four controls for HIPAA-compliant AI systems.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 HIPAA-Compliance-Kontrollen für KI", "4 HIPAA Compliance Controls for AI")}</h2>
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
            <a href={`/${locale}/solutions/soc2-ai-systems`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">SOC 2 for AI Systems</div>
              <div className="text-sm text-gray-300">{pick(isDE, "SOC-2-Compliance", "SOC 2 compliance")}</div>
            </a>
            <a href={`/${locale}/solutions/gdpr-breach-notification-ai`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">GDPR Breach Notification</div>
              <div className="text-sm text-gray-300">{pick(isDE, "GDPR-Compliance", "GDPR compliance")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-data-loss-prevention`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Data Loss Prevention</div>
              <div className="text-sm text-gray-300">{pick(isDE, "DLP für AI", "DLP for AI")}</div>
            </a>
            <a href={`/${locale}/solutions`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">All Solutions</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Compliance-Overview", "Compliance overview")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
