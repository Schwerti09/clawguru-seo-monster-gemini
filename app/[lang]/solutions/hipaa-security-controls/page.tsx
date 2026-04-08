import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/hipaa-security-controls"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "HIPAA Security Controls: Complete Compliance Guide 2026"
  const description = "Complete HIPAA security controls implementation guide with technical safeguards, administrative controls, and audit preparation for healthcare data protection."
  return {
    title,
    description,
    keywords: ["hipaa security controls", "healthcare compliance", "phi protection", "hipaa technical safeguards", "healthcare data security"],
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

export default function HipaaSecurityControlsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This guide is for healthcare compliance and security implementation. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">HIPAA Security Controls: Complete Compliance Guide</h1>
        <p className="text-lg text-gray-600 mb-8">Complete HIPAA security rule implementation with technical safeguards, administrative controls, and audit preparation for healthcare data protection.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">HIPAA Security Rule Overview</h2>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Three Types of Safeguards</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Administrative Safeguards (164.308)</li>
              <li>Physical Safeguards (164.310)</li>
              <li>Technical Safeguards (164.312)</li>
              <li>Breach Notification Requirements (164.402)</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Administrative Safeguards (164.308)</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Security Management Process</h3>
                <ul className="space-y-2 text-sm">
                  <li>Security officer designation</li>
                  <li>Workforce security policies</li>
                  <li>Information access management</li>
                  <li>Security awareness training</li>
                  <li>Security incident procedures</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Assigned Security Responsibility</h3>
                <ul className="space-y-2 text-sm">
                  <li>Security policy implementation</li>
                  <li>Workforce compliance monitoring</li>
                  <li>Sanction policy enforcement</li>
                  <li>Business associate agreements</li>
                  <li>Periodic security evaluation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Physical Safeguards (164.310)</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Physical Security Controls Implementation
## Facility Access Controls
- Authorized personnel access only
- Visitor access logs and escorts
- Security badge systems
- Emergency access procedures
- Access termination for terminated employees

## Workstation and Device Security
- Secure workstation locations
- Screen privacy filters and positioning
- Automatic screen lock after inactivity
- Portable device security policies
- Device disposal and destruction procedures

## Media and Device Controls
- Media tracking and inventory
- Secure storage and transport
- Data backup and recovery procedures
- Media disposal and destruction
- Device sanitization before reuse`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Technical Safeguards (164.312)</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Access Control (164.312(a)(1))</h3>
                <ul className="space-y-2 text-sm">
                  <li>Unique user identification</li>
                  <li>Emergency access procedures</li>
                  <li>Automatic logoff mechanisms</li>
                  <li>Encryption and decryption</li>
                  <li>Access audit controls</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Audit Controls (164.312(b))</h3>
                <ul className="space-y-2 text-sm">
                  <li>Hardware and software inventory</li>
                  <li>Access logging and monitoring</li>
                  <li>System activity reviews</li>
                  <li>Tamper-resistant audit trails</li>
                  <li>Secure audit log storage</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Integrity Controls (164.312(c)(1))</h3>
                <ul className="space-y-2 text-sm">
                  <li>Electronic PHI integrity protection</li>
                  <li>Alteration detection mechanisms</li>
                  <li>Digital signatures implementation</li>
                  <li>Checksum and hash verification</li>
                  <li>Change management procedures</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Transmission Security (164.312(e)(1))</h3>
                <ul className="space-y-2 text-sm">
                  <li>Encryption for data transmission</li>
                  <li>Secure network protocols</li>
                  <li>VPN implementation for remote access</li>
                  <li>Email encryption for PHI</li>
                  <li>Web security (HTTPS/TLS)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Encryption Implementation</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# HIPAA Encryption Standards
## Data at Rest Encryption
- AES-256 encryption for databases
- Full disk encryption for laptops/mobile devices
- File-level encryption for sensitive documents
- Key management and rotation procedures
- Secure key storage and backup

## Data in Transit Encryption
- TLS 1.2+ for all web communications
- VPN encryption for remote access
- Email encryption for PHI transmission
- Secure messaging platforms
- Mobile device encryption protocols

## Key Management Requirements
- Centralized key management system
- Key generation and distribution
- Key rotation and revocation procedures
- Secure key storage and backup
- Key escrow for emergency access`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Risk Assessment Process</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <div className="font-semibold">Identify Potential Risks</div>
                  <div className="text-sm text-gray-600">Identify threats and vulnerabilities to PHI</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <div className="font-semibold">Assess Current Security Measures</div>
                  <div className="text-sm text-gray-600">Evaluate effectiveness of existing controls</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <div className="font-semibold">Determine Likelihood and Impact</div>
                  <div className="text-sm text-gray-600">Assess probability and potential harm</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <div className="font-semibold">Document Risk Assessment</div>
                  <div className="text-sm text-gray-600">Record findings and mitigation strategies</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Business Associate Management</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">BA Agreement Requirements</h3>
                <ul className="space-y-2 text-sm">
                  <li>Written BA agreements for all covered entities</li>
                  <li>Permitted and required uses of PHI</li>
                  <li>Security safeguards implementation</li>
                  <li>Reporting of security breaches</li>
                  <li>Access to PHI for HHS compliance audits</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">BA Monitoring & Oversight</h3>
                <ul className="space-y-2 text-sm">
                  <li>Periodic BA compliance reviews</li>
                  <li>Security assessment documentation</li>
                  <li>Breach notification procedures</li>
                  <li>Contract termination procedures</li>
                  <li>Subcontractor oversight requirements</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Breach Notification Requirements</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# HIPAA Breach Notification Process
## Breach Identification
- Security incident detection procedures
- Breach assessment criteria
- Risk of harm evaluation
- Documentation requirements
- Timeline for breach identification

## Notification Requirements
- Individual notification within 60 days
- Media notification for breaches > 500 individuals
- HHS notification via breach portal
- Content requirements for notifications
- Delayed notification justifications

## Mitigation Procedures
- Immediate breach containment
- Forensic investigation procedures
- Damage assessment and remediation
- Preventive measure implementation
- Post-breach monitoring and review`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Compliance Monitoring & Auditing</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Continuous Monitoring</h3>
                <ul className="space-y-2 text-sm">
                  <li>Security control effectiveness monitoring</li>
                  <li>System activity logging and review</li>
                  <li>Access control monitoring</li>
                  <li>Encryption key management monitoring</li>
                  <li>Incident response effectiveness tracking</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Audit Preparation</h3>
                <ul className="space-y-2 text-sm">
                  <li>Documentation maintenance and updates</li>
                  <li>Staff training records management</li>
                  <li>Risk assessment documentation</li>
                  <li>Security control testing procedures</li>
                  <li>Remediation tracking and closure</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Common HIPAA Compliance Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Challenge: Cloud Computing</h3>
              <p className="text-sm text-red-700 mb-2">Managing PHI in cloud environments</p>
              <p className="text-sm text-green-600"><strong>Solution:</strong> Business associate agreements, cloud security controls, data encryption</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Challenge: Mobile Devices</h3>
              <p className="text-sm text-yellow-700 mb-2">Securing PHI on smartphones and tablets</p>
              <p className="text-sm text-green-600"><strong>Solution:</strong> Mobile device management, encryption, remote wipe capabilities</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Challenge: Telemedicine</h3>
              <p className="text-sm text-blue-700 mb-2">Securing remote healthcare communications</p>
              <p className="text-sm text-green-600"><strong>Solution:</strong> Secure video platforms, end-to-end encryption, access controls</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Challenge: Third-party Risk</h3>
              <p className="text-sm text-purple-700 mb-2">Managing business associate compliance</p>
              <p className="text-sm text-green-600"><strong>Solution:</strong> Due diligence, contractual requirements, ongoing monitoring</p>
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
              <div className="font-semibold text-blue-600">ISO 27001 Certification</div>
              <div className="text-sm text-gray-600">Complete certification guide</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
