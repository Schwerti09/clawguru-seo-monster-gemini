import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-human-oversight"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Human Oversight: Menschliche Aufsicht über AI-Agents | ClawGuru", "AI Agent Human Oversight: Human Oversight for AI Agents | ClawGuru")
  const description = pick(isDE, "AI Agent Human Oversight für Moltbot-Deployments. HITL, Approval Workflows, Escalation Patterns und Oversight Frameworks für sichere AI-Agent-Systeme. Mit Moltbot automatisierbar.", "AI agent human oversight for Moltbot deployments. HITL, approval workflows, escalation patterns and oversight frameworks for secure AI agent systems.")
  return {
    title,
    description,
    keywords: [
      "ai agent human oversight", "human in the loop", "hitl", "approval workflows",
      "escalation patterns", "ai oversight", "moltbot security", "ai agent control 2026",
      "security check", "runbooks", "openclaw"
    ],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentHumanOversightPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "AI Agent Human Oversight", "AI Agent Human Oversight")}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "AI Agent Human Oversight für Moltbot-Deployments. HITL, Approval Workflows, Escalation Patterns und Oversight Frameworks für sichere AI-Agent-Systeme.", "AI agent human oversight for Moltbot deployments. HITL, approval workflows, escalation patterns and oversight frameworks for secure AI agent systems.")}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Kernkonzepte", "Core Concepts")}</h2>
          <div className="space-y-4">
            {[
              { en: "1. Human-in-the-Loop (HITL)", de_desc: "Mensch bleibt Entscheidungsträger bei kritischen Agent-Aktionen. Approval Gates vor irreversiblen Operationen.", en_desc: "Human remains decision-maker for critical agent actions. Approval gates before irreversible operations." },
              { en: "2. Approval Workflows", de_desc: "Strukturierte Genehmigungsprozesse für Agent-Aktionen mit hohem Risiko. Mehrstufige Approval Chains.", en_desc: "Structured approval processes for high-risk agent actions. Multi-level approval chains." },
              { en: "3. Escalation Patterns", de_desc: "Automatisierte Eskalation wenn Agents Unsicherheit erkennen. Threshold-basierte Eskalation an menschliche Reviewer.", en_desc: "Automated escalation when agents detect uncertainty. Threshold-based escalation to human reviewers." },
              { en: "4. Audit & Explainability", de_desc: "Vollständige Audit-Trails für Agent-Entscheidungen. Begründungen und Reasoning-Logs für menschliche Reviewer.", en_desc: "Complete audit trails for agent decisions. Justifications and reasoning logs for human reviewers." },
              { en: "5. Override Mechanisms", de_desc: "Sofortiger menschlicher Override für jede Agent-Aktion. Notfall-Stop und Rollback-Fähigkeiten.", en_desc: "Immediate human override for any agent action. Emergency stop and rollback capabilities." },
            ].map(({ en, de_desc, en_desc }) => (
              <div key={en} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{en}</h3>
                <p className="text-sm text-gray-300">{isDE ? de_desc : en_desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Fortgeschrittene Techniken", "Advanced Techniques")}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">{pick(isDE, "Adaptive HITL Thresholds", "Adaptive HITL Thresholds")}</h3>
              <p className="text-sm text-green-200">{pick(isDE, "Dynamische Anpassung von HITL-Schwellenwerten basierend auf Agent-Performance und Risikolevel.", "Dynamic adjustment of HITL thresholds based on agent performance and risk level.")}</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">{pick(isDE, "Confidence-Based Routing", "Confidence-Based Routing")}</h3>
              <p className="text-sm text-blue-200">{pick(isDE, "Automatisches Routing zu menschlichen Reviewern bei niedrigem Agent-Confidence-Score.", "Automatic routing to human reviewers when agent confidence score is low.")}</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">{pick(isDE, "Oversight Dashboard", "Oversight Dashboard")}</h3>
              <p className="text-sm text-yellow-200">{pick(isDE, "Echtzeit-Dashboard für menschliche Aufsicht. Pending approvals, agent activity und risk scores.", "Real-time dashboard for human oversight. Pending approvals, agent activity and risk scores.")}</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{pick(isDE, "Dead Man's Switch", "Dead Man's Switch")}</h3>
              <p className="text-sm text-red-200">{pick(isDE, "Automatischer Agent-Stopp wenn keine menschliche Bestätigung innerhalb eines Zeitfensters erfolgt.", "Automatic agent stop when no human confirmation occurs within a time window.")}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Implementierungsschritte", "Implementation Steps")}</h2>
          <div className="space-y-6">
            {[
              { n: 1, de: "Kritische Aktionen identifizieren", de_d: "Kategorisieren Sie Agent-Aktionen nach Risiko. Irreversible und high-impact Aktionen für HITL kennzeichnen.", en: "Identify critical actions", en_d: "Categorize agent actions by risk. Flag irreversible and high-impact actions for HITL." },
              { n: 2, de: "Approval Gates implementieren", de_d: "Bauen Sie Approval Gates in Agent-Workflows ein. Asynchrone Genehmigung über Slack, Email oder Dashboard.", en: "Implement approval gates", en_d: "Build approval gates into agent workflows. Asynchronous approval via Slack, email or dashboard." },
              { n: 3, de: "Escalation Rules definieren", de_d: "Definieren Sie Eskalationsregeln und Timeout-Verhalten. Wer wird bei welchem Risikolevel benachrichtigt?", en: "Define escalation rules", en_d: "Define escalation rules and timeout behavior. Who gets notified at which risk level?" },
              { n: 4, de: "Audit-Logging aktivieren", de_d: "Vollständiges Logging aller Agent-Entscheidungen mit Reasoning. Für menschliche Überprüfung zugänglich.", en: "Enable audit logging", en_d: "Full logging of all agent decisions with reasoning. Accessible for human review." },
              { n: 5, de: "Override-Mechanismen testen", de_d: "Testen Sie Emergency-Stop und Rollback regelmäßig. Übungsszenarien für das Oversight-Team.", en: "Test override mechanisms", en_d: "Test emergency stop and rollback regularly. Practice scenarios for the oversight team." },
            ].map(({ n, de, de_d, en, en_d }) => (
              <div key={n} className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{n}</div>
                <div>
                  <div className="font-semibold text-gray-100 mb-2">{isDE ? de : en}</div>
                  <div className="text-sm text-gray-300">{isDE ? de_d : en_d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further Resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Security Check", "Security Check")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Überprüfen Sie Ihre Infrastruktur auf Schwachstellen", "Check your infrastructure for vulnerabilities")}</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Runbooks", "Runbooks")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Expert-validierte Security Runbooks", "Expert-validated security runbooks")}</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "OpenClaw", "OpenClaw")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "OpenClaw Security Framework", "OpenClaw Security Framework")}</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Roast My Moltbot", "Roast My Moltbot")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Moltbot Security Testing", "Moltbot security testing")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
