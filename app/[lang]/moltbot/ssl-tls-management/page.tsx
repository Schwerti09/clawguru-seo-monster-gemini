import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot SSL/TLS Management: Zertifikate & Cipher Suites 2024',
    description: 'SSL/TLS Management für Moltbot. Let\'s Encrypt Automatisierung, TLS 1.3 Konfiguration, Certificate Pinning, HSTS Preloading und Cipher Suite Hardening. A+ SSL Labs Rating.',
    keywords: ['moltbot ssl tls','certificate management','lets encrypt','tls 1.3','cipher suite','hsts preloading','ssl labs'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot SSL/TLS Management: Zertifikate & Cipher Suites 2024', description: 'SSL/TLS Management für Moltbot mit A+ SSL Labs Rating.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/ssl-tls-management` },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot/ssl-tls-management`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/moltbot/ssl-tls-management`])) },
    robots: 'index, follow',
  };
}

export default function MoltbotSslTlsPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: SSL/TLS Management sichert Kommunikation ab. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot SSL/TLS Management</h1>
        <p className="text-lg text-gray-300 mb-8">A+ SSL Labs Rating für Moltbot — automatisierte Zertifikatsverwaltung, TLS 1.3 Enforcement und gehärtete Cipher Suites.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔒 TLS Hardening Konfiguration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`# nginx TLS Hardening für Moltbot (A+ SSL Labs Rating)
ssl_protocols TLSv1.2 TLSv1.3;

# Moderne Cipher Suites (Forward Secrecy)
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256;

ssl_prefer_server_ciphers off;  # TLS 1.3: Client-Präferenz
ssl_session_timeout 1d;
ssl_session_cache shared:MozSSL:10m;
ssl_session_tickets off;         # Disable Session Tickets (Forward Secrecy)

# OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;

# DH Parameters (4096-bit)
ssl_dhparam /etc/ssl/dhparam.pem;

# Security Headers
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔄 Let's Encrypt Auto-Renewal</h2>
          <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`# Certbot auto-renewal für clawguru.org
# Installation
apt-get install certbot python3-certbot-nginx

# Zertifikat ausstellen
certbot --nginx \\
  -d clawguru.org \\
  -d www.clawguru.org \\
  --email security@clawguru.org \\
  --agree-tos \\
  --no-eff-email

# Renewal Cron (alle 12 Stunden prüfen)
echo "0 */12 * * * root certbot renew --quiet --post-hook 'nginx -s reload'" \\
  >> /etc/cron.d/certbot

# Certificate Monitoring Script
#!/bin/bash
DOMAIN="clawguru.org"
EXPIRY=$(openssl s_client -connect $DOMAIN:443 -servername $DOMAIN \\
  </dev/null 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
NOW_EPOCH=$(date +%s)
DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))
echo "Certificate expires in $DAYS_LEFT days"
[ $DAYS_LEFT -lt 30 ] && echo "WARNING: Certificate expires soon!"`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">✅ TLS Configuration Checklist</h2>
          <div className="space-y-2">
            {[
              ['TLS 1.0 und 1.1 deaktiviert', true],
              ['TLS 1.2 und 1.3 aktiviert', true],
              ['Schwache Cipher Suites deaktiviert (RC4, DES, 3DES)', true],
              ['Perfect Forward Secrecy (ECDHE) aktiviert', true],
              ['HSTS Header gesetzt (max-age ≥ 1 Jahr)', true],
              ['HSTS Preload angefordert', true],
              ['OCSP Stapling aktiviert', true],
              ['Certificate Pinning (kritische Apps)', false],
              ['Automatische Erneuerung getestet', true],
              ['SSL Labs Score: A+', true],
            ].map(([item, done]) => (
              <div key={item as string} className={`flex items-center gap-3 p-2 rounded ${done ? 'bg-green-900' : 'bg-gray-800'}`}>
                <span>{done ? '✅' : '⬜'}</span>
                <span className="text-sm">{item as string}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">TLS live prüfen</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 TLS Runbooks</div><div className="text-sm text-gray-300">Certificate Guides</div></a>
            <a href="/openclaw" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔓 OpenClaw</div><div className="text-sm text-gray-300">TLS Framework</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise</div><div className="text-sm text-gray-300">Managed PKI</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
