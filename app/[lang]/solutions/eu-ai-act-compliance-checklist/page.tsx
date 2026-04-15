import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/eu-ai-act-compliance-checklist"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "EU AI Act Compliance Checklist: EU-KI-Gesetz-Compliance-Checkliste 2026 | ClawGuru"
    : "EU AI Act Compliance Checklist: EU AI Act Compliance Checklist 2026 | ClawGuru Solutions"
  const description = isDE
    ? "EU-KI-Gesetz-Compliance-Checkliste 2026: Risikoklassifizierung, Technische Dokumentation, Transparenzpflichten und Post-Market-Monitoring für Self-Hosted AI und LLMs."
    : "EU AI Act compliance checklist 2026: risk classification, technical documentation, transparency obligations and post-market monitoring for self-hosted AI and LLMs."
  return {
    title, description,
    keywords: ["eu ai act compliance checklist", "eu ai act 2026", "eu ai act llm", "ki-gesetz compliance", "eu ai act self-hosted", "high-risk ai systems"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CHECKLIST = [
  { id: "EUAI-1", category: "Risk Classification", status: "Mandatory first step", items: [
    "Identify AI system scope: provider, deployer, or importer role",
    "Classify AI system: Unacceptable risk, High risk, Limited risk, or Minimal risk",
    "Check Annex III: is the system in a high-risk category (biometric, critical infra, education, employment, essential services, law enforcement, migration, justice)?",
    "GPAI (General Purpose AI) check: does the system qualify as GPAI or GPAI with systemic risk?",
    "Document risk classification decision with reasoning",
    "Review classification annually and after significant changes",
  ]},
  { id: "EUAI-2", category: "Technical Documentation (Article 11)", status: "Required for High-Risk", items: [
    "Document general description of AI system and its intended purpose",
    "Include detailed description of system design: architecture, training data, training methodology",
    "Document risk management system (Article 9) process and outcomes",
    "Include data governance documentation (Article 10): training data sources, quality measures",
    "Document technical robustness and accuracy metrics",
    "Maintain documentation for 10 years after last placement on market",
  ]},
  { id: "EUAI-3", category: "Transparency Obligations (Article 13, 52)", status: "Required for all AI systems", items: [
    "High-risk AI: provide instructions for use to deployers (Article 13)",
    "Chatbots & synthetic media: inform users they are interacting with AI (Article 52)",
    "Emotion recognition / biometric: inform individuals before processing",
    "GPAI: publish model card with capabilities, limitations, and risks",
    "Document: AI-generated content labeling for deepfakes",
    "Review transparency requirements as regulations evolve",
  ]},
  { id: "EUAI-4", category: "Human Oversight (Article 14)", status: "Required for High-Risk", items: [
    "Implement human oversight measures appropriate to risks",
    "Enable humans to understand AI system outputs",
    "Enable humans to override or halt AI system decisions",
    "Assign oversight responsibility to named individuals",
    "Train: humans responsible for oversight on AI system capabilities and limitations",
    "Log: all human oversight interventions",
  ]},
  { id: "EUAI-5", category: "Post-Market Monitoring (Article 72)", status: "Required for High-Risk", items: [
    "Implement post-market monitoring system for AI performance",
    "Collect and analyse user feedback and incident reports",
    "Monitor for serious incidents and report to authorities",
    "Report: serious incidents to market surveillance authority within 15 days",
    "Update risk management system based on monitoring findings",
    "Document all post-market monitoring activities",
  ]},
  { id: "EUAI-6", category: "GPAI Model Obligations (Articles 53-56)", status: "Required for GPAI providers", items: [
    "Prepare and maintain technical documentation",
    "Establish and implement copyright compliance policy",
    "Publish summary of training data used (Article 53(1)(d))",
    "GPAI with systemic risk (>10^25 FLOPs): adversarial testing required",
    "GPAI with systemic risk: report serious incidents to EU AI Office",
    "GPAI with systemic risk: ensure adequate cybersecurity protection",
  ]},
]

const FAQ = [
  { q: "When does the EU AI Act fully apply?", a: "EU AI Act timeline: August 2024 — entered into force. February 2025 — unacceptable risk AI systems prohibited. August 2025 — GPAI model obligations apply. August 2026 — high-risk AI systems in Annex III must comply. Some provisions for existing systems extended to 2027. Key: if you have a GPAI model (LLM), you must comply with Articles 53-56 from August 2025. For high-risk AI systems, August 2026 is the key deadline." },
  { q: "Does the EU AI Act apply to self-hosted AI systems?", a: "Yes. The EU AI Act applies to AI systems placed on the EU market or put into service in the EU — this includes self-hosted AI systems used by EU-based organizations or serving EU users. Key roles: Provider (develops or places AI system on market), Deployer (uses AI system in professional context), Importer/Distributor. If you self-host an AI system for internal use in the EU, you may be both provider and deployer. Review your specific situation with legal counsel." },
  { q: "What is a GPAI model under the EU AI Act?", a: "GPAI (General Purpose AI) models under the EU AI Act are AI models trained on large amounts of data using self-supervision at scale, capable of performing a wide range of distinct tasks. This includes most large language models (LLMs) like GPT-4, Llama, Mistral, etc. GPAI models have specific obligations under Articles 53-56. GPAI models with 'systemic risk' (>10^25 FLOPs training compute) have additional obligations: adversarial testing, incident reporting, cybersecurity measures." },
  { q: "What are the penalties for EU AI Act non-compliance?", a: "EU AI Act penalties: Unacceptable risk violations (prohibited AI): up to €35 million or 7% of global annual turnover. High-risk AI system violations: up to €15 million or 3% of global annual turnover. Providing incorrect information to authorities: up to €7.5 million or 1.5% of global annual turnover. For SMEs: penalties are proportionate and capped at lower absolute amounts. National market surveillance authorities enforce the Act in each member state." },
]

export default function EuAiActComplianceChecklistPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "EU AI Act Compliance Checklist", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "EU-KI-Gesetz-Compliance-Guide für eigene KI-Systeme. Kein Rechtsrat." : "EU AI Act compliance guide for your own AI systems. Not legal advice."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · Batch 10</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "EU AI Act Compliance Checklist 2026" : "EU AI Act Compliance Checklist 2026"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Das EU-KI-Gesetz ist in Kraft — GPAI-Pflichten seit August 2025, High-Risk-AI seit August 2026. Diese Checkliste zeigt die sechs kritischen Compliance-Bereiche, die jedes KI-Team kennen muss."
            : "The EU AI Act is in force — GPAI obligations since August 2025, high-risk AI since August 2026. This checklist covers the six critical compliance areas every AI team must know."}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "EU-KI-Gesetz Compliance-Checkliste" : "EU AI Act Compliance Checklist"}</h2>
          <div className="space-y-5">
            {CHECKLIST.map((section) => (
              <div key={section.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{section.id}</span>
                    <span className="font-bold text-gray-100">{section.category}</span>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">{section.status}</span>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="mt-0.5 text-gray-600 flex-shrink-0">☐</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
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
            <a href={`/${locale}/solutions/iso27001-ai-systems-roadmap`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">ISO 27001 AI Systems Roadmap</div>
              <div className="text-sm text-gray-300">{isDE ? "ISO-27001-Roadmap" : "ISO 27001 roadmap"}</div>
            </a>
            <a href={`/${locale}/solutions/nist-csf-ai-profile`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">NIST CSF AI Profile</div>
              <div className="text-sm text-gray-300">{isDE ? "NIST-CSF für AI" : "NIST CSF for AI"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-regulatory-reporting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Regulatory Reporting</div>
              <div className="text-sm text-gray-300">{isDE ? "Regulatory-Reporting" : "Regulatory reporting"}</div>
            </a>
            <a href={`/${locale}/solutions/gdpr-breach-notification-ai`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">GDPR Breach Notification AI</div>
              <div className="text-sm text-gray-300">{isDE ? "GDPR + EU AI Act" : "GDPR + EU AI Act"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
