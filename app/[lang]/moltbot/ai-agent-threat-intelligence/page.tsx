import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-threat-intelligence"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE ? "AI Agent Threat Intelligence: Bedrohungsintelligenz für AI-Agents | ClawGuru" : "AI Agent Threat Intelligence: Threat Intelligence for AI Agents | ClawGuru"
  const description = isDE ? "AI Agent Threat Intelligence für Moltbot. CTI-Integration, IOC-Feeds, MITRE ATLAS Framework und automatisierte Threat Detection für AI-Agent-Systeme." : "AI agent threat intelligence for Moltbot. CTI integration, IOC feeds, MITRE ATLAS framework and automated threat detection for AI agent systems."
  return {
    title, description,
    keywords: ["ai agent threat intelligence", "cti", "ioc feeds", "mitre atlas", "threat detection", "moltbot security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentThreatIntelligencePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Threat Intelligence" : "AI Agent Threat Intelligence"}</h1>
          <p className="text-lg text-gray-300 mb-4">{isDE ? "AI Agent Threat Intelligence für Moltbot. CTI-Integration, IOC-Feeds, MITRE ATLAS Framework und automatisierte Threat Detection für AI-Agent-Systeme." : "AI agent threat intelligence for Moltbot. CTI integration, IOC feeds, MITRE ATLAS framework and automated threat detection for AI agent systems."}</p>
        </div>
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools." : "This guide is for hardening your own systems. No attack tools."}
        </div>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kernkonzepte" : "Core Concepts"}</h2>
          <div className="space-y-4">
            {[
              ["1. MITRE ATLAS Framework", isDE ? "MITRE ATLAS als Adversarial Threat Landscape für AI-Systeme. Taktiken, Techniken und Procedures spezifisch für AI-Angriffe." : "MITRE ATLAS as adversarial threat landscape for AI systems. Tactics, techniques and procedures specific to AI attacks."],
              ["2. CTI-Integration", isDE ? "Integration von Cyber Threat Intelligence in AI-Agent-Abwehr. Automatisches Update von Bedrohungs-Indikatoren." : "Integration of Cyber Threat Intelligence in AI agent defense. Automatic update of threat indicators."],
              ["3. IOC Feeds", isDE ? "Indicators of Compromise für AI-spezifische Angriffe. Malicious Prompts, bekannte Jailbreak-Patterns und Adversarial Examples." : "Indicators of Compromise for AI-specific attacks. Malicious prompts, known jailbreak patterns and adversarial examples."],
              ["4. Threat Hunting für AI", isDE ? "Proaktive Suche nach Bedrohungen in AI-Agent-Systemen. Hypothesen-basiertes Hunting nach ATLAS-Techniken." : "Proactive threat hunting in AI agent systems. Hypothesis-based hunting for ATLAS techniques."],
              ["5. Vulnerability Intelligence", isDE ? "Kontinuierliches Monitoring von AI-relevanten CVEs und Schwachstellen. Automatische Benachrichtigung bei neuen Findings." : "Continuous monitoring of AI-relevant CVEs and vulnerabilities. Automatic notification on new findings."],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Fortgeschrittene Techniken" : "Advanced Techniques"}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700"><h3 className="font-semibold text-green-300 mb-2">{isDE ? "Threat Intelligence Sharing" : "Threat Intelligence Sharing"}</h3><p className="text-sm text-green-200">{isDE ? "STIX/TAXII für standardisierten Austausch von AI-Threat-Intelligence. Gemeinschaftliche Verteidigung mit anderen Organisationen." : "STIX/TAXII for standardized exchange of AI threat intelligence. Collective defense with other organizations."}</p></div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700"><h3 className="font-semibold text-blue-300 mb-2">{isDE ? "AI-powered Threat Detection" : "AI-powered Threat Detection"}</h3><p className="text-sm text-blue-200">{isDE ? "AI nutzen um AI-Angriffe zu erkennen. ML-Modelle für Anomalie-Detection in Agent-Aktivitäten." : "Use AI to detect AI attacks. ML models for anomaly detection in agent activities."}</p></div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700"><h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "Dark Web Monitoring" : "Dark Web Monitoring"}</h3><p className="text-sm text-yellow-200">{isDE ? "Monitoring von Dark Web auf Verkauf von AI-Exploits und kompromittierten Modellen." : "Monitoring dark web for sale of AI exploits and compromised models."}</p></div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700"><h3 className="font-semibold text-red-300 mb-2">{isDE ? "Predictive Threat Modeling" : "Predictive Threat Modeling"}</h3><p className="text-sm text-red-200">{isDE ? "Vorhersage zukünftiger Angriffsvektoren durch Trend-Analyse in AI-Security-Forschung." : "Prediction of future attack vectors through trend analysis in AI security research."}</p></div>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Implementierungsschritte" : "Implementation Steps"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "MITRE ATLAS studieren" : "Study MITRE ATLAS", isDE ? "ATLAS-Taktiken auf eigene AI-Agent-Architektur mappen. Welche Techniken sind relevant?" : "Map ATLAS tactics to your own AI agent architecture. Which techniques are relevant?"],
              [2, isDE ? "CTI-Feed abonnieren" : "Subscribe to CTI feed", isDE ? "AI-spezifische Threat Intelligence Feeds abonnieren. CISA, AI Security Alliance, MITRE." : "Subscribe to AI-specific threat intelligence feeds. CISA, AI Security Alliance, MITRE."],
              [3, isDE ? "IOC-Matching automatisieren" : "Automate IOC matching", isDE ? "Eingehende Requests gegen bekannte Malicious Patterns matchen. Echtzeit-Blocking bei Match." : "Match incoming requests against known malicious patterns. Real-time blocking on match."],
              [4, isDE ? "Threat Hunting durchführen" : "Conduct threat hunting", isDE ? "Regelmäßige Threat Hunting Sessions für AI-Systeme. ATLAS-basierte Hunting Queries." : "Regular threat hunting sessions for AI systems. ATLAS-based hunting queries."],
              [5, isDE ? "Intelligence teilen" : "Share intelligence", isDE ? "Eigene Findings in Threat Intelligence Communities teilen. ISAC-Mitgliedschaft für AI-Security." : "Share own findings in threat intelligence communities. ISAC membership for AI security."],
            ].map(([n, t, d]) => (
              <div key={n as number} className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{n}</div>
                <div><div className="font-semibold text-gray-100 mb-2">{t}</div><div className="text-sm text-gray-300">{d}</div></div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Security Check</div><div className="text-sm text-gray-300">{isDE ? "Infrastruktur prüfen" : "Check infrastructure"}</div></a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Runbooks</div><div className="text-sm text-gray-300">{isDE ? "KI-generierte Security Runbooks" : "AI-generated security runbooks"}</div></a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">OpenClaw</div><div className="text-sm text-gray-300">{isDE ? "OpenClaw Security Framework" : "OpenClaw Security Framework"}</div></a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Roast My Moltbot</div><div className="text-sm text-gray-300">{isDE ? "Moltbot Security Testing" : "Moltbot security testing"}</div></a>
          </div>
        </section>
      </div>
    </div>
  )
}
