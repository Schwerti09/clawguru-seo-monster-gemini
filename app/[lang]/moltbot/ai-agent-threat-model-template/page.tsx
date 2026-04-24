import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

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
  const isDE = locale === 'de'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: pick(isDE, 'Was ist ein Threat Model f\u00fcr AI Agenten?', 'What is a threat model for AI agents?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'Ein AI Agent Threat Model identifiziert systematisch alle m\u00f6glichen Angriffsvektoren auf autonome KI-Systeme. Bereiche: Prompt Injection (direkt/indirekt), Model Poisoning, Data Exfiltration durch den Agenten, Privilege Escalation \u00fcber Agent-Aktionen, Supply-Chain-Angriffe auf LLM-Provider, Denial-of-Service via Token-Flooding. STRIDE-Methodik auf AI-spezifische Bedrohungen angewendet.', 'An AI agent threat model systematically identifies all possible attack vectors on autonomous AI systems. Areas: prompt injection (direct/indirect), model poisoning, data exfiltration by the agent, privilege escalation through agent actions, supply chain attacks on LLM providers, denial-of-service via token flooding. STRIDE methodology applied to AI-specific threats.') } },
      { '@type': 'Question', name: pick(isDE, 'Welche Schritte hat ein AI Agent Threat Modeling?', 'What steps does AI agent threat modeling involve?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'AI Agent Threat Modeling Schritte: 1) System-Diagramm erstellen (Agent, Tools, Datenquellen, externe APIs). 2) Trust Boundaries definieren (was darf der Agent, was nicht?). 3) STRIDE-Analyse: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege. 4) AI-spezifische Bedrohungen: Prompt Injection, Jailbreaking, Indirect Injection. 5) Mitigations definieren und priorisieren.', 'AI agent threat modeling steps: 1) create system diagram (agent, tools, data sources, external APIs). 2) Define trust boundaries (what may the agent do, what not?). 3) STRIDE analysis: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege. 4) AI-specific threats: prompt injection, jailbreaking, indirect injection. 5) Define and prioritize mitigations.') } },
      { '@type': 'Question', name: pick(isDE, 'Was sind die h\u00e4ufigsten AI Agent Sicherheitsbedrohungen?', 'What are the most common AI agent security threats?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'Top AI Agent Bedrohungen 2026: 1) Indirect Prompt Injection (b\u00f6sartige Inhalte in Webseiten/Docs die der Agent liest). 2) Tool Misuse (Agent nutzt Tools f\u00fcr unbeabsichtigte Aktionen). 3) Data Exfiltration (Agent sendet sensible Daten an externe Endpunkte). 4) Persistent Jailbreaks (eingebettete Instruktionen \u00fcberleben Kontextwechsel). 5) Agent-zu-Agent Angriffe (kompromittierter Sub-Agent infiziert Haupt-Agent).', 'Top AI agent threats 2026: 1) Indirect prompt injection (malicious content in web pages/docs the agent reads). 2) Tool misuse (agent uses tools for unintended actions). 3) Data exfiltration (agent sends sensitive data to external endpoints). 4) Persistent jailbreaks (embedded instructions survive context switches). 5) Agent-to-agent attacks (compromised sub-agent infects main agent).') } },
      { '@type': 'Question', name: pick(isDE, 'Wie dokumentiere ich ein AI Threat Model?', 'How do I document an AI threat model?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'AI Threat Model Dokumentation: Datenflussdiagramm (DFD) mit Agent-Komponenten und Trust Boundaries. Bedrohungs-Register: Bedrohung, STRIDE-Kategorie, Wahrscheinlichkeit, Impact, Risiko-Score. Mitigation-Register: Gegenma\u00dfnahme, Verantwortlicher, Status, Test-Evidenz. Template: OWASP Threat Dragon (kostenlos, Open Source). ClawGuru Moltbot stellt vorgefertigte AI-Agent-Templates bereit.', 'AI threat model documentation: data flow diagram (DFD) with agent components and trust boundaries. Threat register: threat, STRIDE category, probability, impact, risk score. Mitigation register: countermeasure, owner, status, test evidence. Template: OWASP Threat Dragon (free, open source). ClawGuru Moltbot provides pre-built AI agent templates.') } },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for threat modeling and security architecture. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">AI Agent Threat Model Template: Complete Framework</h1>
        <p className="text-lg text-gray-300 mb-8">Complete AI agent threat model template with standardized threat assessment, risk analysis, and security control documentation for autonomous systems.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Threat Model Template Overview</h2>
          <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-100">Template Components</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>System architecture documentation</li>
              <li>Asset identification and classification</li>
              <li>Threat analysis and categorization</li>
              <li>Risk assessment and prioritization</li>
              <li>Security control recommendations</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">System Architecture Documentation</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <h3 className="font-bold text-cyan-400 mb-3">Architecture Components</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>AI model and algorithms</li>
                  <li>Data processing pipelines</li>
                  <li>Decision-making logic</li>
                  <li>Interaction interfaces</li>
                  <li>External integrations</li>
                </ul>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <h3 className="font-bold text-cyan-400 mb-3">Trust Boundaries</h3>
                <ul className="space-y-2 text-sm text-gray-300">
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Asset Identification</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Threat Analysis Framework</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <h3 className="font-bold text-green-400 mb-3">STRIDE Categories</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong>S</strong>poofing - Identity impersonation</li>
                  <li><strong>T</strong>ampering - Data or system modification</li>
                  <li><strong>R</strong>epudiation - Denial of actions</li>
                  <li><strong>I</strong>nformation Disclosure - Data leakage</li>
                  <li><strong>D</strong>enial of Service - Service disruption</li>
                  <li><strong>E</strong>levation of Privilege - Access escalation</li>
                </ul>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <h3 className="font-bold text-green-400 mb-3">AI-Specific Threats</h3>
                <ul className="space-y-2 text-sm text-gray-300">
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Risk Assessment Methodology</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 flex-1">
                  <div className="font-semibold text-gray-100">Likelihood Assessment</div>
                  <div className="text-sm text-gray-300">Assess the probability of threat occurrence based on historical data and current conditions</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 flex-1">
                  <div className="font-semibold text-gray-100">Impact Analysis</div>
                  <div className="text-sm text-gray-300">Evaluate potential impact on confidentiality, integrity, and availability</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 flex-1">
                  <div className="font-semibold text-gray-100">Risk Calculation</div>
                  <div className="text-sm text-gray-300">Calculate risk scores using likelihood x impact methodology</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 flex-1">
                  <div className="font-semibold text-gray-100">Risk Prioritization</div>
                  <div className="text-sm text-gray-300">Prioritize risks based on calculated scores and business impact</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Security Control Recommendations</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Threat Model Documentation Template</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Executive Summary</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>System overview and purpose</li>
                  <li>Key findings and risks</li>
                  <li>Business impact assessment</li>
                  <li>Recommendations summary</li>
                  <li>Implementation timeline</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Technical Details</h3>
                <ul className="space-y-2 text-sm text-gray-300">
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Implementation Guidelines</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Development Phase</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Secure development lifecycle</li>
                  <li>Code review and analysis</li>
                  <li>Security testing integration</li>
                  <li>Threat model updates</li>
                  <li>Documentation maintenance</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Operational Phase</h3>
                <ul className="space-y-2 text-sm text-gray-300">
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Review and Maintenance</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">Regular Updates</h3>
              <p className="text-sm text-blue-200">Update threat models regularly to reflect system changes and new threats</p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">Stakeholder Involvement</h3>
              <p className="text-sm text-green-200">Involve all relevant stakeholders in threat modeling process</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">Documentation</h3>
              <p className="text-sm text-yellow-200">Maintain comprehensive documentation for threat models and controls</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">Continuous Monitoring</h3>
              <p className="text-sm text-red-200">Continuously monitor for new threats and control effectiveness</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Template Examples</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Chatbot Threat Model</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Prompt injection threats</li>
                  <li>Data leakage risks</li>
                  <li>Unauthorized access controls</li>
                  <li>Privacy compliance requirements</li>
                  <li>Service availability concerns</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Autonomous Agent Threat Model</h3>
                <ul className="space-y-2 text-sm text-gray-300">
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
