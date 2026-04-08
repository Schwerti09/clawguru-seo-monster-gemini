import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-threat-model-template"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "AI Agent Threat Model Template: Complete Framework 2026"
  const description = "Complete AI agent threat model template with standardized threat assessment, risk analysis, and security control documentation for autonomous systems."
  return {
    title,
    description,
    keywords: ["ai agent threat model", "threat modeling template", "security framework", "risk assessment", "autonomous system security"],
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

export default function AiAgentThreatModelTemplatePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This guide is for threat modeling and security architecture. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">AI Agent Threat Model Template: Complete Framework</h1>
        <p className="text-lg text-gray-600 mb-8">Complete AI agent threat model template with standardized threat assessment, risk analysis, and security control documentation for autonomous systems.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Threat Model Template Overview</h2>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Template Components</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>System architecture documentation</li>
              <li>Asset identification and classification</li>
              <li>Threat analysis and categorization</li>
              <li>Risk assessment and prioritization</li>
              <li>Security control recommendations</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">System Architecture Documentation</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Architecture Components</h3>
                <ul className="space-y-2 text-sm">
                  <li>AI model and algorithms</li>
                  <li>Data processing pipelines</li>
                  <li>Decision-making logic</li>
                  <li>Interaction interfaces</li>
                  <li>External integrations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Trust Boundaries</h3>
                <ul className="space-y-2 text-sm">
                  <li>Data flow boundaries</li>
                  <li>Control flow boundaries</li>
                  <li>Network segmentation</li>
                  <li>Access control boundaries</li>
                  <li>Privilege escalation paths</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Asset Identification</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Asset Classification Framework
## Critical Assets
- AI model weights and parameters
- Training datasets and pipelines
- Decision logic and policies
- Authentication and authorization data
- Audit logs and monitoring data

## Important Assets
- Configuration files and settings
- API keys and secrets
- User data and preferences
- Performance metrics
- Communication interfaces

## Supporting Assets
- Documentation and manuals
- Development and testing environments
- Backup and recovery systems
- Monitoring and alerting tools
- Third-party integrations`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Threat Analysis Framework</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">STRIDE Categories</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>S</strong>poofing - Identity impersonation</li>
                  <li><strong>T</strong>ampering - Data or system modification</li>
                  <li><strong>R</strong>epudiation - Denial of actions</li>
                  <li><strong>I</strong>nformation Disclosure - Data leakage</li>
                  <li><strong>D</strong>enial of Service - Service disruption</li>
                  <li><strong>E</strong>levation of Privilege - Access escalation</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">AI-Specific Threats</h3>
                <ul className="space-y-2 text-sm">
                  <li>Prompt injection attacks</li>
                  <li>Data poisoning and manipulation</li>
                  <li>Model inversion attacks</li>
                  <li>Membership inference attacks</li>
                  <li>Adversarial examples</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Risk Assessment Methodology</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <div className="font-semibold">Likelihood Assessment</div>
                  <div className="text-sm text-gray-600">Assess the probability of threat occurrence based on historical data and current conditions</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <div className="font-semibold">Impact Analysis</div>
                  <div className="text-sm text-gray-600">Evaluate potential impact on confidentiality, integrity, and availability</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <div className="font-semibold">Risk Calculation</div>
                  <div className="text-sm text-gray-600">Calculate risk scores using likelihood x impact methodology</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <div className="font-semibold">Risk Prioritization</div>
                  <div className="text-sm text-gray-600">Prioritize risks based on calculated scores and business impact</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Security Control Recommendations</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Security Control Framework
## Preventive Controls
- Input validation and sanitization
- Authentication and authorization mechanisms
- Network segmentation and isolation
- Encryption at rest and in transit
- Secure development practices

## Detective Controls
- Real-time monitoring and alerting
- Behavioral analysis and anomaly detection
- Security logging and audit trails
- Intrusion detection systems
- Regular security assessments

## Corrective Controls
- Incident response procedures
- System recovery and restoration
- Security patch management
- Configuration management
- Forensic analysis capabilities

## Compensating Controls
- Multi-factor authentication
- Defense-in-depth architecture
- Redundancy and failover systems
- Insurance and risk transfer
- Compliance frameworks`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Threat Model Documentation Template</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Executive Summary</h3>
                <ul className="space-y-2 text-sm">
                  <li>System overview and purpose</li>
                  <li>Key findings and risks</li>
                  <li>Business impact assessment</li>
                  <li>Recommendations summary</li>
                  <li>Implementation timeline</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Technical Details</h3>
                <ul className="space-y-2 text-sm">
                  <li>Architecture diagrams</li>
                  <li>Data flow documentation</li>
                  <li>Threat analysis details</li>
                  <li>Risk assessment matrices</li>
                  <li>Control specifications</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Implementation Guidelines</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Development Phase</h3>
                <ul className="space-y-2 text-sm">
                  <li>Secure development lifecycle</li>
                  <li>Code review and analysis</li>
                  <li>Security testing integration</li>
                  <li>Threat model updates</li>
                  <li>Documentation maintenance</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Operational Phase</h3>
                <ul className="space-y-2 text-sm">
                  <li>Continuous monitoring</li>
                  <li>Regular security assessments</li>
                  <li>Incident response procedures</li>
                  <li>Security awareness training</li>
                  <li>Compliance verification</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Review and Maintenance</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Threat Model Maintenance Process
## Regular Reviews
- Quarterly threat model reviews
- Annual comprehensive assessments
- Architecture change triggers
- New threat intelligence integration
- Control effectiveness evaluation

## Update Triggers
- System architecture changes
- New technology adoption
- Security incident analysis
- Regulatory requirement changes
- Emerging threat identification

## Documentation Updates
- Version control management
- Change documentation
- Stakeholder communication
- Training material updates
- Compliance documentation`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Regular Updates</h3>
              <p className="text-sm text-blue-700">Update threat models regularly to reflect system changes and new threats</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Stakeholder Involvement</h3>
              <p className="text-sm text-green-700">Involve all relevant stakeholders in threat modeling process</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Documentation</h3>
              <p className="text-sm text-yellow-700">Maintain comprehensive documentation for threat models and controls</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Continuous Monitoring</h3>
              <p className="text-sm text-red-700">Continuously monitor for new threats and control effectiveness</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Template Examples</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Chatbot Threat Model</h3>
                <ul className="space-y-2 text-sm">
                  <li>Prompt injection threats</li>
                  <li>Data leakage risks</li>
                  <li>Unauthorized access controls</li>
                  <li>Privacy compliance requirements</li>
                  <li>Service availability concerns</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Autonomous Agent Threat Model</h3>
                <ul className="space-y-2 text-sm">
                  <li>Decision manipulation threats</li>
                  <li>Goal hijacking risks</li>
                  <li>Resource exploitation controls</li>
                  <li>Behavioral monitoring requirements</li>
                  <li>Fail-safe implementation needs</li>
                </ul>
              </div>
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
