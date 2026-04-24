import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/pci-dss-ai-payments-v2"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "PCI DSS v4.0 AI Payments: PCI-DSS-KI-Zahlungs-Compliance 2026 | ClawGuru Solutions", "PCI DSS v4.0 AI Payments: PCI DSS AI Payments Compliance 2026 | ClawGuru Solutions")
  const description = pick(isDE, "PCI DSS v4.0 für KI-gestützte Zahlungssysteme: Cardholder Data Scoping, AI Model Access Control, Fraud Detection Logging und AI-spezifische PCI-DSS-Kontrollen 2026.", "PCI DSS v4.0 for AI-powered payment systems: cardholder data scoping, AI model access control, fraud detection logging and AI-specific PCI DSS controls 2026.")
  return {
    title, description,
    keywords: ["pci dss v4 ai payments", "pci dss ai compliance", "pci dss 4.0 ai", "ai fraud detection pci", "pci dss llm", "payment security ai 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const REQUIREMENTS = [
  { id: "REQ-3", name: "Protect Stored Account Data", color: "red", items: ["Scope AI model training data: identify all cardholder data (CHD) used", "Encrypt CHD in AI training datasets (AES-256)", "Tokenize PANs before use in AI model inputs", "Restrict AI model access to raw CHD — use tokens only", "Implement data retention: purge CHD from AI training data after use", "Document: all locations where CHD exists in AI pipelines"] },
  { id: "REQ-7", name: "Restrict Access to System Components", color: "orange", items: ["Apply least privilege to AI model serving infrastructure", "Restrict: only authorized services can call AI fraud detection APIs", "Implement RBAC for AI model management", "Separate: AI training environment from production", "Block: direct human access to AI model weights in production", "Review: AI system access quarterly"] },
  { id: "REQ-10", name: "Log and Monitor All Access", color: "yellow", items: ["Log: all AI model inference requests with timestamp and user context", "Log: all fraud detection decisions with model version", "Retain: AI audit logs for minimum 12 months", "Protect: logs from tampering (append-only, signed)", "Alert: on anomalous AI model output patterns", "Review: AI access logs daily"] },
  { id: "REQ-11", name: "Test Security Regularly", color: "blue", items: ["Run quarterly vulnerability scans on AI infrastructure", "Penetration test: AI API endpoints annually", "Test: prompt injection resistance of AI fraud models", "Test: AI model output validation and filtering", "Run: adversarial examples against fraud detection model", "Document: all test results and remediation"] },
  { id: "REQ-12", name: "Support Information Security Policies", color: "purple", items: ["Maintain AI security policy covering payment data handling", "Train: all AI developers on PCI DSS requirements", "Document: AI model risk assessment for payment systems", "Maintain: AI incident response plan covering CHD breach", "Review: AI security policy annually", "Assign: named AI security owner"] },
]

const FAQ = [
  { q: "Does PCI DSS v4.0 have specific requirements for AI systems?", a: "PCI DSS v4.0 (effective April 2024, customized approach mandatory March 2025) does not have AI-specific requirements, but all PCI DSS requirements apply to AI systems that process, store, or transmit cardholder data. New in v4.0 relevant to AI: 1) Customized approach — organizations can define custom controls for new technologies like AI. 2) Targeted risk analysis — required to justify control implementations. 3) Stronger authentication requirements for AI system access. 4) Enhanced logging requirements. AI fraud detection systems that access PANs are in PCI scope and must meet all applicable requirements." },
  { q: "How do I scope AI systems for PCI DSS?", a: "Scope AI systems for PCI DSS by following the data flow: 1) Map: all data flows into and out of AI systems. 2) Identify: does the AI system process, store, or transmit cardholder data (CHD)? 3) Does the AI system connect to systems that process CHD? If yes to either: the AI system is in scope. Mitigation strategies to reduce scope: 1) Tokenization — replace PANs with tokens before AI processing. 2) Truncation — use only last 4 digits for AI features. 3) Network segmentation — isolate AI systems from CHD systems. 4) Point-to-point encryption (P2PE) — encrypt before any AI system can see data." },
  { q: "Can AI fraud detection models themselves be a PCI DSS risk?", a: "Yes. AI fraud detection models create several PCI DSS risks: 1) Training data — if CHD is used in training data, that data must be protected as in-scope. 2) Model memorization — LLMs can memorize training data including PANs. 3) Model inversion attacks — adversaries may extract training data from models. 4) Adversarial examples — attackers craft transactions to evade detection. Mitigations: use tokenized data for training, apply differential privacy, regularly test models with adversarial inputs, monitor for data leakage." },
  { q: "What are the new PCI DSS v4.0 requirements most relevant to AI?", a: "Key PCI DSS v4.0 changes for AI systems: 1) Requirement 6.2.4 — all security attacks must be detected and protected against, including AI-specific attacks. 2) Requirement 8.3.6 — passwords for system accounts (including AI service accounts) must be changed every 3 months or use strong cryptography. 3) Requirement 10.7 — failures of critical security controls must be detected and reported. 4) Requirement 12.3.2 — targeted risk analysis for each PCI DSS requirement. The 'customized approach' lets organizations define AI-specific control implementations." },
]

export default function PciDssAiPaymentsV2Page({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"
  const colorMap: Record<string, string> = {
    red: "bg-red-900 border-red-700 text-red-300",
    orange: "bg-orange-900 border-orange-700 text-orange-300",
    yellow: "bg-yellow-900 border-yellow-700 text-yellow-300",
    blue: "bg-blue-900 border-blue-700 text-blue-300",
    purple: "bg-purple-900 border-purple-700 text-purple-300",
  }

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "PCI DSS AI Payments v2", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "PCI-DSS-Compliance-Guide für eigene KI-Zahlungssysteme. Kein Rechtsrat.", "PCI DSS compliance guide for your own AI payment systems. Not legal advice.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · Batch 11</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "PCI DSS v4.0 für KI-Zahlungssysteme", "PCI DSS v4.0 for AI Payment Systems")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "KI-gestützte Fraud Detection verarbeitet oft Karteninhaber-Daten — und ist damit im PCI-Scope. Fünf kritische Requirements für AI-Zahlungssysteme.", "AI-powered fraud detection often processes cardholder data — putting it in PCI scope. Five critical requirements for AI payment systems.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "5 PCI DSS Requirements für AI", "5 PCI DSS Requirements for AI")}</h2>
          <div className="space-y-4">
            {REQUIREMENTS.map((r) => (
              <div key={r.id} className={`rounded-lg border p-5 ${colorMap[r.color]}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs font-bold bg-black/30 px-2 py-0.5 rounded">{r.id}</span>
                  <span className="font-bold">{r.name}</span>
                </div>
                <ul className="space-y-1">
                  {r.items.map((item, i) => (
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
            <a href={`/${locale}/solutions/eu-ai-act-compliance-checklist`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">EU AI Act Compliance</div>
              <div className="text-sm text-gray-300">{pick(isDE, "EU-KI-Gesetz", "EU AI Act")}</div>
            </a>
            <a href={`/${locale}/solutions/nist-csf-ai-profile`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">NIST CSF AI Profile</div>
              <div className="text-sm text-gray-300">{pick(isDE, "NIST-CSF für AI", "NIST CSF for AI")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-audit-logging`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Audit Logging</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Audit-Logging", "Audit logging")}</div>
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
