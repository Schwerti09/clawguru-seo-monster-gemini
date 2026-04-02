import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";
import { getCoreSecurityLinks } from "@/lib/core-security-links";

export const dynamic = "force-static";
export const revalidate = 86400;
export const runtime = "nodejs";

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
      ? "Grafana Hardening 2026: Sicherheits-Guide | SOC 2 & ISO 27001"
      : "Grafana Hardening 2026: Security Guide | SOC 2 & ISO 27001",
    description: locale === "de"
      ? "Kompletter Grafana Hardening Guide: Authentifizierung, Autorisierung, Netzwerk-Security, Secrets Management & Compliance. Enterprise Observability Security."
      : "Complete Grafana hardening guide: Authentication, authorization, network security, secrets management & compliance. Enterprise observability security.",
    keywords: [
      "Grafana hardening",
      "Grafana security",
      "Grafana SSO",
      "Grafana OAuth",
      "Grafana LDAP",
      "Grafana SAML",
      "Grafana RBAC",
      "Grafana compliance",
      "Grafana SOC 2",
      "Grafana audit",
      "Observability security",
      "Grafana enterprise",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/grafana-hardening`),
    },
    openGraph: {
      title: "Grafana Hardening 2026: Enterprise Security Guide",
      description: "Secure your Grafana installation with SSO, RBAC, network policies & compliance controls.",
      type: "article",
      url: `${BASE_URL}/${locale}/grafana-hardening`,
    },
  };
}

export default async function GrafanaHardeningPage({
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-300/30 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-yellow-200 animate-pulse" />
              Observability Security 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Grafana Hardening
            </h1>
            <p className="text-2xl text-yellow-100 mb-4 font-light">
              {isGerman 
                ? "Enterprise Security für Observability"
                : "Enterprise Security for Observability"}
            </p>
            <p className="text-xl text-white/80 mb-8">
              {isGerman
                ? "SSO, RBAC, Netzwerk-Security, Secrets Management & Compliance. Schützen Sie Ihre Metriken und Dashboards."
                : "SSO, RBAC, network security, secrets management & compliance. Protect your metrics and dashboards."}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">OAuth/SAML</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">RBAC</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">mTLS</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Vault Integration</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              {isGerman ? "Warum Grafana Hardening kritisch ist" : "Why Grafana Hardening is Critical"}
            </h2>
            
            <p className="text-slate-700 text-lg mb-6 leading-relaxed">
              {isGerman
                ? "Grafana ist das zentrale Nervensystem Ihrer Observability-Infrastruktur. Es hat Zugriff auf alle Metriken, Logs und Traces. Ein kompromittiertes Grafana bedeutet vollständige Einsehbarkeit Ihrer Systeme - ein Goldmine für Angreifer."
                : "Grafana is the central nervous system of your observability infrastructure. It has access to all metrics, logs, and traces. A compromised Grafana means complete visibility into your systems - a goldmine for attackers."}
            </p>

            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-6 mb-8">
              <h3 className="text-red-900 font-semibold mb-2">
                {isGerman ? "⚠️ Risiken eines unsicheren Grafana" : "⚠️ Risks of an Unsecured Grafana"}
              </h3>
              <ul className="text-red-800 space-y-2 text-sm">
                <li>• {isGerman ? "Einsehbarkeit aller System-Metriken und Performance-Daten" : "Visibility of all system metrics and performance data"}</li>
                <li>• {isGerman ? "Zugriff auf Logs mit potenziell sensiblen Daten" : "Access to logs with potentially sensitive data"}</li>
                <li>• {isGerman ? "Datenexfiltration über Alerting-Kanäle" : "Data exfiltration via alerting channels"}</li>
                <li>• {isGerman ? "Lateral Movement über Dashboard-Links" : "Lateral movement via dashboard links"}</li>
                <li>• {isGerman ? "Compliance-Verstöße (GDPR, SOC 2, ISO 27001)" : "Compliance violations (GDPR, SOC 2, ISO 27001)"}</li>
              </ul>
            </div>
          </section>

          {/* Authentication */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">SSO & Authentifizierung</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-3">OAuth 2.0 / OIDC</h3>
                <p className="text-slate-600 text-sm mb-4">
                  {isGerman ? "Google, Azure AD, Okta, Keycloak Integration" : "Google, Azure AD, Okta, Keycloak integration"}
                </p>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400">
{`[auth.generic_oauth]
enabled = true
name = OAuth
allow_sign_up = true
client_id = $CLIENT_ID
client_secret = $CLIENT_SECRET
scopes = openid email profile
auth_url = https://sso.company.com/auth
api_url = https://sso.company.com/userinfo
role_attribute_path = roles[0]`}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-3">SAML 2.0</h3>
                <p className="text-slate-600 text-sm mb-4">
                  {isGerman ? "Enterprise IdP Integration (Okta, OneLogin, ADFS)" : "Enterprise IdP integration (Okta, OneLogin, ADFS)"}
                </p>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400">
{`[auth.saml]
enabled = true
name = SAML
allow_sign_up = true
certificate_path = /etc/grafana/saml.crt
private_key_path = /etc/grafana/saml.key
idp_metadata_path = /etc/grafana/idp.xml
role_attribute_path = role`}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-semibold text-yellow-900 mb-4">MFA Enforcement Checklist</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "SSO Provider enforces MFA",
                  "No local admin accounts",
                  "Anonymous access disabled",
                  "Auto-logout configured",
                  "Session timeout < 8h",
                  "Password policy (if local)",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded border-2 border-yellow-400 flex items-center justify-center text-xs">☐</span>
                    <span className="text-yellow-800 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RBAC */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">RBAC & Zugriffskontrolle</h2>
            
            <p className="text-slate-700 mb-6">
              {isGerman
                ? "Grafana Enterprise bietet feingranulare RBAC. Definieren Sie wer welche Dashboards sehen, Datenquellen nutzen oder Alerting konfigurieren darf."
                : "Grafana Enterprise offers fine-grained RBAC. Define who can view which dashboards, use data sources, or configure alerting."}
            </p>

            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto mb-6">
              <h3 className="text-white font-semibold mb-4">RBAC Configuration Example</h3>
              <pre className="font-mono text-sm text-green-400">
{`# roles.yaml - Grafana Enterprise RBAC
customRoles:
  - name: 'production:viewer'
    description: 'View production dashboards only'
    permissions:
      - action: 'dashboards:read'
        scope: 'dashboards:prod-*'
      - action: 'datasources:query'
        scope: 'datasources:prometheus-prod'
    
  - name: 'sre:admin'
    description: 'Full SRE access'
    permissions:
      - action: '*'
        scope: '*'
    
  - name: 'developer:limited'
    description: 'Dev metrics only'
    permissions:
      - action: 'dashboards:read'
        scope: 'folders:dev'
      - action: 'alert.rules:read'
        scope: 'folders:dev'`}
              </pre>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Viewer</h4>
                <p className="text-sm text-blue-800">
                  {isGerman ? "Dashboards ansehen, keine Änderungen" : "View dashboards, no modifications"}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Editor</h4>
                <p className="text-sm text-green-800">
                  {isGerman ? "Dashboards erstellen/bearbeiten" : "Create/edit dashboards"}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-900 mb-2">Admin</h4>
                <p className="text-sm text-red-800">
                  {isGerman ? "Alle Berechtigungen + Benutzerverwaltung" : "All permissions + user management"}
                </p>
              </div>
            </div>
          </section>

          {/* Network Security */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Netzwerk-Security</h2>
            
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">mTLS (Mutual TLS)</h3>
                <p className="text-slate-600 text-sm mb-4">
                  {isGerman 
                    ? "Erzwingen Sie Client-Zertifikate für Grafana-Zugriff. Schützt gegen Token-Diebstahl."
                    : "Enforce client certificates for Grafana access. Protects against token theft."}
                </p>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400">
{`[server]
protocol = https
cert_file = /etc/grafana/grafana.crt
cert_key = /etc/grafana/grafana.key

# mTLS Client Certificate Auth
client_cert_auth = true
client_cert_allowed_organizations = ["Company Inc"]`}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">IP Whitelisting</h3>
                <p className="text-slate-600 text-sm mb-4">
                  {isGerman ? "Zugriff nur von bekannten IP-Bereichen erlauben" : "Only allow access from known IP ranges"}
                </p>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400">
{`# nginx.conf - Reverse Proxy
location /grafana/ {
    allow 10.0.0.0/8;
    allow 172.16.0.0/12;
    deny all;
    
    proxy_pass http://grafana:3000/;
    proxy_set_header X-Real-IP $remote_addr;
}`}
                </div>
              </div>
            </div>
          </section>

          {/* Secrets Management */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Secrets Management</h2>
            
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-purple-900 mb-4">HashiCorp Vault Integration</h3>
              <p className="text-purple-800 text-sm mb-4">
                {isGerman
                  ? "Nutzen Sie Vault für sichere Speicherung von Datenquellen-Credentials. Keine Secrets in Config-Files!"
                  : "Use Vault for secure storage of data source credentials. No secrets in config files!"}
              </p>
              <div className="bg-white rounded-lg p-4 font-mono text-xs text-slate-700">
{`# Vault configuration for Grafana
datasource:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090
    secureJsonData:
      httpHeaderValue1: '$__vault{secret/data/grafana:api_key}'
      
# Vault policy
path "secret/data/grafana/*" {
  capabilities = ["read"]
}`}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Environment Variables</h3>
              <p className="text-slate-600 text-sm mb-4">
                {isGerman ? "Alternative zu Vault: Docker Secrets oder Kubernetes Secrets" : "Alternative to Vault: Docker Secrets or Kubernetes Secrets"}
              </p>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400">
{`# docker-compose.yml
services:
  grafana:
    image: grafana/grafana-enterprise
    environment:
      - GF_SECURITY_ADMIN_PASSWORD__FILE=/run/secrets/admin_password
      - GF_AUTH_GENERIC_OAUTH_CLIENT_SECRET__FILE=/run/secrets/oauth_secret
    secrets:
      - admin_password
      - oauth_secret

secrets:
  admin_password:
    external: true
  oauth_secret:
    external: true`}
              </div>
            </div>
          </section>

          {/* Compliance */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Compliance & Audit</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-900 text-white rounded-xl p-6">
                <h3 className="font-semibold mb-4">Audit Logging</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Alle Login-Versuche</li>
                  <li>• Dashboard-Zugriffe</li>
                  <li>• Datenquellen-Queries</li>
                  <li>• Konfigurationsänderungen</li>
                  <li>• Alerting-Modifikationen</li>
                </ul>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">SIEM Integration</h3>
                <p className="text-slate-600 text-sm mb-4">
                  {isGerman ? "Exportieren Sie Audit-Logs zu Splunk, Datadog oder ELK" : "Export audit logs to Splunk, Datadog, or ELK"}
                </p>
                <div className="bg-slate-100 rounded-lg p-3 font-mono text-xs text-slate-700">
{`[auditing]
enabled = true
log_dashboard_content = true
log_data_source_queries = true`}
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-semibold text-green-900 mb-4">Compliance-Mapping</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-green-800">SOC 2:</span>
                  <ul className="text-green-700 mt-1 space-y-1">
                    <li>• CC6.1 - Access Control</li>
                    <li>• CC7.2 - Monitoring</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-green-800">ISO 27001:</span>
                  <ul className="text-green-700 mt-1 space-y-1">
                    <li>• A.9.1 - Access Policy</li>
                    <li>• A.12.4 - Logging</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-green-800">GDPR:</span>
                  <ul className="text-green-700 mt-1 space-y-1">
                    <li>• Art. 32 - Security</li>
                    <li>• Art. 5 - Access Log</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Hardening Checklist */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Grafana Hardening Checklist</h2>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Authentication</h3>
                  {[
                    "SSO (OAuth/SAML) enabled",
                    "Local auth disabled (if possible)",
                    "MFA enforced at IdP",
                    "Auto-logout configured (8h)",
                    "Anonymous access disabled",
                    "Signup disabled",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Security Settings</h3>
                  {[
                    "Strict-Transport-Security header",
                    "X-Content-Type-Options: nosniff",
                    "X-Frame-Options: deny",
                    "Content-Security-Policy configured",
                    "Secrets in Vault (not files)",
                    "mTLS for sensitive instances",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              {isGerman ? "Grafana Security Assessment" : "Grafana Security Assessment"}
            </h2>
            <p className="mb-6 max-w-2xl mx-auto">
              {isGerman
                ? "Überprüfen Sie Ihre Grafana-Konfiguration auf Sicherheitslücken."
                : "Check your Grafana configuration for security vulnerabilities."}
            </p>
            <a 
              href={coreLinks.check} 
              className="inline-block px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              {isGerman ? "Assessment Starten" : "Start Assessment"}
            </a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Grafana Hardening 2026: Security Guide",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
