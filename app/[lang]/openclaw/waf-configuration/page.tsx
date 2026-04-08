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
  const title = "WAF Configuration: Web Application Firewall Setup 2026"
  const description = "Complete WAF configuration guide for web application security. Learn OWASP rules, custom policies, and best practices for firewall deployment."
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

export default function WafConfigurationPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This guide is for hardening your own systems. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">WAF Configuration: Web Application Firewall Setup</h1>
        <p className="text-lg text-gray-600 mb-8">Complete guide to configuring web application firewalls with OWASP rules and custom security policies.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">WAF Fundamentals</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Core Components</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>OWASP Core Rule Set (CRS) integration</li>
              <li>Custom rule configuration</li>
              <li>Rate limiting and DDoS protection</li>
              <li>Request/response inspection</li>
              <li>Virtual patching capabilities</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">ModSecurity Configuration</h2>
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
          <h2 className="text-2xl font-semibold mb-4">Cloudflare WAF Setup</h2>
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
          <h2 className="text-2xl font-semibold mb-4">Nginx WAF Configuration</h2>
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
          <h2 className="text-2xl font-semibold mb-4">WAF Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Rule Management</h3>
              <p className="text-sm text-blue-700">Regularly update OWASP CRS and review custom rules for false positives.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Monitoring</h3>
              <p className="text-sm text-green-700">Implement comprehensive logging and alerting for WAF events.</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Testing</h3>
              <p className="text-sm text-yellow-700">Test WAF rules in monitoring mode before enabling blocking.</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Performance</h3>
              <p className="text-sm text-red-700">Optimize rule sets to balance security with application performance.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">Security Check</div>
              <div className="text-sm text-gray-600">Scan your system now</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">Runbooks</div>
              <div className="text-sm text-gray-600">600+ security playbooks</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">OpenClaw Framework</div>
              <div className="text-sm text-gray-600">Self-hosted security</div>
            </a>
            <a href={`/${locale}/nginx-hardening`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">Nginx Hardening</div>
              <div className="text-sm text-gray-600">Complete security guide</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
