import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'
import { SITE_URL } from '@/lib/config'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : 'de') as Locale
  const title = locale === 'de'
    ? 'OpenClaw vs Wazuh: Self-Hosted Security Platform Vergleich 2026'
    : 'OpenClaw vs Wazuh: Self-Hosted Security Platform Comparison 2026'
  const description = locale === 'de'
    ? 'OpenClaw vs Wazuh 2026. Wazuh ist ein Open-Source SIEM/XDR. OpenClaw bietet Executable Runbooks, Security-Check und integriertes Compliance-Dashboard für Self-Hoster.'
    : 'OpenClaw vs Wazuh 2026. Wazuh is an open-source SIEM/XDR. OpenClaw adds executable runbooks, security check and an integrated compliance dashboard for self-hosters.'
  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, '/openclaw-vs-wazuh'),
    openGraph: { images: ['/og-image.png'], title, description, type: 'article', url: `${SITE_URL}/${lang}/openclaw-vs-wazuh` },
    robots: 'index, follow',
  }
}

export default function OpenClawVsWazuhPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound()
  const isDE = lang === 'de'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">{isDE ? '"Not a Pentest" Hinweis' : '"Not a Pentest" Notice'}</strong>
          {isDE
            ? ': Dieser Guide hilft dir, das richtige Self-Hosted-Security-Tool zu wählen. Kein Angriffs-Tool.'
            : ': This guide helps you choose the right self-hosted security tool. No attack tools.'}
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? 'OpenClaw vs Wazuh: Self-Hosted Security Platform Vergleich' : 'OpenClaw vs Wazuh: Self-Hosted Security Platform Comparison'}
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          {isDE
            ? 'Wazuh ist ein Open-Source SIEM/XDR für Log-Analyse, Intrusion Detection und File Integrity Monitoring. OpenClaw (Teil der ClawGuru-Plattform) ergänzt mit Executable Runbooks, automatisierten Security-Checks und einem integrierten Compliance-Dashboard — optimiert für Self-Hoster.'
            : 'Wazuh is an open-source SIEM/XDR for log analysis, intrusion detection and file integrity monitoring. OpenClaw (part of the ClawGuru platform) adds executable runbooks, automated security checks and an integrated compliance dashboard — optimised for self-hosters.'}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? '⚔️ Direkter Vergleich' : '⚔️ Head-to-Head Comparison'}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{isDE ? 'Kriterium' : 'Criterion'}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">🔓 OpenClaw</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">🦅 Wazuh</th>
                </tr>
              </thead>
              <tbody>
                {(isDE ? [
                  ['Hauptfunktion', 'Executable Runbooks + Security Check', 'SIEM/XDR + Log-Analyse'],
                  ['Log-Analyse / SIEM', '⚠️ Via Intel-Feed-Integration', '✅ Kern-Feature'],
                  ['Intrusion Detection (IDS)', '⚠️ Via Runbook-Guides', '✅ Agent-basiert'],
                  ['File Integrity Monitoring', '❌ Nicht enthalten', '✅ Native FIM'],
                  ['Executable Runbooks', '✅ 600+ Runbooks mit Fix-Steps', '❌ Keine'],
                  ['Security-Check (Live)', '✅ 30-Sekunden-Score', '❌ Nur Agent-Reports'],
                  ['Self-Hosted', '✅ Vollständig', '✅ Vollständig Open Source'],
                  ['DSGVO / EU-Daten', '✅ EU-First', '✅ Lokal ausführbar'],
                  ['Preis', '✅ Ab €0 (Explorer)', '✅ Kostenlos (Open Source)'],
                  ['Setup-Aufwand', '✅ < 30 Minuten', '⚠️ Agent-Deployment nötig'],
                ] : [
                  ['Main function', 'Executable runbooks + security check', 'SIEM/XDR + log analysis'],
                  ['Log analysis / SIEM', '⚠️ Via Intel Feed integration', '✅ Core feature'],
                  ['Intrusion detection (IDS)', '⚠️ Via runbook guides', '✅ Agent-based'],
                  ['File integrity monitoring', '❌ Not included', '✅ Native FIM'],
                  ['Executable runbooks', '✅ 600+ runbooks with fix steps', '❌ None'],
                  ['Security check (live)', '✅ 30-second score', '❌ Agent reports only'],
                  ['Self-hosted', '✅ Fully', '✅ Fully open source'],
                  ['GDPR / EU data', '✅ EU-first', '✅ Runs locally'],
                  ['Price', '✅ From €0 (Explorer)', '✅ Free (open source)'],
                  ['Setup effort', '✅ < 30 minutes', '⚠️ Agent deployment needed'],
                ]).map(([criteria, openclaw, wazuh], i) => (
                  <tr key={criteria} className={`border-b border-gray-700 ${i % 2 === 1 ? 'bg-gray-800/50' : ''}`}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-300">{criteria}</td>
                    <td className="px-6 py-3 text-center text-sm text-gray-300">{openclaw}</td>
                    <td className="px-6 py-3 text-center text-sm text-gray-300">{wazuh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? '🏆 Wann welches Tool?' : '🏆 Which tool when?'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900 border border-green-700 p-5 rounded-lg">
              <h3 className="font-bold text-green-300 mb-3">🔓 {isDE ? 'OpenClaw ist die Wahl wenn...' : 'OpenClaw is the choice when...'}</h3>
              <ul className="space-y-1.5 text-sm text-green-200">
                {(isDE ? [
                  'Executable Runbooks für Fixes gebraucht werden',
                  'Schneller Live-Security-Score gewünscht',
                  'Wenig Zeit für Agent-Deployment und -Wartung',
                  'DSGVO-konformes Self-Hosting Priorität',
                  'Compliance-Dashboard für SOC2/ISO27001 nötig',
                ] : [
                  'Executable runbooks for fixes are needed',
                  'Fast live security score wanted',
                  'Little time for agent deployment and maintenance',
                  'GDPR-compliant self-hosting is a priority',
                  'Compliance dashboard for SOC2/ISO27001 needed',
                ]).map(item => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div className="bg-blue-900 border border-blue-700 p-5 rounded-lg">
              <h3 className="font-bold text-blue-300 mb-3">🦅 {isDE ? 'Wazuh ist die Wahl wenn...' : 'Wazuh is the choice when...'}</h3>
              <ul className="space-y-1.5 text-sm text-blue-200">
                {(isDE ? [
                  'Vollständige SIEM-Funktionalität gebraucht',
                  'Agent-basiertes Endpoint-Monitoring wichtig',
                  'File Integrity Monitoring benötigt',
                  'Log-Korrelation über viele Hosts hinweg',
                  'Dediziertes Security-Team für Tool-Betrieb vorhanden',
                ] : [
                  'Full SIEM functionality needed',
                  'Agent-based endpoint monitoring important',
                  'File integrity monitoring required',
                  'Log correlation across many hosts',
                  'Dedicated security team to operate the tool',
                ]).map(item => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? '🔗 Weiterführende Links' : '🔗 Further Resources'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${lang}/openclaw/intrusion-detection-setup`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? '🔍 IDS Setup' : '🔍 IDS Setup'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'Intrusion Detection Runbook' : 'Intrusion Detection Runbook'}</div>
            </a>
            <a href={`/${lang}/openclaw/audit-logging-setup`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? '📋 Audit Logging' : '📋 Audit Logging'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'Logging & Audit Runbook' : 'Logging & Audit Runbook'}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
