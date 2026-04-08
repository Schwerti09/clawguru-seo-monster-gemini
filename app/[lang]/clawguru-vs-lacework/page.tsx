import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/clawguru-vs-lacework"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "ClawGuru vs Lacework: CSPM Security Comparison 2026"
  const description = "Complete comparison between ClawGuru and Lacework for cloud security posture management (CSPM), compliance, and multi-cloud security. Features, pricing, and deployment analysis."
  return {
    title,
    description,
    keywords: ["clawguru vs lacework", "cspm comparison", "cloud security posture management", "multi-cloud security", "compliance automation"],
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

export default function ClawGuruVsLaceworkPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This comparison is for security architecture decisions. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">ClawGuru vs Lacework: CSPM Security Comparison</h1>
        <p className="text-lg text-gray-600 mb-8">Comprehensive cloud security platform comparison for CSPM, compliance management, and multi-cloud security operations.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Quick Comparison Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-4">ClawGuru</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Self-hosted CSPM
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
                  No vendor lock-in
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Predictable costs
                </li>
              </ul>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg">
              <h3 className="font-bold text-teal-800 mb-4">Lacework</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  AI-powered security
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Polygraph risk analysis
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Real-time threat detection
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Comprehensive integrations
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Enterprise-grade support
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lacework</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CSPM Capabilities</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Full CSPM with custom rules</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Advanced AI-powered CSPM</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Multi-Cloud Support</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">AWS, GCP, Azure, on-prem</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">AWS, GCP, Azure, Alibaba</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Compliance Management</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">GDPR, ISO27001, NIS2</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">SOC2, ISO27001, PCI-DSS</td>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Per-asset subscription</td>
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
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">-</span>
                  You need on-prem support
                </li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Choose Lacework if:</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">-</span>
                  You need AI-powered threat detection
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">-</span>
                  You want cloud-native solution
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">-</span>
                  You need Polygraph risk analysis
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">-</span>
                  You have enterprise requirements
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">-</span>
                  You need 24/7 support
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
                <h3 className="font-bold text-gray-800 mb-3">ClawGuru Architecture</h3>
                <ul className="space-y-2 text-sm">
                  <li>PostgreSQL + Supabase backend</li>
                  <li>Next.js 14 frontend</li>
                  <li>Custom CSPM rule engine</li>
                  <li>Mycelium graph database</li>
                  <li>Docker/Kubernetes deployment</li>
                  <li>Multi-cloud connectors</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Lacework Architecture</h3>
                <ul className="space-y-2 text-sm">
                  <li>Proprietary cloud platform</li>
                  <li>AI/ML Polygraph engine</li>
                  <li>Agentless data collection</li>
                  <li>Real-time behavioral analysis</li>
                  <li>Cloud-native microservices</li>
                  <li>Automated threat correlation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Compliance Framework Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">ClawGuru Compliance</h3>
              <ul className="text-sm space-y-1">
                <li>GDPR/DSGVO (native support)</li>
                <li>ISO 27001:2022</li>
                <li>NIS2 Directive</li>
                <li>SOC 2 Type II</li>
                <li>Custom compliance frameworks</li>
              </ul>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="font-semibold text-teal-800 mb-2">Lacework Compliance</h3>
              <ul className="text-sm space-y-1">
                <li>SOC 2 Type II</li>
                <li>ISO 27001:2013</li>
                <li>PCI DSS 4.0</li>
                <li>HIPAA</li>
                <li>FedRAMP (in progress)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Cloud Provider Integration</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded border">
                <h3 className="font-bold text-gray-800 mb-3">ClawGuru Integrations</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>AWS:</strong> Config, CloudTrail, GuardDuty</li>
                  <li><strong>GCP:</strong> Cloud Asset Inventory, Security Command</li>
                  <li><strong>Azure:</strong> Security Center, Resource Graph</li>
                  <li><strong>On-prem:</strong> Custom connectors</li>
                  <li className="text-green-600">Full API access control</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border">
                <h3 className="font-bold text-gray-800 mb-3">Lacework Integrations</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>AWS:</strong> 300+ service integrations</li>
                  <li><strong>GCP:</strong> 150+ service integrations</li>
                  <li><strong>Azure:</strong> 200+ service integrations</li>
                  <li><strong>Alibaba:</strong> 50+ service integrations</li>
                  <li className="text-green-600">Comprehensive coverage</li>
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
                <h3 className="font-bold text-gray-800 mb-3">ClawGuru Pricing</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Explorer:</strong> Free tier (up to 50 assets)</li>
                  <li><strong>Pro:</strong> $4,999/year (up to 500 assets)</li>
                  <li><strong>Team:</strong> $14,999/year (unlimited assets)</li>
                  <li><strong>Enterprise:</strong> Custom pricing</li>
                  <li className="text-green-600">No per-asset fees after license</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border">
                <h3 className="font-bold text-gray-800 mb-3">Lacework Pricing</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Plan:</strong> Custom pricing (starts at ~$50K/year)</li>
                  <li><strong>Per-asset:</strong> $5-15/month depending on tier</li>
                  <li><strong>Data ingestion:</strong> Additional fees</li>
                  <li><strong>Support:</strong> 24/7 enterprise support</li>
                  <li className="text-red-600">Can be expensive at scale</li>
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
                <li>SIEM systems (ELK, Splunk)</li>
                <li>SOAR platforms (Cortex XSOAR)</li>
                <li>ITSM systems (ServiceNow)</li>
                <li>Container platforms (K8s, Docker)</li>
                <li>Custom API endpoints</li>
              </ul>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="font-semibold text-teal-800 mb-2">Lacework Integrations</h3>
              <ul className="text-sm space-y-1">
                <li>Major SIEM platforms</li>
                <li>SOAR systems (Palo Alto, Splunk)</li>
                <li>ITSM platforms (ServiceNow, Jira)</li>
                <li>Container security tools</li>
                <li>Cloud provider services</li>
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
