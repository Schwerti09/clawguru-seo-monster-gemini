import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot vs OpsGenie: Incident Management Vergleich 2024',
    description: 'Moltbot vs OpsGenie im Vergleich. Security-fokussiertes Incident Management vs generisches Alerting. Executable Runbooks, Auto-Remediation und On-Call-Management im Vergleich.',
    keywords: ['moltbot vs opsgenie','opsgenie alternative','incident management security','on call management','alerting tools vergleich','moltbot incident response'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot vs OpsGenie Vergleich 2024', description: 'Moltbot vs OpsGenie Incident Management.', type: 'article', url: `https://clawguru.org/${lang}/moltbot-vs-opsgenie` },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot-vs-opsgenie`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/moltbot-vs-opsgenie`])) },
    robots: 'index, follow',
  };
}

export default function MoltbotVsOpsgeniePage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
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
            <div className="bg-orange-50 border border-orange-700 p-5 rounded-lg">
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
