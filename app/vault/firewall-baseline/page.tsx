import Container from "@/components/shared/Container"

export default function FirewallBaselineVault() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Was ist eine Firewall Deny-by-Default Baseline?', acceptedAnswer: { '@type': 'Answer', text: 'Deny-by-Default bedeutet: alle Verbindungen sind blockiert, außer explizit erlaubte. Grundregel: öffentlich nur HTTPS (Port 443, 80-Redirect). Admin-Ports (SSH 22, DB-Ports) nur über VPN oder Private Subnet. Keine 0.0.0.0/0 Regeln außer für HTTP/HTTPS. Fail2ban oder WAF gegen Brute-Force.' } },
      { '@type': 'Question', name: 'Welche Ports sollten für Self-Hosted Services offen sein?', acceptedAnswer: { '@type': 'Answer', text: 'Öffentlich erlaubt: Port 80 (HTTP, Redirect auf 443), Port 443 (HTTPS). Alles andere über VPN: Port 22 (SSH), Port 5432 (PostgreSQL), Port 6379 (Redis), Port 9090 (Prometheus), Port 3000 (Grafana). Faustregel: Wenn ein Dienst kein öffentliches Interface braucht, soll er auch keins haben.' } },
      { '@type': 'Question', name: 'Was ist Allowlisting und warum ist es besser als Blocklisting?', acceptedAnswer: { '@type': 'Answer', text: 'Allowlisting (Whitelist) erlaubt nur bekannte, explizit freigegebene IPs/Ranges. Blocklisting (Blacklist) blockiert bekannte schlechte Akteure — neue werden nicht blockiert. Allowlisting ist sicherer für Admin-Interfaces: nur deine Office-IPs und VPN-Endpoints dürfen SSH/Admin-Panels erreichen. Nachteil: höherer Verwaltungsaufwand.' } },
      { '@type': 'Question', name: 'Wie teste ich meine Firewall-Konfiguration?', acceptedAnswer: { '@type': 'Answer', text: 'Firewall-Test: nmap -sV -p 1-65535 <deine-IP> zeigt alle offenen Ports. Shodan.io prüft was öffentlich sichtbar ist. ClawGuru Security Check analysiert HTTP-Security-Headers und Exposition. Regelmäßiger Test nach jedem Infrastruktur-Änderungen. Ziel: nur 80 und 443 sichtbar von extern.' } },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="py-16 max-w-4xl mx-auto">
        <div className="text-xs uppercase tracking-widest text-brand-cyan/80">Vault</div>
        <h1 className="mt-2 text-4xl font-black">Firewall Baseline (deny-by-default)</h1>
        <p className="mt-4 text-gray-300 text-lg leading-relaxed">
          Die meisten „Hacks“ sind einfach nur: <strong>öffentliche Exposition</strong> + schlechte Defaults.
          Die Baseline ist langweilig — und genau deshalb gewinnt sie.
        </p>

        <div className="mt-8 p-6 rounded-3xl border border-gray-800 bg-black/30">
          <h2 className="text-2xl font-black">Baseline</h2>
          <ul className="mt-4 space-y-3 text-gray-300">
            <li><span className="text-cyan-300 font-bold">•</span> Private subnet / VPN für Admin-Ports</li>
            <li><span className="text-cyan-300 font-bold">•</span> Öffentlich nur: HTTPS (80→443 redirect), sonst nichts</li>
            <li><span className="text-cyan-300 font-bold">•</span> Allowlist statt „0.0.0.0/0“ wo möglich</li>
            <li><span className="text-cyan-300 font-bold">•</span> Rate limits + fail2ban / WAF (wenn relevant)</li>
          </ul>
        </div>

        <div className="mt-8 p-6 rounded-3xl border border-gray-800 bg-black/30">
          <h2 className="text-2xl font-black">Anti-Pattern</h2>
          <ul className="mt-4 space-y-3 text-gray-300">
            <li><span className="text-red-300 font-bold">•</span> SSH offen ins Internet</li>
            <li><span className="text-red-300 font-bold">•</span> Admin-Panels ohne Auth</li>
            <li><span className="text-red-300 font-bold">•</span> WebSockets ohne Origin/Token Binding</li>
          </ul>
        </div>

        <div className="mt-10 flex gap-3 flex-wrap">
          <a href="/tools" className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90">
            Config Validator →
          </a>
          <a href="/check" className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200">
            Score checken →
          </a>
        </div>
      </div>
    </Container>
  )
}
