import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/moltbot-security-automation"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Moltbot Security Automation: Automatisierte Sicherheit für AI-Agents | ClawGuru"
    : "Moltbot Security Automation: Automated Security for AI Agents | ClawGuru"
  const description = isDE
    ? "Security Automation für Moltbot-Deployments. CI/CD Security, Policy-as-Code, Automated Compliance und Security Orchestration für AI-Agents. Mit Moltbot automatisierbar."
    : "Security automation for Moltbot deployments. CI/CD security, policy-as-code, automated compliance and security orchestration for AI agents. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "moltbot security automation", "ci cd security", "policy as code",
      "automated compliance", "security orchestration", "devsecops automation",
      "moltbot security", "ai agent security automation", "security workflows 2026",
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

export default function MoltbotSecurityAutomationPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Moltbot Security Automation" : "Moltbot Security Automation"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Security Automation für Moltbot-Deployments. CI/CD Security, Policy-as-Code, Automated Compliance und Security Orchestration für AI-Agents."
              : "Security automation for Moltbot deployments. CI/CD security, policy-as-code, automated compliance and security orchestration for AI agents."}
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
                {isDE ? "1. CI/CD Security" : "1. CI/CD Security"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Security Checks in CI/CD-Pipelines für Moltbot-Deployments. SAST, DAST, SCA und Container Scanning."
                  : "Security checks in CI/CD pipelines for Moltbot deployments. SAST, DAST, SCA and container scanning."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "2. Policy-as-Code" : "2. Policy-as-Code"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Policy-as-Code für Moltbot-Sicherheitsregeln. OPA/Gatekeeper und Terraform Sentinel."
                  : "Policy-as-code for Moltbot security rules. OPA/Gatekeeper and Terraform Sentinel."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "3. Automated Compliance" : "3. Automated Compliance"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Automatisierte Compliance-Checks für Moltbot-Deployments. Continuous Compliance Monitoring."
                  : "Automated compliance checks for Moltbot deployments. Continuous compliance monitoring."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "4. Security Orchestration" : "4. Security Orchestration"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "SOAR für Moltbot-Incident Response. Automatisierte Workflows für Security Events."
                  : "SOAR for Moltbot incident response. Automated workflows for security events."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "5. Infrastructure as Code Security" : "5. Infrastructure as Code Security"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Security für IaC (Terraform, Ansible, CloudFormation). Scan und Validierung vor Deployment."
                  : "Security for IaC (Terraform, Ansible, CloudFormation). Scan and validation before deployment."}
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Best Practices" : "Best Practices"}
          </h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">
                {isDE ? "Shift Left Security" : "Shift Left Security"}
              </h3>
              <p className="text-sm text-green-200">
                {isDE
                  ? "Integrieren Sie Security Checks früh im Entwicklungsprozess. Developer-First Security."
                  : "Integrate security checks early in the development process. Developer-first security."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "Automated Remediation" : "Automated Remediation"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Automatisierte Remediation für häufige Sicherheitsprobleme. Self-Healing Security."
                  : "Automated remediation for common security issues. Self-healing security."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "Security Testing in Pipeline" : "Security Testing in Pipeline"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Integrieren Sie Security Tests in CI/CD-Pipelines. Blockieren Sie unsichere Deployments."
                  : "Integrate security tests in CI/CD pipelines. Block insecure deployments."}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Secret Scanning" : "Secret Scanning"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Automatisches Secret Scanning in Repositories und CI/CD. Verhindern Sie Secrets-Leaks."
                  : "Automated secret scanning in repositories and CI/CD. Prevent secret leaks."}
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
                  {isDE ? "CI/CD Security Pipeline aufbauen" : "Build CI/CD security pipeline"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Integrieren Sie SAST, DAST, SCA und Container Scanning in Moltbot CI/CD-Pipelines."
                    : "Integrate SAST, DAST, SCA and container scanning in Moltbot CI/CD pipelines."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Policy-as-Code implementieren" : "Implement policy-as-code"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie Policy-as-Code mit OPA/Gatekeeper für Moltbot-Infrastruktur."
                    : "Implement policy-as-code with OPA/Gatekeeper for Moltbot infrastructure."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Automated Compliance Checks" : "Automated compliance checks"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Konfigurieren Sie automatisierte Compliance-Checks für Moltbot-Deployments."
                    : "Configure automated compliance checks for Moltbot deployments."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "SOAR-Workflows erstellen" : "Create SOAR workflows"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Erstellen Sie SOAR-Workflows für Moltbot-Incident Response und Automatisierung."
                    : "Create SOAR workflows for Moltbot incident response and automation."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Monitoring & Alerting" : "Monitoring & Alerting"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Überwachen Sie Security Automation und richten Sie Alerting für Fehler ein."
                    : "Monitor security automation and set up alerting for failures."}
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
