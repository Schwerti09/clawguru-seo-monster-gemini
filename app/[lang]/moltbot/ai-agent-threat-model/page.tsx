import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-threat-model"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "AI Agent Threat Modeling: Security Framework 2026"
  const description = "Complete AI agent threat modeling guide with security frameworks, attack vectors, and protection strategies for autonomous systems."
  return {
    title,
    description,
    keywords: ["ai agent threat modeling", "autonomous system security", "ai security framework", "threat modeling", "agent security"],
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

export default function AiAgentThreatModelPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This guide is for security architecture decisions. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">AI Agent Threat Modeling: Security Framework</h1>
        <p className="text-lg text-gray-600 mb-8">Complete AI agent threat modeling framework with attack vectors, security controls, and protection strategies for autonomous systems.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">AI Agent Security Overview</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Unique AI Agent Challenges</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Autonomous decision-making capabilities</li>
              <li>Self-modifying code and behavior</li>
              <li>Complex interaction patterns</li>
              <li>Distributed system dependencies</li>
              <li>Real-time learning and adaptation</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">AI Agent Threat Categories</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">External Threats</h3>
                <ul className="space-y-2 text-sm">
                  <li>Prompt injection attacks</li>
                  <li>Data poisoning and manipulation</li>
                  <li>Model inversion attacks</li>
                  <li>Membership inference attacks</li>
                  <li>Adversarial examples</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Internal Threats</h3>
                <ul className="space-y-2 text-sm">
                  <li>Goal misalignment</li>
                  <li>Unintended behavior emergence</li>
                  <li>Resource exploitation</li>
                  <li>Privilege escalation</li>
                  <li>Data leakage</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Threat Modeling Framework</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# AI Agent Threat Modeling Process
## Asset Identification
- Core AI model weights and parameters
- Training datasets and pipelines
- Agent decision logic and policies
- Communication interfaces and APIs
- Data storage and processing systems

## Threat Analysis
- STRIDE threat modeling (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)
- AI-specific threat vectors (prompt injection, data poisoning, model extraction)
- Supply chain threats (third-party models, dependencies)
- Operational threats (resource exhaustion, model drift)

## Risk Assessment
- Impact analysis (data breach, model compromise, service disruption)
- Likelihood assessment (attack complexity, required resources)
- Risk prioritization (CVSS-like scoring for AI threats)
- Mitigation strategy selection`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Attack Vector Analysis</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="font-bold text-red-800 mb-2">Prompt Injection</h3>
                <p className="text-sm text-gray-700 mb-2">Malicious input manipulation to alter agent behavior</p>
                <p className="text-sm text-green-600"><strong>Mitigation:</strong> Input validation, prompt sanitization, behavior monitoring</p>
              </div>
              <div className="border-l-4 border-orange-600 pl-4">
                <h3 className="font-bold text-orange-800 mb-2">Data Poisoning</h3>
                <p className="text-sm text-gray-700 mb-2">Contamination of training data to influence model behavior</p>
                <p className="text-sm text-green-600"><strong>Mitigation:</strong> Data provenance, anomaly detection, model validation</p>
              </div>
              <div className="border-l-4 border-yellow-600 pl-4">
                <h3 className="font-bold text-yellow-800 mb-2">Model Extraction</h3>
                <p className="text-sm text-gray-700 mb-2">Reverse engineering of model parameters and training data</p>
                <p className="text-sm text-green-600"><strong>Mitigation:</strong> Access controls, query limits, differential privacy</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-bold text-blue-800 mb-2">Goal Hijacking</h3>
                <p className="text-sm text-gray-700 mb-2">Manipulation of agent objectives to achieve malicious goals</p>
                <p className="text-sm text-green-600"><strong>Mitigation:</strong> Objective validation, behavior monitoring, safety constraints</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Security Controls Implementation</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Preventive Controls</h3>
                <ul className="space-y-2 text-sm">
                  <li>Input validation and sanitization</li>
                  <li>Prompt engineering and templating</li>
                  <li>Access control and authentication</li>
                  <li>Network segmentation and isolation</li>
                  <li>Secure development practices</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Detective Controls</h3>
                <ul className="space-y-2 text-sm">
                  <li>Behavioral analysis and monitoring</li>
                  <li>Anomaly detection systems</li>
                  <li>Security logging and auditing</li>
                  <li>Real-time threat detection</li>
                  <li>Model performance monitoring</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Corrective Controls</h3>
                <ul className="space-y-2 text-sm">
                  <li>Incident response procedures</li>
                  <li>Model rollback mechanisms</li>
                  <li>System isolation and containment</li>
                  <li>Data recovery procedures</li>
                  <li>Post-incident analysis</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Compensating Controls</h3>
                <ul className="space-y-2 text-sm">
                  <li>Multi-factor authentication</li>
                  <li>Defense-in-depth architecture</li>
                  <li>Redundancy and failover systems</li>
                  <li>Insurance and risk transfer</li>
                  <li>Compliance frameworks</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">AI Agent Security Architecture</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Secure AI Agent Architecture
## Input Layer Security
- Input validation and sanitization
- Prompt template management
- Rate limiting and throttling
- Content filtering and moderation
- Anomaly detection for inputs

## Processing Layer Security
- Sandboxed execution environments
- Resource allocation limits
- Memory and processing constraints
- Network access controls
- File system isolation

## Output Layer Security
- Output validation and filtering
- Content sanitization
- Data leakage prevention
- Audit logging of outputs
- Compliance checking

## Monitoring Layer Security
- Real-time behavior monitoring
- Performance metrics tracking
- Security event correlation
- Alerting and notification systems
- Forensic analysis capabilities`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Compliance and Governance</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Regulatory Compliance</h3>
                <ul className="space-y-2 text-sm">
                  <li>GDPR data protection requirements</li>
                  <li>AI Act compliance (EU)</li>
                  <li>Industry-specific regulations</li>
                  <li>Data retention policies</li>
                  <li>Privacy by design principles</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Ethical Governance</h3>
                <ul className="space-y-2 text-sm">
                  <li>Fairness and bias mitigation</li>
                  <li>Transparency and explainability</li>
                  <li>Human oversight requirements</li>
                  <li>Accountability frameworks</li>
                  <li>Risk assessment procedures</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Testing and Validation</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <div className="font-semibold">Security Testing</div>
                  <div className="text-sm text-gray-600">Penetration testing, vulnerability assessment, security scanning</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <div className="font-semibold">AI-Specific Testing</div>
                  <div className="text-sm text-gray-600">Adversarial testing, robustness testing, safety testing</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <div className="font-semibold">Performance Testing</div>
                  <div className="text-sm text-gray-600">Load testing, stress testing, scalability testing</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <div className="font-semibold">Compliance Testing</div>
                  <div className="text-sm text-gray-600">Regulatory compliance, ethical guidelines, standards compliance</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Monitoring and Incident Response</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# AI Agent Monitoring Framework
## Real-time Monitoring
- Agent behavior tracking
- Performance metrics monitoring
- Resource utilization tracking
- Security event correlation
- Anomaly detection systems

## Incident Response Process
- Incident identification and classification
- Immediate containment procedures
- Investigation and root cause analysis
- Remediation and recovery actions
- Post-incident review and improvement

## Continuous Improvement
- Threat intelligence integration
- Security control effectiveness monitoring
- Regular security assessments
- Staff training and awareness
- Process optimization and automation`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Design Principles</h3>
              <p className="text-sm text-blue-700">Security by design, defense in depth, least privilege, fail-safe defaults</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Development Practices</h3>
              <p className="text-sm text-green-700">Secure coding, code review, automated testing, dependency management</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Operational Practices</h3>
              <p className="text-sm text-yellow-700">Regular updates, patch management, backup procedures, disaster recovery</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Governance Practices</h3>
              <p className="text-sm text-red-700">Policy enforcement, compliance monitoring, risk management, audit trails</p>
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
