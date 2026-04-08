import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/clawguru-vs-datadog"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "ClawGuru vs Datadog: Monitoring Security Comparison 2026"
  const description = "Complete comparison between ClawGuru and Datadog for security monitoring, observability, and infrastructure monitoring. Features, pricing, and deployment analysis."
  return {
    title,
    description,
    keywords: ["clawguru vs datadog", "monitoring comparison", "security observability", "infrastructure monitoring", "self-hosted monitoring"],
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

export default function ClawGuruVsDatadogPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This comparison is for security architecture decisions. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">ClawGuru vs Datadog: Monitoring & Security Comparison</h1>
        <p className="text-lg text-gray-600 mb-8">Comprehensive monitoring platform comparison for security observability, infrastructure monitoring, and DevOps teams.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Quick Comparison Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-4">ClawGuru</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Security-first monitoring
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Self-hosted deployment
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  GDPR/DSGVO compliant
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  600+ security runbooks
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Open-source integrations
                </li>
              </ul>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-bold text-purple-800 mb-4">Datadog</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Comprehensive observability
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Real-time metrics & traces
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  APM & RUM integration
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  600+ integrations
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  AI-powered analytics
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ClawGuru</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datadog</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Security Monitoring</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Advanced security focus</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Basic security features</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Infrastructure Monitoring</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">System metrics & logs</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Comprehensive monitoring</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Application Performance</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Limited APM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Advanced APM & RUM</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Deployment</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Self-hosted, on-prem, cloud</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Cloud-only (SaaS)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Data Privacy</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">GDPR/DSGVO compliant</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">US data centers</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Automation</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">600+ executable runbooks</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Limited automation</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pricing Model</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Perpetual license + support</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Per-host/usage subscription</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Use Case Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Choose ClawGuru if:</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">-</span>
                  Security monitoring is primary concern
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">-</span>
                  You need GDPR/DSGVO compliance
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">-</span>
                  You want self-hosted deployment
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">-</span>
                  You need extensive automation
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">-</span>
                  You prefer predictable costs
                </li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Choose Datadog if:</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">-</span>
                  You need comprehensive observability
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">-</span>
                  APM and RUM are critical
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">-</span>
                  You need 600+ integrations
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">-</span>
                  You want cloud-native solution
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">-</span>
                  You need AI-powered insights
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Technical Architecture</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">ClawGuru Architecture</h3>
                <ul className="space-y-2 text-sm">
                  <li>PostgreSQL + Supabase backend</li>
                  <li>Prometheus + Grafana metrics</li>
                  <li>ELK stack for log aggregation</li>
                  <li>Custom security rule engine</li>
                  <li>Open-source agent ecosystem</li>
                  <li>Mycelium graph database</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Datadog Architecture</h3>
                <ul className="space-y-2 text-sm">
                  <li>Proprietary cloud platform</li>
                  <li>Datadog Agent (universal)</li>
                  <li>Distributed tracing system</li>
                  <li>Real-time stream processing</li>
                  <li>AI/ML anomaly detection</li>
                  <li>Custom metrics & events</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Pricing Comparison</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded border">
                <h3 className="font-bold text-gray-800 mb-3">ClawGuru Pricing</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Explorer:</strong> Free tier (up to 10 hosts)</li>
                  <li><strong>Pro:</strong> $999/year (up to 100 hosts)</li>
                  <li><strong>Team:</strong> $4,999/year (unlimited hosts)</li>
                  <li><strong>Enterprise:</strong> Custom pricing</li>
                  <li className="text-green-600">No per-host fees after initial license</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border">
                <h3 className="font-bold text-gray-800 mb-3">Datadog Pricing</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Infrastructure:</strong> $15/host/month</li>
                  <li><strong>APM:</strong> $31/host/month + traces</li>
                  <li><strong>Logs:</strong> $0.10/ingested GB</li>
                  <li><strong>RUM:</strong> $0.005/session</li>
                  <li className="text-red-600">Usage-based pricing can be expensive</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Integration & Ecosystem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">ClawGuru Integrations</h3>
              <ul className="text-sm space-y-1">
                <li>Open-source monitoring (Prometheus, Grafana)</li>
                <li>SIEM systems (ELK, Splunk)</li>
                <li>Security tools (Wazuh, Osquery)</li>
                <li>Container platforms (K8s, Docker)</li>
                <li>Custom API endpoints</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Datadog Integrations</h3>
              <ul className="text-sm space-y-1">
                <li>600+ out-of-the-box integrations</li>
                <li>Major cloud providers (AWS, GCP, Azure)</li>
                <li>Container orchestration (K8s, ECS)</li>
                <li>Databases (PostgreSQL, MongoDB, Redis)</li>
                <li>Web frameworks and languages</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Security & Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">ClawGuru Security</h3>
              <ul className="text-sm space-y-1">
                <li>GDPR/DSGVO compliant by design</li>
                <li>Self-hosted data control</li>
                <li>End-to-end encryption</li>
                <li>Security-first architecture</li>
                <li>Comprehensive audit logs</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Datadog Security</h3>
              <ul className="text-sm space-y-1">
                <li>SOC 2 Type II certified</li>
                <li>ISO 27001 compliant</li>
                <li>GDPR compliant (with limitations)</li>
                <li>Role-based access control</li>
                <li>Data encryption at rest & in transit</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-100 p-4 rounded-lg hover:bg-gray-200">
              <div className="font-semibold text-blue-600">Security Check</div>
              <div className="text-sm text-gray-600">Scan your system now</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-100 p-4 rounded-lg hover:bg-gray-200">
              <div className="font-semibold text-blue-600">Runbooks</div>
              <div className="text-sm text-gray-600">600+ security playbooks</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-100 p-4 rounded-lg hover:bg-gray-200">
              <div className="font-semibold text-blue-600">OpenClaw Framework</div>
              <div className="text-sm text-gray-600">Self-hosted security</div>
            </a>
            <a href={`/${locale}/solutions/kubernetes-security-hardening`} className="block bg-gray-100 p-4 rounded-lg hover:bg-gray-200">
              <div className="font-semibold text-blue-600">Kubernetes Security</div>
              <div className="text-sm text-gray-600">Complete hardening guide</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
