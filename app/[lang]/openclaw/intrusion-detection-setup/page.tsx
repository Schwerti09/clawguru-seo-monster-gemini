import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw Intrusion Detection: OSSEC & Fail2ban Setup 2024',
    description: 'Intrusion Detection für OpenClaw mit OSSEC, Fail2ban und Suricata. Echtzeit-Alerts, Log-Analyse, Brute-Force-Erkennung und automatische IP-Blockierung.',
    keywords: ['openclaw intrusion detection','ossec ids','fail2ban setup','suricata ids','brute force protection','log analysis security'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'OpenClaw Intrusion Detection Setup 2024', description: 'IDS für OpenClaw mit OSSEC und Fail2ban.', type: 'article', url: `https://clawguru.org/${lang}/openclaw/intrusion-detection-setup` },
    alternates: buildLocalizedAlternates(lang as Locale, '/openclaw/intrusion-detection-setup'),
    robots: 'index, follow',
  };
}

export default function OpenClawIntrusionDetectionPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: IDS dient der defensiven Erkennung von Angriffen auf eigene Systeme. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw Intrusion Detection Setup</h1>
        <p className="text-lg text-gray-300 mb-8">Früherkennung von Angriffen auf OpenClaw — OSSEC für Log-Analyse, Fail2ban für automatisches IP-Blocking und Suricata für Netzwerk-IDS.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔐 Fail2ban Konfiguration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`# /etc/fail2ban/jail.local — OpenClaw Konfiguration

[DEFAULT]
bantime  = 3600    # 1 Stunde
findtime = 600     # 10 Minuten Fenster
maxretry = 5       # Max Fehlversuche
backend  = systemd

# SSH Brute Force
[sshd]
enabled = true
port    = 2222
filter  = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 86400  # 24h bei SSH

# OpenClaw API Auth Failures
[openclaw-auth]
enabled  = true
port     = http,https
filter   = openclaw-auth
logpath  = /var/log/nginx/access.log
maxretry = 10
findtime = 60
bantime  = 3600

# nginx Rapid Request (DDoS)
[nginx-limit-req]
enabled = true
port    = http,https
filter  = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
bantime = 600

# /etc/fail2ban/filter.d/openclaw-auth.conf
[Definition]
failregex = ^<HOST> .* POST /api/auth/activate HTTP.* 401
            ^<HOST> .* POST /api/auth/login HTTP.* 401`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📊 IDS Alert Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { level: 'Level 15 (Critical)', desc: 'Rootkit oder System Compromise', action: 'Sofort-Alert + Auto-Block', color: 'red' },
              { level: 'Level 12 (High)', desc: 'Privilege Escalation Versuch', action: 'Alert Security Team', color: 'orange' },
              { level: 'Level 8 (Medium)', desc: 'Wiederholte Auth-Fehler', action: 'Fail2ban Block + Log', color: 'yellow' },
              { level: 'Level 5 (Low)', desc: 'Einzelne fehlgeschlagene Logins', action: 'Log + Statistik', color: 'green' },
            ].map(({ level, desc, action, color }) => (
              <div key={level} className={`p-4 rounded-lg border ${color === 'red' ? 'bg-red-900 border-red-700' : color === 'orange' ? 'bg-orange-50 border-orange-700' : color === 'yellow' ? 'bg-amber-900 border-yellow-700' : 'bg-green-900 border-green-700'}`}>
                <div className="font-bold text-sm mb-1">{level}</div>
                <div className="text-sm text-gray-300 mb-2">{desc}</div>
                <div className="text-xs text-gray-400 font-mono">{action}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">IDS Assessment</div></a>
            <a href="/neuro" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🧠 Neuro AI</div><div className="text-sm text-gray-300">AI Threat Detection</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 IDS Runbooks</div><div className="text-sm text-gray-300">Detection Guides</div></a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔮 Oracle</div><div className="text-sm text-gray-300">Threat Intelligence</div></a>
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
          }
        ]) }} />
      </div>
    </div>
  );
}
