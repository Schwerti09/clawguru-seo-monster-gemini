import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/moltbot-data-encryption"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Moltbot Data Encryption: Verschlüsselung für AI-Agents | ClawGuru"
    : "Moltbot Data Encryption: Encryption for AI Agents | ClawGuru"
  const description = isDE
    ? "Verschlüsselung für Moltbot-Datenströme (in-transit und at-rest). AES-256, TLS 1.3 und Key Management für AI-Agents. Mit Moltbot automatisierbar."
    : "Encryption for Moltbot data streams (in-transit and at-rest). AES-256, TLS 1.3 and key management for AI agents. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "moltbot data encryption", "aes-256 encryption", "tls 1.3",
      "key management", "data at rest encryption", "in-transit encryption",
      "moltbot security", "ai agent security 2026", "encryption best practices",
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

export default function MoltbotDataEncryptionPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Moltbot Data Encryption" : "Moltbot Data Encryption"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Verschlüsselung für Moltbot-Datenströme (in-transit und at-rest). AES-256, TLS 1.3 und Key Management für AI-Agents."
              : "Encryption for Moltbot data streams (in-transit and at-rest). AES-256, TLS 1.3 and key management for AI agents."}
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
                {isDE ? "1. In-Transit Encryption" : "1. In-Transit Encryption"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "TLS 1.3 für alle Moltbot-Kommunikationskanäle. Starke Cipher-Suites und Perfect Forward Secrecy."
                  : "TLS 1.3 for all Moltbot communication channels. Strong cipher suites and Perfect Forward Secrecy."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "2. At-Rest Encryption" : "2. At-Rest Encryption"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "AES-256 für Daten-at-rest. Verschlüsselung für Datenbanken, Dateisysteme und Object Storage."
                  : "AES-256 for data-at-rest. Encryption for databases, file systems and object storage."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "3. Key Management" : "3. Key Management"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Sicheres Key Management mit Vault-Integration. Rotation, Scoping und Audit-Logging für Keys."
                  : "Secure key management with vault integration. Rotation, scoping and audit logging for keys."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "4. End-to-End Encryption" : "4. End-to-End Encryption"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "End-to-End Encryption für Moltbot-Kommunikation. Client-seitige Verschlüsselung und Schlüssel-Handshake."
                  : "End-to-end encryption for Moltbot communication. Client-side encryption and key handshake."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "5. Homomorphic Encryption" : "5. Homomorphic Encryption"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Homomorphic Encryption für Privacy-Preserving AI. Berechnungen auf verschlüsselten Daten."
                  : "Homomorphic encryption for privacy-preserving AI. Computations on encrypted data."}
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
                {isDE ? "Strong Cipher Suites" : "Strong Cipher Suites"}
              </h3>
              <p className="text-sm text-green-200">
                {isDE
                  ? "Verwenden Sie nur moderne Cipher-Suites mit AES-GCM und ChaCha20-Poly1305."
                  : "Use only modern cipher suites with AES-GCM and ChaCha20-Poly1305."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "Key Rotation" : "Key Rotation"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Rotieren Sie Verschlüsselungsschlüssel regelmäßig (alle 90 Tage oder bei Kompromittierung)."
                  : "Rotate encryption keys regularly (every 90 days or upon compromise)."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "Hardware Security Modules (HSM)" : "Hardware Security Modules (HSM)"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Verwenden Sie HSMs für kritische Schlüssel. Hardware-basierte Schlüssel-Speicherung."
                  : "Use HSMs for critical keys. Hardware-based key storage."}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Zero-Knowledge Encryption" : "Zero-Knowledge Encryption"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Implementieren Sie Zero-Knowledge Encryption für maximalen Datenschutz. Nur der Nutzer kann Daten entschlüsseln."
                  : "Implement zero-knowledge encryption for maximum data privacy. Only the user can decrypt data."}
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
                  {isDE ? "TLS 1.3 aktivieren" : "Enable TLS 1.3"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Konfigurieren Sie TLS 1.3 für alle Moltbot-Kommunikationskanäle. Verwenden Sie starke Cipher-Suites."
                    : "Configure TLS 1.3 for all Moltbot communication channels. Use strong cipher suites."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "At-Rest Encryption implementieren" : "Implement at-rest encryption"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Aktivieren Sie AES-256 für Datenbanken, Dateisysteme und Object Storage."
                    : "Enable AES-256 for databases, file systems and object storage."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Key Management einrichten" : "Set up key management"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Integrieren Sie einen Vault für Key Management. Implementieren Sie Rotation und Scoping."
                    : "Integrate a vault for key management. Implement rotation and scoping."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "End-to-End Encryption konfigurieren" : "Configure end-to-end encryption"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie client-seitige Verschlüsselung für kritische Moltbot-Kommunikation."
                    : "Implement client-side encryption for critical Moltbot communication."}
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
                    ? "Loggen Sie alle Schlüssel-Operationen und Verschlüsselungs-Ereignisse."
                    : "Log all key operations and encryption events."}
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
