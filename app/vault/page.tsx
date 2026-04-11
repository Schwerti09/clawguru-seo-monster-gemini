"use client"
import { useState } from "react"

const VAULT_FEATURES = [
  {
    icon: "🔐",
    title: "Secrets Management",
    description: "Zentrale Verwaltung aller API-Keys, Passwörter und Zertifikate. Vollständige Audit-Trails und automatische Rotation.",
    badge: "Core",
    badgeColor: "bg-cyan-900 text-cyan-300 border-cyan-700",
  },
  {
    icon: "🔄",
    title: "Key Rotation",
    description: "Automatische Schlüsselrotation nach Zeitplan oder Event. Zero-Downtime-Rotation mit nahtloser Übergabe.",
    badge: "Automation",
    badgeColor: "bg-green-900 text-green-300 border-green-700",
  },
  {
    icon: "🛡️",
    title: "Security Score",
    description: "Echtzeit-Bewertung deiner Secrets-Hygiene. Sofortige Alerts bei kritischen Konfigurationsfehlern.",
    badge: "Monitoring",
    badgeColor: "bg-blue-900 text-blue-300 border-blue-700",
  },
  {
    icon: "🧱",
    title: "Firewall Baseline",
    description: "Automatisierte Firewall-Regelprüfung. Abgleich gegen CIS Benchmarks und NIST-Standards.",
    badge: "Compliance",
    badgeColor: "bg-yellow-900 text-yellow-300 border-yellow-700",
  },
  {
    icon: "🌐",
    title: "WS-Origin Protection",
    description: "WebSocket Origin-Validierung und Connection-Security für alle Echtzeit-Verbindungen.",
    badge: "Network",
    badgeColor: "bg-purple-900 text-purple-300 border-purple-700",
  },
  {
    icon: "📋",
    title: "Compliance Reports",
    description: "Automatische Reports für GDPR, NIS2, ISO 27001 und SOC 2. Exportierbar als PDF oder JSON.",
    badge: "Reporting",
    badgeColor: "bg-red-900 text-red-300 border-red-700",
  },
]

const STATS = [
  { value: "600+", label: "Security Playbooks" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "15", label: "Sprachen" },
  { value: "24/7", label: "Monitoring" },
]

const FAQ_ITEMS = [
  {
    question: "Was ist der ClawGuru Vault?",
    answer:
      "Der ClawGuru Vault ist eine zentrale Sicherheitskontrollzentrale für deine Self-Hosted-Infrastruktur. Er vereint Secrets Management, Key Rotation, Security Scoring und Compliance-Reporting in einer einzigen Plattform – ohne Cloud-Lock-in und vollständig DSGVO-konform.",
  },
  {
    question: "Wie unterscheidet sich der Vault von HashiCorp Vault?",
    answer:
      "Der ClawGuru Vault ist kein Ersatz für HashiCorp Vault, sondern ein Security-Orchestrierungs-Layer darüber. Er integriert sich mit HashiCorp Vault, AWS Secrets Manager, Azure Key Vault und anderen Backends, fügt aber Security-Scoring, automatisierte Runbooks und Compliance-Reporting hinzu.",
  },
  {
    question: "Sind meine Secrets sicher gespeichert?",
    answer:
      "Ja. Der Vault speichert selbst keine Plaintext-Secrets. Alle sensiblen Daten werden AES-256-verschlüsselt und nur in deiner eigenen Infrastruktur gespeichert. ClawGuru hat keinen Zugriff auf deine Secrets – Zero-Knowledge-Architektur.",
  },
  {
    question: "Wie funktioniert die automatische Key Rotation?",
    answer:
      "Du definierst Rotationsrichtlinien (Zeit, Event-basiert oder manuell). Der Vault generiert neue Keys, aktualisiert alle abhängigen Services via Webhooks und markiert alte Keys als veraltet – alles ohne Downtime. Bei Fehlern gibt es automatisches Rollback.",
  },
  {
    question: "Welche Compliance-Standards werden unterstützt?",
    answer:
      "Der Vault unterstützt DSGVO/GDPR, NIS2 (Art. 21), ISO 27001, SOC 2 Type II, PCI-DSS und HIPAA. Audit-Logs und Compliance-Reports werden automatisch generiert und sind für Prüfer direkt exportierbar.",
  },
  {
    question: "Kann ich den Vault in meine CI/CD-Pipeline integrieren?",
    answer:
      "Ja. Es gibt native Integrationen für GitHub Actions, GitLab CI, Jenkins, ArgoCD und CircleCI. Secrets werden zur Build-Zeit injiziert und nie im Code gespeichert. Mit dem ClawGuru Vault CLI kannst du alle Operationen automatisieren.",
  },
  {
    question: "Was kostet der Vault?",
    answer:
      "Der Vault ist im Explorer-Plan kostenlos mit bis zu 10 Secrets verfügbar. Pro-Plan (ab 29€/Monat) umfasst unbegrenzte Secrets, automatische Rotation und Compliance-Reports. Team-Plan (ab 99€/Monat) fügt Multi-Tenant, RBAC und Priority Support hinzu.",
  },
  {
    question: "Gibt es eine API?",
    answer:
      "Ja, eine vollständige REST API und ein SDK für Python, Node.js, Go und Rust. Die API-Dokumentation ist unter /api-docs verfügbar. Alle Operationen können auch über die ClawGuru CLI ausgeführt werden.",
  },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-gray-800 hover:bg-gray-750 transition-colors"
      >
        <span className="font-semibold text-gray-100 pr-4">{question}</span>
        <span className={`flex-shrink-0 text-cyan-400 text-xl font-bold transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-6 py-4 bg-gray-900 border-t border-gray-700">
          <p className="text-gray-300 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function Vault() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black py-20 border-b border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/40 border border-cyan-800 text-cyan-400 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Security Vault — Live
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 text-gray-100 leading-tight">
              ClawGuru <span className="text-cyan-400">Vault</span>
            </h1>
            <p className="text-xl text-gray-300 mb-4 leading-relaxed">
              Zentrales Secrets Management, automatische Key Rotation und Echtzeit-Security-Scoring
              für deine Self-Hosted-Infrastruktur.
            </p>
            <p className="text-base text-gray-400 mb-8">
              DSGVO-konform · Zero-Knowledge · Kein Cloud-Lock-in
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/de/securitycheck"
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors"
              >
                Security Check starten →
              </a>
              <a
                href="/de/runbooks"
                className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 font-semibold rounded-lg transition-colors"
              >
                Runbooks ansehen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-cyan-400">{s.value}</div>
                <div className="text-sm text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-20">

          {/* Not a Pentest notice */}
          <div className="bg-amber-900 border-l-4 border-amber-500 p-4 text-sm text-amber-100 rounded-r-lg">
            <strong className="text-amber-100">"Not a Pentest" Hinweis</strong>: Der ClawGuru Vault
            dient der Absicherung deiner eigenen Systeme. Keine Angriffswerkzeuge, keine offensiven Tools.
          </div>

          {/* Features Grid */}
          <section>
            <h2 className="text-3xl font-bold text-gray-100 mb-3">Was der Vault kann</h2>
            <p className="text-gray-400 mb-8">Alle Sicherheitsmodule auf einen Blick</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {VAULT_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
                >
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-bold text-gray-100">{f.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${f.badgeColor}`}>
                      {f.badge}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section>
            <h2 className="text-3xl font-bold text-gray-100 mb-3">Wie es funktioniert</h2>
            <p className="text-gray-400 mb-8">In 4 Schritten zur gesicherten Infrastruktur</p>
            <div className="space-y-4">
              {[
                { step: 1, title: "Verbinden", desc: "Vault mit deiner Infrastruktur verbinden – Docker, Kubernetes, bare metal. Kein Agent nötig.", color: "bg-cyan-600" },
                { step: 2, title: "Inventarisieren", desc: "Automatisches Scanning aller Secrets, Keys und Zertifikate. Sofortige Sichtbarkeit über deinen Secrets-Bestand.", color: "bg-blue-600" },
                { step: 3, title: "Absichern", desc: "Runbooks und Policies definieren. Automatische Rotation, Least-Privilege-Enforcement und Audit-Logging aktivieren.", color: "bg-purple-600" },
                { step: 4, title: "Überwachen", desc: "Echtzeit-Dashboard mit Security Score, Alert-Benachrichtigungen und Compliance-Reports auf Knopfdruck.", color: "bg-green-600" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4 bg-gray-800 p-5 rounded-xl border border-gray-700">
                  <div className={`${item.color} text-white rounded-full w-9 h-9 flex items-center justify-center text-sm font-black flex-shrink-0`}>
                    {item.step}
                  </div>
                  <div>
                    <div className="font-bold text-gray-100 mb-1">{item.title}</div>
                    <div className="text-sm text-gray-300">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Vault sub-pages */}
          <section>
            <h2 className="text-3xl font-bold text-gray-100 mb-3">Vault Module</h2>
            <p className="text-gray-400 mb-8">Direkt zu den einzelnen Sicherheitsbereichen</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { href: "/de/vault/secrets", title: "Secrets Hygiene", desc: "5 Regeln für sauberes Secrets-Management in jedem Team." },
                { href: "/de/vault/key-rotation", title: "Key Rotation", desc: "Zero-Downtime-Rotation mit automatischem Rollback." },
                { href: "/de/vault/security-score", title: "Security Score", desc: "Echtzeit-Bewertung deiner gesamten Infrastruktursicherheit." },
                { href: "/de/vault/firewall-baseline", title: "Firewall Baseline", desc: "CIS-Benchmark-Prüfung für Firewall-Konfigurationen." },
                { href: "/de/vault/ws-origin", title: "WS-Origin Protection", desc: "WebSocket-Sicherheit für Echtzeit-Verbindungen." },
                { href: "/de/vault-hardening", title: "HashiCorp Vault Hardening", desc: "Auto-Unseal, TLS, PKI, Kubernetes Auth & Sentinel Policies." },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-cyan-700 hover:bg-gray-750 transition-colors group"
                >
                  <div className="font-semibold text-cyan-400 group-hover:text-cyan-300 mb-1">{link.title}</div>
                  <div className="text-sm text-gray-300">{link.desc}</div>
                </a>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-3xl font-bold text-gray-100 mb-3">Häufige Fragen (FAQ)</h2>
            <p className="text-gray-400 mb-8">Alles was du über den ClawGuru Vault wissen musst</p>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <FaqItem key={item.question} question={item.question} answer={item.answer} />
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-10 border border-gray-700 text-center">
            <h2 className="text-2xl font-bold text-gray-100 mb-3">Bereit für echte Secrets-Sicherheit?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Starte kostenlos mit dem Explorer-Plan. Keine Kreditkarte, kein Lock-in.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/de/securitycheck"
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors"
              >
                Jetzt kostenlos starten
              </a>
              <a
                href="/de/runbooks"
                className="px-8 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 font-semibold rounded-lg transition-colors"
              >
                600+ Runbooks →
              </a>
            </div>
          </section>

        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        }}
      />
    </div>
  )
}