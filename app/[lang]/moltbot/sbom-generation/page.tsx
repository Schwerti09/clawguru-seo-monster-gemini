import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/sbom-generation"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "SBOM Generation: Software Bill of Materials 2026"
  const description = "Complete SBOM generation framework with automated software bill of materials creation, vulnerability management, and supply chain security."
  return {
    title,
    description,
    keywords: ["sbom generation", "software bill of materials", "supply chain security", "vulnerability management", "component analysis"],
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

export default function SbomGenerationPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for supply chain security and vulnerability management. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">SBOM Generation: Software Bill of Materials</h1>
        <p className="text-lg text-gray-300 mb-8">Complete SBOM generation framework with automated software bill of materials creation, vulnerability management, and supply chain security.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">SBOM Overview</h2>
          <div className="bg-gray-900 p-4 rounded-lg mb-4 border border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-100">What is a Software Bill of Materials?</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Comprehensive inventory of software components</li>
              <li>Dependency mapping and version tracking</li>
              <li>Security vulnerability identification</li>
              <li>License compliance management</li>
              <li>Supply chain risk assessment</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">SBOM Standards and Formats</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">SPDX (Software Package Data Exchange)</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Industry standard format</li>
                  <li>Human-readable and machine-readable</li>
                  <li>Supports multiple data models</li>
                  <li>License and copyright information</li>
                  <li>Relationship between components</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">CycloneDX</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Lightweight XML/JSON format</li>
                  <li>Designed for security analysis</li>
                  <li>Vulnerability integration</li>
                  <li>Service composition data</li>
                  <li>Dependency graph support</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Automated SBOM Generation</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# SBOM Generation Pipeline
## Discovery Phase
- Package manager scanning (npm, pip, maven, etc.)
- Container image analysis
- Binary component identification
- Configuration file parsing
- Runtime dependency detection

## Analysis Phase
- Component fingerprinting
- Version identification
- License classification
- Vulnerability correlation
- Risk scoring algorithms

## Generation Phase
- Format standardization
- Relationship mapping
- Metadata enrichment
- Validation and verification
- Export and distribution`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">SBOM Generation Tools</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Open Source Tools</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Syft (Anchore)</li>
                  <li>Trivy (Aqua Security)</li>
                  <li>OWASP Dependency Check</li>
                  <li>SPDX Tools</li>
                  <li>CycloneDX CLI</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Commercial Solutions</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Snyk Open Source</li>
                  <li>Black Duck (Synopsys)</li>
                  <li>WhiteSource SCA</li>
                  <li>Veracode SCA</li>
                  <li>Checkmarx SCA</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Integration Framework</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">CI/CD Integration</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>GitHub Actions workflows</li>
                  <li>Jenkins pipeline integration</li>
                  <li>GitLab CI/CD pipelines</li>
                  <li>Azure DevOps integration</li>
                  <li>Bitbucket pipelines</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Container Integration</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Docker image scanning</li>
                  <li>Kubernetes integration</li>
                  <li>Container registry scanning</li>
                  <li>Orchestration platform integration</li>
                  <li>Runtime SBOM generation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Vulnerability Management</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Vulnerability Management Process
## Detection
- CVE database integration
- NVD vulnerability feeds
- Vendor security advisories
- Exploit database correlation
- Threat intelligence integration

## Assessment
- CVSS scoring calculation
- Risk impact analysis
- Exploitability assessment
- Business impact evaluation
- Remediation prioritization

## Remediation
- Automated patch management
- Dependency update workflows
- Vulnerability tracking
- Remediation verification
- Compliance reporting`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">License Compliance</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">License Classification</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Open source license identification</li>
                  <li>Commercial license detection</li>
                  <li>License compatibility analysis</li>
                  <li>Restriction identification</li>
                  <li>Obligation tracking</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Compliance Management</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>License policy enforcement</li>
                  <li>Automated compliance checking</li>
                  <li>Legal requirement tracking</li>
                  <li>License violation detection</li>
                  <li>Compliance reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Supply Chain Security</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <div className="font-semibold text-gray-100">Component Verification</div>
                  <div className="text-sm text-gray-300">Verify authenticity and integrity of software components</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <div className="font-semibold text-gray-100">Supply Chain Mapping</div>
                  <div className="text-sm text-gray-300">Map the complete software supply chain and dependencies</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <div className="font-semibold text-gray-100">Risk Assessment</div>
                  <div className="text-sm text-gray-300">Assess risks associated with third-party components</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <div className="font-semibold text-gray-100">Continuous Monitoring</div>
                  <div className="text-sm text-gray-300">Monitor for new vulnerabilities and security issues</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">SBOM Analytics and Reporting</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# SBOM Analytics Dashboard
## Component Overview
- Total components count
- Component distribution by type
- License distribution analysis
- Vulnerability summary statistics
- Risk exposure metrics

## Trend Analysis
- Component growth trends
- Vulnerability trends over time
- License compliance trends
- Supply chain risk evolution
- Remediation progress tracking

## Compliance Reporting
- License compliance status
- Regulatory compliance metrics
- Security posture assessment
- Risk management reports
- Executive summary dashboards`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">Regular Updates</h3>
              <p className="text-sm text-blue-200">Generate SBOMs regularly and keep them up-to-date with component changes</p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">Automated Generation</h3>
              <p className="text-sm text-green-200">Automate SBOM generation in CI/CD pipelines for consistency</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">Standard Formats</h3>
              <p className="text-sm text-yellow-200">Use industry-standard formats like SPDX and CycloneDX</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">Comprehensive Coverage</h3>
              <p className="text-sm text-red-200">Ensure all components are included in the SBOM generation</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Implementation Examples</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">Web Application SBOM</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Frontend dependencies (npm, yarn)</li>
                  <li>Backend dependencies (pip, maven)</li>
                  <li>Container images</li>
                  <li>Infrastructure as code</li>
                  <li>Third-party services</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">Container SBOM</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Base image components</li>
                  <li>Application packages</li>
                  <li>System libraries</li>
                  <li>Configuration files</li>
                  <li>Runtime dependencies</li>
                </ul>
              </div>
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
              <div className="font-semibold text-cyan-400">Kubernetes Security</div>
              <div className="text-sm text-gray-300">Complete hardening guide</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
