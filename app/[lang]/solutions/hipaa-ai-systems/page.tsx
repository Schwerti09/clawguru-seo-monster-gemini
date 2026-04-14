import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/hipaa-ai-systems"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "HIPAA Compliance for AI Systems: Technical Safeguards Guide | ClawGuru"
  const description = "HIPAA technical safeguards for AI systems: ePHI protection in LLM prompts, audit logging requirements, access control for AI agents, breach notification for AI incidents. Self-hosted AI HIPAA guide."
  return {
    title, description,
    keywords: ["hipaa ai compliance", "hipaa llm", "hipaa ai systems", "hipaa technical safeguards ai", "ephi in llm", "hipaa self-hosted ai"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const SAFEGUARDS = [
  { id: "§164.312(a)", name: "Access Control", rule: "Unique user IDs, automatic logoff, encryption/decryption", ai_impl: "Per-agent unique identity (mTLS cert). Automatic session termination on inactivity. No shared AI agent credentials. Capability tokens scoped to minimum ePHI access.", auto: true },
  { id: "§164.312(b)", name: "Audit Controls", rule: "Hardware, software, and procedural mechanisms to record and examine ePHI access", ai_impl: "Moltbot logs every AI agent interaction with ePHI: timestamp, user_id, agent_id, data accessed (hashed), action taken. Tamper-evident hash chain. Minimum 6-year retention.", auto: true },
  { id: "§164.312(c)", name: "Integrity", rule: "Protect ePHI from improper alteration or destruction", ai_impl: "Hash verification on retrieved ePHI before AI processing. Audit log of all AI-generated modifications to records. Prevent AI agents from deleting ePHI without human approval.", auto: true },
  { id: "§164.312(d)", name: "Person Authentication", rule: "Verify user identity before access to ePHI", ai_impl: "MFA required for users accessing AI systems that process ePHI. AI agents authenticate via signed capability tokens — not username/password.", auto: false },
  { id: "§164.312(e)", name: "Transmission Security", rule: "Encryption in transit for ePHI", ai_impl: "TLS 1.3 for all API calls. No ePHI in URL parameters (use POST body). mTLS for agent-to-agent communication. Never send ePHI to external LLM APIs — use self-hosted models only.", auto: true },
]

const PHI_RISKS = [
  { risk: "ePHI in LLM Prompts", severity: "CRITICAL", desc: "Patient data sent to external LLM API (OpenAI, Anthropic) = HIPAA violation. PHI leaves covered entity without BAA or to non-HIPAA-compliant service.", mitigation: "Self-hosted LLM only (Ollama, LocalAI). OR: PHI redaction before sending to external API + BAA with provider. Never assume cloud LLM is HIPAA-compliant without explicit BAA." },
  { risk: "ePHI in RAG Vector Store", severity: "HIGH", desc: "Patient data stored as embeddings in vector database. Embeddings can be partially inverted. Cross-patient retrieval possible without namespace isolation.", mitigation: "Encrypt embeddings at rest (AES-256). Per-patient namespace isolation in vector DB. PII detection on every retrieval before returning to LLM context." },
  { risk: "ePHI in AI Agent Memory", severity: "HIGH", desc: "Long-term agent memory stores patient interaction history. No expiry → indefinite PHI retention. No erasure mechanism → Right of Access/Amendment violations.", mitigation: "Per-patient memory namespace. Configurable retention (match minimum necessary standard). Right-of-access API to export patient's AI interaction data. Erasure API for record amendment." },
  { risk: "AI-Generated Clinical Notes Audit", severity: "MEDIUM", desc: "HIPAA requires audit trail for all ePHI access. AI-generated or AI-assisted clinical documentation must be attributed and audited.", mitigation: "Log every AI generation event: clinician_id, patient_id, model_version, prompt_hash, output_hash, timestamp. Immutable audit record. Clinical staff must review and attest AI-generated notes." },
  { risk: "Breach via AI Incident", severity: "CRITICAL", desc: "Prompt injection or compromised AI agent accesses PHI of patients it shouldn't reach. May trigger HIPAA Breach Notification Rule (§164.402).", mitigation: "Scope enforcement: AI agent can only access ePHI of currently active patient context. Anomalous cross-patient access triggers immediate alert + incident response." },
]

const FAQ = [
  { q: "Can I use ChatGPT or Claude for HIPAA-covered AI applications?", a: "Only with a signed Business Associate Agreement (BAA) from OpenAI or Anthropic, AND only if the use case stays within the BAA terms. As of 2026: OpenAI offers a HIPAA BAA for ChatGPT Enterprise and Azure OpenAI. Anthropic offers a BAA for Claude for Enterprise. Important: a BAA does not make the service automatically HIPAA-compliant — you still own the compliance obligations. Recommended alternative: self-hosted LLM (Ollama + Llama 3.1 or Mistral) — no BAA required, full data residency, zero external data egress." },
  { q: "What qualifies as ePHI in AI systems?", a: "ePHI (electronic Protected Health Information) is any individually identifiable health information stored or transmitted electronically. For AI systems: patient name in a prompt = ePHI. Diagnosis code + date of service = ePHI. MRN (Medical Record Number) = ePHI. Embedding generated from patient notes = ePHI (can be inverted). AI-generated clinical note mentioning patient = ePHI. The 18 HIPAA identifiers include name, dates, location below state level, phone, email, SSN, MRN, account numbers, biometrics. If in doubt: treat it as ePHI." },
  { q: "What are the audit log requirements for AI systems under HIPAA?", a: "HIPAA §164.312(b) requires 'hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use ePHI.' For AI: every prompt containing ePHI must generate an audit log entry (timestamp, user, patient, action). Every AI-generated output touching ePHI must be logged. Log retention: minimum 6 years. Logs must be reviewable by authorized personnel. Moltbot generates HIPAA-structured audit logs for all AI interactions automatically." },
  { q: "What happens if an AI incident exposes ePHI?", a: "HIPAA Breach Notification Rule (§164.402): if unsecured ePHI is accessed by unauthorized persons, the covered entity must: 1) Notify affected individuals within 60 days of discovery. 2) Notify HHS. 3) If >500 individuals affected: notify HHS immediately AND notify prominent media. For AI incidents: a prompt injection attack that causes an AI agent to access ePHI of unauthorized patients = reportable breach. Moltbot's AI incident response playbook includes HIPAA breach notification steps." },
]

export default function HipaaAiSystemsPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "HIPAA AI Systems", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: Technical compliance guide — not legal or medical advice. Consult a HIPAA attorney and compliance officer.
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · Batch 5</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">HIPAA Compliance for AI Systems</h1>
        <p className="text-lg text-gray-300 mb-6">AI systems that process patient data are covered by HIPAA. LLM prompts containing ePHI, RAG vector stores with patient records, AI agent memory — all subject to HIPAA Technical Safeguards. Here's the technical implementation map.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[{ value: "5", label: "Technical Safeguards" }, { value: "6yr", label: "Audit log retention" }, { value: "60d", label: "Breach notification SLA" }, { value: "0", label: "ePHI to external LLM" }].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">HIPAA Technical Safeguards for AI</h2>
          <div className="space-y-3">
            {SAFEGUARDS.map((s) => (
              <div key={s.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{s.id}</span>
                    <span className="font-semibold text-gray-100">{s.name}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${s.auto ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-400"}`}>
                    {s.auto ? "Automatable" : "Manual"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2 italic">{s.rule}</p>
                <p className="text-sm text-gray-300">{s.ai_impl}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Top PHI Risks in AI Systems</h2>
          <div className="space-y-3">
            {PHI_RISKS.map((r) => (
              <div key={r.risk} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
                  <span className="font-semibold text-gray-100">{r.risk}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${r.severity === "CRITICAL" ? "bg-red-900 text-red-300" : "bg-orange-900 text-orange-300"}`}>{r.severity}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-2">{r.desc}</p>
                  <p className="text-xs text-green-300"><span className="font-semibold">Mitigation: </span>{r.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Frequently Asked Questions</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/solutions/soc2-type-ii-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">SOC 2 Type II</div>
              <div className="text-sm text-gray-300">Audit controls overlap with HIPAA</div>
            </a>
            <a href={`/${locale}/moltbot/ai-incident-response`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Incident Response</div>
              <div className="text-sm text-gray-300">HIPAA breach notification steps</div>
            </a>
            <a href={`/${locale}/moltbot/agent-memory-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Agent Memory Security</div>
              <div className="text-sm text-gray-300">ePHI in AI memory — GDPR & HIPAA</div>
            </a>
            <a href={`/${locale}/solutions/dsgvo-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">GDPR Compliance</div>
              <div className="text-sm text-gray-300">HIPAA + GDPR overlap for EU patients</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
