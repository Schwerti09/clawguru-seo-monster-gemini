import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-incident-response-playbook"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE ? "AI Agent Incident Response Playbook: IR für AI-Agent-Sicherheitsvorfälle | ClawGuru" : "AI Agent Incident Response Playbook: IR for AI Agent Security Incidents | ClawGuru"
  const description = isDE ? "AI Agent Incident Response Playbook für Moltbot. Strukturierte Reaktion auf Prompt Injection, Model Compromise, Data Breach und Jailbreak-Vorfälle bei AI-Agents." : "AI agent incident response playbook for Moltbot. Structured response to prompt injection, model compromise, data breach and jailbreak incidents for AI agents."
  return {
    title, description,
    keywords: ["ai agent incident response", "ir playbook", "prompt injection response", "model compromise", "jailbreak incident", "moltbot security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentIncidentResponsePlaybookPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Incident Response Playbook" : "AI Agent Incident Response Playbook"}</h1>
          <p className="text-lg text-gray-300 mb-4">{isDE ? "AI Agent Incident Response Playbook für Moltbot. Strukturierte Reaktion auf Prompt Injection, Model Compromise, Data Breach und Jailbreak-Vorfälle bei AI-Agents." : "AI agent incident response playbook for Moltbot. Structured response to prompt injection, model compromise, data breach and jailbreak incidents for AI agents."}</p>
        </div>
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools." : "This guide is for hardening your own systems. No attack tools."}
        </div>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Incident-Typen für AI-Agents" : "Incident Types for AI Agents"}</h2>
          <div className="space-y-4">
            {[
              ["1. Prompt Injection Attack", isDE ? "Angreifer manipuliert AI-Agent-Verhalten durch bösartige Prompts. Sofort-Maßnahme: Agent isolieren, Logs sichern." : "Attacker manipulates AI agent behavior through malicious prompts. Immediate action: isolate agent, secure logs."],
              ["2. Model Compromise", isDE ? "AI-Modell wurde manipuliert oder ersetzt. Nachweis durch Integrity Checks. Rollback auf verified Version." : "AI model has been manipulated or replaced. Proof through integrity checks. Rollback to verified version."],
              ["3. Data Exfiltration", isDE ? "AI-Agent hat sensitive Daten nach außen geleakt. Egress-Traffic analysieren, betroffene Daten identifizieren." : "AI agent has leaked sensitive data externally. Analyze egress traffic, identify affected data."],
              ["4. Jailbreak & Policy Bypass", isDE ? "AI-Agent wurde dazu gebracht, Sicherheitsrichtlinien zu umgehen. Systemlogs auswerten, Pattern identifizieren." : "AI agent was made to bypass security policies. Evaluate system logs, identify pattern."],
              ["5. Supply Chain Attack", isDE ? "Bösartige Komponente in AI-Agent-Abhängigkeiten. SBOM-basierte Impact-Analyse und Rollback." : "Malicious component in AI agent dependencies. SBOM-based impact analysis and rollback."],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "IR-Phasen für AI-Incidents" : "IR Phases for AI Incidents"}</h2>
          <div className="space-y-4">
            <div className="bg-red-900 p-4 rounded-lg border border-red-700"><h3 className="font-semibold text-red-300 mb-2">{isDE ? "Phase 1: Erkennung & Triage" : "Phase 1: Detection & Triage"}</h3><p className="text-sm text-red-200">{isDE ? "Alert empfangen → Schweregrad bestimmen → IR-Team aktivieren. Zeitfenster: max. 15 Minuten." : "Receive alert → determine severity → activate IR team. Time window: max 15 minutes."}</p></div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700"><h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "Phase 2: Eindämmung" : "Phase 2: Containment"}</h3><p className="text-sm text-yellow-200">{isDE ? "Betroffenen Agent isolieren → Traffic blockieren → Credentials rotieren. Kein Fortschreiten des Incidents." : "Isolate affected agent → block traffic → rotate credentials. No progression of incident."}</p></div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700"><h3 className="font-semibold text-blue-300 mb-2">{isDE ? "Phase 3: Forensik & Analyse" : "Phase 3: Forensics & Analysis"}</h3><p className="text-sm text-blue-200">{isDE ? "Logs sichern → Root Cause Analysis → Angriffsvektor verstehen → Impact Assessment." : "Secure logs → root cause analysis → understand attack vector → impact assessment."}</p></div>
            <div className="bg-green-900 p-4 rounded-lg border border-green-700"><h3 className="font-semibold text-green-300 mb-2">{isDE ? "Phase 4: Recovery & Hardening" : "Phase 4: Recovery & Hardening"}</h3><p className="text-sm text-green-200">{isDE ? "Sauberes System wiederherstellen → Schwachstelle schließen → Lessons Learned dokumentieren." : "Restore clean system → close vulnerability → document lessons learned."}</p></div>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Implementierungsschritte" : "Implementation Steps"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "IR-Team und Rollen definieren" : "Define IR team and roles", isDE ? "Wer ist Incident Commander? Wer ist für AI-Forensik zuständig? Wer kommuniziert extern?" : "Who is incident commander? Who handles AI forensics? Who communicates externally?"],
              [2, isDE ? "Playbooks pro Incident-Typ" : "Playbooks per incident type", isDE ? "Eigenes Runbook für jeden AI-Incident-Typ. Schritt-für-Schritt-Anleitung ohne Raten." : "Individual runbook for each AI incident type. Step-by-step guide without guessing."],
              [3, isDE ? "Forensik-Tools vorbereiten" : "Prepare forensics tools", isDE ? "Log-Aggregation, Memory Dumps und Agent-State-Snapshots vorbereiten. Vor dem Incident, nicht danach." : "Prepare log aggregation, memory dumps and agent state snapshots. Before the incident, not after."],
              [4, isDE ? "Tabletop Exercises durchführen" : "Conduct tabletop exercises", isDE ? "Regelmäßige Simulationen von AI-Sicherheitsvorfällen. Schwächen im IR-Prozess frühzeitig finden." : "Regular simulations of AI security incidents. Find weaknesses in IR process early."],
              [5, isDE ? "Post-Incident Review" : "Post-incident review", isDE ? "Nach jedem Incident strukturiertes Post-Mortem. Was hat funktioniert? Was muss verbessert werden?" : "Structured post-mortem after every incident. What worked? What needs improvement?"],
            ].map(([n, t, d]) => (
              <div key={n as number} className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{n}</div>
                <div><div className="font-semibold text-gray-100 mb-2">{t}</div><div className="text-sm text-gray-300">{d}</div></div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Security Check</div><div className="text-sm text-gray-300">{isDE ? "Infrastruktur prüfen" : "Check infrastructure"}</div></a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Runbooks</div><div className="text-sm text-gray-300">{isDE ? "Expert-validierte Security Runbooks" : "Expert-validated security runbooks"}</div></a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">OpenClaw</div><div className="text-sm text-gray-300">{isDE ? "OpenClaw Security Framework" : "OpenClaw Security Framework"}</div></a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Roast My Moltbot</div><div className="text-sm text-gray-300">{isDE ? "Moltbot Security Testing" : "Moltbot security testing"}</div></a>
          </div>
        </section>
      </div>
    </div>
  )
}
