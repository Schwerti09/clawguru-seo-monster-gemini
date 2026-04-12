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
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: locale === 'de' ? 'Was ist ISO 27001 und wer braucht es?' : 'What is ISO 27001 and who needs it?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'ISO 27001 ist der internationale Standard für Information Security Management Systems (ISMS). Pflicht/Empfehlung für: B2B-SaaS-Anbieter die Enterprise-Kunden bedienen, Cloud-Dienstleister, Finanzdienstleister, Gesundheitswesen, öffentliche Aufträge der EU. ISO 27001 Zertifizierung signalisiert Reife und öffnet Enterprise-Vertriebstüren.' : 'ISO 27001 is the international standard for Information Security Management Systems (ISMS). Required/recommended for: B2B SaaS vendors serving enterprise customers, cloud service providers, financial services, healthcare, EU public contracts. ISO 27001 certification signals maturity and opens enterprise sales doors.' } },
      { '@type': 'Question', name: locale === 'de' ? 'Wie lange dauert eine ISO 27001 Zertifizierung?' : 'How long does ISO 27001 certification take?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'ISO 27001 Zeitplan: Gap-Analyse (4-6 Wochen), ISMS-Aufbau und Dokumentation (3-6 Monate), Internes Audit (4 Wochen), Management Review (2 Wochen), Stage 1 Audit (Dokumentenprüfung, 1-2 Tage), Stage 2 Audit (Implementierungsprüfung, 2-5 Tage), Zertifikat (2-4 Wochen nach Audit). Gesamtdauer: 6-18 Monate.' : 'ISO 27001 timeline: gap analysis (4-6 weeks), ISMS build and documentation (3-6 months), internal audit (4 weeks), management review (2 weeks), Stage 1 audit (document review, 1-2 days), Stage 2 audit (implementation review, 2-5 days), certificate (2-4 weeks after audit). Total duration: 6-18 months.' } },
      { '@type': 'Question', name: locale === 'de' ? 'Was sind die ISO 27001 Annexe A Controls?' : 'What are the ISO 27001 Annex A controls?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'ISO 27001:2022 Annex A hat 93 Controls in 4 Kategorien: Organisational (37), People (8), Physical (14), Technological (34). Neue Controls 2022: Threat Intelligence, Information Security for Cloud Services, ICT Readiness for Business Continuity, Web Filtering, Secure Coding. Alle Controls bewerten, nicht alle müssen implementiert werden (Statement of Applicability).' : 'ISO 27001:2022 Annex A has 93 controls in 4 categories: Organisational (37), People (8), Physical (14), Technological (34). New 2022 controls: Threat Intelligence, Information Security for Cloud Services, ICT Readiness for Business Continuity, Web Filtering, Secure Coding. Evaluate all controls, not all need to be implemented (Statement of Applicability).' } },
      { '@type': 'Question', name: locale === 'de' ? 'Was kostet eine ISO 27001 Zertifizierung?' : 'How much does ISO 27001 certification cost?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'ISO 27001 Kosten (Startups/KMU): Externer Berater/Gap-Analyse: 5.000-20.000 EUR. ISMS-Tool/GRC-Platform: 3.000-15.000 EUR/Jahr. Zertifizierungsstelle (BSI, TÜV, Bureau Veritas): Stage 1+2 Audit 8.000-25.000 EUR. Überwachungsaudits jährlich: 3.000-8.000 EUR. Gesamtkosten erstmalig: 20.000-60.000 EUR. Re-Zertifizierung alle 3 Jahre.' : 'ISO 27001 costs (startups/SME): external consultant/gap analysis: 5,000-20,000 EUR. ISMS tool/GRC platform: 3,000-15,000 EUR/year. Certification body (BSI, TÜV, Bureau Veritas): Stage 1+2 audit 8,000-25,000 EUR. Annual surveillance audits: 3,000-8,000 EUR. Total first-time cost: 20,000-60,000 EUR. Re-certification every 3 years.' } },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for compliance and security implementation. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">ISO 27001 Certification Roadmap: Complete Guide</h1>
        <p className="text-lg text-gray-300 mb-8">Step-by-step implementation guide for ISO 27001:2022 certification with security controls, compliance requirements, and audit preparation.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">ISO 27001:2022 Overview</h2>
          <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-100">Key Changes in 2022 Version</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Focus on information security risk management</li>
              <li>Integration with other management systems</li>
              <li>Enhanced business continuity requirements</li>
              <li>Updated security controls and annex</li>
              <li>Emphasis on cloud security and outsourcing</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Phase 1: Foundation & Planning</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">1.1 Management Commitment</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Obtain executive sponsorship</li>
                  <li>Define information security policy</li>
                  <li>Allocate resources and budget</li>
                  <li>Establish project timeline</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">1.2 Scope Definition</h3>
                <ul className="space-y-2 text-sm text-gray-300">
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Phase 2: Risk Assessment</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Phase 3: Control Implementation</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">3.1 Organizational Controls</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>A.5.1 Policies for information security</li>
                  <li>A.5.37 Documented operating procedures</li>
                  <li>A.6.1 Information security roles and responsibilities</li>
                  <li>A.6.3 Segregation of duties</li>
                  <li>A.7.4 Terms and conditions of employment</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">3.2 Technical Controls</h3>
                <ul className="space-y-2 text-sm text-gray-300">
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Phase 4: Documentation & Training</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">4.1 Required Documentation</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Information security policy</li>
                  <li>Scope and boundaries</li>
                  <li>Risk assessment methodology</li>
                  <li>Statement of applicability</li>
                  <li>Control objectives and controls</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">4.2 Training Program</h3>
                <ul className="space-y-2 text-sm text-gray-300">
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Phase 5: Monitoring & Review</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Phase 6: Certification Audit</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">6.1 Stage 1 Audit</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Documentation review</li>
                  <li>Policy compliance assessment</li>
                  <li>Readiness evaluation</li>
                  <li>Gap identification</li>
                  <li>Pre-audit recommendations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">6.2 Stage 2 Audit</h3>
                <ul className="space-y-2 text-sm text-gray-300">
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Implementation Timeline</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-100">Months 1-2: Foundation</div>
                  <div className="text-sm text-gray-300">Management commitment, scope definition, policy development</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-100">Months 3-4: Risk Assessment</div>
                  <div className="text-sm text-gray-300">Asset identification, risk analysis, treatment planning</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-100">Months 5-8: Control Implementation</div>
                  <div className="text-sm text-gray-300">Security controls deployment, documentation, training</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-100">Months 9-10: Internal Audit</div>
                  <div className="text-sm text-gray-300">Internal audits, gap analysis, corrective actions</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-100">Months 11-12: Certification</div>
                  <div className="text-sm text-gray-300">External audit, certification, maintenance planning</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Common Challenges & Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">Challenge: Resource Constraints</h3>
              <p className="text-sm text-red-700 mb-2">Limited budget and personnel for implementation</p>
              <p className="text-sm text-green-400"><strong>Solution:</strong> Phased implementation, prioritize high-risk areas</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">Challenge: Documentation Overload</h3>
              <p className="text-sm text-yellow-700 mb-2">Excessive documentation requirements</p>
              <p className="text-sm text-green-400"><strong>Solution:</strong> Use document management systems, automate where possible</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">Challenge: Employee Resistance</h3>
              <p className="text-sm text-blue-700 mb-2">Staff resistance to new security procedures</p>
              <p className="text-sm text-green-400"><strong>Solution:</strong> Comprehensive training, communication of benefits</p>
            </div>
            <div className="bg-purple-900 p-4 rounded-lg border border-purple-700">
              <h3 className="font-semibold text-purple-300 mb-2">Challenge: Maintenance Burden</h3>
              <p className="text-sm text-purple-700 mb-2">Ongoing maintenance and compliance requirements</p>
              <p className="text-sm text-green-400"><strong>Solution:</strong> Automated monitoring, continuous improvement processes</p>
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
              <div className="font-semibold text-cyan-400">SOC2 Compliance</div>
              <div className="text-sm text-gray-300">Compliance automation</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
