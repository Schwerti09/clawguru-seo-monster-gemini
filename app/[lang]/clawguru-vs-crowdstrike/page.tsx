import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/clawguru-vs-crowdstrike"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "ClawGuru vs CrowdStrike: SIEM EDR Security Comparison 2026"
  const description = "Complete comparison between ClawGuru and CrowdStrike for SIEM, EDR, and security operations. Features, pricing, deployment, and use cases analysis."
  return {
    title,
    description,
    keywords: ["clawguru vs crowdstrike", "siem comparison", "edr comparison", "security platform", "self-hosted security"],
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

export default function ClawGuruVsCrowdstrikePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This comparison is for security architecture decisions. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">ClawGuru vs CrowdStrike: SIEM & EDR Security Comparison</h1>
        <p className="text-lg text-gray-600 mb-8">Comprehensive security platform comparison for enterprise SIEM, EDR, and security operations teams.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Quick Comparison Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-4">ClawGuru</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Self-hosted & GDPR-compliant
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  600+ automated security runbooks
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  No vendor lock-in
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Open-source friendly
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Multi-cloud deployment
                </li>
              </ul>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-bold text-red-800 mb-4">CrowdStrike</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  AI-powered threat detection
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  24/7 managed services
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Enterprise-grade support
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Real-time threat intel
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Cloud-native platform
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CrowdStrike</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">SIEM Capabilities</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Full SIEM with custom rules</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Limited SIEM</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EDR/XDR</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Open-source agent support</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Advanced AI-powered EDR</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Deployment</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Self-hosted, on-prem, cloud</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Cloud-only (SaaS)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Data Privacy</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">GDPR/DSGVO compliant</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">US data centers</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Automation</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">600+ executable runbooks</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Limited automation</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pricing Model</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Perpetual license + support</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Per-endpoint subscription</td>
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
                  You prefer open-source technologies
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">-</span>
                  You need extensive automation
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">-</span>
                  You want to avoid vendor lock-in
                </li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Choose CrowdStrike if:</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">-</span>
                  You need 24/7 managed services
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">-</span>
                  You prefer cloud-native solutions
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">-</span>
                  You need AI-powered threat detection
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">-</span>
                  You have enterprise support requirements
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">-</span>
                  You need rapid deployment
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
                  <li>Open-source agent ecosystem</li>
                  <li>Docker/Kubernetes deployment</li>
                  <li>Custom rule engine</li>
                  <li>Mycelium graph database</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">CrowdStrike Architecture</h3>
                <ul className="space-y-2 text-sm">
                  <li>Proprietary cloud platform</li>
                  <li>Falcon agent (Windows/Linux/macOS)</li>
                  <li>AI/ML threat detection</li>
                  <li>Real-time behavioral analysis</li>
                  <li>Threat graph intelligence</li>
                  <li>OverWatch managed services</li>
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
                  <li><strong>Explorer:</strong> Free tier (up to 10 endpoints)</li>
                  <li><strong>Pro:</strong> $999/year (up to 100 endpoints)</li>
                  <li><strong>Team:</strong> $4,999/year (unlimited endpoints)</li>
                  <li><strong>Enterprise:</strong> Custom pricing</li>
                  <li className="text-green-600">No per-endpoint fees after initial license</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border">
                <h3 className="font-bold text-gray-800 mb-3">CrowdStrike Pricing</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Falcon Prevent:</strong> $69/endpoint/year</li>
                  <li><strong>Falcon Complete:</strong> $149/endpoint/year</li>
                  <li><strong>Falcon OverWatch:</strong> $199/endpoint/year</li>
                  <li><strong>Enterprise:</strong> Custom pricing</li>
                  <li className="text-red-600">Recurring per-endpoint subscription</li>
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
                <li>Open-source tools (Wazuh, Osquery)</li>
                <li>Custom API endpoints</li>
                <li>SIEM systems (ELK, Splunk)</li>
                <li>Container platforms (K8s, Docker)</li>
                <li>Cloud providers (AWS, GCP, Azure)</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">CrowdStrike Integrations</h3>
              <ul className="text-sm space-y-1">
                <li>Major SIEM platforms</li>
                <li>SOAR systems (Splunk SOAR, Palo Alto)</li>
                <li>ITSM platforms (ServiceNow)</li>
                <li>Cloud platforms (AWS, Azure)</li>
                <li>Identity providers (Okta, Azure AD)</li>
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
            <a href={`/${locale}/solutions/enterprise-siem-integration`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">SIEM Integration</div>
              <div className="text-sm text-gray-600">Enterprise solutions</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
