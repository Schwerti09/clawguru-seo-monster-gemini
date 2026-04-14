import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-incident-response"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "AI Incident Response: Playbook für KI-Agent-Sicherheitsvorfälle | ClawGuru"
    : "AI Incident Response: Playbook for AI Agent Security Incidents | ClawGuru"
  const description = isDE
    ? "AI-spezifisches Incident-Response-Playbook: Prompt-Injection-Angriffe, kompromittierte Agenten, Datenlecks durch RAG, Model-Poisoning. Detection, Containment, Recovery und Post-Mortem mit Moltbot."
    : "AI-specific incident response playbook: prompt injection attacks, compromised agents, RAG data leaks, model poisoning. Detection, containment, recovery and post-mortem with Moltbot."
  return {
    title, description,
    keywords: ["ai incident response", "llm incident response", "ai security incident", "prompt injection incident", "moltbot incident response", "ai agent compromise"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const INCIDENT_TYPES = [
  { id: "AI-INC-01", name: "Prompt Injection Attack", severity: "HIGH", indicators: ["Agent performing unexpected tool calls", "Requests to unusual endpoints from agent", "Agent output contains instructions rather than answers", "Anomalous tool call sequence detected by Moltbot"], containment: "Suspend agent. Rotate API keys exposed to agent. Review all tool calls in last 60 min. Analyze full conversation trace." },
  { id: "AI-INC-02", name: "Agent Privilege Escalation", severity: "CRITICAL", indicators: ["Agent accessing data outside declared scope", "Capability token scope violation alert", "Agent calling forbidden tools", "Cross-namespace memory access attempt"], containment: "Kill agent immediately. Revoke all capability tokens for agent. Audit all data accessed. Check for lateral movement to other agents." },
  { id: "AI-INC-03", name: "RAG Data Exfiltration", severity: "HIGH", indicators: ["Unusually large retrieved context in responses", "Responses containing data from other users", "Cross-namespace retrieval detected", "PII in response that user shouldn't have access to"], containment: "Disable RAG retrieval for affected namespace. Audit all retrievals in last 24h. Check for cross-user namespace violations. Notify affected users per GDPR Art. 33." },
  { id: "AI-INC-04", name: "Model Poisoning Detected", severity: "CRITICAL", indicators: ["Behavioral test suite failure (>5% degradation)", "Model producing systematically biased outputs", "Backdoor trigger phrase activated", "Unexpected model outputs on benign inputs"], containment: "Roll back to previous model version. Quarantine poisoned model. Trigger full behavioral test suite on backup. Do not deploy until cleared." },
  { id: "AI-INC-05", name: "LLM DoS / Resource Exhaustion", severity: "MEDIUM", indicators: ["GPU utilization >95% sustained", "Queue depth >100 pending requests", "Response latency P99 >60s", "Cost spike >5x baseline in 10 min"], containment: "Activate emergency rate limiting (drop to 10% normal limits). Identify top consuming users/agents. Block abusive sources. Scale GPU if available." },
  { id: "AI-INC-06", name: "Supply Chain Compromise", severity: "CRITICAL", indicators: ["SBOM diff shows unexpected new dependency", "Checksum mismatch on model file", "Unexpected outbound network call from agent runtime", "Security scan on new model version fails"], containment: "Halt all deployments. Roll back to last known-good version. Audit all dependencies changed in last 30 days. Check all systems that ran affected version." },
]

const RESPONSE_PHASES = [
  { phase: "Detect", time: "0-5 min", actions: ["Moltbot alert fires with incident type and evidence", "On-call engineer acknowledges in PagerDuty/Slack", "Initial severity classification (P1-P4)", "Open incident channel (#inc-YYYY-MM-DD-ai)"] },
  { phase: "Contain", time: "5-30 min", actions: ["Suspend affected agent(s) via Moltbot kill-switch", "Revoke capability tokens for affected agents", "Preserve evidence: export logs before any cleanup", "Notify security team lead + relevant stakeholders"] },
  { phase: "Investigate", time: "30 min - 4h", actions: ["Pull full agent trace from Moltbot audit log", "Identify attack vector (injection point, compromised dependency, etc.)", "Determine blast radius (what data was accessed/exfiltrated)", "Timeline reconstruction using hash-chained logs"] },
  { phase: "Recover", time: "4h - 24h", actions: ["Remove root cause (patch, model rollback, config fix)", "Test fix in staging with attack simulation", "Gradual traffic restoration with enhanced monitoring", "GDPR Art. 33: notify DPA within 72h if personal data breached"] },
  { phase: "Post-Mortem", time: "48-72h after", actions: ["Blameless post-mortem with full timeline", "Root cause analysis (5 Whys)", "Action items with owners and deadlines", "Update detection rules and playbooks"] },
]

const FAQ = [
  { q: "How is AI incident response different from traditional IR?", a: "Traditional IR playbooks were built for deterministic systems. AI incidents have unique characteristics: 1) Evidence is probabilistic — you can't replay the exact LLM output, only the inputs. 2) Attack vectors are novel — prompt injection doesn't appear in traditional IR playbooks. 3) Blast radius is hard to determine — an injected agent may have taken many actions before detection. 4) GDPR complexity — if a RAG exfiltration affected personal data, you have 72 hours to notify the DPA. 5) Model-level forensics — investigating model poisoning requires behavioral testing, not just log analysis." },
  { q: "What evidence should I preserve immediately during an AI incident?", a: "Preserve within first 10 minutes: 1) Full agent conversation traces (input prompts, outputs, tool calls) — Moltbot logs these with tamper-evident hashes. 2) Capability token issuance log — shows what permissions were active during incident. 3) Vector DB query log — critical for RAG exfiltration analysis. 4) Model version hash — proves which model was running. 5) Network logs from agent container — shows all outbound connections. 6) Memory snapshot of agent at time of detection. Do NOT modify or delete any logs — preserved evidence is required for GDPR compliance and post-mortem." },
  { q: "When do I need to notify authorities after an AI incident?", a: "GDPR Art. 33: If the incident involved personal data breach (RAG exfiltration of user data, PII in compromised agent memory, unauthorized access to training data containing personal data) → notify your DPA within 72 hours of becoming aware. GDPR Art. 34: If the breach is likely to result in high risk to individuals → also notify affected individuals without undue delay. NIS2: If you are an essential/important entity and the AI system is part of critical infrastructure → incident notification to CSIRT within 24 hours of significant incident." },
  { q: "How does Moltbot accelerate incident response?", a: "Moltbot reduces mean time to containment (MTTC) by automating the first response: 1) Auto-detection: behavioral anomaly triggers immediate alert with incident classification. 2) Auto-containment: configurable kill-switch fires automatically on high-severity incidents (suspend agent, revoke tokens) without waiting for human response. 3) Evidence package: Moltbot generates a structured evidence package (logs, traces, token history, timeline) automatically on incident declaration. 4) Runbook automation: common response actions (block user, rotate keys, rollback model) available as one-click Moltbot commands." },
]

export default function AiIncidentResponsePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Incident Response", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "HowTo", name: "AI Security Incident Response", totalTime: "PT24H",
      step: RESPONSE_PHASES.map((p) => ({ "@type": "HowToStep", name: p.phase, text: p.actions[0] })),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Incident-Response-Leitfaden für eigene KI-Systeme." : "Incident response guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 7</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? "AI Incident Response Playbook" : "AI Incident Response Playbook"}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Klassische IR-Playbooks kennen keine Prompt-Injection, keinen kompromittierten RAG-Namespace und keine Model-Poisoning-Indikatoren. Dieses Playbook deckt 6 AI-spezifische Incident-Typen mit konkreten Containment-Schritten ab."
            : "Classic IR playbooks don't know prompt injection, compromised RAG namespaces or model poisoning indicators. This playbook covers 6 AI-specific incident types with concrete containment steps."}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "6", label: isDE ? "Incident-Typen" : "Incident types" },
            { value: "72h", label: "GDPR Art. 33 SLA" },
            { value: "5min", label: isDE ? "Ziel-MTTC" : "Target MTTC" },
            { value: "Auto", label: isDE ? "Containment (P1)" : "Containment (P1)" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "AI Incident-Typen & Containment" : "AI Incident Types & Containment"}
          </h2>
          <div className="space-y-3">
            {INCIDENT_TYPES.map((inc) => (
              <div key={inc.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{inc.id}</span>
                  <span className="font-semibold text-gray-100">{inc.name}</span>
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded ${inc.severity === "CRITICAL" ? "bg-red-900 text-red-300" : "bg-orange-900 text-orange-300"}`}>{inc.severity}</span>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-400 mb-1">{isDE ? "Indikatoren:" : "Indicators:"}</div>
                    <ul className="space-y-1">
                      {inc.indicators.map((ind) => <li key={ind} className="text-xs text-gray-300">▸ {ind}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-green-400 mb-1">{isDE ? "Sofort-Containment:" : "Immediate containment:"}</div>
                    <p className="text-xs text-green-200">{inc.containment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Response-Phasen" : "Response Phases"}
          </h2>
          <div className="space-y-3">
            {RESPONSE_PHASES.map((p, i) => (
              <div key={p.phase} className="flex items-start gap-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex-shrink-0 text-center w-16">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-1">{i + 1}</div>
                  <div className="text-xs text-cyan-400 font-bold">{p.phase}</div>
                  <div className="text-xs text-gray-500">{p.time}</div>
                </div>
                <ul className="space-y-1 flex-1">
                  {p.actions.map((a) => <li key={a} className="text-sm text-gray-300">▸ {a}</li>)}
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
            <a href={`/${locale}/moltbot/ai-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Compliance Automation</div>
              <div className="text-sm text-gray-300">{isDE ? "GDPR Art. 33 Meldepflicht" : "GDPR Art. 33 breach notification"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-observability`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Observability</div>
              <div className="text-sm text-gray-300">{isDE ? "Anomalie-Detection" : "Anomaly detection"}</div>
            </a>
            <a href={`/${locale}/moltbot/prompt-injection-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Prompt Injection Defense</div>
              <div className="text-sm text-gray-300">{isDE ? "AI-INC-01 verhindern" : "Prevent AI-INC-01"}</div>
            </a>
            <a href={`/${locale}/moltbot/model-poisoning-protection`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Model Poisoning Protection</div>
              <div className="text-sm text-gray-300">{isDE ? "AI-INC-04 erkennen" : "Detect AI-INC-04"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
