import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Enterprise SIEM Integration mit ClawGuru: Splunk & Datadog 2024',
    description: 'SIEM Integration für Enterprise mit ClawGuru. Splunk, Datadog, Elastic Stack und Microsoft Sentinel Anbindung. Log Aggregation, Korrelationsregeln und SOC-Ready Dashboards.',
    keywords: ['enterprise siem integration','splunk security','datadog siem','elastic security','microsoft sentinel','soc security operations'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Enterprise SIEM Integration mit ClawGuru 2024', description: 'SIEM für Enterprise mit ClawGuru.', type: 'article', url: `https://clawguru.org/${lang}/solutions/enterprise-siem-integration` },
    alternates: buildLocalizedAlternates(lang as Locale, '/solutions/enterprise-siem-integration'),
    robots: 'index, follow',
  };
}

export default function EnterpriseSiemPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 border-l-4 border-gray-400 p-4 mb-8 text-sm">
          <strong>Enterprise SOC</strong>: ClawGuru integriert nahtlos in bestehende SIEM-Umgebungen und liefert strukturierte Security-Events für Korrelation und Alerting.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Enterprise SIEM Integration</h1>
        <p className="text-lg text-gray-300 mb-8">ClawGuru als Security Event Source für deinen SOC — strukturierte JSON-Events für Splunk, Datadog, Elastic und Sentinel.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔌 SIEM Integrationen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { siem: 'Splunk Enterprise', method: 'HTTP Event Collector (HEC)', format: 'JSON', status: 'GA' },
              { siem: 'Datadog', method: 'Logs API / Agent', format: 'JSON', status: 'GA' },
              { siem: 'Elastic/Kibana', method: 'Beats / Logstash', format: 'ECS JSON', status: 'GA' },
              { siem: 'Microsoft Sentinel', method: 'Log Analytics API', format: 'JSON', status: 'GA' },
              { siem: 'IBM QRadar', method: 'Syslog CEF', format: 'CEF', status: 'Beta' },
              { siem: 'Sumo Logic', method: 'HTTP Source', format: 'JSON', status: 'GA' },
            ].map(({ siem, method, format, status }) => (
              <div key={siem} className="bg-gray-800 p-4 rounded-lg border border-gray-700 border">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-sm">{siem}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status === 'GA' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{status}</span>
                </div>
                <div className="text-xs text-gray-400">{method}</div>
                <div className="text-xs text-gray-400 mt-1">Format: {format}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📊 SIEM Event Schema</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`// ClawGuru Security Event (JSON Schema)
{
  "event_id": "evt_01JQ...",
  "timestamp": "2024-04-07T14:30:00Z",
  "source": "clawguru",
  "severity": "HIGH",  // CRITICAL, HIGH, MEDIUM, LOW, INFO
  "event_type": "security.threat_detected",
  "customer_id": "cust_123",
  "actor": { "type": "ip", "value": "192.168.1.100" },
  "target": { "type": "api_endpoint", "value": "/api/auth/login" },
  "action": "brute_force_attempt",
  "outcome": "blocked",
  "threat_score": 85,
  "geo": { "country": "DE", "city": "Berlin" },
  "details": {
    "attempts": 47,
    "timeframe_minutes": 5,
    "blocked": true,
    "block_duration_seconds": 3600
  }
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 ClawGuru Enterprise</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">SOC Assessment</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 SIEM Runbooks</div><div className="text-sm text-gray-300">Integration Guides</div></a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔮 Oracle</div><div className="text-sm text-gray-300">Threat Intelligence Feed</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise</div><div className="text-sm text-gray-300">Managed SOC</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
