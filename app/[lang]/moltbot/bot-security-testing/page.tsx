import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/bot-security-testing"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "Bot Security Testing: Complete Framework 2026"
  const description = "Complete bot security testing framework with automated testing, vulnerability assessment, and security validation for chatbots and automated systems."
  return {
    title,
    description,
    keywords: ["bot security testing", "chatbot security", "automated testing", "bot vulnerability assessment", "ai security testing"],
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

export default function BotSecurityTestingPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === 'de'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: isDE ? 'Was ist Bot Security Testing?' : 'What is bot security testing?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Bot Security Testing pr\u00fcft Chatbots und automatisierte Systeme auf Sicherheitsl\u00fccken. Testbereiche: Authentifizierung (Session-Hijacking), Autorisierung (unberechtigte Aktionen), Input-Validierung (Injection, XSS), Rate Limiting, Prompt Injection bei LLM-basierten Bots, Datenlecks in Antworten.' : 'Bot security testing checks chatbots and automated systems for security vulnerabilities. Test areas: authentication (session hijacking), authorization (unauthorized actions), input validation (injection, XSS), rate limiting, prompt injection for LLM-based bots, data leaks in responses.' } },
      { '@type': 'Question', name: isDE ? 'Wie teste ich einen Chatbot auf Prompt Injection?' : 'How do I test a chatbot for prompt injection?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Chatbot Prompt Injection Tests: Standard-Jailbreaks testen ("Ignore previous instructions..."). Indirekte Injections \u00fcber externe Datenquellen. Role-Playing Angriffe ("Du bist jetzt ein anderer Assistent"). Boundary Testing: System-Prompt-Extraktion versuchen. Tools: Garak (LLM-Security-Scanner), custom Test-Suites. Dokumentation aller gefundenen Bypass-M\u00f6glichkeiten.' : 'Chatbot prompt injection tests: test standard jailbreaks ("Ignore previous instructions..."). Indirect injections via external data sources. Role-playing attacks ("You are now a different assistant"). Boundary testing: attempt system prompt extraction. Tools: Garak (LLM security scanner), custom test suites. Document all found bypass possibilities.' } },
      { '@type': 'Question', name: isDE ? 'Wie sichere ich Bot-API-Endpunkte ab?' : 'How do I secure bot API endpoints?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Bot API Security: Rate Limiting per User/IP (z.B. 10 Req/Min f\u00fcr kostenlose Tier). API-Key-Authentifizierung mit kurzer Expiry. Input-Validierung: max. Token-L\u00e4nge, verbotene Muster. Output-Filtering: keine sensiblen Daten (Keys, Passworts) in Antworten. CORS-Konfiguration: nur erlaubte Origins. Monitoring: ungewohnte Usage-Patterns alert.' : 'Bot API security: rate limiting per user/IP (e.g. 10 req/min for free tier). API key authentication with short expiry. Input validation: max token length, forbidden patterns. Output filtering: no sensitive data (keys, passwords) in responses. CORS configuration: only allowed origins. Monitoring: alert on unusual usage patterns.' } },
      { '@type': 'Question', name: isDE ? 'Welche Tools gibt es f\u00fcr automatisiertes Bot Security Testing?' : 'What tools exist for automated bot security testing?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Bot Security Testing Tools: Garak (LLM-Vulnerability-Scanner, Open Source). PromptBench (Robustness-Testing f\u00fcr LLMs). OWASP ZAP (Web-API-Security-Testing). Burp Suite (HTTP-Interception f\u00fcr Bot-APIs). Custom Playwright-Scripts f\u00fcr Chatbot-UI-Tests. PyRIT (Microsoft Red Team Tool f\u00fcr AI). Regelm\u00e4\u00dfige Regression-Tests nach Modell-Updates.' : 'Bot security testing tools: Garak (LLM vulnerability scanner, open source). PromptBench (robustness testing for LLMs). OWASP ZAP (web API security testing). Burp Suite (HTTP interception for bot APIs). Custom Playwright scripts for chatbot UI tests. PyRIT (Microsoft red team tool for AI). Regular regression tests after model updates.' } },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for security testing and validation. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Bot Security Testing: Complete Framework</h1>
        <p className="text-lg text-gray-300 mb-8">Complete bot security testing framework with automated testing, vulnerability assessment, and security validation for chatbots and automated systems.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Bot Security Testing Overview</h2>
          <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-100">Testing Objectives</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Identify security vulnerabilities in bot implementations</li>
              <li>Validate input sanitization and output encoding</li>
              <li>Test authentication and authorization mechanisms</li>
              <li>Assess data handling and privacy compliance</li>
              <li>Evaluate bot behavior under attack scenarios</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Bot Security Testing Framework</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Static Analysis</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Code review and analysis</li>
                  <li>Dependency vulnerability scanning</li>
                  <li>Configuration security assessment</li>
                  <li>Secret detection and validation</li>
                  <li>API security analysis</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Dynamic Testing</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Input validation testing</li>
                  <li>Authentication bypass testing</li>
                  <li>Authorization testing</li>
                  <li>Data leakage testing</li>
                  <li>Behavioral analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Common Bot Vulnerabilities</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Bot Vulnerability Categories
## Input Validation Vulnerabilities
- Prompt injection attacks
- Command injection vulnerabilities
- SQL injection through bot inputs
- Cross-site scripting (XSS) in bot responses
- Buffer overflow vulnerabilities

## Authentication & Authorization Issues
- Weak or missing authentication
- Session management flaws
- Authorization bypass vulnerabilities
- Token management issues
- Multi-factor authentication bypass

## Data Handling Vulnerabilities
- Sensitive data exposure
- Data leakage through responses
- Insecure data storage
- Privacy compliance violations
- Data integrity issues`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Automated Testing Tools</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Open Source Tools</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>OWASP ZAP for API testing</li>
                  <li>Burp Suite for web application testing</li>
                  <li>Nuclei for vulnerability scanning</li>
                  <li>Semgrep for static analysis</li>
                  <li>Bandit for Python security analysis</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Commercial Tools</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Checkmarx for static analysis</li>
                  <li>Veracode for application security</li>
                  <li>Fortify for code analysis</li>
                  <li>Qualys for vulnerability management</li>
                  <li>Rapid7 for penetration testing</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Testing Methodology</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <div className="font-semibold text-gray-100">Reconnaissance</div>
                  <div className="text-sm text-gray-300">Gather information about bot architecture, endpoints, and functionality</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <div className="font-semibold text-gray-100">Vulnerability Scanning</div>
                  <div className="text-sm text-gray-300">Automated scanning for known vulnerabilities and misconfigurations</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <div className="font-semibold text-gray-100">Manual Testing</div>
                  <div className="text-sm text-gray-300">Manual testing for complex vulnerabilities and business logic flaws</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <div className="font-semibold text-gray-100">Reporting</div>
                  <div className="text-sm text-gray-300">Document findings and provide remediation recommendations</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Test Cases and Scenarios</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Bot Security Test Cases
## Input Validation Tests
- SQL injection attempts in bot inputs
- XSS payloads in user messages
- Command injection through special characters
- Buffer overflow testing with large inputs
- Unicode and encoding bypass attempts

## Authentication Tests
- Valid credentials testing
- Invalid credentials testing
- Brute force attack simulation
- Session hijacking attempts
- Token manipulation testing

## Authorization Tests
- Privilege escalation attempts
- Access control bypass testing
- Role-based access validation
- Resource access validation
- Cross-tenant data access testing`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Security Testing Checklist</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Input Security</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Input validation and sanitization</li>
                  <li>Output encoding and escaping</li>
                  <li>SQL injection protection</li>
                  <li>XSS prevention mechanisms</li>
                  <li>Command injection protection</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Authentication Security</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Strong password policies</li>
                  <li>Multi-factor authentication</li>
                  <li>Session management</li>
                  <li>Token security</li>
                  <li>Rate limiting and throttling</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Data Security</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Data encryption at rest</li>
                  <li>Data encryption in transit</li>
                  <li>Data masking and anonymization</li>
                  <li>Access control mechanisms</li>
                  <li>Audit logging and monitoring</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">Infrastructure Security</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Network security configuration</li>
                  <li>Container security</li>
                  <li>Cloud security settings</li>
                  <li>API security</li>
                  <li>Dependency security</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Continuous Security Testing</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">CI/CD Integration</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Automated security testing in pipelines</li>
                  <li>Static analysis integration</li>
                  <li>Dynamic testing automation</li>
                  <li>Dependency scanning</li>
                  <li>Container security scanning</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-cyan-400 mb-3">Monitoring and Alerting</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Real-time security monitoring</li>
                  <li>Vulnerability alerting</li>
                  <li>Security metrics tracking</li>
                  <li>Compliance monitoring</li>
                  <li>Incident response integration</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Reporting and Documentation</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Security Testing Report Structure
## Executive Summary
- Overall security posture assessment
- Critical findings and risks
- Business impact analysis
- Remediation priorities
- Compliance status

## Technical Findings
- Vulnerability details and descriptions
- Risk assessment and scoring
- Proof of concept demonstrations
- Affected systems and components
- Exploitation scenarios

## Recommendations
- Short-term remediation actions
- Long-term security improvements
- Best practices implementation
- Security architecture enhancements
- Staff training and awareness`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">Secure Development</h3>
              <p className="text-sm text-blue-200">Implement secure coding practices, regular code reviews, and security training</p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">Testing Automation</h3>
              <p className="text-sm text-green-200">Automate security testing in CI/CD pipelines for continuous validation</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">Regular Assessments</h3>
              <p className="text-sm text-yellow-200">Conduct regular security assessments and penetration testing</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">Incident Response</h3>
              <p className="text-sm text-red-200">Establish incident response procedures and security monitoring</p>
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
