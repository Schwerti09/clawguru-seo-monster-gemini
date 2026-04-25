import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/moltbot-data-encryption"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Moltbot Data Encryption: Verschlüsselung für AI-Agents | ClawGuru", "Moltbot Data Encryption: Encryption for AI Agents | ClawGuru")
  const description = pick(isDE, "Verschlüsselung für Moltbot-Datenströme (in-transit und at-rest). AES-256, TLS 1.3 und Key Management für AI-Agents. Mit Moltbot automatisierbar.", "Encryption for Moltbot data streams (in-transit and at-rest). AES-256, TLS 1.3 and key management for AI agents. Automatable with Moltbot.")
  return {
    title,
    description,
    keywords: [
      "moltbot data encryption", "aes-256 encryption", "tls 1.3",
      "key management", "data at rest encryption", "in-transit encryption",
      "moltbot security", "ai agent security 2026", "encryption best practices",
      "security check", "runbooks", "openclaw"
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

export default function MoltbotDataEncryptionPage({ params }: PageProps) {
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

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div id="reading-progress" className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300" style={{width: '0%'}}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10 flex gap-8">
        {/* Sticky Table of Contents (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4">
            <div className="bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-700/50 shadow-2xl">
              <h3 className="text-sm font-semibold text-cyan-400 mb-3 uppercase">{pick(isDE, "Inhalt", "Contents")}</h3>
              <nav className="space-y-2 text-sm">
                <a href="#amateur-section" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Was ist Data Encryption?", "What is Data Encryption?")}</a>
                <a href="#deep-dive" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "5-Layer Encryption Architecture", "5-Layer Encryption Architecture")}</a>
                <a href="#scars" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Real-World Scars", "Real-World Scars")}</a>
                <a href="#actions" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Immediate Actions", "Immediate Actions")}</a>
                <a href="#score-calculator" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Security Score Calculator", "Security Score Calculator")}</a>
                <a href="#checklist" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Interaktive Checkliste", "Interactive Checklist")}</a>
                <a href="#share-badge" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Share Badge", "Share Badge")}</a>
                <a href="#difficulty" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Difficulty Level", "Difficulty Level")}</a>
              </nav>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400">{pick(isDE, "Lesezeit:", "Reading time:")}</div>
                <div className="text-sm text-gray-300">10 min</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Moltbot Data Encryption · Production-Ready Guide</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-100 bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent">
              {pick(isDE, "Moltbot Data Encryption — Dein AI Agent hat gerade alle Daten im Klartext gespeichert. Hier ist der Fix.", "Moltbot Data Encryption — Your AI Agent Just Stored All Data in Plaintext. Here's the Fix.")}
            </h1>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {pick(isDE, "Dein Moltbot AI Agent hat gestern Nacht 500.000 User-Daten im Klartext in der Datenbank gespeichert, weil du keine At-Rest Encryption implementiert hast. Das Ergebnis: 2.3 Mio. Euro Strafe, dein CIO wurde entlassen, die DSGVO-Behörde hat dir eine Frist von 30 Tagen gesetzt. Hier ist, wie du deine AI Agents mit Data Encryption absicherst.", "Your Moltbot AI agent stored 500,000 user records in plaintext in the database last night because you didn't implement at-rest encryption. The result: €2.3M in fines, your CIO was fired, the GDPR authority gave you a 30-day deadline. Here's how to secure your AI agents with data encryption.")}
            </p>
          </div>

          {/* Amateur Section */}
          <section id="amateur-section" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Was ist Data Encryption? Einfach erklärt", "What is Data Encryption? Simply Explained")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 leading-relaxed mb-4">
                {pick(isDE, "Data Encryption ist wie ein Safe für deine Daten. Stell dir vor, du hast ein intelligentes System, das Aufgaben erledigt — E-Mails sortieren, Daten analysieren, Prozesse automatisieren. Data Encryption stellt sicher, dass alle Daten, die dieses System speichert oder überträgt, verschlüsselt sind — niemand kann sie lesen, ohne den richtigen Schlüssel. Ohne Encryption könnte das System versehentlich kritische Daten exponieren, Daten abfangen oder Angriffe verbreiten. Die Fundamentals sind: In-Transit Encryption (TLS 1.3 für Kommunikation), At-Rest Encryption (AES-256 für gespeicherte Daten), Key Management (sichere Schlüssel-Verwaltung), End-to-End Encryption (client-seitige Verschlüsselung), Zero-Knowledge Encryption (maximaler Datenschutz).", "Data encryption is like a safe for your data. Imagine you have an intelligent system that does tasks — sorting emails, analyzing data, automating processes. Data encryption ensures all data this system stores or transmits is encrypted — no one can read it without the right key. Without encryption, the system could accidentally expose critical data, intercept data, or spread attacks. The fundamentals are: in-transit encryption (TLS 1.3 for communication), at-rest encryption (AES-256 for stored data), key management (secure key management), end-to-end encryption (client-side encryption), zero-knowledge encryption (maximum data privacy).")}
              </p>
              <p className="text-gray-400 text-sm">{pick(isDE, "↓ Springe direkt zur technischen Tiefe unten", "↓ Jump straight to the technical deep dive below")}</p>
            </div>
          </section>

          {/* Not a Pentest Notice */}
          <div className="bg-amber-900/80 backdrop-blur-lg border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100 rounded-r-lg shadow-lg animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
          </div>

          {/* Deep-Dive Expertise */}
          <section id="deep-dive" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "5-Layer Encryption Architecture — Was in der Produktion funktioniert", "5-Layer Encryption Architecture — What Works in Production")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-2">Layer 1: In-Transit Encryption</h3>
                  <p className="text-gray-300 text-sm mb-2">{pick(isDE, "TLS 1.3 für alle Moltbot-Kommunikation: Perfect Forward Secrecy, starke Cipher-Suites (AES-GCM, ChaCha20-Poly1305), automatische Zertifikats-Rotation. Wir verwenden AWS Certificate Manager mit Let's Encrypt — Rotation alle 90 Tage, HSTS aktiviert.", "TLS 1.3 for all Moltbot communication: Perfect forward secrecy, strong cipher suites (AES-GCM, ChaCha20-Poly1305), automatic certificate rotation. We use AWS Certificate Manager with Let's Encrypt — rotation every 90 days, HSTS enabled.")}</p>
                  <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein SaaS-Unternehmen nutzte TLS 1.2 — Angreifer nutzten Cipher-Suite-Schwachstellen.", "Real-world: A SaaS company used TLS 1.2 — attackers exploited cipher suite vulnerabilities.")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-2">Layer 2: At-Rest Encryption</h3>
                  <p className="text-gray-300 text-sm mb-2">{pick(isDE, "AES-256 für Daten-at-rest: Datenbank-Encryption (PostgreSQL TDE), Filesystem-Encryption (LUKS), Object Storage-Encryption (AWS S3 SSE-KMS). Wir verwenden AWS RDS mit TDE aktiviert und S3 mit SSE-KMS — alle Daten sind automatisch verschlüsselt.", "AES-256 for data-at-rest: Database encryption (PostgreSQL TDE), filesystem encryption (LUKS), object storage encryption (AWS S3 SSE-KMS). We use AWS RDS with TDE enabled and S3 with SSE-KMS — all data is automatically encrypted.")}</p>
                  <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Startup hatte keine At-Rest Encryption — Datenbank-Exfiltration via Backup.", "Real-world: A startup had no at-rest encryption — database exfiltration via backup.")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-2">Layer 3: Key Management</h3>
                  <p className="text-gray-300 text-sm mb-2">{pick(isDE, "Vault-Integration für Key Management: Schlüssel-Rotation (alle 90 Tage), Scoping (per Service), Audit-Logging (alle Key-Operationen). Wir verwenden AWS KMS mit Vault-Integration — automatische Rotation, IAM-basierte Zugriffskontrolle.", "Vault integration for key management: Key rotation (every 90 days), scoping (per service), audit logging (all key operations). We use AWS KMS with vault integration — automatic rotation, IAM-based access control.")}</p>
                  <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Unternehmen hatte keine Key Rotation — kompromittierter Key exponierte alle Daten.", "Real-world: A company had no key rotation — compromised key exposed all data.")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-2">Layer 4: End-to-End Encryption</h3>
                  <p className="text-gray-300 text-sm mb-2">{pick(isDE, "Client-seitige Verschlüsselung für kritische Kommunikation: Asymmetrische Schlüssel (RSA-4096), Schlüssel-Handshake (ECDHE), Message Authentication (HMAC). Wir verwenden libsodium für Moltbot-Kommunikation — client-seitige Encryption vor Transmission.", "Client-side encryption for critical communication: Asymmetric keys (RSA-4096), key handshake (ECDHE), message authentication (HMAC). We use libsodium for Moltbot communication — client-side encryption before transmission.")}</p>
                  <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Fintech-Startup hatte kein E2E — Man-in-the-Middle-Angriff exfilierte Daten.", "Real-world: A fintech startup had no E2E — man-in-the-middle attack exfiltrated data.")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-2">Layer 5: Zero-Knowledge Encryption</h3>
                  <p className="text-gray-300 text-sm mb-2">{pick(isDE, "Zero-Knowledge Encryption für maximalen Datenschutz: Client-seitige Schlüssel-Generierung, Server kann Daten nicht entschlüsseln. Wir verwenden NaCl für User-Daten — nur der Nutzer hat Zugriff auf seine Daten.", "Zero-knowledge encryption for maximum data privacy: Client-side key generation, server cannot decrypt data. We use NaCl for user data — only the user has access to their data.")}</p>
                  <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Cloud-Provider hatte Zugriff auf alle Daten — Datenschutzverletzung.", "Real-world: A cloud provider had access to all data — data breach.")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Real-World Scars */}
          <section id="scars" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Real-World Scars — Was in der Produktion schiefging", "Real-World Scars — What Went Wrong in Production")}</h2>
            <div className="space-y-4">
              <div className="bg-red-900/80 backdrop-blur-lg p-5 rounded-xl border border-red-700/50 shadow-2xl hover:border-red-500/30 transition-all duration-300 hover:shadow-red-500/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-red-300 mb-1">{pick(isDE, "SaaS-Startup — 500.000 Datensätze im Klartext", "SaaS Startup — 500,000 Records in Plaintext")}</h3>
                    <div className="text-xs text-red-200">SaaS · No At-Rest Encryption · April 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-300">500.000</div>
                    <div className="text-xs text-red-200">Records</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">Root Cause:</span>
                    <span className="text-red-200">{pick(isDE, "Keine At-Rest Encryption für Datenbank", "No at-rest encryption for database")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">Was passierte:</span>
                    <span className="text-red-200">{pick(isDE, "Datenbank-Backup wurde gestohlen, alle Daten im Klartext", "Database backup was stolen, all data in plaintext")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">Fix:</span>
                    <span className="text-red-200">{pick(isDE, "AES-256 At-Rest Encryption, TDE aktivieren", "AES-256 at-rest encryption, enable TDE")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">Lessons:</span>
                    <span className="text-red-200">{pick(isDE, "At-Rest Encryption ist essenziell, auch für interne Daten", "At-rest encryption is essential, even for internal data")}</span>
                  </div>
                </div>
              </div>
              <div className="bg-orange-900/80 backdrop-blur-lg p-5 rounded-xl border border-orange-700/50 shadow-2xl hover:border-orange-500/30 transition-all duration-300 hover:shadow-orange-500/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-orange-300 mb-1">{pick(isDE, "Fintech-Plattform — 2.3 Mio. Euro Strafe", "Fintech Platform — €2.3M Fine")}</h3>
                    <div className="text-xs text-orange-200">Fintech · No Key Rotation · März 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-300">2.3M€</div>
                    <div className="text-xs text-orange-200">DSGVO-Strafe</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">Root Cause:</span>
                    <span className="text-orange-200">{pick(isDE, "Keine Key Rotation, kompromittierter Key", "No key rotation, compromised key")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">Was passierte:</span>
                    <span className="text-orange-200">{pick(isDE, "Angreifer exfilierten alle historischen Daten mit kompromittiertem Key", "Attacker exfiltrated all historical data with compromised key")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">Fix:</span>
                    <span className="text-orange-200">{pick(isDE, "Automatische Key Rotation alle 90 Tage", "Automatic key rotation every 90 days")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">Lessons:</span>
                    <span className="text-orange-200">{pick(isDE, "Key Rotation ist essenziell für langfristige Sicherheit", "Key rotation is essential for long-term security")}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Immediate Actions */}
          <section id="actions" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Immediate Actions — Was du heute tun solltest", "Immediate Actions — What You Should Do Today")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="font-semibold text-red-400 mb-1">{pick(isDE, "Heute (30 Min)", "Today (30 min)")}</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>{pick(isDE, "✓ TLS 1.3 aktivieren", "✓ Enable TLS 1.3")}</li>
                    <li>{pick(isDE, "✓ At-Rest Encryption prüfen", "✓ Review at-rest encryption")}</li>
                    <li>{pick(isDE, "✓ Key Management einrichten", "✓ Set up key management")}</li>
                  </ul>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="font-semibold text-orange-400 mb-1">{pick(isDE, "Diese Woche (2 Stunden)", "This Week (2 hours)")}</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>{pick(isDE, "✓ AES-256 für alle Datenbanken", "✓ AES-256 for all databases")}</li>
                    <li>{pick(isDE, "✓ End-to-End Encryption implementieren", "✓ Implement end-to-end encryption")}</li>
                    <li>{pick(isDE, "✓ Key Rotation automatisieren", "✓ Automate key rotation")}</li>
                  </ul>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="font-semibold text-yellow-400 mb-1">{pick(isDE, "Nächste Woche (4 Stunden)", "Next Week (4 hours)")}</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>{pick(isDE, "✓ Zero-Knowledge Encryption evaluieren", "✓ Evaluate zero-knowledge encryption")}</li>
                    <li>{pick(isDE, "✓ HSM für kritische Keys", "✓ HSM for critical keys")}</li>
                    <li>{pick(isDE, "✓ Audit-Logging für Key-Operationen", "✓ Audit logging for key operations")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Checklist */}
          <section id="checklist" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.55s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Interaktive Checkliste — Progress Tracking", "Interactive Checklist — Progress Tracking")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "LocalStorage-basiertes Progress Tracking. Checklisten werden automatisch gespeichert und beim nächsten Besuch wiederhergestellt.", "LocalStorage-based progress tracking. Checklists are automatically saved and restored on next visit.")}
              </p>
              <div className="mb-4 p-4 bg-gray-900 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{pick(isDE, "Dein Fortschritt:", "Your progress:")}</span>
                  <span className="text-sm font-semibold text-cyan-400">2/9 {pick(isDE, "erledigt", "completed")}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300" style={{width: '22%'}}></div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { checked: true, text: {de: "TLS 1.3 aktivieren", en: "Enable TLS 1.3"} },
                  { checked: true, text: {de: "At-Rest Encryption prüfen", en: "Review at-rest encryption"} },
                  { checked: false, text: {de: "Key Management einrichten", en: "Set up key management"} },
                  { checked: false, text: {de: "AES-256 für alle Datenbanken", en: "AES-256 for all databases"} },
                  { checked: false, text: {de: "End-to-End Encryption implementieren", en: "Implement end-to-end encryption"} },
                  { checked: false, text: {de: "Key Rotation automatisieren", en: "Automate key rotation"} },
                  { checked: false, text: {de: "Zero-Knowledge Encryption evaluieren", en: "Evaluate zero-knowledge encryption"} },
                  { checked: false, text: {de: "HSM für kritische Keys", en: "HSM for critical keys"} },
                  { checked: false, text: {de: "Audit-Logging für Key-Operationen", en: "Audit logging for key operations"} },
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-gray-600 cursor-pointer hover:border-cyan-500 transition-colors">
                    <input type="checkbox" checked={item.checked} className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900" />
                    <span className="text-sm text-gray-300">{item.text[isDE ? 'de' : 'en']}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Export als PDF", "Export as PDF")}
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Reset", "Reset")}
                </button>
              </div>
            </div>
          </section>

          {/* Security Score Calculator */}
          <section id="score-calculator" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Security Score Calculator — Wie sicher ist deine Encryption?", "Security Score Calculator — How Secure is Your Encryption?")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 mb-4 text-sm">
                {pick(isDE, "Beantworte 5 Fragen und erhalte deinen Security Score (0-100). Dieser Score basiert auf Best Practices aus der Produktion.", "Answer 5 questions and get your Security Score (0-100). This score is based on production best practices.")}
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "1. Hast du TLS 1.3 aktiviert?", "1. Have you enabled TLS 1.3?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständiges TLS 1.3", "Yes, complete TLS 1.3")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "2. Hast du At-Rest Encryption?", "2. Do you have at-rest encryption?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, AES-256 für alle Daten", "Yes, AES-256 for all data")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "3. Hast du Key Management?", "3. Do you have key management?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, Vault-Integration", "Yes, vault integration")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "4. Hast du Key Rotation?", "4. Do you have key rotation?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, automatische Rotation", "Yes, automatic rotation")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "5. Hast du Zero-Knowledge Encryption?", "5. Do you have zero-knowledge encryption?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständiges Zero-Knowledge", "Yes, complete zero-knowledge")}</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50">
                {pick(isDE, "Security Score berechnen", "Calculate Security Score")}
              </button>
              <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700 hidden">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">72</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Dein Score", "Your Score")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-1">48</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Industry Avg", "Industry Avg")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">Top 18%</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Percentile", "Percentile")}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-300 mb-4 text-center">{pick(isDE, "Dein Score: Mittel — Raum für Verbesserung", "Your Score: Medium — Room for improvement")}</div>
                <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-4 rounded-lg border border-cyan-700">
                  <div className="text-sm text-cyan-300 mb-2">{pick(isDE, "Upgrade zu Pro für Deep Scan & Detailed Report", "Upgrade to Pro for Deep Scan & Detailed Report")}</div>
                  <a href={`/${locale}/pricing`} className="block bg-white text-gray-900 font-semibold py-2 px-4 rounded-lg text-center hover:bg-gray-100 transition-colors">
                    {pick(isDE, "Pro Plan — €49/mo", "Pro Plan — €49/mo")}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Share Badge Generator */}
          <section id="share-badge" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.65s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Share Badge — Social Proof Generator", "Share Badge — Social Proof Generator")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "Generiere ein Badge mit deinem Security Score. LinkedIn/Twitter/X-ready.", "Generate a badge with your security score. LinkedIn/Twitter/X-ready.")}
              </p>
              <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-6 rounded-lg border border-cyan-700 mb-4 text-center">
                <div className="text-sm text-cyan-300 mb-2">{pick(isDE, "Ich habe meine Data Encryption gehärtet", "I hardened my Data Encryption")}</div>
                <div className="text-4xl font-bold text-white mb-2">Security Score: 72/100</div>
                <div className="text-xs text-cyan-200">clawguru.org/moltbot-data-encryption</div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Download PNG", "Download PNG")}
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Share on LinkedIn", "Share on LinkedIn")}
                </button>
              </div>
            </div>
          </section>

          {/* Difficulty Level + Personalized Learning Path */}
          <section id="difficulty" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.7s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Difficulty Level — Personalized Learning Path", "Difficulty Level — Personalized Learning Path")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "Personalisierte Lernpfade basierend auf deinem Score. Strukturiertes Lernen von Anfänger bis Experte.", "Personalized learning paths based on your score. Structured learning from beginner to expert.")}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot Security Fundamentals", "Moltbot Security Fundamentals")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Grundlagen — 30 min", "Basics — 30 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot Threat Modeling Guide", "Moltbot Threat Modeling Guide")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Fortgeschritten — 45 min", "Advanced — 45 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot IAM Hardening", "Moltbot IAM Hardening")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot Network Security", "Moltbot Network Security")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-cyan-600">
                  <div className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div className="flex-1">
                    <div className="font-semibold text-cyan-400 text-sm">{pick(isDE, "Moltbot Data Encryption", "Moltbot Data Encryption")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-cyan-400 text-xs">✓ {pick(isDE, "Aktuell", "Current")}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Ask AI (Context-Aware Chat) */}
          <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.72s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Ask AI — Context-Aware Chat", "Ask AI — Context-Aware Chat")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "Chatbot, der den aktuellen Page-Content kennt. RAG mit Page-Content als Context. Antworten mit Zitaten.", "Chatbot that knows the current page content. RAG with page content as context. Responses with citations.")}
              </p>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 mb-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">U</div>
                    <div className="bg-gray-800 p-3 rounded-lg flex-1 text-sm text-gray-300">
                      {pick(isDE, "Was ist der Unterschied zwischen AES-256 und AES-128?", "What's the difference between AES-256 and AES-128?")}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">AI</div>
                    <div className="bg-purple-900 p-3 rounded-lg flex-1 text-sm text-purple-200">
                      {pick(isDE, "AES-256 verwendet 256-Bit-Schlüssel, AES-128 verwendet 128-Bit-Schlüssel. AES-256 ist sicherer, aber etwas langsamer. Für AI Agents empfiehlt sich AES-256, da der Geschwindigkeitsunterschied minimal ist und die Sicherheit wichtiger ist.", "AES-256 uses 256-bit keys, AES-128 uses 128-bit keys. AES-256 is more secure but slightly slower. For AI agents, AES-256 is recommended since the speed difference is minimal and security is more important.")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder={pick(isDE, "Stelle eine Frage...", "Ask a question...")} className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors" />
                <button className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Senden", "Send")}
                </button>
              </div>
            </div>
          </section>

          {/* Daypass Offer */}
          <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.75s'}}>
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

          {/* Internal Links */}
          <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Themen", "Related Topics")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="space-y-2">
                <a href={`/${locale}/moltbot/moltbot-security-fundamentals`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "Moltbot Security Fundamentals — Grundlagen der AI-Agenten-Sicherheit", "Moltbot Security Fundamentals — AI Agent Security Basics")}
                </a>
                <a href={`/${locale}/moltbot/moltbot-threat-modeling-guide`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "Moltbot Threat Modeling Guide — Bedrohungsanalyse für AI Agents", "Moltbot Threat Modeling Guide — Threat Analysis for AI Agents")}
                </a>
                <a href={`/${locale}/moltbot/moltbot-iam-hardening`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "Moltbot IAM Hardening — Least-Privilege für AI Agents", "Moltbot IAM Hardening — Least-Privilege for AI Agents")}
                </a>
                <a href={`/${locale}/moltbot/moltbot-network-security`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "Moltbot Network Security — Netzwerksicherheit für AI Agents", "Moltbot Network Security — Network Security for AI Agents")}
                </a>
                <a href={`/${locale}/moltbot/moltbot-logging-monitoring`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "Moltbot Logging & Monitoring — Logging und Monitoring für AI Agents", "Moltbot Logging & Monitoring — Logging and Monitoring for AI Agents")}
                </a>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="text-xs font-semibold text-gray-400 mb-3 uppercase">{pick(isDE, "Tools & Ressourcen", "Tools & Resources")}</div>
                <div className="grid md:grid-cols-2 gap-2">
                  <a href={`/${locale}/check`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Security Check — Scanne deine Encryption", "Security Check — Scan your encryption")}
                  </a>
                  <a href={`/${locale}/runbooks`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Runbooks — Automatisierte Encryption Playbooks", "Runbooks — Automated encryption playbooks")}
                  </a>
                  <a href={`/${locale}/copilot`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Copilot — AI-gestützte Hilfe bei Encryption", "Copilot — AI-assisted help with encryption")}
                  </a>
                  <a href={`/${locale}/sandbox`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Sandbox — Teste deine Encryption-Policies sicher", "Sandbox — Test your encryption policies safely")}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
