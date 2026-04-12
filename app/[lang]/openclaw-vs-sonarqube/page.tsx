import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw vs SonarQube: Code Security & SAST Vergleich 2024',
    description: 'OpenClaw vs SonarQube im Vergleich. Code Quality vs Security Posture, Self-Hosting, SAST-Tiefe, Executable Runbooks und Runtime-Schutz. Für Self-Hosted DevOps-Teams.',
    keywords: ['openclaw vs sonarqube','sonarqube alternative','code security vergleich','sast tools','sonarqube security','openclaw code quality'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'OpenClaw vs SonarQube Vergleich 2024', description: 'OpenClaw vs SonarQube SAST.', type: 'article', url: `https://clawguru.org/${lang}/openclaw-vs-sonarqube` },
    alternates: buildLocalizedAlternates(lang as Locale, '/openclaw-vs-sonarqube'),
    robots: 'index, follow',
  };
}

export default function OpenClawVsSonarQubePage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong>Vergleichsseite</strong>: SonarQube fokussiert auf Code-Qualität. OpenClaw auf ganzheitliche Security-Posture. Beide Self-Hosted möglich.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw vs SonarQube</h1>
        <p className="text-lg text-gray-300 mb-8">SonarQube ist der Standard für Code Quality & SAST in CI/CD. OpenClaw ergänzt mit Runtime-Security, Compliance und Executable Runbooks.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">⚔️ Vergleich</h2>
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
                  <tr key={feature} className="border-b hover:bg-gray-800">
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">💡 Empfehlung: Beide kombinieren!</h2>
          <div className="bg-blue-900 border border-blue-700 p-5 rounded-lg">
            <p className="text-sm text-blue-300 mb-3">SonarQube + OpenClaw ist die ideale Kombination für vollständige Security Coverage:</p>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>• <strong>SonarQube</strong>: Code Quality, SAST, Technical Debt (CI/CD Stage)</li>
              <li>• <strong>OpenClaw</strong>: Runtime Security, Compliance, Runbooks (Production)</li>
              <li>• Keine Überschneidungen — beide Tools ergänzen sich perfekt</li>
              <li>• Self-Hosted Kombination ohne Cloud-Abhängigkeit möglich</li>
            </ul>
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
