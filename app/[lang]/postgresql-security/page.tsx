import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";

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
      ? "PostgreSQL Security 2026 | Database Hardening Guide"
      : "PostgreSQL Security 2026 | Database Hardening Guide",
    description: locale === "de"
      ? "PostgreSQL Security: SSL/TLS, Row-Level Security, Audit Logging, pgcrypto, pgAudit & Compliance. Enterprise Database Security."
      : "PostgreSQL security: SSL/TLS, row-level security, audit logging, pgcrypto, pgAudit & compliance. Enterprise database security.",
    keywords: [
      "PostgreSQL security",
      "PostgreSQL hardening",
      "PostgreSQL SSL",
      "PostgreSQL RLS",
      "PostgreSQL audit",
      "PostgreSQL pgcrypto",
      "PostgreSQL encryption",
      "PostgreSQL compliance",
      "Database security",
      "Postgres hardening",
    ],
    alternates: {
      canonical: `/${locale}/postgresql-security`,
      ...localeAlternates(`/${locale}/postgresql-security`),
    },
    openGraph: {
      title: "PostgreSQL Security 2026: Database Hardening",
      description: "Secure PostgreSQL with SSL, RLS, audit logging & encryption.",
      type: "article",
      url: `${BASE_URL}/${locale}/postgresql-security`,
    },
  };
}

export default async function PostgreSQLSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">PostgreSQL Security</h1>
            <p className="text-2xl text-blue-200 mb-4">Database Hardening 2026</p>
            <p className="text-xl text-white/80 mb-8">SSL/TLS, Row-Level Security, Audit Logging, pgcrypto & Compliance</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SSL</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">RLS</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">pgcrypto</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">pgAudit</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">PostgreSQL SSL/TLS</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# postgresql.conf
ssl = on
ssl_cert_file = '/etc/ssl/certs/server.crt'
ssl_key_file = '/etc/ssl/private/server.key'
ssl_ca_file = '/etc/ssl/certs/ca.crt'
ssl_crl_file = ''
ssl_ciphers = 'HIGH:!aNULL:!MD5'
ssl_prefer_server_ciphers = on
ssl_ecdh_curve = 'prime256v1'
ssl_min_protocol_version = 'TLSv1.3'

# pg_hba.conf - Require SSL
hostssl all all 0.0.0.0/0 scram-sha-256
hostssl all all ::/0 scram-sha-256`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Row-Level Security (RLS)</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`-- Enable RLS
ALTER TABLE patient_data ENABLE ROW LEVEL SECURITY;

-- Policy: Users see only their data
CREATE POLICY patient_data_isolation ON patient_data
    FOR ALL
    TO app_users
    USING (user_id = current_setting('app.current_user_id')::int);

-- Bypass for admins
CREATE POLICY admin_all ON patient_data
    FOR ALL
    TO admins
    USING (true);

-- Set user context
SET app.current_user_id = '123';`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Audit Logging (pgAudit)</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# postgresql.conf
shared_preload_libraries = 'pgaudit'
pgaudit.log = 'write, ddl, role'
pgaudit.log_catalog = off
pgaudit.log_parameter = on
pgaudit.log_statement_once = off
pgaudit.log_level = log

-- HIPAA/SOC2: Log all access to PHI
CREATE TABLE audit.phi_access (
    id serial PRIMARY KEY,
    user_name text,
    query text,
    parameters text,
    accessed_at timestamp DEFAULT now()
);

-- Trigger for sensitive tables
CREATE OR REPLACE FUNCTION audit_phi_access()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit.phi_access (user_name, query)
    VALUES (current_user, TG_OP || ' on ' || TG_TABLE_NAME);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">PostgreSQL Security Assessment</h2>
            <a href="/check" className="inline-block px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "PostgreSQL Security 2026",
        author: { "@type": "Organization", name: "ClawGuru" },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
