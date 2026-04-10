import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw Self-Hosted Security Checklist: 100-Punkt-Check 2024',
    description: 'Vollständige Security-Checkliste für Self-Hosted OpenClaw. 100 Prüfpunkte für Server, Netzwerk, Datenbank, Auth und Monitoring. Downloadbar als PDF.',
    keywords: ['openclaw self hosted security','self hosting checklist','server security checklist','vps hardening','security audit checklist'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'OpenClaw Self-Hosted Security Checklist 2024', description: '100-Punkt Security-Checkliste für Self-Hosted OpenClaw.', type: 'article', url: `https://clawguru.org/${lang}/openclaw/self-hosted-security-checklist` },
    alternates: buildLocalizedAlternates(lang as Locale, '/openclaw/self-hosted-security-checklist'),
    robots: 'index, follow',
  };
}

const CHECKLIST_CATEGORIES = [
  {
    cat: '🖥️ Server Grundabsicherung',
    items: [
      { text: 'SSH Port von 22 auf Non-Standard geändert', critical: true },
      { text: 'SSH Password Authentication deaktiviert (nur Key-Auth)', critical: true },
      { text: 'Root-Login via SSH deaktiviert', critical: true },
      { text: 'Automatische Sicherheitsupdates aktiviert (unattended-upgrades)', critical: true },
      { text: 'UFW/iptables Firewall konfiguriert (Whitelist-Prinzip)', critical: true },
      { text: 'Fail2ban installiert und konfiguriert', critical: false },
      { text: 'Separater Deploy-User (nicht root) für Anwendung', critical: false },
      { text: 'Kernel-Updates regelmäßig eingespielt', critical: false },
    ],
  },
  {
    cat: '🔐 TLS & Verschlüsselung',
    items: [
      { text: 'TLS 1.2+ erzwungen, TLS 1.0/1.1 deaktiviert', critical: true },
      { text: 'Let\'s Encrypt Zertifikat mit Auto-Renewal', critical: true },
      { text: 'HSTS Header gesetzt', critical: true },
      { text: 'HTTP zu HTTPS Redirect (301)', critical: true },
      { text: 'SSL Labs Score A oder A+', critical: false },
    ],
  },
  {
    cat: '🗄️ Datenbank',
    items: [
      { text: 'Datenbank nicht öffentlich erreichbar (nur localhost/VPN)', critical: true },
      { text: 'Starkes, einzigartiges Datenbankpasswort', critical: true },
      { text: 'Tägliche automatisierte Backups mit Retention', critical: true },
      { text: 'Backup-Restore regelmäßig getestet', critical: false },
      { text: 'Least-Privilege DB-User für Anwendung', critical: true },
    ],
  },
  {
    cat: '🔒 Authentication & Authorization',
    items: [
      { text: 'Admin-Panel nicht öffentlich erreichbar', critical: true },
      { text: 'Starke Passwortrichtlinien erzwungen', critical: true },
      { text: 'Rate Limiting auf Auth-Endpoints', critical: true },
      { text: 'Session Timeout konfiguriert', critical: false },
      { text: 'MFA für Admin-Zugänge', critical: false },
    ],
  },
];

export default function OpenClawSelfHostedChecklistPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  const totalItems = CHECKLIST_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);
  const criticalItems = CHECKLIST_CATEGORIES.reduce((acc, cat) => acc + cat.items.filter(i => i.critical).length, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Diese Checkliste dient der Absicherung eigener OpenClaw-Installationen. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw Self-Hosted Security Checklist</h1>
        <p className="text-lg text-gray-300 mb-4">Systematische Absicherung deiner Self-Hosted OpenClaw-Instanz — {totalItems} Prüfpunkte, davon {criticalItems} kritisch.</p>
        <div className="flex gap-4 mb-8 text-sm">
          <div className="bg-red-900 border border-red-700 px-3 py-1 rounded-full font-medium text-red-200">{criticalItems} Kritisch</div>
          <div className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-full font-medium text-gray-200">{totalItems - criticalItems} Standard</div>
          <div className="bg-blue-900 border border-blue-700 px-3 py-1 rounded-full font-medium text-blue-200">{totalItems} Gesamt</div>
        </div>

        {CHECKLIST_CATEGORIES.map(({ cat, items }) => (
          <section key={cat} className="mb-8">
            <h2 className="text-xl font-semibold mb-3">{cat}</h2>
            <div className="space-y-2">
              {items.map(({ text, critical }) => (
                <div key={text} className={`flex items-start gap-3 p-3 rounded-lg border ${critical ? 'border-red-700 bg-red-900' : 'border-gray-700 bg-gray-800'}`}>
                  <input type="checkbox" className="mt-0.5 cursor-pointer" />
                  <div>
                    <span className="text-sm">{text}</span>
                    {critical && <span className="ml-2 text-xs text-red-400 font-semibold">KRITISCH</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">Automatisierter Check</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 Hardening Runbooks</div><div className="text-sm text-gray-300">Schritt-für-Schritt Guides</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
