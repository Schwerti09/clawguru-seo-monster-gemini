import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/moltbot-threat-modeling-guide"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Moltbot Threat Modeling Guide: Bedrohungsanalyse für AI-Agents | ClawGuru"
    : "Moltbot Threat Modeling Guide: Threat Analysis for AI Agents | ClawGuru"
  const description = isDE
    ? "Systematische Bedrohungsanalyse für Moltbot-Deployments. STRIDE-Methodik, Threat Modeling für AI-Agents und Bedrohungsmodellierung. Mit Moltbot automatisierbar."
    : "Systematic threat analysis for Moltbot deployments. STRIDE methodology, threat modeling for AI agents and threat modeling. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "moltbot threat modeling", "ai agent threat analysis", "stride methodology",
      "threat modeling for ai", "security threat analysis", "moltbot security",
      "ai agent security 2026", "threat modeling guide", "security check",
      "runbooks", "openclaw"
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

export default function MoltbotThreatModelingGuidePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Moltbot Threat Modeling Guide" : "Moltbot Threat Modeling Guide"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Systematische Bedrohungsanalyse für Moltbot-Deployments. STRIDE-Methodik und Threat Modeling für AI-Agents."
              : "Systematic threat analysis for Moltbot deployments. STRIDE methodology and threat modeling for AI agents."}
          </p>
        </div>

        {/* Not a Pentest Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        {/* STRIDE Methodology */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "STRIDE-Methodik" : "STRIDE Methodology"}
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "S - Spoofing" : "S - Spoofing"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Identitätswechsel: Angreifer geben sich als legitime Moltbot-Agenten aus. Schutz durch Authentifizierung und Signatur-Verifizierung."
                  : "Identity spoofing: Attackers impersonate legitimate Moltbot agents. Protection through authentication and signature verification."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "T - Tampering" : "T - Tampering"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Manipulation von Daten oder Code. Schutz durch Integritäts-Checks und digitale Signaturen."
                  : "Data or code tampering. Protection through integrity checks and digital signatures."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "R - Repudiation" : "R - Repudiation"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Nicht-Leugnbarkeit: Angreifer lehnen Aktionen ab. Schutz durch Audit-Logging und nicht manipulierbare Logs."
                  : "Non-repudiation: Attackers deny actions. Protection through audit logging and tamper-proof logs."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "I - Information Disclosure" : "I - Information Disclosure"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Informationslecks: Unbefugter Zugriff auf sensible Daten. Schutz durch Verschlüsselung und Zugriffskontrolle."
                  : "Information disclosure: Unauthorized access to sensitive data. Protection through encryption and access control."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "D - Denial of Service" : "D - Denial of Service"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Verfügbarkeitsangriffe: Überlastung von Moltbot-Systemen. Schutz durch Rate Limiting und DDoS-Mitigation."
                  : "Availability attacks: Overloading Moltbot systems. Protection through rate limiting and DDoS mitigation."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "E - Elevation of Privilege" : "E - Elevation of Privilege"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Privilege Escalation: Angreifer erweitern ihre Rechte. Schutz durch Least-Privilege und Capability Control."
                  : "Privilege escalation: Attackers expand their rights. Protection through least-privilege and capability control."}
              </p>
            </div>
          </div>
        </section>

        {/* AI-Specific Threats */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "AI-Spezifische Bedrohungen" : "AI-Specific Threats"}
          </h2>
          <div className="space-y-4">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "Prompt Injection" : "Prompt Injection"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Bösartige Eingaben, die das Verhalten von AI-Agents manipulieren. Schutz durch Input-Validierung und Output-Sanitization."
                  : "Malicious inputs that manipulate AI agent behavior. Protection through input validation and output sanitization."}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Model Poisoning" : "Model Poisoning"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Manipulation von Trainingsdaten oder Modellgewichten. Schutz durch Supply Chain Security und Modell-Validierung."
                  : "Manipulation of training data or model weights. Protection through supply chain security and model validation."}
              </p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">
                {isDE ? "Model Extraction" : "Model Extraction"}
              </h3>
              <p className="text-sm text-green-200">
                {isDE
                  ? "Extraktion von Modellparametern durch Abfragen. Schutz durch Rate Limiting und Output-Watermarking."
                  : "Extraction of model parameters through queries. Protection through rate limiting and output watermarking."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "Adversarial Examples" : "Adversarial Examples"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Manipulierte Eingaben, die zu falschen Outputs führen. Schutz durch Robustness-Training und Anomalie-Erkennung."
                  : "Manipulated inputs that cause incorrect outputs. Protection through robustness training and anomaly detection."}
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
                  {isDE ? "Assets identifizieren" : "Identify assets"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Listen Sie alle kritischen Assets auf: Daten, Modelle, APIs, Kommunikationskanäle und Infrastruktur."
                    : "List all critical assets: data, models, APIs, communication channels and infrastructure."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Bedrohungen identifizieren" : "Identify threats"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Verwenden Sie STRIDE und AI-spezifische Bedrohungsmodelle für jede Asset-Kategorie."
                    : "Use STRIDE and AI-specific threat models for each asset category."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Risiken bewerten" : "Assess risks"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Bewerten Sie Wahrscheinlichkeit und Auswirkung jeder Bedrohung. Priorisieren Sie nach Risiko."
                    : "Assess probability and impact of each threat. Prioritize by risk."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Mitigations implementieren" : "Implement mitigations"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie Sicherheitskontrollen für jede identifizierte Bedrohung."
                    : "Implement security controls for each identified threat."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Überprüfen und aktualisieren" : "Review and update"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Überprüfen Sie regelmäßig das Threat Model und aktualisieren Sie es bei Änderungen."
                    : "Regularly review the threat model and update it when changes occur."}
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
                {isDE ? "Expert-validierte Security Runbooks" : "Expert-validated security runbooks"}
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
