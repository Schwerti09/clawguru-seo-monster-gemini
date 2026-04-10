import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw vs Snyk: Security Tool Vergleich 2024',
    description: 'OpenClaw vs Snyk im direkten Vergleich. Funktionen, Preise, Self-Hosting, Datenschutz und Integrations-Support. Welches Security-Tool passt zu deinem Self-Hosted Stack?',
    keywords: ['openclaw vs snyk','snyk alternative','openclaw security tool','dependency scanning vergleich','open source security tools vergleich'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'OpenClaw vs Snyk Vergleich 2024', description: 'OpenClaw vs Snyk Security Tool.', type: 'article', url: `https://clawguru.org/${lang}/openclaw-vs-snyk` },
    alternates: buildLocalizedAlternates(lang as Locale, '/openclaw-vs-snyk'),
    robots: 'index, follow',
  };
}

export default function OpenClawVsSnykPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  const COMPARISON = [
    { feature: 'Self-Hosting möglich', openclaw: '✅ Ja', snyk: '❌ Cloud-only' },
    { feature: 'Open Source', openclaw: '✅ Ja', snyk: '⚠️ Teilweise' },
    { feature: 'DSGVO / Datenschutz', openclaw: '✅ Vollständig', snyk: '⚠️ US-Cloud' },
    { feature: 'Dependency Scanning', openclaw: '✅ npm, pip, go', snyk: '✅ 10+ Sprachen' },
    { feature: 'Container Scanning', openclaw: '✅ Docker, K8s', snyk: '✅ Ja' },
    { feature: 'SAST (Code)', openclaw: '⚠️ Basis', snyk: '✅ Erweitert' },
    { feature: 'Runbooks / Remediation', openclaw: '✅ Executable Runbooks', snyk: '⚠️ Nur Fixes' },
    { feature: 'Preis (Free Tier)', openclaw: '✅ Kostenlos Explorer', snyk: '✅ Begrenzt free' },
    { feature: 'CI/CD Integration', openclaw: '✅ GitHub, GitLab, Jenkins', snyk: '✅ Alle großen' },
    { feature: 'Compliance Reports', openclaw: '✅ SOC2, ISO27001', snyk: '⚠️ Eingeschränkt' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong>Objektiver Vergleich</strong>: Beide Tools haben Stärken. Dieser Vergleich hilft dir, die richtige Wahl für deinen Stack zu treffen.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw vs Snyk: Security Tool Vergleich</h1>
        <p className="text-lg text-gray-300 mb-8">OpenClaw (Self-Hosted, DSGVO-konform) vs Snyk (Cloud, umfangreicher Sprachsupport) — welches Tool passt zu deinem Setup?</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">⚔️ Direkter Vergleich</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-3 text-left">Feature</th>
                  <th className="p-3 text-center">🔓 OpenClaw</th>
                  <th className="p-3 text-center">🐍 Snyk</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(({ feature, openclaw, snyk }) => (
                  <tr key={feature} className="border-b hover:bg-gray-800">
                    <td className="p-3">{feature}</td>
                    <td className="p-3 text-center">{openclaw}</td>
                    <td className="p-3 text-center">{snyk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🏆 Wer gewinnt wann?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900 border border-green-700 p-5 rounded-lg">
              <h3 className="font-bold text-green-300 mb-3">🔓 OpenClaw ist besser wenn...</h3>
              <ul className="space-y-1.5 text-sm text-green-200">
                <li>• Self-Hosted oder On-Premise Anforderung</li>
                <li>• DSGVO / EU-Datenschutz kritisch</li>
                <li>• Executable Runbooks gewünscht</li>
                <li>• Compliance-Reports nötig (SOC2, ISO)</li>
                <li>• Enge Budgetvorgaben</li>
              </ul>
            </div>
            <div className="bg-blue-900 border border-blue-700 p-5 rounded-lg">
              <h3 className="font-bold text-blue-300 mb-3">🐍 Snyk ist besser wenn...</h3>
              <ul className="space-y-1.5 text-sm text-blue-200">
                <li>• Cloud-first Stack ohne On-Prem Zwang</li>
                <li>• 10+ Programmiersprachen zu scannen</li>
                <li>• Tiefer IDE-Integration gewünscht</li>
                <li>• Großes Enterprise-Budget vorhanden</li>
                <li>• Nur Dependency/Container Scanning nötig</li>
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
