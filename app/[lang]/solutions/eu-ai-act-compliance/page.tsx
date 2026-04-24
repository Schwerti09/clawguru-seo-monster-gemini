import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/eu-ai-act-compliance"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "EU AI Act Compliance für Self-Hosted KI-Systeme 2025/2026 | ClawGuru", "EU AI Act Compliance for Self-Hosted AI Systems 2025/2026 | ClawGuru")
  const description = pick(isDE, "EU AI Act Compliance umsetzen: Risikoklassifizierung, High-Risk-Anforderungen, technische Dokumentation, Konformitätsbewertung und Post-Market-Monitoring für selbst gehostete KI-Systeme.", "Implement EU AI Act compliance: risk classification, high-risk requirements, technical documentation, conformity assessment and post-market monitoring for self-hosted AI systems.")
  return {
    title, description,
    keywords: ["eu ai act compliance", "eu ai act high risk", "ai act self-hosted", "ai act technical documentation", "eu ai act 2025", "ai regulation compliance"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const RISK_CLASSES = [
  { level: "Unacceptable Risk", color: "red", banned: true, examples: ["Social scoring by governments", "Real-time biometric surveillance in public", "Emotion recognition at work/school", "Subliminal manipulation"], requirement: "PROHIBITED — cannot deploy" },
  { level: "High Risk", color: "orange", banned: false, examples: ["AI in medical devices", "Critical infrastructure management", "Education/vocational training", "Employment/HR decisions", "Law enforcement", "Border control", "Administration of justice"], requirement: "Mandatory: risk management, data governance, technical docs, human oversight, accuracy, robustness, cybersecurity" },
  { level: "Limited Risk", color: "yellow", banned: false, examples: ["Chatbots", "Deepfake generators", "AI-generated content"], requirement: "Transparency: must disclose AI interaction, label synthetic content" },
  { level: "Minimal Risk", color: "green", banned: false, examples: ["AI-powered games", "Spam filters", "AI recommendations"], requirement: "No mandatory requirements — voluntary codes of conduct encouraged" },
]

const HIGH_RISK_REQUIREMENTS = [
  { id: "Art. 9", title: "Risk Management System", desc: "Continuous risk management throughout lifecycle. Identify, analyze and evaluate risks. Test residual risks before deployment.", auto: true },
  { id: "Art. 10", title: "Data Governance", desc: "Training, validation and testing data: relevant, representative, free of errors. Document data sources, characteristics and potential biases.", auto: false },
  { id: "Art. 11", title: "Technical Documentation", desc: "Before placing on market: complete technical documentation. General description, design specs, training methodology, performance metrics.", auto: false },
  { id: "Art. 12", title: "Record-Keeping / Logging", desc: "Automatic event logging for lifespan. Traceability of AI decisions. Retention period appropriate to intended purpose.", auto: true },
  { id: "Art. 13", title: "Transparency & Information", desc: "Deployers must receive sufficient information to use correctly. User-facing documentation mandatory.", auto: false },
  { id: "Art. 14", title: "Human Oversight", desc: "Technical measures enabling human oversight. Ability to interrupt, stop or override AI system. Monitor for anomalies and risks.", auto: true },
  { id: "Art. 15", title: "Accuracy, Robustness, Cybersecurity", desc: "Appropriate accuracy for intended purpose. Resilience to errors, faults and adversarial inputs. Cybersecurity measures throughout lifecycle.", auto: true },
]

const FAQ = [
  { q: "When does the EU AI Act apply?", a: "The EU AI Act entered into force August 2024. Key dates: February 2025 — prohibited AI systems banned. August 2025 — GPAI model obligations apply. August 2026 — high-risk AI system requirements fully applicable. August 2027 — high-risk AI in regulated products (medical devices, machinery). Self-hosted AI systems deployed in the EU that qualify as high-risk must comply by August 2026." },
  { q: "Is my self-hosted Moltbot/AI agent system high-risk?", a: "Most internal IT management AI (security monitoring, log analysis, infrastructure automation) falls under 'minimal risk' — no mandatory requirements. You are high-risk if your AI system makes or significantly influences decisions about: hiring, credit/insurance, education admission, benefits, law enforcement, border control, or medical treatment. Self-hosted AI for DevOps, security, and monitoring is generally minimal risk." },
  { q: "What is required for high-risk AI systems?", a: "Seven mandatory requirements: 1) Risk management system (ongoing). 2) Data governance documentation. 3) Technical documentation before deployment. 4) Automatic event logging with tamper-proof records. 5) Transparency information for deployers and users. 6) Human oversight mechanisms (ability to override/stop). 7) Appropriate accuracy, robustness, and cybersecurity measures. Moltbot automates requirements 1, 4, 6, and 7." },
  { q: "How does the EU AI Act relate to GDPR?", a: "The EU AI Act and GDPR are complementary, not alternatives. If your AI processes personal data: both apply simultaneously. GDPR covers data protection (lawful basis, data subject rights, breach notification). The AI Act covers AI system safety, transparency, and human oversight. For high-risk AI processing personal data: data protection impact assessment (DPIA) under GDPR + conformity assessment under AI Act are both required." },
]

export default function EuAiActCompliancePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "EU AI Act Compliance", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "HowTo", name: "Implement EU AI Act Compliance", totalTime: "PT80H", step: [
      { "@type": "HowToStep", name: "Classify AI system risk level", text: "Map all AI systems to unacceptable/high/limited/minimal risk. Document classification rationale." },
      { "@type": "HowToStep", name: "If high-risk: establish risk management system", text: "Implement Art. 9 continuous risk management. Document risks, mitigation measures, residual risks." },
      { "@type": "HowToStep", name: "Implement mandatory logging (Art. 12)", text: "Configure tamper-proof event logging for all AI decisions. Define retention period." },
      { "@type": "HowToStep", name: "Enable human oversight (Art. 14)", text: "Implement override/stop mechanisms. Monitor for anomalies. Train human operators." },
      { "@type": "HowToStep", name: "Harden AI security (Art. 15)", text: "Implement cybersecurity measures: prompt injection defense, sandboxing, access control, adversarial robustness testing." },
      { "@type": "HowToStep", name: "Complete technical documentation (Art. 11)", text: "Before deployment: complete technical documentation including design specs, training methodology, performance metrics." },
    ]},
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Compliance-Leitfaden — kein Rechtsrat.", "Compliance guide — not legal advice.")}
        </div>

        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · EU AI Act</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "EU AI Act Compliance für Self-Hosted KI-Systeme", "EU AI Act Compliance for Self-Hosted AI Systems")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Der EU AI Act (in Kraft seit August 2024) klassifiziert KI-Systeme in 4 Risikoklassen. Für High-Risk-Systeme gelten ab August 2026 verpflichtende Anforderungen — Moltbot automatisiert 4 von 7.", "The EU AI Act (in force since August 2024) classifies AI systems into 4 risk classes. High-risk systems face mandatory requirements from August 2026 — Moltbot automates 4 of 7.")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "4", label: pick(isDE, "Risikoklassen", "Risk classes") },
            { value: "Aug 2026", label: pick(isDE, "High-Risk Deadline", "High-risk deadline") },
            { value: "7", label: pick(isDE, "High-Risk Anforderungen", "High-risk requirements") },
            { value: "4/7", label: pick(isDE, "Mit Moltbot automatisiert", "Automated with Moltbot") },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "4 Risikoklassen — Klassifizierung", "4 Risk Classes — Classification")}
          </h2>
          <div className="space-y-4">
            {RISK_CLASSES.map((rc) => (
              <div key={rc.level} className={`bg-${rc.color}-900 p-5 rounded-lg border border-${rc.color}-700`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold text-${rc.color}-100 text-lg`}>{rc.level}</span>
                  {rc.banned && <span className="text-xs font-bold bg-red-800 text-red-200 px-2 py-1 rounded">PROHIBITED</span>}
                </div>
                <p className={`text-sm text-${rc.color}-200 mb-2 font-medium`}>{rc.requirement}</p>
                <div className="flex flex-wrap gap-2">
                  {rc.examples.map((ex) => (
                    <span key={ex} className={`text-xs bg-${rc.color}-800 text-${rc.color}-200 px-2 py-0.5 rounded`}>{ex}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "High-Risk: 7 Pflichtanforderungen", "High-Risk: 7 Mandatory Requirements")}
          </h2>
          <div className="space-y-3">
            {HIGH_RISK_REQUIREMENTS.map((req) => (
              <div key={req.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{req.id}</span>
                    <span className="font-semibold text-gray-100">{req.title}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${req.auto ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-400"}`}>
                    {req.auto ? (pick(isDE, "Automatisierbar", "Automatable")) : (pick(isDE, "Manuell", "Manual"))}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{req.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Zeitplan", "Timeline")}
          </h2>
          <div className="space-y-3">
            {[
              { date: "Aug 2024", e: pick(isDE, "EU AI Act in Kraft getreten", "EU AI Act entered into force"), done: true },
              { date: "Feb 2025", e: pick(isDE, "Verbotene KI-Systeme (Art. 5) — JETZT AKTIV", "Prohibited AI systems (Art. 5) — NOW ACTIVE"), done: true },
              { date: "Aug 2025", e: pick(isDE, "GPAI-Modell-Anforderungen (GPT-4-Klasse)", "GPAI model obligations (GPT-4 class)"), done: false },
              { date: "Aug 2026", e: pick(isDE, "High-Risk KI-Anforderungen vollständig anwendbar", "High-risk AI requirements fully applicable"), done: false },
              { date: "Aug 2027", e: pick(isDE, "High-Risk KI in regulierten Produkten (Medizinprodukte, Maschinen)", "High-risk AI in regulated products (medical devices, machinery)"), done: false },
            ].map((t) => (
              <div key={t.date} className={`flex items-start gap-4 p-3 rounded-lg border ${t.done ? "bg-green-900/30 border-green-700" : "bg-gray-800 border-gray-700"}`}>
                <span className={`font-mono text-sm font-bold flex-shrink-0 ${t.done ? "text-green-300" : "text-cyan-400"}`}>{t.date}</span>
                <span className={`text-sm ${t.done ? "text-green-200" : "text-gray-300"}`}>{t.e}</span>
                {t.done && <span className="text-xs text-green-400 flex-shrink-0 ml-auto">✓ {pick(isDE, "Aktiv", "Active")}</span>}
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
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Hub</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Art. 15 — Cybersecurity für KI", "Art. 15 — Cybersecurity for AI")}</div>
            </a>
            <a href={`/${locale}/solutions/dsgvo-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "DSGVO Compliance", "GDPR Compliance")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "AI Act + DSGVO kombinieren", "Combine AI Act + GDPR")}</div>
            </a>
            <a href={`/${locale}/solutions/nist-csf-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">NIST CSF 2.0</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Ergänzendes Framework", "Complementary framework")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-red-teaming`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Red Teaming</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Art. 15 — Robustheitstests", "Art. 15 — Robustness testing")}</div>
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
