import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw-vs-falco"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "OpenClaw vs Falco: Runtime Security Comparison 2026"
  const description = "Complete comparison between OpenClaw and Falco for runtime security, container monitoring, and threat detection. Features, deployment, and architecture analysis."
  return {
    title,
    description,
    keywords: ["openclaw vs falco", "runtime security", "container security", "threat detection", "kubernetes security"],
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

export default function OpenClawVsFalcoPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This comparison is for security architecture decisions. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">OpenClaw vs Falco: Runtime Security Comparison</h1>
        <p className="text-lg text-gray-600 mb-8">Comprehensive runtime security platform comparison for container monitoring, threat detection, and Kubernetes security.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Quick Comparison Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-4">OpenClaw</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Complete security framework
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Self-hosted deployment
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  600+ security runbooks
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Multi-cloud support
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  No vendor lock-in
                </li>
              </ul>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-bold text-orange-800 mb-4">Falco</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  CNCF graduated project
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Real-time threat detection
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Kubernetes-native
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Open-source
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">+</span>
                  Extensible rule engine
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OpenClaw</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Falco</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Runtime Security</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Complete framework</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Advanced runtime monitoring</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Container Security</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Full lifecycle security</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Runtime container monitoring</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rule Engine</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Custom security rules</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Powerful rule language</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Deployment</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Self-hosted, multi-cloud</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Kubernetes-native deployment</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Automation</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">600+ executable runbooks</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Limited automation</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Integration</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Comprehensive ecosystem</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Security tool integrations</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pricing Model</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Perpetual license + support</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Open-source (free)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Use Case Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Choose OpenClaw if:</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">-</span>
                  You need a complete security framework
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">-</span>
                  You want extensive automation
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">-</span>
                  You need multi-cloud support
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">-</span>
                  You prefer self-hosted solutions
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">-</span>
                  You need comprehensive runbooks
                </li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Choose Falco if:</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">-</span>
                  You need Kubernetes-native security
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">-</span>
                  You prefer open-source solutions
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">-</span>
                  You need real-time threat detection
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">-</span>
                  You want CNCF-compliant tools
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">-</span>
                  You have budget constraints
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
                <h3 className="font-bold text-gray-800 mb-3">OpenClaw Architecture</h3>
                <ul className="space-y-2 text-sm">
                  <li>PostgreSQL + Supabase backend</li>
                  <li>Next.js 14 frontend</li>
                  <li>Custom security rule engine</li>
                  <li>Mycelium graph database</li>
                  <li>Docker/Kubernetes deployment</li>
                  <li>Multi-cloud orchestration</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Falco Architecture</h3>
                <ul className="space-y-2 text-sm">
                  <li>Kernel-level system calls monitoring</li>
                  <li>Libsinsp for data collection</li>
                  <li>Rule engine with YAML configuration</li>
                  <li>Kubernetes integration</li>
                  <li>Cloud-native deployment</li>
                  <li>Real-time event processing</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Rule Configuration Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <h3 className="text-white font-semibold mb-3">OpenClaw Rule Example</h3>
              <pre className="text-sm">
{`# OpenClaw Security Rule
apiVersion: security.openclaw.io/v1
kind: SecurityRule
metadata:
  name: suspicious-shell-access
spec:
  description: "Detect suspicious shell access"
  severity: "high"
  conditions:
    - field: "process.name"
      operator: "equals"
      value: "bash"
    - field: "container.name"
      operator: "exists"
  actions:
    - type: "alert"
      severity: "high"
    - type: "runbook"
      name: "investigate-shell-access"`}
              </pre>
            </div>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <h3 className="text-white font-semibold mb-3">Falco Rule Example</h3>
              <pre className="text-sm">
{`# Falco Rule Configuration
- rule: Suspicious Shell in Container
  desc: Detect shell spawned in container
  condition: >
    spawned_process and
    container and
    proc.name in (bash, sh, zsh) and
    not user.name = root
  output: >
    Shell spawned in container 
    (user=%user.name container=%container.name)
  priority: WARNING
  tags: [container, shell]`}
              </pre>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Integration & Ecosystem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">OpenClaw Integrations</h3>
              <ul className="text-sm space-y-1">
                <li>SIEM systems (ELK, Splunk)</li>
                <li>Container platforms (K8s, Docker)</li>
                <li>Cloud providers (AWS, GCP, Azure)</li>
                <li>Security tools (Wazuh, Osquery)</li>
                <li>Custom API endpoints</li>
              </ul>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">Falco Integrations</h3>
              <ul className="text-sm space-y-1">
                <li>Kubernetes (native integration)</li>
                <li>SIEM systems (via syslog, JSON)</li>
                <li>Alerting systems (Prometheus, Alertmanager)</li>
                <li>Container runtimes (Docker, containerd)</li>
                <li>Cloud platforms (AWS EKS, GKE, AKS)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Deployment Comparison</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded border">
                <h3 className="font-bold text-gray-800 mb-3">OpenClaw Deployment</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Self-hosted:</strong> Docker Compose</li>
                  <li><strong>Kubernetes:</strong> Helm charts</li>
                  <li><strong>Cloud:</strong> AWS, GCP, Azure</li>
                  <li><strong>On-prem:</strong> Bare metal support</li>
                  <li className="text-green-600">Complete control over data</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border">
                <h3 className="font-bold text-gray-800 mb-3">Falco Deployment</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Kubernetes:</strong> DaemonSet deployment</li>
                  <li><strong>Standalone:</strong> Package managers</li>
                  <li><strong>Cloud:</strong> Managed Kubernetes</li>
                  <li><strong>Edge:</strong> IoT and edge devices</li>
                  <li className="text-green-600">Lightweight footprint</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Performance & Resource Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">OpenClaw Performance</h3>
              <ul className="text-sm space-y-1">
                <li>CPU: 2-4 cores recommended</li>
                <li>Memory: 8-16 GB RAM</li>
                <li>Storage: 100-500 GB SSD</li>
                <li>Network: 1 Gbps recommended</li>
                <li>Scalable architecture</li>
              </ul>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">Falco Performance</h3>
              <ul className="text-sm space-y-1">
                <li>CPU: 0.5-1 core per node</li>
                <li>Memory: 512 MB - 1 GB</li>
                <li>Storage: Minimal (configuration only)</li>
                <li>Network: Low overhead</li>
                <li>Optimized for production</li>
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
