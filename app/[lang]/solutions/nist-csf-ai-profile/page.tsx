import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/nist-csf-ai-profile"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "NIST CSF AI Profile: NIST-CSF-KI-Profil für Self-Hosted AI | ClawGuru Solutions"
    : "NIST CSF AI Profile: NIST Cybersecurity Framework for AI Systems | ClawGuru Solutions"
  const description = isDE
    ? "NIST CSF 2.0 AI-Profil: Govern, Identify, Protect, Detect, Respond und Recover für KI-Systeme. Executable Runbooks für NIST-CSF-Compliance bei Self-Hosted AI und LLMs."
    : "NIST CSF 2.0 AI profile: Govern, Identify, Protect, Detect, Respond and Recover for AI systems. Executable runbooks for NIST CSF compliance with self-hosted AI and LLMs."
  return {
    title, description,
    keywords: ["nist csf ai profile", "nist csf 2.0 ai", "nist cybersecurity framework ai", "nist ai compliance", "nist csf llm", "nist csf self-hosted"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const FUNCTIONS = [
  { id: "GV", name: "GOVERN", color: "purple", desc: "Establish AI governance policies, roles, and accountability structures.", items: ["Define AI risk appetite and acceptable use policy", "Assign AI risk ownership to named individuals", "Establish AI ethics board or review committee", "Document AI system inventory with risk classification", "Define supply chain requirements for AI components", "Review AI governance quarterly"] },
  { id: "ID", name: "IDENTIFY", color: "blue", desc: "Understand AI assets, risks, and business context.", items: ["Inventory all AI systems, models, and data pipelines", "Classify AI data by sensitivity (PHI, PII, trade secrets)", "Identify AI-specific threats: prompt injection, model theft, poisoning", "Map AI data flows and third-party dependencies", "Assess AI risk for each system (likelihood × impact)", "Document AI system dependencies and interconnections"] },
  { id: "PR", name: "PROTECT", color: "green", desc: "Implement safeguards to protect AI systems and data.", items: ["Enforce least privilege for AI system access", "Encrypt AI model weights and training data at rest (AES-256)", "Encrypt AI API traffic in transit (TLS 1.3)", "Implement prompt injection defenses (input sanitization)", "Secure ML pipelines with code signing and integrity checks", "Apply output filtering and DLP for AI outputs"] },
  { id: "DE", name: "DETECT", color: "yellow", desc: "Detect anomalies and AI security events.", items: ["Monitor AI inference for anomalous behavior patterns", "Detect prompt injection and jailbreak attempts in real time", "Alert on unusual model output distributions", "Log all AI system access and usage events", "Implement behavioral baselines for AI agents", "Run automated red team scans daily"] },
  { id: "RS", name: "RESPOND", color: "orange", desc: "Respond to AI security incidents.", items: ["Maintain AI incident response playbook", "Define escalation paths for AI-specific incidents", "Contain: isolate compromised AI systems within 15 minutes", "Communicate: notify stakeholders per incident classification", "Analyze: root cause of AI security events", "Document: all response actions for post-incident review"] },
  { id: "RC", name: "RECOVER", color: "teal", desc: "Restore AI capabilities after an incident.", items: ["Maintain clean backups of AI models and training data", "Test AI system recovery procedures quarterly", "Define RTO/RPO for each AI system", "Restore from known-good model checkpoint", "Verify AI system integrity before resuming production", "Update defenses based on lessons learned"] },
]

const FAQ = [
  { q: "What is the NIST CSF AI Profile?", a: "The NIST CSF (Cybersecurity Framework) AI Profile is an application of NIST CSF 2.0 to AI systems. NIST CSF 2.0 introduced six functions: Govern, Identify, Protect, Detect, Respond, and Recover. The AI Profile maps these functions to AI-specific risks and controls — covering threats like prompt injection, model theft, training data poisoning, and hallucination-based harm. NIST also published the AI Risk Management Framework (AI RMF 1.0) which complements CSF for AI governance." },
  { q: "How does NIST CSF 2.0 differ from NIST CSF 1.1 for AI?", a: "NIST CSF 2.0 (released 2024) adds the GOVERN function — not present in v1.1. GOVERN addresses organizational context, risk management strategy, and supply chain security. For AI: GOVERN requires organizations to establish AI governance policies, assign AI risk ownership, and assess AI supplier risks. This is critical for AI because governance gaps (unclear ownership, no AI acceptable use policy) are common root causes of AI security failures. CSF 2.0 is significantly better suited for AI risk management than v1.1." },
  { q: "Is NIST CSF compliance mandatory?", a: "NIST CSF is voluntary for most private sector organizations, but is effectively required for US federal contractors (via FISMA/FedRAMP) and increasingly referenced in regulations worldwide. For AI specifically: EU AI Act references risk management frameworks compatible with NIST AI RMF. Some US state regulations require NIST CSF alignment. Organizations in critical infrastructure sectors (energy, healthcare, finance) may have regulatory requirements tied to NIST CSF. Even where voluntary, NIST CSF provides a strong defensible security posture." },
  { q: "How do I prioritize NIST CSF controls for AI?", a: "Prioritize NIST CSF controls for AI by risk: 1) CRITICAL (implement first): Prompt injection defense (PROTECT), AI incident response playbook (RESPOND), AI system inventory (IDENTIFY). 2) HIGH: AI access control and encryption (PROTECT), anomaly detection (DETECT), AI governance policy (GOVERN). 3) MEDIUM: Supplier assessment for AI APIs (GOVERN), recovery procedures (RECOVER), threat modeling (IDENTIFY). Use the NIST CSF tiers (1-4) to assess current and target maturity. Most organizations start at Tier 1-2 for AI and target Tier 3." },
]

const colorMap: Record<string, string> = {
  purple: "bg-purple-900 border-purple-700 text-purple-300",
  blue: "bg-blue-900 border-blue-700 text-blue-300",
  green: "bg-green-900 border-green-700 text-green-300",
  yellow: "bg-yellow-900 border-yellow-700 text-yellow-300",
  orange: "bg-orange-900 border-orange-700 text-orange-300",
  teal: "bg-teal-900 border-teal-700 text-teal-300",
}

export default function NistCsfAiProfilePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "NIST CSF AI Profile", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "NIST-CSF-Compliance-Guide für eigene KI-Systeme." : "NIST CSF compliance guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · Batch 10</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "NIST CSF AI Profile" : "NIST CSF AI Profile"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "NIST CSF 2.0 ist der globale Standard für Cybersecurity-Governance — jetzt mit AI-Profil. Sechs Funktionen: Govern, Identify, Protect, Detect, Respond und Recover, direkt auf KI-Systeme gemappt."
            : "NIST CSF 2.0 is the global standard for cybersecurity governance — now with AI profile. Six functions: Govern, Identify, Protect, Detect, Respond and Recover, directly mapped to AI systems."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "NIST CSF 2.0 Funktionen für KI" : "NIST CSF 2.0 Functions for AI"}</h2>
          <div className="space-y-4">
            {FUNCTIONS.map((fn) => (
              <div key={fn.id} className={`rounded-lg border p-5 ${colorMap[fn.color]}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs font-bold bg-black/30 px-2 py-0.5 rounded">{fn.id}</span>
                  <span className="font-bold text-lg">{fn.name}</span>
                </div>
                <p className="text-sm opacity-80 mb-3">{fn.desc}</p>
                <ul className="space-y-1">
                  {fn.items.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2 opacity-90">
                      <span className="mt-0.5 opacity-60">›</span><span>{item}</span>
                    </li>
                  ))}
                </ul>
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
            <a href={`/${locale}/solutions/iso27001-ai-systems-roadmap`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">ISO 27001 AI Systems Roadmap</div>
              <div className="text-sm text-gray-300">{isDE ? "ISO-27001-Roadmap" : "ISO 27001 roadmap"}</div>
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
