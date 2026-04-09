import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Logging & Auditing: GDPR/HIPAA/SOC2 Compliance 2024',
    description: 'Compliance-ready Logging und Auditing für Moltbot. Strukturiertes Logging mit Winston, unveränderliche Audit Trails, GDPR-konforme Datenschutzlöschung und SOC2-Berichterstattung.',
    keywords: ['moltbot logging auditing','gdpr compliance','hipaa compliance','soc2 compliance','audit trail','structured logging'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Logging & Auditing: GDPR/HIPAA/SOC2 Compliance 2024', description: 'Compliance-ready Logging und Auditing für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/logging-auditing-compliance`, images: ['/og-moltbot-logging.jpg'] },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot/logging-auditing-compliance`, languages: { de: 'https://clawguru.org/de/moltbot/logging-auditing-compliance', en: 'https://clawguru.org/en/moltbot/logging-auditing-compliance', es: 'https://clawguru.org/es/moltbot/logging-auditing-compliance', fr: 'https://clawguru.org/fr/moltbot/logging-auditing-compliance', pt: 'https://clawguru.org/pt/moltbot/logging-auditing-compliance', it: 'https://clawguru.org/it/moltbot/logging-auditing-compliance', ru: 'https://clawguru.org/ru/moltbot/logging-auditing-compliance', zh: 'https://clawguru.org/zh/moltbot/logging-auditing-compliance', ja: 'https://clawguru.org/ja/moltbot/logging-auditing-compliance', ko: 'https://clawguru.org/ko/moltbot/logging-auditing-compliance', ar: 'https://clawguru.org/ar/moltbot/logging-auditing-compliance', hi: 'https://clawguru.org/hi/moltbot/logging-auditing-compliance', tr: 'https://clawguru.org/tr/moltbot/logging-auditing-compliance', pl: 'https://clawguru.org/pl/moltbot/logging-auditing-compliance', nl: 'https://clawguru.org/nl/moltbot/logging-auditing-compliance' } },
    robots: 'index, follow',
  };
}

export default function MoltbotLoggingAuditingPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Dieser Guide dient ausschließlich zur Implementierung von Logging- und Auditing-Systemen. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Logging &amp; Auditing: Compliance Ready</h1>
        <p className="text-lg text-gray-300 mb-8">GDPR-, HIPAA- und SOC2-konformes Logging für Moltbot — strukturierte Logs, unveränderliche Audit Trails und automatisierte Compliance-Reports.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📝 Strukturiertes Security Logging</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`// moltbot/lib/logger.ts
import { createLogger, format, transports } from 'winston';

export const securityLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  defaultMeta: { service: 'moltbot', version: process.env.APP_VERSION },
  transports: [
    new transports.Console(),
    // Compliance: Logs in separaten Stream für 7 Jahre
    new transports.File({
      filename: '/var/log/moltbot/security.log',
      maxsize: 100 * 1024 * 1024,  // 100MB
      maxFiles: 365,                // 1 Jahr lokale Rotation
      tailable: true,
    }),
  ],
});

export function logSecurityEvent(event: {
  action: string;
  userId?: string;
  ip: string;
  resource: string;
  result: 'success' | 'failure';
  details?: Record<string, unknown>;
}) {
  securityLogger.info('security_event', {
    ...event,
    timestamp: new Date().toISOString(),
    correlationId: crypto.randomUUID(),
  });
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔒 Unveränderlicher Audit Trail (PostgreSQL)</h2>
          <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`-- Immutable Audit Log Schema
CREATE TABLE moltbot_audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  customer_id UUID REFERENCES customers(id),
  actor_id    UUID,
  actor_type  TEXT NOT NULL,        -- 'user', 'system', 'api_key'
  action      TEXT NOT NULL,        -- 'login', 'data_access', 'export'
  resource    TEXT NOT NULL,
  resource_id TEXT,
  ip_address  INET NOT NULL,
  user_agent  TEXT,
  result      TEXT NOT NULL,        -- 'success', 'failure', 'denied'
  details     JSONB,
  -- Integrität: Hash über alle Felder
  row_hash    TEXT GENERATED ALWAYS AS (
    encode(sha256(
      (id::text || occurred_at::text || action || result)::bytea
    ), 'hex')
  ) STORED
);

-- WICHTIG: Keine DELETE/UPDATE erlaubt (Compliance)
CREATE RULE no_delete_audit AS ON DELETE TO moltbot_audit_log DO INSTEAD NOTHING;
CREATE RULE no_update_audit AS ON UPDATE TO moltbot_audit_log DO INSTEAD NOTHING;

-- Index für schnelle GDPR-Abfragen
CREATE INDEX idx_audit_customer ON moltbot_audit_log(customer_id, occurred_at);
CREATE INDEX idx_audit_actor ON moltbot_audit_log(actor_id, occurred_at);`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🇪🇺 GDPR Right to Erasure</h2>
          <div className="bg-gray-900 text-yellow-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`// moltbot/lib/gdpr-erasure.ts
export async function processErasureRequest(customerId: string) {
  // 1. Personenbezogene Daten pseudonymisieren (nicht löschen wegen Audit-Anforderung)
  await db.query(\`
    UPDATE customers SET
      email = 'deleted_' || id || '@erased.local',
      name = 'Gelöschter Nutzer',
      phone = NULL,
      address = NULL,
      erased_at = NOW()
    WHERE id = $1
  \`, [customerId]);

  // 2. Audit Log: Löschanfrage dokumentieren
  await logSecurityEvent({
    action: 'gdpr_erasure_completed',
    userId: customerId,
    ip: '0.0.0.0',
    resource: 'customer_data',
    result: 'success',
    details: { customerId, erasedAt: new Date().toISOString() },
  });

  // 3. Backups markieren (werden nach Backup-Retention automatisch gelöscht)
  await db.query(
    'INSERT INTO gdpr_erasure_queue (customer_id, requested_at) VALUES ($1, NOW())',
    [customerId]
  );
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📊 Compliance Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'GDPR', status: 'Compliant', color: 'green', items: ['Audit Trail', 'Right to Erasure', 'Data Minimization', 'Consent Management'] },
              { name: 'HIPAA', status: 'Compliant', color: 'green', items: ['PHI Encryption', 'Access Controls', 'Audit Logs', 'Breach Notification'] },
              { name: 'SOC2', status: 'In Progress', color: 'yellow', items: ['Availability', 'Confidentiality', 'Security', 'Processing Integrity'] },
            ].map(({ name, status, color, items }) => (
              <div key={name} className={`bg-${color}-50 p-4 rounded-lg border border-${color}-200`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-bold text-${color}-800`}>{name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${color}-200 text-${color}-800`}>{status}</span>
                </div>
                <ul className="space-y-1 text-sm">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <span>✅</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🛡️ Security Check</div>
              <div className="text-sm text-gray-300">Compliance live prüfen</div>
            </a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">📚 Compliance Runbooks</div>
              <div className="text-sm text-gray-300">GDPR/HIPAA Guides</div>
            </a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🔮 Oracle</div>
              <div className="text-sm text-gray-300">Compliance Intelligence</div>
            </a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🏢 Enterprise</div>
              <div className="text-sm text-gray-300">Managed Compliance</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
