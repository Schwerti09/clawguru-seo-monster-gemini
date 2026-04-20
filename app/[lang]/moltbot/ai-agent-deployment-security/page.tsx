import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-deployment-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Deployment Security: Sichere Deployments für AI-Agents | ClawGuru"
    : "AI Agent Deployment Security: Secure Deployments for AI Agents | ClawGuru"
  const description = isDE
    ? "AI Agent Deployment Security für Moltbot. Sichere CI/CD-Pipelines, Container Hardening, Secrets Management und Blue/Green Deployments für AI-Agent-Systeme."
    : "AI agent deployment security for Moltbot. Secure CI/CD pipelines, container hardening, secrets management and blue/green deployments for AI agent systems."
  return {
    title, description,
    keywords: ["ai agent deployment security", "cicd security", "container hardening", "secrets management", "blue green deployment", "moltbot security", "deployment security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentDeploymentSecurityPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "AI Agent Deployment Security" : "AI Agent Deployment Security"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "AI Agent Deployment Security für Moltbot. Sichere CI/CD-Pipelines, Container Hardening, Secrets Management und Blue/Green Deployments für AI-Agent-Systeme."
              : "AI agent deployment security for Moltbot. Secure CI/CD pipelines, container hardening, secrets management and blue/green deployments for AI agent systems."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools." : "This guide is for hardening your own systems. No attack tools."}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kernkonzepte" : "Core Concepts"}</h2>
          <div className="space-y-4">
            {[
              ["1. Secure CI/CD Pipelines", isDE ? "Security Integration in jeder Phase der CI/CD-Pipeline. SAST, DAST, Container Scanning und Dependency Checks vor jedem Deploy." : "Security integration at every stage of the CI/CD pipeline. SAST, DAST, container scanning and dependency checks before every deploy."],
              ["2. Container Hardening", isDE ? "Gehärtete Container-Images für AI-Agent-Deployments. Distroless Images, Read-Only Filesystems und Non-Root Execution." : "Hardened container images for AI agent deployments. Distroless images, read-only filesystems and non-root execution."],
              ["3. Secrets Management", isDE ? "Sicheres Management von API Keys, Tokens und Credentials. HashiCorp Vault, AWS Secrets Manager oder Kubernetes Secrets mit Encryption." : "Secure management of API keys, tokens and credentials. HashiCorp Vault, AWS Secrets Manager or Kubernetes Secrets with encryption."],
              ["4. Immutable Infrastructure", isDE ? "Unveränderliche Infrastruktur für AI-Agent-Deployments. Keine manuellen Änderungen in Produktion, alles über IaC." : "Immutable infrastructure for AI agent deployments. No manual changes in production, everything via IaC."],
              ["5. Blue/Green & Canary Deployments", isDE ? "Risikoarme Deployment-Strategien für AI-Agents. Schrittweise Rollouts mit automatischem Rollback bei Fehlern." : "Low-risk deployment strategies for AI agents. Gradual rollouts with automatic rollback on errors."],
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
              <h3 className="font-semibold text-green-300 mb-2">{isDE ? "GitOps Security" : "GitOps Security"}</h3>
              <p className="text-sm text-green-200">{isDE ? "GitOps-Workflows mit Security Gates. Branch Protection, Signed Commits und Automated Policy Enforcement." : "GitOps workflows with security gates. Branch protection, signed commits and automated policy enforcement."}</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">{isDE ? "Runtime Security" : "Runtime Security"}</h3>
              <p className="text-sm text-blue-200">{isDE ? "Laufzeit-Sicherheit für AI-Agent-Container. Falco, Sysdig oder eBPF-basiertes Monitoring." : "Runtime security for AI agent containers. Falco, Sysdig or eBPF-based monitoring."}</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "Policy as Code (OPA)" : "Policy as Code (OPA)"}</h3>
              <p className="text-sm text-yellow-200">{isDE ? "Open Policy Agent für automatisierte Security Policies im Deployment-Prozess. Deployment Gate Validation." : "Open Policy Agent for automated security policies in the deployment process. Deployment gate validation."}</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{isDE ? "Deployment Attestation" : "Deployment Attestation"}</h3>
              <p className="text-sm text-red-200">{isDE ? "Kryptographische Attestierung jedes Deployments. SLSA Framework und in-toto Attestations." : "Cryptographic attestation of every deployment. SLSA framework and in-toto attestations."}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Implementierungsschritte" : "Implementation Steps"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "CI/CD Security Gates einbauen" : "Add CI/CD security gates", isDE ? "SAST und Dependency Scanning in CI-Pipeline integrieren. Kein Merge ohne grüne Security Checks." : "Integrate SAST and dependency scanning in CI pipeline. No merge without green security checks."],
              [2, isDE ? "Container Images härten" : "Harden container images", isDE ? "Minimale Base Images verwenden. Distroless oder Alpine. Non-root User, Read-only FS." : "Use minimal base images. Distroless or Alpine. Non-root user, read-only FS."],
              [3, isDE ? "Secrets aus Code entfernen" : "Remove secrets from code", isDE ? "Alle Secrets aus Codebase entfernen. Vault oder Sealed Secrets für Kubernetes nutzen." : "Remove all secrets from codebase. Use Vault or Sealed Secrets for Kubernetes."],
              [4, isDE ? "IaC Security scannen" : "Scan IaC security", isDE ? "Terraform, Helm Charts und K8s Manifests mit Checkov oder tfsec scannen." : "Scan Terraform, Helm charts and K8s manifests with Checkov or tfsec."],
              [5, isDE ? "Canary Deployment einrichten" : "Set up canary deployment", isDE ? "Schrittweise Rollouts mit 5% → 25% → 100% Traffic. Automatischer Rollback bei Error Rate > 1%." : "Gradual rollouts with 5% → 25% → 100% traffic. Automatic rollback when error rate > 1%."],
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
