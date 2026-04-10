import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Database Security: Encryption & Access Control 2024',
    description: 'Datenbankabsicherung für Moltbot: AES-256-GCM Encryption at Rest, TLS in Transit, Row-Level Security, SQL-Injection Prevention und Audit Logging mit PostgreSQL.',
    keywords: ['moltbot database security','database encryption','access control','sql injection prevention','row level security','postgresql security'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Database Security: Encryption & Access Control 2024', description: 'Datenbankabsicherung für Moltbot mit AES-256-GCM und Row-Level Security.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/database-security-encryption`, images: ['/og-moltbot-db-security.jpg'] },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/database-security-encryption'),
    robots: 'index, follow',
  };
}

export default function MoltbotDatabaseSecurityPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Dieser Guide dient ausschließlich zur Absicherung von Datenbanken. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Database Security: Encryption &amp; Access Control</h1>
        <p className="text-lg text-gray-300 mb-8">Vollständige Datenbankabsicherung für Moltbot — Encryption at Rest und in Transit, Row-Level Security, SQL-Injection Prevention und Audit Logging.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔒 Encryption at Rest mit pgcrypto</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`-- PostgreSQL: Sensitive data encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypted column for sensitive Moltbot data
CREATE TABLE moltbot_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  secret_name TEXT NOT NULL,
  -- AES-256 encrypted value
  secret_value BYTEA NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert with encryption
INSERT INTO moltbot_secrets (customer_id, secret_name, secret_value)
VALUES (
  $1,
  $2,
  pgp_sym_encrypt($3, current_setting('app.encryption_key'))
);

-- Read with decryption
SELECT pgp_sym_decrypt(secret_value, current_setting('app.encryption_key'))
FROM moltbot_secrets
WHERE customer_id = $1 AND secret_name = $2;`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔐 Row-Level Security (RLS)</h2>
          <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`-- Enable RLS for tenant isolation
ALTER TABLE moltbot_data ENABLE ROW LEVEL SECURITY;

-- Policy: customers can only see their own data
CREATE POLICY moltbot_tenant_isolation ON moltbot_data
  USING (customer_id = current_setting('app.current_customer_id')::UUID);

-- Policy: admins can see all data
CREATE POLICY moltbot_admin_access ON moltbot_data
  TO admin_role
  USING (true);

-- Force RLS even for table owners
ALTER TABLE moltbot_data FORCE ROW LEVEL SECURITY;`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🛡️ SQL-Injection Prevention</h2>
          <div className="bg-gray-900 text-yellow-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`// moltbot/lib/db.ts — immer parameterisierte Queries
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },  // TLS erzwingen
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ✅ Sicher: Parameterisierte Query
export async function getCustomerData(customerId: string) {
  const result = await pool.query(
    'SELECT * FROM moltbot_data WHERE customer_id = $1',
    [customerId]  // Nie String-Interpolation!
  );
  return result.rows;
}

// ❌ NIEMALS so: SQL Injection möglich!
// pool.query(\`SELECT * FROM data WHERE id = '\${customerId}'\`)`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🛡️ Security Check</div>
              <div className="text-sm text-gray-300">Datenbankabsicherung prüfen</div>
            </a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">📚 DB Runbooks</div>
              <div className="text-sm text-gray-300">Database Security Guides</div>
            </a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🔮 Oracle</div>
              <div className="text-sm text-gray-300">Security Intelligence</div>
            </a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🏢 Enterprise</div>
              <div className="text-sm text-gray-300">GDPR/HIPAA Compliance</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
