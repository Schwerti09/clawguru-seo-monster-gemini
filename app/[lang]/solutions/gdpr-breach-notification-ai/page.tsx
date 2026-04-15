import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/gdpr-breach-notification-ai"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "DSGVO Datenpannen-Meldung für KI: GDPR Breach Notification for AI | ClawGuru Solutions"
    : "GDPR Breach Notification for AI: GDPR Breach Notification for AI | ClawGuru Solutions"
  const description = isDE
    ? "DSGVO Datenpannen-Meldung für KI-Systeme: 72-Stunden-Frist, Datenklassifizierung, Meldungsverfahren und Dokumentation für DSGVO Art. 33. Executable Runbooks für Self-Hosted AI-Infrastruktur."
    : "GDPR breach notification for AI systems: 72-hour deadline, data classification, notification procedures and documentation for GDPR Art. 33. Executable runbooks for self-hosted AI infrastructure."
  return {
    title, description,
    keywords: ["gdpr breach notification ai", "dsgvo datenpannen meldung", "gdpr art 33", "72 hour notification", "ai data breach", "gdpr compliance", "clawguru solutions"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "GDPR-1", title: "72-Hour Notification Deadline", desc: "Ensure GDPR Art. 33 72-hour notification deadline for AI data breaches. Implement automated breach detection and notification workflows.", code: `# GDPR Art. 33 72-Hour Notification for AI:
notification_deadline:
  enabled: true

  # Breach Detection:
  breach_detection:
    enabled: true
    # Detect: AI data breaches
    # Methods: anomaly detection, log monitoring
    # Alert: immediately on detection
    # Escalate: to security team

  # Breach Assessment:
  breach_assessment:
    enabled: true
    # Assess: breach scope and impact
    # Determine: data subjects affected
    # Evaluate: risk to data subjects
    # Document: assessment findings

  # Notification Preparation:
  notification_prep:
    enabled: true
    # Prepare: notification template
    # Include: breach description, mitigation steps
    # Translate: to required languages
    # Approve: by legal team` },
  { id: "GDPR-2", title: "Data Classification", desc: "Classify AI data according to GDPR categories. Personal data, special categories, and pseudonymised data.", code: `# GDPR Data Classification for AI:
data_classification:
  enabled: true

  # Personal Data:
  personal_data:
    enabled: true
    # Identify: personal data in AI systems
    # Examples: names, email addresses, IP addresses
    # Classify: as personal data
    # Protect: with appropriate controls

  # Special Categories:
  special_categories:
    enabled: true
    # Identify: special category data
    # Examples: health data, biometric data
    # Classify: as Art. 9 special categories
    # Protect: with enhanced controls

  # Pseudonymised Data:
  pseudonymised:
    enabled: true
    # Identify: pseudonymised data
    # Methods: hashing, tokenisation
    # Classify: as pseudonymised personal data
    # Protect: with appropriate controls` },
  { id: "GDPR-3", title: "Notification Procedures", desc: "Implement GDPR-compliant breach notification procedures. Notify DPA, data subjects, and document all communications.", code: `# GDPR Notification Procedures for AI:
notification_procedures:
  enabled: true

  # DPA Notification:
  dpa_notification:
    enabled: true
    # Notify: data protection authority
    # Deadline: within 72 hours
    # Include: breach description, impact, mitigation
    # Submit: via secure channel

  # Data Subject Notification:
  subject_notification:
    enabled: true
    # Notify: affected data subjects
    # Deadline: without undue delay
    # Include: breach description, rights, remedies
    # Communicate: clearly and transparently

  # Communication Documentation:
  documentation:
    enabled: true
    # Document: all breach communications
    # Include: timestamps, recipients, content
    # Retain: for audit (3 years)
    # Protect: communication records` },
  { id: "GDPR-4", title: "Breach Documentation", desc: "Document all AI data breaches comprehensively. Maintain breach register, evidence, and remediation records.", code: `# GDPR Breach Documentation for AI:
breach_documentation:
  enabled: true

  # Breach Register:
  breach_register:
    enabled: true
    # Maintain: breach register
    # Include: breach ID, date, description, impact
    # Update: in real-time
    # Review: quarterly

  # Evidence Collection:
  evidence:
    enabled: true
    # Collect: breach evidence
    # Include: logs, screenshots, system state
    # Preserve: chain of custody
    # Retain: for audit (3 years)

  # Remediation Records:
  remediation:
    enabled: true
    # Document: breach remediation
    # Include: actions taken, timeline, effectiveness
    # Review: post-incident
    # Improve: breach response procedures` },
]

const FAQ = [
  { q: "What is the 72-hour deadline under GDPR Art. 33?", a: "GDPR Art. 33 requires notification of personal data breaches to the supervisory authority within 72 hours of becoming aware of the breach. The 72-hour period starts when the controller becomes aware of the breach, not when the breach occurred. If the breach is unlikely to result in a risk to data subjects, notification is not required. For AI systems, breaches involving model training data, inference data, or model parameters may require notification." },
  { q: "How do I classify AI data for GDPR?", a: "Classify AI data by: 1) Personal data — any information relating to an identified or identifiable natural person (names, email, IP addresses). 2) Special categories — sensitive data requiring additional protection (health, biometric, genetic data). 3) Pseudonymised data — personal data processed so it can no longer be attributed to a specific person without additional information. Document classification in your GDPR data inventory." },
  { q: "When is DPA notification required for AI breaches?", a: "DPA notification is required when: 1) The breach is likely to result in a risk to data subjects. 2) The breach involves special category data. 3) The breach involves large-scale data processing. For AI systems, breaches that expose training data, model parameters, or inference outputs may require notification. Assess risk based on likelihood and severity of impact on data subjects." },
  { q: "How does ClawGuru help with GDPR breach notification?", a: "ClawGuru provides executable runbooks for GDPR breach notification: 1) Automated breach detection and alerting. 2) Pre-built notification templates for DPA and data subjects. 3) Data classification templates for AI systems. 4) Comprehensive breach documentation. 5) Evidence collection and preservation. 6) Remediation tracking and reporting. ClawGuru ensures GDPR compliance and reduces breach response time." },
]

export default function GdprBreachNotificationAiPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "GDPR Breach Notification for AI", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "DSGVO Datenpannen-Meldungs-Guide für eigene KI-Systeme." : "GDPR breach notification guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · Batch 8</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "DSGVO Datenpannen-Meldung für KI" : "GDPR Breach Notification for AI"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "DSGVO Datenpannen-Meldung für KI-Systeme: 72-Stunden-Frist, Datenklassifizierung, Meldungsverfahren und Dokumentation für DSGVO Art. 33. Executable Runbooks für Self-Hosted AI-Infrastruktur."
            : "GDPR breach notification for AI systems: 72-hour deadline, data classification, notification procedures and documentation for GDPR Art. 33. Executable runbooks for self-hosted AI infrastructure."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 DSGVO Compliance-Kontrollen" : "4 GDPR Compliance Controls"}</h2>
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
            <a href={`/${locale}/moltbot/ai-data-loss-prevention`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Data Loss Prevention</div>
              <div className="text-sm text-gray-300">{isDE ? "DLP" : "DLP"}</div>
            </a>
            <a href={`/${locale}/solutions`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">All Solutions</div>
              <div className="text-sm text-gray-300">{isDE ? "Solutions-Übersicht" : "Solutions overview"}</div>
            </a>
            <a href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{isDE ? "Live-Check" : "Live check"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
