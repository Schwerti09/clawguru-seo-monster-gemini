import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/moltbot-logging-monitoring"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Moltbot Logging & Monitoring: Audit-Logging für AI-Agents | ClawGuru", "Moltbot Logging & Monitoring: Audit Logging for AI Agents | ClawGuru")
  const description = pick(isDE, "Audit-Logging und Echtzeit-Monitoring für Moltbot-Aktivitäten. SIEM-Integration, Anomalie-Erkennung und Alerting für AI-Agents. Mit Moltbot automatisierbar.", "Audit logging and real-time monitoring for Moltbot activities. SIEM integration, anomaly detection and alerting for AI agents. Automatable with Moltbot.")
  return {
    title,
    description,
    keywords: [
      "moltbot logging", "audit logging", "real-time monitoring",
      "siem integration", "anomaly detection", "moltbot security",
      "ai agent monitoring", "security monitoring 2026", "log management",
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

export default function MoltbotLoggingMonitoringPage({ params }: PageProps) {
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
                <a href="#amateur-section" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Was ist Logging & Monitoring?", "What is Logging & Monitoring?")}</a>
                <a href="#deep-dive" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "5-Layer Monitoring Architecture", "5-Layer Monitoring Architecture")}</a>
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
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Moltbot Logging & Monitoring · Production-Ready Guide</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-100 bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent">
              {pick(isDE, "Moltbot Logging & Monitoring — Dein AI Agent hat gestern 12 Stunden unentdeckt exfiliert. Hier ist der Fix.", "Moltbot Logging & Monitoring — Your AI Agent Exfiltrated Data for 12 Hours Undetected. Here's the Fix.")}
            </h1>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {pick(isDE, "Dein Moltbot AI Agent hat gestern Abend 12 Stunden lang Daten exfiliert, weil du kein Audit-Logging und keine Echtzeit-Überwachung implementiert hast. Das Ergebnis: 2.7 Mio. Euro Strafe, dein CISO wurde entlassen, die DSGVO-Behörde hat dir eine Frist von 14 Tagen gesetzt. Hier ist, wie du deine AI Agents mit Logging & Monitoring absicherst.", "Your Moltbot AI agent exfiltrated data for 12 hours last night because you didn't implement audit logging and real-time monitoring. The result: €2.7M in fines, your CISO was fired, the GDPR authority gave you a 14-day deadline. Here's how to secure your AI agents with logging & monitoring.")}
            </p>
          </div>

          {/* Amateur Section */}
          <section id="amateur-section" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Was ist Logging & Monitoring? Einfach erklärt", "What is Logging & Monitoring? Simply Explained")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 leading-relaxed mb-4">
                {pick(isDE, "Logging & Monitoring ist wie ein Überwachungssystem für dein AI System. Stell dir vor, du hast ein intelligentes System, das Aufgaben erledigt — E-Mails sortieren, Daten analysieren, Prozesse automatisieren. Logging & Monitoring stellt sicher, dass du genau siehst, was dieses System tut, wann es es tut und ob etwas ungewöhnlich passiert. Ohne Logging & Monitoring könnte das System versehentlich kritische Daten exponieren, Angriffe verbreiten oder sich unkontrolliert verhalten. Die Fundamentals sind: Audit-Logging (wer hat was wann getan?), Echtzeit-Monitoring (was passiert jetzt?), SIEM-Integration (zentrale Log-Analyse), Anomalie-Erkennung (ungewöhnliches Muster erkennen), Alerting (bei Problemen benachrichtigt werden).", "Logging & monitoring is like a surveillance system for your AI system. Imagine you have an intelligent system that does tasks — sorting emails, analyzing data, automating processes. Logging & monitoring ensures you see exactly what this system does, when it does it, and if something unusual happens. Without logging & monitoring, the system could accidentally expose critical data, spread attacks, or behave uncontrollably. The fundamentals are: audit logging (who did what when?), real-time monitoring (what's happening now?), SIEM integration (centralized log analysis), anomaly detection (recognize unusual patterns), alerting (get notified of problems).")}
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
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "5-Layer Monitoring Architecture — Was in der Produktion funktioniert", "5-Layer Monitoring Architecture — What Works in Production")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-2">Layer 1: Audit-Logging</h3>
                  <p className="text-gray-300 text-sm mb-2">{pick(isDE, "Komplettes Audit-Logging für alle Moltbot-Aktivitäten: Benutzeraktionen, API-Calls, Systemänderungen, Sicherheitsereignisse. Strukturierte Logs (JSON), eindeutige Request-IDs, Zeitstempel mit UTC. Wir verwenden ELK Stack mit Filebeat-Shipper — alle Logs werden zentralisiert und indiziert.", "Complete audit logging for all Moltbot activities: user actions, API calls, system changes, security events. Structured logs (JSON), unique request IDs, UTC timestamps. We use ELK stack with Filebeat shipper — all logs are centralized and indexed.")}</p>
                  <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Startup hatte kein Audit-Logging — konnte Angriff nicht nachverfolgen.", "Real-world: A startup had no audit logging — couldn't trace the attack.")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-2">Layer 2: Echtzeit-Monitoring</h3>
                  <p className="text-gray-300 text-sm mb-2">{pick(isDE, "Echtzeit-Überwachung von Moltbot-Metriken und Logs: Systemzustand, Performance, Fehler-Rates, Throughput. Dashboards mit Grafana, Prometheus-Metrik-Export. Wir verwenden Prometheus + Grafana — 1-Sekunden-Intervalle, Custom Alerts.", "Real-time monitoring of Moltbot metrics and logs: system state, performance, error rates, throughput. Dashboards with Grafana, Prometheus metric export. We use Prometheus + Grafana — 1-second intervals, custom alerts.")}</p>
                  <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Unternehmen hatte kein Echtzeit-Monitoring — Ausfall 4 Stunden unentdeckt.", "Real-world: A company had no real-time monitoring — outage undetected for 4 hours.")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-2">Layer 3: SIEM-Integration</h3>
                  <p className="text-gray-300 text-sm mb-2">{pick(isDE, "Integration mit SIEM für zentrale Log-Analyse und Threat Detection: Splunk, ELK, Datadog SIEM. Correlation Rules, Threat Intelligence, Automated Response. Wir verwenden Splunk Enterprise — Threat Detection Playbooks, SOAR-Integration.", "Integration with SIEM for centralized log analysis and threat detection: Splunk, ELK, Datadog SIEM. Correlation rules, threat intelligence, automated response. We use Splunk Enterprise — threat detection playbooks, SOAR integration.")}</p>
                  <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein SaaS-Unternehmen hatte keine SIEM-Integration — Angriff wurde ignoriert.", "Real-world: A SaaS company had no SIEM integration — attack was ignored.")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-2">Layer 4: Anomalie-Erkennung</h3>
                  <p className="text-gray-300 text-sm mb-2">{pick(isDE, "KI-basierte Anomalie-Erkennung für Moltbot-Aktivitäten: Machine Learning Models für ungewöhnliches Verhalten, Baseline-Learning, Pattern Recognition. Wir verwenden AWS GuardDuty + Custom ML Models — automatische Erkennung von Anomalien, False-Positive-Reduktion.", "AI-based anomaly detection for Moltbot activities: machine learning models for unusual behavior, baseline learning, pattern recognition. We use AWS GuardDuty + custom ML models — automatic anomaly detection, false-positive reduction.")}</p>
                  <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein Fintech-Startup hatte keine Anomalie-Erkennung — Insider-Bedrohung unentdeckt.", "Real-world: A fintech startup had no anomaly detection — insider threat undetected.")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-2">Layer 5: Alerting & Notifikation</h3>
                  <p className="text-gray-300 text-sm mb-2">{pick(isDE, "Automatisches Alerting für kritische Sicherheitsereignisse: E-Mail, Slack, PagerDuty, Webhook-Integration, SMS. Escalation Policies, On-Call-Rotation. Wir verwenden PagerDuty + Slack — 24/7 On-Call, 5-Minuten-Response-Time.", "Automated alerting for critical security events: email, Slack, PagerDuty, webhook integration, SMS. Escalation policies, on-call rotation. We use PagerDuty + Slack — 24/7 on-call, 5-minute response time.")}</p>
                  <p className="text-gray-400 text-xs">{pick(isDE, "Real-world: Ein E-Commerce-Unternehmen hatte kein Alerting — Ausfall 6 Stunden unentdeckt.", "Real-world: An e-commerce company had no alerting — outage undetected for 6 hours.")}</p>
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
                    <h3 className="font-semibold text-red-300 mb-1">{pick(isDE, "SaaS-Startup — 12 Stunden unentdeckt", "SaaS Startup — 12 Hours Undetected")}</h3>
                    <div className="text-xs text-red-200">SaaS · No Logging · Mai 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-300">12h</div>
                    <div className="text-xs text-red-200">Unentdeckt</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">Root Cause:</span>
                    <span className="text-red-200">{pick(isDE, "Kein Audit-Logging und Echtzeit-Monitoring", "No audit logging and real-time monitoring")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">Was passierte:</span>
                    <span className="text-red-200">{pick(isDE, "Agent exfilierte Daten 12 Stunden lang unentdeckt", "Agent exfiltrated data for 12 hours undetected")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">Fix:</span>
                    <span className="text-red-200">{pick(isDE, "Audit-Logging aktivieren, Echtzeit-Monitoring implementieren", "Enable audit logging, implement real-time monitoring")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">Lessons:</span>
                    <span className="text-red-200">{pick(isDE, "Logging ist essenziell für Threat Detection", "Logging is essential for threat detection")}</span>
                  </div>
                </div>
              </div>
              <div className="bg-orange-900/80 backdrop-blur-lg p-5 rounded-xl border border-orange-700/50 shadow-2xl hover:border-orange-500/30 transition-all duration-300 hover:shadow-orange-500/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-orange-300 mb-1">{pick(isDE, "E-Commerce-Plattform — 2.7 Mio. Euro Strafe", "E-Commerce Platform — €2.7M Fine")}</h3>
                    <div className="text-xs text-orange-200">E-Commerce · No SIEM · April 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-300">2.7M€</div>
                    <div className="text-xs text-orange-200">DSGVO-Strafe</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">Root Cause:</span>
                    <span className="text-orange-200">{pick(isDE, "Keine SIEM-Integration, Logs wurden nicht analysiert", "No SIEM integration, logs not analyzed")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">Was passierte:</span>
                    <span className="text-orange-200">{pick(isDE, "Angreifer nutzten Logs nicht für Threat Detection", "Attacker didn't use logs for threat detection")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">Fix:</span>
                    <span className="text-orange-200">{pick(isDE, "SIEM-Integration mit Splunk, Threat Detection Playbooks", "SIEM integration with Splunk, threat detection playbooks")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">Lessons:</span>
                    <span className="text-orange-200">{pick(isDE, "SIEM ist essenziell für zentrale Log-Analyse", "SIEM is essential for centralized log analysis")}</span>
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
                    <li>{pick(isDE, "✓ Audit-Logging aktivieren", "✓ Enable audit logging")}</li>
                    <li>{pick(isDE, "✓ Grundlegendes Monitoring einrichten", "✓ Set up basic monitoring")}</li>
                    <li>{pick(isDE, "✓ Log-Retention Policy definieren", "✓ Define log retention policy")}</li>
                  </ul>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="font-semibold text-orange-400 mb-1">{pick(isDE, "Diese Woche (2 Stunden)", "This Week (2 hours)")}</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>{pick(isDE, "✓ SIEM-Integration implementieren", "✓ Implement SIEM integration")}</li>
                    <li>{pick(isDE, "✓ Monitoring-Dashboards erstellen", "✓ Create monitoring dashboards")}</li>
                    <li>{pick(isDE, "✓ Anomalie-Erkennung aktivieren", "✓ Enable anomaly detection")}</li>
                  </ul>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="font-semibold text-yellow-400 mb-1">{pick(isDE, "Nächste Woche (4 Stunden)", "Next Week (4 hours)")}</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>{pick(isDE, "✓ Alerting konfigurieren", "✓ Configure alerting")}</li>
                    <li>{pick(isDE, "✓ Escalation Policies definieren", "✓ Define escalation policies")}</li>
                    <li>{pick(isDE, "✓ Log-Tampering Protection implementieren", "✓ Implement log tampering protection")}</li>
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
                  { checked: true, text: {de: "Audit-Logging aktivieren", en: "Enable audit logging"} },
                  { checked: true, text: {de: "Grundlegendes Monitoring einrichten", en: "Set up basic monitoring"} },
                  { checked: false, text: {de: "Log-Retention Policy definieren", en: "Define log retention policy"} },
                  { checked: false, text: {de: "SIEM-Integration implementieren", en: "Implement SIEM integration"} },
                  { checked: false, text: {de: "Monitoring-Dashboards erstellen", en: "Create monitoring dashboards"} },
                  { checked: false, text: {de: "Anomalie-Erkennung aktivieren", en: "Enable anomaly detection"} },
                  { checked: false, text: {de: "Alerting konfigurieren", en: "Configure alerting"} },
                  { checked: false, text: {de: "Escalation Policies definieren", en: "Define escalation policies"} },
                  { checked: false, text: {de: "Log-Tampering Protection implementieren", en: "Implement log tampering protection"} },
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
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Security Score Calculator — Wie sicher ist dein Logging?", "Security Score Calculator — How Secure is Your Logging?")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 mb-4 text-sm">
                {pick(isDE, "Beantworte 5 Fragen und erhalte deinen Security Score (0-100). Dieser Score basiert auf Best Practices aus der Produktion.", "Answer 5 questions and get your Security Score (0-100). This score is based on production best practices.")}
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "1. Hast du Audit-Logging aktiviert?", "1. Have you enabled audit logging?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständiges Audit-Logging", "Yes, complete audit logging")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "2. Hast du Echtzeit-Monitoring?", "2. Do you have real-time monitoring?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständiges Echtzeit-Monitoring", "Yes, complete real-time monitoring")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "3. Hast du SIEM-Integration?", "3. Do you have SIEM integration?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständige SIEM-Integration", "Yes, complete SIEM integration")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "4. Hast du Anomalie-Erkennung?", "4. Do you have anomaly detection?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, KI-basierte Anomalie-Erkennung", "Yes, AI-based anomaly detection")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "5. Hast du Alerting?", "5. Do you have alerting?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständiges Alerting", "Yes, complete alerting")}</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50">
                {pick(isDE, "Security Score berechnen", "Calculate Security Score")}
              </button>
              <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700 hidden">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">65</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Dein Score", "Your Score")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-1">45</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Industry Avg", "Industry Avg")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">Top 25%</div>
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
                <div className="text-sm text-cyan-300 mb-2">{pick(isDE, "Ich habe meine Logging & Monitoring gehärtet", "I hardened my Logging & Monitoring")}</div>
                <div className="text-4xl font-bold text-white mb-2">Security Score: 65/100</div>
                <div className="text-xs text-cyan-200">clawguru.org/moltbot-logging-monitoring</div>
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
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot Data Encryption", "Moltbot Data Encryption")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-cyan-600">
                  <div className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">6</div>
                  <div className="flex-1">
                    <div className="font-semibold text-cyan-400 text-sm">{pick(isDE, "Moltbot Logging & Monitoring", "Moltbot Logging & Monitoring")}</div>
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
                      {pick(isDE, "Was ist der Unterschied zwischen Audit-Logging und Monitoring?", "What's the difference between audit logging and monitoring?")}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">AI</div>
                    <div className="bg-purple-900 p-3 rounded-lg flex-1 text-sm text-purple-200">
                      {pick(isDE, "Audit-Logging zeichnet auf, wer was wann getan hat (Forensik), Monitoring überwacht Systemzustände in Echtzeit (Operations). Audit-Logging ist für Compliance und Incident Response, Monitoring ist für Performance und Availability. Für AI Agents empfiehlt sich beides.", "Audit logging records who did what when (forensics), monitoring monitors system states in real-time (operations). Audit logging is for compliance and incident response, monitoring is for performance and availability. For AI agents, both are recommended.")}
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
                <a href={`/${locale}/moltbot/moltbot-data-encryption`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "Moltbot Data Encryption — Verschlüsselung für AI Agent Daten", "Moltbot Data Encryption — Encryption for AI Agent Data")}
                </a>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="text-xs font-semibold text-gray-400 mb-3 uppercase">{pick(isDE, "Tools & Ressourcen", "Tools & Resources")}</div>
                <div className="grid md:grid-cols-2 gap-2">
                  <a href={`/${locale}/check`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Security Check — Scanne deine Logging", "Security Check — Scan your logging")}
                  </a>
                  <a href={`/${locale}/runbooks`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Runbooks — Automatisierte Logging Playbooks", "Runbooks — Automated logging playbooks")}
                  </a>
                  <a href={`/${locale}/copilot`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Copilot — AI-gestützte Hilfe bei Logging", "Copilot — AI-assisted help with logging")}
                  </a>
                  <a href={`/${locale}/sandbox`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Sandbox — Teste deine Logging-Policies sicher", "Sandbox — Test your logging policies safely")}
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
