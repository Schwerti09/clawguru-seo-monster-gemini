import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/iso27001-certification-roadmap"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "ISO 27001 Certification Roadmap: Complete Guide 2026"
  const description = "Complete ISO 27001 certification roadmap with step-by-step implementation, compliance requirements, and security controls for enterprise certification."
  return {
    title,
    description,
    keywords: ["iso 27001 certification", "information security management", "compliance roadmap", "isms implementation", "security controls"],
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

export default function Iso27001CertificationRoadmapPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This guide is for compliance and security implementation. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">ISO 27001 Certification Roadmap: Complete Guide</h1>
        <p className="text-lg text-gray-600 mb-8">Step-by-step implementation guide for ISO 27001:2022 certification with security controls, compliance requirements, and audit preparation.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">ISO 27001:2022 Overview</h2>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Key Changes in 2022 Version</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Focus on information security risk management</li>
              <li>Integration with other management systems</li>
              <li>Enhanced business continuity requirements</li>
              <li>Updated security controls and annex</li>
              <li>Emphasis on cloud security and outsourcing</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Phase 1: Foundation & Planning</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">1.1 Management Commitment</h3>
                <ul className="space-y-2 text-sm">
                  <li>Obtain executive sponsorship</li>
                  <li>Define information security policy</li>
                  <li>Allocate resources and budget</li>
                  <li>Establish project timeline</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">1.2 Scope Definition</h3>
                <ul className="space-y-2 text-sm">
                  <li>Identify organizational boundaries</li>
                  <li>Define ISMS scope</li>
                  <li>Document exclusions</li>
                  <li>Stakeholder analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Phase 2: Risk Assessment</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Risk Assessment Methodology
## Asset Identification
- Information assets classification
- Asset inventory and valuation
- Data flow mapping
- Critical asset identification

## Risk Analysis
- Threat identification
- Vulnerability assessment
- Impact analysis
- Likelihood evaluation
- Risk calculation (Impact × Likelihood)

## Risk Treatment
- Risk acceptance criteria
- Control selection framework
- Risk treatment plan
- Residual risk assessment`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Phase 3: Control Implementation</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">3.1 Organizational Controls</h3>
                <ul className="space-y-2 text-sm">
                  <li>A.5.1 Policies for information security</li>
                  <li>A.5.37 Documented operating procedures</li>
                  <li>A.6.1 Information security roles and responsibilities</li>
                  <li>A.6.3 Segregation of duties</li>
                  <li>A.7.4 Terms and conditions of employment</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">3.2 Technical Controls</h3>
                <ul className="space-y-2 text-sm">
                  <li>A.8.1 User endpoint devices</li>
                  <li>A.8.23 Web filtering</li>
                  <li>A.8.24 Use of cryptography</li>
                  <li>A.8.25 Secure development life cycle</li>
                  <li>A.8.28 Secure coding</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Phase 4: Documentation & Training</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">4.1 Required Documentation</h3>
                <ul className="space-y-2 text-sm">
                  <li>Information security policy</li>
                  <li>Scope and boundaries</li>
                  <li>Risk assessment methodology</li>
                  <li>Statement of applicability</li>
                  <li>Control objectives and controls</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">4.2 Training Program</h3>
                <ul className="space-y-2 text-sm">
                  <li>Awareness training for all staff</li>
                  <li>Role-specific security training</li>
                  <li>Management security training</li>
                  <li>Third-party security requirements</li>
                  <li>Training effectiveness evaluation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Phase 5: Monitoring & Review</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Monitoring and Measurement Framework
## Key Performance Indicators (KPIs)
- Security incident response time
- Control effectiveness metrics
- Risk reduction percentage
- Compliance score
- Training completion rate

## Review Activities
- Monthly management reviews
- Quarterly internal audits
- Annual risk assessments
- Bi-annual policy reviews
- Continuous monitoring reports

## Improvement Process
- Corrective action tracking
- Preventive action implementation
- Lessons learned documentation
- Process optimization
- Continuous improvement cycle`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Phase 6: Certification Audit</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">6.1 Stage 1 Audit</h3>
                <ul className="space-y-2 text-sm">
                  <li>Documentation review</li>
                  <li>Policy compliance assessment</li>
                  <li>Readiness evaluation</li>
                  <li>Gap identification</li>
                  <li>Pre-audit recommendations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">6.2 Stage 2 Audit</h3>
                <ul className="space-y-2 text-sm">
                  <li>On-site assessment</li>
                  <li>Control implementation verification</li>
                  <li>Staff interviews</li>
                  <li>Process observation</li>
                  <li>Compliance validation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Implementation Timeline</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                <div className="flex-1">
                  <div className="font-semibold">Months 1-2: Foundation</div>
                  <div className="text-sm text-gray-600">Management commitment, scope definition, policy development</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                <div className="flex-1">
                  <div className="font-semibold">Months 3-4: Risk Assessment</div>
                  <div className="text-sm text-gray-600">Asset identification, risk analysis, treatment planning</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                <div className="flex-1">
                  <div className="font-semibold">Months 5-8: Control Implementation</div>
                  <div className="text-sm text-gray-600">Security controls deployment, documentation, training</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                <div className="flex-1">
                  <div className="font-semibold">Months 9-10: Internal Audit</div>
                  <div className="text-sm text-gray-600">Internal audits, gap analysis, corrective actions</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</div>
                <div className="flex-1">
                  <div className="font-semibold">Months 11-12: Certification</div>
                  <div className="text-sm text-gray-600">External audit, certification, maintenance planning</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Common Challenges & Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Challenge: Resource Constraints</h3>
              <p className="text-sm text-red-700 mb-2">Limited budget and personnel for implementation</p>
              <p className="text-sm text-green-600"><strong>Solution:</strong> Phased implementation, prioritize high-risk areas</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Challenge: Documentation Overload</h3>
              <p className="text-sm text-yellow-700 mb-2">Excessive documentation requirements</p>
              <p className="text-sm text-green-600"><strong>Solution:</strong> Use document management systems, automate where possible</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Challenge: Employee Resistance</h3>
              <p className="text-sm text-blue-700 mb-2">Staff resistance to new security procedures</p>
              <p className="text-sm text-green-600"><strong>Solution:</strong> Comprehensive training, communication of benefits</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Challenge: Maintenance Burden</h3>
              <p className="text-sm text-purple-700 mb-2">Ongoing maintenance and compliance requirements</p>
              <p className="text-sm text-green-600"><strong>Solution:</strong> Automated monitoring, continuous improvement processes</p>
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
              <div className="font-semibold text-blue-600">SOC2 Compliance</div>
              <div className="text-sm text-gray-600">Compliance automation</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
