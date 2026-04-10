import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'SOC2 Compliance Automatisierung mit ClawGuru 2024',
    description: 'SOC2 Type II Compliance mit ClawGuru automatisieren. Kontinuierliches Monitoring, Evidence Collection, Trust Service Criteria und automatisierte Auditor-Reports. SOC2 in 90 Tagen.',
    keywords: ['soc2 compliance automation','soc2 type ii','trust service criteria','evidence collection','soc2 audit','continuous monitoring soc2'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'SOC2 Compliance Automatisierung mit ClawGuru 2024', description: 'SOC2 Type II Compliance mit ClawGuru.', type: 'article', url: `https://clawguru.org/${lang}/solutions/soc2-compliance-automation` },
    alternates: { canonical: `https://clawguru.org/${lang}/solutions/soc2-compliance-automation`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/solutions/soc2-compliance-automation`])) },
    robots: 'index, follow',
  };
}

const TSC_CRITERIA = [
  { code: 'CC1', name: 'Control Environment', desc: 'Organisatorische Kontrollen, Governance, Risikomanagement', status: 'automated' },
  { code: 'CC2', name: 'Communication & Information', desc: 'Informations- und Kommunikationssysteme', status: 'automated' },
  { code: 'CC3', name: 'Risk Assessment', desc: 'Risikobewertung und -behandlung', status: 'partial' },
  { code: 'CC4', name: 'Monitoring Activities', desc: 'Kontinuierliches Monitoring und Alerting', status: 'automated' },
  { code: 'CC5', name: 'Control Activities', desc: 'Technische und operative Kontrollen', status: 'automated' },
  { code: 'CC6', name: 'Logical & Physical Access', desc: 'Zugangskontrolle, Authentication, Authorization', status: 'automated' },
  { code: 'CC7', name: 'System Operations', desc: 'Change Management, Incident Response', status: 'automated' },
  { code: 'CC8', name: 'Change Management', desc: 'Change Control Prozesse und Reviews', status: 'partial' },
  { code: 'CC9', name: 'Risk Mitigation', desc: 'Business Continuity, Vendor Management', status: 'manual' },
];

export default function Soc2CompliancePage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-900 border-l-4 border-blue-500 p-4 mb-8 text-sm text-blue-100">
          <strong>ClawGuru SOC2</strong>: Nicht ein Pentest-Tool — sondern die Compliance-Plattform für automatisierte Evidence Collection und kontinuierliches SOC2 Monitoring.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">SOC2 Compliance Automatisierung</h1>
        <p className="text-lg text-gray-300 mb-8">Von manueller Evidence Collection zu vollautomatisierter SOC2 Type II Compliance — mit ClawGuru in 90 Tagen audit-ready.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📋 Trust Service Criteria Coverage</h2>
          <div className="space-y-3">
            {TSC_CRITERIA.map(({ code, name, desc, status }) => (
              <div key={code} className={`flex items-start gap-4 p-4 rounded-lg border ${status === 'automated' ? 'bg-green-900/30 border-green-700' : status === 'partial' ? 'bg-yellow-900/30 border-yellow-700' : 'bg-gray-800 border-gray-700'}`}>
                <div className="font-mono text-sm font-bold text-gray-400 w-10 flex-shrink-0">{code}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${status === 'automated' ? 'bg-green-900 text-green-300' : status === 'partial' ? 'bg-yellow-900 text-yellow-300' : 'bg-gray-700 text-gray-300'}`}>
                  {status === 'automated' ? '✅ Automatisch' : status === 'partial' ? '⚠️ Teilautomatisch' : '🔧 Manuell'}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">⚡ 90-Tage SOC2 Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { phase: 'Monat 1', title: 'Gap Assessment', tasks: ['Current State Analyse', 'Risikobewertung', 'Scope Definition', 'Control Mapping'], color: 'blue' },
              { phase: 'Monat 2', title: 'Implementation', tasks: ['Controls implementieren', 'ClawGuru Monitoring', 'Evidence Collection starten', 'Policies dokumentieren'], color: 'orange' },
              { phase: 'Monat 3', title: 'Audit Ready', tasks: ['Audit Simulation', 'Evidence Review', 'Lücken schließen', 'Auditor Übergabe'], color: 'green' },
            ].map(({ phase, title, tasks, color }) => (
              <div key={phase} className={`p-4 rounded-lg border ${color === 'blue' ? 'bg-blue-900 border-blue-700' : color === 'orange' ? 'bg-orange-50 border-orange-700' : 'bg-green-900 border-green-700'}`}>
                <div className="text-xs font-bold text-gray-400 mb-1">{phase}</div>
                <div className="font-bold text-lg mb-3">{title}</div>
                <ul className="space-y-1">
                  {tasks.map(t => <li key={t} className="text-sm text-gray-200">• {t}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 ClawGuru für SOC2</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">SOC2 Gap Assessment</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 Compliance Runbooks</div><div className="text-sm text-gray-300">SOC2 Control Guides</div></a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔮 Oracle</div><div className="text-sm text-gray-300">Compliance Intelligence</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise</div><div className="text-sm text-gray-300">Managed SOC2</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
