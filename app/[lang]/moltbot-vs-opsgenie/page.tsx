import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot vs OpsGenie: Incident Management Vergleich 2024',
    description: 'Moltbot vs OpsGenie im Vergleich. Security-fokussiertes Incident Management vs generisches Alerting. Executable Runbooks, Auto-Remediation und On-Call-Management im Vergleich.',
    keywords: ['moltbot vs opsgenie','opsgenie alternative','incident management security','on call management','alerting tools vergleich','moltbot incident response'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'Moltbot vs OpsGenie Vergleich 2024', description: 'Moltbot vs OpsGenie Incident Management.', type: 'article', url: `https://clawguru.org/${lang}/moltbot-vs-opsgenie` },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot-vs-opsgenie'),
    robots: 'index, follow',
  };
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Was ist der Unterschied zwischen Moltbot und OpsGenie?', acceptedAnswer: { '@type': 'Answer', text: 'OpsGenie (Atlassian) ist ein generisches On-Call-Management-Tool für alle Alert-Typen. Moltbot ist Security-First mit Auto-Remediation, Executable Runbooks und CVE-Alerts — speziell für Security-Incident-Response optimiert.' } },
    { '@type': 'Question', name: 'Kann Moltbot Self-Hosted betrieben werden?', acceptedAnswer: { '@type': 'Answer', text: 'Ja. Moltbot ist vollständig self-hosted betreibbar, DSGVO-konform und ohne Cloud-Abhängigkeit. OpsGenie ist ein reines Cloud-SaaS-Produkt von Atlassian ohne Self-Hosting-Option.' } },
    { '@type': 'Question', name: 'Was ist Auto-Remediation bei Moltbot?', acceptedAnswer: { '@type': 'Answer', text: 'Auto-Remediation bedeutet, dass Moltbot bei Security-Incidents automatisch Gegenmaßnahmen einleitet: IP-Blocking, Rate-Limiting, Service-Isolation oder Benachrichtigungen — ohne manuellen Eingriff.' } },
    { '@type': 'Question', name: 'Wie unterscheiden sich die Preise von Moltbot und OpsGenie?', acceptedAnswer: { '@type': 'Answer', text: 'Moltbot startet bei €0 (Explorer-Plan). OpsGenie kostet ab $9 pro User pro Monat und skaliert mit Teamgröße. Für Security-Teams mit Self-Hosting-Anforderung ist Moltbot deutlich kostengünstiger.' } },
  ],
}

export default function MoltbotVsOpsgeniePage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong>Vergleichsseite</strong>: Moltbot ist Security-spezifisch. OpsGenie ist generisches Alerting. Beide lösen Incident Management — unterschiedlich.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot vs OpsGenie</h1>
        <p className="text-lg text-gray-300 mb-8">OpsGenie ist ein generisches On-Call-Management-Tool (Atlassian). Moltbot ist Security-First Incident Response mit Auto-Remediation und Executable Playbooks.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">⚔️ Direkter Vergleich</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Feature</th><th className="p-3 text-center">🤖 Moltbot</th><th className="p-3 text-center">🔔 OpsGenie</th></tr></thead>
              <tbody>
                {[
                  ['Security-Fokus', '✅ Kern-Feature', '⚠️ Generic Alerting'],
                  ['Auto-Remediation', '✅ IP-Block, Rate-Limit', '❌ Nur Notifications'],
                  ['Executable Playbooks', '✅ Voll automatisierbar', '⚠️ Nur Checklisten'],
                  ['On-Call Management', '⚠️ Basis', '✅ Spezialist'],
                  ['Alert Routing', '✅ Security-aware', '✅ Flexibel'],
                  ['Slack/Teams Integration', '✅ Ja', '✅ Ja'],
                  ['PagerDuty-ähnlich', '⚠️ Security-spezifisch', '✅ Vollständig'],
                  ['Self-Hosted', '✅ Vollständig', '❌ Cloud-only (Atlassian)'],
                  ['Security CVE Alerts', '✅ Integriert', '❌ Nicht nativ'],
                  ['Preis', 'Ab €0', 'Ab $9/User/Mo'],
                ].map(([feature, moltbot, opsgen]) => (
                  <tr key={feature} className="border-b hover:bg-gray-800">
                    <td className="p-3">{feature}</td>
                    <td className="p-3 text-center">{moltbot}</td>
                    <td className="p-3 text-center">{opsgen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🏆 Entscheidungshilfe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900 border border-green-700 p-5 rounded-lg">
              <h3 className="font-bold text-green-300 mb-2">🤖 Moltbot wenn...</h3>
              <ul className="space-y-1 text-sm text-green-200">
                <li>• Security Incidents automatisch behandeln</li>
                <li>• Auto-Remediation (kein manuelles Eingreifen)</li>
                <li>• Self-Hosted / DSGVO-konform nötig</li>
                <li>• CVE-Alerts nativ integrieren</li>
              </ul>
            </div>
            <div className="bg-orange-900 border border-orange-700 p-5 rounded-lg">
              <h3 className="font-bold text-orange-300 mb-2">🔔 OpsGenie wenn...</h3>
              <ul className="space-y-1 text-sm text-orange-200">
                <li>• On-Call Schedules und Rotationen</li>
                <li>• Generisches Alerting aller Services</li>
                <li>• Atlassian-Stack Integration</li>
                <li>• Große Teams mit komplexem Routing</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">Moltbot testen</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 IR Runbooks</div><div className="text-sm text-gray-300">Incident Playbooks</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
