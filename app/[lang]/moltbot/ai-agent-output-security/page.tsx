import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-output-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Output Security: Ausgabe-Sicherheit für AI-Agents | ClawGuru"
    : "AI Agent Output Security: Output Security for AI Agents | ClawGuru"
  const description = isDE
    ? "AI Agent Output Security für Moltbot. Output Filtering, Content Moderation, Data Leakage Prevention und sichere Ausgabeverarbeitung für AI-Agent-Systeme."
    : "AI agent output security for Moltbot. Output filtering, content moderation, data leakage prevention and secure output processing for AI agent systems."
  return {
    title, description,
    keywords: ["ai agent output security", "output filtering", "content moderation", "data leakage prevention", "output validation", "moltbot security", "output security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentOutputSecurityPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "AI Agent Output Security" : "AI Agent Output Security"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "AI Agent Output Security für Moltbot. Output Filtering, Content Moderation, Data Leakage Prevention und sichere Ausgabeverarbeitung für AI-Agent-Systeme."
              : "AI agent output security for Moltbot. Output filtering, content moderation, data leakage prevention and secure output processing for AI agent systems."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools." : "This guide is for hardening your own systems. No attack tools."}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kernkonzepte" : "Core Concepts"}</h2>
          <div className="space-y-4">
            {[
              ["1. Output Filtering", isDE ? "Systematische Filterung aller Agent-Outputs vor Auslieferung. Erkennung und Entfernung von schädlichen, falschen oder verbotenen Inhalten." : "Systematic filtering of all agent outputs before delivery. Detection and removal of harmful, false or forbidden content."],
              ["2. PII Detection & Masking", isDE ? "Automatische Erkennung und Maskierung von PII (Personally Identifiable Information) in Agent-Outputs. GDPR-konformes Output Management." : "Automatic detection and masking of PII (Personally Identifiable Information) in agent outputs. GDPR-compliant output management."],
              ["3. Content Moderation", isDE ? "Echtzeit Content Moderation für Agent-Outputs. Automated Moderation APIs und custom Classifier für Domain-spezifische Regeln." : "Real-time content moderation for agent outputs. Automated moderation APIs and custom classifiers for domain-specific rules."],
              ["4. Hallucination Detection", isDE ? "Erkennung und Flagging von halluzinierten Fakten in Agent-Outputs. Confidence Scoring und Fact Verification." : "Detection and flagging of hallucinated facts in agent outputs. Confidence scoring and fact verification."],
              ["5. Output Encoding", isDE ? "Kontextgerechtes Encoding aller Agent-Outputs. HTML, JSON, Shell und SQL Encoding je nach Ausgabe-Kontext." : "Context-appropriate encoding of all agent outputs. HTML, JSON, shell and SQL encoding depending on output context."],
            ].map(([title, desc]) => (
              <div key={title as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{title}</h3>
                <p className="text-sm text-gray-300">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Fortgeschrittene Techniken" : "Advanced Techniques"}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">{isDE ? "Constitutional AI Output Checks" : "Constitutional AI Output Checks"}</h3>
              <p className="text-sm text-green-200">{isDE ? "Automatische Überprüfung von Outputs gegen definierte Constitutional AI Principles. Self-critique und Revision." : "Automatic checking of outputs against defined Constitutional AI principles. Self-critique and revision."}</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">{isDE ? "Watermarking für Outputs" : "Watermarking for Outputs"}</h3>
              <p className="text-sm text-blue-200">{isDE ? "Kryptographisches Watermarking von AI-generierten Outputs. Herkunfts-Nachweis und Manipulation-Erkennung." : "Cryptographic watermarking of AI-generated outputs. Provenance proof and manipulation detection."}</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "Semantic Output Validation" : "Semantic Output Validation"}</h3>
              <p className="text-sm text-yellow-200">{isDE ? "Semantische Validierung von Outputs auf Konsistenz und Korrektheit. Cross-check mit vertrauenswürdigen Datenquellen." : "Semantic validation of outputs for consistency and correctness. Cross-check with trusted data sources."}</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{isDE ? "Output Audit Trails" : "Output Audit Trails"}</h3>
              <p className="text-sm text-red-200">{isDE ? "Vollständige Protokollierung aller Agent-Outputs für Compliance und Incident Investigation. Tamper-proof Logging." : "Complete logging of all agent outputs for compliance and incident investigation. Tamper-proof logging."}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Implementierungsschritte" : "Implementation Steps"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "Output-Policies definieren" : "Define output policies", isDE ? "Klare Regeln was AI-Agents ausgeben dürfen und was nicht. Policies für jeden Ausgabe-Kontext dokumentieren." : "Clear rules for what AI agents may and may not output. Document policies for each output context."],
              [2, isDE ? "PII Scanner integrieren" : "Integrate PII scanner", isDE ? "PII Detection in Output-Pipeline einbauen. Microsoft Presidio, AWS Comprehend oder custom NER Modelle." : "Build PII detection into output pipeline. Microsoft Presidio, AWS Comprehend or custom NER models."],
              [3, isDE ? "Content Moderation API einbinden" : "Integrate content moderation API", isDE ? "Moderation API für alle Outputs aufrufen. OpenAI Moderation, Perspective API oder Custom Classifier." : "Call moderation API for all outputs. OpenAI Moderation, Perspective API or custom classifier."],
              [4, isDE ? "Output Encoding implementieren" : "Implement output encoding", isDE ? "Kontextgerechtes Encoding vor jeder Ausgabe. Rendering-Kontext bestimmen und entsprechend encodieren." : "Context-appropriate encoding before every output. Determine rendering context and encode accordingly."],
              [5, isDE ? "Output Monitoring aktivieren" : "Enable output monitoring", isDE ? "Alle Outputs loggen und auf Anomalien monitoren. Statistiken über gefilterte/blockierte Outputs für Security Team." : "Log all outputs and monitor for anomalies. Statistics on filtered/blocked outputs for security team."],
            ].map(([n, title, desc]) => (
              <div key={n as number} className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{n}</div>
                <div>
                  <div className="font-semibold text-gray-100 mb-2">{title}</div>
                  <div className="text-sm text-gray-300">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{isDE ? "Infrastruktur auf Schwachstellen prüfen" : "Check infrastructure for vulnerabilities"}</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">{isDE ? "KI-generierte Security Runbooks" : "AI-generated security runbooks"}</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw</div>
              <div className="text-sm text-gray-300">{isDE ? "OpenClaw Security Framework" : "OpenClaw Security Framework"}</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Roast My Moltbot</div>
              <div className="text-sm text-gray-300">{isDE ? "Moltbot Security Testing" : "Moltbot security testing"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
