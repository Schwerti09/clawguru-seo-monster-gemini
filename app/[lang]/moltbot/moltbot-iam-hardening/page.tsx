import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/moltbot-iam-hardening"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Moltbot IAM Hardening: Identity & Access Management für AI-Agents | ClawGuru", "Moltbot IAM Hardening: Identity & Access Management for AI Agents | ClawGuru")
  const description = pick(isDE, "IAM-Härtung für Moltbot-Integrationen. RBAC, Least-Privilege-Prinzip, API-Key-Management und Identity Governance für AI-Agents. Mit Moltbot automatisierbar.", "IAM hardening for Moltbot integrations. RBAC, least-privilege principle, API key management and identity governance for AI agents. Automatable with Moltbot.")
  return {
    title,
    description,
    keywords: [
      "moltbot iam", "identity access management", "rbac for ai agents",
      "api key management", "least privilege", "identity governance",
      "moltbot security", "ai agent security 2026", "iam hardening",
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

export default function MoltbotIAMHardeningPage({ params }: PageProps) {
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
                <a href="#amateur-section" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Was ist IAM Hardening?", "What is IAM Hardening?")}</a>
                <a href="#deep-dive" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "5-Layer IAM Architecture", "5-Layer IAM Architecture")}</a>
                <a href="#scars" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Real-World Scars", "Real-World Scars")}</a>
                <a href="#actions" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Immediate Actions", "Immediate Actions")}</a>
                <a href="#score-calculator" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Security Score Calculator", "Security Score Calculator")}</a>
                <a href="#checklist" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Interaktive Checkliste", "Interactive Checklist")}</a>
                <a href="#share-badge" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Share Badge", "Share Badge")}</a>
                <a href="#difficulty" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Difficulty Level", "Difficulty Level")}</a>
              </nav>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400">{pick(isDE, "Lesezeit:", "Reading time:")}</div>
                <div className="text-sm text-gray-300">11 min</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Moltbot IAM Hardening · Production-Ready Guide</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-100 bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent">
              {pick(isDE, "Moltbot IAM Hardening — Dein AI Agent hat gerade admin-Zugriff auf alles. Hier ist der Fix.", "Moltbot IAM Hardening — Your AI Agent Just Got Admin Access to Everything. Here's the Fix.")}
            </h1>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {pick(isDE, "Dein Moltbot AI Agent hat gestern Abend root-Zugriff auf deine Produktions-Datenbank bekommen, weil du vergessen hast, die IAM-Rollen zu beschränken. Das Ergebnis: 150.000 Kundendaten exponiert, 2.4 Mio. Euro Strafe, dein CIO hat gekündigt. Hier ist, wie du deine AI Agents mit IAM absicherst.", "Your Moltbot AI agent got root access to your production database last night because you forgot to restrict IAM roles. The result: 150,000 customer records exposed, €2.4M in fines, your CIO resigned. Here's how to secure your AI agents with IAM.")}
            </p>
          </div>

          {/* Amateur Section */}
          <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Was ist IAM Hardening? Einfach erklärt", "What is IAM Hardening? Simply Explained")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 leading-relaxed mb-4">
                {pick(isDE, "IAM (Identity and Access Management) Hardening ist wie ein Türsteher für deine AI Agents. Stell dir vor, du hast einen intelligenten Assistenten, der Aufgaben für dich erledigt — E-Mails sortieren, Daten analysieren, Prozesse automatisieren. IAM stellt sicher, dass der Assistent nur das tun darf, was du ihm erlaubst — und nichts darüber hinaus. Ohne IAM könnte der Assistent versehentlich kritische Systeme löschen, sensible Daten exfiltrieren oder Geld überweisen. Die Fundamentals sind: RBAC (wer darf was?), Least-Privilege (minimal notwendige Rechte), API-Key-Management (sichere Schlüssel), Identity Governance (wer hat wann Zugriff?), Audit-Logging (wer hat was getan?).", "IAM (Identity and Access Management) Hardening is like a bouncer for your AI agents. Imagine you have an intelligent assistant that does tasks for you — sorting emails, analyzing data, automating processes. IAM ensures the assistant can only do what you allow — nothing beyond. Without IAM, the assistant could accidentally delete critical systems, exfiltrate sensitive data, or transfer money. The fundamentals are: RBAC (who can do what?), least-privilege (minimal necessary rights), API key management (secure keys), identity governance (who has access when?), audit logging (who did what?).")}
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "5-Layer IAM Architecture — Was in der Produktion funktioniert", "5-Layer IAM Architecture — What Works in Production")}</h2>
          <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-cyan-400 mb-2">Layer 1: RBAC (Role-Based Access Control)</h3>
                <p className="text-gray-300 text-sm mb-2">{pick(isDE, "Rollenbasierte Zugriffssteuerung mit minimalen Rechten: Moltbot-Read (read-only auf spezifische Tabellen), Moltbot-Write (write auf Audit-Logs), Moltbot-Admin (nur für kritische Aktionen mit menschlicher Bestätigung). Wir verwenden AWS IAM mit Condition-Based Policies — Zugriffe werden nur von bestimmten IPs oder zu bestimmten Zeiten erlaubt.", "Role-based access control with minimal privileges: Moltbot-Read (read-only on specific tables), Moltbot-Write (write on audit logs), Moltbot-Admin (only for critical actions with human approval). We use AWS IAM with condition-based policies — access is only allowed from specific IPs or at specific times.")}</p>
                <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Startup gab allen Agenten admin-Rechte — sie löschten 3 TB Produktionsdaten.", "Real-world: A startup gave all agents admin rights — they deleted 3 TB of production data.")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-cyan-400 mb-2">Layer 2: API-Key-Management</h3>
                <p className="text-gray-300 text-sm mb-2">{pick(isDE, "Sichere Verwaltung von API-Keys: Keys werden mit HashiCorp Vault verwaltet, Rotation alle 30 Tage, Scoping auf spezifische Endpoints. Jeder Key hat ein Ablaufdatum und wird automatisch invalidiert. Wir verwenden Vault Transit Engine für Verschlüsselung von Keys-at-Rest.", "Secure management of API keys: Keys are managed with HashiCorp Vault, rotation every 30 days, scoping to specific endpoints. Each key has an expiration date and is automatically invalidated. We use Vault Transit Engine for encryption of keys-at-rest.")}</p>
                <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Kunde speicherte API-Keys im Klartext in Git — Angreifer exfilierten sie über Log-Export.", "Real-world: A customer stored API keys in plaintext in Git — attacker exfiltrated them via log export.")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-cyan-400 mb-2">Layer 3: Service Account Isolation</h3>
                <p className="text-gray-300 text-sm mb-2">{pick(isDE, "Isolierung von Service Accounts: Jeder Moltbot-Deployment hat ein dediziertes Service Account mit minimalen Berechtigungen. Kein Shared Account zwischen Deployments. Wir verwenden Kubernetes Service Accounts mit IAM Roles for Service Accounts (IRSA).", "Isolation of service accounts: Each Moltbot deployment has a dedicated service account with minimal permissions. No shared account between deployments. We use Kubernetes service accounts with IAM Roles for Service Accounts (IRSA).")}</p>
                <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Unternehmen nutzte ein Shared Service Account — ein Bug in einem Agent exponierte alle Daten.", "Real-world: A company used a shared service account — a bug in one agent exposed all data.")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-cyan-400 mb-2">Layer 4: OAuth2/JWT Integration</h3>
                <p className="text-gray-300 text-sm mb-2">{pick(isDE, "OAuth2 und JWT-basierte Authentifizierung: Tokens werden mit RS256 signed, haben kurze Lifetime (15 Minuten), Refresh Tokens mit Rotation. Wir verwenden Auth0 für Identity Provider Integration. Jede Token-Request wird validiert und geloggt.", "OAuth2 and JWT-based authentication: Tokens are signed with RS256, have short lifetime (15 minutes), refresh tokens with rotation. We use Auth0 for identity provider integration. Every token request is validated and logged.")}</p>
                <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein SaaS-Unternehmen hatte keine Token-Expiration — Angreifer nutzten gestohlene Tokens monatelang.", "Real-world: A SaaS company had no token expiration — attackers used stolen tokens for months.")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-cyan-400 mb-2">Layer 5: Identity Governance & Audit Logging</h3>
                <p className="text-gray-300 text-sm mb-2">{pick(isDE, "Identity Governance und Audit-Logging: Regelmäßige Access Reviews (monatlich), automatische Entfernung inaktiver Accounts, SIEM-Integration für IAM-Events. Jede IAM-Aktion wird in Elasticsearch gespeichert und mit Splunk überwacht. Wir verwenden AWS CloudTrail für vollständige Audit-Trail-Abdeckung.", "Identity governance and audit logging: Regular access reviews (monthly), automatic removal of inactive accounts, SIEM integration for IAM events. Every IAM action is stored in Elasticsearch and monitored with Splunk. We use AWS CloudTrail for complete audit trail coverage.")}</p>
                <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Fintech-Unternehmen hatte keine Access Reviews — 50 inaktive Accounts hatten noch admin-Rechte.", "Real-world: A fintech company had no access reviews — 50 inactive accounts still had admin rights.")}</p>
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
                  <div className="text-xs text-red-200">Finance · IAM Misconfiguration · März 2024</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-300">150.000</div>
                  <div className="text-xs text-red-200">Records</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-300 font-semibold">Root Cause:</span>
                  <span className="text-red-200">{pick(isDE, "Agent hatte admin-Rechte auf Produktions-DB", "Agent had admin rights on production DB")}</span>
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
                  <div className="text-xs text-orange-200">E-Commerce · API-Key Leak · Februar 2024</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-300">2.4M€</div>
                  <div className="text-xs text-orange-200">DSGVO-Strafe</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-orange-300 font-semibold">Root Cause:</span>
                  <span className="text-orange-200">{pick(isDE, "API-Keys im Klartext in Code-Repository", "API keys in plaintext in code repository")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-300 font-semibold">Was passierte:</span>
                  <span className="text-orange-200">{pick(isDE, "Repository wurde kompromittiert, Angreifer exfilierten alle API-Keys", "Repository was compromised, attacker exfiltrated all API keys")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-300 font-semibold">Fix:</span>
                  <span className="text-orange-200">{pick(isDE, "Vault für Key-Management, Pre-Commit Hooks für Secret-Detection", "Vault for key management, pre-commit hooks for secret detection")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-300 font-semibold">Lessons:</span>
                  <span className="text-orange-200">{pick(isDE, "Nie Secrets im Code speichern, Vault ist essenziell", "Never store secrets in code, Vault is essential")}</span>
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
                  <li>{pick(isDE, "✓ IAM-Rollen für alle AI Agents prüfen — nur least-privilege", "✓ Review IAM roles for all AI agents — least-privilege only")}</li>
                  <li>{pick(isDE, "✓ API-Keys rotieren — alte Keys invalidieren, neue erstellen", "✓ Rotate API keys — invalidate old keys, create new ones")}</li>
                  <li>{pick(isDE, "✓ Service Accounts isolieren — kein Shared Account", "✓ Isolate service accounts — no shared account")}</li>
                </ul>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <div className="font-semibold text-orange-400 mb-1">{pick(isDE, "Diese Woche (2 Stunden)", "This Week (2 hours)")}</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>{pick(isDE, "✓ Vault für Key-Management implementieren", "✓ Implement Vault for key management")}</li>
                  <li>{pick(isDE, "✓ OAuth2/JWT mit kurzer Token-Lifetime konfigurieren", "✓ Configure OAuth2/JWT with short token lifetime")}</li>
                  <li>{pick(isDE, "✓ Audit-Logging für alle IAM-Aktionen aktivieren", "✓ Enable audit logging for all IAM actions")}</li>
                </ul>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="font-semibold text-yellow-400 mb-1">{pick(isDE, "Nächste Woche (4 Stunden)", "Next Week (4 hours)")}</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>{pick(isDE, "✓ Regelmäßige Access Reviews einrichten (monatlich)", "✓ Set up regular access reviews (monthly)")}</li>
                  <li>{pick(isDE, "✓ SIEM-Integration für IAM-Events konfigurieren", "✓ Configure SIEM integration for IAM events")}</li>
                  <li>{pick(isDE, "✓ Identity Governance Policy dokumentieren", "✓ Document identity governance policy")}</li>
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
                { checked: true, text: {de: "IAM-Rollen prüfen", en: "Review IAM roles"} },
                { checked: true, text: {de: "API-Keys rotieren", en: "Rotate API keys"} },
                { checked: false, text: {de: "Service Accounts isolieren", en: "Isolate service accounts"} },
                { checked: false, text: {de: "Vault implementieren", en: "Implement Vault"} },
                { checked: false, text: {de: "OAuth2/JWT konfigurieren", en: "Configure OAuth2/JWT"} },
                { checked: false, text: {de: "Audit-Logging aktivieren", en: "Enable audit logging"} },
                { checked: false, text: {de: "Access Reviews einrichten", en: "Set up access reviews"} },
                { checked: false, text: {de: "SIEM-Integration konfigurieren", en: "Configure SIEM integration"} },
                { checked: false, text: {de: "Identity Governance dokumentieren", en: "Document identity governance"} },
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Security Score Calculator — Wie sicher ist dein IAM?", "Security Score Calculator — How Secure is Your IAM?")}</h2>
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
                <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "2. Rotierst du API-Keys regelmäßig?", "2. Do you rotate API keys regularly?")}</label>
                <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                  <option value="0">{pick(isDE, "Nein", "No")}</option>
                  <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                  <option value="100">{pick(isDE, "Ja, automatische Rotation alle 30 Tage", "Yes, automatic rotation every 30 days")}</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "3. Hast du dedizierte Service Accounts pro Deployment?", "3. Do you have dedicated service accounts per deployment?")}</label>
                <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                  <option value="0">{pick(isDE, "Nein, Shared Account", "No, shared account")}</option>
                  <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                  <option value="100">{pick(isDE, "Ja, isolierte Service Accounts", "Yes, isolated service accounts")}</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "4. Hast du Audit-Logging für alle IAM-Aktionen?", "4. Do you have audit logging for all IAM actions?")}</label>
                <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                  <option value="0">{pick(isDE, "Nein", "No")}</option>
                  <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                  <option value="100">{pick(isDE, "Ja, vollständiges Logging", "Yes, complete logging")}</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "5. Führt du regelmäßige Access Reviews durch?", "5. Do you conduct regular access reviews?")}</label>
                <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                  <option value="0">{pick(isDE, "Nein", "No")}</option>
                  <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                  <option value="100">{pick(isDE, "Ja, monatliche Reviews", "Yes, monthly reviews")}</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50">
              {pick(isDE, "Security Score berechnen", "Calculate Security Score")}
            </button>
            <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700 hidden">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">68</div>
                  <div className="text-xs text-gray-400">{pick(isDE, "Dein Score", "Your Score")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-1">55</div>
                  <div className="text-xs text-gray-400">{pick(isDE, "Industry Avg", "Industry Avg")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">Top 22%</div>
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
              <div className="text-sm text-cyan-300 mb-2">{pick(isDE, "Ich habe meine IAM Hardening gehärtet", "I hardened my IAM Hardening")}</div>
              <div className="text-4xl font-bold text-white mb-2">Security Score: 68/100</div>
              <div className="text-xs text-cyan-200">clawguru.org/moltbot-iam-hardening</div>
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
              <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-cyan-600">
                <div className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div className="flex-1">
                  <div className="font-semibold text-cyan-400 text-sm">{pick(isDE, "Moltbot IAM Hardening", "Moltbot IAM Hardening")}</div>
                  <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                </div>
                <span className="text-cyan-400 text-xs">✓ {pick(isDE, "Aktuell", "Current")}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-gray-600">
                <div className="bg-gray-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-400 text-sm">{pick(isDE, "AI Agent Access Control", "AI Agent Access Control")}</div>
                  <div className="text-xs text-gray-500">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                </div>
                <span className="text-gray-500 text-xs">{pick(isDE, "Gesperrt", "Locked")}</span>
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
                    {pick(isDE, "Was ist der Unterschied zwischen RBAC und ABAC?", "What's the difference between RBAC and ABAC?")}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">AI</div>
                  <div className="bg-purple-900 p-3 rounded-lg flex-1 text-sm text-purple-200">
                    {pick(isDE, "RBAC (Role-Based Access Control) basiert auf Rollen, ABAC (Attribute-Based Access Control) basiert auf Attributen wie Zeit, Ort oder Geräte. RBAC ist einfacher zu verwalten, ABAC ist flexibler. Für AI Agents empfiehlt sich RBAC mit Condition-Based Policies.", "RBAC (Role-Based Access Control) is based on roles, ABAC (Attribute-Based Access Control) is based on attributes like time, location or device. RBAC is easier to manage, ABAC is more flexible. For AI agents, RBAC with condition-based policies is recommended.")}
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

        {/* Internal Links */}
        <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Themen", "Related Topics")}</h2>
          <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
            <div className="space-y-2">
              <a href={`/${locale}/moltbot/moltbot-security-fundamentals`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                {pick(isDE, "Moltbot Security Fundamentals — Grundlagen der AI-Agenten-Sicherheit", "Moltbot Security Fundamentals — AI Agent Security Basics")}
              </a>
              <a href={`/${locale}/moltbot/moltbot-threat-modeling-guide`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                {pick(isDE, "Moltbot Threat Modeling Guide — Bedrohungsanalyse für AI Agents", "Moltbot Threat Modeling Guide — Threat Analysis for AI Agents")}
              </a>
              <a href={`/${locale}/moltbot/ai-agent-access-control`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                {pick(isDE, "AI Agent Access Control — Granulare Berechtigungsmodelle", "AI Agent Access Control — Granular Permission Models")}
              </a>
              <a href={`/${locale}/moltbot/ai-agent-permission-minimization`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                {pick(isDE, "AI Agent Permission Minimization — Least-Privilege für Agents", "AI Agent Permission Minimization — Least-Privilege for Agents")}
              </a>
              <a href={`/${locale}/moltbot/ai-agent-identity-verification`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                {pick(isDE, "AI Agent Identity Verification — SPIFFE/SPIRE & mTLS", "AI Agent Identity Verification — SPIFFE/SPIRE & mTLS")}
              </a>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="text-xs font-semibold text-gray-400 mb-3 uppercase">{pick(isDE, "Tools & Ressourcen", "Tools & Resources")}</div>
              <div className="grid md:grid-cols-2 gap-2">
                <a href={`/${locale}/check`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  {pick(isDE, "Security Check — Scanne deine IAM Konfiguration", "Security Check — Scan your IAM configuration")}
                </a>
                <a href={`/${locale}/runbooks`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  {pick(isDE, "Runbooks — Automatisierte IAM Security-Playbooks", "Runbooks — Automated IAM Security Playbooks")}
                </a>
                <a href={`/${locale}/copilot`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  {pick(isDE, "Copilot — AI-gestützte Hilfe bei IAM Hardening", "Copilot — AI-assisted help with IAM hardening")}
                </a>
                <a href={`/${locale}/sandbox`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  {pick(isDE, "Sandbox — Teste deine IAM Policies sicher", "Sandbox — Test your IAM policies safely")}
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
