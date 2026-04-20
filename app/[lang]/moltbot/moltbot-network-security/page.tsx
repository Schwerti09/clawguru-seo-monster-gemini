import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/moltbot-network-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Moltbot Network Security: Netzwerksicherheit für AI-Agents | ClawGuru"
    : "Moltbot Network Security: Network Security for AI Agents | ClawGuru"
  const description = isDE
    ? "Netzwerksegmentierung, Firewall-Konfiguration und TLS-Verschlüsselung für Moltbot-Kommunikationskanäle. Mit Moltbot automatisierbar."
    : "Network segmentation, firewall configuration and TLS encryption for Moltbot communication channels. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "moltbot network security", "network segmentation", "firewall configuration",
      "tls encryption", "ai agent network security", "moltbot security",
      "network hardening", "ai agent security 2026", "security check",
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

export default function MoltbotNetworkSecurityPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Moltbot Network Security" : "Moltbot Network Security"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Netzwerksegmentierung, Firewall-Konfiguration und TLS-Verschlüsselung für Moltbot-Kommunikationskanäle."
              : "Network segmentation, firewall configuration and TLS encryption for Moltbot communication channels."}
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
                {isDE ? "1. Netzwerksegmentierung" : "1. Network Segmentation"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Isolieren Sie Moltbot-Netzwerke in separaten VPCs oder Subnetzen. Minimieren Sie laterale Bewegung."
                  : "Isolate Moltbot networks in separate VPCs or subnets. Minimize lateral movement."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "2. Firewall-Konfiguration" : "2. Firewall Configuration"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Implementieren Sie Whitelist-basierte Firewall-Regeln für Moltbot-Kommunikation. Blockieren Sie unnötige Ports."
                  : "Implement whitelist-based firewall rules for Moltbot communication. Block unnecessary ports."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "3. TLS-Verschlüsselung" : "3. TLS Encryption"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Aktivieren Sie TLS 1.3 für alle Moltbot-Kommunikationskanäle. Verwenden Sie starke Cipher-Suites und Zertifikate."
                  : "Enable TLS 1.3 for all Moltbot communication channels. Use strong cipher suites and certificates."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "4. API Gateway Security" : "4. API Gateway Security"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Schützen Sie Moltbot-API-Endpunkte mit Rate Limiting, Authentifizierung und IP-Filterung."
                  : "Protect Moltbot API endpoints with rate limiting, authentication and IP filtering."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "5. DDoS-Schutz" : "5. DDoS Protection"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Implementieren Sie DDoS-Mitigation für Moltbot-Endpunkte. Verwenden Sie Cloud-basierte DDoS-Schutzdienste."
                  : "Implement DDoS mitigation for Moltbot endpoints. Use cloud-based DDoS protection services."}
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
                {isDE ? "Zero Trust Networking" : "Zero Trust Networking"}
              </h3>
              <p className="text-sm text-green-200">
                {isDE
                  ? "Implementieren Sie Zero Trust-Prinzipien: Kein implizites Vertrauen, Authentifizierung für jede Verbindung."
                  : "Implement zero trust principles: No implicit trust, authentication for every connection."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "Principle of Least Privilege" : "Principle of Least Privilege"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Gewähren Sie nur minimalen Netzwerkzugriff für Moltbot-Komponenten."
                  : "Grant minimal network access for Moltbot components."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "Network Monitoring" : "Network Monitoring"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Überwachen Sie den Netzwerkverkehr für Anomalien und verdächtige Aktivitäten."
                  : "Monitor network traffic for anomalies and suspicious activities."}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Regular Security Audits" : "Regular Security Audits"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Führen Sie regelmäßige Security Audits für Netzwerk-Konfigurationen und Firewall-Regeln durch."
                  : "Conduct regular security audits for network configurations and firewall rules."}
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
                  {isDE ? "Netzwerksegmentierung planen" : "Plan network segmentation"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Entwerfen Sie eine Netzwerksegmentierungsstrategie für Moltbot-Komponenten. Trennen Sie Daten, Kontrolle und Management."
                    : "Design a network segmentation strategy for Moltbot components. Separate data, control and management."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Firewall-Regeln implementieren" : "Implement firewall rules"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Erstellen Sie Whitelist-basierte Firewall-Regeln für Moltbot-Kommunikation. Blockieren Sie unnötige Ports."
                    : "Create whitelist-based firewall rules for Moltbot communication. Block unnecessary ports."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "TLS-Verschlüsselung aktivieren" : "Enable TLS encryption"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Konfigurieren Sie TLS 1.3 für alle Moltbot-Kommunikationskanäle. Verwenden Sie starke Cipher-Suites."
                    : "Configure TLS 1.3 for all Moltbot communication channels. Use strong cipher suites."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "API Gateway Security einrichten" : "Set up API gateway security"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Schützen Sie Moltbot-API-Endpunkte mit Rate Limiting, Authentifizierung und IP-Filterung."
                    : "Protect Moltbot API endpoints with rate limiting, authentication and IP filtering."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "DDoS-Schutz implementieren" : "Implement DDoS protection"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Integrieren Sie Cloud-basierte DDoS-Schutzdienste für Moltbot-Endpunkte."
                    : "Integrate cloud-based DDoS protection services for Moltbot endpoints."}
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
