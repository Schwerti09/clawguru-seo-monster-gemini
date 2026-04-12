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
    ? 'Moltbot vs VictorOps (Splunk On-Call): Incident Response Vergleich 2026'
    : 'Moltbot vs VictorOps (Splunk On-Call): Incident Response Comparison 2026'
  const description = isDE
    ? 'Moltbot vs VictorOps 2026. VictorOps (Splunk On-Call) ist eine Alerting & On-Call-Management-Plattform. Moltbot bietet Executable Runbooks, automatisierte Incident-Response und DSGVO-konformes Self-Hosting.'
    : 'Moltbot vs VictorOps 2026. VictorOps (Splunk On-Call) is an alerting & on-call management platform. Moltbot provides executable runbooks, automated incident response and GDPR-compliant self-hosting.'
  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, '/moltbot-vs-victorops'),
    openGraph: { images: ['/og-image.png'], title, description, type: 'article', url: `${SITE_URL}/${lang}/moltbot-vs-victorops` },
    robots: 'index, follow',
  }
}

export default function MoltbotVsVictorOpsPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound()
  const isDE = lang === 'de'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">&quot;Not a Pentest&quot; {isDE ? 'Hinweis' : 'Notice'}</strong>
          {isDE
            ? ': Dieser Guide hilft dir, das richtige Incident-Response-Tool zu wählen. Kein Angriffs-Tool.'
            : ': This guide helps you choose the right incident response tool. No attack tools.'}
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE
            ? 'Moltbot vs VictorOps (Splunk On-Call): Incident Response Vergleich'
            : 'Moltbot vs VictorOps (Splunk On-Call): Incident Response Comparison'}
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          {isDE
            ? 'VictorOps (heute: Splunk On-Call) ist eine On-Call-Management- und Alert-Routing-Plattform für DevOps-Teams. Moltbot (Teil der ClawGuru-Plattform) ergänzt mit Executable Security-Runbooks, automatisierter Incident-Response und einem integrierten Security-Dashboard — mit DSGVO-konformem Self-Hosting.'
            : 'VictorOps (now Splunk On-Call) is an on-call management and alert routing platform for DevOps teams. Moltbot (part of the ClawGuru platform) adds executable security runbooks, automated incident response and an integrated security dashboard — with GDPR-compliant self-hosting.'}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? '⚔️ Direkter Vergleich' : '⚔️ Head-to-Head Comparison'}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{isDE ? 'Kriterium' : 'Criterion'}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">🤖 Moltbot</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">📟 VictorOps</th>
                </tr>
              </thead>
              <tbody>
                {(isDE ? [
                  ['Hauptfunktion', 'Security Runbooks + Incident-Response', 'On-Call-Management + Alert-Routing'],
                  ['On-Call-Scheduling', '⚠️ Via Integration (PagerDuty, Opsgenie)', '✅ Kern-Feature'],
                  ['Alert-Routing & Eskalation', '⚠️ Via Webhook-Runbooks', '✅ Kern-Feature mit Timeline'],
                  ['Executable Security-Runbooks', '✅ 600+ Runbooks', '❌ Keine'],
                  ['Automatisierte Incident-Response', '✅ Runbook-basiert', '⚠️ Nur manuelle Playbooks'],
                  ['Security-Score / Dashboard', '✅ Live-Score', '❌ Kein Security-Score'],
                  ['DSGVO / EU-Daten', '✅ EU-First, Self-Hosted möglich', '⚠️ US-basiert (Splunk)'],
                  ['Preis', '✅ Ab €0 (Explorer)', '⚠️ Ab $5/Benutzer/Monat'],
                  ['Compliance-Automation', '✅ SOC2, ISO27001, NIS2', '❌ Keine'],
                  ['Integrationen', '✅ Webhooks, Slack, Teams', '✅ 200+ Integrationen'],
                  ['Self-Hosted', '✅ Vollständig möglich', '❌ SaaS-only'],
                  ['Splunk-Integration', '✅ Via Runbook', '✅ Native (gleiches Ökosystem)'],
                ] : [
                  ['Main function', 'Security runbooks + incident response', 'On-call management + alert routing'],
                  ['On-call scheduling', '⚠️ Via integration (PagerDuty, Opsgenie)', '✅ Core feature'],
                  ['Alert routing & escalation', '⚠️ Via webhook runbooks', '✅ Core feature with timeline'],
                  ['Executable security runbooks', '✅ 600+ runbooks', '❌ None'],
                  ['Automated incident response', '✅ Runbook-based', '⚠️ Manual playbooks only'],
                  ['Security score / dashboard', '✅ Live score', '❌ No security score'],
                  ['GDPR / EU data', '✅ EU-first, self-hosted possible', '⚠️ US-based (Splunk)'],
                  ['Price', '✅ From €0 (Explorer)', '⚠️ From $5/user/month'],
                  ['Compliance automation', '✅ SOC2, ISO27001, NIS2', '❌ None'],
                  ['Integrations', '✅ Webhooks, Slack, Teams', '✅ 200+ integrations'],
                  ['Self-hosted', '✅ Fully possible', '❌ SaaS-only'],
                  ['Splunk integration', '✅ Via runbook', '✅ Native (same ecosystem)'],
                ]).map(([criteria, moltbot, victorops], i) => (
                  <tr key={criteria} className={`border-b border-gray-700 ${i % 2 === 1 ? 'bg-gray-800/50' : ''}`}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-300">{criteria}</td>
                    <td className="px-6 py-3 text-center text-sm text-gray-300">{moltbot}</td>
                    <td className="px-6 py-3 text-center text-sm text-gray-300">{victorops}</td>
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
              <h3 className="font-bold text-green-300 mb-3">🤖 {isDE ? 'Moltbot ist die Wahl wenn...' : 'Moltbot is the choice when...'}</h3>
              <ul className="space-y-1.5 text-sm text-green-200">
                {(isDE ? [
                  'Security-fokussierte Incident-Response gebraucht wird',
                  'Executable Runbooks für Fixes und Playbooks gewünscht',
                  'Self-Hosting und DSGVO-Konformität zwingend',
                  'Compliance-Automation (SOC2, NIS2) nötig',
                  'Kein Splunk-Ökosystem im Einsatz',
                ] : [
                  'Security-focused incident response is needed',
                  'Executable runbooks for fixes and playbooks wanted',
                  'Self-hosting and GDPR compliance required',
                  'Compliance automation (SOC2, NIS2) needed',
                  'Not in the Splunk ecosystem',
                ]).map(item => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div className="bg-blue-900 border border-blue-700 p-5 rounded-lg">
              <h3 className="font-bold text-blue-300 mb-3">📟 {isDE ? 'VictorOps ist die Wahl wenn...' : 'VictorOps is the choice when...'}</h3>
              <ul className="space-y-1.5 text-sm text-blue-200">
                {(isDE ? [
                  'Splunk bereits im Einsatz ist (natives Ökosystem)',
                  'Fokus auf On-Call-Scheduling und Alert-Routing',
                  'Großes Ops-Team mit komplexen Eskalationsketten',
                  '200+ Integrationen out-of-the-box benötigt',
                  'Kein Self-Hosting nötig (SaaS bevorzugt)',
                ] : [
                  'Already using Splunk (native ecosystem)',
                  'Focus is on on-call scheduling and alert routing',
                  'Large ops team with complex escalation chains',
                  '200+ integrations out of the box needed',
                  'No self-hosting required (SaaS preferred)',
                ]).map(item => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? '🔗 Weiterführende Links' : '🔗 Further Resources'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${lang}/moltbot/incident-response-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">🚨 {isDE ? 'Incident Response' : 'Incident Response'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'IR + Playbooks Runbook' : 'IR + Playbooks Runbook'}</div>
            </a>
            <a href={`/${lang}/moltbot/security-automation-workflows`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">⚡ {isDE ? 'Security Automation' : 'Security Automation'}</div>
              <div className="text-sm text-gray-300">{isDE ? 'Webhooks & Automation' : 'Webhooks & Automation'}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
