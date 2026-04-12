import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Runtime Protection RASP: Self-Protecting Applications 2024',
    description: 'Runtime Application Self-Protection für Moltbot. RASP-Implementierung, Runtime Security, Application Control und Live Attack Prevention.',
    keywords: ['moltbot rasp','runtime protection','self-protecting applications','runtime security','application control','attack prevention'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'Moltbot Runtime Protection RASP 2024', description: 'RASP und Runtime Protection für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/runtime-protection-rasp` },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/runtime-protection-rasp'),
    robots: 'index, follow',
  };
}

export default function MoltbotRaspPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Was ist Moltbot Security?", acceptedAnswer: { "@type": "Answer", text: "Moltbot ist eine Security-Automation-Plattform mit 600+ Executable Runbooks, Live-Score und Compliance-Dashboard f&#xFC;r Self-Hosting-Infrastrukturen." } },
              { "@type": "Question", name: "Ist dieser Guide ein Penetrationstest?", acceptedAnswer: { "@type": "Answer", text: "Nein. Dieser Guide dient ausschlie&#xDF;lich zur Absicherung eigener Systeme. Kein Angriffs-Tool, keine illegalen Aktivit&#xE4;ten." } },
              { "@type": "Question", name: "Wo finde ich zugeh&#xF6;rige Runbooks?", acceptedAnswer: { "@type": "Answer", text: "Alle Runbooks sind unter /runbooks abrufbar. Jeder Befund im Security-Check enth&#xE4;lt einen direkten Link zum passenden Runbook." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Moltbot Security Guide",
            description: "Executable Security Runbooks und Hardening-Guides f&#xFC;r Moltbot-Infrastrukturen.",
            url: "https://clawguru.org/de/moltbot/runtime-protection-rasp"
          }
        ]) }} />
      </div>
    </div>
  );
}