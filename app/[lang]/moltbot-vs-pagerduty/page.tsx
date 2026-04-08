import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot-vs-pagerduty"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "Moltbot vs PagerDuty: Incident Response Comparison 2026"
  const description = "Complete comparison between Moltbot and PagerDuty for incident response, alert management, and DevOps automation. Features, pricing, and deployment analysis."
  return {
    title,
    description,
    keywords: ["moltbot vs pagerduty", "incident response", "alert management", "devops automation", "incident management"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: ["/og-image.png"],
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function MoltbotVsPagerdutyPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This comparison is for security architecture decisions. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">Moltbot vs PagerDuty: Incident Response Comparison</h1>
        <p className="text-lg text-gray-600 mb-8">Comprehensive incident response platform comparison for alert management, DevOps automation, and security incident handling.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Quick Comparison Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-bold text-purple-800 mb-4">Moltbot</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  AI-powered incident response
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Self-hosted deployment
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Security-focused automation
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  600+ executable runbooks
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  No vendor lock-in
                </li>
              </ul>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-bold text-red-800 mb-4">PagerDuty</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Industry standard for incident management
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  24/7 operations support
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Enterprise-grade reliability
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Comprehensive integrations
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Advanced analytics & reporting
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moltbot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PagerDuty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Incident Management</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">AI-powered triage & response</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Industry-standard incident workflow</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Alert Management</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Smart alert correlation</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Advanced alert grouping</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Automation</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">600+ executable runbooks</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Limited automation capabilities</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Deployment</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Self-hosted, on-prem, cloud</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Cloud-only (SaaS)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Security Focus</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Security incident specialization</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">General incident management</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AI/ML Capabilities</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Advanced AI automation</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Basic ML features</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pricing Model</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Perpetual license + support</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Per-user subscription</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Use Case Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Choose Moltbot if:</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">-</span>
                  Security incident response is priority
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">-</span>
                  You need extensive automation
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">-</span>
                  You want self-hosted deployment
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">-</span>
                  You need AI-powered triage
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">-</span>
                  You prefer predictable costs
                </li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Choose PagerDuty if:</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">-</span>
                  You need industry-standard reliability
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">-</span>
                  You have 24/7 operations teams
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">-</span>
                  You need enterprise support
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">-</span>
                  You want cloud-native solution
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">-</span>
                  You need comprehensive integrations
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Technical Architecture</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Moltbot Architecture</h3>
                <ul className="space-y-2 text-sm">
                  <li>PostgreSQL + Supabase backend</li>
                  <li>Next.js 14 frontend</li>
                  <li>AI-powered incident engine</li>
                  <li>Mycelium graph database</li>
                  <li>Docker/Kubernetes deployment</li>
                  <li>Security rule engine</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">PagerDuty Architecture</h3>
                <ul className="space-y-2 text-sm">
                  <li>Proprietary cloud platform</li>
                  <li>Microservices architecture</li>
                  <li>Real-time event processing</li>
                  <li>Advanced analytics engine</li>
                  <li>Global CDN infrastructure</li>
                  <li>Enterprise-grade reliability</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Incident Response Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <h3 className="text-white font-semibold mb-3">Moltbot Workflow</h3>
              <pre className="text-sm">
{`# Moltbot Incident Response
1. AI-powered alert analysis
2. Automatic threat classification
3. Execute security runbooks
4. Real-time remediation
5. Post-incident learning
6. Automated compliance reporting`}</pre>
            </div>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <h3 className="text-white font-semibold mb-3">PagerDuty Workflow</h3>
              <pre className="text-sm">
{`# PagerDuty Incident Management
1. Alert ingestion & routing
2. Escalation policy execution
3. On-call notification
4. Incident coordination
5. Resolution tracking
6. Post-mortem analysis`}</pre>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Integration & Ecosystem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Moltbot Integrations</h3>
              <ul className="text-sm space-y-1">
                <li>Security tools (Wazuh, Osquery)</li>
                <li>SIEM systems (ELK, Splunk)</li>
                <li>Container platforms (K8s, Docker)</li>
                <li>Cloud providers (AWS, GCP, Azure)</li>
                <li>Custom API endpoints</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">PagerDuty Integrations</h3>
              <ul className="text-sm space-y-1">
                <li>700+ native integrations</li>
                <li>Monitoring tools (Datadog, New Relic)</li>
                <li>Chat platforms (Slack, Teams)</li>
                <li>ITSM systems (ServiceNow, Jira)</li>
                <li>Developer tools (GitHub, GitLab)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Alert Management Comparison</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded border">
                <h3 className="font-bold text-gray-800 mb-3">Moltbot Alert Features</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>AI Triage:</strong> Automatic severity classification</li>
                  <li><strong>Correlation:</strong> Smart alert grouping</li>
                  <li><strong>Context:</strong> Security threat intelligence</li>
                  <li><strong>Automation:</strong> One-click remediation</li>
                  <li className="text-green-600">Security-focused analysis</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border">
                <h3 className="font-bold text-gray-800 mb-3">PagerDuty Alert Features</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Routing:</strong> Advanced alert routing</li>
                  <li><strong>Suppression:</strong> Intelligent alert suppression</li>
                  <li><strong>Context:</strong> Rich alert metadata</li>
                  <li><strong>Escalation:</strong> Multi-level escalation policies</li>
                  <li className="text-green-600">Enterprise-grade reliability</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Pricing Comparison</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded border">
                <h3 className="font-bold text-gray-800 mb-3">Moltbot Pricing</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Explorer:</strong> Free tier (up to 10 users)</li>
                  <li><strong>Pro:</strong> $2,999/year (up to 50 users)</li>
                  <li><strong>Team:</strong> $9,999/year (unlimited users)</li>
                  <li><strong>Enterprise:</strong> Custom pricing</li>
                  <li className="text-green-600">No per-user fees after license</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border">
                <h3 className="font-bold text-gray-800 mb-3">PagerDuty Pricing</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Business:</strong> $29/user/month</li>
                  <li><strong>Digital Operations:</strong> $49/user/month</li>
                  <li><strong>Enterprise:</strong> Custom pricing</li>
                  <li><strong>Event Intelligence:</strong> Additional fees</li>
                  <li className="text-red-600">Can be expensive for large teams</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Security & Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Moltbot Security</h3>
              <ul className="text-sm space-y-1">
                <li>GDPR/DSGVO compliant by design</li>
                <li>Self-hosted data control</li>
                <li>End-to-end encryption</li>
                <li>Security incident specialization</li>
                <li>Comprehensive audit trails</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">PagerDuty Security</h3>
              <ul className="text-sm space-y-1">
                <li>SOC 2 Type II certified</li>
                <li>ISO 27001 compliant</li>
                <li>HIPAA compliant</li>
                <li>Role-based access control</li>
                <li>Data encryption at rest & in transit</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">Security Check</div>
              <div className="text-sm text-gray-600">Scan your system now</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">Runbooks</div>
              <div className="text-sm text-gray-600">600+ security playbooks</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">OpenClaw Framework</div>
              <div className="text-sm text-gray-600">Self-hosted security</div>
            </a>
            <a href={`/${locale}/solutions/kubernetes-security-hardening`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">Kubernetes Security</div>
              <div className="text-sm text-gray-600">Complete hardening guide</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
