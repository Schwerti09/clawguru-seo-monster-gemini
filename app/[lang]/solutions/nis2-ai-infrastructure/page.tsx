import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/nis2-ai-infrastructure"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "NIS2 für KI-Infrastruktur: Cybersicherheitsmaßnahmen für AI-Systeme | ClawGuru", "NIS2 for AI Infrastructure: Cybersecurity Measures for AI Systems | ClawGuru")
  const description = pick(isDE, "NIS2-Richtlinie für KI-Infrastruktur: technische Sicherheitsmaßnahmen nach Art. 21, Meldepflichten für KI-Incidents, Supply-Chain-Sicherheit für KI-Modelle und Moltbot NIS2 Compliance.", "NIS2 Directive for AI infrastructure: technical security measures per Art. 21, reporting obligations for AI incidents, supply chain security for AI models and Moltbot NIS2 compliance.")
  return {
    title, description,
    keywords: ["nis2 ai infrastructure", "nis2 ki systeme", "nis2 ai compliance", "nis2 cybersecurity ai", "nis2 art 21 ai", "nis2 ai incident reporting"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const NIS2_MEASURES = [
  { art: "Art. 21(2)(a)", title: "Risk Analysis & Information System Security Policies", aiContext: "AI systems must be included in the organization's risk analysis. AI-specific risks to document: prompt injection attacks, model poisoning, data exfiltration via LLM outputs, supply chain compromise of model providers. Policy requirement: formal AI Security Policy covering: approved AI models, permitted data processing, mandatory security controls (RBAC, audit logging, output validation), incident response for AI-specific events.", tooling: "Moltbot: risk register with AI-specific threat catalog. OpenClaw: automated policy compliance checking." },
  { art: "Art. 21(2)(b)", title: "Incident Handling", aiContext: "AI-specific incidents require new definitions and handling procedures: what constitutes a 'significant incident' for an AI system? Examples: prompt injection leading to data exfiltration, model producing systematically harmful outputs, unauthorized access to AI training data, supply chain compromise of a model provider. NIS2 reporting threshold: incidents with significant impact on service continuity or data integrity — applies to AI systems used in critical service delivery.", tooling: "Moltbot AI Incident Response: automated detection, containment, and evidence collection for AI incidents. 24h initial report auto-draft." },
  { art: "Art. 21(2)(c)", title: "Business Continuity & Crisis Management", aiContext: "AI system failures must be included in BCP/DRP: what happens if the primary LLM provider is unavailable? fallback to self-hosted model, degrade gracefully to non-AI workflow. Maximum tolerable downtime for AI systems supporting critical processes. Recovery time objectives (RTO) for AI systems: model reloading time, vector store restoration, agent configuration recovery.", tooling: "Moltbot: self-hosted fallback model. OpenClaw: automated failover. Recovery runbooks in Moltbot's workflow engine." },
  { art: "Art. 21(2)(d)", title: "Supply Chain Security", aiContext: "AI supply chain = one of the most complex in tech: foundation model providers (OpenAI, Meta, Mistral), ML framework dependencies (PyTorch, transformers, LangChain), model delivery infrastructure (HuggingFace Hub, OCI registry), fine-tuning data sources. NIS2 requires assessing security practices of all suppliers. For AI: verify model integrity (SHA-256/Cosign), assess LLM provider security posture (SOC 2, ISO 27001), audit Python/Node dependencies for CVEs.", tooling: "Moltbot: model signing verification. OpenClaw: dependency CVE scanning. AI supply chain risk register." },
  { art: "Art. 21(2)(e)", title: "Security in Network & Information Systems Acquisition", aiContext: "Before deploying a new AI model or framework: security assessment of the vendor, penetration testing of the integration, review of the model card for known biases or safety issues, verification of the model's training data provenance. For cloud LLM APIs: assess provider's security architecture, data processing agreements, incident notification procedures.", tooling: "OpenClaw: pre-deployment security checklist for AI systems. Moltbot: model card validation and security assessment workflow." },
  { art: "Art. 21(2)(h)", title: "Cryptography & Encryption", aiContext: "AI-specific cryptography requirements: model weights encrypted at rest (AES-256 minimum), LLM API traffic encrypted in transit (TLS 1.3), audit logs HMAC-signed to prevent tampering, conversation data encrypted per-tenant with separate keys. Key management: Vault-managed keys with rotation, separate encryption keys for different data classification levels.", tooling: "Moltbot: per-tenant encryption keys via Vault. HMAC-signed audit chain. OpenClaw: encryption compliance scanning." },
]

const FAQ = [
  { q: "Which organizations are subject to NIS2 and does it apply to AI systems?", a: "NIS2 (EU Directive 2022/2555) applies to 'essential' and 'important' entities in sectors including: energy, transport, banking, financial market infrastructure, health, drinking water, digital infrastructure, ICT service management, public administration, space. If your organization is in one of these sectors, NIS2 applies to your entire information security program — including AI systems used to deliver your services. AI-specific applicability: if AI systems are used to deliver essential/important services (e.g., AI-powered medical diagnosis, AI-driven energy grid management, AI-assisted financial trading), they are in scope. Even supporting AI tools (internal AI assistants, automated threat detection) may be in scope if they affect service continuity. National transposition varies — check your country's NIS2 implementing legislation for specific thresholds." },
  { q: "What are the NIS2 incident reporting obligations for AI incidents?", a: "NIS2 Art. 23 establishes a tiered reporting timeline: Within 24 hours: initial early warning — significant incident occurred, preliminary assessment of cause. Within 72 hours: incident notification — update with more details, initial impact assessment. Within 1 month: final report — complete analysis, root cause, mitigation measures taken. AI-specific incident triggers (when is an AI incident 'significant'): AI system unavailability exceeding your defined RTO for a critical service. Unauthorized access to AI training data or model weights. AI system producing outputs that caused measurable harm (financial, safety, reputational). Supply chain compromise of a model or ML framework. Report to: your national competent authority (BSI in Germany, ANSSI in France, NCSC-UK, etc.). Moltbot AI Incident Response auto-generates the 24h and 72h report drafts from collected incident data." },
  { q: "How does NIS2 supply chain security apply to AI model providers?", a: "NIS2 Art. 21(2)(d) requires assessing and managing supply chain security risks — including digital suppliers. For AI systems, your supply chain includes: Foundation model providers: OpenAI, Anthropic, Meta (Llama), Mistral — assess their security posture (SOC 2 Type II, ISO 27001 certification). Request their security documentation and include in vendor risk register. ML framework maintainers: PyTorch, Hugging Face Transformers, LangChain — monitor for CVEs, maintain dependency inventory, patch within defined SLAs. Model delivery infrastructure: HuggingFace Hub, OCI registries — verify model integrity via hash/signature before use. Training data providers: if using external datasets, assess their provenance and integrity controls. Action: create an AI-specific vendor risk register documenting security assessments for each supplier tier. Review annually and after any supplier security incident." },
  { q: "What technical measures does NIS2 specifically require for AI systems?", a: "NIS2 Art. 21 lists 10 categories of security measures — translated to AI systems: 1) Risk management: AI-specific risk assessment (prompt injection, model poisoning, data leakage). 2) Incident handling: playbooks for AI-specific incidents (hallucination causing harm, unauthorized access). 3) Business continuity: BCP covering AI system outages, fallback procedures. 4) Supply chain: vendor assessment for all AI model and framework suppliers. 5) Security in acquisition: security review before deploying new AI models. 6) Vulnerability management: track CVEs in ML frameworks, AI tools. 7) Cybersecurity hygiene: MFA for AI system access, patch management for AI components. 8) Cryptography: model weights encrypted at rest, communications encrypted in transit, audit log integrity. 9) Human resources security: AI security training for all staff using AI systems. 10) Access control: RBAC for AI systems, minimum privilege, audit logging of all access." },
]

export default function Nis2AiInfrastructurePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "NIS2 AI Infrastructure", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "NIS2-Compliance-Guide für eigene KI-Infrastruktur. Keine Rechtsberatung.", "NIS2 compliance guide for your own AI infrastructure. Not legal advice.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · Batch 7</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "NIS2 für KI-Infrastruktur", "NIS2 for AI Infrastructure")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "NIS2 erfasst KI-Systeme in kritischen Sektoren — und die 10 Sicherheitskategorien des Art. 21 haben AI-spezifische Anforderungen, die über klassische IT hinausgehen. Sechs Maßnahmen-Mappings mit Tooling-Empfehlungen.", "NIS2 covers AI systems in critical sectors — and the 10 security categories of Art. 21 have AI-specific requirements that go beyond classical IT. Six measure mappings with tooling recommendations.")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "24h", label: pick(isDE, "Erstmeldung", "Initial report") },
            { value: "72h", label: pick(isDE, "Incident-Notif.", "Incident notif.") },
            { value: "Art.21", label: pick(isDE, "Sicherheitspfl.", "Security duties") },
            { value: "10", label: pick(isDE, "Maßnahmen-Kat.", "Measure cats.") },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "6 NIS2 Art. 21 Maßnahmen für KI", "6 NIS2 Art. 21 Measures for AI")}</h2>
          <div className="space-y-4">
            {NIS2_MEASURES.map((m) => (
              <div key={m.art} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{m.art}</span>
                  <span className="font-semibold text-gray-100 text-sm">{m.title}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2"><strong className="text-gray-100">AI Context:</strong> {m.aiContext}</p>
                <p className="text-xs text-cyan-400"><strong>Tooling:</strong> {m.tooling}</p>
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
            <a href={`/${locale}/solutions/nis2-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">NIS2 Compliance</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Vollständige NIS2-Umsetzung", "Full NIS2 implementation")}</div>
            </a>
            <a href={`/${locale}/solutions/eu-ai-act-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">EU AI Act Compliance</div>
              <div className="text-sm text-gray-300">{pick(isDE, "NIS2 + EU AI Act Synergie", "NIS2 + EU AI Act synergy")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-incident-response`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Incident Response</div>
              <div className="text-sm text-gray-300">{pick(isDE, "24h/72h Meldung automatisieren", "Automate 24h/72h reporting")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-supply-chain`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Supply Chain Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "NIS2 Supply-Chain-Anforderungen", "NIS2 supply chain requirements")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
