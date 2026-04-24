import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/dsgvo-compliance-automation"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "DSGVO Compliance Automation mit Moltbot | ClawGuru", "GDPR Compliance Automation with Moltbot | ClawGuru")
  const description = pick(isDE, "DSGVO-Compliance automatisieren: Technische und organisatorische Maßnahmen (TOMs), Verarbeitungsverzeichnis, DPIA, Datenpannen-Meldung und Privacy by Design — alles mit Moltbot Runbooks automatisierbar.", "Automate GDPR compliance: TOMs, Records of Processing Activities, DPIA, breach notification, and Privacy by Design — all automatable with Moltbot executable runbooks.")
  return {
    title,
    description,
    keywords: [
      "dsgvo compliance automation", "gdpr automation", "dsgvo moltbot", "datenschutz technische maßnahmen",
      "tom dsgvo", "dpia automation", "datenpanne meldung", "privacy by design", "gdpr self-hosted",
    ],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const TOMS = [
  { art: "Zugangskontrolle", desc: "MFA für alle Systeme mit personenbezogenen Daten. Passwort-Policy: min. 16 Zeichen, kein Shared-Login.", status: "automated" },
  { art: "Datenträgerkontrolle", desc: "Verschlüsselung ruhender Daten (AES-256). Sicheres Löschen (NIST SP 800-88) vor Entsorgung.", status: "automated" },
  { art: "Übertragungskontrolle", desc: "TLS 1.3 für alle Datenübertragungen. HSTS, kein HTTP. Zertifikatsüberwachung.", status: "automated" },
  { art: "Eingabekontrolle", desc: "Audit-Logging aller Datenbankzugriffe. Strukturiertes JSON-Log mit User-ID, Timestamp, Aktion.", status: "automated" },
  { art: "Auftragskontrolle", desc: "AVV-Management für alle Auftragsverarbeiter. Automatische Überprüfung bei Vertragsverlängerung.", status: "manual" },
  { art: "Verfügbarkeitskontrolle", desc: "Backup-Strategie 3-2-1. Recovery-Tests vierteljährlich. RTO < 4h, RPO < 1h.", status: "automated" },
  { art: "Trennungskontrolle", desc: "Getrennte Datenbankschemas pro Mandant. Kein Cross-Tenant-Zugriff möglich.", status: "automated" },
]

const FAQ = [
  {
    q: "Welche technischen Maßnahmen schreibt die DSGVO vor?",
    a: "Art. 32 DSGVO verlangt geeignete technische und organisatorische Maßnahmen (TOMs) unter Berücksichtigung von Risiko und Stand der Technik. Mindestmaßnahmen: Verschlüsselung, Pseudonymisierung, Vertraulichkeit, Integrität, Verfügbarkeit und belastbare Systeme. Die konkreten Maßnahmen sind nach Risikobewertung zu definieren.",
  },
  {
    q: "Wann brauche ich eine Datenschutz-Folgenabschätzung (DPIA)?",
    a: "Eine DPIA ist nach Art. 35 DSGVO Pflicht, wenn die Verarbeitung voraussichtlich ein hohes Risiko für die Rechte und Freiheiten natürlicher Personen verursacht. Typische Fälle: systematische Verarbeitung besonderer Kategorien (Gesundheit, Biometrie), umfangreiches Profiling, Videoüberwachung öffentlicher Bereiche.",
  },
  {
    q: "Wie automatisiere ich die Datenpannen-Meldepflicht?",
    a: "Implementiere: 1) Automatisches Alert bei anomalen Datenbankzugriffen oder Exportvolumina. 2) Incident-Response-Runbook mit 72h-Countdown (Art. 33 DSGVO). 3) Vordefinierte Meldevorlage für die Aufsichtsbehörde. 4) Betroffenenbenachrichtigung nach Art. 34 DSGVO bei hohem Risiko. Moltbot kann Schritte 1-3 vollautomatisch ausführen.",
  },
  {
    q: "Darf ich personenbezogene Daten auf US-Cloud-Servern speichern?",
    a: "Nach dem Schrems-II-Urteil und mit dem EU-US Data Privacy Framework (seit 2023) möglich — aber nur für zertifizierte US-Anbieter. Sicherer: Self-Hosting in der EU mit Moltbot. Kein Drittlandtransfer, keine Standardvertragsklauseln nötig, volle Datenkontrolle.",
  },
]

export default function DsgvoCompliancePage({ params }: { params: { lang: string } }) {
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
        { "@type": "ListItem", position: 3, name: pick(isDE, "DSGVO Compliance", "GDPR Compliance"), item: pageUrl },
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
      name: pick(isDE, "DSGVO-Compliance mit Moltbot automatisieren", "Automate GDPR Compliance with Moltbot"),
      description: pick(isDE, "Schritt-für-Schritt Anleitung zur automatisierten DSGVO-Compliance.", "Step-by-step guide to automated GDPR compliance."),
      totalTime: "PT8H",
      step: [
        { "@type": "HowToStep", name: "TOMs bewerten", text: "Alle 7 Kontrollbereiche (Art. 32 DSGVO) gegen aktuellen Stand der Technik prüfen." },
        { "@type": "HowToStep", name: "Verarbeitungsverzeichnis erstellen", text: "Art. 30 DSGVO: Alle Verarbeitungstätigkeiten dokumentieren mit Zweck, Datenkategorien, Empfänger, Löschfristen." },
        { "@type": "HowToStep", name: "DPIA durchführen", text: "Für Hochrisiko-Verarbeitungen: Risikoidentifikation, Bewertung, Maßnahmen, Dokumentation." },
        { "@type": "HowToStep", name: "Monitoring aktivieren", text: "Anomalie-Detection auf Datenbankzugriffe. Alert bei ungewöhnlichen Export-Volumen oder Zugriffsmustern." },
        { "@type": "HowToStep", name: "Incident-Response-Runbook konfigurieren", text: "72h-Meldefrist-Countdown. Vordefinierte Eskalationspfade. Automatische Behördenbenachrichtigung." },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient der Absicherung eigener Systeme. Kein Angriffswerkzeug.", "This guide is for securing your own systems. No attack tools.")}
        </div>

        <div className="mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · {pick(isDE, "DSGVO Compliance", "GDPR Compliance")}</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "DSGVO Compliance Automation mit Moltbot", "GDPR Compliance Automation with Moltbot")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Die DSGVO verlangt konkrete technische und organisatorische Maßnahmen — nicht Lippenbekenntnisse. Mit Moltbot automatisierst du TOMs, Monitoring, Datenpannen-Meldung und Privacy-by-Design-Checks, statt sie manuell zu dokumentieren.", "GDPR demands concrete technical and organisational measures — not paperwork theatre. With Moltbot you automate TOMs, monitoring, breach notification and Privacy-by-Design checks instead of documenting them manually.")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "72h", label: pick(isDE, "Max. Meldefrist (Art. 33)", "Max. breach notification (Art. 33)") },
            { value: "7", label: pick(isDE, "TOM-Kontrollbereiche", "TOM control areas") },
            { value: "4%", label: pick(isDE, "Max. Bußgeld (Jahresumsatz)", "Max. fine (annual turnover)") },
            { value: "0", label: pick(isDE, "Drittlandtransfers bei Self-Hosting", "Third-country transfers with self-hosting") },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-3xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "TOMs: Automatisierungsgrad-Übersicht", "TOMs: Automation Coverage Overview")}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">{pick(isDE, "Maßnahme", "Control")}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">{pick(isDE, "Umsetzung", "Implementation")}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {TOMS.map((t, i) => (
                  <tr key={t.art} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-100">{t.art}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{t.desc}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${t.status === "automated" ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"}`}>
                        {t.status === "automated" ? (pick(isDE, "Automatisiert", "Automated")) : (pick(isDE, "Manuell", "Manual"))}
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
            {pick(isDE, "72h-Datenpannen-Workflow", "72h Breach Notification Workflow")}
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-4">
              {[
                { h: pick(isDE, "T+0: Erkennung", "T+0: Detection"), desc: pick(isDE, "Anomalie-Alert durch Moltbot-Monitoring. Automatischer Incident-Ticket-Start mit 72h-Countdown.", "Anomaly alert via Moltbot monitoring. Automatic incident ticket created with 72h countdown.") },
                { h: pick(isDE, "T+4h: Erstbewertung", "T+4h: Initial Assessment"), desc: pick(isDE, "Klassifikation: personenbezogene Daten betroffen? Risikoeinstufung hoch/mittel/niedrig. Eskalation an Datenschutzbeauftragten.", "Classification: personal data involved? Risk rating high/medium/low. Escalation to DPO.") },
                { h: pick(isDE, "T+24h: Dokumentation", "T+24h: Documentation"), desc: pick(isDE, "Umfang der Panne dokumentieren: betroffene Datenkategorien, Anzahl Personen, wahrscheinliche Folgen.", "Document scope: data categories affected, number of persons, likely consequences.") },
                { h: pick(isDE, "T+48h: Vorab-Meldung", "T+48h: Preliminary Notification"), desc: pick(isDE, "Vorab-Meldung an Aufsichtsbehörde mit verfügbaren Informationen. Nachlieferung angekündigt.", "Preliminary notification to supervisory authority with available information. Follow-up announced.") },
                { h: pick(isDE, "T+72h: Vollmeldung", "T+72h: Full Report"), desc: pick(isDE, "Vollständige Meldung nach Art. 33 DSGVO. Bei hohem Risiko: Betroffenenbenachrichtigung nach Art. 34.", "Complete report per Art. 33 GDPR. If high risk: data subject notification per Art. 34.") },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                  <div>
                    <div className="font-semibold text-gray-100">{s.h}</div>
                    <div className="text-sm text-gray-300">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Self-Hosting als DSGVO-Trumpfkarte", "Self-Hosting as GDPR Trump Card")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">{pick(isDE, "Self-Hosted (Moltbot)", "Self-Hosted (Moltbot)")}</h3>
              <ul className="space-y-1 text-sm text-green-200">
                <li>✓ {pick(isDE, "Keine Drittlandtransfers", "No third-country transfers")}</li>
                <li>✓ {pick(isDE, "Volle Datenkontrolle", "Full data control")}</li>
                <li>✓ {pick(isDE, "AVV nur intern nötig", "DPA only internal")}</li>
                <li>✓ {pick(isDE, "Löschfristen direkt durchsetzbar", "Retention limits directly enforceable")}</li>
                <li>✓ {pick(isDE, "Audit-Logs bleiben in EU", "Audit logs stay in EU")}</li>
              </ul>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{pick(isDE, "US-Cloud (SaaS)", "US-Cloud (SaaS)")}</h3>
              <ul className="space-y-1 text-sm text-red-200">
                <li>⚠ {pick(isDE, "Drittlandtransfer → Standardvertragsklauseln nötig", "Third-country transfer → SCCs needed")}</li>
                <li>⚠ {pick(isDE, "Abhängig von US-Zertifizierung (DPF)", "Depends on US certification (DPF)")}</li>
                <li>⚠ {pick(isDE, "TIAs (Transfer Impact Assessments) empfohlen", "TIAs (Transfer Impact Assessments) recommended")}</li>
                <li>⚠ {pick(isDE, "Datenspeicherort unklar", "Data storage location unclear")}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Häufige Fragen (FAQ)", "Frequently Asked Questions")}
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further Resources")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Hub</div>
              <div className="text-sm text-gray-300">{pick(isDE, "DSGVO-konforme KI-Agenten absichern", "Securing GDPR-compliant AI agents")}</div>
            </a>
            <a href={`/${locale}/solutions/soc2-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">SOC 2 Compliance</div>
              <div className="text-sm text-gray-300">{pick(isDE, "SOC 2 Typ II Automation", "SOC 2 Type II automation")}</div>
            </a>
            <a href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{pick(isDE, "DSGVO-relevante Checks sofort", "GDPR-relevant checks instantly")}</div>
            </a>
            <a href={`/${locale}/solutions/nis2-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">NIS2 Compliance</div>
              <div className="text-sm text-gray-300">{pick(isDE, "EU-Cybersicherheitsrichtlinie 2024", "EU Cybersecurity Directive 2024")}</div>
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
