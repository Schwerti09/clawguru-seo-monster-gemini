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
  const title = "KI-Agenten Sicherheit: Vollständiges Schutz-Framework 2026"
  const description = "Vollständiges KI-Agenten Sicherheits-Framework: Bedrohungsschutz, Sicherheitskontrollen und Abwehrmechanismen für autonome Systeme. DSGVO-konform mit Moltbot automatisierbar."
  return {
    title,
    description,
    keywords: ["ki agenten sicherheit", "autonome systeme schutz", "ai agent security", "prompt injection schutz", "ki sicherheitskontrollen"],
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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Wie schützt man KI-Agenten vor Angriffen?", acceptedAnswer: { "@type": "Answer", text: "Durch mehrschichtige Sicherheit: Input-Validierung und Sanitierung auf Eingabeebene, Sandbox-Ausführung und Ressourcenlimits auf Verarbeitungsebene, Output-Filterung auf Ausgabeebene sowie kontinuierliches Verhaltensmonitoring." } },
    { "@type": "Question", name: "Was ist Prompt Injection bei KI-Agenten?", acceptedAnswer: { "@type": "Answer", text: "Prompt Injection ist ein Angriff, bei dem bösartige Eingaben das Verhalten eines KI-Agenten manipulieren. Schutzmaßnahmen umfassen Input-Validierung, Prompt-Templates, Anomalieerkennung und Verhaltensmonitoring." } },
    { "@type": "Question", name: "Welche ML-Sicherheitskontrollen sind wichtig?", acceptedAnswer: { "@type": "Answer", text: "Modellverschlüsselung, Integritätsprüfung, adversariales Training, sichere Inferenzumgebungen und Datenschutz durch Federated Learning sind die wichtigsten Sicherheitskontrollen für ML-Systeme." } },
    { "@type": "Question", name: "Wie unterstützt Moltbot die KI-Agenten Sicherheit?", acceptedAnswer: { "@type": "Answer", text: "Moltbot bietet 600+ ausführbare Security-Runbooks speziell für KI-Agenten-Sicherheit, automatisiertes Incident-Response, Echtzeit-Verhaltensmonitoring und DSGVO-konforme Self-Hosted Infrastruktur." } },
  ],
}

export default function AiAgentSecurityPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">Kein Penetrationstest</strong>: Dieser Leitfaden dient dem Schutz von KI-Agenten. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">KI-Agenten Sicherheit: Vollständiges Schutz-Framework 2026</h1>
        <p className="text-lg text-gray-300 mb-8">Vollständiges KI-Agenten Sicherheits-Framework mit Bedrohungsschutz, Sicherheitskontrollen und Abwehrmechanismen für autonome Systeme. Mit Moltbot automatisiert und DSGVO-konform.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">KI-Agenten Sicherheitsüberblick</h2>
          <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-100">Sicherheitsherausforderungen</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Sicherheit autonomer Entscheidungen</li>
              <li>Schutz selbstmodifizierenden Codes</li>
              <li>Sicherheit komplexer Interaktionen</li>
              <li>Schwachstellen verteilter Systeme</li>
              <li>Sicherheit bei Echtzeit-Lernen</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Sicherheitsarchitektur</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Eingabeschicht-Sicherheit</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Input-Validierung und Sanitierung</li>
                  <li>Prompt-Injection-Schutz</li>
                  <li>Datenvergiftungsprävention</li>
                  <li>Content-Filterung und Moderation</li>
                  <li>Anomalieerkennung für Eingaben</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Verarbeitungsschicht-Sicherheit</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Sandbox-Ausführungsumgebungen</li>
                  <li>Ressourcenzuteilungslimits</li>
                  <li>Speicher- und Rechenbeschränkungen</li>
                  <li>Netzwerkzugriffskontrollen</li>
                  <li>Dateisystem-Isolation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Bedrohungsschutz-Mechanismen</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Sicherheitskontrollen Implementierung</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Präventive Kontrollen</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Input-Validierung und Sanitierung</li>
                  <li>Prompt-Engineering und Templates</li>
                  <li>Zugriffskontrollen und Authentifizierung</li>
                  <li>Netzwerksegmentierung und Isolation</li>
                  <li>Sichere Entwicklungspraktiken</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Erkennende Kontrollen</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Verhaltensanalyse und Monitoring</li>
                  <li>Anomalieerkennungssysteme</li>
                  <li>Security-Logging und Auditing</li>
                  <li>Echtzeit-Bedrohungserkennung</li>
                  <li>Modellleistungsüberwachung</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Autonome System-Sicherheit</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <div className="font-semibold text-gray-100">Entscheidungsvalidierung</div>
                  <div className="text-sm text-gray-300">Autonome Entscheidungen gegen Sicherheitsrichtlinien validieren</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <div className="font-semibold text-gray-100">Verhaltensmonitoring</div>
                  <div className="text-sm text-gray-300">Agentenverhalten auf Anomalien und Sicherheitsverstöße überwachen</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <div className="font-semibold text-gray-100">Interventionsmechanismen</div>
                  <div className="text-sm text-gray-300">Menschliche Eingriffs- und Überschreibungsmöglichkeiten implementieren</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <div className="font-semibold text-gray-100">Fail-Safe-Mechanismen</div>
                  <div className="text-sm text-gray-300">Ausfallsichere Mechanismen für Sicherheitsverstöße implementieren</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Machine-Learning-Sicherheit</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Compliance und Governance</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Regulatorische Compliance</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>DSGVO-Datenschutzanforderungen</li>
                  <li>EU AI Act Compliance</li>
                  <li>Branchenspezifische Vorschriften</li>
                  <li>Datenhaltungsrichtlinien</li>
                  <li>Privacy by Design</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Ethische Governance</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Fairness und Bias-Minderung</li>
                  <li>Transparenz und Erklärbarkeit</li>
                  <li>Anforderungen an menschliche Aufsicht</li>
                  <li>Rechenschaftsrahmen</li>
                  <li>Risikobewertungsverfahren</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Monitoring und Incident Response</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Echtzeit-Monitoring</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Agentenverhaltens-Tracking</li>
                  <li>Leistungsmetriken-Überwachung</li>
                  <li>Ressourcennutzungs-Tracking</li>
                  <li>Security-Event-Korrelation</li>
                  <li>Anomalieerkennungssysteme</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Incident Response</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Incident-Identifikation und -Klassifikation</li>
                  <li>Sofortige Eindämmungsmaßnahmen</li>
                  <li>Untersuchung und Ursachenanalyse</li>
                  <li>Remediation und Wiederherstellung</li>
                  <li>Post-Incident-Review und Verbesserung</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Testing und Validierung</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">Security by Design</h3>
              <p className="text-sm text-blue-200">Sicherheitskontrollen von Beginn der KI-Agenten-Entwicklung an implementieren</p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">Defense in Depth</h3>
              <p className="text-sm text-green-200">Mehrere Sicherheitskontrollen für umfassenden Schutz schichten</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">Kontinuierliches Monitoring</h3>
              <p className="text-sm text-yellow-200">Kontinuierliches Monitoring für Sicherheit und Performance aufrechterhalten</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">Regelmäßige Updates</h3>
              <p className="text-sm text-red-200">Sicherheitskontrollen und Bedrohungsmodelle regelmäßig aktualisieren</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Implementierungsbeispiele</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Chatbot-Sicherheit</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Input-Validierung und Sanitierung</li>
                  <li>Prompt-Injection-Schutz</li>
                  <li>Output-Filterung und Monitoring</li>
                  <li>Rate-Limiting und Throttling</li>
                  <li>Verhaltensanalyse</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">Autonome Agenten-Sicherheit</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Entscheidungsvalidierungs-Frameworks</li>
                  <li>Verhaltensmonitoring-Systeme</li>
                  <li>Menschliche Eingriffsmechanismen</li>
                  <li>Fail-Safe-Implementierungen</li>
                  <li>Ressourcenbeschränkungs-Durchsetzung</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Häufige Fragen (FAQ)</h2>
          <div className="space-y-4 mb-10">
            {faqSchema.mainEntity.map((item, i) => (
              <details key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <summary className="font-semibold text-gray-100 cursor-pointer">{item.name}</summary>
                <p className="mt-3 text-sm text-gray-300">{item.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">System jetzt scannen</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">600+ Security-Playbooks</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-threat-model`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Bedrohungsmodellierung</div>
              <div className="text-sm text-gray-300">KI-Agenten Threat Modeling</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-hardening-guide`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Härtungsleitfaden</div>
              <div className="text-sm text-gray-300">KI-Agenten Härtung</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
