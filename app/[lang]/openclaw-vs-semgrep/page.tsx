import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw vs Semgrep: SAST & Security Scanning Vergleich 2024',
    description: 'OpenClaw vs Semgrep im Vergleich. SAST-Tiefe, Custom Rules, Self-Hosting, Executable Runbooks vs Code-Pattern-Matching. Welches Tool für deinen Security-Stack?',
    keywords: ['openclaw vs semgrep','semgrep alternative','sast vergleich','static analysis security','code security scanning','openclaw sast'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'OpenClaw vs Semgrep Vergleich 2024', description: 'OpenClaw vs Semgrep SAST.', type: 'article', url: `https://clawguru.org/${lang}/openclaw-vs-semgrep` },
    alternates: { canonical: `https://clawguru.org/${lang}/openclaw-vs-semgrep`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/openclaw-vs-semgrep`])) },
    robots: 'index, follow',
  };
}

export default function OpenClawVsSemgrepPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>Vergleichsseite</strong>: OpenClaw und Semgrep lösen unterschiedliche Probleme — dieser Guide hilft dir, das richtige Tool zu wählen.
        </div>
        <h1 className="text-4xl font-bold mb-4">OpenClaw vs Semgrep</h1>
        <p className="text-lg text-gray-600 mb-8">Semgrep ist ein SAST-Spezialist für Code-Pattern-Matching. OpenClaw ist eine ganzheitliche Security-Plattform mit Executable Runbooks.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">⚔️ Vergleich im Überblick</h2>
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
                  <tr key={feature} className="border-b hover:bg-gray-50">
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
          <h2 className="text-2xl font-semibold mb-4">💡 Empfehlung</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 p-5 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2">🔓 Wähle OpenClaw wenn...</h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Ganzheitliche Security-Plattform gewünscht</li>
                <li>• Executable Runbooks essentiell</li>
                <li>• Runtime + Static Security kombinieren</li>
                <li>• Compliance-Nachweise benötigt</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2">🔍 Wähle Semgrep wenn...</h3>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• SAST als Hauptfokus</li>
                <li>• Tiefes Code-Pattern-Matching</li>
                <li>• Große Dev-Teams mit Code-Review-Focus</li>
                <li>• Custom Security Rules selbst schreiben</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/openclaw" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🔓 OpenClaw</div><div className="text-sm text-gray-600">Framework entdecken</div></a>
            <a href="/securitycheck" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🛡️ Security Check</div><div className="text-sm text-gray-600">Kostenlos testen</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
