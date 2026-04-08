import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-hardening-guide"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "AI Agent Hardening Guide: Complete Security Framework 2026"
  const description = "Complete AI agent hardening guide with security best practices, configuration hardening, and defense mechanisms for autonomous systems and artificial intelligence."
  return {
    title,
    description,
    keywords: ["ai agent hardening", "security hardening", "ai security", "autonomous system security", "artificial intelligence protection"],
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

export default function AiAgentHardeningGuidePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This guide is for security hardening and protection. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">AI Agent Hardening Guide: Complete Security Framework</h1>
        <p className="text-lg text-gray-600 mb-8">Complete AI agent hardening guide with security best practices, configuration hardening, and defense mechanisms for autonomous systems and artificial intelligence.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">AI Agent Hardening Overview</h2>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Hardening Objectives</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Reduce attack surface and vulnerabilities</li>
              <li>Implement defense-in-depth security</li>
              <li>Secure data handling and processing</li>
              <li>Control autonomous decision-making</li>
              <li>Ensure compliance and governance</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Input Hardening</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Input Validation</h3>
                <ul className="space-y-2 text-sm">
                  <li>Strict input type validation</li>
                  <li>Length and format restrictions</li>
                  <li>Character set limitations</li>
                  <li>Encoding normalization</li>
                  <li>Malicious pattern detection</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Prompt Security</h3>
                <ul className="space-y-2 text-sm">
                  <li>Prompt injection prevention</li>
                  <li>Template-based prompts</li>
                  <li>Input sanitization</li>
                  <li>Context isolation</li>
                  <li>Behavioral constraints</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Processing Hardening</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Processing Security Controls
## Execution Environment
- Sandboxed processing environments
- Container isolation and limits
- Resource allocation controls
- Network access restrictions
- File system isolation

## Model Protection
- Model encryption and access control
- Parameter protection mechanisms
- Weight and bias integrity checks
- Model versioning and validation
- Secure inference environments

## Memory Management
- Secure memory allocation
- Data sanitization in memory
- Memory access controls
- Heap protection mechanisms
- Stack protection measures`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Output Hardening</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Output Validation</h3>
                <ul className="space-y-2 text-sm">
                  <li>Output content validation</li>
                  <li>Format and structure checks</li>
                  <li>Malicious content filtering</li>
                  <li>Confidentiality verification</li>
                  <li>Compliance checking</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Data Leakage Prevention</h3>
                <ul className="space-y-2 text-sm">
                  <li>Sensitive data detection</li>
                  <li>PII identification and masking</li>
                  <li>Trade secret protection</li>
                  <li>Information flow control</li>
                  <li>Audit trail generation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Autonomous System Hardening</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <div className="font-semibold">Decision Validation</div>
                  <div className="text-sm text-gray-600">Implement multi-layer validation for autonomous decisions</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <div className="font-semibold">Behavioral Constraints</div>
                  <div className="text-sm text-gray-600">Define and enforce behavioral boundaries and limits</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <div className="font-semibold">Human Oversight</div>
                  <div className="text-sm text-gray-600">Implement human-in-the-loop oversight mechanisms</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <div className="font-semibold">Fail-safe Mechanisms</div>
                  <div className="text-sm text-gray-600">Implement automatic fail-safe and emergency stop</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Network Hardening</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Network Security Controls
## Access Control
- Network segmentation and isolation
- Firewall rule implementation
- VPN and secure tunneling
- IP whitelisting and blacklisting
- Port and protocol restrictions

## Communication Security
- End-to-end encryption
- Certificate-based authentication
- Secure API gateways
- Message integrity verification
- Rate limiting and throttling

## Monitoring and Detection
- Network traffic analysis
- Anomaly detection systems
- Intrusion detection and prevention
- Log aggregation and analysis
- Real-time alerting mechanisms`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Data Security Hardening</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Data Protection</h3>
                <ul className="space-y-2 text-sm">
                  <li>Encryption at rest and in transit</li>
                  <li>Key management and rotation</li>
                  <li>Data classification and labeling</li>
                  <li>Access control and permissions</li>
                  <li>Data retention and deletion</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Privacy Controls</h3>
                <ul className="space-y-2 text-sm">
                  <li>PII detection and masking</li>
                  <li>Data anonymization techniques</li>
                  <li>Privacy by design principles</li>
                  <li>Consent management systems</li>
                  <li>GDPR compliance measures</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Infrastructure Hardening</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Container Security</h3>
                <ul className="space-y-2 text-sm">
                  <li>Minimal base images</li>
                  <li>Container image scanning</li>
                  <li>Runtime security monitoring</li>
                  <li>Resource limits and quotas</li>
                  <li>Network isolation policies</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Cloud Security</h3>
                <ul className="space-y-2 text-sm">
                  <li>Cloud security posture management</li>
                  <li>Identity and access management</li>
                  <li>Configuration management</li>
                  <li>Compliance monitoring</li>
                  <li>Cost and resource optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Monitoring and Logging Hardening</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Monitoring Security Framework
## Security Monitoring
- Real-time threat detection
- Behavioral analysis systems
- Anomaly detection algorithms
- Security event correlation
- Automated alerting mechanisms

## Logging and Auditing
- Comprehensive audit trails
- Immutable log storage
- Log aggregation and analysis
- Security log monitoring
- Forensic data preservation

## Performance Monitoring
- Resource utilization tracking
- Performance baseline establishment
- Anomaly detection in performance
- Capacity planning metrics
- Service availability monitoring`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Hardening Checklist</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Input Security</h3>
                <ul className="space-y-2 text-sm">
                  <li>Input validation implemented</li>
                  <li>Prompt injection protection</li>
                  <li>Malicious content filtering</li>
                  <li>Rate limiting configured</li>
                  <li>Input logging enabled</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Processing Security</h3>
                <ul className="space-y-2 text-sm">
                  <li>Sandboxed execution environment</li>
                  <li>Resource limits enforced</li>
                  <li>Network access restricted</li>
                  <li>Memory protection enabled</li>
                  <li>Process isolation configured</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Output Security</h3>
                <ul className="space-y-2 text-sm">
                  <li>Output validation implemented</li>
                  <li>Data leakage prevention</li>
                  <li>Content filtering enabled</li>
                  <li>Output logging configured</li>
                  <li>Compliance checking active</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Infrastructure Security</h3>
                <ul className="space-y-2 text-sm">
                  <li>Container security configured</li>
                  <li>Network segmentation implemented</li>
                  <li>Access control enforced</li>
                  <li>Monitoring systems active</li>
                  <li>Backup and recovery ready</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Defense in Depth</h3>
              <p className="text-sm text-blue-700">Implement multiple layers of security controls for comprehensive protection</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Least Privilege</h3>
              <p className="text-sm text-green-700">Apply principle of least privilege to all system components and access</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Continuous Monitoring</h3>
              <p className="text-sm text-yellow-700">Maintain continuous monitoring and regular security assessments</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Regular Updates</h3>
              <p className="text-sm text-red-700">Keep all systems and security controls updated and patched</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Implementation Examples</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Chatbot Hardening</h3>
                <ul className="space-y-2 text-sm">
                  <li>Input validation and sanitization</li>
                  <li>Prompt injection protection</li>
                  <li>Output filtering and monitoring</li>
                  <li>Rate limiting and throttling</li>
                  <li>Behavioral analysis</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Autonomous Agent Hardening</h3>
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
