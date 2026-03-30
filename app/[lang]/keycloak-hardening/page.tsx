import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";

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
      ? "Keycloak Hardening 2026: SSO Security Guide | IAM Best Practices"
      : "Keycloak Hardening 2026: SSO Security Guide | IAM Best Practices",
    description: locale === "de"
      ? "Umfassender Keycloak Hardening Guide: SSO, MFA, LDAP, OAuth 2.0 & OpenID Connect Security. Brute-Force Protection, Session Management & Compliance."
      : "Comprehensive Keycloak hardening guide: SSO, MFA, LDAP, OAuth 2.0 & OpenID Connect security. Brute-force protection, session management & compliance.",
    keywords: [
      "Keycloak hardening",
      "Keycloak security",
      "Keycloak SSO",
      "Keycloak OAuth",
      "Keycloak MFA",
      "Keycloak LDAP",
      "Keycloak best practices",
      "IAM security",
      "Identity management",
      "Keycloak configuration",
      "SSO hardening",
      "Keycloak cluster",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/keycloak-hardening`),
    },
    openGraph: {
      title: "Keycloak Hardening 2026: IAM Security Guide",
      description: "Secure your Keycloak IAM with MFA, brute-force protection, session management & compliance controls.",
      type: "article",
      url: `${BASE_URL}/${locale}/keycloak-hardening`,
    },
  };
}

export default async function KeycloakHardeningPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;

  const isGerman = locale === "de";

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
              Identity & Access Management 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Keycloak Hardening
            </h1>
            <p className="text-2xl text-blue-200 mb-4 font-light">
              {isGerman 
                ? "Enterprise IAM Security"
                : "Enterprise IAM Security"}
            </p>
            <p className="text-xl text-white/80 mb-8">
              {isGerman
                ? "SSO, MFA, Brute-Force Protection, Session Management & GDPR Compliance. Schützen Sie Ihre Identity Provider."
                : "SSO, MFA, brute-force protection, session management & GDPR compliance. Protect your identity provider."}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">OAuth 2.0</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">OpenID Connect</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SAML 2.0</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">LDAP/AD</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              {isGerman ? "Warum Keycloak Hardening?" : "Why Keycloak Hardening?"}
            </h2>
            
            <p className="text-slate-700 text-lg mb-6 leading-relaxed">
              {isGerman
                ? "Keycloak ist der zentrale Identity Provider (IdP) für Ihre Organisation. Ein kompromittiertes Keycloak ermöglicht Zugriff auf ALLE angebundenen Services. IAM-Security ist kritisch für Zero Trust."
                : "Keycloak is the central Identity Provider (IdP) for your organization. A compromised Keycloak enables access to ALL connected services. IAM security is critical for Zero Trust."}
            </p>

            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-6 mb-8">
              <h3 className="text-red-900 font-semibold mb-2">
                {isGerman ? "⚠️ Risiken eines unsicheren IAM" : "⚠️ Risks of an Unsecure IAM"}
              </h3>
              <ul className="text-red-800 space-y-2 text-sm">
                <li>• {isGerman ? "Single Point of Failure für alle Services" : "Single point of failure for all services"}</li>
                <li>• {isGerman ? "Lateral Movement zu allen angebundenen Apps" : "Lateral movement to all connected apps"}</li>
                <li>• {isGerman ? "Data Breach aller User-Daten" : "Data breach of all user data"}</li>
                <li>• {isGerman ? "GDPR Verstöße (PII in Token)" : "GDPR violations (PII in tokens)"}</li>
                <li>• {isGerman ? "Compliance-Audit-Failures (SOC 2, ISO 27001)" : "Compliance audit failures (SOC 2, ISO 27001)"}</li>
              </ul>
            </div>
          </section>

          {/* MFA Configuration */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Multi-Factor Authentication</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">📱</div>
                <h3 className="font-semibold text-blue-900">TOTP</h3>
                <p className="text-xs text-blue-700 mt-1">Google/Microsoft Authenticator</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🔑</div>
                <h3 className="font-semibold text-green-900">WebAuthn</h3>
                <p className="text-xs text-green-700 mt-1">YubiKey/FIDO2</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">📧</div>
                <h3 className="font-semibold text-purple-900">OTP Email</h3>
                <p className="text-xs text-purple-700 mt-1">Email-based (fallback)</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <h3 className="text-white font-semibold mb-4">MFA Flow Configuration (Realm Settings)</h3>
              <pre className="font-mono text-sm text-green-400">
{`# Authentication Flow: Browser → Conditional OTP
1. Cookie
2. Kerberos (optional)
3. Identity Provider Redirector
4. Forms
   └── Username/Password Form
   └── Conditional OTP
       └── Condition - User Configured
           └── OTP Form (if configured)
           └── WebAuthn (if registered)

# Required Actions for new users:
- Verify Email
- Update Profile
- Configure OTP (TOTP)
- WebAuthn Register`}
              </pre>
            </div>
          </section>

          {/* Brute Force Protection */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Brute-Force Protection</h2>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-slate-900 mb-4">Security Defenses</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">Login-Failures</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Max 5 failed attempts per IP</li>
                    <li>• 15-minute temporary lockout</li>
                    <li>• Exponential backoff</li>
                    <li>• CAPTCHA after 3 failures</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">Account Lockout</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Permanent lock after 10 failures</li>
                    <li>• Admin unlock required</li>
                    <li>• Email notification to user</li>
                    <li>• Audit log entry</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <h3 className="text-white font-semibold mb-4">Docker Compose with Security Settings</h3>
              <pre className="font-mono text-sm text-green-400">
{`services:
  keycloak:
    image: quay.io/keycloak/keycloak:25.0
    command: start --optimized
    environment:
      # Brute Force Protection
      - KC_SPI_LOGIN_FAILURE_FACTORY_MAX_FAILURES=5
      - KC_SPI_LOGIN_FAILURE_FACTORY_WAIT_INCREMENT_SECONDS=900
      - KC_SPI_LOGIN_FAILURE_FACTORY_MAX_WAIT_SECONDS=900
      - KC_SPI_LOGIN_FAILURE_FACTORY_FAILURE_RESET_TIME_SECONDS=43200
      
      # Session Settings
      - KC_SPI_SESSION_MAX_LIFESPAN=36000
      - KC_SPI_SESSION_IDLE_TIMEOUT=1800
      - KC_SPI_REMEMBER_ME=true
      
      # Password Policy
      - KC_PASSWORD_POLICY="length(12) and upperCase(1) and lowerCase(1) and digits(1) and specialChars(1) and notUsername(undefined) and notEmail(undefined)"
      
      # Security Headers
      - KC_HTTP_ENABLED=false
      - KC_HOSTNAME_STRICT=true
      - KC_HOSTNAME_STRICT_HTTPS=true
      
      # SSL/TLS
      - KC_HTTPS_CERTIFICATE_FILE=/certs/tls.crt
      - KC_HTTPS_CERTIFICATE_KEY_FILE=/certs/tls.key`}
              </pre>
            </div>
          </section>

          {/* Session Management */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Session & Token Management</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-semibold text-yellow-900 mb-3">SSO Session Settings</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-yellow-800">SSO Session Idle:</span>
                    <span className="font-medium text-yellow-900">30 Minuten</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-800">SSO Session Max:</span>
                    <span className="font-medium text-yellow-900">10 Stunden</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-800">Offline Session Idle:</span>
                    <span className="font-medium text-yellow-900">7 Tage</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-800">Login Timeout:</span>
                    <span className="font-medium text-yellow-900">30 Minuten</span>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-900 mb-3">Token Settings</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-800">Access Token:</span>
                    <span className="font-medium text-green-900">5 Minuten</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Refresh Token:</span>
                    <span className="font-medium text-green-900">30 Tage</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">ID Token:</span>
                    <span className="font-medium text-green-900">5 Minuten</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Revoke Refresh:</span>
                    <span className="font-medium text-green-900">✓ Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Client Configuration */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Client Security Configuration</h2>
            
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">OIDC Client Settings</h3>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400">
{`# Client Authentication
Client Authenticator: Client ID and Secret (or Signed JWT)
Client Secret: [Strong Random Secret]

# Authorization
Standard Flow Enabled: ✓
Implicit Flow Enabled: ✗ (deprecated)
Direct Access Grants Enabled: ✗ (for public clients)
OIDC CIBA Grant Enabled: ✗

# Security Settings
Valid Redirect URIs: https://app.company.com/* (exact match!)
Valid Post Logout Redirect URIs: https://company.com/logout
Web Origins: https://app.company.com

# Advanced Settings
Proof Key for Code Exchange Code Challenge Method: S256
Access Token Signature Algorithm: ES256 (or RS256)
ID Token Signature Algorithm: ES256
`}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-semibold text-red-900 mb-3">Public vs Confidential Clients</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-red-800 mb-2">Confidential (Backend)</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Client Secret required</li>
                      <li>• Authorization Code Flow</li>
                      <li>• PKCE optional but recommended</li>
                      <li>• Refresh tokens allowed</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-800 mb-2">Public (SPA/Mobile)</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• No client secret</li>
                      <li>• PKCE REQUIRED</li>
                      <li>• Authorization Code Flow</li>
                      <li>• Short refresh tokens</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* GDPR & Compliance */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">GDPR & Compliance</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">GDPR Features</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    User Data Export (JSON)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Account Deletion (Right to be Forgotten)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Consent Management
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Minimal PII in Tokens
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Audit Logging
                  </li>
                </ul>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Compliance Mapping</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-slate-800">SOC 2:</span>
                    <p className="text-slate-600">CC6.1 (Access Control), CC7.2 (Monitoring)</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-800">ISO 27001:</span>
                    <p className="text-slate-600">A.9.1 (Access Policy), A.9.2 (User Registration)</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-800">NIST:</span>
                    <p className="text-slate-600">IA-2 (Identification), AC-2 (Account Management)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Event Logging Configuration</h3>
              <pre className="font-mono text-sm text-green-400">
{`# Events to log (Admin → Realm Settings → Events)
Enabled Event Types:
- LOGIN
- LOGIN_ERROR
- LOGOUT
- REGISTER
- UPDATE_EMAIL
- UPDATE_PASSWORD
- UPDATE_PROFILE
- DELETE_ACCOUNT
- GRANT_CONSENT
- UPDATE_CONSENT
- REVOKE_GRANT
- REFRESH_TOKEN
- CLIENT_LOGIN

# Event Storage: JPA or External (Syslog/Fluentd)
# Retention: 90 days minimum for compliance`}
              </pre>
            </div>
          </section>

          {/* Hardening Checklist */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Keycloak Hardening Checklist</h2>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Authentication</h3>
                  {[
                    "MFA enforced for all users",
                    "WebAuthn/FIDO2 configured",
                    "Brute-force protection enabled",
                    "Password policy (12+ chars)",
                    "No default credentials",
                    "Admin 2FA mandatory",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Infrastructure</h3>
                  {[
                    "HTTPS/TLS 1.3 only",
                    "Reverse proxy (nginx/traefik)",
                    "Database encrypted (at rest)",
                    "Backup & DR tested",
                    "Cluster mode (HA)",
                    "Monitoring/Alerting",
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
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              {isGerman ? "Keycloak Security Assessment" : "Keycloak Security Assessment"}
            </h2>
            <p className="mb-6 max-w-2xl mx-auto">
              {isGerman
                ? "Überprüfen Sie Ihre Keycloak-Konfiguration auf Sicherheitslücken."
                : "Check your Keycloak configuration for security vulnerabilities."}
            </p>
            <a 
              href="/check" 
              className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              {isGerman ? "Assessment Starten" : "Start Assessment"}
            </a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Keycloak Hardening 2026: IAM Security Guide",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
