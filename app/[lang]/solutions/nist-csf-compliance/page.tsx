import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/nist-csf-compliance"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "NIST CSF 2.0 Compliance Automation für Self-Hosted Infrastruktur | ClawGuru", "NIST CSF 2.0 Compliance Automation for Self-Hosted Infrastructure | ClawGuru")
  const description = pick(isDE, "NIST Cybersecurity Framework 2.0 umsetzen: Govern, Identify, Protect, Detect, Respond, Recover — alle 6 Funktionen automatisiert mit Moltbot Runbooks für Self-Hosted-Infrastruktur.", "Implement NIST Cybersecurity Framework 2.0: Govern, Identify, Protect, Detect, Respond, Recover — all 6 functions automated with Moltbot runbooks for self-hosted infrastructure.")
  return {
    title, description,
    keywords: ["nist csf 2.0", "nist cybersecurity framework", "nist csf compliance", "nist csf automation", "nist csf self-hosted", "cybersecurity framework implementation"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CSF_FUNCTIONS = [
  {
    id: "GV", name: "Govern", color: "purple",
    desc: "New in CSF 2.0: Cybersecurity risk governance, policy, roles, oversight and supply chain risk management.",
    controls: ["Cybersecurity policy established and approved by leadership", "Roles and responsibilities defined", "Supply chain risk management program", "Cybersecurity strategy integrated into enterprise risk management"],
    auto: false,
  },
  {
    id: "ID", name: "Identify", color: "blue",
    desc: "Asset management, business environment, risk assessment, risk management strategy.",
    controls: ["Asset inventory (hardware, software, data)", "Vulnerability assessments", "Risk register maintained", "Business impact analysis"],
    auto: true,
  },
  {
    id: "PR", name: "Protect", color: "green",
    desc: "Access control, awareness training, data security, protective technology.",
    controls: ["MFA on all privileged accounts", "Data encryption at rest and in transit", "Least-privilege access enforcement", "Patch management < 30 days for HIGH CVEs"],
    auto: true,
  },
  {
    id: "DE", name: "Detect", color: "yellow",
    desc: "Anomalies and events detection, continuous monitoring, detection processes.",
    controls: ["SIEM/log aggregation active", "Intrusion detection system", "Continuous vulnerability scanning", "Anomaly detection alerts configured"],
    auto: true,
  },
  {
    id: "RS", name: "Respond", color: "orange",
    desc: "Response planning, communications, analysis, mitigation, improvements.",
    controls: ["Incident response plan documented and tested", "Communication procedures for stakeholders", "Containment procedures for common attack types", "Post-incident review process"],
    auto: false,
  },
  {
    id: "RC", name: "Recover", color: "teal",
    desc: "Recovery planning, improvements, communications after a cybersecurity event.",
    controls: ["Recovery plan documented (RTO/RPO defined)", "Backup tested quarterly", "Lessons learned process", "Recovery communication plan"],
    auto: false,
  },
]

const FAQ = [
  { q: "What is NIST CSF 2.0 and what changed from 1.1?", a: "NIST Cybersecurity Framework 2.0 (released February 2024) added a sixth function: Govern (GV). CSF 1.1 had five functions (Identify, Protect, Detect, Respond, Recover). The new Govern function emphasizes organizational context, risk management strategy, supply chain risk, and cybersecurity roles — recognizing that cybersecurity is fundamentally a governance issue, not just a technical one. CSF 2.0 also broadened scope from critical infrastructure to all organizations." },
  { q: "Is NIST CSF mandatory?", a: "NIST CSF is voluntary for most organizations in the US. However, it is de facto mandatory for: US federal agencies (via FISMA), contractors handling federal data, organizations in regulated industries (healthcare, finance) where regulators reference CSF. Internationally, many organizations adopt CSF voluntarily as a best-practice framework. In the EU, NIS2 is the mandatory equivalent — and maps well to CSF functions." },
  { q: "How does NIST CSF map to DSGVO/GDPR?", a: "Strong alignment: CSF Protect (data security) → GDPR Art. 32 TOMs. CSF Detect + Respond → GDPR Art. 33 breach notification (72h). CSF Govern → GDPR Art. 24 data controller responsibility. CSF Identify (asset inventory) → GDPR Art. 30 Records of Processing. Organizations implementing CSF 2.0 cover most GDPR technical requirements simultaneously." },
  { q: "Can I automate NIST CSF compliance with Moltbot?", a: "Yes for the technical functions: Identify (asset scanning, SBOM), Protect (patch management, access control monitoring), and Detect (log aggregation, anomaly detection, CVE matching) are fully automatable with Moltbot runbooks. Govern, Respond, and Recover require human decision-making but Moltbot provides runbook templates, checklists, and automated evidence collection for audits." },
]

export default function NistCsfCompliancePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"
  const pageUrl = `${SITE_URL}/${locale}${PATH}`

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "NIST CSF 2.0", item: pageUrl },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "HowTo", name: "Implement NIST CSF 2.0 with Moltbot", totalTime: "PT40H", step: [
      { "@type": "HowToStep", name: "Govern: Establish policy and roles", text: "Document cybersecurity policy, assign CISO/security owner, define roles and responsibilities." },
      { "@type": "HowToStep", name: "Identify: Asset and risk inventory", text: "Run automated asset discovery. Create SBOM. Build risk register with CVSS-scored vulnerabilities." },
      { "@type": "HowToStep", name: "Protect: Implement controls", text: "MFA everywhere, patch SLA enforcement, encryption, least-privilege. Automate with Moltbot." },
      { "@type": "HowToStep", name: "Detect: Monitoring and alerting", text: "Deploy SIEM, configure anomaly detection, CVE feed matching against SBOM, continuous scanning." },
      { "@type": "HowToStep", name: "Respond: Incident response plan", text: "Document IR plan. Configure Moltbot runbooks for common incident types. Test quarterly." },
      { "@type": "HowToStep", name: "Recover: RTO/RPO and backup testing", text: "Define recovery objectives. Test backups quarterly. Document recovery communication plan." },
    ]},
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Compliance-Leitfaden für eigene Systeme.", "Compliance guide for your own systems.")}
        </div>

        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · NIST CSF 2.0</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "NIST CSF 2.0 Compliance Automation", "NIST CSF 2.0 Compliance Automation")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Das NIST Cybersecurity Framework 2.0 (Februar 2024) strukturiert Cybersecurity in 6 Funktionen. Mit Moltbot automatisierst du die drei technischen Funktionen vollständig und erhältst Runbook-Templates für die drei organisatorischen Funktionen.", "NIST Cybersecurity Framework 2.0 (February 2024) structures cybersecurity into 6 functions. With Moltbot you fully automate the three technical functions and get runbook templates for the three organisational functions.")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {[
            { value: "6", label: pick(isDE, "CSF 2.0 Funktionen", "CSF 2.0 Functions") },
            { value: "NEW", label: pick(isDE, "Govern — neu in 2.0", "Govern — new in 2.0") },
            { value: "3/6", label: pick(isDE, "Vollständig automatisierbar", "Fully automatable") },
            { value: "GDPR", label: pick(isDE, "Starke Überschneidung", "Strong overlap") },
            { value: "NIS2", label: pick(isDE, "Hohe Kompatibilität", "High compatibility") },
            { value: "2024", label: pick(isDE, "Aktuelle Version", "Current version") },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Die 6 CSF-Funktionen — Automatisierungsgrad", "6 CSF Functions — Automation Coverage")}
          </h2>
          <div className="space-y-4">
            {CSF_FUNCTIONS.map((fn) => (
              <div key={fn.id} className={`bg-${fn.color}-900 p-5 rounded-lg border border-${fn.color}-700`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-sm font-black text-${fn.color}-300 bg-${fn.color}-800 px-2 py-1 rounded`}>{fn.id}</span>
                    <span className={`font-bold text-${fn.color}-100 text-lg`}>{fn.name}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${fn.auto ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-300"}`}>
                    {fn.auto ? (pick(isDE, "Automatisiert", "Automated")) : (pick(isDE, "Runbook-gestützt", "Runbook-assisted"))}
                  </span>
                </div>
                <p className={`text-sm text-${fn.color}-200 mb-3`}>{fn.desc}</p>
                <ul className="space-y-1">
                  {fn.controls.map((c, i) => (
                    <li key={i} className={`text-xs text-${fn.color}-200 flex gap-2`}>
                      <span className="flex-shrink-0">▸</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "CSF 2.0 × GDPR × NIS2 — Mapping", "CSF 2.0 × GDPR × NIS2 — Mapping")}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">CSF 2.0</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">GDPR / DSGVO</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">NIS2</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { csf: "Govern (GV)", gdpr: "Art. 24 — Controller responsibility", nis2: "Art. 20 — Management accountability" },
                  { csf: "Identify (ID)", gdpr: "Art. 30 — Records of Processing", nis2: "Art. 21 — Risk management measures" },
                  { csf: "Protect (PR)", gdpr: "Art. 32 — TOMs (encryption, access control)", nis2: "Art. 21 — Security measures" },
                  { csf: "Detect (DE)", gdpr: "Art. 32 — Ongoing confidentiality assurance", nis2: "Art. 21 — Monitoring" },
                  { csf: "Respond (RS)", gdpr: "Art. 33 — 72h breach notification", nis2: "Art. 23 — 24h/72h reporting" },
                  { csf: "Recover (RC)", gdpr: "Art. 32 — Resilience and availability", nis2: "Art. 21 — Business continuity" },
                ].map((r, i) => (
                  <tr key={r.csf} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-cyan-400">{r.csf}</td>
                    <td className="px-4 py-3 text-xs text-gray-300">{r.gdpr}</td>
                    <td className="px-4 py-3 text-xs text-gray-300">{r.nis2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Häufige Fragen", "Frequently Asked Questions")}</h2>
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
            <a href={`/${locale}/solutions/dsgvo-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "DSGVO Compliance", "GDPR Compliance")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "CSF Protect/Respond → DSGVO Art. 32/33", "CSF Protect/Respond → GDPR Art. 32/33")}</div>
            </a>
            <a href={`/${locale}/solutions/nis2-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">NIS2 Compliance</div>
              <div className="text-sm text-gray-300">{pick(isDE, "EU-Pendant zum NIST CSF", "EU counterpart to NIST CSF")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "CSF auf KI-Agenten anwenden", "Apply CSF to AI agents")}</div>
            </a>
            <a href={`/${locale}/academy/cve-feed`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">CVE Feed</div>
              <div className="text-sm text-gray-300">{pick(isDE, "CSF Identify — Schwachstellen erkennen", "CSF Identify — detect vulnerabilities")}</div>
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
