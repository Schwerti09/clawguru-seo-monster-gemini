import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw Firewall Konfiguration: UFW & iptables Guide 2024',
    description: 'Firewall-Konfiguration für OpenClaw mit UFW und iptables. Whitelist-Regeln, Port-Blocking, Geo-Blocking, Fail2ban-Integration und automatisierte Firewall-Audits.',
    keywords: ['openclaw firewall','ufw konfiguration','iptables rules','geo blocking','fail2ban firewall','port security'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'OpenClaw Firewall Konfiguration: UFW & iptables 2024', description: 'Firewall-Konfiguration für OpenClaw.', type: 'article', url: `https://clawguru.org/${lang}/openclaw/firewall-configuration-guide` },
    alternates: buildLocalizedAlternates(lang as Locale, '/openclaw/firewall-configuration-guide'),
    robots: 'index, follow',
  };
}

export default function OpenClawFirewallPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Firewall-Konfiguration schützt eigene Server. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw Firewall Konfiguration</h1>
        <p className="text-lg text-gray-300 mb-8">Minimale Angriffsfläche durch striktes Whitelist-Prinzip — nur explizit erlaubte Verbindungen werden durchgelassen.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔥 UFW Basis-Konfiguration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`# UFW Firewall für OpenClaw Server

# 1. Alles blockieren (Default Deny)
ufw default deny incoming
ufw default allow outgoing

# 2. SSH (Non-Standard Port)
ufw allow 2222/tcp comment "SSH"

# 3. HTTP/HTTPS (nur über nginx Proxy)
ufw allow 80/tcp comment "HTTP (redirect to HTTPS)"
ufw allow 443/tcp comment "HTTPS"

# 4. Datenbank nur von intern
# PostgreSQL NICHT öffentlich freigeben!
# ufw deny 5432/tcp  # Standard: bereits geblockt

# 5. Monitoring (nur von Management-IP)
ufw allow from 10.0.1.0/24 to any port 9090 comment "Prometheus"
ufw allow from 10.0.1.0/24 to any port 3001 comment "Grafana"

# 6. UFW aktivieren
ufw --force enable
ufw status verbose

# Regel-Check: Was ist offen?
ufw status numbered`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📊 Port-Status Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Port</th><th className="p-3 text-left">Service</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Zugriff</th></tr></thead>
              <tbody>
                {[
                  ['22', 'SSH (Standard)', '🔴 Deaktiviert', 'Umleitung auf 2222'],
                  ['2222', 'SSH (Custom)', '🟢 Erlaubt', 'Nur Key-Auth'],
                  ['80', 'HTTP', '🟢 Erlaubt', 'Redirect → 443'],
                  ['443', 'HTTPS', '🟢 Erlaubt', 'Öffentlich'],
                  ['3000', 'Node.js App', '🔴 Geblockt', 'Nur über nginx'],
                  ['5432', 'PostgreSQL', '🔴 Geblockt', 'Nur localhost'],
                  ['6379', 'Redis', '🔴 Geblockt', 'Nur localhost'],
                  ['9090', 'Prometheus', '🟡 Intern', 'VPN/Management'],
                  ['3001', 'Grafana', '🟡 Intern', 'VPN/Management'],
                ].map(([port, service, status, access]) => (
                  <tr key={port} className="border-b hover:bg-gray-800">
                    <td className="p-3 font-mono text-sm">{port}</td>
                    <td className="p-3">{service}</td>
                    <td className="p-3">{status}</td>
                    <td className="p-3 text-sm text-gray-300">{access}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">Port Scan</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 Firewall Runbooks</div><div className="text-sm text-gray-300">UFW Guides</div></a>
            <a href="/openclaw" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔓 OpenClaw</div><div className="text-sm text-gray-300">Framework</div></a>
            <a href="/neuro" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🧠 Neuro AI</div><div className="text-sm text-gray-300">Anomalie-Erkennung</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
