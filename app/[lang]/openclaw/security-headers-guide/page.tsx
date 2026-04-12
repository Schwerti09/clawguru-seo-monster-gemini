import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw Security Headers: CSP, HSTS & X-Headers Guide 2024',
    description: 'Komplette Security Headers Implementierung für OpenClaw. Content-Security-Policy, HSTS, X-Frame-Options, Permissions-Policy und Referrer-Policy. Next.js Konfiguration mit A+ Rating.',
    keywords: ['openclaw security headers','content security policy','hsts header','x-frame-options','permissions policy','http security headers'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'OpenClaw Security Headers Guide 2024', description: 'Security Headers für OpenClaw mit A+ Rating.', type: 'article', url: `https://clawguru.org/${lang}/openclaw/security-headers-guide` },
    alternates: buildLocalizedAlternates(lang as Locale, '/openclaw/security-headers-guide'),
    robots: 'index, follow',
  };
}

const HEADERS = [
  { name: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload', impact: 'HSTS – HTTPS erzwingen', critical: true },
  { name: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'", impact: 'XSS Prevention', critical: true },
  { name: 'X-Frame-Options', value: 'DENY', impact: 'Clickjacking Prevention', critical: true },
  { name: 'X-Content-Type-Options', value: 'nosniff', impact: 'MIME Sniffing Prevention', critical: true },
  { name: 'Referrer-Policy', value: 'strict-origin-when-cross-origin', impact: 'Referrer Leakage', critical: false },
  { name: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()', impact: 'Browser APIs sperren', critical: false },
  { name: 'X-XSS-Protection', value: '1; mode=block', impact: 'Legacy XSS Filter', critical: false },
  { name: 'Cross-Origin-Opener-Policy', value: 'same-origin', impact: 'Cross-Origin Isolation', critical: false },
];

export default function OpenClawSecurityHeadersPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Security Headers schützen Browser-Benutzer. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw Security Headers Guide</h1>
        <p className="text-lg text-gray-300 mb-8">Alle Security Headers für OpenClaw — von CSP über HSTS bis hin zu Permissions-Policy. Implementierung in Next.js mit A+ securityheaders.com Rating.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📋 Headers Übersicht</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Header</th><th className="p-3 text-left">Schutz</th><th className="p-3 text-left">Kritisch</th></tr></thead>
              <tbody>
                {HEADERS.map(({ name, impact, critical }) => (
                  <tr key={name} className={`border-b hover:bg-gray-800 ${critical ? 'font-medium' : ''}`}>
                    <td className="p-3 font-mono text-xs">{name}</td>
                    <td className="p-3 text-sm">{impact}</td>
                    <td className="p-3">{critical ? '🔴 Ja' : '🟡 Empfohlen'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">⚙️ Next.js Konfiguration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`// next.config.js — Security Headers für OpenClaw
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // Adjust for your needs
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://api.clawguru.org",
      "frame-ancestors 'none'",
    ].join('; ')
  },
];

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">Header live prüfen</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 Header Runbooks</div><div className="text-sm text-gray-300">CSP Guides</div></a>
            <a href="/openclaw" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔓 OpenClaw</div><div className="text-sm text-gray-300">Framework</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise</div><div className="text-sm text-gray-300">Managed Headers</div></a>
          </div>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Ist dieser Guide ein Penetrationstest?", acceptedAnswer: { "@type": "Answer", text: "Nein. Dieser Guide dient ausschlielich zur Absicherung eigener Systeme. Kein Angriffs-Tool, keine illegalen Aktivitten." } },
              { "@type": "Question", name: "Was ist OpenClaw?", acceptedAnswer: { "@type": "Answer", text: "OpenClaw ist das Open-Source Self-Hosting Security Framework von ClawGuru mit Executable Runbooks, Security-Check und Compliance-Dashboard." } },
              { "@type": "Question", name: "Wo finde ich die Runbooks?", acceptedAnswer: { "@type": "Answer", text: "Alle Runbooks sind unter /runbooks abrufbar. Jeder Befund im Security-Check enthlt einen direkten Link zum passenden Runbook." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "OpenClaw Security Guide",
            description: "Self-Hosted Security Hardening mit OpenClaw Executable Runbooks.",
            url: "https://clawguru.org/de/openclaw"
          }
        ]) }} />
      </div>
    </div>
  );
}
