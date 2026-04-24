import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/compare/openclaw-vs-crowdstrike"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "OpenClaw vs CrowdStrike: Security-Vergleich 2026 | ClawGuru", "OpenClaw vs CrowdStrike: Security Comparison 2026 | ClawGuru")
  const description = pick(isDE, "OpenClaw vs CrowdStrike im Security-Vergleich: Self-Hosted vs Cloud EDR, DSGVO-Compliance, Kosten, Threat Detection und Incident Response 2026 direkt verglichen.", "OpenClaw vs CrowdStrike security comparison: self-hosted vs cloud EDR, GDPR compliance, cost, threat detection and incident response compared 2026.")
  return {
    title, description,
    keywords: ["openclaw vs crowdstrike", "crowdstrike alternative self-hosted", "crowdstrike gdpr", "crowdstrike vs openclaw", "edr self-hosted 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Deployment", openclaw: "100% Self-Hosted", crowdstrike: "Cloud-native SaaS (Falcon platform)", winner: "openclaw" },
  { feature: "GDPR / Data Sovereignty", openclaw: "Full control, no cloud egress", crowdstrike: "Data processed in CrowdStrike cloud (US)", winner: "openclaw" },
  { feature: "Threat Detection Quality", openclaw: "Rule-based + community intel", crowdstrike: "AI-powered, industry-leading detection rates", winner: "crowdstrike" },
  { feature: "EDR / Endpoint Coverage", openclaw: "Linux-focused, agent-based", crowdstrike: "Windows, macOS, Linux, cloud workloads", winner: "crowdstrike" },
  { feature: "Cost", openclaw: "Open-source core, self-managed costs", crowdstrike: "Premium SaaS pricing (high enterprise cost)", winner: "openclaw" },
  { feature: "Incident Response", openclaw: "Manual runbooks + ClawGuru automation", crowdstrike: "Falcon Fusion SOAR + professional IR services", winner: "crowdstrike" },
  { feature: "Compliance Reporting", openclaw: "Custom reports via audit logs", crowdstrike: "Built-in compliance dashboards (PCI, HIPAA)", winner: "crowdstrike" },
  { feature: "Deployment Complexity", openclaw: "High — requires security expertise", crowdstrike: "Low — managed SaaS, fast deployment", winner: "crowdstrike" },
  { feature: "Air-Gap / Offline", openclaw: "Fully supported", crowdstrike: "Not supported (requires cloud connectivity)", winner: "openclaw" },
  { feature: "Customizability", openclaw: "Fully customizable, open-source", crowdstrike: "Limited customization within platform", winner: "openclaw" },
]

const FAQ = [
  {
    q: "What are the main differences between OpenClaw and CrowdStrike?",
    a: "Core differences: 1) Deployment — OpenClaw is self-hosted with no cloud dependency; CrowdStrike is cloud-native SaaS that requires connectivity to CrowdStrike's US cloud. 2) Data sovereignty — OpenClaw keeps all data on your infrastructure; CrowdStrike sends telemetry, process data, and file hashes to CrowdStrike cloud. 3) Detection quality — CrowdStrike's Falcon AI has industry-leading detection rates; OpenClaw uses rule-based detection supplemented by community threat intel. 4) Cost — OpenClaw's core is open-source; CrowdStrike is one of the most expensive enterprise security platforms. 5) Air-gap support — OpenClaw works offline; CrowdStrike requires internet connectivity.",
  },
  {
    q: "Is CrowdStrike GDPR-compliant?",
    a: "CrowdStrike offers GDPR compliance mechanisms: they are certified under the EU-US Data Privacy Framework and offer EU data residency options in some plans. However, key considerations: 1) Process data (file hashes, network connections, process trees) is sent to CrowdStrike cloud by default. 2) EU data residency is not available on all tiers. 3) You must sign a DPA with CrowdStrike. 4) CrowdStrike's 2024 incident (faulty update causing 8.5M Windows BSOD) demonstrated cloud-dependency risks. For strict GDPR requirements with no cloud egress, OpenClaw self-hosted is the safer choice.",
  },
  {
    q: "Can OpenClaw replace CrowdStrike for enterprise security?",
    a: "OpenClaw can partially replace CrowdStrike but with significant gaps: Where OpenClaw matches: self-hosted Linux hardening, custom security runbooks, audit logging, access control. Where CrowdStrike significantly leads: AI-powered threat detection with real-time intelligence from 1M+ endpoints, Threat Graph correlation, professional incident response services, Windows/macOS EDR, mobile device coverage. Realistic approach: use OpenClaw for self-hosted infrastructure hardening and compliance runbooks, and evaluate CrowdStrike for endpoint detection on user workstations where cloud data egress is acceptable.",
  },
  {
    q: "When should I choose OpenClaw over CrowdStrike?",
    a: "Choose OpenClaw when: 1) GDPR or data sovereignty prohibits cloud telemetry. 2) Air-gapped environment without internet connectivity. 3) Budget constraints make CrowdStrike pricing prohibitive. 4) Linux-first infrastructure that needs hardening runbooks. 5) Self-hosted philosophy — you want to own and control your security tooling. 6) Custom detection rules tailored to your infrastructure. Choose CrowdStrike when: 1) Windows or macOS endpoint coverage is critical. 2) You need AI-powered threat detection with real-time global intelligence. 3) Fast deployment with minimal security team overhead. 4) Professional incident response services are required. 5) Compliance dashboards (PCI, HIPAA, SOC 2) are needed out-of-the-box.",
  },
]

export default function OpenclawVsCrowdstrikePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/${locale}/compare` },
        { "@type": "ListItem", position: 3, name: "OpenClaw vs CrowdStrike", item: `${SITE_URL}/${locale}${PATH}` },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}

      <div className="max-w-5xl mx-auto px-4 py-16">
        <nav className="text-sm text-gray-500 mb-8">
          <a href={`/${locale}`} className="hover:text-cyan-400">ClawGuru</a>
          <span className="mx-2">/</span>
          <a href={`/${locale}/compare`} className="hover:text-cyan-400">Compare</a>
          <span className="mx-2">/</span>
          <span className="text-gray-300">OpenClaw vs CrowdStrike</span>
        </nav>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This is a security-focused comparison for your own infrastructure decisions. No attack tools.
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "OpenClaw vs CrowdStrike: Security-Vergleich 2026", "OpenClaw vs CrowdStrike: Security Comparison 2026")}
        </h1>
        <p className="text-lg text-gray-300 mb-10">
          {pick(isDE, "CrowdStrike Falcon ist die führende Cloud-EDR-Plattform. OpenClaw ist das Self-Hosted-Security-Framework für Infrastruktur-Hardening. Beide schützen, aber auf fundamental unterschiedliche Weise — und mit sehr unterschiedlichen DSGVO-Implikationen.", "CrowdStrike Falcon is the leading cloud EDR platform. OpenClaw is the self-hosted security framework for infrastructure hardening. Both protect, but in fundamentally different ways — with very different GDPR implications.")}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Direkt-Vergleich", "Head-to-Head Comparison")}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">OpenClaw</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">CrowdStrike</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-300">{row.feature}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={row.winner === "openclaw" ? "text-green-400 font-semibold" : "text-gray-300"}>
                        {row.winner === "openclaw" && "✓ "}{row.openclaw}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={row.winner === "crowdstrike" ? "text-green-400 font-semibold" : "text-gray-300"}>
                        {row.winner === "crowdstrike" && "✓ "}{row.crowdstrike}
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
            {pick(isDE, "Wann welches Tool wählen?", "When to Choose Which?")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-green-900 p-5 rounded-lg border border-green-700">
              <h3 className="font-bold text-green-300 mb-3">✓ OpenClaw wählen wenn…</h3>
              <ul className="space-y-2 text-sm text-green-200">
                <li>DSGVO: keine Cloud-Telemetrie erlaubt</li>
                <li>Air-Gap / Offline-Umgebung</li>
                <li>Budget: kein Enterprise-SaaS-Pricing</li>
                <li>Linux-First-Infrastruktur</li>
                <li>Volle Kontrolle über Security-Tooling</li>
              </ul>
            </div>
            <div className="bg-blue-900 p-5 rounded-lg border border-blue-700">
              <h3 className="font-bold text-blue-300 mb-3">✓ CrowdStrike wählen wenn…</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>Windows/macOS Endpoint-Schutz kritisch</li>
                <li>AI-Threat-Detection mit globalem Intel nötig</li>
                <li>Schnelles Deployment ohne Security-Team-Overhead</li>
                <li>Professional IR Services benötigt</li>
                <li>Compliance-Dashboards out-of-the-box</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Häufige Fragen", "Frequently Asked Questions")}
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
            {pick(isDE, "Weiterführende Ressourcen", "Further Resources")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a href={`/${locale}/openclaw/intrusion-detection-setup`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Intrusion Detection Setup</div>
              <div className="text-sm text-gray-300">{pick(isDE, "OpenClaw IDS Konfiguration", "OpenClaw IDS configuration guide")}</div>
            </a>
            <a href={`/${locale}/openclaw/server-hardening-checklist`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Server Hardening Checklist</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Server-Absicherung Schritt für Schritt", "Step-by-step server hardening")}</div>
            </a>
            <a href={`/${locale}/compare/openclaw-vs-aquasec`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw vs Aqua Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Container Security Vergleich", "Container security comparison")}</div>
            </a>
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Security Check starten", "Start Security Check")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Infrastruktur in 30 Sekunden prüfen", "Check infrastructure in 30 seconds")}</div>
            </a>
          </div>
        </section>

        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-cyan-300 mb-2">
            {pick(isDE, "OpenClaw für deine Infrastruktur evaluieren?", "Evaluate OpenClaw for your infrastructure?")}
          </h2>
          <p className="text-gray-300 mb-4 text-sm">
            {pick(isDE, "ClawGuru analysiert deine Infrastruktur und zeigt konkrete Härtungsmaßnahmen — ohne Cloud-Telemetrie.", "ClawGuru analyzes your infrastructure and shows concrete hardening measures — without cloud telemetry.")}
          </p>
          <a href={`/${locale}/securitycheck`} className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-lg transition-colors">
            {pick(isDE, "🛡️ Kostenloser Security Check", "🛡️ Free Security Check")}
          </a>
        </div>
      </div>
    </div>
  )
}
