import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/moltbot-iam-hardening"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Moltbot IAM Hardening: Identity & Access Management für AI-Agents | ClawGuru"
    : "Moltbot IAM Hardening: Identity & Access Management for AI Agents | ClawGuru"
  const description = isDE
    ? "IAM-Härtung für Moltbot-Integrationen. RBAC, Least-Privilege-Prinzip, API-Key-Management und Identity Governance für AI-Agents. Mit Moltbot automatisierbar."
    : "IAM hardening for Moltbot integrations. RBAC, least-privilege principle, API key management and identity governance for AI agents. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "moltbot iam", "identity access management", "rbac for ai agents",
      "api key management", "least privilege", "identity governance",
      "moltbot security", "ai agent security 2026", "iam hardening",
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

export default function MoltbotIAMHardeningPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Moltbot IAM Hardening" : "Moltbot IAM Hardening"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "IAM-Härtung für Moltbot-Integrationen. RBAC, Least-Privilege-Prinzip, API-Key-Management und Identity Governance für AI-Agents."
              : "IAM hardening for Moltbot integrations. RBAC, least-privilege principle, API key management and identity governance for AI agents."}
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
                {isDE ? "1. Role-Based Access Control (RBAC)" : "1. Role-Based Access Control (RBAC)"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Rollenbasierte Zugriffssteuerung für Moltbot-Integrationen. Definieren Sie Rollen mit minimalen Berechtigungen nach dem Least-Privilege-Prinzip."
                  : "Role-based access control for Moltbot integrations. Define roles with minimal permissions following the least-privilege principle."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "2. API-Key-Management" : "2. API Key Management"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Sichere Verwaltung von API-Keys für Moltbot-Integrationen. Rotation, Scoping und Audit-Logging für alle API-Keys."
                  : "Secure management of API keys for Moltbot integrations. Rotation, scoping and audit logging for all API keys."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "3. Identity Governance" : "3. Identity Governance"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Identity Governance und Access Review für Moltbot-Deployments. Regelmäßige Überprüfung von Zugriffsrechten und Rollen."
                  : "Identity governance and access review for Moltbot deployments. Regular review of access rights and roles."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "4. Service Account Management" : "4. Service Account Management"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Verwaltung von Service Accounts für Moltbot-Deployments. Isolation von Service Accounts und minimale Berechtigungen."
                  : "Management of service accounts for Moltbot deployments. Isolation of service accounts and minimal permissions."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "5. OAuth2 / JWT Integration" : "5. OAuth2 / JWT Integration"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "OAuth2 und JWT-basierte Authentifizierung für Moltbot-Integrationen. Token-Validierung und Scoping."
                  : "OAuth2 and JWT-based authentication for Moltbot integrations. Token validation and scoping."}
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
                {isDE ? "Least-Privilege-Prinzip" : "Least-Privilege Principle"}
              </h3>
              <p className="text-sm text-green-200">
                {isDE
                  ? "Gewähren Sie nur die minimal notwendigen Berechtigungen für jede Rolle und jeden Service Account."
                  : "Grant only the minimal necessary permissions for each role and service account."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "Regelmäßige Access Reviews" : "Regular Access Reviews"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Führen Sie monatliche oder quartalsweise Access Reviews durch um überflüssige Berechtigungen zu entfernen."
                  : "Conduct monthly or quarterly access reviews to remove unnecessary permissions."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "API-Key Rotation" : "API Key Rotation"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Rotieren Sie API-Keys regelmäßig (alle 90 Tage oder bei Kompromittierung)."
                  : "Rotate API keys regularly (every 90 days or upon compromise)."}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Audit-Logging für IAM" : "Audit Logging for IAM"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Loggen Sie alle IAM-Aktivitäten (Role Assignments, API-Key Erstellung, Access Changes)."
                  : "Log all IAM activities (role assignments, API key creation, access changes)."}
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
                  {isDE ? "Rollen definieren" : "Define roles"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Erstellen Sie RBAC-Rollen für verschiedene Moltbot-Use-Cases (Read, Write, Admin)."
                    : "Create RBAC roles for different Moltbot use cases (Read, Write, Admin)."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Service Accounts erstellen" : "Create service accounts"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Erstellen Sie dedizierte Service Accounts für Moltbot-Deployments mit minimalen Berechtigungen."
                    : "Create dedicated service accounts for Moltbot deployments with minimal permissions."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "API-Keys konfigurieren" : "Configure API keys"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Erstellen Sie API-Keys mit Scoping und Rotation-Intervallen für Moltbot-Integrationen."
                    : "Create API keys with scoping and rotation intervals for Moltbot integrations."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "OAuth2/JWT einrichten" : "Set up OAuth2/JWT"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Konfigurieren Sie OAuth2 oder JWT-basierte Authentifizierung für Moltbot-Integrationen."
                    : "Configure OAuth2 or JWT-based authentication for Moltbot integrations."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Audit-Logging aktivieren" : "Enable audit logging"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Aktivieren Sie Audit-Logging für alle IAM-Aktivitäten und SIEM-Integration."
                    : "Enable audit logging for all IAM activities and SIEM integration."}
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
