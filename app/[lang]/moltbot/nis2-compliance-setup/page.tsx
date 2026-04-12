import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot NIS2 Compliance: EU-Richtlinie Umsetzung 2024',
    description: 'NIS2-Richtlinie mit Moltbot umsetzen. Technische Maßnahmen nach Art. 21, Incident Reporting (24h/72h), Supply Chain Security und Risikobeurteilung für kritische Infrastrukturen.',
    keywords: ['moltbot nis2 compliance','nis2 richtlinie','nis2 technische massnahmen','nis2 incident reporting','kritis nis2','nis2 umsetzung'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'Moltbot NIS2 Compliance Setup 2024', description: 'NIS2-Richtlinie mit Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/nis2-compliance-setup` },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/nis2-compliance-setup'),
    robots: 'index, follow',
  };
}

const NIS2_MEASURES = [
  { art: 'Art. 21(2)(a)', measure: 'Risikoanalyse & Informationssicherheitsrichtlinien', status: 'automated', priority: 'P1' },
  { art: 'Art. 21(2)(b)', measure: 'Business Continuity, Backup-Management, DR', status: 'automated', priority: 'P1' },
  { art: 'Art. 21(2)(c)', measure: 'Supply Chain Security', status: 'partial', priority: 'P1' },
  { art: 'Art. 21(2)(d)', measure: 'Sicherheit beim Erwerb, Entwicklung, Wartung', status: 'automated', priority: 'P2' },
  { art: 'Art. 21(2)(e)', measure: 'Wirksamkeit von Cybersecurity-Maßnahmen', status: 'automated', priority: 'P1' },
  { art: 'Art. 21(2)(f)', measure: 'Grundlegende Cyber-Hygiene, Schulungen', status: 'manual', priority: 'P2' },
  { art: 'Art. 21(2)(g)', measure: 'Kryptografie und Verschlüsselung', status: 'automated', priority: 'P1' },
  { art: 'Art. 21(2)(h)', measure: 'Sicherheit des Personals, Zugangskontrolle', status: 'automated', priority: 'P1' },
  { art: 'Art. 21(2)(i)', measure: 'MFA, kontinuierliche Authentifizierung', status: 'automated', priority: 'P1' },
  { art: 'Art. 21(2)(j)', measure: 'Sicherheit der Kommunikation (Sprache, Video)', status: 'partial', priority: 'P3' },
];

export default function MoltbotNis2Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-900 border-l-4 border-blue-500 p-4 mb-8 text-sm">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: NIS2-Compliance dient der systematischen Absicherung eigener Infrastrukturen. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot NIS2 Compliance Setup</h1>
        <p className="text-lg text-gray-300 mb-4">NIS2 gilt ab Oktober 2024 für kritische und wichtige Einrichtungen in der EU. Art. 21 definiert 10 Mindestmaßnahmen — Moltbot automatisiert 7 davon.</p>
        <div className="flex gap-3 mb-8 flex-wrap text-sm">
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">Bußgeld: bis 10 Mio. € / 2% Umsatz</span>
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">Incident: 24h Erstmeldung</span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Vollbericht: 72h</span>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📋 Art. 21 Maßnahmen — Umsetzungsstatus</h2>
          <div className="space-y-2">
            {NIS2_MEASURES.map(({ art, measure, status, priority }) => (
              <div key={art} className={`flex items-start gap-3 p-3 rounded-lg border ${status === 'automated' ? 'bg-green-900/30 border-green-700' : status === 'partial' ? 'bg-yellow-900/30 border-yellow-700' : 'bg-gray-800 border-gray-700'}`}>
                <span className="font-mono text-xs text-gray-400 w-28 flex-shrink-0 mt-0.5">{art}</span>
                <div className="flex-1 text-sm">{measure}</div>
                <span className={`text-xs font-bold flex-shrink-0 ${priority === 'P1' ? 'text-red-400' : priority === 'P2' ? 'text-orange-400' : 'text-gray-400'}`}>{priority}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${status === 'automated' ? 'bg-green-900 text-green-300' : status === 'partial' ? 'bg-yellow-900 text-yellow-300' : 'bg-gray-700 text-gray-300'}`}>
                  {status === 'automated' ? '✅ Auto' : status === 'partial' ? '⚠️ Partial' : '🔧 Manuell'}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">⏱️ NIS2 Incident Reporting Prozess</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { phase: 'T+0', title: 'Incident erkannt', action: 'Moltbot Auto-Detection + Alert an CISO/Geschäftsführung', color: 'red' },
              { phase: 'T+24h', title: 'Erstmeldung', action: 'Frühwarnung an BSI/nationale Behörde: Art, Schwere, erster Umfang', color: 'orange' },
              { phase: 'T+72h', title: 'Vollständiger Bericht', action: 'Detaillierter Bericht: Root Cause, betroffene Systeme, Maßnahmen', color: 'blue' },
            ].map(({ phase, title, action, color }) => (
              <div key={phase} className={`p-4 rounded-lg border-2 ${color === 'red' ? 'border-red-300 bg-red-900' : color === 'orange' ? 'border-orange-300 bg-orange-50' : 'border-blue-300 bg-blue-900'}`}>
                <div className={`text-2xl font-bold mb-1 ${color === 'red' ? 'text-red-700' : color === 'orange' ? 'text-orange-700' : 'text-blue-700'}`}>{phase}</div>
                <div className="font-semibold text-sm mb-2">{title}</div>
                <div className="text-xs text-gray-300">{action}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">NIS2 Gap Assessment</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 NIS2 Runbooks</div><div className="text-sm text-gray-300">Compliance Playbooks</div></a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔮 Oracle</div><div className="text-sm text-gray-300">Compliance Intelligence</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise NIS2</div><div className="text-sm text-gray-300">Managed Compliance</div></a>
          </div>
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
            url: "https://clawguru.org/de/moltbot/nis2-compliance-setup"
          }
        ]) }} />
      </div>
    </div>
  );
}
