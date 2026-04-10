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
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This comparison is for security architecture decisions. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">ClawGuru vs CrowdStrike: SIEM & EDR Security Comparison</h1>
        <p className="text-lg text-gray-300 mb-8">Comprehensive security platform comparison for enterprise SIEM, EDR, and security operations teams.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Quick Comparison Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-100 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-4">ClawGuru</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  Self-hosted & GDPR-compliant
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  600+ automated security runbooks
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  No vendor lock-in
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  Open-source friendly
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  Multi-cloud deployment
                </li>
              </ul>
            </div>
            <div className="bg-red-100 p-6 rounded-lg">
              <h3 className="font-bold text-red-800 mb-4">CrowdStrike</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  AI-powered threat detection
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  24/7 managed services
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  Enterprise-grade support
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  Real-time threat intel
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">+</span>
                  Cloud-native platform
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Feature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ClawGuru</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">CrowdStrike</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">SIEM Capabilities</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">Full SIEM with custom rules</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">Limited SIEM</td>
                </tr>
                <tr className="bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">EDR/XDR</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">Open-source agent support</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">Advanced AI-powered EDR</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">Deployment</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">Self-hosted, on-prem, cloud</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">Cloud-only (SaaS)</td>
                </tr>
                <tr className="bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">Data Privacy</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">GDPR/DSGVO compliant</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">US data centers</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">Automation</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">600+ executable runbooks</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">Limited automation</td>
                </tr>
                <tr className="bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">Pricing Model</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">Perpetual license + support</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">Per-endpoint subscription</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Use Case Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-cyan-400 mb-4">Choose ClawGuru if:</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">-</span>
                  You need GDPR/DSGVO compliance
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">-</span>
                  You want self-hosted deployment
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">-</span>
                  You prefer open-source technologies
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">-</span>
                  You need extensive automation
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">-</span>
                  You want to avoid vendor lock-in
                </li>
              </ul>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-cyan-400 mb-4">Choose CrowdStrike if:</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">-</span>
                  You need 24/7 managed services
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">-</span>
                  You prefer cloud-native solutions
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">-</span>
                  You need AI-powered threat detection
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">-</span>
                  You have enterprise support requirements
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">-</span>
                  You need rapid deployment
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Technical Architecture</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">ClawGuru Architecture</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>PostgreSQL + Supabase backend</li>
                  <li>Next.js 14 frontend</li>
                  <li>Open-source agent ecosystem</li>
                  <li>Docker/Kubernetes deployment</li>
                  <li>Custom rule engine</li>
                  <li>Mycelium graph database</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">CrowdStrike Architecture</h3>
                <ul className="space-y-2 text-sm text-gray-300">
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Pricing Comparison</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded border">
                <h3 className="font-bold text-cyan-400 mb-3">ClawGuru Pricing</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong>Explorer:</strong> Free tier (up to 10 endpoints)</li>
                  <li><strong>Pro:</strong> $999/year (up to 100 endpoints)</li>
                  <li><strong>Team:</strong> $4,999/year (unlimited endpoints)</li>
                  <li><strong>Enterprise:</strong> Custom pricing</li>
                  <li className="text-green-400">No per-endpoint fees after initial license</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded border">
                <h3 className="font-bold text-cyan-400 mb-3">CrowdStrike Pricing</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong>Falcon Prevent:</strong> $69/endpoint/year</li>
                  <li><strong>Falcon Complete:</strong> $149/endpoint/year</li>
                  <li><strong>Falcon OverWatch:</strong> $199/endpoint/year</li>
                  <li><strong>Enterprise:</strong> Custom pricing</li>
                  <li className="text-red-400">Recurring per-endpoint subscription</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Integration & Ecosystem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">ClawGuru Integrations</h3>
              <ul className="text-sm space-y-1">
                <li>Open-source tools (Wazuh, Osquery)</li>
                <li>Custom API endpoints</li>
                <li>SIEM systems (ELK, Splunk)</li>
                <li>Container platforms (K8s, Docker)</li>
                <li>Cloud providers (AWS, GCP, Azure)</li>
              </ul>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">CrowdStrike Integrations</h3>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">Scan your system now</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">600+ security playbooks</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw Framework</div>
              <div className="text-sm text-gray-300">Self-hosted security</div>
            </a>
            <a href={`/${locale}/solutions/kubernetes-security-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">SIEM Integration</div>
              <div className="text-sm text-gray-300">Enterprise solutions</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
