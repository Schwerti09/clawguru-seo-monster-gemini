import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

const SITE_URL = 'https://clawguru.org'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params
  return {
    title: 'Moltbot vs Grafana 2025: Security Automation vs Observability',
    description: 'Moltbot vs Grafana: Executable security runbooks vs metrics dashboards. Compare self-hosting, alerting, compliance automation, and incident response for your stack.',
    keywords: ['moltbot vs grafana','grafana alternative','security automation','observability','executable runbooks','grafana alerting','self-hosted monitoring'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      title: 'Moltbot vs Grafana 2025: Security Automation vs Observability',
      description: 'Executable Runbooks vs. dashboards-and-alerts — when each tool wins for self-hosted security teams.',
      type: 'article',
      url: `${SITE_URL}/${lang}/moltbot-vs-grafana`,
      images: ['/og-compare-moltbot-grafana.jpg'],
    },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot-vs-grafana'),
    robots: 'index, follow',
  }
}

export default function MoltbotVsGrafanaPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound()

  const rows = [
    { feature: 'Primary purpose', moltbot: 'Security automation + runbook execution', grafana: 'Metrics visualisation + alerting dashboards' },
    { feature: 'Deployment', moltbot: 'Self-hosted / cloud SaaS', grafana: 'Self-hosted (OSS) or Grafana Cloud' },
    { feature: 'Pricing', moltbot: 'Flat-rate SaaS or self-hosted OSS', grafana: 'OSS free; Grafana Cloud from $0 (limited) to $299+/mo' },
    { feature: 'Security runbooks', moltbot: '600+ executable playbooks, one-click remediation', grafana: 'None — alerting only, no remediation' },
    { feature: 'CVE / vulnerability data', moltbot: 'Live CVE feed + Stack MRI scoring', grafana: 'No native CVE awareness' },
    { feature: 'Compliance dashboard', moltbot: 'NIS2, SOC2, GDPR built-in', grafana: 'Custom dashboards only, no compliance templates' },
    { feature: 'Incident response', moltbot: 'Auto-runbook trigger on alert + full audit trail', grafana: 'Alert routing via Alertmanager or Grafana OnCall' },
    { feature: 'GDPR / data residency', moltbot: 'Full self-hosting, EU data stays local', grafana: 'Grafana Cloud uses US regions by default' },
    { feature: 'Log analysis', moltbot: 'Security-focused log triage', grafana: 'Loki for full log aggregation + search' },
    { feature: 'Setup time', moltbot: '< 30 min to first security score', grafana: 'Hours to days (datasource config, dashboard building)' },
  ]

  const whenMoltbot = [
    'You need actionable security outcomes, not just visibility',
    'Your team runs Moltbot AI agents or OpenClaw self-hosted infra',
    'Compliance (NIS2/SOC2/GDPR) is a primary concern',
    'You want one-click CVE remediation, not manual alert triage',
    'Budget is tight — no per-node or per-seat surprise costs',
  ]

  const whenGrafana = [
    'You need rich time-series dashboards for infrastructure metrics',
    'You already run Prometheus and want to visualise the data',
    'Your team needs full-stack observability (metrics + logs + traces)',
    'You want flexible, community-driven dashboard templates (Grafana.com/dashboards)',
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This comparison is for hardening your own infrastructure. No attack tools, no illegal activities.
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot vs Grafana 2025</h1>
        <p className="text-lg text-gray-300 mb-8">
          Grafana is the world's most popular observability platform. Moltbot is the executable-runbook engine for security teams who need remediation, not just dashboards. They're often complementary — but here's where each one wins.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Direct Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase">Moltbot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Grafana</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? 'bg-gray-800/50' : ''}`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-300">{r.feature}</td>
                    <td className="px-6 py-4 text-sm text-cyan-300">{r.moltbot}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{r.grafana}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Which Tool When?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-900 p-5 rounded-lg border border-green-700">
              <h3 className="font-bold text-green-300 mb-3">Choose Moltbot if…</h3>
              <ul className="space-y-2 text-sm text-green-200">
                {whenMoltbot.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
            </div>
            <div className="bg-blue-900 p-5 rounded-lg border border-blue-700">
              <h3 className="font-bold text-blue-300 mb-3">Choose Grafana if…</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                {whenGrafana.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">The Integration Sweet Spot</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-300 mb-4">
              Most mature security teams run <strong className="text-cyan-300">both</strong>: Grafana for infrastructure visibility, Moltbot for security action. Moltbot can push security findings to Grafana via the Prometheus metrics endpoint or webhooks, creating a unified view.
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`# Expose Moltbot security score as Prometheus metric
# moltbot_security_score{host="web-01"} 73
# Then visualise in Grafana with threshold alerting

scrape_configs:
  - job_name: 'moltbot'
    static_configs:
      - targets: ['moltbot:9090']`}</pre>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Alerting: Grafana vs Moltbot</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-300 mb-3">
              Grafana alerts on metrics thresholds — CPU, memory, latency. Moltbot alerts on <strong className="text-yellow-300">security posture changes</strong>: new CVEs affecting your stack, failed compliance checks, or anomalous access patterns. The two alert types are complementary.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
                <h4 className="font-semibold text-yellow-300 mb-2">Grafana alerts on:</h4>
                <ul className="text-sm text-yellow-200 space-y-1">
                  <li>• CPU &gt; 90% for 5 min</li>
                  <li>• Disk I/O spike</li>
                  <li>• HTTP 5xx rate increase</li>
                  <li>• Memory pressure</li>
                </ul>
              </div>
              <div className="bg-red-900 p-4 rounded-lg border border-red-700">
                <h4 className="font-semibold text-red-300 mb-2">Moltbot alerts on:</h4>
                <ul className="text-sm text-red-200 space-y-1">
                  <li>• New CRITICAL CVE in your stack</li>
                  <li>• Compliance score drop</li>
                  <li>• Misconfigured TLS/headers</li>
                  <li>• Exposed admin endpoints</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${lang}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">Live security score in 30 seconds</div>
            </a>
            <a href={`/${lang}/neuro`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Stack MRI</div>
              <div className="text-sm text-gray-300">CVE scan + predictive threat correlation</div>
            </a>
            <a href={`/${lang}/moltbot-vs-splunk`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs Splunk</div>
              <div className="text-sm text-gray-300">Security automation vs enterprise SIEM</div>
            </a>
            <a href={`/${lang}/moltbot-vs-victorops`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs VictorOps</div>
              <div className="text-sm text-gray-300">Incident response comparison</div>
            </a>
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Kann Moltbot Grafana ersetzen?", acceptedAnswer: { "@type": "Answer", text: "Nicht vollständig — Grafana ist führend bei Metriken-Visualisierung und Log-Aggregation. Moltbot ergänzt Grafana durch Security-Automation und Executable Runbooks, die bei einem Alert automatisch ausgelöst werden können." } },
            { "@type": "Question", name: "Wie integriere ich Moltbot mit Grafana?", acceptedAnswer: { "@type": "Answer", text: "Moltbot kann Security-Scores als Prometheus-Metriken exponieren, die Grafana dann visualisiert. Alternativ können Moltbot-Webhooks Grafana-Annotations auslösen, um Security-Events in Dashboards sichtbar zu machen." } },
            { "@type": "Question", name: "Was kostet Grafana vs Moltbot?", acceptedAnswer: { "@type": "Answer", text: "Grafana OSS ist kostenlos, Grafana Cloud startet gratis mit limitierten Ressourcen und skaliert bei $299+/Monat. Moltbot nutzt Flatrate-Preise für SaaS oder ist als self-hosted OSS kostenlos nutzbar." } },
            { "@type": "Question", name: "Warum brauche ich Moltbot wenn ich Grafana habe?", acceptedAnswer: { "@type": "Answer", text: "Grafana zeigt was passiert. Moltbot behebt es. Mit 600+ Executable Runbooks löst Moltbot Security-Probleme automatisch aus — Grafana kann den Alert triggern, Moltbot führt die Remediation durch." } },
          ]
        }) }} />
      </div>
    </div>
  )
}
