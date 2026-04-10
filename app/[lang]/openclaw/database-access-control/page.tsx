import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw Database Access Control: PostgreSQL Security 2024',
    description: 'Datenbank-Sicherheit für OpenClaw mit PostgreSQL. Row-Level Security, Role-Based Access Control, Audit Logging, Encryption at Rest und Connection Pooling.',
    keywords: ['openclaw database security','postgresql access control','row level security','rbac database','pgaudit','database encryption'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'OpenClaw Database Access Control 2024', description: 'PostgreSQL Security für OpenClaw.', type: 'article', url: `https://clawguru.org/${lang}/openclaw/database-access-control` },
    alternates: buildLocalizedAlternates(lang as Locale, '/openclaw/database-access-control'),
    robots: 'index, follow',
  };
}

export default function OpenClawDatabaseAccessPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Datenbank-Zugriffskontrolle schützt eigene Daten. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw Database Access Control</h1>
        <p className="text-lg text-gray-300 mb-8">Minimale Datenbankprivilegien für OpenClaw — RBAC, Row-Level Security, Audit Logging und verschlüsselte Verbindungen.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🗄️ PostgreSQL RBAC Setup</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`-- PostgreSQL Rollen & Rechte für OpenClaw

-- 1. Anwendungs-User (minimale Rechte)
CREATE ROLE openclaw_app WITH LOGIN PASSWORD 'STRONG_RANDOM_PASSWORD';
GRANT CONNECT ON DATABASE openclaw_prod TO openclaw_app;
GRANT USAGE ON SCHEMA public TO openclaw_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO openclaw_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO openclaw_app;

-- 2. Read-Only User (für Analytics/Reports)
CREATE ROLE openclaw_readonly WITH LOGIN PASSWORD 'ANOTHER_STRONG_PASSWORD';
GRANT CONNECT ON DATABASE openclaw_prod TO openclaw_readonly;
GRANT USAGE ON SCHEMA public TO openclaw_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO openclaw_readonly;

-- 3. Migration User (nur während Deployments)
CREATE ROLE openclaw_migrate WITH LOGIN PASSWORD 'MIGRATION_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE openclaw_prod TO openclaw_migrate;

-- 4. Row-Level Security (RLS) für Multi-Tenant
ALTER TABLE threats ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON threats
  USING (customer_id = current_setting('app.customer_id')::uuid);

-- 5. Sensitive Spalten verschlüsseln (pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Passwörter: immer bcrypt, nie plaintext
-- UPDATE users SET password_hash = crypt('password', gen_salt('bf', 12));`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📊 Datenbank Security Metriken</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { metric: 'Offene DB-Verbindungen', target: '< 100', desc: 'Connection Pool Limit' },
              { metric: 'Failed Auth Attempts', target: '0 / Stunde', desc: 'Sofort-Alert bei > 0' },
              { metric: 'Slow Queries (>1s)', target: '< 5 / Tag', desc: 'Index Optimierung' },
              { metric: 'Lock Waits', target: '< 10ms avg', desc: 'Query Optimierung' },
              { metric: 'DB Size Growth', target: '< 5% / Woche', desc: 'Retention Policy' },
              { metric: 'Backup Age', target: '< 24h', desc: 'Täglich automatisch' },
            ].map(({ metric, target, desc }) => (
              <div key={metric} className="bg-gray-800 p-4 rounded-lg border border-gray-700 border">
                <div className="font-semibold text-sm mb-1">{metric}</div>
                <div className="text-lg font-bold text-cyan-400">{target}</div>
                <div className="text-xs text-gray-400">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">DB Assessment</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 DB Runbooks</div><div className="text-sm text-gray-300">PostgreSQL Guides</div></a>
            <a href="/openclaw" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔓 OpenClaw</div><div className="text-sm text-gray-300">Framework</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise</div><div className="text-sm text-gray-300">Managed DB</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
