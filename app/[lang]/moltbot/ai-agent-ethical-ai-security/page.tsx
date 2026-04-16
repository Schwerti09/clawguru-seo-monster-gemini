import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-ethical-ai-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Ethical AI Security: Ethische Sicherheit für AI-Agents | ClawGuru"
    : "AI Agent Ethical AI Security: Ethical Security for AI Agents | ClawGuru"
  const description = isDE
    ? "AI Agent Ethical AI Security für Moltbot-Deployments. Bias Detection, Fairness Testing, Responsible AI und EU AI Act Compliance für AI-Agent-Systeme."
    : "AI agent ethical AI security for Moltbot deployments. Bias detection, fairness testing, responsible AI and EU AI Act compliance for AI agent systems."
  return {
    title, description,
    keywords: ["ethical ai security", "bias detection", "fairness testing", "responsible ai", "eu ai act", "moltbot security", "ethical ai 2026", "ai act compliance"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentEthicalAISecurityPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "AI Agent Ethical AI Security" : "AI Agent Ethical AI Security"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "AI Agent Ethical AI Security für Moltbot-Deployments. Bias Detection, Fairness Testing, Responsible AI und EU AI Act Compliance für AI-Agent-Systeme."
              : "AI agent ethical AI security for Moltbot deployments. Bias detection, fairness testing, responsible AI and EU AI Act compliance for AI agent systems."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools." : "This guide is for hardening your own systems. No attack tools."}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kernkonzepte" : "Core Concepts"}</h2>
          <div className="space-y-4">
            {[
              ["1. Bias Detection & Mitigation", isDE ? "Systematische Erkennung und Reduktion von Bias in AI-Agent-Entscheidungen. Statistische Fairness-Metriken und Debiasing-Techniken." : "Systematic detection and reduction of bias in AI agent decisions. Statistical fairness metrics and debiasing techniques."],
              ["2. Fairness Testing", isDE ? "Automatisiertes Fairness Testing für AI-Agents über demographische Gruppen. Disparate Impact Analysis und Equalized Odds." : "Automated fairness testing for AI agents across demographic groups. Disparate impact analysis and equalized odds."],
              ["3. EU AI Act Compliance", isDE ? "Compliance mit dem EU AI Act. Risikoklassifizierung, Transparenzpflichten und Konformitätsbewertung für AI-Systeme." : "Compliance with the EU AI Act. Risk classification, transparency obligations and conformity assessment for AI systems."],
              ["4. Explainability (XAI)", isDE ? "Erklärbarkeit von AI-Agent-Entscheidungen. SHAP, LIME und andere XAI-Methoden für Transparenz." : "Explainability of AI agent decisions. SHAP, LIME and other XAI methods for transparency."],
              ["5. Accountability Frameworks", isDE ? "Klare Verantwortlichkeiten für AI-Agent-Systeme. Audit Trails, Incident Reporting und Governance Structures." : "Clear accountability for AI agent systems. Audit trails, incident reporting and governance structures."],
            ].map(([title, desc]) => (
              <div key={title as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{title}</h3>
                <p className="text-sm text-gray-300">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Fortgeschrittene Techniken" : "Advanced Techniques"}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">{isDE ? "Continuous Fairness Monitoring" : "Continuous Fairness Monitoring"}</h3>
              <p className="text-sm text-green-200">{isDE ? "Real-time Monitoring von Fairness-Metriken in Produktion. Drift Detection und automatische Alerts bei Bias-Verschlechterung." : "Real-time monitoring of fairness metrics in production. Drift detection and automatic alerts on bias degradation."}</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">{isDE ? "Adversarial Fairness Testing" : "Adversarial Fairness Testing"}</h3>
              <p className="text-sm text-blue-200">{isDE ? "Aktive Suche nach Fairness-Lücken durch Adversarial Examples. Stress-Tests für Edge Cases." : "Active search for fairness gaps through adversarial examples. Stress tests for edge cases."}</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "AI Act Risk Assessment" : "AI Act Risk Assessment"}</h3>
              <p className="text-sm text-yellow-200">{isDE ? "Strukturierte Risikoklassifizierung nach EU AI Act (minimal, limited, high, unacceptable risk)." : "Structured risk classification per EU AI Act (minimal, limited, high, unacceptable risk)."}</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{isDE ? "Ethics Review Board" : "Ethics Review Board"}</h3>
              <p className="text-sm text-red-200">{isDE ? "Internes Ethics Review Board für AI-Agent-Deployments. Regelmäßige Ethik-Audits und Stakeholder-Beteiligung." : "Internal ethics review board for AI agent deployments. Regular ethics audits and stakeholder involvement."}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Implementierungsschritte" : "Implementation Steps"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "AI Act Risikoklasse bestimmen" : "Determine AI Act risk class", isDE ? "Klassifizieren Sie Ihren AI-Agent nach EU AI Act. High-Risk-Systeme erfordern Konformitätsbewertung." : "Classify your AI agent per EU AI Act. High-risk systems require conformity assessment."],
              [2, isDE ? "Bias Baseline messen" : "Measure bias baseline", isDE ? "Messen Sie Bias-Metriken vor Deployment. Demographische Parität, Equalized Odds, Calibration." : "Measure bias metrics before deployment. Demographic parity, equalized odds, calibration."],
              [3, isDE ? "Fairness Constraints implementieren" : "Implement fairness constraints", isDE ? "Integrieren Sie Fairness Constraints in Training und Inference. In-processing und Post-processing Methoden." : "Integrate fairness constraints in training and inference. In-processing and post-processing methods."],
              [4, isDE ? "XAI-Methoden einbinden" : "Integrate XAI methods", isDE ? "SHAP oder LIME für Entscheidungserklärungen einbinden. Für jeden Agent-Output nachvollziehbar." : "Integrate SHAP or LIME for decision explanations. Traceable for every agent output."],
              [5, isDE ? "Dokumentation & Reporting" : "Documentation & reporting", isDE ? "Erstellen Sie AI-System-Dokumentation nach EU AI Act Anforderungen. Technical Documentation und Instructions for Use." : "Create AI system documentation per EU AI Act requirements. Technical documentation and instructions for use."],
            ].map(([n, title, desc]) => (
              <div key={n as number} className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{n}</div>
                <div>
                  <div className="font-semibold text-gray-100 mb-2">{title}</div>
                  <div className="text-sm text-gray-300">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{isDE ? "Infrastruktur auf Schwachstellen prüfen" : "Check infrastructure for vulnerabilities"}</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">{isDE ? "KI-generierte Security Runbooks" : "AI-generated security runbooks"}</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw</div>
              <div className="text-sm text-gray-300">{isDE ? "OpenClaw Security Framework" : "OpenClaw Security Framework"}</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Roast My Moltbot</div>
              <div className="text-sm text-gray-300">{isDE ? "Moltbot Security Testing" : "Moltbot security testing"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
