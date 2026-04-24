import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-supply-chain-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Supply Chain Security: Supply Chain Security für AI-Agents | ClawGuru", "AI Agent Supply Chain Security: Supply Chain Security for AI Agents | ClawGuru")
  const description = pick(isDE, "AI Agent Supply Chain Security für Moltbot-Deployments. SBOM, Dependency Scanning, Vulnerability Management und Supply Chain Hardening für AI-Agent-Komponenten. Mit Moltbot automatisierbar.", "AI agent supply chain security for Moltbot deployments. SBOM, dependency scanning, vulnerability management and supply chain hardening for AI agent components. Automatable with Moltbot.")
  return {
    title,
    description,
    keywords: [
      "ai agent supply chain", "sbom", "dependency scanning",
      "vulnerability management", "supply chain hardening", "ai agent security",
      "moltbot security", "ai agent supply chain 2026",
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

export default function AIAgentSupplyChainSecurityPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "AI Agent Supply Chain Security", "AI Agent Supply Chain Security")}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "AI Agent Supply Chain Security für Moltbot-Deployments. SBOM, Dependency Scanning, Vulnerability Management und Supply Chain Hardening für AI-Agent-Komponenten.", "AI agent supply chain security for Moltbot deployments. SBOM, dependency scanning, vulnerability management and supply chain hardening for AI agent components.")}
          </p>
        </div>

        {/* Not a Pentest Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>

        {/* Core Concepts */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Kernkonzepte", "Core Concepts")}
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "1. Software Bill of Materials (SBOM)", "1. Software Bill of Materials (SBOM)")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "SBOM für AI-Agent-Komponenten. Vollständige Liste aller Dependencies und Transitive Dependencies.", "SBOM for AI agent components. Complete list of all dependencies and transitive dependencies.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "2. Dependency Scanning", "2. Dependency Scanning")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Dependency Scanning für AI-Agents. Automatisierte Scans für CVEs und Schwachstellen.", "Dependency scanning for AI agents. Automated scans for CVEs and vulnerabilities.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "3. Vulnerability Management", "3. Vulnerability Management")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Vulnerability Management für AI-Agent-Supply Chain. Patch Management und Risk Prioritization.", "Vulnerability management for AI agent supply chain. Patch management and risk prioritization.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "4. Supply Chain Hardening", "4. Supply Chain Hardening")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Supply Chain Hardening für AI-Agents. Verified Repositories, Code Signing und Artifact Verification.", "Supply chain hardening for AI agents. Verified repositories, code signing and artifact verification.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "5. Model Supply Chain", "5. Model Supply Chain")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Model Supply Chain Security für AI-Agents. Model Provenance, Model Signing und Model Versioning.", "Model supply chain security for AI agents. Model provenance, model signing and model versioning.")}
              </p>
            </div>
          </div>
        </section>

        {/* Advanced Techniques */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Fortgeschrittene Techniken", "Advanced Techniques")}
          </h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">
                {pick(isDE, "SBOM Automation", "SBOM Automation")}
              </h3>
              <p className="text-sm text-green-200">
                {pick(isDE, "SBOM Automation für AI-Agent-Deployments. Automated SBOM Generation in CI/CD.", "SBOM automation for AI agent deployments. Automated SBOM generation in CI/CD.")}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {pick(isDE, "Dependency Pinning", "Dependency Pinning")}
              </h3>
              <p className="text-sm text-blue-200">
                {pick(isDE, "Dependency Pinning für AI-Agents. Lock Files und Version Constraints für Stable Deployments.", "Dependency pinning for AI agents. Lock files and version constraints for stable deployments.")}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {pick(isDE, "Artifact Verification", "Artifact Verification")}
              </h3>
              <p className="text-sm text-yellow-200">
                {pick(isDE, "Artifact Verification für AI-Agent-Dependencies. Checksums und Digital Signatures.", "Artifact verification for AI agent dependencies. Checksums and digital signatures.")}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {pick(isDE, "Zero Trust Supply Chain", "Zero Trust Supply Chain")}
              </h3>
              <p className="text-sm text-red-200">
                {pick(isDE, "Zero Trust Supply Chain für AI-Agents. Verify Every Artifact, Every Time.", "Zero trust supply chain for AI agents. Verify every artifact, every time.")}
              </p>
            </div>
          </div>
        </section>

        {/* Implementation Steps */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Implementierungsschritte", "Implementation Steps")}
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "SBOM Pipeline aufbauen", "Build SBOM pipeline")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Implementieren Sie SBOM Generation für AI-Agent-Komponenten. CycloneDX oder SPDX Format.", "Implement SBOM generation for AI agent components. CycloneDX or SPDX format.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Dependency Scanner integrieren", "Integrate dependency scanner")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Integrieren Sie Dependency Scanning in CI/CD. Trivy, Snyk oder OWASP Dependency Check.", "Integrate dependency scanning in CI/CD. Trivy, Snyk or OWASP Dependency Check.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Vulnerability Management", "Vulnerability management")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Implementieren Sie Vulnerability Management Workflows. Patching und Risk Scoring.", "Implement vulnerability management workflows. Patching and risk scoring.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Supply Chain Hardening", "Supply chain hardening")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Implementieren Sie Supply Chain Hardening. Verified Repositories und Code Signing.", "Implement supply chain hardening. Verified repositories and code signing.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Monitoring & Auditing", "Monitoring & Auditing")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Überwachen Sie Supply Chain Events und führen Sie Audits für Dependencies durch.", "Monitor supply chain events and perform audits for dependencies.")}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Weiterführende Ressourcen", "Further Resources")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {pick(isDE, "Security Check", "Security Check")}
              </div>
              <div className="text-sm text-gray-300">
                {pick(isDE, "Überprüfen Sie Ihre Infrastruktur auf Schwachstellen", "Check your infrastructure for vulnerabilities")}
              </div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {pick(isDE, "Runbooks", "Runbooks")}
              </div>
              <div className="text-sm text-gray-300">
                {pick(isDE, "Expert-validierte Security Runbooks", "Expert-validated security runbooks")}
              </div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {pick(isDE, "OpenClaw", "OpenClaw")}
              </div>
              <div className="text-sm text-gray-300">
                {pick(isDE, "OpenClaw Security Framework", "OpenClaw Security Framework")}
              </div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {pick(isDE, "Roast My Moltbot", "Roast My Moltbot")}
              </div>
              <div className="text-sm text-gray-300">
                {pick(isDE, "Moltbot Security Testing", "Moltbot security testing")}
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
