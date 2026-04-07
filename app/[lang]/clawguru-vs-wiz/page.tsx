import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'ClawGuru vs Wiz: Cloud Security Platform Vergleich 2024',
    description: 'ClawGuru vs Wiz im Vergleich. Self-Hosted vs Cloud-Native CSPM, Preismodell, DSGVO-Konformität, Runbook-Support und SMB vs Enterprise-Fokus.',
    keywords: ['clawguru vs wiz','wiz alternative','cspm vergleich','cloud security posture management','wiz security','clawguru cloud security'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'ClawGuru vs Wiz Cloud Security 2024', description: 'ClawGuru vs Wiz CSPM Vergleich.', type: 'article', url: `https://clawguru.org/${lang}/clawguru-vs-wiz` },
    alternates: { canonical: `https://clawguru.org/${lang}/clawguru-vs-wiz`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/clawguru-vs-wiz`])) },
    robots: 'index, follow',
  };
}

export default function ClawGuruVsWizPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>Vergleichsseite</strong>: ClawGuru und Wiz sind für unterschiedliche Zielgruppen optimiert. Dieser Guide hilft bei der Entscheidung.
        </div>
        <h1 className="text-4xl font-bold mb-4">ClawGuru vs Wiz: Cloud Security Plattform Vergleich</h1>
        <p className="text-lg text-gray-600 mb-8">Wiz ist eine Enterprise-Cloud-Security-Plattform (&gt;$100M ARR). ClawGuru ist die Self-Hosted Alternative für SMBs und Tech-Teams mit Datenschutz-Anforderungen.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">⚔️ Direkter Vergleich</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Kriterium</th><th className="p-3 text-center">🛡️ ClawGuru</th><th className="p-3 text-center">⚡ Wiz</th></tr></thead>
              <tbody>
                {[
                  ['Zielgruppe', 'SMB / Tech-Teams', 'Enterprise (500+ MAs)'],
                  ['Deployment', '✅ Self-Hosted + Cloud', '❌ Cloud-only (SaaS)'],
                  ['DSGVO / EU-Daten', '✅ EU-First', '⚠️ US-basiert'],
                  ['Preis', '✅ Ab €0 (Explorer)', '❌ ab $100k/Jahr'],
                  ['Executable Runbooks', '✅ Kern-Feature', '⚠️ Nur Recommendations'],
                  ['CSPM (Cloud Posture)', '✅ AWS, GCP, Azure', '✅ Multi-Cloud Spezialist'],
                  ['Agentless Scanning', '⚠️ Teilweise', '✅ Agentless Kernfeature'],
                  ['Kubernetes Security', '✅ K8s Hardening', '✅ KSPM inklusive'],
                  ['Compliance Frameworks', '✅ SOC2, ISO27001, GDPR', '✅ 50+ Frameworks'],
                  ['Setup-Aufwand', '✅ < 1 Stunde', '⚠️ Enterprise-Onboarding'],
                ].map(([criteria, claw, wiz]) => (
                  <tr key={criteria} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{criteria}</td>
                    <td className="p-3 text-center text-sm">{claw}</td>
                    <td className="p-3 text-center text-sm">{wiz}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🏆 Wann welches Tool?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 p-5 rounded-lg">
              <h3 className="font-bold text-green-800 mb-3">🛡️ ClawGuru ist die Wahl wenn...</h3>
              <ul className="space-y-1.5 text-sm text-green-700">
                <li>• Budget &lt; $50k/Jahr für Security Tools</li>
                <li>• Datenschutz / DSGVO zwingend</li>
                <li>• Self-Hosted oder On-Prem nötig</li>
                <li>• Executable Runbooks gewünscht</li>
                <li>• Team &lt; 200 Mitarbeiter</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-3">⚡ Wiz ist die Wahl wenn...</h3>
              <ul className="space-y-1.5 text-sm text-blue-700">
                <li>• Enterprise mit &gt;$100k Security Budget</li>
                <li>• Multi-Cloud CSPM als Hauptanforderung</li>
                <li>• Agentless Scanning über alles</li>
                <li>• &gt;50 Compliance-Frameworks nötig</li>
                <li>• Dedicated Security-Team vorhanden</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔗 ClawGuru entdecken</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🛡️ Security Check</div><div className="text-sm text-gray-600">Kostenlos starten</div></a>
            <a href="/pricing" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">💰 Preise</div><div className="text-sm text-gray-600">Ab €0/Monat</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
