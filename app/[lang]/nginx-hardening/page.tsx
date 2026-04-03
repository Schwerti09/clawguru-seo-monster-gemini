import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";
import { getCoreSecurityLinks } from "@/lib/core-security-links";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;

  return {
    title: locale === "de" 
      ? "Nginx Hardening 2026 | Web Server Security Guide"
      : "Nginx Hardening 2026 | Web Server Security Guide",
    description: locale === "de"
      ? "Nginx Hardening: TLS 1.3, Security Headers, Rate Limiting, ModSecurity, Brotli, OCSP Stapling & CIS Benchmarks."
      : "Nginx hardening: TLS 1.3, security headers, rate limiting, ModSecurity, Brotli, OCSP stapling & CIS benchmarks.",
    keywords: [
      "Nginx hardening",
      "Nginx security",
      "Nginx TLS 1.3",
      "Nginx headers",
      "Nginx rate limit",
      "Nginx ModSecurity",
      "Nginx brotli",
      "Nginx security headers",
      "Nginx CIS benchmark",
      "Web server security",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/nginx-hardening`),
    },
    openGraph: {
      title: "Nginx Hardening 2026: Web Server Security",
      description: "Harden Nginx with TLS 1.3, security headers, ModSecurity & rate limiting.",
      type: "article",
      url: `${BASE_URL}/${locale}/nginx-hardening`,
    },
  };
}

export default async function NginxHardeningPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);

  const isGerman = locale === "de";

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              Web Server Security 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Nginx Hardening
            </h1>
            <p className="text-2xl text-emerald-100 mb-4">
              Enterprise Web Server Security
            </p>
            <p className="text-xl text-white/80 mb-8">
              TLS 1.3, Security Headers, Rate Limiting, ModSecurity, Brotli, OCSP Stapling & CIS Benchmarks
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">TLS 1.3</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">HSTS</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">CSP</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">ModSecurity</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Nginx Security Grundlagen</h2>
            <p className="text-slate-700 text-lg mb-6">
              Nginx ist der meistgenutzte Web Server weltweit. Falsche Konfiguration führt zu Datenlecks, DDoS-Anfälligkeit und Compliance-Verstößen. Dieser Guide zeigt Production-Grade Hardening.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-semibold text-red-900 mb-2">Risiken</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Weak TLS/SSL</li>
                  <li>• Missing Headers</li>
                  <li>• No Rate Limiting</li>
                  <li>• Version Leakage</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-900 mb-2">Schutz</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• TLS 1.3 Only</li>
                  <li>• Security Headers</li>
                  <li>• Rate Limiting</li>
                  <li>• WAF Integration</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Compliance</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• PCI DSS</li>
                  <li>• SOC 2</li>
                  <li>• CIS Benchmark</li>
                  <li>• GDPR</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">TLS 1.3 Konfiguration</h2>
            
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">nginx.conf - SSL/TLS Hardening</h3>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com;
    
    # SSL Certificates
    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;
    
    # TLS 1.3 Only (Disable older versions)
    ssl_protocols TLSv1.3;
    ssl_prefer_server_ciphers off;
    
    # TLS 1.3 Ciphers (automatic, but explicit for compliance)
    ssl_ciphers TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256;
    
    # Session Configuration
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/ssl/certs/chain.crt;
    resolver 8.8.8.8 1.1.1.1 valid=300s;
    resolver_timeout 5s;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;
    add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" always;
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Rate Limiting & DDoS Protection</h2>
            
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Rate Limiting Config</h3>
              <pre className="font-mono text-sm text-green-400">
{`# Rate Limit Zones (http block)
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

limit_conn_zone $binary_remote_addr zone=addr:10m;

server {
    # General rate limiting
    location / {
        limit_req zone=general burst=20 nodelay;
        limit_conn addr 10;
        proxy_pass http://backend;
    }
    
    # API stricter limits
    location /api/ {
        limit_req zone=api burst=10 nodelay;
        proxy_pass http://api_backend;
    }
    
    # Login very strict
    location /login {
        limit_req zone=login burst=3 nodelay;
        proxy_pass http://auth_backend;
    }
    
    # Return 429 instead of 503
    limit_req_status 429;
    limit_conn_status 429;
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">ModSecurity WAF Integration</h2>
            
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">ModSecurity + OWASP CRS</h3>
              <pre className="font-mono text-sm text-green-400">
{`# Build Nginx with ModSecurity
# ./configure --add-module=/path/to/ModSecurity-nginx

server {
    modsecurity on;
    modsecurity_rules_file /etc/nginx/modsecurity.conf;
    
    location / {
        proxy_pass http://backend;
    }
}

# /etc/nginx/modsecurity.conf
SecRuleEngine On
SecRequestBodyAccess On
SecRequestBodyLimit 13107200
SecResponseBodyAccess On
SecResponseBodyLimit 524288

# Include OWASP CRS
Include /etc/modsecurity/crs/crs-setup.conf
Include /etc/modsecurity/crs/rules/*.conf`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Brotli Compression</h2>
            
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Brotli Config (better than gzip)</h3>
              <pre className="font-mono text-sm text-green-400">
{`# http block
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/javascript application/json image/svg+xml;

# Static pre-compressed files
location ~ \\.(css|js)$ {
    brotli_static on;
    try_files $uri$ext $uri =404;
}

# Compare: gzip vs brotli
# CSS: 14KB → gzip 4KB → brotli 2.5KB
# JS: 50KB → gzip 15KB → brotli 10KB`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Nginx Security Assessment</h2>
            <p className="mb-6">Validieren Sie Ihre Nginx-Konfiguration gegen CIS Benchmarks.</p>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-white text-green-600 rounded-lg font-semibold">
              Security Check
            </a>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <a href={`${prefix}/openclaw-security-check`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">OpenClaw Security Hub</a>
              <a href={`${prefix}/ai-agent-security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">AI Agent Security</a>
              <a href={`${prefix}/runbooks/security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Runbooks</a>
              <a href={coreLinks.methodology} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Methodology</a>
            </div>

          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Nginx Hardening 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
