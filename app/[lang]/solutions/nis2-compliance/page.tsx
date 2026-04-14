import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/nis2-compliance"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "NIS2 Compliance Automation: EU-Cybersicherheitsrichtlinie 2024 | ClawGuru"
    : "NIS2 Compliance Automation: EU Cybersecurity Directive 2024 | ClawGuru"
  const description = isDE
    ? "NIS2 Umsetzung für Betreiber wesentlicher und wichtiger Einrichtungen: Risikomanagement, Meldepflichten (24h/72h), Supply-Chain-Security und Geschäftsführerhaftung. Mit Moltbot automatisierbar."
    : "NIS2 implementation for essential and important entities: risk management, reporting obligations (24h/72h), supply chain security and management liability. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "nis2 compliance", "nis2 umsetzung", "nis2 automation", "eu cybersecurity directive 2024",
      "nis2 meldepflicht", "nis2 risikomanagement", "wesentliche einrichtungen nis2", "nis2 self-hosted",
    ],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const NIS2_MEASURES = [
  { area: "Risikomanagement", req: "Dokumentierte Cybersecurity-Risikoanalyse, jährlich zu aktualisieren.", auto: true },
  { area: "Incident Handling", req: "Prozesse zur Erkennung, Reaktion und Meldung von Sicherheitsvorfällen.", auto: true },
  { area: "Business Continuity", req: "BCM-Konzept inkl. Backup, Wiederherstellung und Krisenmanagement.", auto: false },
  { area: "Supply Chain Security", req: "Sicherheitsanforderungen an Lieferanten und Dienstleister überprüfen.", auto: false },
  { area: "Netzwerksicherheit", req: "Sicherheit bei Erwerb, Entwicklung und Wartung von IT-Systemen.", auto: true },
  { area: "Kryptographie", req: "Kryptographiekonzept inkl. Schlüsselmanagement nach Stand der Technik.", auto: true },
  { area: "Zugangskontrollen", req: "Privileged Access Management, MFA für kritische Systeme.", auto: true },
  { area: "Awareness", req: "Sicherheitsschulungen für Mitarbeiter und Führungskräfte.", auto: false },
  { area: "Meldepflichten", req: "24h Frühwarnung, 72h Vollmeldung, 1 Monat Abschlussbericht.", auto: true },
]

const FAQ = [
  {
    q: "Wer ist von der NIS2-Richtlinie betroffen?",
    a: "NIS2 gilt für mittlere und große Unternehmen (≥50 MA oder ≥10 Mio € Umsatz) in kritischen Sektoren: Energie, Verkehr, Bankwesen, Gesundheit, Digitale Infrastruktur (Cloud, Rechenzentren, DNS), Wasser, öffentliche Verwaltung und weitere. Kleine Unternehmen können über Lieferketten indirekt betroffen sein.",
  },
  {
    q: "Was ist der Unterschied zwischen wesentlichen und wichtigen Einrichtungen?",
    a: "Wesentliche Einrichtungen (essential entities): Großunternehmen in hochkritischen Sektoren — strengere Aufsicht, proaktive Überwachung durch Behörden. Wichtige Einrichtungen (important entities): mittlere Unternehmen oder Großunternehmen in weniger kritischen Sektoren — nachträgliche Aufsicht. Bußgelder: bis 10 Mio € / 2% Umsatz (wesentlich) bzw. 7 Mio € / 1,4% Umsatz (wichtig).",
  },
  {
    q: "Wie automatisiere ich die NIS2-Meldepflicht mit Moltbot?",
    a: "Konfiguriere: 1) Moltbot-Monitoring-Alert als Trigger für Incident-Ticket mit 24h-Countdown. 2) Automatische Klassifikation: wesentlicher/wichtiger Vorfall? 3) Frühwarnung-Template für BSI/Behörde nach 24h. 4) Vollmeldungs-Runbook nach 72h mit allen Pflichtfeldern. 5) Abschlussbericht-Reminder nach 30 Tagen.",
  },
  {
    q: "Welche Haftung tragen Geschäftsführer nach NIS2?",
    a: "NIS2 Art. 20 verpflichtet Leitungsorgane zur persönlichen Haftung bei Pflichtverletzungen. Geschäftsführer müssen: Cybersecurity-Maßnahmen genehmigen, Schulungen absolvieren und können bei Missachtung persönlich mit Bußgeldern belegt werden. Eine D&O-Versicherung deckt Compliance-Verstöße oft nicht ab.",
  },
]

export default function Nis2CompliancePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"
  const pageUrl = `${SITE_URL}/${locale}${PATH}`

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
        { "@type": "ListItem", position: 3, name: "NIS2 Compliance", item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "NIS2 Compliance mit Moltbot umsetzen",
      totalTime: "PT16H",
      step: [
        { "@type": "HowToStep", name: "Scoping: Einrichtungstyp bestimmen", text: "Prüfe ob wesentliche oder wichtige Einrichtung. Betroffene Sektoren und Größenkriterien verifizieren." },
        { "@type": "HowToStep", name: "Gap-Analyse", text: "Alle 9 NIS2-Maßnahmenbereiche gegen aktuellen Sicherheitsstand prüfen. Gaps dokumentieren." },
        { "@type": "HowToStep", name: "Risikomanagement einrichten", text: "Risikoregister erstellen. Jährliche Risikoanalyse als Moltbot-Runbook automatisieren." },
        { "@type": "HowToStep", name: "Meldeprozesse konfigurieren", text: "24h/72h/30-Tage Meldeworkflow in Moltbot einrichten. Behörden-Templates vorbereiten." },
        { "@type": "HowToStep", name: "Registrierung bei Behörde", text: "Einrichtung bei nationaler NIS2-Behörde (DE: BSI) registrieren." },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Dieser Leitfaden dient der Compliance-Umsetzung für eigene Systeme." : "This guide is for compliance implementation on your own systems."}
        </div>

        <div className="mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · NIS2 Compliance</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? "NIS2 Compliance Automation" : "NIS2 Compliance Automation"}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Die NIS2-Richtlinie ist seit Oktober 2024 in nationales Recht umgesetzt. Geschäftsführer haften persönlich. Meldepflichten starten bei 24 Stunden. Mit Moltbot automatisierst du die neun Pflichtmaßnahmen — bevor der Auditor klingelt."
            : "NIS2 has been transposed into national law since October 2024. Management liability is personal. Reporting obligations start at 24 hours. With Moltbot you automate the nine mandatory measures — before the auditor calls."}
        </p>

        <div className="bg-red-900 border border-red-700 p-4 rounded-lg mb-8">
          <h3 className="font-bold text-red-300 mb-2">⚠️ {isDE ? "Geschäftsführerhaftung" : "Management Liability"}</h3>
          <p className="text-sm text-red-200">
            {isDE
              ? "NIS2 Art. 20: Leitungsorgane (GF, Vorstand) können persönlich mit Bußgeldern belegt werden. Für wesentliche Einrichtungen: bis 10 Mio € oder 2% des weltweiten Jahresumsatzes. D&O-Versicherungen decken Compliance-Verstöße oft nicht."
              : "NIS2 Art. 20: Management bodies can be personally fined. For essential entities: up to €10M or 2% of global annual turnover. D&O insurance often does not cover compliance violations."}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "24h", label: isDE ? "Frühwarnung-Frist" : "Early warning deadline" },
            { value: "72h", label: isDE ? "Vollmeldungs-Frist" : "Full report deadline" },
            { value: "10M€", label: isDE ? "Max. Bußgeld (wesentlich)" : "Max fine (essential)" },
            { value: "9", label: isDE ? "Pflicht-Maßnahmenbereiche" : "Mandatory measure areas" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-3xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Die 9 NIS2-Maßnahmenbereiche — Automatisierungsgrad" : "9 NIS2 Measure Areas — Automation Coverage"}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">{isDE ? "Bereich" : "Area"}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">{isDE ? "Anforderung" : "Requirement"}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Moltbot</th>
                </tr>
              </thead>
              <tbody>
                {NIS2_MEASURES.map((m, i) => (
                  <tr key={m.area} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-100">{m.area}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{m.req}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${m.auto ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"}`}>
                        {m.auto ? (isDE ? "Automatisiert" : "Automated") : (isDE ? "Unterstützt" : "Supported")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Meldepflicht-Workflow (24h / 72h / 30 Tage)" : "Reporting Workflow (24h / 72h / 30 days)"}
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-4">
              {[
                { time: "T+0", title: isDE ? "Vorfallserkennung" : "Incident Detection", desc: isDE ? "Moltbot-Alert löst Incident-Ticket aus. Automatische NIS2-Klassifikation: wesentlicher oder wichtiger Vorfall?" : "Moltbot alert triggers incident ticket. Automatic NIS2 classification: significant or important incident?" },
                { time: "T+24h", title: isDE ? "Frühwarnung" : "Early Warning", desc: isDE ? "Pflicht: Frühwarnung an nationale Behörde (BSI in DE). Minimale Infos: Angriffsvektor, betroffene Systeme." : "Mandatory: early warning to national authority (BSI in DE). Minimal info: attack vector, affected systems." },
                { time: "T+72h", title: isDE ? "Vollmeldung" : "Full Notification", desc: isDE ? "Detaillierter Bericht: Vorfallsart, Schweregrad, betroffene Dienste, erste Gegenmaßnahmen, grenzüberschreitende Auswirkungen." : "Detailed report: incident type, severity, affected services, initial countermeasures, cross-border impact." },
                { time: "T+30d", title: isDE ? "Abschlussbericht" : "Final Report", desc: isDE ? "Umfassende Analyse: Ursachen, getroffene Maßnahmen, grenzüberschreitende Auswirkungen, Lessons Learned." : "Comprehensive analysis: root causes, measures taken, cross-border impact, lessons learned." },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-lg px-2 py-1 text-xs font-mono font-bold flex-shrink-0">{s.time}</div>
                  <div>
                    <div className="font-semibold text-gray-100">{s.title}</div>
                    <div className="text-sm text-gray-300">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Häufige Fragen (FAQ)" : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <summary className="font-semibold text-gray-100 cursor-pointer">{f.q}</summary>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/solutions/dsgvo-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "DSGVO Compliance" : "GDPR Compliance"}</div>
              <div className="text-sm text-gray-300">{isDE ? "TOMs und Datenpannen-Automation" : "TOMs and breach notification"}</div>
            </a>
            <a href={`/${locale}/solutions/soc2-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">SOC 2 Compliance</div>
              <div className="text-sm text-gray-300">{isDE ? "Trust Service Criteria automatisieren" : "Automate Trust Service Criteria"}</div>
            </a>
            <a href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{isDE ? "NIS2-relevante Checks sofort" : "NIS2-relevant checks instantly"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{isDE ? "KI-Agenten NIS2-konform absichern" : "Secure AI agents for NIS2"}</div>
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
