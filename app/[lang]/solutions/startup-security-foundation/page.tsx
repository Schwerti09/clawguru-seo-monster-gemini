import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Startup Security Foundation: Sicherheit von Tag 1 mit ClawGuru',
    description: 'Security für Startups von Anfang an. Minimales Security-Budget, maximale Wirkung: Auth, Secrets, TLS, Backup und Incident Response für Early-Stage Startups.',
    keywords: ['startup security','early stage security','security für startups','minimal security budget','startup compliance','security foundation'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'Startup Security Foundation mit ClawGuru', description: 'Security für Startups von Tag 1.', type: 'article', url: `https://clawguru.org/${lang}/solutions/startup-security-foundation` },
    alternates: buildLocalizedAlternates(lang as Locale, '/solutions/startup-security-foundation'),
    robots: 'index, follow',
  };
}

export default function StartupSecurityPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: lang === 'de' ? 'Welche Security-Maßnahmen braucht ein Startup von Tag 1?' : 'What security measures does a startup need from day 1?', acceptedAnswer: { '@type': 'Answer', text: lang === 'de' ? 'Startup Security Minimum Day 1: HTTPS/TLS überall (Let¹s Encrypt), Passwort-Manager für Team (1Password/Bitwarden), MFA auf allen kritischen Accounts (GitHub, AWS, E-Mail), Secrets nie in Git (GitGuardian pre-commit hook), Backups (3-2-1 Regel). Diese 5 Maßnahmen verhindern 80% aller Startup-Sicherheitsvorfälle.' : 'Startup security minimum day 1: HTTPS/TLS everywhere (Let¹s Encrypt), password manager for team (1Password/Bitwarden), MFA on all critical accounts (GitHub, AWS, email), never secrets in Git (GitGuardian pre-commit hook), backups (3-2-1 rule). These 5 measures prevent 80% of all startup security incidents.' } },
      { '@type': 'Question', name: lang === 'de' ? 'Wie manage ich Secrets sicher in einem Startup?' : 'How do I manage secrets securely in a startup?', acceptedAnswer: { '@type': 'Answer', text: lang === 'de' ? 'Startup Secrets Management: Umgebungsvariablen via .env-Dateien (nie in Git). Hosting: Netlify/Vercel Environment Variables, Heroku Config Vars. Self-Hosted: HashiCorp Vault (kostenlos). Cloud: AWS Secrets Manager, GCP Secret Manager. GitHub: GitHub Secrets für CI/CD. GitGuardian Free Tier scannt Public Repos auf geleakte Secrets automatisch.' : 'Startup secrets management: environment variables via .env files (never in Git). Hosting: Netlify/Vercel environment variables, Heroku config vars. Self-hosted: HashiCorp Vault (free). Cloud: AWS Secrets Manager, GCP Secret Manager. GitHub: GitHub Secrets for CI/CD. GitGuardian free tier automatically scans public repos for leaked secrets.' } },
      { '@type': 'Question', name: lang === 'de' ? 'Wann braucht ein Startup eine Sicherheitsrichtlinie?' : 'When does a startup need a security policy?', acceptedAnswer: { '@type': 'Answer', text: lang === 'de' ? 'Sicherheitsrichtlinie sofort wenn: erste Mitarbeiter eingestellt werden, erster Enterprise-Kunde (fragt nach Vendor-Security-Assessment), erste Compliance-Anforderung (SOC 2, ISO 27001), Finanzierungsrunde (Due Diligence). Minimale Policy deckt ab: Passwort-Richtlinie, Acceptable Use, Incident Response, Data Classification.' : 'Security policy immediately when: hiring first employees, first enterprise customer (asks for vendor security assessment), first compliance requirement (SOC 2, ISO 27001), funding round (due diligence). Minimal policy covers: password policy, acceptable use, incident response, data classification.' } },
      { '@type': 'Question', name: lang === 'de' ? 'Was ist das minimale Security-Budget für ein Startup?' : 'What is the minimum security budget for a startup?', acceptedAnswer: { '@type': 'Answer', text: lang === 'de' ? 'Startup Security Budget (minimal, ~500 EUR/Monat): 1Password Teams 19 EUR/Monat, Cloudflare Pro 20 EUR/Monat (WAF, DDoS), GitHub Teams 44 EUR/Monat (Private Repos, Actions), Sentry 26 EUR/Monat (Error Monitoring), Backblaze B2 Backup ~10 EUR/Monat. Kostenlos: Let¹s Encrypt, GitGuardian Free, Dependabot. ClawGuru Security Check: kostenloses Assessment.' : 'Startup security budget (minimal, ~500 EUR/month): 1Password Teams 19 EUR/month, Cloudflare Pro 20 EUR/month (WAF, DDoS), GitHub Teams 44 EUR/month (private repos, actions), Sentry 26 EUR/month (error monitoring), Backblaze B2 backup ~10 EUR/month. Free: Let¹s Encrypt, GitGuardian Free, Dependabot. ClawGuru Security Check: free assessment.' } },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-purple-900 border-l-4 border-purple-400 p-4 mb-8 text-sm">
          <strong>Startup Security</strong>: Security ist keine Frage des Budgets, sondern der Priorität. Starte sicher — bevor der erste Breach kommt.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Startup Security Foundation</h1>
        <p className="text-lg text-gray-300 mb-8">Die 10 wichtigsten Security-Maßnahmen für Startups — pragmatisch, kosteneffizient und sofort umsetzbar.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🚀 Top 10 Startup Security Maßnahmen</h2>
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
              <div key={rank} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg border">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center flex-shrink-0">{rank}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{action}</div>
                  <div className="text-xs text-gray-400">{effort} · {cost}</div>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${impact === 'Kritisch' ? 'bg-red-100 text-red-700' : impact === 'Hoch' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{impact}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 ClawGuru für Startups</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Kostenloser Check</div><div className="text-sm text-gray-300">Startup Security Audit</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 Startup Runbooks</div><div className="text-sm text-gray-300">Schritt-für-Schritt</div></a>
            <a href="/pricing" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">💰 Explorer Plan</div><div className="text-sm text-gray-300">Kostenlos starten</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Scale-up</div><div className="text-sm text-gray-300">Pro Plan ab €29/Mo</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
