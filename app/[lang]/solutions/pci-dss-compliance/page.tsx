import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/pci-dss-compliance"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "PCI DSS Compliance Guide: Complete Implementation 2026"
  const description = "Complete PCI DSS compliance guide with step-by-step implementation, security controls, and audit preparation for payment card data protection."
  return {
    title,
    description,
    keywords: ["pci dss compliance", "payment card security", "cardholder data protection", "pci compliance", "payment security"],
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

export default function PciDssCompliancePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for compliance and security implementation. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">PCI DSS Compliance: Complete Implementation Guide</h1>
        <p className="text-lg text-gray-300 mb-8">Step-by-step PCI DSS 4.0 compliance implementation with security controls, audit preparation, and payment card data protection.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">PCI DSS 4.0 Overview</h2>
          <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-100">Key Changes in PCI DSS 4.0</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Customized security approach based on risk</li>
              <li>Enhanced authentication requirements</li>
              <li>Focus on continuous monitoring and testing</li>
              <li>Updated encryption and key management requirements</li>
              <li>Extended validation methods and documentation</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">PCI DSS Requirements Overview</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">Requirements 1-4: Build & Maintain</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>1. Install and maintain network security controls</li>
                  <li>2. Apply secure configurations</li>
                  <li>3. Protect stored cardholder data</li>
                  <li>4. Protect cardholder data in transit</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">Requirements 5-8: Maintain & Monitor</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>5. Protect stored cardholder data</li>
                  <li>6. Maintain secure systems</li>
                  <li>7. Restrict access to cardholder data</li>
                  <li>8. Identify and authenticate access</li>
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-cyan-400 mb-3">Requirements 9-12: Monitor & Test</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>9. Restrict physical access to cardholder data</li>
                <li>10. Monitor and test networks</li>
                <li>11. Maintain information security policies</li>
                <li>12. Organizational security policies</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Phase 1: Scoping & Assessment</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# PCI DSS Scoping Methodology
## Cardholder Data Environment (CDE) Identification
- Document all systems, networks, and processes that store, process, or transmit CHD
- Identify all payment applications and systems
- Map data flow diagrams for payment processing
- Determine system boundaries and connections

## Risk Assessment Process
- Identify threats and vulnerabilities
- Assess impact and likelihood
- Document risk assessment methodology
- Create risk treatment plans
- Establish risk acceptance criteria

## Compliance Validation Method
- Self-Assessment Questionnaire (SAQ) selection
- Qualified Security Assessor (QSA) engagement
- Report on Compliance (ROC) requirements
- Internal audit procedures
- Third-party validation requirements`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Phase 2: Security Controls Implementation</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">Network Security Controls</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Firewall configuration and management</li>
                  <li>Network segmentation and isolation</li>
                  <li>Secure wireless network implementation</li>
                  <li>Access control mechanisms</li>
                  <li>Network monitoring and logging</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">Data Protection Controls</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Encryption at rest and in transit</li>
                  <li>Key management procedures</li>
                  <li>Tokenization implementation</li>
                  <li>Data masking and minimization</li>
                  <li>Secure data disposal procedures</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Phase 3: Access Control & Authentication</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Access Control Implementation
## Multi-Factor Authentication (MFA)
- Implement MFA for all administrative access
- MFA for remote network access
- MFA for access to CDE systems
- Biometric or token-based authentication
- Session management and timeout controls

## Role-Based Access Control (RBAC)
- Define user roles and responsibilities
- Implement least privilege access
- Regular access reviews and audits
- Automated provisioning/deprovisioning
- Emergency access procedures

## Physical Security Controls
- Data center access controls
- Visitor management procedures
- CCTV monitoring and recording
- Secure document storage
- Equipment disposal procedures`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Phase 4: Monitoring & Testing</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">Security Monitoring</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Real-time security monitoring</li>
                  <li>Intrusion detection systems</li>
                  <li>Security information and event management (SIEM)</li>
                  <li>Log management and analysis</li>
                  <li>Alerting and incident response</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">Security Testing</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Vulnerability scanning (internal/external)</li>
                  <li>Penetration testing</li>
                  <li>Wireless network testing</li>
                  <li>Application security testing</li>
                  <li>Physical security testing</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Phase 5: Documentation & Training</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">Required Documentation</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Information security policy</li>
                  <li>Security procedures and standards</li>
                  <li>Network architecture diagrams</li>
                  <li>Data flow diagrams</li>
                  <li>Risk assessment documentation</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">Training Program</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Security awareness training</li>
                  <li>Role-specific security training</li>
                  <li>Incident response training</li>
                  <li>Annual security training</li>
                  <li>Training effectiveness evaluation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Phase 6: Audit & Certification</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Audit Preparation Process
## Pre-Audit Activities
- Gap analysis and remediation
- Documentation review and updates
- Staff interviews preparation
- System configuration verification
- Security control testing validation

## Audit Execution
- On-site assessment procedures
- Staff interviews and observations
- System configuration reviews
- Security control testing
- Documentation verification

## Post-Audit Activities
- Corrective action plan development
- Remediation implementation
- Follow-up assessment procedures
- Certification maintenance procedures
- Continuous compliance monitoring`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">SAQ Types & Selection</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-bold text-blue-300 mb-2">SAQ A - Card-not-present merchants</h3>
                <p className="text-sm text-gray-200">Fully outsourced payment processing, no electronic storage, no processing, no transmission</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-bold text-green-300 mb-2">SAQ B - Imprint merchants</h3>
                <p className="text-sm text-gray-200">Standalone terminals, no electronic storage, no processing, no transmission</p>
              </div>
              <div className="border-l-4 border-yellow-600 pl-4">
                <h3 className="font-bold text-yellow-300 mb-2">SAQ C-VT - E-commerce merchants</h3>
                <p className="text-sm text-gray-200">Web-based virtual terminals, no electronic storage, no processing, no transmission</p>
              </div>
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="font-bold text-red-300 mb-2">SAQ D - All other merchants</h3>
                <p className="text-sm text-gray-200">All other environments with electronic storage, processing, or transmission</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Common Compliance Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">Challenge: Scope Creep</h3>
              <p className="text-sm text-red-700 mb-2">Difficulty defining and maintaining CDE boundaries</p>
              <p className="text-sm text-green-400"><strong>Solution:</strong> Regular scope reviews, network segmentation, documentation</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">Challenge: Third-party Risk</h3>
              <p className="text-sm text-yellow-700 mb-2">Managing compliance with service providers and partners</p>
              <p className="text-sm text-green-400"><strong>Solution:</strong> Due diligence, contractual requirements, monitoring</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">Challenge: Documentation Burden</h3>
              <p className="text-sm text-blue-700 mb-2">Extensive documentation and evidence requirements</p>
              <p className="text-sm text-green-400"><strong>Solution:</strong> Document management systems, automation, templates</p>
            </div>
            <div className="bg-purple-900 p-4 rounded-lg border border-purple-700">
              <h3 className="font-semibold text-purple-300 mb-2">Challenge: Continuous Compliance</h3>
              <p className="text-sm text-purple-700 mb-2">Maintaining compliance between annual assessments</p>
              <p className="text-sm text-green-400"><strong>Solution:</strong> Continuous monitoring, automated controls, regular reviews</p>
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
              <div className="font-semibold text-cyan-400">ISO 27001 Certification</div>
              <div className="text-sm text-gray-300">Complete certification guide</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
