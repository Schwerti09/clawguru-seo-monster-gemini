import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/moltbot-security-fundamentals"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Moltbot Security Fundamentals: Grundlagen der AI-Agenten-Sicherheit | ClawGuru", "Moltbot Security Fundamentals: AI Agent Security Basics | ClawGuru")
  const description = pick(isDE, "Grundlegende Sicherheitskonzepte für Moltbot AI-Agents: Threat Modeling, IAM, Network Security, Data Encryption, Logging & Monitoring. Mit Moltbot automatisierbar.", "Fundamental security concepts for Moltbot AI agents: threat modeling, IAM, network security, data encryption, logging & monitoring. Automatable with Moltbot.")
  return {
    title,
    description,
    keywords: [
      "moltbot security", "ai agent security fundamentals", "threat modeling",
      "iam for ai agents", "network security", "data encryption",
      "logging monitoring", "moltbot hardening", "ai agent security 2026",
      "security check", "runbooks"
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

export default function MoltbotSecurityFundamentalsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "Moltbot Security Fundamentals", "Moltbot Security Fundamentals")}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "Grundlegende Sicherheitskonzepte für Moltbot AI-Agents. Umfassender Leitfaden für Threat Modeling, IAM, Network Security, Data Encryption, Logging & Monitoring.", "Fundamental security concepts for Moltbot AI agents. Comprehensive guide covering threat modeling, IAM, network security, data encryption, logging & monitoring.")}
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
                {pick(isDE, "1. Threat Modeling", "1. Threat Modeling")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Systematische Identifizierung potenzieller Bedrohungen für Moltbot-Deployments. STRIDE-Methodik und Bedrohungsmodellierung für AI-Agents.", "Systematic identification of potential threats for Moltbot deployments. STRIDE methodology and threat modeling for AI agents.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "2. Identity & Access Management (IAM)", "2. Identity & Access Management (IAM)")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Rollenbasierte Zugriffssteuerung (RBAC) für Moltbot-Integrationen. Least-Privilege-Prinzip und API-Key-Management.", "Role-based access control (RBAC) for Moltbot integrations. Least-privilege principle and API key management.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "3. Network Security", "3. Network Security")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Netzwerksegmentierung, Firewall-Konfiguration und TLS-Verschlüsselung für Moltbot-Kommunikationskanäle.", "Network segmentation, firewall configuration and TLS encryption for Moltbot communication channels.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "4. Data Encryption", "4. Data Encryption")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Verschlüsselung für Moltbot-Datenströme (in-transit und at-rest). AES-256 und TLS 1.3 Best Practices.", "Encryption for Moltbot data streams (in-transit and at-rest). AES-256 and TLS 1.3 best practices.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "5. Logging & Monitoring", "5. Logging & Monitoring")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Audit-Logging und Echtzeit-Monitoring für Moltbot-Aktivitäten. SIEM-Integration und Anomalie-Erkennung.", "Audit logging and real-time monitoring for Moltbot activities. SIEM integration and anomaly detection.")}
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
                  {pick(isDE, "Bedrohungsanalyse durchführen", "Perform threat analysis")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Identifizieren Sie kritische Assets, potenzielle Angreifer und Angriffsvektoren für Ihre Moltbot-Deployment.", "Identify critical assets, potential attackers and attack vectors for your Moltbot deployment.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "IAM-Konfiguration implementieren", "Implement IAM configuration")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Richten Sie RBAC-Rollen ein und gewähren Sie minimalen Zugriff nach dem Least-Privilege-Prinzip.", "Set up RBAC roles and grant minimal access following the least-privilege principle.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Netzwerksegmentierung konfigurieren", "Configure network segmentation")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Isolieren Sie Moltbot-Netzwerke und implementieren Sie Firewall-Regeln für die Kommunikation.", "Isolate Moltbot networks and implement firewall rules for communication.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Verschlüsselung aktivieren", "Enable encryption")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Implementieren Sie TLS 1.3 für alle Kommunikationskanäle und AES-256 für Daten-at-rest.", "Implement TLS 1.3 for all communication channels and AES-256 for data-at-rest.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Logging & Monitoring einrichten", "Set up logging & monitoring")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Konfigurieren Sie Audit-Logging und Echtzeit-Monitoring mit SIEM-Integration.", "Configure audit logging and real-time monitoring with SIEM integration.")}
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
