import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-privacy-preservation"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Privacy Preservation: Datenschutz für AI-Agents | ClawGuru"
    : "AI Agent Privacy Preservation: Privacy Protection for AI Agents | ClawGuru"
  const description = isDE
    ? "AI Agent Privacy Preservation für Moltbot-Deployments. Differential Privacy, Federated Learning, Data Minimization und GDPR-Compliance für AI-Agents. Mit Moltbot automatisierbar."
    : "AI agent privacy preservation for Moltbot deployments. Differential privacy, federated learning, data minimization and GDPR compliance for AI agents."
  return {
    title, description,
    keywords: ["ai agent privacy", "differential privacy", "federated learning", "data minimization", "gdpr ai agents", "moltbot security", "privacy preservation 2026", "security check", "runbooks"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentPrivacyPreservationPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "AI Agent Privacy Preservation" : "AI Agent Privacy Preservation"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "AI Agent Privacy Preservation für Moltbot-Deployments. Differential Privacy, Federated Learning, Data Minimization und GDPR-Compliance für AI-Agents."
              : "AI agent privacy preservation for Moltbot deployments. Differential privacy, federated learning, data minimization and GDPR compliance for AI agents."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools." : "This guide is for hardening your own systems. No attack tools."}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kernkonzepte" : "Core Concepts"}</h2>
          <div className="space-y-4">
            {[
              ["1. Differential Privacy", isDE ? "Mathematisch nachweisbarer Datenschutz für AI-Agent-Training. Noise-Injection verhindert Re-Identifizierung einzelner Datenpunkte." : "Mathematically provable privacy protection for AI agent training. Noise injection prevents re-identification of individual data points."],
              ["2. Data Minimization", isDE ? "AI-Agents verarbeiten nur die minimal notwendigen Daten. Privacy by Design und Privacy by Default für alle Agent-Workflows." : "AI agents process only the minimum necessary data. Privacy by design and privacy by default for all agent workflows."],
              ["3. Anonymization & Pseudonymization", isDE ? "Techniken zur Anonymisierung von Trainingsdaten und Inference-Inputs. K-Anonymity, L-Diversity und T-Closeness." : "Techniques for anonymizing training data and inference inputs. K-anonymity, L-diversity and T-closeness."],
              ["4. Consent Management", isDE ? "Granulares Consent Management für AI-Agent-Datenzugriff. Opt-in/Opt-out und Consent Revocation für Benutzer." : "Granular consent management for AI agent data access. Opt-in/opt-out and consent revocation for users."],
              ["5. Right to Erasure", isDE ? "Technische Umsetzung des Recht auf Vergessenwerden (DSGVO Art. 17). Machine Unlearning und Data Deletion Workflows." : "Technical implementation of the right to erasure (GDPR Art. 17). Machine unlearning and data deletion workflows."],
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
              <h3 className="font-semibold text-green-300 mb-2">{isDE ? "Federated Learning" : "Federated Learning"}</h3>
              <p className="text-sm text-green-200">{isDE ? "Training ohne zentrale Datenaggregation. Modelle lernen lokal, nur Gradienten werden aggregiert." : "Training without central data aggregation. Models learn locally, only gradients are aggregated."}</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">{isDE ? "Secure Multi-Party Computation" : "Secure Multi-Party Computation"}</h3>
              <p className="text-sm text-blue-200">{isDE ? "SMPC für kollaboratives AI-Agent-Training ohne Datenweitergabe. Homomorphe Verschlüsselung." : "SMPC for collaborative AI agent training without data sharing. Homomorphic encryption."}</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "Privacy Auditing" : "Privacy Auditing"}</h3>
              <p className="text-sm text-yellow-200">{isDE ? "Automatisierte Privacy Audits für AI-Agent-Systeme. Privacy Budget Tracking und Leakage Detection." : "Automated privacy audits for AI agent systems. Privacy budget tracking and leakage detection."}</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{isDE ? "Machine Unlearning" : "Machine Unlearning"}</h3>
              <p className="text-sm text-red-200">{isDE ? "Gezielte Löschung von Trainings-Datenpunkten aus AI-Modellen ohne komplettes Retraining." : "Targeted deletion of training data points from AI models without complete retraining."}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Implementierungsschritte" : "Implementation Steps"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "Datenschutz-Folgenabschätzung (DPIA)" : "Data Protection Impact Assessment (DPIA)", isDE ? "Führen Sie eine DPIA für alle AI-Agent-Systeme durch. GDPR-Pflicht bei hohem Risiko für personenbezogene Daten." : "Conduct a DPIA for all AI agent systems. GDPR requirement for high risk to personal data."],
              [2, isDE ? "Privacy by Design umsetzen" : "Implement Privacy by Design", isDE ? "Integrieren Sie Datenschutz von Anfang an. Datenminimierung, Zweckbindung und Speicherbegrenzung." : "Integrate privacy from the start. Data minimization, purpose limitation and storage limitation."],
              [3, isDE ? "Differential Privacy konfigurieren" : "Configure Differential Privacy", isDE ? "Implementieren Sie DP mit geeignetem Privacy Budget (ε). TensorFlow Privacy oder Opacus (PyTorch)." : "Implement DP with appropriate privacy budget (ε). TensorFlow Privacy or Opacus (PyTorch)."],
              [4, isDE ? "Consent Management System" : "Consent management system", isDE ? "Bauen Sie granulares Consent Management. Benutzer können Einwilligung jederzeit widerrufen." : "Build granular consent management. Users can revoke consent at any time."],
              [5, isDE ? "Privacy Monitoring aktivieren" : "Enable privacy monitoring", isDE ? "Kontinuierliches Monitoring von Privacy Budget und Datenzugriffen. Alerts bei Anomalien." : "Continuous monitoring of privacy budget and data accesses. Alerts on anomalies."],
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
              <div className="text-sm text-gray-300">{isDE ? "Expert-validierte Security Runbooks" : "Expert-validated security runbooks"}</div>
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
