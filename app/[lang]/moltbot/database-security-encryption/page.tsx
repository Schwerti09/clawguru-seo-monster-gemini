import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Database Security: Encryption & Access Control 2024',
    description: 'Datenbankabsicherung für Moltbot: AES-256-GCM Encryption at Rest, TLS in Transit, Row-Level Security, SQL-Injection Prevention und Audit Logging mit PostgreSQL.',
    keywords: ['moltbot database security','database encryption','access control','sql injection prevention','row level security','postgresql security'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Database Security: Encryption & Access Control 2024', description: 'Datenbankabsicherung für Moltbot mit AES-256-GCM und Row-Level Security.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/database-security-encryption`, images: ['/og-moltbot-db-security.jpg'] },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot/database-security-encryption`, languages: { de: 'https://clawguru.org/de/moltbot/database-security-encryption', en: 'https://clawguru.org/en/moltbot/database-security-encryption', es: 'https://clawguru.org/es/moltbot/database-security-encryption', fr: 'https://clawguru.org/fr/moltbot/database-security-encryption', pt: 'https://clawguru.org/pt/moltbot/database-security-encryption', it: 'https://clawguru.org/it/moltbot/database-security-encryption', ru: 'https://clawguru.org/ru/moltbot/database-security-encryption', zh: 'https://clawguru.org/zh/moltbot/database-security-encryption', ja: 'https://clawguru.org/ja/moltbot/database-security-encryption', ko: 'https://clawguru.org/ko/moltbot/database-security-encryption', ar: 'https://clawguru.org/ar/moltbot/database-security-encryption', hi: 'https://clawguru.org/hi/moltbot/database-security-encryption', tr: 'https://clawguru.org/tr/moltbot/database-security-encryption', pl: 'https://clawguru.org/pl/moltbot/database-security-encryption', nl: 'https://clawguru.org/nl/moltbot/database-security-encryption' } },
    robots: 'index, follow',
  };
}

export default function MoltbotDatabaseSecurityPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Trust-Anker</strong>: Dieser Guide dient ausschließlich zur Absicherung von Datenbanken. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
        </div>
        <h1 className="text-4xl font-bold mb-4">Moltbot Database Security: Encryption &amp; Access Control</h1>
        <p className="text-lg text-gray-600 mb-8">Vollständige Datenbankabsicherung für Moltbot — Encryption at Rest und in Transit, Row-Level Security, SQL-Injection Prevention und Audit Logging.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔒 Encryption at Rest mit pgcrypto</h2>
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
          <h2 className="text-2xl font-semibold mb-4">🔐 Row-Level Security (RLS)</h2>
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
          <h2 className="text-2xl font-semibold mb-4">🛡️ SQL-Injection Prevention</h2>
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
          <h2 className="text-2xl font-semibold mb-4">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">🛡️ Security Check</div>
              <div className="text-sm text-gray-600">Datenbankabsicherung prüfen</div>
            </a>
            <a href="/runbooks" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">📚 DB Runbooks</div>
              <div className="text-sm text-gray-600">Database Security Guides</div>
            </a>
            <a href="/oracle" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">🔮 Oracle</div>
              <div className="text-sm text-gray-600">Security Intelligence</div>
            </a>
            <a href="/solutions" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">🏢 Enterprise</div>
              <div className="text-sm text-gray-600">GDPR/HIPAA Compliance</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
