import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/gdpr-llm-data-processing"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "DSGVO für LLMs: GDPR-konforme Datenverarbeitung mit KI 2026 | ClawGuru Solutions"
    : "GDPR LLM Data Processing: GDPR-Compliant AI Data Processing 2026 | ClawGuru Solutions"
  const description = isDE
    ? "DSGVO-konforme Datenverarbeitung mit LLMs und KI-Systemen: Rechtsgrundlagen, Datenschutz by Design, Betroffenenrechte, AI-spezifische DSGVO-Pflichten und Audit-Trail 2026."
    : "GDPR-compliant data processing with LLMs and AI systems: legal bases, privacy by design, data subject rights, AI-specific GDPR obligations and audit trail 2026."
  return {
    title, description,
    keywords: ["gdpr llm", "dsgvo ki", "gdpr ai data processing", "llm dsgvo compliance", "gdpr large language model", "ai gdpr 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const ARTICLES = [
  {
    id: "Art. 5", name: "Grundsätze / Principles", color: "blue",
    items: [
      "Zweckbindung: LLM darf nur für den deklarierten Zweck genutzt werden",
      "Datenminimierung: Prompts dürfen keine unnötigen personenbezogenen Daten enthalten",
      "Speicherbegrenzung: Konversationshistorien nur so lange wie notwendig aufbewahren",
      "Integrität und Vertraulichkeit: LLM-Eingaben und -Ausgaben verschlüsselt übertragen (TLS 1.3)",
      "Rechenschaftspflicht: Alle LLM-Verarbeitungen dokumentieren und nachweisbar machen",
      "Richtigkeit: KI-Ausgaben auf faktische Korrektheit prüfen, bevor sie personenbezogen genutzt werden",
    ],
  },
  {
    id: "Art. 6/9", name: "Rechtsgrundlage / Legal Basis", color: "purple",
    items: [
      "Festlegen: welche Rechtsgrundlage gilt für jede LLM-Verarbeitung (Einwilligung, Vertrag, berechtigtes Interesse)",
      "Einwilligung: granular, widerrufbar, vor dem ersten LLM-Einsatz einholen",
      "Berechtigtes Interesse: LIA (Legitimate Interest Assessment) für jede KI-Anwendung dokumentieren",
      "Keine besonderen Kategorien (Art. 9) in LLM-Prompts ohne explizite Einwilligung",
      "Auftragsverarbeitung (Art. 28): AVV mit jedem LLM-Provider abschließen (OpenAI, Anthropic, Azure)",
      "Drittlandtransfer: SCCs oder Adequacy Decision prüfen für US-basierte LLM-Provider",
    ],
  },
  {
    id: "Art. 13/14", name: "Transparenz / Transparency", color: "green",
    items: [
      "Datenschutzerklärung: KI-Einsatz explizit nennen, welche Daten verarbeitet werden",
      "Informationspflicht: Nutzer vor KI-gestützter Verarbeitung informieren",
      "Automatisierte Entscheidung (Art. 22): KI-Entscheidungen kennzeichnen, Widerspruchsrecht gewähren",
      "Provider-Transparenz: welcher LLM-Provider, welches Modell, welche Version",
      "Prompt-Logging: wenn Prompts gespeichert werden, Nutzer informieren",
      "Cookie/Consent: LLM-Session-Cookies unter Einwilligungspflicht stellen",
    ],
  },
  {
    id: "Art. 15-22", name: "Betroffenenrechte / Data Subject Rights", color: "orange",
    items: [
      "Auskunftsrecht: auf Anfrage mitteilen, welche personenbezogenen Daten im LLM verarbeitet wurden",
      "Recht auf Löschung: Konversationshistorien und Prompt-Logs auf Anfrage löschen",
      "Datenportabilität: Nutzer-Konversationen in maschinenlesbarem Format exportieren",
      "Widerspruchsrecht: LLM-Profiling auf Widerspruch hin stoppen",
      "Berichtigung: KI-generierte fehlerhafte Daten auf Anfrage korrigieren",
      "Frist: Alle Anfragen innerhalb von 30 Tagen beantworten, System dafür aufbauen",
    ],
  },
  {
    id: "Art. 25/32", name: "Privacy by Design & Security", color: "red",
    items: [
      "Privacy by Default: LLM-Features standardmäßig auf minimale Datenverarbeitung einstellen",
      "Pseudonymisierung: Nutzerdaten vor LLM-Verarbeitung pseudonymisieren wo möglich",
      "DSFA (Art. 35): Datenschutz-Folgenabschätzung für jede neue LLM-Anwendung",
      "Verschlüsselung: Prompts, Responses und Logs AES-256 verschlüsseln",
      "Zugriffskontrollen: nur autorisierte Rollen können LLM-Verarbeitungslogs einsehen",
      "Datenpannen (Art. 33): Meldepflicht innerhalb 72h bei LLM-Sicherheitsvorfällen",
    ],
  },
]

const FAQ = [
  {
    q: "Ist der Einsatz von LLMs (z.B. GPT-4) DSGVO-konform?",
    a: "Der Einsatz von LLMs wie GPT-4 ist DSGVO-konform möglich, aber erfordert mehrere Maßnahmen: 1) Auftragsverarbeitungsvertrag (AVV) mit dem LLM-Provider (z.B. OpenAI DPA, Azure OpenAI DPA). 2) Rechtsgrundlage für die Verarbeitung (Art. 6 DSGVO). 3) Drittlandtransfer-Absicherung: USA ist kein Drittland mehr durch den EU-US Data Privacy Framework (seit Juli 2023), aber prüfen ob Provider zertifiziert ist. 4) Keine besonderen Kategorien (Gesundheit, Religion, politische Meinung) in Prompts ohne explizite Einwilligung. 5) Datenschutzerklärung aktualisieren. Self-hosted LLMs (Llama, Mistral) auf EU-Servern sind die datenschutzrechtlich sicherste Option.",
  },
  {
    q: "Müssen LLM-Konversationen gelöscht werden können?",
    a: "Ja — wenn personenbezogene Daten in Konversationen verarbeitet werden, gilt das Recht auf Löschung (Art. 17 DSGVO). Konkret: 1) Konversationshistorien dürfen nicht unbegrenzt gespeichert werden — Speicherfrist festlegen (z.B. 90 Tage). 2) Auf Anfrage müssen alle Konversationen eines Nutzers löschbar sein. 3) Prompt-Logs und Audit-Trails: unterscheiden zwischen personenbezogenen Logs (löschpflichtig) und anonymisierten System-Logs (nicht löschpflichtig). 4) Sicherstellen, dass Daten nicht in LLM-Fine-Tuning einfließen ohne Einwilligung — dann wäre Löschung technisch unmöglich.",
  },
  {
    q: "Was gilt für automatisierte Entscheidungen durch KI (Art. 22 DSGVO)?",
    a: "Art. 22 DSGVO schützt vor rein automatisierten Entscheidungen mit erheblichen Auswirkungen. Für LLM-Anwendungen: 1) Wenn ein LLM alleine über Kreditvergabe, Stellenbewerbungen oder ähnliche Entscheidungen entscheidet → Art. 22 greift. Lösung: Mensch in der Entscheidungsschleife (Human-in-the-Loop). 2) Informationspflicht: Nutzer darüber informieren, dass KI an der Entscheidung beteiligt ist. 3) Widerspruchsrecht: Nutzer können menschliche Überprüfung verlangen. 4) Profiling: LLM-basiertes Nutzer-Profiling gilt als automatisierte Verarbeitung — Einwilligung erforderlich wenn personenbezogen.",
  },
  {
    q: "Brauche ich eine DSFA für meinen LLM-Einsatz?",
    a: "Eine Datenschutz-Folgenabschätzung (DSFA, Art. 35 DSGVO) ist wahrscheinlich erforderlich wenn: 1) LLM verarbeitet systematisch besondere Kategorien (Gesundheit, politische Ansichten). 2) LLM-basiertes Profiling von Nutzern im großen Maßstab. 3) Automatisierte Entscheidungen mit erheblichen Auswirkungen. 4) Innovative Technologie mit unklaren Datenschutzrisiken (LLMs fallen häufig darunter). Die DSFA muss vor dem Einsatz durchgeführt werden und umfasst: Beschreibung der Verarbeitung, Notwendigkeit und Verhältnismäßigkeit, Risikobewertung, geplante Abhilfemaßnahmen.",
  },
]

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Make LLM Data Processing GDPR-Compliant",
  description: "Step-by-step guide to ensuring GDPR compliance when using Large Language Models and AI systems.",
  step: [
    { "@type": "HowToStep", position: 1, name: "Establish Legal Basis", text: "Determine and document the legal basis (Art. 6) for every LLM processing activity. Sign DPA with LLM provider." },
    { "@type": "HowToStep", position: 2, name: "Update Privacy Policy", text: "Explicitly mention AI/LLM use in privacy policy. Inform users before AI-assisted processing." },
    { "@type": "HowToStep", position: 3, name: "Implement Data Minimization", text: "Remove unnecessary personal data from prompts. Pseudonymize where possible." },
    { "@type": "HowToStep", position: 4, name: "Build Data Subject Rights Process", text: "Create workflows for access, deletion, portability, and objection requests within 30 days." },
    { "@type": "HowToStep", position: 5, name: "Conduct DPIA", text: "Run a Data Protection Impact Assessment before deploying high-risk LLM applications." },
  ],
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-900 border-blue-700 text-blue-300",
  purple: "bg-purple-900 border-purple-700 text-purple-300",
  green: "bg-green-900 border-green-700 text-green-300",
  orange: "bg-orange-900 border-orange-700 text-orange-300",
  red: "bg-red-900 border-red-700 text-red-300",
}

export default function GdprLlmDataProcessingPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-5xl mx-auto px-4 py-16">
        <nav className="text-sm text-gray-500 mb-8">
          <a href={`/${locale}`} className="hover:text-cyan-400">ClawGuru</a>
          <span className="mx-2">/</span>
          <a href={`/${locale}/solutions`} className="hover:text-cyan-400">Solutions</a>
          <span className="mx-2">/</span>
          <span className="text-gray-300">GDPR LLM Data Processing</span>
        </nav>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide covers compliance obligations for your own AI systems. No legal advice.
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? "DSGVO-konforme Datenverarbeitung mit LLMs 2026" : "GDPR-Compliant LLM Data Processing 2026"}
        </h1>
        <p className="text-lg text-gray-300 mb-10">
          {isDE
            ? "LLMs verarbeiten Nutzereingaben, generieren Ausgaben und speichern Konversationshistorien — all das ist Datenverarbeitung im Sinne der DSGVO. Dieser Guide zeigt, welche DSGVO-Pflichten für KI-Systeme gelten und wie du sie systematisch erfüllst."
            : "LLMs process user inputs, generate outputs, and store conversation histories — all of which constitute data processing under GDPR. This guide covers which GDPR obligations apply to AI systems and how to meet them systematically."}
        </p>

        {ARTICLES.map((article) => {
          const colorClass = colorMap[article.color] || "bg-gray-800 border-gray-700 text-gray-300"
          return (
            <section key={article.id} className="mb-8">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className={`inline-block px-3 py-1 rounded text-xs font-bold mb-3 border ${colorClass}`}>
                  {article.id}
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-100">{article.name}</h2>
                <ul className="space-y-2">
                  {article.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-cyan-400 mt-0.5 flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )
        })}

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Häufige Fragen" : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-4">
            {FAQ.map((entry, i) => (
              <details key={i} className="bg-gray-800 rounded-lg border border-gray-700">
                <summary className="px-5 py-4 cursor-pointer font-bold text-gray-200 list-none flex items-center justify-between">
                  <span>{entry.q}</span>
                  <span className="text-gray-500 text-xs">▼</span>
                </summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">{entry.a}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Weiterführende Ressourcen" : "Further Resources"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a href={`/${locale}/solutions/gdpr-ai-data-processing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">GDPR AI Data Processing</div>
              <div className="text-sm text-gray-300">{isDE ? "Allgemeine DSGVO-Compliance für KI" : "General GDPR compliance for AI"}</div>
            </a>
            <a href={`/${locale}/solutions/eu-ai-act-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">EU AI Act Compliance</div>
              <div className="text-sm text-gray-300">{isDE ? "EU AI Act Anforderungen 2026" : "EU AI Act requirements 2026"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-privacy-preserving-computation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Privacy-Preserving LLM Computation</div>
              <div className="text-sm text-gray-300">{isDE ? "Datenschutzkonforme LLM-Verarbeitung" : "Privacy-safe LLM computation techniques"}</div>
            </a>
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Security Check starten" : "Start Security Check"}</div>
              <div className="text-sm text-gray-300">{isDE ? "DSGVO-Lücken in deiner KI-Infrastruktur finden" : "Find GDPR gaps in your AI infrastructure"}</div>
            </a>
          </div>
        </section>

        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-cyan-300 mb-2">
            {isDE ? "DSGVO-Compliance für deine KI automatisieren?" : "Automate GDPR compliance for your AI?"}
          </h2>
          <p className="text-gray-300 mb-4 text-sm">
            {isDE
              ? "ClawGuru analysiert deine LLM-Infrastruktur und erstellt einen DSGVO-Compliance-Runbook für dein Setup."
              : "ClawGuru analyzes your LLM infrastructure and generates a GDPR compliance runbook for your setup."}
          </p>
          <a href={`/${locale}/securitycheck`} className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-lg transition-colors">
            {isDE ? "🛡️ Kostenloser Security Check" : "🛡️ Free Security Check"}
          </a>
        </div>
      </div>
    </div>
  )
}
