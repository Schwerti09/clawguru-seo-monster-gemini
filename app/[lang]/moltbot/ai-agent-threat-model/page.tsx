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
  const title = "KI-Agenten Bedrohungsmodellierung: Security Framework 2026"
  const description = "Vollständiger Leitfaden zur KI-Agenten Bedrohungsmodellierung: Angriffsvektoren, Sicherheitskontrollen und Schutzstrategien für autonome Systeme. DSGVO-konform und selbst-gehostet."
  return {
    title,
    description,
    keywords: ["ki agenten bedrohungsmodellierung", "ai agent threat modeling", "autonome systeme sicherheit", "ki sicherheitsframework", "prompt injection schutz"],
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
    { "@type": "Question", name: "Was ist KI-Agenten Bedrohungsmodellierung?", acceptedAnswer: { "@type": "Answer", text: "KI-Agenten Bedrohungsmodellierung ist ein systematischer Prozess zur Identifikation, Analyse und Bewertung von Sicherheitsrisiken in autonomen KI-Systemen. Sie umfasst Prompt-Injection-Schutz, Datenvergiftung, Modell-Extraktion und Ziel-Manipulation." } },
    { "@type": "Question", name: "Welche Angriffsvektoren gibt es bei KI-Agenten?", acceptedAnswer: { "@type": "Answer", text: "Die häufigsten Angriffe sind: Prompt Injection (manipulierte Eingaben), Data Poisoning (vergiftete Trainingsdaten), Model Extraction (Reverse Engineering des Modells) und Goal Hijacking (Manipulation der Ziele)." } },
    { "@type": "Question", name: "Wie schützt man KI-Agenten vor Prompt Injection?", acceptedAnswer: { "@type": "Answer", text: "Durch Input-Validierung und Sanitierung, Prompt-Template-Management, Verhaltensmonitoring und Anomalieerkennung. Moltbot bietet dafür 600+ ausführbare Security-Runbooks mit automatischer Remediation." } },
    { "@type": "Question", name: "Wie ist Moltbot DSGVO-konform bei KI-Agenten?", acceptedAnswer: { "@type": "Answer", text: "Moltbot läuft vollständig self-hosted – alle KI-Agenten-Daten bleiben in Ihrer eigenen EU-Infrastruktur. Es werden keine Daten an US-Rechenzentren oder Drittanbieter übertragen." } },
  ],
}

export default function AiAgentThreatModelPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">Kein Penetrationstest</strong>: Dieser Leitfaden dient der Sicherheitsarchitektur autonomer Systeme. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">KI-Agenten Bedrohungsmodellierung: Security Framework 2026</h1>
        <p className="text-lg text-gray-300 mb-8">Vollständiges Bedrohungsmodellierungs-Framework für KI-Agenten mit Angriffsvektoren, Sicherheitskontrollen und Schutzstrategien für autonome Systeme. DSGVO-konform und mit Moltbot automatisierbar.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">KI-Agenten Sicherheitsüberblick</h2>
          <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-100">Besondere Herausforderungen bei KI-Agenten</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Autonome Entscheidungsfähigkeiten</li>
              <li>Selbstmodifizierender Code und Verhalten</li>
              <li>Komplexe Interaktionsmuster</li>
              <li>Abhängigkeiten von verteilten Systemen</li>
              <li>Echtzeit-Lernen und Adaptation</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">KI-Agenten Bedrohungskategorien</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <h3 className="font-bold text-cyan-400 mb-3">Externe Bedrohungen</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Prompt-Injection-Angriffe</li>
                  <li>Datenvergiftung und -manipulation</li>
                  <li>Modell-Inversionsangriffe</li>
                  <li>Membership-Inference-Angriffe</li>
                  <li>Adversarielle Beispiele</li>
                </ul>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <h3 className="font-bold text-cyan-400 mb-3">Interne Bedrohungen</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Zielausrichtungsfehler</li>
                  <li>Unbeabsichtigtes Verhalten</li>
                  <li>Ressourcenausbeutung</li>
                  <li>Privilege Escalation</li>
                  <li>Datenleckagen</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Bedrohungsmodellierungs-Framework</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Angriffsvektor-Analyse</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-4">
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="font-bold text-red-300 mb-2">Prompt Injection</h3>
                <p className="text-sm text-gray-300 mb-2">Bösartige Eingabemanipulation zur Änderung des Agentenverhaltens</p>
                <p className="text-sm text-green-400"><strong>Gegenmaßnahme:</strong> Input-Validierung, Prompt-Sanitierung, Verhaltensmonitoring</p>
              </div>
              <div className="border-l-4 border-orange-600 pl-4">
                <h3 className="font-bold text-orange-300 mb-2">Datenvergiftung (Data Poisoning)</h3>
                <p className="text-sm text-gray-300 mb-2">Kontaminierung von Trainingsdaten zur Beeinflussung des Modellverhaltens</p>
                <p className="text-sm text-green-400"><strong>Gegenmaßnahme:</strong> Datenprovenienz, Anomalieerkennung, Modellvalidierung</p>
              </div>
              <div className="border-l-4 border-yellow-600 pl-4">
                <h3 className="font-bold text-yellow-300 mb-2">Modell-Extraktion</h3>
                <p className="text-sm text-gray-300 mb-2">Reverse Engineering von Modellparametern und Trainingsdaten</p>
                <p className="text-sm text-green-400"><strong>Gegenmaßnahme:</strong> Zugriffskontrollen, Abfrage-Limits, Differential Privacy</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-bold text-blue-300 mb-2">Ziel-Entführung (Goal Hijacking)</h3>
                <p className="text-sm text-gray-300 mb-2">Manipulation der Agentenziele für bösartige Zwecke</p>
                <p className="text-sm text-green-400"><strong>Gegenmaßnahme:</strong> Zielvalidierung, Verhaltensmonitoring, Sicherheitsbeschränkungen</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Sicherheitskontrollen Implementierung</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <h3 className="font-bold text-green-400 mb-3">Präventive Kontrollen</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Input-Validierung und Sanitierung</li>
                  <li>Prompt-Engineering und Templates</li>
                  <li>Zugriffskontrollen und Authentifizierung</li>
                  <li>Netzwerksegmentierung und Isolation</li>
                  <li>Sichere Entwicklungspraktiken</li>
                </ul>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <h3 className="font-bold text-green-400 mb-3">Erkennende Kontrollen</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Verhaltensanalyse und Monitoring</li>
                  <li>Anomalieerkennungssysteme</li>
                  <li>Security-Logging und Auditing</li>
                  <li>Echtzeit-Bedrohungserkennung</li>
                  <li>Modellleistungsüberwachung</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <h3 className="font-bold text-green-400 mb-3">Korrektive Kontrollen</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Incident-Response-Verfahren</li>
                  <li>Modell-Rollback-Mechanismen</li>
                  <li>System-Isolation und Eindämmung</li>
                  <li>Datenwiederherstellungsverfahren</li>
                  <li>Post-Incident-Analyse</li>
                </ul>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <h3 className="font-bold text-green-400 mb-3">Kompensierende Kontrollen</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Multi-Faktor-Authentifizierung</li>
                  <li>Defense-in-Depth-Architektur</li>
                  <li>Redundanz und Failover-Systeme</li>
                  <li>Versicherung und Risikotransfer</li>
                  <li>Compliance-Frameworks</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">KI-Agenten Sicherheitsarchitektur</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Compliance und Governance</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <h3 className="font-bold text-purple-400 mb-3">Regulatorische Compliance</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>DSGVO-Datenschutzanforderungen</li>
                  <li>EU AI Act Compliance</li>
                  <li>Branchenspezifische Vorschriften</li>
                  <li>Datenhaltungsrichtlinien</li>
                  <li>Privacy by Design</li>
                </ul>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <h3 className="font-bold text-purple-400 mb-3">Ethische Governance</h3>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Testing und Validierung</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 flex-1">
                  <div className="font-semibold text-gray-100">Sicherheitstests</div>
                  <div className="text-sm text-gray-300">Penetrationstests, Schwachstellenanalyse, Security-Scanning</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 flex-1">
                  <div className="font-semibold text-gray-100">KI-spezifische Tests</div>
                  <div className="text-sm text-gray-300">Adversarielle Tests, Robustheitstests, Sicherheitstests</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 flex-1">
                  <div className="font-semibold text-gray-100">Performance-Tests</div>
                  <div className="text-sm text-gray-300">Lasttests, Stresstests, Skalierungstests</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 flex-1">
                  <div className="font-semibold text-gray-100">Compliance-Tests</div>
                  <div className="text-sm text-gray-300">Regulatorische Compliance, Audit-Bereitschaft, Zertifizierungstests</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Monitoring und Incident Response</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">Design-Prinzipien</h3>
              <p className="text-sm text-blue-200">Security by Design, Defense in Depth, Least Privilege, Fail-Safe Defaults</p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">Entwicklungspraktiken</h3>
              <p className="text-sm text-green-200">Sicheres Coding, Code-Reviews, automatisierte Tests, Dependency-Management</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">Betriebspraktiken</h3>
              <p className="text-sm text-yellow-200">Regelmäßige Updates, Patch-Management, Backup-Verfahren, Disaster Recovery</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">Governance-Praktiken</h3>
              <p className="text-sm text-red-200">Richtliniendurchsetzung, Compliance-Monitoring, Risikomanagement, Audit-Trails</p>
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
            <a href={`/${locale}/moltbot/ai-agent-hardening-guide`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">KI-Agenten Härtung</div>
              <div className="text-sm text-gray-300">Kompletter Härtungsleitfaden</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-threat-model-template`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Threat Model Template</div>
              <div className="text-sm text-gray-300">Vorlage herunterladen</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
