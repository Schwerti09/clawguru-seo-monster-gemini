import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-compliance-automation"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Compliance Automation: Automatisierte Compliance für AI-Agents | ClawGuru", "AI Agent Compliance Automation: Automated Compliance for AI Agents | ClawGuru")
  const description = pick(isDE, "AI Agent Compliance Automation für Moltbot. GDPR, EU AI Act, SOC 2, ISO 27001 Compliance automatisiert für AI-Agent-Systeme. Policy as Code und kontinuierliche Compliance.", "AI agent compliance automation for Moltbot. GDPR, EU AI Act, SOC 2, ISO 27001 compliance automated for AI agent systems. Policy as code and continuous compliance.")
  return {
    title, description,
    keywords: ["ai agent compliance automation", "gdpr ai", "eu ai act compliance", "soc 2", "iso 27001", "policy as code", "moltbot security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentComplianceAutomationPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "AI Agent Compliance Automation", "AI Agent Compliance Automation")}</h1>
          <p className="text-lg text-gray-300 mb-4">{pick(isDE, "AI Agent Compliance Automation für Moltbot. GDPR, EU AI Act, SOC 2, ISO 27001 Compliance automatisiert für AI-Agent-Systeme. Policy as Code und kontinuierliche Compliance.", "AI agent compliance automation for Moltbot. GDPR, EU AI Act, SOC 2, ISO 27001 compliance automated for AI agent systems. Policy as code and continuous compliance.")}</p>
        </div>
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Kernkonzepte", "Core Concepts")}</h2>
          <div className="space-y-4">
            {[
              ["1. Continuous Compliance Monitoring", pick(isDE, "Echtzeit-Überwachung der Compliance-Posture für AI-Agent-Systeme. Automatische Erkennung von Compliance-Abweichungen.", "Real-time monitoring of compliance posture for AI agent systems. Automatic detection of compliance deviations.")],
              ["2. Policy as Code", pick(isDE, "Compliance-Anforderungen als ausführbaren Code formulieren. Automatische Durchsetzung ohne manuelle Audits.", "Formulate compliance requirements as executable code. Automatic enforcement without manual audits.")],
              ["3. EU AI Act Compliance", pick(isDE, "Automatisierte Konformitätsprüfung für High-Risk AI-Systeme. Risikoklassifizierung, Dokumentation und Konformitätsbewertung.", "Automated conformity assessment for high-risk AI systems. Risk classification, documentation and conformity assessment.")],
              ["4. GDPR für AI-Agents", pick(isDE, "DSGVO-Compliance für AI-Agents: Data Mapping, DPIA, Consent Management, Data Subject Rights. Vollständig automatisiert.", "GDPR compliance for AI agents: data mapping, DPIA, consent management, data subject rights. Fully automated.")],
              ["5. Audit-Ready Documentation", pick(isDE, "Kontinuierlich aktuelle Compliance-Dokumentation. Audit-Berichte auf Knopfdruck für ISO 27001, SOC 2 und AI Act.", "Continuously current compliance documentation. Audit reports at the push of a button for ISO 27001, SOC 2 and AI Act.")],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Fortgeschrittene Techniken", "Advanced Techniques")}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700"><h3 className="font-semibold text-green-300 mb-2">{pick(isDE, "Compliance as Code (CaC)", "Compliance as Code (CaC)")}</h3><p className="text-sm text-green-200">{pick(isDE, "Alle Compliance-Anforderungen als Code: testbar, versioniert, automatisch durchgesetzt. OpenSCAP, Regula oder Chef InSpec.", "All compliance requirements as code: testable, versioned, automatically enforced. OpenSCAP, Regula or Chef InSpec.")}</p></div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700"><h3 className="font-semibold text-blue-300 mb-2">{pick(isDE, "AI-specific Controls Mapping", "AI-specific Controls Mapping")}</h3><p className="text-sm text-blue-200">{pick(isDE, "Mapping von AI-spezifischen Controls auf ISO 27001, NIST AI RMF und EU AI Act. Lückenloses Control-Framework.", "Mapping of AI-specific controls to ISO 27001, NIST AI RMF and EU AI Act. Seamless control framework.")}</p></div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700"><h3 className="font-semibold text-yellow-300 mb-2">{pick(isDE, "Evidence Collection Automation", "Evidence Collection Automation")}</h3><p className="text-sm text-yellow-200">{pick(isDE, "Automatische Sammlung von Compliance-Nachweisen. Kein manuelles Screenshot-Sammeln mehr für Audits.", "Automatic collection of compliance evidence. No more manual screenshot collecting for audits.")}</p></div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700"><h3 className="font-semibold text-red-300 mb-2">{pick(isDE, "Compliance Drift Detection", "Compliance Drift Detection")}</h3><p className="text-sm text-red-200">{pick(isDE, "Echtzeit-Erkennung wenn Systeme von Compliance-Baseline driften. Alert lange bevor der Auditor kommt.", "Real-time detection when systems drift from compliance baseline. Alert long before the auditor arrives.")}</p></div>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Implementierungsschritte", "Implementation Steps")}</h2>
          <div className="space-y-6">
            {[
              [1, pick(isDE, "Relevante Frameworks identifizieren", "Identify relevant frameworks"), pick(isDE, "Welche Compliance-Frameworks gelten? GDPR, EU AI Act, ISO 27001, SOC 2, HIPAA — je nach Branche.", "Which compliance frameworks apply? GDPR, EU AI Act, ISO 27001, SOC 2, HIPAA — depending on industry.")],
              [2, pick(isDE, "Controls mappen", "Map controls"), pick(isDE, "Anforderungen auf technische Controls mappen. Welche Policies decken welche Compliance-Anforderungen ab?", "Map requirements to technical controls. Which policies cover which compliance requirements?")],
              [3, pick(isDE, "Policy-as-Code implementieren", "Implement policy-as-code"), pick(isDE, "Controls als Code formulieren und in CI/CD integrieren. Automatische Überprüfung bei jedem Commit.", "Formulate controls as code and integrate in CI/CD. Automatic check at every commit.")],
              [4, pick(isDE, "Evidence Automation einrichten", "Set up evidence automation"), pick(isDE, "Automatische Evidence Collection für alle Controls. Logs, Screenshots, Configs als Compliance-Nachweise.", "Automatic evidence collection for all controls. Logs, screenshots, configs as compliance proof.")],
              [5, pick(isDE, "Compliance Dashboard deployen", "Deploy compliance dashboard"), pick(isDE, "Echtzeit-Dashboard mit Compliance-Score. Vance, Drata oder Vanta für kontinuierliche Compliance.", "Real-time dashboard with compliance score. Vanta, Drata or Secureframe for continuous compliance.")],
            ].map(([n, t, d]) => (
              <div key={n as number} className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{n}</div>
                <div><div className="font-semibold text-gray-100 mb-2">{t}</div><div className="text-sm text-gray-300">{d}</div></div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further Resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Security Check</div><div className="text-sm text-gray-300">{pick(isDE, "Infrastruktur prüfen", "Check infrastructure")}</div></a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Runbooks</div><div className="text-sm text-gray-300">{pick(isDE, "Expert-validierte Security Runbooks", "Expert-validated security runbooks")}</div></a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">OpenClaw</div><div className="text-sm text-gray-300">{pick(isDE, "OpenClaw Security Framework", "OpenClaw Security Framework")}</div></a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Roast My Moltbot</div><div className="text-sm text-gray-300">{pick(isDE, "Moltbot Security Testing", "Moltbot security testing")}</div></a>
          </div>
        </section>
      </div>
    </div>
  )
}
