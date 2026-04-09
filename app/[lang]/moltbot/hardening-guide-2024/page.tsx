import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Hardening Guide 2024: Production Security Standards',
    description: 'Aktueller Moltbot Hardening Guide 2024. Security Headers, Environment Hardening, Secrets Management, TLS-Konfiguration und CIS Benchmark Compliance für Production-Deployments.',
    keywords: ['moltbot hardening guide','production security','security headers','secrets management','tls configuration','cis benchmark'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Hardening Guide 2024: Production Security Standards', description: 'Aktueller Moltbot Hardening Guide für Production-Deployments.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/hardening-guide-2024`, images: ['/og-moltbot-hardening.jpg'] },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot/hardening-guide-2024`, languages: { de: 'https://clawguru.org/de/moltbot/hardening-guide-2024', en: 'https://clawguru.org/en/moltbot/hardening-guide-2024', es: 'https://clawguru.org/es/moltbot/hardening-guide-2024', fr: 'https://clawguru.org/fr/moltbot/hardening-guide-2024', pt: 'https://clawguru.org/pt/moltbot/hardening-guide-2024', it: 'https://clawguru.org/it/moltbot/hardening-guide-2024', ru: 'https://clawguru.org/ru/moltbot/hardening-guide-2024', zh: 'https://clawguru.org/zh/moltbot/hardening-guide-2024', ja: 'https://clawguru.org/ja/moltbot/hardening-guide-2024', ko: 'https://clawguru.org/ko/moltbot/hardening-guide-2024', ar: 'https://clawguru.org/ar/moltbot/hardening-guide-2024', hi: 'https://clawguru.org/hi/moltbot/hardening-guide-2024', tr: 'https://clawguru.org/tr/moltbot/hardening-guide-2024', pl: 'https://clawguru.org/pl/moltbot/hardening-guide-2024', nl: 'https://clawguru.org/nl/moltbot/hardening-guide-2024' } },
    robots: 'index, follow',
  };
}

export default function MoltbotHardeningGuidePage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Dieser Guide dient ausschließlich zur Härtung von Moltbot-Systemen. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Hardening Guide 2024</h1>
        <p className="text-lg text-gray-300 mb-8">Production-ready Security Hardening für Moltbot — Security Headers, Environment-Härtung, Secrets Management und TLS-Konfiguration nach CIS Benchmark.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🛡️ Security Headers (Next.js)</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`// next.config.js — Security Headers
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'nonce-{NONCE}'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.clawguru.org",
      "frame-ancestors 'none'",
    ].join('; '),
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔑 Secrets Management</h2>
          <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`# .env.example — Alle Secrets als Environment Variables
# ⚠️ NIEMALS echte Werte committen!

# Database
DATABASE_URL=postgresql://user:password@host:5432/moltbot?sslmode=require

# Auth
JWT_ACCESS_SECRET=<256-bit-random-string>
JWT_REFRESH_SECRET=<256-bit-random-string>
OAUTH2_CLIENT_SECRET=<from-identity-provider>

# Encryption
APP_ENCRYPTION_KEY=<32-byte-hex-key>

# Rate Limiting
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=<token>

# Admin
ADMIN_TOKEN=<256-bit-random-string>

# Minimum key length validation
node -e "
  const k = process.env.JWT_ACCESS_SECRET;
  if (!k || k.length < 64) throw new Error('JWT_ACCESS_SECRET zu kurz (min 64 Zeichen)');
  console.log('✅ Secrets valid');
"`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">✅ Hardening Checklist</h2>
          <div className="space-y-3">
            {[
              ['Security Headers gesetzt (HSTS, CSP, X-Frame-Options)', true],
              ['TLS 1.2+ erzwungen, TLS 1.0/1.1 deaktiviert', true],
              ['Alle Secrets als Env-Vars, keine Hardcoding', true],
              ['Non-root Docker User (UID 1001)', true],
              ['Read-only Filesystem im Container', true],
              ['Rate Limiting auf allen API-Endpoints', true],
              ['SQL-Injection Prevention (parameterisierte Queries)', true],
              ['Dependency Scanning im CI/CD (npm audit)', true],
              ['Secrets Rotation alle 90 Tage', false],
              ['Penetration Test jährlich', false],
            ].map(([item, done]) => (
              <div key={item as string} className={`flex items-center gap-3 p-3 rounded-lg ${done ? 'bg-green-900' : 'bg-gray-800'}`}>
                <span className="text-xl">{done ? '✅' : '⬜'}</span>
                <span className={`text-sm ${done ? 'text-green-300' : 'text-gray-300'}`}>{item as string}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🛡️ Security Check</div>
              <div className="text-sm text-gray-300">Hardening live prüfen</div>
            </a>
            <a href="/roast-my-moltbot" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🔥 Roast My Moltbot</div>
              <div className="text-sm text-gray-300">Config testen lassen</div>
            </a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">📚 Runbooks</div>
              <div className="text-sm text-gray-300">Hardening Playbooks</div>
            </a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🏢 Enterprise</div>
              <div className="text-sm text-gray-300">Managed Security</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
