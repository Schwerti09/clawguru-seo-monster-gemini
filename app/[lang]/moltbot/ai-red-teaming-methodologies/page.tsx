import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-red-teaming-methodologies"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "AI Red Teaming Methodologies: Red Teaming für AI-Systeme | ClawGuru"
    : "AI Red Teaming Methodologies: Red Teaming for AI Systems | ClawGuru"
  const description = isDE
    ? "AI Red Teaming Methodologies für Moltbot-Deployments. Adversarial Testing, Jailbreak Detection, Bias Testing und Safety Evaluation für AI-Agents. Mit Moltbot automatisierbar."
    : "AI red teaming methodologies for Moltbot deployments. Adversarial testing, jailbreak detection, bias testing and safety evaluation for AI agents. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "ai red teaming", "adversarial testing", "jailbreak detection",
      "bias testing", "safety evaluation", "ai security testing",
      "moltbot security", "ai agent red teaming", "red teaming 2026",
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

export default function AIRedTeamingMethodologiesPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "AI Red Teaming Methodologies" : "AI Red Teaming Methodologies"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "AI Red Teaming Methodologies für Moltbot-Deployments. Adversarial Testing, Jailbreak Detection, Bias Testing und Safety Evaluation für AI-Agents."
              : "AI red teaming methodologies for Moltbot deployments. Adversarial testing, jailbreak detection, bias testing and safety evaluation for AI agents."}
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
                {isDE ? "1. Adversarial Testing" : "1. Adversarial Testing"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Adversarial Testing für AI-Agents. Prompt Engineering, Gradient Attacks und Evasion Techniques."
                  : "Adversarial testing for AI agents. Prompt engineering, gradient attacks and evasion techniques."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "2. Jailbreak Detection" : "2. Jailbreak Detection"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Jailbreak Detection für AI-Agents. Pattern Recognition, Behavioral Analysis und Content Filtering."
                  : "Jailbreak detection for AI agents. Pattern recognition, behavioral analysis and content filtering."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "3. Bias Testing" : "3. Bias Testing"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Bias Testing für AI-Agents. Fairness Metrics, Demographic Parity und Equal Opportunity."
                  : "Bias testing for AI agents. Fairness metrics, demographic parity and equal opportunity."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "4. Safety Evaluation" : "4. Safety Evaluation"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Safety Evaluation für AI-Agents. Harmfulness Scoring, Toxicity Detection und Content Safety."
                  : "Safety evaluation for AI agents. Harmfulness scoring, toxicity detection and content safety."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "5. Automated Red Teaming" : "5. Automated Red Teaming"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Automatisiertes Red Teaming für AI-Agents. LLM-basierte Adversary Agents und Auto-Red-Teaming."
                  : "Automated red teaming for AI agents. LLM-based adversary agents and auto-red-teaming."}
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
                {isDE ? "Multi-Turn Jailbreak Detection" : "Multi-Turn Jailbreak Detection"}
              </h3>
              <p className="text-sm text-green-200">
                {isDE
                  ? "Multi-Turn Jailbreak Detection für AI-Agents. Conversation History Analysis und Context Tracking."
                  : "Multi-turn jailbreak detection for AI agents. Conversation history analysis and context tracking."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "Adversarial Prompt Generation" : "Adversarial Prompt Generation"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Adversarial Prompt Generation für Red Teaming. Automated Prompt Engineering und Template Attacks."
                  : "Adversarial prompt generation for red teaming. Automated prompt engineering and template attacks."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "Model Extraction Testing" : "Model Extraction Testing"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Model Extraction Testing für AI-Agents. Membership Inference und Model Inversion."
                  : "Model extraction testing for AI agents. Membership inference and model inversion."}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Data Poisoning Testing" : "Data Poisoning Testing"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Data Poisoning Testing für AI-Agents. Backdoor Detection und Training Data Analysis."
                  : "Data poisoning testing for AI agents. Backdoor detection and training data analysis."}
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
                  {isDE ? "Red Teaming Framework aufbauen" : "Build red teaming framework"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie ein Red Teaming Framework für AI-Agents. Test Cases und Scenarios definieren."
                    : "Implement a red teaming framework for AI agents. Define test cases and scenarios."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Adversarial Tests durchführen" : "Run adversarial tests"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Führen Sie Adversarial Tests durch. Prompt Injection, Jailbreaks und Evasion Attacks."
                    : "Run adversarial tests. Prompt injection, jailbreaks and evasion attacks."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Bias & Safety Tests" : "Bias & safety tests"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Führen Sie Bias Testing und Safety Evaluation durch. Fairness und Harmfulness messen."
                    : "Run bias testing and safety evaluation. Measure fairness and harmfulness."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Automatisierte Red Teaming" : "Automated red teaming"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie automatisiertes Red Teaming mit LLM-basierten Adversary Agents."
                    : "Implement automated red teaming with LLM-based adversary agents."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Reporting & Remediation" : "Reporting & Remediation"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Erstellen Sie Red Teaming Reports und implementieren Sie Remediation für gefundene Issues."
                    : "Create red teaming reports and implement remediation for found issues."}
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
