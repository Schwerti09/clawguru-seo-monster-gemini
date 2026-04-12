import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n";
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
      ? "Splunk Security 2026 | SIEM Security & SPL Hardening"
      : "Splunk Security 2026 | SIEM Security & SPL Hardening",
    description: locale === "de"
      ? "Splunk Security: Role-Based Access, Field Masking, Data Retention, SSL/TLS & Apps."
      : "Splunk security: role-based access, field masking, data retention, SSL/TLS & apps.",
    keywords: [
      "Splunk security",
      "Splunk SIEM security",
      "Splunk RBAC",
      "Splunk field masking",
      "Splunk data retention",
      "Splunk SSL",
      "Splunk SPL security",
      "Splunk apps security",
      "Splunk best practices",
      "Enterprise SIEM security",
    ],
    alternates: buildLocalizedAlternates(locale, "/splunk-security"),
    openGraph: {
      images: ["/og-image.png"],
      title: "Splunk Security 2026: SIEM Protection",
      description: "Secure Splunk with RBAC, field masking, data retention & SSL/TLS configuration.",
      type: "article",
      url: `${BASE_URL}/${locale}/splunk-security`,
    },
  };
}

export default async function SplunkSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: locale === 'de' ? 'Wie sichere ich Splunk gegen unbefugten Zugriff ab?' : 'How do I secure Splunk against unauthorized access?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'Splunk Hardening: HTTPS erzwingen, default admin-Passwort ändern, SSL für Forwarder-to-Indexer-Kommunikation, Role-based Access Control (RBAC) konfigurieren, Splunk Web hinter Reverse Proxy, Management Port (8089) einschränken, Audit Logging aktivieren.' : 'Splunk hardening: enforce HTTPS, change default admin password, SSL for forwarder-to-indexer communication, configure role-based access control (RBAC), Splunk Web behind reverse proxy, restrict management port (8089), enable audit logging.' } },
      { '@type': 'Question', name: locale === 'de' ? 'Was sind Splunk Indexes und wie schränke ich Zugriff ein?' : 'What are Splunk indexes and how do I restrict access?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'Splunk Indexes sind logische Datenspeicher. Zugriffskontrolle: Rollen können auf bestimmte Indexes beschränkt werden (srchIndexesAllowed in roles.conf). Separate Indexes für security, compliance, application logs erstellen. Sensible Daten in eigene Indexes isolieren und nur autorisierte Rollen gewähren.' : 'Splunk indexes are logical data stores. Access control: roles can be restricted to specific indexes (srchIndexesAllowed in roles.conf). Create separate indexes for security, compliance, application logs. Isolate sensitive data in dedicated indexes and grant only authorized roles.' } },
      { '@type': 'Question', name: locale === 'de' ? 'Wie aktiviere ich Splunk Audit Logging?' : 'How do I enable Splunk audit logging?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'Splunk loggt Audit-Events in den _audit Index automatisch. Splunk Audit App installieren für bessere Visualisierung. Wichtige Events: Login/Logout, Suchen, Config-Änderungen, User-Management. Alerts für suspicious Searches (z.B. password, secret, credential in SPL-Queries) konfigurieren.' : 'Splunk logs audit events to the _audit index automatically. Install Splunk Audit App for better visualization. Important events: login/logout, searches, config changes, user management. Configure alerts for suspicious searches (e.g. password, secret, credential in SPL queries).' } },
      { '@type': 'Question', name: locale === 'de' ? 'Was ist Splunk Phantom und wie sichert es Workflows ab?' : 'What is Splunk Phantom and how does it secure workflows?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'Splunk Phantom (jetzt Splunk SOAR) ist eine Security Orchestration-Plattform. Playbooks automatisieren Incident-Response: Alert erkannt > Enrichment > Containment > Notification. Phantom-Credentials für externe APIs in verschlüsseltem Vault speichern. Playbook-Code-Review obligatorisch.' : 'Splunk Phantom (now Splunk SOAR) is a security orchestration platform. Playbooks automate incident response: alert detected > enrichment > containment > notification. Store Phantom credentials for external APIs in encrypted vault. Playbook code review mandatory.' } },
    ],
  }
  return (
    <main className="min-h-screen bg-gray-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Splunk Security</h1>
            <p className="text-2xl text-emerald-200 mb-4">SIEM Security 2026</p>
            <p className="text-xl text-white/80 mb-8">Role-Based Access, Field Masking, Data Retention, SSL/TLS & App Security</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">RBAC</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SPL</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SSL</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Apps</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Splunk Security Architecture</h2>
            <p className="text-gray-200 text-lg mb-6">
              Splunk ist das zentrale SIEM mit sensitiven Logs. Falsche Konfigurationen können Compliance-Verstöße verursachen. Sichern Sie mit RBAC, Field Masking und strikter Datenaufbewahrung.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-900 border border-green-700 rounded-xl p-6">
                <h3 className="font-semibold text-green-900 mb-2">Access Control</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Role-Based Access</li>
                  <li>• LDAP/SSO Integration</li>
                  <li>• Index Restrictions</li>
                  <li>• Capability Filtering</li>
                </ul>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="font-semibold text-emerald-900 mb-2">Data Protection</h3>
                <ul className="text-sm text-emerald-800 space-y-1">
                  <li>• Field Masking</li>
                  <li>• Sedcmd Filtering</li>
                  <li>• Data Retention</li>
                  <li>• Index Archiving</li>
                </ul>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
                <h3 className="font-semibold text-teal-900 mb-2">Platform Security</h3>
                <ul className="text-sm text-teal-800 space-y-1">
                  <li>• SSL/TLS Encryption</li>
                  <li>• Certificate Management</li>
                  <li>• App Vetting</li>
                  <li>• Forwarder Security</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Role-Based Access Control</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# authentication.conf - Role Configuration
# /opt/splunk/etc/system/local/authentication.conf

[roleSecurityAnalyst]
cumulativeRTSrchJobsQuota = 10
cumulativeSrchJobsQuota = 10
federatedProviders = 
importRoles = user
rtSrchJobsQuota = 10
srchDiskQuota = 10000
srchFilter = splunk_server=local
srchIndexesAllowed = security;wineventlog;firewall;ids
srchIndexesDefault = security;wineventlog
srchJobsQuota = 10
srchTimeWin = -1

[roleSOCManager]
cumulativeRTSrchJobsQuota = 20
cumulativeSrchJobsQuota = 20
federatedProviders = 
importRoles = power
rtSrchJobsQuota = 20
srchDiskQuota = 50000
srchFilter = splunk_server=local
srchIndexesAllowed = *;security;wineventlog;firewall;ids;audit
srchIndexesDefault = security;wineventlog;audit
srchJobsQuota = 20
srchTimeWin = -1

[roleAuditor]
cumulativeRTSrchJobsQuota = 5
cumulativeSrchJobsQuota = 5
federatedProviders = 
importRoles = user
rtSrchJobsQuota = 5
srchDiskQuota = 5000
srchFilter = splunk_server=local
srchIndexesAllowed = audit;compliance
srchIndexesDefault = audit
srchJobsQuota = 5
srchTimeWin = -1

# authorize.conf - Capabilities
# /opt/splunk/etc/system/local/authorize.conf

[roleSecurityAnalyst]
edit_user = disabled
schedule_rtsearch = disabled
list_settings = disabled

schedule_search = enabled
run_collect = enabled
run_mcollect = enabled
run_msearch = enabled

[roleSOCManager]
# All search capabilities
schedule_rtsearch = enabled
can_delete = enabled

# User management for SOC
edit_user = enabled
edit_roles = disabled  # Cannot modify roles

[roleAuditor]
# Read-only access
edit_user = disabled
schedule_search = enabled

# Can export for compliance
output_file = enabled
export_results_is_visible = enabled

# authorize.conf - SAML/SSO
[authentication]
authType = SAML
authSettings = saml

[saml]
idpSSOUrl = https://company.okta.com/app/splunk/sso/saml
idpCertPath = /opt/splunk/etc/auth/saml/idp.crt
entityId = splunk.company.com
signAuthnRequest = true
signedAssertion = true
attributeQueryUrl = https://company.okta.com/api/v1/saml/users/\${userID}/lifecycle/refreshIdpToken
attributeQueryRequestSigned = true
attributeQueryResponseSigned = true
redirectPort = 443
role = SplunkAdmins
realName = firstName lastName
mail = email

# Group mappings
[groupMapping]
SplunkAdmins = admin
SplunkSecurity = SecurityAnalyst
SplunkSOC = SOCManager
SplunkAuditors = Auditor`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Field Masking & Data Protection</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# props.conf - Field Masking & Filtering
# /opt/splunk/etc/system/local/props.conf

# Credit Card Masking
[pan_masking]
SEDCMD-pan = s/\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}/XXXX-XXXX-XXXX-XXXX/g
EVAL-credit_card = case(match(_raw, "\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}"), "<MASKED>", true(), null())

# SSN Masking
[ssn_masking]
SEDCMD-ssn = s/\\d{3}-\\d{2}-\\d{4}/XXX-XX-XXXX/g
EVAL-ssn = case(match(_raw, "\\d{3}-\\d{2}-\\d{4}"), "<MASKED>", true(), null())

# Password Masking
[password_masking]
SEDCMD-password1 = s/(?i)(password|passwd|pwd)\\s*[:=]\\s*\\S+/\\1=********/g
SEDCMD-password2 = s/(?i)(pass|pwd)\\s*[=:]\\s*["']?[^"'\\s]+["']?/\\1=********/g

# API Key Masking
[api_key_masking]
SEDCMD-apikey = s/(?i)(api[_-]?key|apikey)\\s*[:=]\\s*\\S{16,}/\\1=****************/g
SEDCMD-bearer = s/bearer\\s+\\S+/bearer <TOKEN>/g

# PII Filtering - Generic
[pii_filtering]
# Email addresses
SEDCMD-email = s/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/<EMAIL>/g

# Phone numbers
SEDCMD-phone = s/\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b/<PHONE>/g

# IP addresses (internal)
SEDCMD-internal-ip = s/10\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}/<INTERNAL_IP>/g
SEDCMD-internal-ip2 = s/172\\.(1[6-9]|2[0-9]|3[01])\\.\\d{1,3}\\.\\d{1,3}/<INTERNAL_IP>/g
SEDCMD-internal-ip3 = s/192\\.168\\.\\d{1,3}\\.\\d{1,3}/<INTERNAL_IP>/g

# JWT Token Masking
[jwt_masking]
SEDCMD-jwt = s/eyJ[a-zA-Z0-9_-]*\\.eyJ[a-zA-Z0-9_-]*\\.[a-zA-Z0-9_-]*/<JWT_TOKEN>/g

# transforms.conf - Index Time Masking
# /opt/splunk/etc/system/local/transforms.conf

[mask_pan]
REGEX = \\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}
FORMAT = XXXX-XXXX-XXXX-XXXX
DEST_KEY = _raw

[mask_ssn]
REGEX = \\d{3}-\\d{2}-\\d{4}
FORMAT = XXX-XX-XXXX
DEST_KEY = _raw

# props.conf - Apply transforms
[source::.../*.log]
TRANSFORMS-mask-pan = mask_pan
TRANSFORMS-mask-ssn = mask_ssn

# Field-level filtering (search time)
# Use eval and if/case statements in SPL

# transforms.conf - Routing to nullQueue (drop data)
[null_queue]
REGEX = .
DEST_KEY = queue
FORMAT = nullQueue

[drop_healthchecks]
REGEX = health|/health|/ready|/alive
DEST_KEY = queue
FORMAT = nullQueue

# Route health checks to null
[source::.../access.log]
TRANSFORMS-drop-health = drop_healthchecks`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">SSL/TLS & Forwarder Security</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# server.conf - SSL Configuration
# /opt/splunk/etc/system/local/server.conf

[sslConfig]
# Enable SSL
enableSplunkdSSL = true
sslVersions = tls1.3
sslVersionsForClient = tls1.3
cipherSuite = TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
ecdhCurves = prime256v1,secp384r1,secp521r1

# Certificate paths
serverCert = $SPLUNK_HOME/etc/auth/server.pem
sslPassword = <encrypted_password>
sslRootCAPath = $SPLUNK_HOME/etc/auth/ca.pem

crlDistributionPoint = http://company.com/crl.pem

caCertFile = $SPLUNK_HOME/etc/auth/ca.pem
caPath = $SPLUNK_HOME/etc/auth

certCreateScript = $SPLUNK_HOME/bin/gencert.sh

[http]
# REST API SSL
enableSSL = true
sslVersions = tls1.3
sslVersionsForClient = tls1.3

# web.conf - Web Interface SSL
# /opt/splunk/etc/system/local/web.conf

[settings]
enableSplunkWebSSL = true
privKeyPath = $SPLUNK_HOME/etc/auth/splunkweb/privkey.pem
caCertPath = $SPLUNK_HOME/etc/auth/splunkweb/cert.pem
serverCert = $SPLUNK_HOME/etc/auth/splunkweb/server.pem

# Cipher suite
cipherSuite = TLS_AES_256_GCM_SHA384

# HSTS
httpStrictTransportSecurity = max-age=31536000; includeSubDomains

# Content Security Policy
contentSecurityPolicy = default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'

# outputs.conf - Forwarder SSL
# /opt/splunk/etc/system/local/outputs.conf

[tcpout]
defaultGroup = indexers

[tcpout:indexers]
server = indexer1.company.com:9997,indexer2.company.com:9997

# SSL for forwarder
sslPassword = <encrypted_password>
sslCertPath = $SPLUNK_HOME/etc/auth/forwarder.pem
sslRootCAPath = $SPLUNK_HOME/etc/auth/ca.pem
sslVerifyServerCert = true

# Client certificate
clientCert = $SPLUNK_HOME/etc/auth/client.pem
sslVersions = tls1.3

# inputs.conf - SSL Receiver
# /opt/splunk/etc/system/local/inputs.conf

[splunktcp-ssl:9997]
disabled = false

[SSL]
serverCert = $SPLUNK_HOME/etc/auth/server.pem
sslPassword = <encrypted_password>
sslRootCAPath = $SPLUNK_HOME/etc/auth/ca.pem
requireClientCert = true
sslVersions = tls1.3

# Universal Forwarder - Secure Deployment
# deploymentclient.conf
[deployment-client]
disabled = false
target-broker = deploymentserver.company.com:8089

[target-broker:deploymentServer]
targetUri = deploymentserver.company.com:8089

deploymentServer.conf - Server Side
[deploymentServer]
whitelist.0 = *  # Or specific allowlist

# App signing - Verify apps before install
# Install only signed apps from Splunkbase or internal repo`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Splunk Security Checklist</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4">Access & Authentication</h3>
                  {[
                    "SAML/SSO configured",
                    "Custom roles with least privilege",
                    "Index restrictions enforced",
                    "Audit logging enabled",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-gray-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4">Data Protection</h3>
                  {[
                    "SEDCMD masking configured",
                    "Credit card regex active",
                    "SSN masking enabled",
                    "PII routing to nullQueue",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-gray-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Splunk Security Assessment</h2>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-gray-800 text-green-400 rounded-lg font-semibold">Assessment Starten</a>
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
        headline: "Splunk Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
