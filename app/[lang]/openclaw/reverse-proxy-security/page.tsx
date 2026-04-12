import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw Reverse Proxy Security: nginx & Caddy Hardening 2024',
    description: 'Reverse Proxy Security für OpenClaw mit nginx und Caddy. Rate Limiting, IP Blocking, Security Headers, ModSecurity WAF und DDoS-Schutz. Produktionsreife Konfiguration.',
    keywords: ['openclaw reverse proxy','nginx security hardening','caddy security','modsecurity waf','rate limiting nginx','ddos protection'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'OpenClaw Reverse Proxy Security 2024', description: 'Reverse Proxy Hardening für OpenClaw.', type: 'article', url: `https://clawguru.org/${lang}/openclaw/reverse-proxy-security` },
    alternates: buildLocalizedAlternates(lang as Locale, '/openclaw/reverse-proxy-security'),
    robots: 'index, follow',
  };
}

export default function OpenClawReverseProxyPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Reverse Proxy Hardening schützt eigene Dienste. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw Reverse Proxy Security</h1>
        <p className="text-lg text-gray-300 mb-8">Gehärteter nginx als Security-Layer vor OpenClaw — Rate Limiting, WAF, Security Headers und DDoS-Schutz.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">⚙️ nginx Hardening Konfiguration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`# /etc/nginx/sites-available/openclaw — Gehärtete Konfiguration

# Rate Limiting Zones
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=3r/m;
limit_conn_zone $binary_remote_addr zone=perip:10m;

server {
    listen 443 ssl http2;
    server_name openclaw.example.com;

    # TLS
    ssl_certificate /etc/letsencrypt/live/openclaw.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/openclaw.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    # Security Headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Server Token verstecken
    server_tokens off;

    # Connection Limits
    limit_conn perip 20;

    # Auth Endpoints: strikteres Rate Limiting
    location /api/auth/ {
        limit_req zone=auth burst=5 nodelay;
        proxy_pass http://openclaw:3000;
    }

    # API Endpoints
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://openclaw:3000;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Blockiere bekannte Bad Paths
    location ~* (eval|base64|phpinfo|shell|cmd) {
        deny all;
        return 444;
    }
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">✅ Proxy Security Checklist</h2>
          <div className="space-y-2">
            {[
              'Rate Limiting auf alle API-Endpoints konfiguriert',
              'Auth-Endpoints mit strikterem Limit (3 req/min)',
              'Alle Security Headers gesetzt (X-Frame, CSP, HSTS)',
              'Server Version versteckt (server_tokens off)',
              'TLS 1.0/1.1 deaktiviert',
              'HTTP → HTTPS Redirect (301)',
              'Backend-Server nicht direkt erreichbar',
              'Access Logs aktiviert und gespeichert',
              'Error Logs auf keine sensiblen Infos geprüft',
              'IP-Blocking für bekannte Angreifer-Ranges',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
                <span>✅</span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">Header Check</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 nginx Runbooks</div><div className="text-sm text-gray-300">Proxy Guides</div></a>
            <a href="/openclaw" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔓 OpenClaw</div><div className="text-sm text-gray-300">Framework</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise WAF</div><div className="text-sm text-gray-300">Managed Proxy</div></a>
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
