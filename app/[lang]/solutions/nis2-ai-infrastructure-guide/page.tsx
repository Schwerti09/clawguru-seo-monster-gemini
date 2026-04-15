import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/nis2-ai-infrastructure-guide"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "NIS2 KI-Infrastruktur-Guide: NIS2-AI-Infrastruktur-Compliance 2026 | ClawGuru Solutions"
    : "NIS2 AI Infrastructure Guide: NIS2 AI Infrastructure Compliance 2026 | ClawGuru Solutions"
  const description = isDE
    ? "NIS2-KI-Infrastruktur-Compliance: Risk Management, Supply Chain Security, Incident Reporting und AI-spezifische NIS2-Technische-Maßnahmen für Self-Hosted AI und LLMs 2026."
    : "NIS2 AI infrastructure compliance: risk management, supply chain security, incident reporting and AI-specific NIS2 technical measures for self-hosted AI and LLMs 2026."
  return {
    title, description,
    keywords: ["nis2 ai infrastructure", "nis2 ai compliance", "nis2 2026 ai", "nis2 llm security", "nis2 technical measures ai", "nis2 self-hosted"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const MEASURES = [
  { id: "NIS2-1", category: "Risk Management (Article 21a)", color: "blue", items: ["Identify: all AI systems and their criticality to essential services", "Classify: AI risks — availability risk, integrity risk, confidentiality risk", "Conduct: AI-specific risk assessment (prompt injection, model theft, supply chain)", "Document: risk treatment decisions with justification", "Review: AI risk assessment annually and after incidents", "Assign: named risk owner for each AI system"] },
  { id: "NIS2-2", category: "Supply Chain Security (Article 21b)", color: "orange", items: ["Inventory: all AI model providers, API vendors, training data sources", "Assess: security of AI supply chain components", "Require: security disclosures from AI vendors", "Contractual: include security requirements in AI vendor contracts", "Monitor: AI vendor security advisories", "Test: third-party AI models before deployment"] },
  { id: "NIS2-3", category: "Incident Reporting (Article 23)", color: "red", items: ["Define: AI incident — unauthorized model access, data poisoning, availability failure", "Timeline: notify NCA within 24h of significant AI security incident", "Report: full incident report within 72h", "Maintain: AI incident log for 3 years", "Train: teams on AI incident detection and classification", "Test: incident response procedures quarterly"] },
  { id: "NIS2-4", category: "Technical Measures (Article 21)", color: "green", items: ["Encrypt: AI model weights and training data at rest (AES-256)", "Encrypt: AI API traffic in transit (TLS 1.3)", "Implement: multi-factor authentication for AI system access", "Apply: network segmentation around AI inference infrastructure", "Monitor: AI systems for anomalous behavior 24/7", "Patch: AI dependencies within 48h for critical CVEs"] },
  { id: "NIS2-5", category: "Business Continuity (Article 21c)", color: "teal", items: ["Define: RTO/RPO for each AI system supporting essential services", "Maintain: clean backups of AI models and configurations", "Test: AI system recovery procedures quarterly", "Document: AI failover procedures", "Implement: redundancy for critical AI inference endpoints", "Review: business continuity plan annually"] },
]

const FAQ = [
  { q: "Which organizations are subject to NIS2 for AI infrastructure?", a: "NIS2 (Network and Information Security Directive 2) applies to: Essential entities — energy, transport, banking, financial market infrastructure, health, drinking water, digital infrastructure, ICT service management, public administration, space. Important entities — postal, waste management, chemicals, food, manufacturing, digital providers, research. For AI: any essential or important entity that uses AI systems in its operations must apply NIS2 requirements to that AI infrastructure. The key question: is the AI system part of your critical or important services? If yes, NIS2 applies." },
  { q: "What are the NIS2 notification requirements for AI incidents?", a: "NIS2 Article 23 notification requirements for AI security incidents: 1) Early warning — within 24 hours of becoming aware of a significant incident. 2) Incident notification — within 72 hours, including initial assessment, severity, indicators of compromise. 3) Intermediate report — on request from national competent authority (NCA). 4) Final report — within 1 month, full technical details, root cause, measures taken. Significant incident for AI: unauthorized access to AI systems, AI-mediated data breach, AI system availability failure affecting essential services." },
  { q: "How does NIS2 interact with the EU AI Act for AI systems?", a: "NIS2 and EU AI Act are complementary: NIS2 requires cybersecurity measures for network and information systems (including AI). EU AI Act requires safety and trustworthiness measures for AI systems. Both apply simultaneously for AI systems in essential sectors. Key overlap: 1) Supply chain security — both require vendor assessment. 2) Incident reporting — NIS2 to NCA, AI Act serious incidents to AI Office. 3) Risk management — both require documented risk assessments. 4) Technical documentation — both require detailed documentation. Organizations must satisfy both frameworks for in-scope AI systems." },
  { q: "What are the NIS2 penalties for AI security failures?", a: "NIS2 penalties: Essential entities — up to €10 million or 2% of global annual turnover, whichever is higher. Important entities — up to €7 million or 1.4% of global annual turnover, whichever is higher. Personal liability: NIS2 introduces management body accountability — senior executives can be held personally liable for repeated non-compliance. Implementation: member state NCAs enforce NIS2. Enforcement has been active since October 2024. For AI-specific failures (e.g., not reporting an AI-mediated breach within 24h), these penalties apply." },
]

export default function Nis2AiInfrastructureGuidePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"
  const colorMap: Record<string, string> = {
    blue: "bg-blue-900 border-blue-700 text-blue-300",
    orange: "bg-orange-900 border-orange-700 text-orange-300",
    red: "bg-red-900 border-red-700 text-red-300",
    green: "bg-green-900 border-green-700 text-green-300",
    teal: "bg-teal-900 border-teal-700 text-teal-300",
  }

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "NIS2 AI Infrastructure Guide", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "NIS2-Compliance-Guide für eigene KI-Infrastruktur. Kein Rechtsrat." : "NIS2 compliance guide for your own AI infrastructure. Not legal advice."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · Batch 11</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "NIS2 KI-Infrastruktur-Guide 2026" : "NIS2 AI Infrastructure Guide 2026"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "NIS2 gilt seit Oktober 2024 — und erfasst KI-Systeme in kritischen Sektoren. Fünf technische Maßnahmenbereiche: Risk Management, Supply Chain, Incident Reporting, Technical Measures und Business Continuity."
            : "NIS2 has been in force since October 2024 — and covers AI systems in critical sectors. Five technical measure areas: risk management, supply chain, incident reporting, technical measures and business continuity."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "5 NIS2 Maßnahmenbereiche für KI" : "5 NIS2 Measure Areas for AI"}</h2>
          <div className="space-y-4">
            {MEASURES.map((m) => (
              <div key={m.id} className={`rounded-lg border p-5 ${colorMap[m.color]}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs font-bold bg-black/30 px-2 py-0.5 rounded">{m.id}</span>
                  <span className="font-bold">{m.category}</span>
                </div>
                <ul className="space-y-1">
                  {m.items.map((item, i) => (
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
            <a href={`/${locale}/solutions/eu-ai-act-compliance-checklist`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">EU AI Act Compliance</div>
              <div className="text-sm text-gray-300">{isDE ? "EU-KI-Gesetz" : "EU AI Act"}</div>
            </a>
            <a href={`/${locale}/solutions/nist-csf-ai-profile`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">NIST CSF AI Profile</div>
              <div className="text-sm text-gray-300">{isDE ? "NIST-CSF für AI" : "NIST CSF for AI"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-incident-response`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Incident Response</div>
              <div className="text-sm text-gray-300">{isDE ? "Incident-Response" : "Incident response"}</div>
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
