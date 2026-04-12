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
    title: 'Moltbot vs Splunk SIEM 2025: Security Automation Comparison',
    description: 'Moltbot vs Splunk: Executable Runbooks vs. enterprise SIEM. Compare cost, self-hosting, alert fatigue, and compliance automation for your security stack.',
    keywords: ['moltbot vs splunk','splunk alternative','siem comparison','security automation','executable runbooks','splunk cost','self-hosted siem'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      title: 'Moltbot vs Splunk SIEM 2025: Security Automation Comparison',
      description: 'Executable Runbooks vs. enterprise SIEM — cost, self-hosting, alert fatigue, compliance.',
      type: 'article',
      url: `${SITE_URL}/${lang}/moltbot-vs-splunk`,
      images: ['/og-compare-moltbot-splunk.jpg'],
    },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot-vs-splunk'),
    robots: 'index, follow',
  }
}

export default function MoltbotVsSplunkPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound()

  const rows = [
    { feature: 'Deployment', moltbot: 'Self-hosted / cloud', splunk: 'Cloud-first (Splunk Cloud) or on-prem' },
    { feature: 'Pricing model', moltbot: 'Flat SaaS or self-hosted OSS', splunk: 'Data-ingestion GB/day — $150–$200+ per GB' },
    { feature: 'Alert fatigue', moltbot: 'Runbook-driven triage + auto-remediation', splunk: 'High — requires tuning + correlation rules' },
    { feature: 'Executable Runbooks', moltbot: '600+ built-in playbooks, one-click fix', splunk: 'SOAR add-on required (Splunk SOAR = extra cost)' },
    { feature: 'Compliance dashboard', moltbot: 'NIS2, SOC2, GDPR built-in', splunk: 'Compliance add-ons, manual configuration' },
    { feature: 'GDPR / data residency', moltbot: 'Full self-hosting, EU data stays local', splunk: 'Cloud = US servers by default' },
    { feature: 'Setup time', moltbot: '< 30 min to first security score', splunk: 'Days to weeks (indexers, forwarders, dashboards)' },
    { feature: 'Log search & SIEM', moltbot: 'Focused on actionable security checks', splunk: 'Full SIEM, powerful SPL query language' },
    { feature: 'AI / ML threat detection', moltbot: 'Neuro AI anomaly engine built-in', splunk: 'Machine Learning Toolkit (MLTK), extra license' },
    { feature: 'Open source', moltbot: 'OpenClaw core is OSS', splunk: 'Proprietary (Splunk Enterprise)' },
  ]

  const whenMoltbot = [
    'You want executable, auto-remediating security without a dedicated SIEM team',
    'Budget matters — Splunk ingestion costs can reach $100k+/year at scale',
    'GDPR compliance requires data to stay on EU infrastructure',
    'You run Moltbot AI agents or OpenClaw self-hosted infrastructure',
    'You need sub-30-minute setup and actionable runbooks immediately',
  ]

  const whenSplunk = [
    'You have a mature SOC team that actively queries logs with SPL',
    'You need full SIEM capabilities across 100+ heterogeneous data sources',
    'Enterprise-grade log retention and forensic investigation is required',
    'You already have Splunk Enterprise licenses and want to consolidate tooling',
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This comparison is for hardening your own infrastructure. No attack tools, no illegal activities.
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot vs Splunk SIEM 2025</h1>
        <p className="text-lg text-gray-300 mb-8">
          Splunk is the gold standard enterprise SIEM. Moltbot is the executable-runbook platform built for teams who want actionable security without a six-figure log bill. Here's the honest comparison.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Direct Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase">Moltbot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Splunk</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? 'bg-gray-800/50' : ''}`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-300">{r.feature}</td>
                    <td className="px-6 py-4 text-sm text-cyan-300">{r.moltbot}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{r.splunk}</td>
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
              <h3 className="font-bold text-blue-300 mb-3">Choose Splunk if…</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                {whenSplunk.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">The Cost Problem with Splunk</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-300 mb-4">
              Splunk's ingestion-based pricing means costs scale with data volume, not team size. A typical mid-size company ingesting 50 GB/day pays <strong className="text-yellow-300">$7,500–$10,000/month</strong>. Moltbot's flat-rate model makes security budgeting predictable.
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <pre>{`# Splunk cost estimate
daily_ingestion_gb=50
price_per_gb=200
monthly_cost = 50 * 200 * 30  # = $300,000/year

# Moltbot
monthly_cost = flat_rate  # predictable, no per-GB surprises`}</pre>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Can Moltbot + Splunk Coexist?</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-300 mb-3">Yes — many teams use Splunk for long-term log archival and forensic investigation while using Moltbot for day-to-day actionable security checks, runbook execution, and compliance scoring. Moltbot's webhook output can feed into Splunk HEC (HTTP Event Collector).</p>
            <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm">
              <pre>{`# Send Moltbot findings to Splunk HEC
curl -k https://splunk:8088/services/collector \
  -H "Authorization: Splunk <HEC_TOKEN>" \
  -d '{"event": {"source": "moltbot", "severity": "HIGH", "finding": "CVE-2024-1234"}}'`}</pre>
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
            <a href={`/${lang}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">600+ executable security playbooks</div>
            </a>
            <a href={`/${lang}/moltbot-vs-victorops`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs VictorOps</div>
              <div className="text-sm text-gray-300">On-call management comparison</div>
            </a>
            <a href={`/${lang}/moltbot-vs-pagerduty`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs PagerDuty</div>
              <div className="text-sm text-gray-300">Incident response comparison</div>
            </a>
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Is Moltbot a Splunk replacement?", acceptedAnswer: { "@type": "Answer", text: "Moltbot focuses on executable runbooks and actionable security checks, not full SIEM log aggregation. It can complement Splunk or replace it for teams that prioritize remediation over raw log search." } },
              { "@type": "Question", name: "How much does Splunk cost vs Moltbot?", acceptedAnswer: { "@type": "Answer", text: "Splunk charges ~$150-200 per GB/day ingested. A team ingesting 50 GB/day can pay $300,000+/year. Moltbot uses flat-rate pricing with no per-GB surprises." } },
              { "@type": "Question", name: "Can Moltbot send data to Splunk?", acceptedAnswer: { "@type": "Answer", text: "Yes. Moltbot supports webhook output that can feed Splunk's HTTP Event Collector (HEC), enabling hybrid architectures." } },
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Moltbot vs Splunk SIEM 2025",
            description: "Executable Runbooks vs. enterprise SIEM — cost, self-hosting, alert fatigue, compliance automation.",
            url: "https://clawguru.org/de/moltbot-vs-splunk"
          }
        ]) }} />
      </div>
    </div>
  )
}
