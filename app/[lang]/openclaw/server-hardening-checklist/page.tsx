import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'
import DirectAnswerBox from '@/components/DirectAnswerBox'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw Linux Server Hardening: Ubuntu & Debian Guide 2024',
    description: 'Linux Server Hardening für OpenClaw auf Ubuntu und Debian. SSH-Absicherung, Kernel-Parameter, AppArmor, Auditd und CIS Benchmark Compliance. Automated Hardening Script.',
    keywords: ['openclaw server hardening','linux hardening ubuntu','debian security','ssh hardening','apparmor setup','cis benchmark linux'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'OpenClaw Linux Server Hardening 2024', description: 'Linux Server Hardening für OpenClaw.', type: 'article', url: `https://clawguru.org/${lang}/openclaw/server-hardening-checklist` },
    alternates: buildLocalizedAlternates(lang as Locale, '/openclaw/server-hardening-checklist'),
    robots: 'index, follow',
  };
}

const HARDENING_STEPS = [
  { phase: '1. SSH Hardening', steps: ['Port auf 2222 ändern', 'PasswordAuthentication no', 'PermitRootLogin no', 'AllowUsers deploy', 'MaxAuthTries 3', 'ClientAliveInterval 300'] },
  { phase: '2. Automatische Updates', steps: ['unattended-upgrades installieren', 'Sicherheitsupdates täglich', 'Auto-Reboot bei Kernel-Updates (Wartungsfenster)', 'Notifications konfigurieren'] },
  { phase: '3. Kernel Hardening', steps: ['net.ipv4.tcp_syncookies = 1', 'net.ipv4.ip_forward = 0', 'net.ipv6.conf.all.disable_ipv6 = 1 (falls nicht genutzt)', 'kernel.randomize_va_space = 2'] },
  { phase: '4. Audit & Logging', steps: ['auditd installieren', 'Kritische Dateien überwachen (/etc/passwd, /etc/sudoers)', 'Sudo-Befehle loggen', 'Logs remote an Syslog senden'] },
];

export default function OpenClawServerHardeningPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Server Hardening sichert eigene Systeme ab. Keine Angriffswerkzeuge.
        </div>
        <DirectAnswerBox
          question="Was ist Linux Server Hardening für OpenClaw?"
          answer="Linux Server Hardening umfasst SSH-Absicherung, Kernel-Parameter, AppArmor, Auditd und CIS Benchmark Compliance. Es schützt den Linux-Host für OpenClaw durch systematische Härtung aller Systemkomponenten."
          fact="SSH ist der häufigste Angriffsvektor für Linux-Server – 60% aller Brute-Force-Angriffe."
        />
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw Linux Server Hardening</h1>
        <p className="text-lg text-gray-300 mb-8">Systematische Absicherung des Linux-Hosts für OpenClaw — von SSH-Hardening über Kernel-Parameter bis hin zu AppArmor und CIS Benchmark Compliance.</p>

        {HARDENING_STEPS.map(({ phase, steps }) => (
          <section key={phase} className="mb-8">
            <h2 className="text-xl font-semibold mb-3">{phase}</h2>
            <div className="space-y-2">
              {steps.map(step => (
                <div key={step} className="flex items-start gap-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <input type="checkbox" className="mt-0.5 cursor-pointer" />
                  <span className="text-sm font-mono">{step}</span>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">⚡ Quick Hardening Script</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`#!/bin/bash
# openclaw-harden.sh — Quick Server Hardening

# SSH Config
sed -i 's/^#*Port .*/Port 2222/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#*PermitRootLogin .*/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart sshd

# Unattended Upgrades
apt-get install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# Kernel Hardening via sysctl
cat >> /etc/sysctl.d/99-hardening.conf << 'EOF'
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
kernel.randomize_va_space = 2
EOF
sysctl -p /etc/sysctl.d/99-hardening.conf

echo "[DONE] Basic hardening applied. Reboot recommended."`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">Server Assessment</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 Hardening Runbooks</div><div className="text-sm text-gray-300">CIS Guides</div></a>
            <a href="/openclaw" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔓 OpenClaw</div><div className="text-sm text-gray-300">Framework</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise</div><div className="text-sm text-gray-300">Managed Hardening</div></a>
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
            name: "Linux Server für OpenClaw absichern",
            description: "Schritt-für-Schritt Server Hardening für Ubuntu/Debian Server auf denen OpenClaw läuft.",
            totalTime: "PT60M",
            step: [
              { "@type": "HowToStep", name: "SSH Hardening", text: "Port ändern, PasswordAuthentication deaktivieren, PermitRootLogin auf no setzen, MaxAuthTries auf 3 begrenzen." },
              { "@type": "HowToStep", name: "Automatische Updates einrichten", text: "unattended-upgrades installieren, tägliche Sicherheitsupdates konfigurieren." },
              { "@type": "HowToStep", name: "Kernel Hardening", text: "sysctl-Parameter setzen: tcp_syncookies=1, ip_forward=0, randomize_va_space=2." },
              { "@type": "HowToStep", name: "Audit-Logging aktivieren", text: "auditd installieren, kritische Dateien (/etc/passwd, /etc/sudoers) überwachen." },
              { "@type": "HowToStep", name: "Security Check ausführen", text: "ClawGuru Security Check aufrufen um Konfiguration zu validieren und Score zu überprüfen." },
            ]
          }
        ]) }} />
      </div>
    </div>
  );
}
