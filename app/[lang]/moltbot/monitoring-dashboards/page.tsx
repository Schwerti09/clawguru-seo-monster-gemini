import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Monitoring & Security Dashboards: Grafana Setup 2024',
    description: 'Security Monitoring für Moltbot mit Grafana und Prometheus. Real-time Dashboards, Anomalie-Erkennung, SLA-Tracking und Security KPIs. Production-ready Monitoring Stack.',
    keywords: ['moltbot monitoring','grafana security dashboard','prometheus metrics','security kpi','anomaly detection','sla monitoring'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Monitoring & Security Dashboards: Grafana Setup 2024', description: 'Security Monitoring für Moltbot mit Grafana.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/monitoring-dashboards` },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot/monitoring-dashboards`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/moltbot/monitoring-dashboards`])) },
    robots: 'index, follow',
  };
}

export default function MoltbotMonitoringPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Monitoring dient der defensiven Überwachung eigener Systeme. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Monitoring &amp; Security Dashboards</h1>
        <p className="text-lg text-gray-300 mb-8">Real-time Security Visibility für Moltbot — Grafana Dashboards, Prometheus Metriken und automatisierte Anomalie-Erkennung.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📊 Security KPIs Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { kpi: 'Auth Failure Rate', target: '< 1%', current: '0.3%', status: 'green' },
              { kpi: 'API Error Rate', target: '< 0.5%', current: '0.1%', status: 'green' },
              { kpi: 'P99 Latency', target: '< 200ms', current: '145ms', status: 'green' },
              { kpi: 'Blocked IPs (24h)', target: '< 100', current: '23', status: 'green' },
              { kpi: 'Security Incidents', target: '0 P1/P2', current: '0', status: 'green' },
              { kpi: 'SSL Cert Expiry', target: '> 30 Tage', current: '87 Tage', status: 'green' },
            ].map(({ kpi, target, current, status }) => (
              <div key={kpi} className={`p-4 rounded-lg border ${status === 'green' ? 'bg-green-900 border-green-700' : status === 'yellow' ? 'bg-amber-900 border-yellow-700' : 'bg-red-900 border-red-700'}`}>
                <div className="font-semibold text-sm mb-1">{kpi}</div>
                <div className="text-2xl font-bold">{current}</div>
                <div className="text-xs text-gray-400">Ziel: {target}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📈 Prometheus Metriken für Moltbot</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`// moltbot/lib/metrics.ts
import { Counter, Histogram, Gauge, register } from 'prom-client';

export const metrics = {
  authRequests: new Counter({
    name: 'moltbot_auth_requests_total',
    help: 'Gesamte Auth-Anfragen',
    labelNames: ['method', 'status'],
  }),

  authLatency: new Histogram({
    name: 'moltbot_auth_duration_seconds',
    help: 'Auth-Anfrage Latenz',
    buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1.0],
  }),

  activeConnections: new Gauge({
    name: 'moltbot_active_connections',
    help: 'Aktive WebSocket/HTTP Verbindungen',
  }),

  blockedRequests: new Counter({
    name: 'moltbot_blocked_requests_total',
    help: 'Geblockte Requests',
    labelNames: ['reason'],  // 'rate_limit', 'ip_block', 'auth_fail'
  }),

  threatScore: new Histogram({
    name: 'moltbot_threat_score',
    help: 'Bedrohungs-Score pro Request',
    buckets: [10, 20, 40, 60, 80, 90, 100],
  }),
};

// /api/metrics Endpoint (Prometheus scrape target)
export async function GET() {
  return new Response(await register.metrics(), {
    headers: { 'Content-Type': register.contentType },
  });
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">Live Metrics</div></a>
            <a href="/neuro" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🧠 Neuro AI</div><div className="text-sm text-gray-300">AI Anomalie-Erkennung</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 Monitoring Runbooks</div><div className="text-sm text-gray-300">Dashboard Guides</div></a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔮 Oracle</div><div className="text-sm text-gray-300">Threat Intelligence</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
