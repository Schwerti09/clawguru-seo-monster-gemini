import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Backup & Disaster Recovery: RTO/RPO Guide 2024',
    description: 'Backup und Disaster Recovery für Moltbot. RTO/RPO-Definitionen, automatisierte Backups, Geo-Redundanz, Failover-Prozesse und DR-Tests. PostgreSQL, Redis und File-Backups.',
    keywords: ['moltbot backup recovery','disaster recovery','rto rpo','geo redundancy','failover','postgresql backup'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Backup & Disaster Recovery: RTO/RPO Guide 2024', description: 'Backup und Disaster Recovery für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/backup-recovery-disaster-recovery` },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/backup-recovery-disaster-recovery'),
    robots: 'index, follow',
  };
}

export default function MoltbotBackupRecoveryPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Dieser Guide dient der Absicherung durch zuverlässige Backup- und Recovery-Strategien. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Backup &amp; Disaster Recovery</h1>
        <p className="text-lg text-gray-300 mb-8">Resilienz gegen Ausfälle, Datenverlust und Ransomware — mit definierten RTO/RPO-Zielen, automatisierten Backups und getesteten DR-Prozessen.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📊 RTO/RPO Ziele für Moltbot</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Tier</th><th className="p-3 text-left">Service</th><th className="p-3 text-left">RTO</th><th className="p-3 text-left">RPO</th><th className="p-3 text-left">Backup Freq.</th></tr></thead>
              <tbody>
                {[
                  ['T1', 'Auth Service', '5 Min', '1 Min', 'Continuous'],
                  ['T1', 'Database (Primary)', '15 Min', '5 Min', 'WAL Streaming'],
                  ['T2', 'API Gateway', '30 Min', '15 Min', 'Stündlich'],
                  ['T2', 'Redis Cache', '30 Min', '0 (rebuild)', 'Täglich'],
                  ['T3', 'File Storage', '4 Std', '1 Std', 'Stündlich'],
                  ['T3', 'Analytics DB', '24 Std', '24 Std', 'Täglich'],
                ].map(([tier, svc, rto, rpo, freq]) => (
                  <tr key={svc} className="border-b hover:bg-gray-800">
                    <td className={`p-3 font-bold ${tier === 'T1' ? 'text-red-400' : tier === 'T2' ? 'text-yellow-400' : 'text-green-400'}`}>{tier}</td>
                    <td className="p-3">{svc}</td><td className="p-3 font-mono text-xs">{rto}</td><td className="p-3 font-mono text-xs">{rpo}</td><td className="p-3 text-xs">{freq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🗄️ Automatisiertes PostgreSQL Backup</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`#!/bin/bash
# moltbot-backup.sh — Automatisiertes PostgreSQL Backup

set -euo pipefail

BACKUP_DIR="/backups/postgres"
DB_URL="$DATABASE_URL"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/moltbot_$TIMESTAMP.sql.gz"
RETENTION_DAYS=30

# 1. Backup erstellen
echo "[INFO] Starting backup: $BACKUP_FILE"
pg_dump "$DB_URL" | gzip > "$BACKUP_FILE"

# 2. Integrität prüfen
gunzip -t "$BACKUP_FILE" || { echo "[ERROR] Backup corrupt!"; exit 1; }
echo "[INFO] Backup integrity OK ($(du -h $BACKUP_FILE | cut -f1))"

# 3. Verschlüsselt in Cloud Storage hochladen
aws s3 cp "$BACKUP_FILE" \\
  "s3://moltbot-backups/postgres/$TIMESTAMP/" \\
  --server-side-encryption aws:kms \\
  --sse-kms-key-id "$AWS_KMS_KEY_ID"

# 4. Alte Backups löschen (Retention)
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
aws s3 ls s3://moltbot-backups/postgres/ | \\
  awk '{print $4}' | \\
  head -n -$RETENTION_DAYS | \\
  xargs -I{} aws s3 rm "s3://moltbot-backups/postgres/{}"

echo "[SUCCESS] Backup completed: $BACKUP_FILE"`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">DR Status prüfen</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 DR Runbooks</div><div className="text-sm text-gray-300">Recovery Playbooks</div></a>
            <a href="/neuro" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🧠 Neuro AI</div><div className="text-sm text-gray-300">Anomalie-Erkennung</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise</div><div className="text-sm text-gray-300">Managed DR</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
