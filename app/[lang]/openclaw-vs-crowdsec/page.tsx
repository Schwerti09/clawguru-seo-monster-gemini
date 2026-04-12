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
    title: 'OpenClaw vs CrowdSec 2025: Self-Hosted IDS Comparison',
    description: 'OpenClaw vs CrowdSec: collaborative threat intelligence vs. runbook-driven hardening. Compare IP reputation, blocklist sharing, GDPR compliance and remediation for self-hosted stacks.',
    keywords: ['openclaw vs crowdsec','crowdsec alternative','self-hosted ids','collaborative threat intelligence','ip blocklist','intrusion detection','security hardening'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      title: 'OpenClaw vs CrowdSec 2025: Self-Hosted IDS Comparison',
      description: 'Collaborative threat intelligence vs. runbook-driven hardening — find the right fit for your stack.',
      type: 'article',
      url: `${SITE_URL}/${lang}/openclaw-vs-crowdsec`,
      images: ['/og-compare-openclaw-crowdsec.jpg'],
    },
    alternates: buildLocalizedAlternates(lang as Locale, '/openclaw-vs-crowdsec'),
    robots: 'index, follow',
  }
}

export default function OpenClawVsCrowdSecPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound()

  const rows = [
    { feature: 'Primary function', openclaw: 'Runbook-driven hardening + compliance scoring', crowdsec: 'Collaborative IPS/IDS + IP reputation sharing' },
    { feature: 'Threat intelligence', openclaw: 'CVE feed, Neuro AI anomaly detection', crowdsec: 'Crowdsourced IP blocklists from 250k+ instances' },
    { feature: 'Remediation', openclaw: '600+ executable runbooks, one-click fix', crowdsec: 'Bouncers (nginx, firewall, Cloudflare) block IPs' },
    { feature: 'Deployment', openclaw: 'Self-hosted or SaaS, Docker/K8s native', crowdsec: 'Self-hosted agent + cloud CTI hub' },
    { feature: 'GDPR compliance', openclaw: 'Full data residency control, EU-first', crowdsec: 'CTI hub is cloud; local agent data stays on-prem' },
    { feature: 'Compliance dashboard', openclaw: 'NIS2, SOC2, GDPR built-in', crowdsec: 'No built-in compliance reporting' },
    { feature: 'False positive rate', openclaw: 'Focused checks, near-zero noise', crowdsec: 'Low (crowdsourced validation), but IP bans can be wrong' },
    { feature: 'Log/event parsing', openclaw: 'Security-check focused', crowdsec: 'Parses syslog, nginx, SSH, custom parsers via YAML' },
    { feature: 'Open source', openclaw: 'OpenClaw core is OSS (MIT)', crowdsec: 'CrowdSec engine OSS, CTI hub freemium' },
    { feature: 'Integrations', openclaw: 'Webhook, Slack, PagerDuty, Moltbot', crowdsec: 'nginx/Apache/Traefik bouncers, Cloudflare, HAProxy' },
  ]

  const whenOpenClaw = [
    'You want executable, auto-remediating runbooks beyond IP blocking',
    'Compliance reporting (NIS2, SOC2, GDPR) is a primary requirement',
    'You run Moltbot AI agents and need unified security automation',
    'You need a security score dashboard with pass/fail checks per service',
    'Your team prioritises hardening over reactive IP banning',
  ]

  const whenCrowdSec = [
    'You want crowdsourced, community-validated IP threat intelligence',
    'You need real-time IP blocking at the network/reverse-proxy layer',
    'Your attack surface is primarily brute-force and scanning traffic',
    'You already use nginx/Traefik/Cloudflare and want native bouncers',
    'You want a free, lightweight IDS with minimal configuration',
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This comparison is for hardening your own infrastructure. No attack tools, no illegal activities.
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw vs CrowdSec 2025</h1>
        <p className="text-lg text-gray-300 mb-8">
          CrowdSec excels at collaborative IP blocking via crowdsourced threat intel. OpenClaw goes further — executable runbooks, compliance scoring, and full remediation automation. Here's where each wins.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Direct Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase">OpenClaw</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">CrowdSec</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? 'bg-gray-800/50' : ''}`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-300">{r.feature}</td>
                    <td className="px-6 py-4 text-sm text-cyan-300">{r.openclaw}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{r.crowdsec}</td>
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
              <h3 className="font-bold text-green-300 mb-3">Choose OpenClaw if…</h3>
              <ul className="space-y-2 text-sm text-green-200">
                {whenOpenClaw.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
            </div>
            <div className="bg-blue-900 p-5 rounded-lg border border-blue-700">
              <h3 className="font-bold text-blue-300 mb-3">Choose CrowdSec if…</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                {whenCrowdSec.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Running Both Together</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-300 mb-4">
              OpenClaw + CrowdSec is a powerful combination: CrowdSec handles reactive IP blocking at the network edge while OpenClaw automates hardening, compliance checks, and runbook-driven remediation. Install CrowdSec's bouncer on nginx, then point OpenClaw's WAF runbook at your CrowdSec metrics endpoint.
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <pre>{`# Install CrowdSec + nginx bouncer
curl -s https://install.crowdsec.net | sudo bash
sudo apt install crowdsec-nginx-bouncer

# OpenClaw runbook: check CrowdSec decision count
curl http://localhost:8080/v1/decisions/stream \
  -H "X-Api-Key: $CROWDSEC_API_KEY" | jq '.new | length'
# Feed result into OpenClaw security score`}</pre>
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
            <a href={`/${lang}/openclaw-vs-wazuh`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw vs Wazuh</div>
              <div className="text-sm text-gray-300">HIDS & SIEM comparison</div>
            </a>
            <a href={`/${lang}/openclaw-vs-ossec`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw vs OSSEC</div>
              <div className="text-sm text-gray-300">Host-based IDS comparison</div>
            </a>
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Is CrowdSec free?", acceptedAnswer: { "@type": "Answer", text: "CrowdSec's core engine is open source and free. The CTI hub (community blocklists) is freemium — free for community use, paid for commercial threat intel feeds." } },
              { "@type": "Question", name: "Does OpenClaw replace CrowdSec?", acceptedAnswer: { "@type": "Answer", text: "No — they complement each other. CrowdSec handles reactive IP blocking via crowdsourced threat intel. OpenClaw handles proactive hardening, compliance scoring, and executable runbook remediation." } },
              { "@type": "Question", name: "Can OpenClaw and CrowdSec run on the same server?", acceptedAnswer: { "@type": "Answer", text: "Yes. CrowdSec installs as a lightweight agent alongside your services. OpenClaw runs as a separate security check layer. They share no port conflicts and can exchange data via OpenClaw's webhook integration." } },
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "OpenClaw vs CrowdSec 2025",
            description: "Collaborative threat intelligence vs. runbook-driven hardening for self-hosted stacks.",
            url: "https://clawguru.org/de/openclaw-vs-crowdsec"
          }
        ]) }} />
      </div>
    </div>
  )
}
