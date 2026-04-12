import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { lang: string };
}

const SUPPORTED_LANGUAGES = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot vs. Clawbot: Security Vergleich 2024',
    description: 'Detaillierter Vergleich der Security-Fähigkeiten zwischen Moltbot und Clawbot. Welches Framework passt zu deinem Use Case? Mit Benchmark-Daten und Entscheidungsmatrix.',
    keywords: ['moltbot vs clawbot','security comparison','bot security','moltbot clawbot unterschiede','security architecture'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      title: 'Moltbot vs. Clawbot: Security Vergleich 2024',
      description: 'Detaillierter Vergleich der Security-Fähigkeiten zwischen Moltbot und Clawbot.',
      type: 'article',
      url: `https://clawguru.org/${lang}/moltbot-vs-clawbot/security-comparison`,
      images: ['/og-moltbot-vs-clawbot.jpg'],
    },
    alternates: {
      canonical: `https://clawguru.org/${lang}/moltbot-vs-clawbot/security-comparison`,
      languages: {
        de: 'https://clawguru.org/de/moltbot-vs-clawbot/security-comparison',
        en: 'https://clawguru.org/en/moltbot-vs-clawbot/security-comparison',
        es: 'https://clawguru.org/es/moltbot-vs-clawbot/security-comparison',
        fr: 'https://clawguru.org/fr/moltbot-vs-clawbot/security-comparison',
        pt: 'https://clawguru.org/pt/moltbot-vs-clawbot/security-comparison',
        it: 'https://clawguru.org/it/moltbot-vs-clawbot/security-comparison',
        ru: 'https://clawguru.org/ru/moltbot-vs-clawbot/security-comparison',
        zh: 'https://clawguru.org/zh/moltbot-vs-clawbot/security-comparison',
        ja: 'https://clawguru.org/ja/moltbot-vs-clawbot/security-comparison',
        ko: 'https://clawguru.org/ko/moltbot-vs-clawbot/security-comparison',
        ar: 'https://clawguru.org/ar/moltbot-vs-clawbot/security-comparison',
        hi: 'https://clawguru.org/hi/moltbot-vs-clawbot/security-comparison',
        tr: 'https://clawguru.org/tr/moltbot-vs-clawbot/security-comparison',
        pl: 'https://clawguru.org/pl/moltbot-vs-clawbot/security-comparison',
        nl: 'https://clawguru.org/nl/moltbot-vs-clawbot/security-comparison',
      },
    },
    robots: 'index, follow',
  };
}

export default function MoltbotVsClawbotPage({ params }: PageProps) {
  const { lang } = params;
  if (!SUPPORTED_LANGUAGES.includes(lang)) notFound();
  const isDE = lang === 'de'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: isDE ? 'Was ist der Unterschied zwischen Moltbot und Clawbot?' : 'What is the difference between Moltbot and Clawbot?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Moltbot ist ein autonomes Security-Framework f\u00fcr komplexe Multi-Agent-Orchestrierung mit Fokus auf Compliance-Automatisierung und SBOM-Generierung. Clawbot ist ein leichtgewichtiges Security-Tool f\u00fcr einfachere Anwendungsf\u00e4lle mit schnellerem Setup. Moltbot eignet sich f\u00fcr Enterprise, Clawbot f\u00fcr Startups und KMU.' : 'Moltbot is an autonomous security framework for complex multi-agent orchestration with focus on compliance automation and SBOM generation. Clawbot is a lightweight security tool for simpler use cases with faster setup. Moltbot suits enterprise, Clawbot suits startups and SMEs.' } },
      { '@type': 'Question', name: isDE ? 'Welches Framework ist sicherer: Moltbot oder Clawbot?' : 'Which framework is more secure: Moltbot or Clawbot?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Beide Frameworks folgen Security-by-Design-Prinzipien. Moltbot bietet erweiterte Sicherheitsfeatures: granulares RBAC, Compliance-Reporting (SOC2, ISO27001), CVE-Feed-Integration, SBOM-Generierung. Clawbot hat einfachere Angriffsoberfl\u00e4che durch weniger Komponenten. Die Sicherheit h\u00e4ngt mehr von der Konfiguration als vom Framework ab.' : 'Both frameworks follow security-by-design principles. Moltbot offers advanced security features: granular RBAC, compliance reporting (SOC2, ISO27001), CVE feed integration, SBOM generation. Clawbot has simpler attack surface due to fewer components. Security depends more on configuration than the framework.' } },
      { '@type': 'Question', name: isDE ? 'F\u00fcr welche Use Cases eignet sich Moltbot vs. Clawbot?' : 'For which use cases is Moltbot vs. Clawbot suitable?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Moltbot Use Cases: Enterprise-Compliance (SOC2, ISO27001, HIPAA), Multi-Cloud-Environments, komplexe CI/CD-Pipelines, Regulated Industries. Clawbot Use Cases: Startups, einfache Self-Hosted-Deployments, schnelle Security-Checks, begrenzte Ressourcen. Entscheidungsfaktor: Compliance-Anforderungen und Team-Gr\u00f6\u00dfe.' : 'Moltbot use cases: enterprise compliance (SOC2, ISO27001, HIPAA), multi-cloud environments, complex CI/CD pipelines, regulated industries. Clawbot use cases: startups, simple self-hosted deployments, quick security checks, limited resources. Decision factor: compliance requirements and team size.' } },
      { '@type': 'Question', name: isDE ? 'Kann ich von Clawbot zu Moltbot migrieren?' : 'Can I migrate from Clawbot to Moltbot?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Migration Clawbot zu Moltbot: ClawGuru bietet Migrations-Runbooks f\u00fcr den \u00dcbergang. Schritte: Security-Baseline-Export aus Clawbot, Moltbot-Konfiguration einrichten, Compliance-Policies importieren, Integrations-Tests. Typische Migrationsdauer: 1-4 Wochen abh\u00e4ngig von Komplexit\u00e4t. ClawGuru Copilot unterst\u00fctzt bei der Migration.' : 'Migration Clawbot to Moltbot: ClawGuru provides migration runbooks for the transition. Steps: export security baseline from Clawbot, set up Moltbot configuration, import compliance policies, integration tests. Typical migration duration: 1-4 weeks depending on complexity. ClawGuru Copilot supports during migration.' } },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Dieser Vergleich dient ausschließlich zur Entscheidungshilfe bei der Wahl des richtigen Security-Frameworks. Keine Angriffswerkzeuge.
        </div>

        <h1 className="text-4xl font-bold mb-4">Moltbot vs. Clawbot: Security Vergleich 2024</h1>
        <p className="text-lg text-gray-300 mb-8">
          Welches Bot-Security-Framework ist das richtige für dein Unternehmen? Dieser detaillierte Vergleich analysiert Security-Architektur, Performance, Compliance und TCO beider Systeme.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🎯 Executive Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-6 rounded-lg border border-blue-700">
              <h3 className="text-xl font-bold text-blue-300 mb-3">Moltbot</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ Enterprise-Grade Zero Trust Architektur</li>
                <li>✅ Native GDPR/HIPAA/SOC2 Compliance</li>
                <li>✅ AI-gestützte Threat Detection</li>
                <li>✅ Kubernetes-native Deployment</li>
                <li>✅ Vollständiges Audit Trail</li>
              </ul>
            </div>
            <div className="bg-green-900 p-6 rounded-lg border border-green-700 border border-green-700">
              <h3 className="text-xl font-bold text-green-800 mb-3">Clawbot</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ Open-Source Security Framework</li>
                <li>✅ Schnelle Integration (&lt; 30 Min)</li>
                <li>✅ Lightweight & ressourceneffizient</li>
                <li>✅ Große Community</li>
                <li>✅ Flexible Plugin-Architektur</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">📊 Security Feature Vergleich</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-3 text-left">Feature</th>
                  <th className="p-3 text-center">Moltbot</th>
                  <th className="p-3 text-center">Clawbot</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Zero Trust Architecture', '✅ Nativ', '⚠️ Plugin'],
                  ['MFA Support', '✅ TOTP/SMS/HW', '✅ TOTP'],
                  ['Encryption at Rest', '✅ AES-256-GCM', '✅ AES-256'],
                  ['RBAC', '✅ Granular', '✅ Standard'],
                  ['AI Threat Detection', '✅ ML-basiert', '❌ Nein'],
                  ['GDPR Compliance', '✅ Built-in', '⚠️ Manuell'],
                  ['Audit Logging', '✅ Immutable', '✅ Standard'],
                  ['Container Security', '✅ K8s-native', '⚠️ Docker only'],
                  ['Rate Limiting', '✅ Distributed', '✅ Local'],
                  ['Secret Management', '✅ Vault-Integration', '⚠️ Env-Vars'],
                ].map(([feature, moltbot, clawbot]) => (
                  <tr key={feature} className="border-b hover:bg-gray-700">
                    <td className="p-3 font-medium">{feature}</td>
                    <td className="p-3 text-center">{moltbot}</td>
                    <td className="p-3 text-center">{clawbot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🏆 Wann welches Framework?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-6 rounded-lg">
              <h3 className="font-bold text-blue-300 mb-3">Wähle Moltbot wenn...</h3>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Enterprise mit strengen Compliance-Anforderungen</li>
                <li>Kritische Infrastruktur oder Finanzdaten</li>
                <li>Kubernetes-basiertes Deployment geplant</li>
                <li>AI-gestützte Bedrohungserkennung gewünscht</li>
                <li>GDPR/HIPAA/SOC2 Zertifizierung erforderlich</li>
              </ul>
            </div>
            <div className="bg-green-900 p-6 rounded-lg border border-green-700">
              <h3 className="font-bold text-green-800 mb-3">Wähle Clawbot wenn...</h3>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Startup oder kleines Team</li>
                <li>Schneller Prototyp oder MVP</li>
                <li>Open-Source-Budget-Beschränkungen</li>
                <li>Einfache Docker-Deployments</li>
                <li>Community-Support bevorzugt</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">⚡ Performance Benchmark</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`# Security Check Performance (1000 req/s)
Moltbot:
  - Threat Detection Latency: 2.3ms avg
  - Auth Verification:        1.1ms avg
  - Rate Limit Check:         0.8ms avg
  - Total Security Overhead:  4.2ms avg

Clawbot:
  - Threat Detection Latency: 0.9ms avg (no AI)
  - Auth Verification:        0.7ms avg
  - Rate Limit Check:         0.5ms avg
  - Total Security Overhead:  2.1ms avg

Winner: Clawbot (Latenz)
Winner: Moltbot (Threat Detection Accuracy: 97% vs 74%)`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
              <div className="font-semibold text-cyan-400">🛡️ Security Check Tool</div>
              <div className="text-sm text-gray-300">Analysiere dein aktuelles Setup live</div>
            </a>
            <a href="/roast-my-moltbot" className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
              <div className="font-semibold text-cyan-400">🔥 Roast My Moltbot</div>
              <div className="text-sm text-gray-300">Lass deine Moltbot-Konfiguration testen</div>
            </a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
              <div className="font-semibold text-cyan-400">📚 Security Runbooks</div>
              <div className="text-sm text-gray-300">Schritt-für-Schritt Implementierungsguides</div>
            </a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
              <div className="font-semibold text-cyan-400">🏢 Enterprise Solutions</div>
              <div className="text-sm text-gray-300">Maßgeschneiderte Security-Pakete</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
