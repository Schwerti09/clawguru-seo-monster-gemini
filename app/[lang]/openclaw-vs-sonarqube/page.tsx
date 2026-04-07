import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw vs SonarQube: Code Security & SAST Vergleich 2024',
    description: 'OpenClaw vs SonarQube im Vergleich. Code Quality vs Security Posture, Self-Hosting, SAST-Tiefe, Executable Runbooks und Runtime-Schutz. Für Self-Hosted DevOps-Teams.',
    keywords: ['openclaw vs sonarqube','sonarqube alternative','code security vergleich','sast tools','sonarqube security','openclaw code quality'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'OpenClaw vs SonarQube Vergleich 2024', description: 'OpenClaw vs SonarQube SAST.', type: 'article', url: `https://clawguru.org/${lang}/openclaw-vs-sonarqube` },
    alternates: { canonical: `https://clawguru.org/${lang}/openclaw-vs-sonarqube`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/openclaw-vs-sonarqube`])) },
    robots: 'index, follow',
  };
}

export default function OpenClawVsSonarQubePage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>Vergleichsseite</strong>: SonarQube fokussiert auf Code-Qualität. OpenClaw auf ganzheitliche Security-Posture. Beide Self-Hosted möglich.
        </div>
        <h1 className="text-4xl font-bold mb-4">OpenClaw vs SonarQube</h1>
        <p className="text-lg text-gray-600 mb-8">SonarQube ist der Standard für Code Quality & SAST in CI/CD. OpenClaw ergänzt mit Runtime-Security, Compliance und Executable Runbooks.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">⚔️ Vergleich</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Feature</th><th className="p-3 text-center">🔓 OpenClaw</th><th className="p-3 text-center">📊 SonarQube</th></tr></thead>
              <tbody>
                {[
                  ['Self-Hosting', '✅ Vollständig', '✅ Community Edition'],
                  ['SAST Code Scanning', '⚠️ Basis', '✅ Tief (20+ Sprachen)'],
                  ['Code-Qualitäts-Metriken', '❌ Nicht primär', '✅ Kern-Feature'],
                  ['Runtime Security', '✅ API/Middleware Schutz', '❌ Code-only'],
                  ['Container/K8s Security', '✅ Integriert', '❌ Nicht vorhanden'],
                  ['Executable Runbooks', '✅ Kern-Feature', '❌ Nicht vorhanden'],
                  ['Compliance Reports', '✅ SOC2, GDPR, ISO', '⚠️ OWASP Top10 only'],
                  ['Preis (Self-Hosted)', 'Ab €0 Explorer', 'Kostenlos (Community)'],
                  ['CI/CD Integration', '✅ GitHub, GitLab', '✅ Alle großen CI/CD'],
                  ['Kombinierbar', '✅ Als Ergänzung', '✅ Als Ergänzung'],
                ].map(([feature, openclaw, sonar]) => (
                  <tr key={feature} className="border-b hover:bg-gray-50">
                    <td className="p-3">{feature}</td>
                    <td className="p-3 text-center">{openclaw}</td>
                    <td className="p-3 text-center">{sonar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">💡 Empfehlung: Beide kombinieren!</h2>
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
            <p className="text-sm text-blue-800 mb-3">SonarQube + OpenClaw ist die ideale Kombination für vollständige Security Coverage:</p>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• <strong>SonarQube</strong>: Code Quality, SAST, Technical Debt (CI/CD Stage)</li>
              <li>• <strong>OpenClaw</strong>: Runtime Security, Compliance, Runbooks (Production)</li>
              <li>• Keine Überschneidungen — beide Tools ergänzen sich perfekt</li>
              <li>• Self-Hosted Kombination ohne Cloud-Abhängigkeit möglich</li>
            </ul>
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
