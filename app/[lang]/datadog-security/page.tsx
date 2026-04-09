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
      ? "Datadog Security 2026 | Observability Security & API Keys"
      : "Datadog Security 2026 | Observability Security & API Keys",
    description: locale === "de"
      ? "Datadog Security: API Keys, RBAC, Audit Logs, Sensitive Data Scanner & Log Sanitization."
      : "Datadog security: API keys, RBAC, audit logs, sensitive data scanner & log sanitization.",
    keywords: [
      "Datadog security",
      "Datadog API keys",
      "Datadog RBAC",
      "Datadog audit logs",
      "Datadog sensitive data scanner",
      "Datadog log security",
      "APM security",
      "Datadog compliance",
      "Observability security",
      "Datadog best practices",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/datadog-security`),
    },
    openGraph: {
      title: "Datadog Security 2026: Observability Protection",
      description: "Secure Datadog with RBAC, API keys, audit logging & sensitive data scanning.",
      type: "article",
      url: `${BASE_URL}/${locale}/datadog-security`,
    },
  };
}

export default async function DatadogSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Datadog Security</h1>
            <p className="text-2xl text-purple-200 mb-4">Observability Security 2026</p>
            <p className="text-xl text-white/80 mb-8">API Keys, RBAC, Audit Logs, Sensitive Data Scanner & Log Sanitization</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">API Keys</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">RBAC</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Scanner</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Audit</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Datadog Security Architecture</h2>
            <p className="text-slate-700 text-lg mb-6">
              Datadog verarbeitet Logs, Metriken und Traces - oft mit sensitiven Daten. PII, Credentials und interne IPs können in Logs landen. Sichern Sie mit Scanner, Sanitization und strikter RBAC.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-purple-50 border border-purple-700 rounded-xl p-6">
                <h3 className="font-semibold text-purple-900 mb-2">Access Control</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Custom Roles</li>
                  <li>• Granular Permissions</li>
                  <li>• SAML/SSO</li>
                  <li>• SCIM Provisioning</li>
                </ul>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-2">Data Protection</h3>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• Sensitive Data Scanner</li>
                  <li>• Log Sanitization</li>
                  <li>• PII Redaction</li>
                  <li>• Span Tag Filtering</li>
                </ul>
              </div>
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-6">
                <h3 className="font-semibold text-violet-900 mb-2">Compliance</h3>
                <ul className="text-sm text-violet-800 space-y-1">
                  <li>• Audit Logs</li>
                  <li>• Data Retention</li>
                  <li>• HIPAA/BAA</li>
                  <li>• EU Data Residency</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">API Keys & Application Keys</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Datadog API Keys - Best Practices

## Key Types:
# - API Keys: Data submission (metrics, logs, traces)
# - Application Keys: API access for dashboards, monitors

## Terraform - Datadog API Keys
resource "datadog_api_key" "agent_key" {
  name = "Production Agent Key"
}

resource "datadog_api_key" "ci_key" {
  name = "CI/CD Key"
}

resource "datadog_application_key" "terraform" {
  name   = "Terraform Management"
  scopes = ["dashboards_write", "monitors_write", "metrics_read"]
}

# Scoped Application Keys (Least Privilege)
resource "datadog_application_key" "readonly" {
  name   = "Read-Only Dashboards"
  scopes = ["dashboards_read", "monitors_read"]
}

## Agent Configuration - datadog.yaml
# /etc/datadog-agent/datadog.yaml
api_key: \${DD_API_KEY}  # Use env var, never hardcode

# Site configuration
dd_site: datadoghq.eu  # EU data residency

# Logs agent
logs_enabled: true
logs_config:
  # Sensitive data scrubbing
  processing_rules:
    - type: mask_sequences
      name: mask_credit_cards
      pattern: '\\d{4}-\\d{4}-\\d{4}-\\d{4}'
      replace_placeholder: '****-****-****-****'
    
    - type: mask_sequences
      name: mask_api_keys
      pattern: '(api[_-]?key|apikey)[\\s]*[=:][\\s]*["\\']?[\\w]{32,}["\\']?'
      replace_placeholder: '<API_KEY_MASKED>'
    
    - type: mask_sequences
      name: mask_passwords
      pattern: '(password|passwd|pwd)[\\s]*[=:][\\s]*["\\']?[^"\\']+["\\']?'
      replace_placeholder: '<PASSWORD_MASKED>'
    
    - type: mask_sequences
      name: mask_tokens
      pattern: 'bearer\\s+[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+'
      replace_placeholder: '<JWT_MASKED>'
    
    - type: exclude_at_match
      name: exclude_health_checks
      pattern: '/health|/ready|/alive'

# APM Configuration
apm_config:
  enabled: true
  env: production
  
  # Sensitive span tags
  replace_tags:
    - name: "http.url"
      pattern: "password=[^&]+"
      repl: "password=<REDACTED>"
    - name: "http.url"
      pattern: "token=[^&]+"
      repl: "token=<REDACTED>"
    - name: "http.request.body"
      pattern: ".*"
      repl: "<BODY_REDACTED>"
  
  # Ignore health checks
  ignore_resources:
    - "GET /health"
    - "GET /ready"
    - "GET /metrics"
  
  # Filter traces
  filter_tags:
    reject:
      - "http.user_agent:*kube-probe*"
      - "http.url:*/health*"

# Process Agent - Container security
process_config:
  enabled: true
  
  # Scrub sensitive args
  custom_sensitive_words:
    - 'password'
    - '-pass'
    - 'secret'
    - 'key'
    - 'token'
    - 'credentials'
  strip_proc_arguments: true`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">RBAC & Custom Roles</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Datadog RBAC - Custom Roles via API

# 1. Read-Only Role (Junior Devs)
POST https://api.datadoghq.eu/api/v2/roles
{
  "data": {
    "type": "roles",
    "attributes": {
      "name": "Read-Only Viewer",
      "description": "View dashboards and monitors only"
    },
    "relationships": {
      "permissions": {
        "data": [
          {"type": "permissions", "id": "dashboards_read"},
          {"type": "permissions", "id": "monitors_read"},
          {"type": "permissions", "id": "logs_read"},
          {"type": "permissions", "id": "apm_read"},
          {"type": "permissions", "id": "notebooks_read"}
        ]
      }
    }
  }
}

# 2. Dashboard Editor (Regular Users)
{
  "data": {
    "type": "roles",
    "attributes": {
      "name": "Dashboard Editor",
      "description": "Create and edit dashboards"
    },
    "relationships": {
      "permissions": {
        "data": [
          {"type": "permissions", "id": "dashboards_read"},
          {"type": "permissions", "id": "dashboards_write"},
          {"type": "permissions", "id": "monitors_read"},
          {"type": "permissions", "id": "logs_read"},
          {"type": "permissions", "id": "notebooks_write"},
          {"type": "permissions", "id": "metrics_read"}
        ]
      }
    }
  }
}

# 3. SRE Role (On-Call Engineers)
{
  "data": {
    "type": "roles",
    "attributes": {
      "name": "SRE On-Call",
      "description": "Full operational access, no admin"
    },
    "relationships": {
      "permissions": {
        "data": [
          {"type": "permissions", "id": "dashboards_read"},
          {"type": "permissions", "id": "dashboards_write"},
          {"type": "permissions", "id": "monitors_read"},
          {"type": "permissions", "id": "monitors_write"},
          {"type": "permissions", "id": "incident_read"},
          {"type": "permissions", "id": "incident_write"},
          {"type": "permissions", "id": "logs_read"},
          {"type": "permissions", "id": "logs_write"},
          {"type": "permissions", "id": "apm_read"},
          {"type": "permissions", "id": "slo_read"},
          {"type": "permissions", "id": "slo_write"},
          {"type": "permissions", "id": "synthetics_read"},
          {"type": "permissions", "id": "synthetics_write"}
        ]
      }
    }
  }
}

# 4. Security Auditor (Security Team)
{
  "data": {
    "type": "roles",
    "attributes": {
      "name": "Security Auditor",
      "description": "Audit logs and security signals"
    },
    "relationships": {
      "permissions": {
        "data": [
          {"type": "permissions", "id": "security_monitoring_rules_read"},
          {"type": "permissions", "id": "security_monitoring_signals_read"},
          {"type": "permissions", "id": "audit_logs_read"},
          {"type": "permissions", "id": "logs_read"},
          {"type": "permissions", "id": "apm_read"},
          {"type": "permissions", "id": "user_access_read"}
        ]
      }
    }
  }
}

# Restricted Access to Specific Monitors/Dashboards
# Using Teams and Restricted Access

# Create Team
POST https://api.datadoghq.eu/api/v2/team
{
  "data": {
    "attributes": {
      "handle": "platform-sre",
      "name": "Platform SRE"
    },
    "type": "team"
  }
}

# Add members to team
POST https://api.datadoghq.eu/api/v2/team/{team_id}/memberships
{
  "data": {
    "relationships": {
      "user": {
        "data": {
          "id": "user-id",
          "type": "users"
        }
      }
    },
    "type": "team_memberships"
  }
}

# Restrict dashboard to team (in UI: Dashboard Settings > Permissions)
# Set "Restrict access" and select team`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Sensitive Data Scanner</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Datadog Sensitive Data Scanner - Pattern Library

## Built-in Scanning Groups

# 1. Financial Information
- Credit card numbers (Visa, Mastercard, Amex)
- IBANs
- SWIFT codes

# 2. Credentials & Secrets
- API keys (various formats)
- Private keys (RSA, DSA, EC)
- Database connection strings
- AWS access keys

# 3. Personal Information (PII)
- Email addresses
- Phone numbers
- Social Security Numbers
- Passport numbers

# 4. Custom Patterns (Regex)
POST https://api.datadoghq.eu/api/v2/sensitive-data-scanner/config/rules
{
  "meta": {},
  "data": {
    "attributes": {
      "name": "Internal API Keys",
      "pattern": "internal-api-[a-zA-Z0-9]{32}",
      "description": "Detect internal API keys",
      "tags": ["internal", "api"],
      "priority": 1,
      "isEnabled": true
    },
    "type": "sensitive_data_scanner_rule"
  }
}

# Terraform - Scanner Rules
resource "datadog_sensitive_data_scanner_group" "production" {
  name        = "Production Data Protection"
  description = "Scan production logs for sensitive data"
  filter {
    query = "env:production"
  }
  is_enabled = true
}

resource "datadog_sensitive_data_scanner_rule" "credit_cards" {
  name        = "Credit Card Numbers"
  description = "Detect and mask credit card numbers"
  group_id    = datadog_sensitive_data_scanner_group.production.id
  
  pattern {
    builtin_rule {
      default_action {
        hash_action {
          name = "Credit Card Hash"
        }
      }
      name = "Credit card numbers"
    }
  }
  
  included_keywords = ["card", "cc", "credit"]
  is_enabled        = true
}

resource "datadog_sensitive_data_scanner_rule" "custom_api_keys" {
  name        = "Custom API Keys"
  description = "Detect custom API key format"
  group_id    = datadog_sensitive_data_scanner_group.production.id
  
  pattern {
    text = "sk_live_[a-zA-Z0-9]{24,}"
  }
  
  text_replacement {
    type = "substitution"
    substitution = "<API_KEY_REDACTED>"
  }
  
  tags       = ["api", "stripe"]
  is_enabled = true
}

# Scanner Actions
# 1. Redact/Mask - Replace with placeholder
# 2. Partial Redact - Keep first/last N chars
# 3. Hash - One-way hash for correlation
# 4. Tag - Add tag without modification

# Exclusion Rules (reduce false positives)
{
  "data": {
    "attributes": {
      "name": "Test Data Exclusion",
      "description": "Exclude test credit cards",
      "exclusion": {
        "type": "text",
        "value": "4242-4242-4242-4242"
      }
    },
    "type": "sensitive_data_scanner_exclusion"
  }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Datadog Security Checklist</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Access & Authentication</h3>
                  {[
                    "SAML/SSO configured",
                    "Custom RBAC roles defined",
                    "API keys rotated quarterly",
                    "Service accounts documented",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Data Protection</h3>
                  {[
                    "Sensitive Data Scanner enabled",
                    "Custom PII patterns defined",
                    "Agent log scrubbing configured",
                    "APM span filtering active",
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

          <section className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Datadog Security Assessment</h2>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold">Assessment Starten</a>
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
        headline: "Datadog Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
