import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Startup Security Foundation: Sicherheit von Tag 1 mit ClawGuru',
    description: 'Security für Startups von Anfang an. Minimales Security-Budget, maximale Wirkung: Auth, Secrets, TLS, Backup und Incident Response für Early-Stage Startups.',
    keywords: ['startup security','early stage security','security für startups','minimal security budget','startup compliance','security foundation'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Startup Security Foundation mit ClawGuru', description: 'Security für Startups von Tag 1.', type: 'article', url: `https://clawguru.org/${lang}/solutions/startup-security-foundation` },
    alternates: { canonical: `https://clawguru.org/${lang}/solutions/startup-security-foundation`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/solutions/startup-security-foundation`])) },
    robots: 'index, follow',
  };
}

export default function StartupSecurityPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-8 text-sm">
          <strong>Startup Security</strong>: Security ist keine Frage des Budgets, sondern der Priorität. Starte sicher — bevor der erste Breach kommt.
        </div>
        <h1 className="text-4xl font-bold mb-4">Startup Security Foundation</h1>
        <p className="text-lg text-gray-600 mb-8">Die 10 wichtigsten Security-Maßnahmen für Startups — pragmatisch, kosteneffizient und sofort umsetzbar.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🚀 Top 10 Startup Security Maßnahmen</h2>
          <div className="space-y-3">
            {[
              { rank: 1, action: 'Passwort-Manager für das gesamte Team', effort: '1 Tag', cost: '€5/User/Mo', impact: 'Kritisch' },
              { rank: 2, action: 'MFA überall (Google, GitHub, AWS, ...)', effort: '2 Stunden', cost: 'Kostenlos', impact: 'Kritisch' },
              { rank: 3, action: 'Secrets aus Code entfernen (.env + Vault)', effort: '1 Tag', cost: 'Kostenlos', impact: 'Kritisch' },
              { rank: 4, action: 'HTTPS überall (Let\'s Encrypt)', effort: '2 Stunden', cost: 'Kostenlos', impact: 'Kritisch' },
              { rank: 5, action: 'Tägliche automatisierte Backups', effort: '1 Tag', cost: '€10-50/Mo', impact: 'Hoch' },
              { rank: 6, action: 'Dependency Updates automatisieren (Renovate)', effort: '2 Stunden', cost: 'Kostenlos', impact: 'Hoch' },
              { rank: 7, action: 'Minimal-Privilegien für alle User/Services', effort: '1 Tag', cost: 'Kostenlos', impact: 'Hoch' },
              { rank: 8, action: 'Security Headers (Next.js Config)', effort: '1 Stunde', cost: 'Kostenlos', impact: 'Mittel' },
              { rank: 9, action: 'Incident Response Plan (1-Seiter)', effort: '1 Tag', cost: 'Kostenlos', impact: 'Mittel' },
              { rank: 10, action: 'Regelmäßiger Security Check (ClawGuru)', effort: '30 Min/Woche', cost: '€29/Mo', impact: 'Hoch' },
            ].map(({ rank, action, effort, cost, impact }) => (
              <div key={rank} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center flex-shrink-0">{rank}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{action}</div>
                  <div className="text-xs text-gray-500">{effort} · {cost}</div>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${impact === 'Kritisch' ? 'bg-red-100 text-red-700' : impact === 'Hoch' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{impact}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔗 ClawGuru für Startups</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🛡️ Kostenloser Check</div><div className="text-sm text-gray-600">Startup Security Audit</div></a>
            <a href="/runbooks" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">📚 Startup Runbooks</div><div className="text-sm text-gray-600">Schritt-für-Schritt</div></a>
            <a href="/pricing" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">💰 Explorer Plan</div><div className="text-sm text-gray-600">Kostenlos starten</div></a>
            <a href="/solutions" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🏢 Scale-up</div><div className="text-sm text-gray-600">Pro Plan ab €29/Mo</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
