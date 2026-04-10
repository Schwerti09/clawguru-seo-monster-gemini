import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Incident Response: Automatisierung & Playbooks 2024',
    description: 'Automatisierte Incident Response für Moltbot. Security Playbooks, Auto-Remediation, PagerDuty-Integration und Post-Mortem-Prozesse. Reaktionszeit von Stunden auf Minuten reduzieren.',
    keywords: ['moltbot incident response','security automation','playbooks','auto remediation','pagerduty integration','security incidents'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Incident Response: Automatisierung & Playbooks 2024', description: 'Automatisierte Incident Response für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/incident-response-automation` },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/incident-response-automation'),
    robots: 'index, follow',
  };
}

export default function MoltbotIncidentResponsePage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Dieser Guide dient der Absicherung und schnellen Reaktion auf Sicherheitsvorfälle. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Incident Response: Automatisierung &amp; Playbooks</h1>
        <p className="text-lg text-gray-300 mb-8">Reduziere die Reaktionszeit auf Security-Incidents von Stunden auf Minuten — mit automatisierten Playbooks, Auto-Remediation und integrierten Alerting-Systemen.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🚨 Incident Severity Matrix</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-3 text-left">Severity</th>
                  <th className="p-3 text-left">Beispiel</th>
                  <th className="p-3 text-left">Response Zeit</th>
                  <th className="p-3 text-left">Auto-Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['P1 Critical', 'Data Breach / RCE', '< 15 Min', 'Auto-Block + Alert CEO'],
                  ['P2 High', 'Auth Bypass Versuch', '< 1 Std', 'IP-Block + Alert Security'],
                  ['P3 Medium', 'Brute Force Attack', '< 4 Std', 'Rate Limit + Log'],
                  ['P4 Low', 'Anomale Log-Aktivität', '< 24 Std', 'Log + Weekly Report'],
                ].map(([sev, ex, rt, action]) => (
                  <tr key={sev} className="border-b hover:bg-gray-800">
                    <td className={`p-3 font-bold ${sev.includes('P1') ? 'text-red-400' : sev.includes('P2') ? 'text-orange-400' : sev.includes('P3') ? 'text-yellow-400' : 'text-green-400'}`}>{sev}</td>
                    <td className="p-3">{ex}</td>
                    <td className="p-3 font-mono text-sm">{rt}</td>
                    <td className="p-3 text-sm">{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">⚡ Auto-Remediation Engine</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`// moltbot/lib/auto-remediation.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! });

type IncidentType = 'brute_force' | 'injection_attempt' | 'data_exfiltration' | 'privilege_escalation';

const REMEDIATION_PLAYBOOKS: Record<IncidentType, (ip: string) => Promise<void>> = {
  brute_force: async (ip) => {
    await redis.setex(\`block:\${ip}\`, 3600, '1');          // 1h Block
    await redis.setex(\`rate_strict:\${ip}\`, 7200, '1');    // 2h Strict Rate Limit
  },
  injection_attempt: async (ip) => {
    await redis.setex(\`block:\${ip}\`, 86400, '1');         // 24h Block
    await notifySlack('injection_attempt', ip, 'P2');
  },
  data_exfiltration: async (ip) => {
    await redis.setex(\`block:\${ip}\`, -1, '1');            // Permanent Block
    await notifySlack('data_exfiltration', ip, 'P1');
    await notifyPagerDuty('data_exfiltration', ip);
  },
  privilege_escalation: async (ip) => {
    await redis.setex(\`block:\${ip}\`, -1, '1');
    await notifyPagerDuty('privilege_escalation', ip);
    await triggerKubernetesIsolation(ip);
  },
};

export async function executePlaybook(type: IncidentType, ip: string) {
  const playbook = REMEDIATION_PLAYBOOKS[type];
  await playbook(ip);
  await redis.lpush('incident_log', JSON.stringify({ type, ip, ts: Date.now(), action: 'auto_remediated' }));
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📋 Post-Mortem Template</h2>
          <div className="bg-gray-800 border rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                ['Incident ID', 'INC-2024-XXXX'],
                ['Severity', 'P1 / P2 / P3'],
                ['Detection Time', 'YYYY-MM-DD HH:MM UTC'],
                ['Resolution Time', 'YYYY-MM-DD HH:MM UTC'],
                ['Total Downtime', 'X Minuten'],
                ['Affected Users', 'X Kunden'],
                ['Root Cause', 'Kurze Beschreibung'],
                ['Contributing Factors', 'Factor 1, Factor 2'],
                ['Immediate Actions', 'Was wurde sofort getan?'],
                ['Long-term Fix', 'Was verhindert Wiederholung?'],
              ].map(([key, val]) => (
                <div key={key}>
                  <div className="font-semibold text-gray-200">{key}</div>
                  <div className="text-gray-400 font-mono text-xs">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">Live Incident Detection</div></a>
            <a href="/neuro" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🧠 Neuro AI</div><div className="text-sm text-gray-300">AI Threat Detection</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 IR Runbooks</div><div className="text-sm text-gray-300">Response Playbooks</div></a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔮 Oracle</div><div className="text-sm text-gray-300">Threat Intelligence</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
