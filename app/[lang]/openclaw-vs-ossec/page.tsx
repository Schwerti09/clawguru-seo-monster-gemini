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
  const isDE = locale === 'de'
  const title = isDE
    ? 'OpenClaw vs OSSEC: Self-Hosted HIDS Security Platform Vergleich 2026'
    : 'OpenClaw vs OSSEC: Self-Hosted HIDS Security Platform Comparison 2026'
  const description = isDE
    ? 'OpenClaw vs OSSEC 2026. OSSEC ist ein Open-Source Host-based IDS. OpenClaw bietet Executable Runbooks, Security-Check und Compliance-Dashboard — einfacher aufzusetzen als OSSEC.'
    : 'OpenClaw vs OSSEC 2026. OSSEC is an open-source host-based IDS. OpenClaw provides executable runbooks, security check and compliance dashboard — easier to set up than OSSEC.'
  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, '/openclaw-vs-ossec'),
    openGraph: { images: ['/og-image.png'], title, description, type: 'article', url: `${SITE_URL}/${lang}/openclaw-vs-ossec` },
    robots: 'index, follow',
  }
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Was ist der Unterschied zwischen OpenClaw und OSSEC?', acceptedAnswer: { '@type': 'Answer', text: 'OSSEC ist ein Host-based IDS (HIDS) mit File Integrity Monitoring und Log-Analyse. OpenClaw ist eine ganzheitliche Security-Plattform mit Executable Runbooks, Live-Score und Compliance-Dashboard — mit deutlich geringerem Setup-Aufwand als OSSEC.' } },
    { '@type': 'Question', name: 'Ist OSSEC kostenlos?', acceptedAnswer: { '@type': 'Answer', text: 'Ja, OSSEC ist Open Source und kostenlos. Allerdings erfordert es erheblichen Setup-Aufwand (Agent-Deployment, Konfiguration, Integration mit Kibana/Graylog). OpenClaw startet ebenfalls kostenlos mit dem Explorer-Plan.' } },
    { '@type': 'Question', name: 'Was ist File Integrity Monitoring (FIM)?', acceptedAnswer: { '@type': 'Answer', text: 'File Integrity Monitoring überwacht kritische Systemdateien auf unbefugte Änderungen. OSSEC bietet native FIM-Funktionalität. OpenClaw fokussiert auf Runtime-Security und Compliance, ohne nativen FIM-Support.' } },
    { '@type': 'Question', name: 'Welches Tool ist einfacher aufzusetzen?', acceptedAnswer: { '@type': 'Answer', text: 'OpenClaw ist deutlich einfacher: Einstieg in unter 30 Minuten ohne Agent-Deployment. OSSEC erfordert Agent-Installation auf jedem Host, Konfigurationstuning und typischerweise Kibana/Graylog für ein Dashboard.' } },
  ],
}

export default function OpenClawVsOssecPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound()
  const isDE = lang === 'de'

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">&quot;Not a Pentest&quot; {isDE ? 'Hinweis' : 'Notice'}</strong>
          {isDE
            ? ': Dieser Guide hilft dir, das richtige Self-Hosted-Security-Tool zu wählen. Kein Angriffs-Tool.'
            : ': This guide helps you choose the right self-hosted security tool. No attack tools.'}
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE
            ? 'OpenClaw vs OSSEC: Self-Hosted HIDS Security Platform Vergleich'
            : 'OpenClaw vs OSSEC: Self-Hosted HIDS Security Platform Comparison'}
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          {isDE
            ? 'OSSEC ist ein bewährtes Open-Source Host-based Intrusion Detection System (HIDS) mit Log-Analyse, File Integrity Monitoring und aktiver Response. OpenClaw (Teil der ClawGuru-Plattform) ergänzt mit Executable Runbooks, automatisierten Security-Checks und einem integrierten Compliance-Dashboard — mit deutlich geringerem Setup-Aufwand.'
            : 'OSSEC is a proven open-source host-based intrusion detection system (HIDS) with log analysis, file integrity monitoring and active response. OpenClaw (part of the ClawGuru platform) adds executable runbooks, automated security checks and an integrated compliance dashboard — with significantly lower setup effort.'}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? '⚔️ Direkter Vergleich' : '⚔️ Head-to-Head Comparison'}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{isDE ? 'Kriterium' : 'Criterion'}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">🔓 OpenClaw</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">🔒 OSSEC</th>
                </tr>
              </thead>
              <tbody>
                {(isDE ? [
                  ['Hauptfunktion', 'Executable Runbooks + Security Check', 'Host-based IDS (HIDS)'],
                  ['Host-based IDS', '⚠️ Via IDS-Runbook-Guides', '✅ Kern-Feature (Agent-basiert)'],
                  ['File Integrity Monitoring', '❌ Nicht enthalten', '✅ Native FIM'],
                  ['Log-Analyse', '⚠️ Via Intel-Feed-Integration', '✅ Multi-Plattform Log-Analyse'],
                  ['Aktive Response', '✅ Via Executable Runbooks', '✅ Native Active Response'],
                  ['Executable Runbooks', '✅ 600+ Runbooks mit Fix-Steps', '❌ Keine'],
                  ['Security-Check (Live)', '✅ 30-Sekunden-Score', '❌ Nur Alerts'],
                  ['Setup-Aufwand', '✅ < 30 Minuten', '⚠️ Agent-Deployment + Konfig-Tuning'],
                  ['DSGVO / EU-Daten', '✅ EU-First, Self-Hosted', '✅ Vollständig lokal'],
                  ['Preis', '✅ Ab €0 (Explorer)', '✅ Open Source (kostenlos)'],
                  ['Compliance-Dashboard', '✅ SOC2, ISO27001, NIS2', '⚠️ OSSEC Reports (rudimentär)'],
                  ['Web-Interface', '✅ Vollständiges Dashboard', '⚠️ Nur mit Kibana/Graylog'],
                ] : [
                  ['Main function', 'Executable runbooks + security check', 'Host-based IDS (HIDS)'],
                  ['Host-based IDS', '⚠️ Via IDS runbook guides', '✅ Core feature (agent-based)'],
                  ['File integrity monitoring', '❌ Not included', '✅ Native FIM'],
                  ['Log analysis', '⚠️ Via Intel Feed integration', '✅ Multi-platform log analysis'],
                  ['Active response', '✅ Via executable runbooks', '✅ Native active response'],
                  ['Executable runbooks', '✅ 600+ runbooks with fix steps', '❌ None'],
                  ['Security check (live)', '✅ 30-second score', '❌ Alerts only'],
                  ['Setup effort', '✅ < 30 minutes', '⚠️ Agent deployment + config tuning'],
                  ['GDPR / EU data', '✅ EU-first, self-hosted', '✅ Fully local'],
                  ['Price', '✅ From €0 (Explorer)', '✅ Open source (free)'],
                  ['Compliance dashboard', '✅ SOC2, ISO27001, NIS2', '⚠️ OSSEC reports (rudimentary)'],
                  ['Web interface', '✅ Full dashboard', '⚠️ Only with Kibana/Graylog'],
                ]).map(([criteria, openclaw, ossec], i) => (
                  <tr key={criteria} className={`border-b border-gray-700 ${i % 2 === 1 ? 'bg-gray-800/50' : ''}`}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-300">{criteria}</td>
                    <td className="px-6 py-3 text-center text-sm text-gray-300">{openclaw}</td>
                    <td className="px-6 py-3 text-center text-sm text-gray-300">{ossec}</td>
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
                  'Schneller Einstieg ohne langen Setup-Prozess',
                  'Executable Runbooks für Fixes gebraucht werden',
                  'Live-Score und Compliance-Dashboard wichtig',
                  'Kein dediziertes Security-Team für OSSEC-Betrieb',
                  'DSGVO-konformes Self-Hosting mit Dashboard',
                ] : [
                  'Fast onboarding without long setup process',
                  'Executable runbooks for fixes are needed',
                  'Live score and compliance dashboard important',
                  'No dedicated security team to operate OSSEC',
                  'GDPR-compliant self-hosting with dashboard',
                ]).map(item => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div className="bg-blue-900 border border-blue-700 p-5 rounded-lg">
              <h3 className="font-bold text-blue-300 mb-3">🔒 {isDE ? 'OSSEC ist die Wahl wenn...' : 'OSSEC is the choice when...'}</h3>
              <ul className="space-y-1.5 text-sm text-blue-200">
                {(isDE ? [
                  'File Integrity Monitoring (FIM) zwingend nötig',
                  'Host-basiertes IDS für viele Endpoints gebraucht',
                  'Vollständig Open Source ohne Lizenzkosten',
                  'Dediziertes Security-Team für Betrieb vorhanden',
                  'Integration in bestehende SIEM-Infrastruktur (Elastic)',
                ] : [
                  'File integrity monitoring (FIM) absolutely required',
                  'Host-based IDS for many endpoints needed',
                  'Fully open source without licence costs',
                  'Dedicated security team for operations available',
                  'Integration into existing SIEM infrastructure (Elastic)',
                ]).map(item => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? '🔗 Weiterführende Links' : '🔗 Further Resources'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${lang}/openclaw/intrusion-detection-setup`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">🔍 {isDE ? 'IDS Setup' : 'IDS Setup'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'Intrusion Detection Runbook' : 'Intrusion Detection Runbook'}</div>
            </a>
            <a href={`/${lang}/openclaw/server-hardening-checklist`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">🖥️ {isDE ? 'Server Hardening' : 'Server Hardening'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'Server Checklist Runbook' : 'Server Checklist Runbook'}</div>
            </a>
            <a href={`/${lang}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">🛡️ {isDE ? 'Security Check' : 'Security Check'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'Kostenlos starten' : 'Start for free'}</div>
            </a>
            <a href={`/${lang}/openclaw-vs-wazuh`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">🦅 {isDE ? 'OpenClaw vs Wazuh' : 'OpenClaw vs Wazuh'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'Ähnlicher Vergleich' : 'Similar comparison'}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
