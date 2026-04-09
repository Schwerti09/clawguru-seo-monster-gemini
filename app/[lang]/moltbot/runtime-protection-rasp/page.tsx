import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Runtime Protection RASP: Self-Protecting Applications 2024',
    description: 'Runtime Application Self-Protection für Moltbot. RASP-Implementierung, Runtime Security, Application Control und Live Attack Prevention.',
    keywords: ['moltbot rasp','runtime protection','self-protecting applications','runtime security','application control','attack prevention'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Runtime Protection RASP 2024', description: 'RASP und Runtime Protection für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/runtime-protection-rasp` },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot/runtime-protection-rasp`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/moltbot/runtime-protection-rasp`])) },
    robots: 'index, follow',
  };
}

export default function MoltbotRaspPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: RASP schützt eigene Anwendungen zur Laufzeit. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Runtime Protection RASP</h1>
        <p className="text-lg text-gray-300 mb-8">Runtime Application Self-Protection ist die letzte Verteidigungslinie. Anwendungen, die sich selbst schützen können, reduzieren Attack Surface um 70%.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">RASP Protection Layers</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Layer</th><th className="p-3 text-left">Schutz vor</th><th className="p-3 text-left">Mechanismus</th><th className="p-3 text-left">Impact</th></tr></thead>
              <tbody>
                {[
                  ['Input Validation', 'Injection Attacks', 'Pattern Matching', 'Hoch'],
                  ['Runtime Monitoring', 'Anomalous Behavior', 'Behavioral Analysis', 'Hoch'],
                  ['Memory Protection', 'Buffer Overflows', 'Bounds Checking', 'Mittel'],
                  ['API Control', 'Unauthorized API Calls', 'Call Filtering', 'Mittel'],
                  ['Data Flow', 'Data Exfiltration', 'Flow Tracking', 'Hoch'],
                ].map(([layer, threat, mechanism, impact]) => (
                  <tr key={layer} className="border-b hover:bg-gray-800">
                    <td className="p-3 font-medium">{layer}</td>
                    <td className="p-3 text-sm">{threat}</td>
                    <td className="p-3 text-sm">{mechanism}</td>
                    <td className="p-3 text-sm">{impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Resources</h2>
          <ul className="list-disc pl-4 space-y-2">
            <li><a href="https://clawguru.org/de/security/runtime-protection" target="_blank" rel="noopener noreferrer">Runtime Protection Guide</a></li>
            <li><a href="https://clawguru.org/de/security/self-protecting-apps" target="_blank" rel="noopener noreferrer">Self-Protecting Applications</a></li>
            <li><a href="https://clawguru.org/de/security/application-control" target="_blank" rel="noopener noreferrer">Application Control</a></li>
            <li><a href="https://clawguru.org/de/security/attack-prevention" target="_blank" rel="noopener noreferrer">Attack Prevention</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}