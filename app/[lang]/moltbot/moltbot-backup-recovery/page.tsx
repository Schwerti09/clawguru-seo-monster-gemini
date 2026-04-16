import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/moltbot-backup-recovery"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Moltbot Backup & Recovery: Datensicherung für AI-Agents | ClawGuru"
    : "Moltbot Backup & Recovery: Data Protection for AI Agents | ClawGuru"
  const description = isDE
    ? "Backup & Recovery für Moltbot-Deployments. 3-2-1-Backup-Strategie, Point-in-Time-Recovery und Business Continuity für AI-Agents. Mit Moltbot automatisierbar."
    : "Backup & recovery for Moltbot deployments. 3-2-1 backup strategy, point-in-time recovery and business continuity for AI agents. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "moltbot backup", "moltbot recovery", "backup strategy",
      "point in time recovery", "business continuity", "disaster recovery",
      "moltbot security", "ai agent backup", "data protection 2026",
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

export default function MoltbotBackupRecoveryPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Moltbot Backup & Recovery" : "Moltbot Backup & Recovery"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Backup & Recovery für Moltbot-Deployments. 3-2-1-Backup-Strategie, Point-in-Time-Recovery und Business Continuity für AI-Agents."
              : "Backup & recovery for Moltbot deployments. 3-2-1 backup strategy, point-in-time recovery and business continuity for AI agents."}
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
                {isDE ? "1. 3-2-1-Backup-Strategie" : "1. 3-2-1 Backup Strategy"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "3 Kopien, 2 verschiedene Medien, 1 Offsite-Backup für kritische Moltbot-Daten und Modelle."
                  : "3 copies, 2 different media, 1 offsite backup for critical Moltbot data and models."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "2. Point-in-Time-Recovery" : "2. Point-in-Time Recovery"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Wiederherstellung zu einem beliebigen Zeitpunkt für Moltbot-Datenbanken und Konfigurationen."
                  : "Recovery to any point in time for Moltbot databases and configurations."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "3. Business Continuity" : "3. Business Continuity"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Business Continuity Planning für Moltbot-Critical Services. RTO/RPO definieren und testen."
                  : "Business continuity planning for Moltbot-critical services. Define and test RTO/RPO."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "4. Backup-Encryption" : "4. Backup Encryption"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Verschlüsselung für Backups im Transit und At-Rest. AES-256 und TLS 1.3."
                  : "Encryption for backups in transit and at-rest. AES-256 and TLS 1.3."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "5. Backup-Validation" : "5. Backup Validation"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Regelmäßige Validierung von Backups. Integritäts-Checks und Recovery-Tests."
                  : "Regular validation of backups. Integrity checks and recovery tests."}
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
                {isDE ? "Automatisierte Backups" : "Automated Backups"}
              </h3>
              <p className="text-sm text-green-200">
                {isDE
                  ? "Automatisieren Sie Backup-Prozesse für Moltbot-Daten und Modelle. Täglich, wöchentlich und monatliche Backups."
                  : "Automate backup processes for Moltbot data and models. Daily, weekly and monthly backups."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "Retention Policy" : "Retention Policy"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Definieren Sie eine Retention Policy basierend auf Compliance-Anforderungen (7 Jahre bis unbegrenzt)."
                  : "Define a retention policy based on compliance requirements (7 years to unlimited)."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "Immutability" : "Immutability"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Verwenden Sie Immutable Backups für kritische Moltbot-Daten. Schutz vor Ransomware und Löschung."
                  : "Use immutable backups for critical Moltbot data. Protection from ransomware and deletion."}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Cross-Region Replication" : "Cross-Region Replication"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Replizieren Sie Backups über verschiedene Regionen für Disaster Recovery."
                  : "Replicate backups across different regions for disaster recovery."}
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
                  {isDE ? "Backup-Strategie definieren" : "Define backup strategy"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Definieren Sie eine 3-2-1-Backup-Strategie für Moltbot-Daten und Modelle. Bestimmen Sie RTO/RPO."
                    : "Define a 3-2-1 backup strategy for Moltbot data and models. Determine RTO/RPO."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Backup-Lösung implementieren" : "Implement backup solution"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie eine Backup-Lösung für Moltbot-Datenbanken, Modelle und Konfigurationen."
                    : "Implement a backup solution for Moltbot databases, models and configurations."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Automatisierung einrichten" : "Set up automation"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Automatisieren Sie Backup-Prozesse mit Cron-Jobs oder CI/CD-Pipelines."
                    : "Automate backup processes with cron jobs or CI/CD pipelines."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Recovery-Tests durchführen" : "Perform recovery tests"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Führen Sie regelmäßige Recovery-Tests durch um Backup-Integrität zu validieren."
                    : "Perform regular recovery tests to validate backup integrity."}
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
                    ? "Überwachen Sie Backup-Jobs und richten Sie Alerting für fehlgeschlagene Backups ein."
                    : "Monitor backup jobs and set up alerting for failed backups."}
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
