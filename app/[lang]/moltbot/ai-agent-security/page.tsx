import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "AI Agent Security: Complete Protection Framework 2026"
  const description = "Complete AI agent security framework with threat protection, security controls, and defense mechanisms for autonomous systems and artificial intelligence."
  return {
    title,
    description,
    keywords: ["ai agent security", "autonomous system security", "ai protection", "agent security controls", "artificial intelligence security"],
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

export default function AiAgentSecurityPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This guide is for AI agent security and protection. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">AI Agent Security: Complete Protection Framework</h1>
        <p className="text-lg text-gray-600 mb-8">Complete AI agent security framework with threat protection, security controls, and defense mechanisms for autonomous systems and artificial intelligence.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">AI Agent Security Overview</h2>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Security Challenges</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Autonomous decision-making security</li>
              <li>Self-modifying code protection</li>
              <li>Complex interaction security</li>
              <li>Distributed system vulnerabilities</li>
              <li>Real-time learning security</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Security Architecture</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-3">Input Layer Security</h3>
                <ul className="space-y-2 text-sm">
                  <li>Input validation and sanitization</li>
                  <li>Prompt injection protection</li>
                  <li>Data poisoning prevention</li>
                  <li>Content filtering and moderation</li>
                  <li>Anomaly detection for inputs</li>
                </ul>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-3">Processing Layer Security</h3>
                <ul className="space-y-2 text-sm">
                  <li>Sandboxed execution environments</li>
                  <li>Resource allocation limits</li>
                  <li>Memory and processing constraints</li>
                  <li>Network access controls</li>
                  <li>File system isolation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Threat Protection Mechanisms</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# AI Agent Threat Protection
## Input Protection
- Prompt injection detection and prevention
- Input validation and sanitization
- Content filtering and moderation
- Anomaly detection for malicious inputs
- Rate limiting and throttling

## Processing Protection
- Sandboxed execution environments
- Resource allocation limits
- Memory and processing constraints
- Network access controls
- File system isolation

## Output Protection
- Output validation and filtering
- Content sanitization
- Data leakage prevention
- Audit logging of outputs
- Compliance checking`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Security Controls Implementation</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-3">Preventive Controls</h3>
                <ul className="space-y-2 text-sm">
                  <li>Input validation and sanitization</li>
                  <li>Prompt engineering and templating</li>
                  <li>Access control and authentication</li>
                  <li>Network segmentation and isolation</li>
                  <li>Secure development practices</li>
                </ul>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
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
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Autonomous System Security</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <div className="font-semibold">Decision Validation</div>
                  <div className="text-sm text-gray-600">Validate autonomous decisions against security policies</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <div className="font-semibold">Behavior Monitoring</div>
                  <div className="text-sm text-gray-600">Monitor agent behavior for anomalies and security violations</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <div className="font-semibold">Intervention Mechanisms</div>
                  <div className="text-sm text-gray-600">Implement human intervention and override capabilities</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <div className="font-semibold">Fail-safe Mechanisms</div>
                  <div className="text-sm text-gray-600">Implement fail-safe mechanisms for security violations</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Machine Learning Security</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# ML Security Controls
## Model Protection
- Model encryption and access control
- Model versioning and integrity checking
- Adversarial training and robustness
- Model watermarking and attribution
- Secure model deployment

## Training Security
- Secure data pipelines
- Training data validation
- Poisoning attack prevention
- Privacy-preserving training
- Federated learning security

## Inference Security
- Secure inference environments
- Input validation and sanitization
- Output filtering and monitoring
- Resource usage monitoring
- Privacy protection mechanisms`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Compliance and Governance</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-3">Regulatory Compliance</h3>
                <ul className="space-y-2 text-sm">
                  <li>GDPR data protection requirements</li>
                  <li>AI Act compliance (EU)</li>
                  <li>Industry-specific regulations</li>
                  <li>Data retention policies</li>
                  <li>Privacy by design principles</li>
                </ul>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
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
          <h2 className="text-2xl font-semibold mb-4">Monitoring and Incident Response</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-3">Real-time Monitoring</h3>
                <ul className="space-y-2 text-sm">
                  <li>Agent behavior tracking</li>
                  <li>Performance metrics monitoring</li>
                  <li>Resource utilization tracking</li>
                  <li>Security event correlation</li>
                  <li>Anomaly detection systems</li>
                </ul>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-3">Incident Response</h3>
                <ul className="space-y-2 text-sm">
                  <li>Incident identification and classification</li>
                  <li>Immediate containment procedures</li>
                  <li>Investigation and root cause analysis</li>
                  <li>Remediation and recovery actions</li>
                  <li>Post-incident review and improvement</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Testing and Validation</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Security Testing Framework
## Adversarial Testing
- Prompt injection testing
- Adversarial example generation
- Model inversion testing
- Membership inference testing
- Data poisoning simulation

## Security Validation
- Penetration testing
- Vulnerability assessment
- Security control testing
- Configuration validation
- Compliance testing

## Performance Testing
- Load testing under attack conditions
- Stress testing with malicious inputs
- Resource exhaustion testing
- Scalability testing
- Reliability testing`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Security by Design</h3>
              <p className="text-sm text-blue-700">Implement security controls from the beginning of AI agent development</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Defense in Depth</h3>
              <p className="text-sm text-green-700">Layer multiple security controls for comprehensive protection</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Continuous Monitoring</h3>
              <p className="text-sm text-yellow-700">Maintain continuous monitoring for security and performance</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Regular Updates</h3>
              <p className="text-sm text-red-700">Regularly update security controls and threat models</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Implementation Examples</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-3">Chatbot Security</h3>
                <ul className="space-y-2 text-sm">
                  <li>Input validation and sanitization</li>
                  <li>Prompt injection protection</li>
                  <li>Output filtering and monitoring</li>
                  <li>Rate limiting and throttling</li>
                  <li>Behavioral analysis</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Autonomous Agent Security</h3>
                <ul className="space-y-2 text-sm">
                  <li>Decision validation frameworks</li>
                  <li>Behavior monitoring systems</li>
                  <li>Human intervention mechanisms</li>
                  <li>Fail-safe implementations</li>
                  <li>Resource constraint enforcement</li>
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
