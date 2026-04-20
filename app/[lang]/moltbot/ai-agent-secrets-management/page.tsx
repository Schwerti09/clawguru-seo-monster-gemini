import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-secrets-management"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE ? "AI Agent Secrets Management: Sichere Credentials für AI-Agents | ClawGuru" : "AI Agent Secrets Management: Secure Credentials for AI Agents | ClawGuru"
  const description = isDE ? "AI Agent Secrets Management für Moltbot. HashiCorp Vault, Kubernetes Secrets, API Key Rotation und Zero-Secret-Deployments für sichere AI-Agent-Systeme." : "AI agent secrets management for Moltbot. HashiCorp Vault, Kubernetes Secrets, API key rotation and zero-secret deployments for secure AI agent systems."
  return {
    title, description,
    keywords: ["ai agent secrets management", "hashicorp vault", "api key rotation", "zero secret deployment", "kubernetes secrets", "moltbot security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentSecretsManagementPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Secrets Management" : "AI Agent Secrets Management"}</h1>
          <p className="text-lg text-gray-300 mb-4">{isDE ? "AI Agent Secrets Management für Moltbot. HashiCorp Vault, Kubernetes Secrets, API Key Rotation und Zero-Secret-Deployments für sichere AI-Agent-Systeme." : "AI agent secrets management for Moltbot. HashiCorp Vault, Kubernetes Secrets, API key rotation and zero-secret deployments for secure AI agent systems."}</p>
        </div>
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools." : "This guide is for hardening your own systems. No attack tools."}
        </div>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kernkonzepte" : "Core Concepts"}</h2>
          <div className="space-y-4">
            {[
              ["1. Zero Hardcoded Secrets", isDE ? "Keine Secrets im Code, in Config-Dateien oder in Environment-Variablen direkt. Ausnahmslos externalisierte Secret-Verwaltung." : "No secrets in code, config files or environment variables directly. Exclusively externalized secret management."],
              ["2. Dynamic Secrets", isDE ? "Kurzlebige, dynamisch generierte Credentials für jeden AI-Agent-Aufruf. HashiCorp Vault Dynamic Secrets für Datenbanken und APIs." : "Short-lived, dynamically generated credentials for every AI agent call. HashiCorp Vault dynamic secrets for databases and APIs."],
              ["3. Automatic Key Rotation", isDE ? "Automatische Rotation aller API Keys und Credentials. Kein manueller Prozess, der vergessen werden kann." : "Automatic rotation of all API keys and credentials. No manual process that can be forgotten."],
              ["4. Least Privilege Access", isDE ? "Jeder AI-Agent erhält nur die minimal notwendigen Credentials. Service-Account pro Agent-Typ mit spezifischen Berechtigungen." : "Each AI agent receives only the minimally necessary credentials. Service account per agent type with specific permissions."],
              ["5. Secret Scanning", isDE ? "Automatisches Scannen von Code und Commits auf versehentlich eingecheckte Secrets. GitGuardian, Trufflehog oder GitHub Secret Scanning." : "Automatic scanning of code and commits for accidentally checked-in secrets. GitGuardian, Trufflehog or GitHub Secret Scanning."],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Fortgeschrittene Techniken" : "Advanced Techniques"}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700"><h3 className="font-semibold text-green-300 mb-2">{isDE ? "Vault Agent Sidecar" : "Vault Agent Sidecar"}</h3><p className="text-sm text-green-200">{isDE ? "HashiCorp Vault Agent als Sidecar-Container. Secrets werden direkt in das Dateisystem des AI-Agents gemountet, nie in Env-Variablen." : "HashiCorp Vault Agent as sidecar container. Secrets mounted directly into the AI agent filesystem, never in env vars."}</p></div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700"><h3 className="font-semibold text-blue-300 mb-2">{isDE ? "OIDC Workload Identity" : "OIDC Workload Identity"}</h3><p className="text-sm text-blue-200">{isDE ? "Workload Identity Federation mit OIDC. AI-Agents authentifizieren sich über Kubernetes Service Accounts, keine statischen Keys." : "Workload Identity Federation with OIDC. AI agents authenticate via Kubernetes Service Accounts, no static keys."}</p></div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700"><h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "Secret Versioning & Rollback" : "Secret Versioning & Rollback"}</h3><p className="text-sm text-yellow-200">{isDE ? "Versionierung aller Secrets mit Rollback-Fähigkeit. Bei Kompromittierung sofortiger Wechsel zur vorherigen Version." : "Versioning of all secrets with rollback capability. Immediate switch to previous version on compromise."}</p></div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700"><h3 className="font-semibold text-red-300 mb-2">{isDE ? "Break-Glass Prozedur" : "Break-Glass Procedure"}</h3><p className="text-sm text-red-200">{isDE ? "Notfall-Zugriffsverfahren für kritische Secrets. Dokumentiert, auditiert und nur in definierten Notfallszenarien nutzbar." : "Emergency access procedures for critical secrets. Documented, audited and usable only in defined emergency scenarios."}</p></div>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Implementierungsschritte" : "Implementation Steps"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "Secret Inventory erstellen" : "Create secret inventory", isDE ? "Alle verwendeten Secrets und API Keys inventarisieren. Wer hat Zugriff? Wann wurde zuletzt rotiert?" : "Inventory all used secrets and API keys. Who has access? When was last rotation?"],
              [2, isDE ? "Vault oder AWS Secrets Manager einrichten" : "Set up Vault or AWS Secrets Manager", isDE ? "Central Secret Store deployen. HashiCorp Vault On-Premise oder managed Service." : "Deploy central secret store. HashiCorp Vault on-premise or managed service."],
              [3, isDE ? "Hardcoded Secrets entfernen" : "Remove hardcoded secrets", isDE ? "Code auf hardcoded Secrets scannen. Trufflehog oder GitGuardian für historische Commits." : "Scan code for hardcoded secrets. Trufflehog or GitGuardian for historical commits."],
              [4, isDE ? "Dynamic Secrets konfigurieren" : "Configure dynamic secrets", isDE ? "Vault Dynamic Secrets für alle Datenbankverbindungen. TTL von maximal 1 Stunde für AI-Agent-Credentials." : "Vault dynamic secrets for all database connections. TTL of maximum 1 hour for AI agent credentials."],
              [5, isDE ? "Rotation automatisieren" : "Automate rotation", isDE ? "Automatische Rotation aller statischen Secrets einrichten. Alert wenn Rotation fehlschlägt." : "Set up automatic rotation of all static secrets. Alert when rotation fails."],
            ].map(([n, t, d]) => (
              <div key={n as number} className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{n}</div>
                <div><div className="font-semibold text-gray-100 mb-2">{t}</div><div className="text-sm text-gray-300">{d}</div></div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Security Check</div><div className="text-sm text-gray-300">{isDE ? "Infrastruktur prüfen" : "Check infrastructure"}</div></a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Runbooks</div><div className="text-sm text-gray-300">{isDE ? "Expert-validierte Security Runbooks" : "Expert-validated security runbooks"}</div></a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">OpenClaw</div><div className="text-sm text-gray-300">{isDE ? "OpenClaw Security Framework" : "OpenClaw Security Framework"}</div></a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Roast My Moltbot</div><div className="text-sm text-gray-300">{isDE ? "Moltbot Security Testing" : "Moltbot security testing"}</div></a>
          </div>
        </section>
      </div>
    </div>
  )
}
