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
      ? "Elasticsearch Security 2026 | Search & Analytics Security"
      : "Elasticsearch Security 2026 | Search & Analytics Security",
    description: locale === "de"
      ? "Elasticsearch Security: X-Pack, TLS, RBAC, Index-Level Security, Audit Logging & Field-Level Security."
      : "Elasticsearch security: X-Pack, TLS, RBAC, index-level security, audit logging & field-level security.",
    keywords: [
      "Elasticsearch security",
      "Elasticsearch hardening",
      "Elasticsearch X-Pack",
      "Elasticsearch TLS",
      "Elasticsearch RBAC",
      "ELK security",
      "Kibana security",
      "Elastic SIEM",
      "Elasticsearch encryption",
      "Field level security",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/elasticsearch-security`),
    },
    openGraph: {
      title: "Elasticsearch Security 2026: Search Security",
      description: "Secure Elasticsearch with X-Pack, TLS, RBAC & field-level security.",
      type: "article",
      url: `${BASE_URL}/${locale}/elasticsearch-security`,
    },
  };
}

export default async function ElasticsearchSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);
  return (
    <main className="min-h-screen bg-gray-800">
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-500 via-yellow-600 to-orange-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Elasticsearch Security</h1>
            <p className="text-2xl text-yellow-100 mb-4">Search & Analytics Security 2026</p>
            <p className="text-xl text-white/80 mb-8">X-Pack, TLS, RBAC, Index-Level & Field-Level Security</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">X-Pack</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">TLS</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">RBAC</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">FLS</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Elasticsearch TLS Setup</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# elasticsearch.yml - Security Settings
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.key: /etc/elasticsearch/certs/transport.key
xpack.security.transport.ssl.certificate: /etc/elasticsearch/certs/transport.crt
xpack.security.transport.ssl.certificate_authorities: /etc/elasticsearch/certs/ca.crt

# HTTP Layer TLS
xpack.security.http.ssl.enabled: true
xpack.security.http.ssl.key: /etc/elasticsearch/certs/http.key
xpack.security.http.ssl.certificate: /etc/elasticsearch/certs/http.crt
xpack.security.http.ssl.certificate_authorities: /etc/elasticsearch/certs/ca.crt

# Built-in users setup
bin/elasticsearch-setup-passwords auto`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Role-Based Access Control</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# Create roles via API
POST /_security/role/app_readonly
{
  "cluster": ["monitor"],
  "indices": [
    {
      "names": [ "logs-*" ],
      "privileges": [ "read", "view_index_metadata" ],
      "field_security": {
        "grant": [ "*" ],
        "except": [ "internal_*" ]
      }
    }
  ]
}

# HIPAA: Field-level security for PHI
POST /_security/role/nurse_role
{
  "indices": [
    {
      "names": [ "patient-*" ],
      "privileges": [ "read" ],
      "field_security": {
        "grant": [ "name", "room", "vitals", "medication" ],
        "except": [ "ssn", "billing", "insurance" ]
      },
      "query": {
        "term": { "assigned_unit": "\${user.metadata.assigned_unit}" }
      }
    }
  ]
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Audit Logging</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# elasticsearch.yml - Audit Settings
xpack.security.audit.enabled: true
xpack.security.audit.logfile.events.include:
  - authentication_success
  - authentication_failed
  - realm_authentication_failed
  - access_denied
  - connection_granted
  - connection_denied

# Exclude system health checks
xpack.security.audit.logfile.events.exclude:
  - anonymous_access_denied

# Log all indices
xpack.security.audit.logfile.events.emit_request_body: true`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Elasticsearch Security Assessment</h2>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-gray-800 text-yellow-400 rounded-lg font-semibold">Assessment Starten</a>
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
        headline: "Elasticsearch Security 2026",
        author: { "@type": "Organization", name: "ClawGuru" },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
