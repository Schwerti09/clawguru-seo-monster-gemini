import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw Audit Logging: Compliance & Forensics Setup 2024',
    description: 'Audit Logging für OpenClaw. Strukturiertes JSON Logging, Tamper-Proof Log Storage, Log Retention Policies, GDPR-konformes Logging und Forensics-Ready Audit Trail.',
    keywords: ['openclaw audit logging','compliance logging','audit trail','tamper proof logs','gdpr logging','forensics logging'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'OpenClaw Audit Logging Setup 2024', description: 'Compliance & Forensics Logging für OpenClaw.', type: 'article', url: `https://clawguru.org/${lang}/openclaw/audit-logging-setup` },
    alternates: buildLocalizedAlternates(lang as Locale, '/openclaw/audit-logging-setup'),
    robots: 'index, follow',
  };
}

export default function OpenClawAuditLoggingPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Audit Logging sichert Compliance und ermöglicht Forensics für eigene Systeme. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw Audit Logging Setup</h1>
        <p className="text-lg text-gray-300 mb-8">Lückenloser, manipulationssicherer Audit Trail für OpenClaw — strukturiertes JSON Logging, Compliance-konformes Retention und forensisch verwertbare Logs.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📝 Strukturiertes Audit Log Schema</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`// moltbot/lib/audit-logger.ts
import { db } from './db';

interface AuditEvent {
  event_type: 'auth.login' | 'auth.logout' | 'auth.failed' | 'data.read' | 'data.write' | 'data.delete' | 'admin.action' | 'security.alert';
  actor_id: string;
  actor_type: 'user' | 'api_key' | 'system';
  resource_type: string;
  resource_id: string;
  action: string;
  ip_address: string;
  user_agent: string;
  result: 'success' | 'failure' | 'blocked';
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  const entry = {
    ...event,
    timestamp: new Date().toISOString(),
    server_id: process.env.SERVER_ID ?? 'unknown',
    version: '1.0',
  };

  // Parallel: DB + Syslog (für externe SIEM-Integration)
  await Promise.all([
    db.query(
      'INSERT INTO audit_log (event_type, actor_id, actor_type, resource_type, resource_id, action, ip, user_agent, result, metadata, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())',
      [entry.event_type, entry.actor_id, entry.actor_type, entry.resource_type, entry.resource_id, entry.action, entry.ip_address, entry.user_agent, entry.result, JSON.stringify(entry.metadata)]
    ),
    // Structured syslog (für Splunk/Datadog/ELK)
    process.stdout.write(JSON.stringify({ level: 'audit', ...entry }) + '\\n'),
  ]);
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📋 Was MUSS geloggt werden?</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Event</th><th className="p-3 text-left">Pflicht</th><th className="p-3 text-left">Retention</th></tr></thead>
              <tbody>
                {[
                  ['Erfolgreiche Logins', 'GDPR / NIS2', '12 Monate'],
                  ['Fehlgeschlagene Logins', 'GDPR / NIS2', '12 Monate'],
                  ['Admin-Aktionen', 'GDPR Art. 5', '5 Jahre'],
                  ['Datenzugriffe (PII)', 'GDPR Art. 30', '3 Jahre'],
                  ['Datenlöschungen', 'GDPR Art. 17', '5 Jahre'],
                  ['API Key Nutzung', 'SOC2', '12 Monate'],
                  ['Security Alerts', 'NIS2', '2 Jahre'],
                  ['System Config Changes', 'ISO 27001', '3 Jahre'],
                ].map(([event, basis, retention]) => (
                  <tr key={event} className="border-b hover:bg-gray-800">
                    <td className="p-3">{event}</td>
                    <td className="p-3 text-sm text-orange-400 font-medium">{basis}</td>
                    <td className="p-3 font-mono text-xs">{retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">Audit Assessment</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 Logging Runbooks</div><div className="text-sm text-gray-300">Compliance Guides</div></a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔮 Oracle</div><div className="text-sm text-gray-300">Threat Intel</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise SIEM</div><div className="text-sm text-gray-300">Managed Logging</div></a>
          </div>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Ist dieser Guide ein Penetrationstest?", acceptedAnswer: { "@type": "Answer", text: "Nein. Dieser Guide dient ausschlielich zur Absicherung eigener Systeme. Kein Angriffs-Tool, keine illegalen Aktivitten." } },
              { "@type": "Question", name: "Was ist OpenClaw?", acceptedAnswer: { "@type": "Answer", text: "OpenClaw ist das Open-Source Self-Hosting Security Framework von ClawGuru mit Executable Runbooks, Security-Check und Compliance-Dashboard." } },
              { "@type": "Question", name: "Wo finde ich die Runbooks?", acceptedAnswer: { "@type": "Answer", text: "Alle Runbooks sind unter /runbooks abrufbar. Jeder Befund im Security-Check enthlt einen direkten Link zum passenden Runbook." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "OpenClaw Security Guide",
            description: "Self-Hosted Security Hardening mit OpenClaw Executable Runbooks.",
            url: "https://clawguru.org/de/openclaw"
          },
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Audit Logging für OpenClaw einrichten",
            description: "Compliance-konformes Audit Logging mit tamper-proof Log Storage und GDPR-konformer Retention für OpenClaw.",
            totalTime: "PT45M",
            step: [
              { "@type": "HowToStep", name: "Strukturiertes JSON Logging aktivieren", text: "Logging-Bibliothek auf JSON-Output umstellen (z.B. Winston/Pino). Felder: timestamp, level, userId, action, resource." },
              { "@type": "HowToStep", name: "Log Retention Policy definieren", text: "GDPR-konform: Zugriffslogs 90 Tage, Security-Events 1 Jahr, Audit-Trail 3 Jahre aufbewahren." },
              { "@type": "HowToStep", name: "Tamper-Proof Storage einrichten", text: "Logs in append-only Storage schreiben (S3 mit Object Lock oder Loki mit immutable chunks)." },
              { "@type": "HowToStep", name: "Alerting auf kritische Events", text: "Alerts für: failed logins > 5/min, privilege escalation, config changes, data exports." },
              { "@type": "HowToStep", name: "Compliance-Audit durchführen", text: "ClawGuru Compliance Dashboard öffnen und Logging-Checklist für NIS2/SOC2 prüfen." },
            ]
          }
        ]) }} />
      </div>
    </div>
  );
}
