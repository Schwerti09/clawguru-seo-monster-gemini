import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw/waf-configuration"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "WAF Konfiguration: Web Application Firewall Setup 2026 | OpenClaw"
  const description = "WAF Konfiguration für Web-Anwendungssicherheit: OWASP-Regeln, Custom Policies und Best Practices für ModSecurity, nginx WAF und Cloudflare WAF in selbst-gehosteten Infrastrukturen."
  return {
    title,
    description,
    keywords: ["waf configuration", "web application firewall", "owasp rules", "security policies", "firewall setup"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: ["/og-image.png"],
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Was ist eine WAF und wozu brauche ich sie?', acceptedAnswer: { '@type': 'Answer', text: 'Eine Web Application Firewall (WAF) analysiert HTTP/HTTPS-Traffic und blockiert bösartige Anfragen (SQL-Injection, XSS, CSRF, Path Traversal) bevor sie die Anwendung erreichen. Sie ist Pflicht für jede öffentlich erreichbare Web-Applikation.' } },
    { '@type': 'Question', name: 'Was sind OWASP ModSecurity Core Rules?', acceptedAnswer: { '@type': 'Answer', text: 'Das OWASP ModSecurity Core Rule Set (CRS) ist eine Sammlung von über 200 generischen WAF-Regeln, die die häufigsten Web-Angriffe blockieren. Es ist der Standard für ModSecurity und kompatibel mit nginx, Apache und IIS.' } },
    { '@type': 'Question', name: 'Was ist der Unterschied zwischen einer WAF und einer Netzwerk-Firewall?', acceptedAnswer: { '@type': 'Answer', text: 'Eine Netzwerk-Firewall filtert Traffic auf IP/Port-Ebene (Layer 3/4). Eine WAF analysiert den HTTP-Inhalt (Layer 7) und versteht Anwendungsprotokolle. Für Web-Sicherheit sind beide nötig — sie ergänzen sich.' } },
    { '@type': 'Question', name: 'Soll ich ModSecurity oder Cloudflare WAF verwenden?', acceptedAnswer: { '@type': 'Answer', text: 'Für Self-Hosted: ModSecurity mit nginx (kostenlos, volle Kontrolle, DSGVO-konform). Für Cloud/CDN: Cloudflare WAF (einfach, managed, aber Daten verlassen EU). Für DSGVO-konforme Self-Hosted Infrastruktur ist ModSecurity die erste Wahl.' } },
  ],
}

export default function WafConfigurationPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">&quot;Not a Pentest&quot; Hinweis</strong>: Dieser Guide dient der Absicherung eigener Web-Applikationen. Kein Angriffs-Tool.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">WAF Konfiguration: Web Application Firewall Setup</h1>
        <p className="text-lg text-gray-300 mb-8">Vollständige WAF-Konfiguration mit OWASP-Regeln und Custom Security Policies für ModSecurity, nginx WAF und Cloudflare.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">WAF Grundlagen</h2>
          <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-100">Kernkomponenten</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>OWASP Core Rule Set (CRS) Integration</li>
              <li>Custom-Regel-Konfiguration</li>
              <li>Rate-Limiting und DDoS-Schutz</li>
              <li>Request/Response-Inspektion</li>
              <li>Virtual Patching</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">ModSecurity Konfiguration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Enable ModSecurity with OWASP CRS
SecRuleEngine On
SecRequestBodyAccess On
SecResponseBodyAccess On
SecRequestBodyLimit 13107200
SecRequestBodyNoFilesLimit 131072

# Include OWASP Core Rule Set
Include owasp-modsecurity-crs/rules/*.conf

# Custom rules for application-specific protection
SecRule ARGS "@detectSQLi" \
    "id:1001,\
    phase:2,\
    block,\
    msg:'SQL Injection Attack Detected',\
    logdata:'Matched Data: %{MATCHED_VAR} found within %{MATCHED_VAR_NAME}',\
    tag:'application-multi',\
    tag:'language-multi',\
    tag:'platform-multi',\
    tag:'attack-sqli'"`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Cloudflare WAF Setup</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Cloudflare WAF Rules via API
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/firewall/rules" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "action": "block",
    "filter": {
      "expression": "(http.request.uri.path contains \"admin\" and ip.src ne 192.168.1.0/24)"
    },
    "description": "Block admin access except from internal network"
  }'

# Rate limiting rule
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/rate_limits" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "action": {
      "mode": "simulate",
      "response": {
        "content_type": "application/json",
        "body": "{\"error\":\"Rate limit exceeded\"}"
      }
    },
    "match": {
      "request": {
        "methods": ["POST"],
        "url": "https://example.com/api/*"
      }
    },
    "period": 60,
    "threshold": 100,
    "description": "API rate limiting"
  }'`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Nginx WAF Configuration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Nginx with ModSecurity module
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # Enable ModSecurity
    modsecurity on;
    modsecurity_rules_file /etc/nginx/modsec/main.conf;
    
    # Custom WAF rules
    location /api/ {
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
        
        # Request size limits
        client_max_body_size 1M;
        
        # Security headers
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";
    }
    
    # Rate limiting zone
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
}`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">WAF Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">Rule Management</h3>
              <p className="text-sm text-blue-200">Regularly update OWASP CRS and review custom rules for false positives.</p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">Monitoring</h3>
              <p className="text-sm text-green-200">Implement comprehensive logging and alerting for WAF events.</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">Testing</h3>
              <p className="text-sm text-yellow-200">Test WAF rules in monitoring mode before enabling blocking.</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">Performance</h3>
              <p className="text-sm text-red-200">Optimize rule sets to balance security with application performance.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">Scan your system now</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">600+ security playbooks</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw Framework</div>
              <div className="text-sm text-gray-300">Self-hosted security</div>
            </a>
            <a href={`/${locale}/nginx-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Nginx Hardening</div>
              <div className="text-sm text-gray-300">Complete security guide</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
