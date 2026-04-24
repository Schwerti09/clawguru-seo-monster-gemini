import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/pci-dss-ai-payments"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "PCI DSS 4.0 für KI-Zahlungssysteme: CHD-Schutz in LLM-Agenten | ClawGuru", "PCI DSS 4.0 for AI Payment Systems: CHD Protection in LLM Agents | ClawGuru")
  const description = pick(isDE, "PCI DSS 4.0 Compliance für KI-Systeme im Zahlungsumfeld: Cardholder Data in LLMs, AI-Agent-Scope, Tokenization, Audit-Logging und Customized Approach für AI-spezifische Controls.", "PCI DSS 4.0 compliance for AI systems in payment environments: cardholder data in LLMs, AI agent scope, tokenization, audit logging and customized approach for AI-specific controls.")
  return {
    title, description,
    keywords: ["pci dss ai payments", "pci dss llm", "pci dss 4.0 ai", "cardholder data ai agent", "pci dss ai compliance", "ai payment security"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const PCI_REQUIREMENTS = [
  { req: "Req 3", title: "Protect stored cardholder data", aiRisk: "LLM context windows and conversation logs may capture PAN (Primary Account Number) data if users paste card numbers. LLM memory persistence may retain CHD beyond session.", mitigation: "Deploy PAN detection regex in Moltbot input/output filters. Strip or tokenize any PAN before it enters LLM context. Never log raw conversation text — log only hashed/tokenized representations. Configure LLM to respond with 'please use our secure payment form' when PAN is detected in input." },
  { req: "Req 6", title: "Develop and maintain secure systems", aiRisk: "AI frameworks (LangChain, Moltbot) are software in the CDE (Cardholder Data Environment) scope if they process, store, or transmit CHD. Their CVEs must be tracked and patched.", mitigation: "OpenClaw: CVE scanning of all AI framework dependencies in CDE scope. Moltbot: automated dependency update PRs with security review gate. Maintain AI component inventory in CDE asset register. Apply PCI DSS Req 6.3.3 (all patches applied within defined timeframes)." },
  { req: "Req 7", title: "Restrict access to cardholder data", aiRisk: "AI agents that have access to payment systems may have broader access than necessary. Agent tool permissions must be scoped to minimum required for their function.", mitigation: "Moltbot RBAC: payment-processing agents get only specific tool permissions (e.g., tokenize_card, process_payment — not query_all_transactions). Capability tokens with scope: [payment.tokenize] not scope: [payment.*]. Enforce least privilege at every agent role." },
  { req: "Req 8", title: "Identify users and authenticate access", aiRisk: "AI agents must have unique identities for audit trail purposes. Shared agent identities violate PCI DSS non-repudiation requirements.", mitigation: "Each agent class gets a unique service identity (K8s ServiceAccount). All agent actions attributed to specific agent identity in audit log. Multi-factor authentication for human access to AI orchestration control plane. No shared credentials between agent instances." },
  { req: "Req 10", title: "Log and monitor all access to network resources and cardholder data", aiRisk: "Standard logging is insufficient for AI agents. Need: every tool call with parameters (tokenized), every LLM API call, every data access with cardholder data classification.", mitigation: "Moltbot audit log: cryptographically signed, append-only, covers all tool calls and LLM interactions. OpenClaw: alert on anomalous CHD access patterns from agent identities. Log retention: minimum 12 months (3 months immediately accessible per PCI DSS 4.0)." },
  { req: "Req 12", title: "Support information security with policies", aiRisk: "PCI DSS 4.0 Req 12.3.3 requires all cryptographic algorithms reviewed annually. AI systems using encryption for context storage must be included. Customized Approach requires additional documentation for novel AI controls.", mitigation: "Document AI-specific security controls in Customized Approach Control Matrix. Include AI agent access control in annual privileged access review. AI security policy addendum covering: prompt injection, model updates, LLM provider risk management." },
]

const FAQ = [
  { q: "Are AI agents in scope for PCI DSS if they process payment data?", a: "Yes. PCI DSS scope is determined by whether a system processes, stores, or transmits cardholder data (CHD) — not by the technology type. If an AI agent: receives PAN numbers in user input, queries a payment database, calls payment processing APIs, or generates responses that include payment data, then that agent and all its supporting infrastructure (orchestration platform, LLM API connections, vector stores, audit systems) are in PCI DSS scope. Important: even if the agent doesn't directly process CHD, if it's connected to in-scope systems (same network segment), it may be in scope as a 'connected system.' Segment AI systems from CDE where possible." },
  { q: "What does PCI DSS 4.0 Customized Approach mean for AI controls?", a: "PCI DSS 4.0 introduced the Customized Approach: instead of implementing specific prescriptive controls, organizations can implement equivalent controls that meet the stated security objective. This is critical for AI because: many PCI DSS controls were written before AI systems existed. Example: Req 8 (user authentication) assumes human users or traditional services. For AI agents, you can use Customized Approach to implement Workload Identity (K8s ServiceAccount + IRSA) instead of traditional username/password, provided you document how it meets the authentication objective and get QSA sign-off. Always consult your QSA before using Customized Approach — it requires formal documentation." },
  { q: "How do I prevent PAN data from being captured in LLM context?", a: "Layered approach: 1) Input filter (pre-LLM): Moltbot input filter with PAN regex (16-digit patterns, Luhn algorithm validation) — strip or reject before sending to LLM. 2) System prompt instruction: 'If a user provides payment card numbers, respond with a request to use our secure payment form and do not repeat the number in your response.' 3) Output filter (post-LLM): scan LLM output for PAN patterns before returning to user — reject if found. 4) Log sanitization: never log raw user input or LLM output — log only hashed or tokenized representations. 5) Context purging: clear conversation context after session end — no persistent storage of sessions containing payment discussions." },
  { q: "Can I use a third-party LLM API (OpenAI, Anthropic) in PCI DSS scope?", a: "With extreme caution. Sending CHD to a third-party LLM API makes that provider a PCI DSS service provider — you must: 1) Verify they have PCI DSS service provider compliance (Level 1 QSAP attestation). As of 2025: OpenAI has limited PCI DSS attestation for specific API products — check their current compliance documentation. 2) Execute a PCI DSS compliant service provider agreement. 3) Monitor their compliance status annually. 4) Include them in your third-party risk management process. Recommended alternative: deploy a self-hosted LLM (Llama, Mistral) in your CDE — eliminates the third-party provider compliance complexity. Moltbot supports both cloud API and self-hosted model backends." },
]

export default function PciDssAiPaymentsPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "PCI DSS AI Payments", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "PCI-DSS-Compliance-Leitfaden für eigene KI-Zahlungssysteme.", "PCI DSS compliance guide for your own AI payment systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · Batch 6</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "PCI DSS 4.0 für KI-Zahlungssysteme", "PCI DSS 4.0 for AI Payment Systems")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "KI-Agenten, die Zahlungsdaten verarbeiten, sind PCI-DSS-pflichtig — unabhängig von der Technologie. Sechs kritische Requirements mit AI-spezifischen Risiken und konkreten Mitigationen.", "AI agents processing payment data are subject to PCI DSS — regardless of technology. Six critical requirements with AI-specific risks and concrete mitigations.")}
        </p>

        <div className="bg-red-900 border border-red-700 p-4 rounded-lg mb-8">
          <h3 className="font-bold text-red-300 mb-1">{pick(isDE, "Scope-Warnung: KI im CDE", "Scope Warning: AI in the CDE")}</h3>
          <p className="text-sm text-red-200">{pick(isDE, "Sobald ein KI-Agent CHD (Cardholder Data) verarbeitet, überträgt oder speichert, ist der gesamte AI-Stack im PCI-DSS-Scope: LLM-API-Verbindungen, Vektordatenbanken, Orchestrierung, Audit-Logs.", "Once an AI agent processes, transmits or stores CHD (Cardholder Data), the entire AI stack is in PCI DSS scope: LLM API connections, vector stores, orchestration, audit logs.")}</p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "6 PCI DSS Requirements für KI", "6 PCI DSS Requirements for AI")}</h2>
          <div className="space-y-4">
            {PCI_REQUIREMENTS.map((r) => (
              <div key={r.req} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{r.req}</span>
                  <span className="font-semibold text-gray-100 text-sm">{r.title}</span>
                </div>
                <p className="text-xs text-orange-300 mb-2"><strong>AI Risk:</strong> {r.aiRisk}</p>
                <p className="text-xs text-green-300"><strong>Mitigation:</strong> {r.mitigation}</p>
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
            <a href={`/${locale}/solutions/pci-dss-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">PCI DSS Compliance</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Vollständige PCI-DSS-Umsetzung", "Full PCI DSS implementation")}</div>
            </a>
            <a href={`/${locale}/solutions/hipaa-ai-systems`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">HIPAA AI Systems</div>
              <div className="text-sm text-gray-300">{pick(isDE, "PHI-Schutz in KI-Systemen", "PHI protection in AI systems")}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-context-isolation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Context Isolation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "CHD aus LLM-Kontext trennen", "Isolate CHD from LLM context")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-rbac`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent RBAC</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Least Privilege für Agenten", "Least privilege for agents")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
