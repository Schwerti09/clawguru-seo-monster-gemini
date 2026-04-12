import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw vs Semgrep: SAST & Security Scanning Vergleich 2024',
    description: 'OpenClaw vs Semgrep im Vergleich. SAST-Tiefe, Custom Rules, Self-Hosting, Executable Runbooks vs Code-Pattern-Matching. Welches Tool für deinen Security-Stack?',
    keywords: ['openclaw vs semgrep','semgrep alternative','sast vergleich','static analysis security','code security scanning','openclaw sast'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'OpenClaw vs Semgrep Vergleich 2024', description: 'OpenClaw vs Semgrep SAST.', type: 'article', url: `https://clawguru.org/${lang}/openclaw-vs-semgrep` },
    alternates: buildLocalizedAlternates(lang as Locale, '/openclaw-vs-semgrep'),
    robots: 'index, follow',
  };
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Was ist der Unterschied zwischen OpenClaw und Semgrep?', acceptedAnswer: { '@type': 'Answer', text: 'Semgrep ist ein SAST-Spezialist für Code-Pattern-Matching mit Custom Rules. OpenClaw ist eine ganzheitliche Security-Plattform mit Runtime-Schutz, Container Security, Dependency Scanning und 600+ Executable Runbooks.' } },
    { '@type': 'Question', name: 'Kann OpenClaw Semgrep ersetzen?', acceptedAnswer: { '@type': 'Answer', text: 'Für Teams die primär Runtime- und Infrastructure-Security benötigen: ja. Für tiefes SAST-Code-Scanning mit Custom Rules ist Semgrep stärker. Die Kombination beider Tools ist ideal für vollständige Coverage.' } },
    { '@type': 'Question', name: 'Unterstützt OpenClaw Static Code Analysis?', acceptedAnswer: { '@type': 'Answer', text: 'OpenClaw bietet Basis-SAST-Checks, fokussiert aber auf Runtime-Security, API-Schutz, Container Hardening und Compliance. Für tiefes SAST empfiehlt sich Semgrep als Ergänzung zu OpenClaw.' } },
    { '@type': 'Question', name: 'Welches Tool ist besser für Self-Hosted Security?', acceptedAnswer: { '@type': 'Answer', text: 'Beide Tools unterstützen Self-Hosting. OpenClaw bietet ein breiteres Security-Spektrum (Runtime, Compliance, Runbooks), während Semgrep als OSS-Tool für Code-Scanning optimiert ist.' } },
  ],
}

export default function OpenClawVsSemgrepPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong>Vergleichsseite</strong>: OpenClaw und Semgrep lösen unterschiedliche Probleme — dieser Guide hilft dir, das richtige Tool zu wählen.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw vs Semgrep</h1>
        <p className="text-lg text-gray-300 mb-8">Semgrep ist ein SAST-Spezialist für Code-Pattern-Matching. OpenClaw ist eine ganzheitliche Security-Plattform mit Executable Runbooks.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">⚔️ Vergleich im Überblick</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Feature</th><th className="p-3 text-center">🔓 OpenClaw</th><th className="p-3 text-center">🔍 Semgrep</th></tr></thead>
              <tbody>
                {[
                  ['SAST (Static Code Analysis)', '⚠️ Basis-Checks', '✅ Spezialist'],
                  ['Custom Security Rules', '✅ Runbook-basiert', '✅ YAML Rules'],
                  ['Self-Hosting', '✅ Vollständig', '✅ OSS verfügbar'],
                  ['Dependency Scanning', '✅ Integriert', '⚠️ Nur mit Plugins'],
                  ['Container Security', '✅ Docker/K8s', '❌ Nicht primär'],
                  ['Executable Runbooks', '✅ Kern-Feature', '❌ Nicht vorhanden'],
                  ['Compliance Reports', '✅ SOC2, ISO27001', '⚠️ Eingeschränkt'],
                  ['Runtime Protection', '✅ API + Middleware', '❌ Code-only'],
                  ['Preis', 'Kostenlos bis €99/Mo', 'OSS kostenlos, Pro ab $40'],
                ].map(([feature, openclaw, semgrep]) => (
                  <tr key={feature} className="border-b hover:bg-gray-800">
                    <td className="p-3">{feature}</td>
                    <td className="p-3 text-center">{openclaw}</td>
                    <td className="p-3 text-center">{semgrep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">💡 Empfehlung</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900 border border-green-700 p-5 rounded-lg">
              <h3 className="font-bold text-green-300 mb-2">🔓 Wähle OpenClaw wenn...</h3>
              <ul className="space-y-1 text-sm text-green-200">
                <li>• Ganzheitliche Security-Plattform gewünscht</li>
                <li>• Executable Runbooks essentiell</li>
                <li>• Runtime + Static Security kombinieren</li>
                <li>• Compliance-Nachweise benötigt</li>
              </ul>
            </div>
            <div className="bg-blue-900 border border-blue-700 p-5 rounded-lg">
              <h3 className="font-bold text-blue-300 mb-2">🔍 Wähle Semgrep wenn...</h3>
              <ul className="space-y-1 text-sm text-blue-200">
                <li>• SAST als Hauptfokus</li>
                <li>• Tiefes Code-Pattern-Matching</li>
                <li>• Große Dev-Teams mit Code-Review-Focus</li>
                <li>• Custom Security Rules selbst schreiben</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/openclaw" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔓 OpenClaw</div><div className="text-sm text-gray-300">Framework entdecken</div></a>
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">Kostenlos testen</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
