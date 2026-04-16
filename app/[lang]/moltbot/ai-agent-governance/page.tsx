import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-governance"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Governance: Governance-Frameworks für AI-Agents | ClawGuru"
    : "AI Agent Governance: Governance Frameworks for AI Agents | ClawGuru"
  const description = isDE
    ? "AI Agent Governance für Moltbot-Deployments. Policy Enforcement, Audit Trails, Compliance Monitoring und Risk Management für AI-Agents. Mit Moltbot automatisierbar."
    : "AI agent governance for Moltbot deployments. Policy enforcement, audit trails, compliance monitoring and risk management for AI agents. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "ai agent governance", "policy enforcement", "audit trails",
      "compliance monitoring", "risk management", "ai agent oversight",
      "moltbot security", "ai agent compliance", "governance 2026",
      "security check", "runbooks", "openclaw"
    ],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: ["/og-image.png"]
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentGovernancePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "AI Agent Governance" : "AI Agent Governance"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "AI Agent Governance für Moltbot-Deployments. Policy Enforcement, Audit Trails, Compliance Monitoring und Risk Management für AI-Agents."
              : "AI agent governance for Moltbot deployments. Policy enforcement, audit trails, compliance monitoring and risk management for AI agents."}
          </p>
        </div>

        {/* Not a Pentest Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        {/* Core Concepts */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Kernkonzepte" : "Core Concepts"}
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "1. Policy Enforcement" : "1. Policy Enforcement"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Policy Enforcement für AI-Agents. Regeln und Constraints für Agent-Verhalten und Entscheidungen."
                  : "Policy enforcement for AI agents. Rules and constraints for agent behavior and decisions."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "2. Audit Trails" : "2. Audit Trails"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Audit Trails für AI-Agents. Vollständige Aufzeichnung von Agent-Aktionen, Entscheidungen und Kontext."
                  : "Audit trails for AI agents. Complete recording of agent actions, decisions and context."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "3. Compliance Monitoring" : "3. Compliance Monitoring"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Compliance Monitoring für AI-Agents. Überwachung von GDPR/DSGVO, AI Act und anderen Standards."
                  : "Compliance monitoring for AI agents. Monitoring GDPR, AI Act and other standards."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "4. Risk Management" : "4. Risk Management"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Risk Management für AI-Agents. Risikobewertung, Mitigation und Incident Response."
                  : "Risk management for AI agents. Risk assessment, mitigation and incident response."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "5. Human Oversight" : "5. Human Oversight"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Human Oversight für AI-Agents. Human-in-the-Loop und Approval Workflows für kritische Aktionen."
                  : "Human oversight for AI agents. Human-in-the-loop and approval workflows for critical actions."}
              </p>
            </div>
          </div>
        </section>

        {/* Advanced Techniques */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Fortgeschrittene Techniken" : "Advanced Techniques"}
          </h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">
                {isDE ? "Policy-as-Code" : "Policy-as-Code"}
              </h3>
              <p className="text-sm text-green-200">
                {isDE
                  ? "Policy-as-Code für AI-Agent-Governance. Declarative Policies und Automated Enforcement."
                  : "Policy-as-code for AI agent governance. Declarative policies and automated enforcement."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "Explainability & Transparency" : "Explainability & Transparency"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Explainability und Transparency für AI-Agent-Entscheidungen. Decision Logging und Reasoning Traces."
                  : "Explainability and transparency for AI agent decisions. Decision logging and reasoning traces."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "Ethical Guidelines" : "Ethical Guidelines"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Ethical Guidelines für AI-Agents. Fairness, Bias Mitigation und Responsible AI."
                  : "Ethical guidelines for AI agents. Fairness, bias mitigation and responsible AI."}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Governance Dashboard" : "Governance Dashboard"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Governance Dashboard für AI-Agents. Real-time Monitoring von Policies, Compliance und Risiken."
                  : "Governance dashboard for AI agents. Real-time monitoring of policies, compliance and risks."}
              </p>
            </div>
          </div>
        </section>

        {/* Implementation Steps */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Implementierungsschritte" : "Implementation Steps"}
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Governance Framework definieren" : "Define governance framework"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Definieren Sie ein Governance Framework für AI-Agents. Policies, Rollen und Verantwortlichkeiten."
                    : "Define a governance framework for AI agents. Policies, roles and responsibilities."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Policy Enforcement implementieren" : "Implement policy enforcement"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie Policy Enforcement mit Policy-as-Code. Automatisierte Validierung."
                    : "Implement policy enforcement with policy-as-code. Automated validation."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Audit Trails einrichten" : "Set up audit trails"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Richten Sie Audit Trails für alle Agent-Aktionen ein. Vollständige Logging und Traceability."
                    : "Set up audit trails for all agent actions. Complete logging and traceability."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Compliance Monitoring" : "Compliance monitoring"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie Compliance Monitoring für AI-Agents. GDPR, AI Act und Standards überwachen."
                    : "Implement compliance monitoring for AI agents. Monitor GDPR, AI Act and standards."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Governance Dashboard" : "Governance dashboard"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Erstellen Sie ein Governance Dashboard für Monitoring und Reporting. Real-time Insights."
                    : "Create a governance dashboard for monitoring and reporting. Real-time insights."}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Weiterführende Ressourcen" : "Further Resources"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "Security Check" : "Security Check"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "Überprüfen Sie Ihre Infrastruktur auf Schwachstellen" : "Check your infrastructure for vulnerabilities"}
              </div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "Runbooks" : "Runbooks"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "KI-generierte Security Runbooks" : "AI-generated security runbooks"}
              </div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "OpenClaw" : "OpenClaw"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "OpenClaw Security Framework" : "OpenClaw Security Framework"}
              </div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "Roast My Moltbot" : "Roast My Moltbot"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "Moltbot Security Testing" : "Moltbot security testing"}
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
