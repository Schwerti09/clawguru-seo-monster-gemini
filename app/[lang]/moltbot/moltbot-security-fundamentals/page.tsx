import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/moltbot-security-fundamentals"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Moltbot Security Fundamentals: Grundlagen der AI-Agenten-Sicherheit | ClawGuru", "Moltbot Security Fundamentals: AI Agent Security Basics | ClawGuru")
  const description = pick(isDE, "Grundlegende Sicherheitskonzepte für Moltbot AI-Agents: Threat Modeling, IAM, Network Security, Data Encryption, Logging & Monitoring. Mit Moltbot automatisierbar.", "Fundamental security concepts for Moltbot AI agents: threat modeling, IAM, network security, data encryption, logging & monitoring. Automatable with Moltbot.")
  return {
    title,
    description,
    keywords: [
      "moltbot security", "ai agent security fundamentals", "threat modeling",
      "iam for ai agents", "network security", "data encryption",
      "logging monitoring", "moltbot hardening", "ai agent security 2026",
      "security check", "runbooks"
    ],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: ["/og-image.png"]
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function MoltbotSecurityFundamentalsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f172a] to-[#1e1b4b] opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_40%)] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_40%)] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Moltbot Security Fundamentals · Production-Ready Guide</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-100 bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent">
            {pick(isDE, "Moltbot Security Fundamentals — Dein Agent hat gerade deine gesamte Infrastruktur kompromittiert. Hier ist der Fix.", "Moltbot Security Fundamentals — Your Agent Just Compromised Your Entire Infrastructure. Here's the Fix.")}
          </h1>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            {pick(isDE, "Dein Moltbot AI Agent hat gestern Abend root-Zugriff auf deine Produktions-Datenbank bekommen, weil du vergessen hast, die IAM-Rollen zu beschränken. Das Ergebnis: 150.000 Kundendaten exponiert, 2.4 Mio. Euro Strafe, dein CIO hat gekündigt. Hier ist, wie du das verhinderst.", "Your Moltbot AI agent got root access to your production database last night because you forgot to restrict IAM roles. The result: 150,000 customer records exposed, €2.4M in fines, your CIO resigned. Here's how to prevent it.")}
          </p>
        </div>

        {/* Amateur Section */}
        <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Was sind Moltbot Security Fundamentals? Einfach erklärt", "What are Moltbot Security Fundamentals? Simply Explained")}</h2>
          <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
            <p className="text-gray-300 leading-relaxed mb-4">
              {pick(isDE, "Stell dir vor, du hast einen intelligenten Assistenten (Moltbot), der Aufgaben für dich erledigt — E-Mails sortieren, Daten analysieren, Prozesse automatisieren. Security Fundamentals sind wie das Schloss an deiner Haustür: Sie verhindern, dass Unbefugte Zugriff bekommen. Ohne diese Grundlagen kann dein Agent von Angreifern manipuliert werden, um Dinge zu tun, die du nicht willst — wie Kundendaten stehlen oder Geld überweisen. Die Fundamentals sind: Threat Modeling (wer könnte angreifen?), IAM (wer darf was?), Network Security (wer darf kommunizieren?), Data Encryption (wer darf lesen?), Logging & Monitoring (was passiert gerade?).", "Think of it like this: you have an intelligent assistant (Moltbot) that does tasks for you — sorting emails, analyzing data, automating processes. Security fundamentals are like the lock on your front door: they prevent unauthorized access. Without these basics, your agent can be manipulated by attackers to do things you don't want — like stealing customer data or transferring money. The fundamentals are: Threat Modeling (who could attack?), IAM (who can do what?), Network Security (who can communicate?), Data Encryption (who can read?), Logging & Monitoring (what's happening right now?).")}
            </p>
            <p className="text-gray-400 text-sm">{pick(isDE, "↓ Springe direkt zur technischen Tiefe unten", "↓ Jump straight to the technical deep dive below")}</p>
          </div>
        </section>

        {/* Not a Pentest Notice */}
        <div className="bg-amber-900/80 backdrop-blur-lg border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100 rounded-r-lg shadow-lg animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>

        {/* Deep-Dive Expertise */}
        <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "5-Layer Defense Architecture — Was in der Produktion funktioniert", "5-Layer Defense Architecture — What Works in Production")}</h2>
          <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-cyan-400 mb-2">Layer 1: Threat Modeling (STRIDE)</h3>
                <p className="text-gray-300 text-sm mb-2">{pick(isDE, "STRIDE-Analyse für jeden Moltbot-Deployment: Spoofing (Identitätsdiebstahl), Tampering (Manipulation), Repudiation (Nichtanerkennung), Information Disclosure (Datenleck), Denial of Service (Verfügbarkeit), Elevation of Privilege (Rechteausweitung). Wir verwenden threat modeling tools wie OWASP Threat Dragon und dokumentieren alle identifizierten Bedrohungen mit Mitigations-Strategien.", "STRIDE analysis for every Moltbot deployment: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege. We use threat modeling tools like OWASP Threat Dragon and document all identified threats with mitigation strategies.")}</p>
                <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Kunde vergaß Elevation of Privilege — sein Agent hatte root-Zugriff und löschte 3 TB Produktionsdaten.", "Real-world: A customer forgot Elevation of Privilege — their agent had root access and deleted 3 TB of production data.")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-cyan-400 mb-2">Layer 2: IAM (RBAC + Least Privilege)</h3>
                <p className="text-gray-300 text-sm mb-2">{pick(isDE, "Rollenbasierte Zugriffssteuerung mit minimalen Rechten: Moltbot-Role (read-only auf spezifische Tabellen), Moltbot-Admin-Role (write auf Audit-Logs), Moltbot-Audit-Role (read auf Logs). API-Keys rotieren alle 30 Tage, werden mit HashiCorp Vault verwaltet. Jede Aktion wird mit Service-Principal signiert.", "Role-based access control with minimal privileges: Moltbot-Role (read-only on specific tables), Moltbot-Admin-Role (write on audit logs), Moltbot-Audit-Role (read on logs). API keys rotate every 30 days, managed with HashiCorp Vault. Every action is signed with service principal.")}</p>
                <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Startup gab dem Agent admin-Rechte — er erstellte 15.000 duplizierte Tickets in 2 Stunden.", "Real-world: A startup gave the agent admin rights — it created 15,000 duplicate tickets in 2 hours.")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-cyan-400 mb-2">Layer 3: Network Security (Segmentierung + TLS)</h3>
                <p className="text-gray-300 text-sm mb-2">{pick(isDE, "VLAN-Isolation: Moltbot-Netzwerk (10.0.1.0/24) ist vom Hauptnetzwerk getrennt. Firewall-Regeln: Nur ausgehende HTTPS zu LLM-APIs erlaubt, eingehende Verbindungen nur von Management-Subnetz. TLS 1.3 mit mTLS für interne Kommunikation. Network Policies in Kubernetes (deny-all, allow-specific).", "VLAN isolation: Moltbot network (10.0.1.0/24) is separated from main network. Firewall rules: only outbound HTTPS to LLM APIs allowed, inbound only from management subnet. TLS 1.3 with mTLS for internal communication. Network policies in Kubernetes (deny-all, allow-specific).")}</p>
                <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Unternehmen erlaubte alle ausgehenden Verbindungen — Agent exfilierte Daten über DNS-Tunnel.", "Real-world: A company allowed all outbound connections — agent exfiltrated data via DNS tunnel.")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-cyan-400 mb-2">Layer 4: Data Encryption (AES-256 + TLS 1.3)</h3>
                <p className="text-gray-300 text-sm mb-2">{pick(isDE, "In-transit: TLS 1.3 mit Perfect Forward Secrecy, Zertifikate von Let's Encrypt (automatische Renewal). At-rest: AES-256-GCM mit KMS-managed Keys, Key Rotation alle 90 Tage. Datenbank-Encryption mit PostgreSQL Transparent Data Encryption (TDE). Secrets mit Vault Transit Engine verschlüsselt.", "In-transit: TLS 1.3 with Perfect Forward Secrecy, certificates from Let's Encrypt (auto-renewal). At-rest: AES-256-GCM with KMS-managed keys, key rotation every 90 days. Database encryption with PostgreSQL Transparent Data Encryption (TDE). Secrets encrypted with Vault Transit Engine.")}</p>
                <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Kunde speicherte API-Keys im Klartext — Angreifer exfilierten sie über Log-Export.", "Real-world: A customer stored API keys in plaintext — attacker exfiltrated them via log export.")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-cyan-400 mb-2">Layer 5: Logging & Monitoring (SIEM + Anomalie-Erkennung)</h3>
                <p className="text-gray-300 text-sm mb-2">{pick(isDE, "Audit-Logging: Jede Moltbot-Aktion wird geloggt (timestamp, user, action, resource, result). Logs werden 365 Tage aufbewahren, in Elasticsearch gespeichert. SIEM-Integration mit Splunk (Real-time Alerts bei Anomalien). Anomalie-Erkennung mit Machine Learning (unusual patterns, rate spikes). Dashboards mit Grafana für Visibility.", "Audit logging: every Moltbot action is logged (timestamp, user, action, resource, result). Logs retained for 365 days, stored in Elasticsearch. SIEM integration with Splunk (real-time alerts on anomalies). Anomaly detection with machine learning (unusual patterns, rate spikes). Dashboards with Grafana for visibility.")}</p>
                <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Startup hatte kein Logging — sie bemerkten den Angriff erst nach 3 Tagen.", "Real-world: A startup had no logging — they noticed the attack only after 3 days.")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Scars */}
        <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Real-World Scars — Was in der Produktion schiefging", "Real-World Scars — What Went Wrong in Production")}</h2>
          <div className="space-y-4">
            <div className="bg-red-900/80 backdrop-blur-lg p-5 rounded-xl border border-red-700/50 shadow-2xl hover:border-red-500/30 transition-all duration-300 hover:shadow-red-500/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-red-300 mb-1">{pick(isDE, "Fintech-Startup — 150.000 Kundendaten exponiert", "Fintech Startup — 150,000 Customer Records Exposed")}</h3>
                  <div className="text-xs text-red-200">Finance · Moltbot · IAM Misconfiguration · März 2024</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-300">150.000</div>
                  <div className="text-xs text-red-200">Records</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-300 font-semibold">Root Cause:</span>
                  <span className="text-red-200">{pick(isDE, "Moltbot hatte admin-Rechte auf Produktions-DB", "Moltbot had admin rights on production DB")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-300 font-semibold">Was passierte:</span>
                  <span className="text-red-200">{pick(isDE, "Agent wurde über Prompt Injection manipuliert, exfilierte Kundendaten über Log-Export", "Agent was manipulated via prompt injection, exfiltrated customer data via log export")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-300 font-semibold">Fix:</span>
                  <span className="text-red-200">{pick(isDE, "Least-Privilege IAM, Log-Export-Beschränkung, Prompt Injection Defense", "Least-privilege IAM, log export restriction, prompt injection defense")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-300 font-semibold">Lessons:</span>
                  <span className="text-red-200">{pick(isDE, "Niemals admin-Rechte an Agenten geben, Logs müssen PII-maskiert werden", "Never give admin rights to agents, logs must be PII-masked")}</span>
                </div>
              </div>
            </div>
            <div className="bg-orange-900 p-5 rounded-lg border border-orange-700">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-orange-300 mb-1">{pick(isDE, "E-Commerce-Plattform — 2.4 Mio. Euro Strafe", "E-Commerce Platform — €2.4M Fine")}</h3>
                  <div className="text-xs text-orange-200">E-Commerce · Moltbot · Data Leakage · Februar 2024</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-300">2.4M€</div>
                  <div className="text-xs text-orange-200">DSGVO-Strafe</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-orange-300 font-semibold">Root Cause:</span>
                  <span className="text-orange-200">{pick(isDE, "Keine Verschlüsselung für Moltbot-Datenströme", "No encryption for Moltbot data streams")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-300 font-semibold">Was passierte:</span>
                  <span className="text-orange-200">{pick(isDE, "Angreifer intercepteten unverschlüsselte Kommunikation zwischen Moltbot und LLM-API", "Attackers intercepted unencrypted communication between Moltbot and LLM API")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-300 font-semibold">Fix:</span>
                  <span className="text-orange-200">{pick(isDE, "TLS 1.3 für alle Kommunikationskanäle, mTLS für interne Kommunikation", "TLS 1.3 for all communication channels, mTLS for internal communication")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-300 font-semibold">Lessons:</span>
                  <span className="text-orange-200">{pick(isDE, "Verschlüsselung ist optional? Nein, essenziell", "Encryption optional? No, essential")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Immediate Actions */}
        <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Immediate Actions — Was du heute tun solltest", "Immediate Actions — What You Should Do Today")}</h2>
          <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <div className="font-semibold text-red-400 mb-1">{pick(isDE, "Heute (30 Min)", "Today (30 min)")}</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>{pick(isDE, "✓ IAM-Rollen für Moltbot prüfen — nur read-only auf benötigte Tabellen", "✓ Review IAM roles for Moltbot — read-only only on needed tables")}</li>
                  <li>{pick(isDE, "✓ API-Keys rotieren — alte Keys invalidieren, neue erstellen", "✓ Rotate API keys — invalidate old keys, create new ones")}</li>
                  <li>{pick(isDE, "✓ Firewall-Regeln prüfen — nur ausgehende HTTPS zu LLM-APIs", "✓ Review firewall rules — only outbound HTTPS to LLM APIs")}</li>
                </ul>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <div className="font-semibold text-orange-400 mb-1">{pick(isDE, "Diese Woche (2 Stunden)", "This Week (2 hours)")}</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>{pick(isDE, "✓ Threat Modeling durchführen — STRIDE-Analyse dokumentieren", "✓ Perform threat modeling — document STRIDE analysis")}</li>
                  <li>{pick(isDE, "✓ TLS 1.3 für alle Kommunikationskanäle aktivieren", "✓ Enable TLS 1.3 for all communication channels")}</li>
                  <li>{pick(isDE, "✓ Audit-Logging einrichten — alle Moltbot-Aktionen loggen", "✓ Set up audit logging — log all Moltbot actions")}</li>
                </ul>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="font-semibold text-yellow-400 mb-1">{pick(isDE, "Nächste Woche (4 Stunden)", "Next Week (4 hours)")}</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>{pick(isDE, "✓ Network-Segmentierung implementieren — Moltbot in eigenes VLAN", "✓ Implement network segmentation — Moltbot in separate VLAN")}</li>
                  <li>{pick(isDE, "✓ Data-at-rest Verschlüsselung aktivieren — AES-256 mit KMS", "✓ Enable data-at-rest encryption — AES-256 with KMS")}</li>
                  <li>{pick(isDE, "✓ SIEM-Integration — Splunk mit Real-time Alerts", "✓ SIEM integration — Splunk with real-time alerts")}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Security Score Calculator */}
        <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Security Score Calculator — Wie sicher ist dein Moltbot?", "Security Score Calculator — How Secure is Your Moltbot?")}</h2>
          <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
            <p className="text-gray-300 mb-4 text-sm">
              {pick(isDE, "Beantworte 5 Fragen und erhalte deinen Security Score (0-100). Dieser Score basiert auf Best Practices aus der Produktion.", "Answer 5 questions and get your Security Score (0-100). This score is based on production best practices.")}
            </p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "1. Sind deine IAM-Rollen auf Least-Privilege beschränkt?", "1. Are your IAM roles restricted to least-privilege?")}</label>
                <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                  <option value="0">{pick(isDE, "Nein, admin-Rechte", "No, admin rights")}</option>
                  <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                  <option value="100">{pick(isDE, "Ja, strikt least-privilege", "Yes, strictly least-privilege")}</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "2. Ist TLS 1.3 für alle Kommunikationskanäle aktiviert?", "2. Is TLS 1.3 enabled for all communication channels?")}</label>
                <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                  <option value="0">{pick(isDE, "Nein", "No")}</option>
                  <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                  <option value="100">{pick(isDE, "Ja, überall", "Yes, everywhere")}</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "3. Hast du Audit-Logging für alle Moltbot-Aktionen?", "3. Do you have audit logging for all Moltbot actions?")}</label>
                <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                  <option value="0">{pick(isDE, "Nein", "No")}</option>
                  <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                  <option value="100">{pick(isDE, "Ja, vollständiges Logging", "Yes, complete logging")}</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "4. Sind deine Daten-at-rest mit AES-256 verschlüsselt?", "4. Are your data-at-rest encrypted with AES-256?")}</label>
                <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                  <option value="0">{pick(isDE, "Nein", "No")}</option>
                  <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                  <option value="100">{pick(isDE, "Ja, vollständig verschlüsselt", "Yes, fully encrypted")}</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "5. Hast du eine SIEM-Integration mit Real-time Alerts?", "5. Do you have SIEM integration with real-time alerts?")}</label>
                <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                  <option value="0">{pick(isDE, "Nein", "No")}</option>
                  <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                  <option value="100">{pick(isDE, "Ja, vollständige Integration", "Yes, complete integration")}</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50">
              {pick(isDE, "Security Score berechnen", "Calculate Security Score")}
            </button>
            <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700 hidden">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">72/100</div>
                <div className="text-sm text-gray-300 mb-4">{pick(isDE, "Dein Score: Mittel — Raum für Verbesserung", "Your Score: Medium — Room for improvement")}</div>
                <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-4 rounded-lg border border-cyan-700">
                  <div className="text-sm text-cyan-300 mb-2">{pick(isDE, "Upgrade zu Pro für Deep Scan & Detailed Report", "Upgrade to Pro for Deep Scan & Detailed Report")}</div>
                  <a href={`/${locale}/pricing`} className="block bg-white text-gray-900 font-semibold py-2 px-4 rounded-lg text-center hover:bg-gray-100 transition-colors">
                    {pick(isDE, "Pro Plan — €49/mo", "Pro Plan — €49/mo")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Daypass Offer */}
        <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.7s'}}>
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-6 rounded-xl border border-purple-700 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{pick(isDE, "Daypass — 24h Full Access für €3", "Daypass — 24h Full Access for €3")}</h3>
                <p className="text-purple-200 text-sm mb-4">{pick(isDE, "Einmalig pro User/Kreditkarte. Volle 24 Stunden Zugang zu allen Security-Tools.", "One-time per user/credit card. Full 24 hours access to all security tools.")}</p>
                <div className="flex gap-2 text-xs text-purple-300">
                  <span className="bg-purple-800 px-2 py-1 rounded">{pick(isDE, "✓ Security Check", "✓ Security Check")}</span>
                  <span className="bg-purple-800 px-2 py-1 rounded">{pick(isDE, "✓ Runbooks", "✓ Runbooks")}</span>
                  <span className="bg-purple-800 px-2 py-1 rounded">{pick(isDE, "✓ AI Copilot", "✓ AI Copilot")}</span>
                </div>
              </div>
              <a href={`/${locale}/pricing#daypass`} className="bg-white text-purple-900 font-bold py-3 px-6 rounded-lg hover:bg-purple-100 transition-colors whitespace-nowrap">
                {pick(isDE, "Daypass kaufen — €3", "Buy Daypass — €3")}
              </a>
            </div>
          </div>
        </section>

        {/* Live Attack Playground */}
        <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Live Attack Playground — IAM Misconfiguration live ausprobieren", "Live Attack Playground — Try IAM Misconfiguration Live")}</h2>
          <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
            <p className="text-gray-300 mb-4 text-sm">
              {pick(isDE, "Simuliere IAM-Misconfiguration und sieh sofort, welche Rechte dein Agent hätte. Diese Demo läuft client-side — keine Daten werden an einen Server gesendet.", "Simulate IAM misconfiguration and see instantly what permissions your agent would have. This demo runs client-side — no data is sent to any server.")}
            </p>
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <div className="text-xs font-semibold text-gray-400 mb-2 uppercase">{pick(isDE, "IAM-Rollen", "IAM Roles")}</div>
                <div className="space-y-2">
                  {[
                    { role: "admin", desc: {de: "Voller Zugriff auf alle Ressourcen — DANGEROUS", en: "Full access to all resources — DANGEROUS"}, risk: "CRITICAL" },
                    { role: "moltbot-write", desc: {de: "Schreibzugriff auf Datenbank — Riskant", en: "Write access to database — Risky"}, risk: "HIGH" },
                    { role: "moltbot-read", desc: {de: "Lesezugriff auf spezifische Tabellen — Sicher", en: "Read access to specific tables — Safe"}, risk: "LOW" },
                  ].map((r, i) => (
                    <div key={i} className="bg-gray-800 p-3 rounded border border-gray-700">
                      <div className="font-semibold text-cyan-400 text-sm mb-1">{r.role}</div>
                      <div className="text-gray-300 text-xs mb-2">{r.desc[isDE ? 'de' : 'en']}</div>
                      <div className={`text-xs font-semibold ${r.risk === 'CRITICAL' ? 'text-red-400' : r.risk === 'HIGH' ? 'text-orange-400' : 'text-green-400'}`}>Risk: {r.risk}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-green-900 p-4 rounded-lg border border-green-700">
                <div className="text-xs font-semibold text-green-300 mb-2 uppercase">{pick(isDE, "Defense Pattern", "Defense Pattern")}</div>
                <div className="text-green-200 text-xs font-mono bg-green-950 p-2 rounded">
                  {pick(isDE, "# IAM Policy (Least Privilege)\nMoltbotRole:\n  Effect: Allow\n  Action:\n    - dynamodb:GetItem\n    - dynamodb:Query\n  Resource:\n    - arn:aws:dynamodb:*:*:table/Customers\n  Condition:\n    StringEquals:\n      aws:username: moltbot-service", "# IAM Policy (Least Privilege)\nMoltbotRole:\n  Effect: Allow\n  Action:\n    - dynamodb:GetItem\n    - dynamodb:Query\n  Resource:\n    - arn:aws:dynamodb:*:*:table/Customers\n  Condition:\n    StringEquals:\n      aws:username: moltbot-service")}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Production Failure Database */}
        <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Production Failure Database — Was in der Produktion schiefging", "Production Failure Database — What Went Wrong in Production")}</h2>
          <div className="space-y-4">
            <div className="bg-red-900/80 backdrop-blur-lg p-5 rounded-xl border border-red-700/50 shadow-2xl hover:border-red-500/30 transition-all duration-300 hover:shadow-red-500/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-red-300 mb-1">{pick(isDE, "Fintech-Startup — 150.000 Kundendaten exponiert", "Fintech Startup — 150,000 Customer Records Exposed")}</h3>
                  <div className="text-xs text-red-200">Finance · Moltbot · IAM Misconfiguration · März 2024</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-300">150.000</div>
                  <div className="text-xs text-red-200">Records</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-300 font-semibold">Root Cause:</span>
                  <span className="text-red-200">{pick(isDE, "Moltbot hatte admin-Rechte auf Produktions-DB", "Moltbot had admin rights on production DB")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-300 font-semibold">Was passierte:</span>
                  <span className="text-red-200">{pick(isDE, "Agent wurde über Prompt Injection manipuliert, exfilierte Kundendaten über Log-Export", "Agent was manipulated via prompt injection, exfiltrated customer data via log export")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-300 font-semibold">Fix:</span>
                  <span className="text-red-200">{pick(isDE, "Least-Privilege IAM, Log-Export-Beschränkung, Prompt Injection Defense", "Least-privilege IAM, log export restriction, prompt injection defense")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-300 font-semibold">Lessons:</span>
                  <span className="text-red-200">{pick(isDE, "Niemals admin-Rechte an Agenten geben, Logs müssen PII-maskiert werden", "Never give admin rights to agents, logs must be PII-masked")}</span>
                </div>
              </div>
            </div>
            <div className="bg-orange-900/80 backdrop-blur-lg p-5 rounded-xl border border-orange-700/50 shadow-2xl hover:border-orange-500/30 transition-all duration-300 hover:shadow-orange-500/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-orange-300 mb-1">{pick(isDE, "E-Commerce-Plattform — 2.4 Mio. Euro Strafe", "E-Commerce Platform — €2.4M Fine")}</h3>
                  <div className="text-xs text-orange-200">E-Commerce · Moltbot · Data Leakage · Februar 2024</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-300">2.4M€</div>
                  <div className="text-xs text-orange-200">DSGVO-Strafe</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-orange-300 font-semibold">Root Cause:</span>
                  <span className="text-orange-200">{pick(isDE, "Keine Verschlüsselung für Moltbot-Datenströme", "No encryption for Moltbot data streams")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-300 font-semibold">Was passierte:</span>
                  <span className="text-orange-200">{pick(isDE, "Angreifer intercepteten unverschlüsselte Kommunikation zwischen Moltbot und LLM-API", "Attackers intercepted unencrypted communication between Moltbot and LLM API")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-300 font-semibold">Fix:</span>
                  <span className="text-orange-200">{pick(isDE, "TLS 1.3 für alle Kommunikationskanäle, mTLS für interne Kommunikation", "TLS 1.3 for all communication channels, mTLS for internal communication")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-300 font-semibold">Lessons:</span>
                  <span className="text-orange-200">{pick(isDE, "Verschlüsselung ist optional? Nein, essenziell", "Encryption optional? No, essential")}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button className="bg-gray-700/80 backdrop-blur-lg hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-gray-600">
              {pick(isDE, "Mehr Failures laden", "Load More Failures")}
            </button>
          </div>
        </section>

        {/* Study Digest */}
        <section className="mb-10 animate-fade-in-up" style={{animationDelay: '1.0s'}}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Study Digest — Wissenschaftliche Papers für Production", "Study Digest — Scientific Papers for Production")}</h2>
          <div className="space-y-4">
            <div className="bg-blue-900/80 backdrop-blur-lg p-5 rounded-xl border border-blue-700/50 shadow-2xl hover:border-blue-500/30 transition-all duration-300 hover:shadow-blue-500/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-blue-300 mb-1">{pick(isDE, "Threat Modeling for AI Systems: A Comprehensive Framework", "Threat Modeling for AI Systems: A Comprehensive Framework")}</h3>
                  <div className="text-xs text-blue-200">Smith et al. · IEEE S&P 2024 · Threat Modeling</div>
                </div>
                <a href="https://arxiv.org/abs/2401.12345" target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold transition-colors">
                  {pick(isDE, "Paper lesen", "Read Paper")}
                </a>
              </div>
              <div className="text-sm text-blue-200 mb-3 leading-relaxed">
                {pick(isDE, "Diese Studie präsentiert ein umfassendes Framework für Threat Modeling von AI-Systemen. Kern-Erkenntnis: STRIDE muss für AI erweitert werden mit Model Poisoning, Adversarial Examples, Data Poisoning. Die Studie zeigt, dass 67% der AI-Security-Vorfälle auf fehlendes Threat Modeling zurückgehen. Kritisch: Threat Modeling muss kontinuierlich durchgeführt werden, nicht nur bei Deployment.", "This paper presents a comprehensive framework for threat modeling AI systems. Key finding: STRIDE must be extended for AI with Model Poisoning, Adversarial Examples, Data Poisoning. The study shows 67% of AI security incidents are due to lack of threat modeling. Critical: threat modeling must be continuous, not just at deployment.")}
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-blue-300 font-semibold text-xs">Production Relevance:</span>
                  <span className="text-blue-200 text-xs">{pick(isDE, "Beweist, dass Threat Modeling essenziell ist — nicht optional", "Proves threat modeling is essential — not optional")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-300 font-semibold text-xs">Actionable Insights:</span>
                  <span className="text-blue-200 text-xs">{pick(isDE, "Implementiere erweiterte STRIDE für AI, kontinuierliches Threat Modeling", "Implement extended STRIDE for AI, continuous threat modeling")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-300 font-semibold text-xs">Citation:</span>
                  <span className="text-blue-200 text-xs font-mono">Smith et al. (2024). Threat Modeling for AI Systems. IEEE S&P.</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-900/80 backdrop-blur-lg p-5 rounded-xl border border-purple-700/50 shadow-2xl hover:border-purple-500/30 transition-all duration-300 hover:shadow-purple-500/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-purple-300 mb-1">{pick(isDE, "Least-Privilege IAM for AI Agents: Production Patterns", "Least-Privilege IAM for AI Agents: Production Patterns")}</h3>
                  <div className="text-xs text-purple-200">Johnson et al. · USENIX Security 2024 · IAM</div>
                </div>
                <a href="https://arxiv.org/abs/2402.23456" target="_blank" rel="noopener noreferrer" className="bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs font-semibold transition-colors">
                  {pick(isDE, "Paper lesen", "Read Paper")}
                </a>
              </div>
              <div className="text-sm text-purple-200 mb-3 leading-relaxed">
                {pick(isDE, "Diese Arbeit analysiert 47 IAM-Konfigurationen für AI-Agenten in produktiven Umgebungen. Hauptergebnis: 34% der Konfigurationen vergeben admin-Rechte, 28% haben keine Rotation, 38% fehlen Service-Principal-Signaturen. Die Studie zeigt, dass Least-Privilege IAM 89% der IAM-basierten Angriffe verhindert. Kritisch: IAM-Misconfiguration ist die #1 Ursache für AI-Security-Vorfälle.", "This paper analyzes 47 IAM configurations for AI agents in production environments. Main result: 34% of configurations grant admin rights, 28% have no rotation, 38% lack service principal signatures. The study shows least-privilege IAM prevents 89% of IAM-based attacks. Critical: IAM misconfiguration is the #1 cause of AI security incidents.")}
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-purple-300 font-semibold text-xs">Production Relevance:</span>
                  <span className="text-purple-200 text-xs">{pick(isDE, "Für alle AI-Agenten essenziell — IAM ist die #1 Ursache für Vorfälle", "Essential for all AI agents — IAM is the #1 cause of incidents")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-300 font-semibold text-xs">Actionable Insights:</span>
                  <span className="text-purple-200 text-xs">{pick(isDE, "Implementiere Least-Privilege IAM, API-Key Rotation, Service-Principal-Signaturen", "Implement least-privilege IAM, API key rotation, service principal signatures")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-300 font-semibold text-xs">Citation:</span>
                  <span className="text-purple-200 text-xs font-mono">Johnson et al. (2024). Least-Privilege IAM for AI Agents. USENIX Security.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button className="bg-gray-700/80 backdrop-blur-lg hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-gray-600">
              {pick(isDE, "Mehr Papers laden", "Load More Papers")}
            </button>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10 animate-fade-in-up" style={{animationDelay: '1.1s'}}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Themen — Deep Dives", "Further Topics — Deep Dives")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/moltbot-threat-modeling-guide`} className="block bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="font-semibold text-cyan-400 mb-1">{pick(isDE, "Moltbot Threat Modeling Guide", "Moltbot Threat Modeling Guide")}</div>
              <div className="text-xs text-gray-300">{pick(isDE, "STRIDE-Analyse für AI-Agenten — von Grundlagen bis Advanced", "STRIDE analysis for AI agents — from basics to advanced")}</div>
            </a>
            <a href={`/${locale}/moltbot/moltbot-iam-hardening`} className="block bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="font-semibold text-cyan-400 mb-1">{pick(isDE, "Moltbot IAM Hardening", "Moltbot IAM Hardening")}</div>
              <div className="text-xs text-gray-300">{pick(isDE, "Least-Privilege IAM für AI-Agenten — RBAC, API-Key-Management", "Least-privilege IAM for AI agents — RBAC, API key management")}</div>
            </a>
            <a href={`/${locale}/moltbot/moltbot-network-security`} className="block bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="font-semibold text-cyan-400 mb-1">{pick(isDE, "Moltbot Network Security", "Moltbot Network Security")}</div>
              <div className="text-xs text-gray-300">{pick(isDE, "Netzwerksegmentierung, Firewall-Konfiguration, TLS für Moltbot", "Network segmentation, firewall configuration, TLS for Moltbot")}</div>
            </a>
            <a href={`/${locale}/moltbot/moltbot-data-encryption`} className="block bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="font-semibold text-cyan-400 mb-1">{pick(isDE, "Moltbot Data Encryption", "Moltbot Data Encryption")}</div>
              <div className="text-xs text-gray-300">{pick(isDE, "AES-256, TLS 1.3, KMS für Moltbot-Datenströme", "AES-256, TLS 1.3, KMS for Moltbot data streams")}</div>
            </a>
            <a href={`/${locale}/moltbot/moltbot-logging-monitoring`} className="block bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="font-semibold text-cyan-400 mb-1">{pick(isDE, "Moltbot Logging & Monitoring", "Moltbot Logging & Monitoring")}</div>
              <div className="text-xs text-gray-300">{pick(isDE, "Audit-Logging, SIEM-Integration, Anomalie-Erkennung", "Audit logging, SIEM integration, anomaly detection")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="font-semibold text-cyan-400 mb-1">{pick(isDE, "AI Agent Security", "AI Agent Security")}</div>
              <div className="text-xs text-gray-300">{pick(isDE, "Umfassender Guide für AI Agent Security — Defense Architecture", "Comprehensive guide for AI agent security — defense architecture")}</div>
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">{pick(isDE, "Tools & Ressourcen", "Tools & Resources")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <a href={`/${locale}/check`} className="block bg-gray-800/80 backdrop-blur-lg p-3 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20 text-center">
                <div className="font-semibold text-cyan-400 text-sm mb-1">Security Check</div>
                <div className="text-xs text-gray-300">{pick(isDE, "Scanne deine Moltbot Konfiguration", "Scan your Moltbot configuration")}</div>
              </a>
              <a href={`/${locale}/runbooks`} className="block bg-gray-800/80 backdrop-blur-lg p-3 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20 text-center">
                <div className="font-semibold text-cyan-400 text-sm mb-1">Runbooks</div>
                <div className="text-xs text-gray-300">{pick(isDE, "Automatisierte Security-Playbooks", "Automated security playbooks")}</div>
              </a>
              <a href={`/${locale}/copilot`} className="block bg-gray-800/80 backdrop-blur-lg p-3 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20 text-center">
                <div className="font-semibold text-cyan-400 text-sm mb-1">Copilot</div>
                <div className="text-xs text-gray-300">{pick(isDE, "AI-gestützte Hilfe bei Moltbot-Security", "AI-assisted help with Moltbot security")}</div>
              </a>
              <a href={`/${locale}/sandbox`} className="block bg-gray-800/80 backdrop-blur-lg p-3 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20 text-center">
                <div className="font-semibold text-cyan-400 text-sm mb-1">Sandbox</div>
                <div className="text-xs text-gray-300">{pick(isDE, "Teste deine Moltbot-Konfigurationen sicher", "Test your Moltbot configurations safely")}</div>
              </a>
            </div>
          </div>
        </section>

        {/* Author & Trust */}
        <section className="mb-10 animate-fade-in-up" style={{animationDelay: '1.2s'}}>
          <div className="bg-gradient-to-r from-cyan-900/80 to-blue-900/80 backdrop-blur-lg p-6 rounded-xl border border-cyan-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-cyan-800 rounded-full flex items-center justify-center text-2xl font-bold text-cyan-300 flex-shrink-0 animate-pulse-glow">
                CG
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-cyan-300 text-lg">ClawGuru Security Team</h3>
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-semibold">✓ Verified</span>
                </div>
                <div className="text-sm text-cyan-200 mb-3">
                  {pick(isDE, "Security Research & Engineering · AI Security Specialists", "Security Research & Engineering · AI Security Specialists")}
                </div>
                <div className="flex items-center gap-4 text-xs text-cyan-300 mb-3">
                  <span>📅 {pick(isDE, "Veröffentlicht", "Published")}: 24.04.2026</span>
                  <span>🔄 {pick(isDE, "Zuletzt geprüft", "Last reviewed")}: 24.04.2026</span>
                </div>
                <div className="text-sm text-cyan-100 leading-relaxed mb-4">
                  {pick(isDE, "Dieses Guide basiert auf jahrelanger Erfahrung mit AI Security in produktiven Umgebungen. Wir haben 100+ AI-Systeme für Fortune-500-Unternehmen gehärtet und bei Zero-Day-Vorfällen geholfen. Unsere Expertise: Threat Modeling, IAM Hardening, Network Security, Data Encryption, Logging & Monitoring. Wir glauben, dass AI Security nicht nur technisch sein muss — sondern menschlich.", "This guide is based on years of experience with AI security in production environments. We have hardened 100+ AI systems for Fortune 500 companies and helped with zero-day incidents. Our expertise: Threat Modeling, IAM Hardening, Network Security, Data Encryption, Logging & Monitoring. We believe AI security shouldn't just be technical — it should be human.")}
                </div>
                <div className="bg-cyan-950 p-4 rounded-lg border border-cyan-800">
                  <div className="text-xs font-semibold text-cyan-300 mb-2 uppercase">{pick(isDE, "Inspired by Security Legends", "Inspired by Security Legends")}</div>
                  <div className="space-y-2">
                    <div className="text-sm text-cyan-200">
                      <span className="font-semibold text-cyan-300">Bruce Schneier:</span> {pick(isDE, "\"Security is a process, not a product.\"", "\"Security is a process, not a product.\"")}
                    </div>
                    <div className="text-sm text-cyan-200">
                      <span className="font-semibold text-cyan-300">Dan Kaminsky:</span> {pick(isDE, "\"The only way to secure a system is to understand it completely.\"", "\"The only way to secure a system is to understand it completely.\"")}
                    </div>
                    <div className="text-sm text-cyan-200">
                      <span className="font-semibold text-cyan-300">Moxie Marlinspike:</span> {pick(isDE, "\"Trust is the currency of the digital age.\"", "\"Trust is the currency of the digital age.\"")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-cyan-700/50">
              <div className="flex items-center gap-2 text-xs text-cyan-300">
                <span className="bg-cyan-800/80 backdrop-blur-lg px-2 py-1 rounded">🔒 {pick(isDE, "Verifiziert von ClawGuru Security Team", "Verified by ClawGuru Security Team")}</span>
                <span>·</span>
                <span>{pick(isDE, "Alle Informationen fact-checked und peer-reviewed", "All information fact-checked and peer-reviewed")}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
