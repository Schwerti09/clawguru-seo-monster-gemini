import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/academy/cve"

interface PageProps { params: { lang: string } }

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "CVE Datenbank: Alle Schwachstellen mit Fix-Anleitungen | ClawGuru Academy"
    : "CVE Database: All Vulnerabilities with Fix Guides | ClawGuru Academy"
  const description = isDE
    ? "Kuratierte CVE-Datenbank mit tiefgehenden Fix-Runbooks: OpenSSH, Next.js, Docker, Go, XZ Utils, HTTP/2 und mehr. Jeder Eintrag enthält Schritt-für-Schritt-Anleitungen, Code-Snippets und FAQ."
    : "Curated CVE database with deep-dive fix runbooks: OpenSSH, Next.js, Docker, Go, XZ Utils, HTTP/2 and more. Every entry includes step-by-step guides, code snippets and FAQ."
  return {
    title, description,
    keywords: ["cve database", "cve fix guides", "vulnerability runbooks", "openssh cve", "nextjs cve", "docker cve", "security fixes 2025 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CVE_ENTRIES = [
  {
    id: "CVE-2025-29927", name: "Next.js Middleware Auth Bypass",
    software: "Next.js", cvss: 9.1, severity: "critical",
    published: "2025-03-21", fixed: "15.2.3 / 14.2.25 / 13.5.9",
    desc: "Authorization bypass via x-middleware-subrequest header. All middleware-based auth bypassed.",
  },
  {
    id: "CVE-2024-45337", name: "Go crypto/ssh Auth Bypass",
    software: "Go (crypto/ssh)", cvss: 9.1, severity: "critical",
    published: "2024-12-11", fixed: "Go 1.23.4 / 1.22.10",
    desc: "PublicKeyCallback logic flaw allows unauthorized SSH authentication in Go SSH servers.",
  },
  {
    id: "CVE-2024-6387", name: "OpenSSH regreSSHion — Unauthenticated RCE",
    software: "OpenSSH", cvss: 8.1, severity: "critical",
    published: "2024-07-01", fixed: "OpenSSH 9.8p1",
    desc: "Signal handler race condition allows unauthenticated RCE as root on glibc Linux.",
  },
  {
    id: "CVE-2024-3094", name: "XZ Utils Backdoor — Supply Chain Attack",
    software: "XZ Utils (liblzma)", cvss: 10.0, severity: "critical",
    published: "2024-03-29", fixed: "XZ Utils 5.4.6 / 5.6.2+",
    desc: "Malicious backdoor inserted by compromised maintainer enables unauthorized SSH access.",
  },
  {
    id: "CVE-2024-21626", name: "runc Container Escape (Leaky Vessels)",
    software: "runc / Docker / Kubernetes", cvss: 8.6, severity: "high",
    published: "2024-01-31", fixed: "runc 1.1.12 / Docker 25.0.2",
    desc: "File descriptor leak allows container escape to host root. Affects all runc-based runtimes.",
  },
  {
    id: "CVE-2023-44487", name: "HTTP/2 Rapid Reset DDoS",
    software: "All HTTP/2 servers", cvss: 7.5, severity: "high",
    published: "2023-10-10", fixed: "nginx 1.25.3 / Apache 2.4.58",
    desc: "Stream cancellation exploit enables record-breaking DDoS (398M RPS). All HTTP/2 servers affected.",
  },
]

export default function CveIndexPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"
  const pageUrl = `${SITE_URL}/${locale}${PATH}`

  const criticalCount = CVE_ENTRIES.filter((c) => c.severity === "critical").length

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Academy", item: `${SITE_URL}/${locale}/academy` },
      { "@type": "ListItem", position: 3, name: "CVE Database", item: pageUrl },
    ]},
    { "@context": "https://schema.org", "@type": "ItemList",
      name: isDE ? "CVE Datenbank — Fix Runbooks" : "CVE Database — Fix Runbooks",
      itemListElement: CVE_ENTRIES.map((cve, i) => ({
        "@type": "ListItem", position: i + 1,
        name: `${cve.id} — ${cve.name}`,
        url: `${SITE_URL}/${locale}/academy/cve/${cve.id}`,
      })),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Alle Anleitungen dienen dem Schutz eigener Systeme." : "All guides are for protecting your own systems."}
        </div>

        <div className="mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Academy · CVE Database</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? "CVE Datenbank: Alle Fix-Runbooks" : "CVE Database: All Fix Runbooks"}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Kuratierte CVE-Datenbank mit tiefgehenden Runbooks. Jeder Eintrag enthält: betroffene Versionen, Schritt-für-Schritt-Fix, erkennungsbasierte Checks und FAQ. Kein Security-Rauschen — nur was für Self-Hosted-Infrastruktur relevant ist."
            : "Curated CVE database with deep-dive runbooks. Every entry includes: affected versions, step-by-step fix, detection-based checks and FAQ. No security noise — only what matters for self-hosted infrastructure."}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: String(CVE_ENTRIES.length), label: isDE ? "CVEs mit Runbook" : "CVEs with runbook" },
            { value: String(criticalCount), label: "CRITICAL" },
            { value: "24h", label: isDE ? "Patch-SLA (Critical)" : "Patch SLA (Critical)" },
            { value: "2026", label: isDE ? "Aktuell gepflegt" : "Actively maintained" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-3xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Alle CVEs — nach Schweregrad" : "All CVEs — by severity"}
          </h2>
          <div className="space-y-3">
            {CVE_ENTRIES.map((cve) => (
              <a
                key={cve.id}
                href={`/${locale}/academy/cve/${cve.id}`}
                className="block bg-gray-800 p-5 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-cyan-700 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-mono text-sm font-bold text-cyan-400">{cve.id}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        cve.severity === "critical" ? "bg-red-900 text-red-300"
                        : cve.severity === "high" ? "bg-orange-900 text-orange-300"
                        : "bg-yellow-900 text-yellow-300"
                      }`}>
                        CVSS {cve.cvss.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500">{cve.published}</span>
                    </div>
                    <div className="font-semibold text-gray-100 mb-1">{cve.name}</div>
                    <div className="text-sm text-gray-400 mb-1">{cve.desc}</div>
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{isDE ? "Software:" : "Software:"}</span> {cve.software} ·{" "}
                      <span className="text-gray-400">{isDE ? "Fix:" : "Fixed in:"}</span> {cve.fixed}
                    </div>
                  </div>
                  <div className="text-cyan-400 text-sm font-semibold flex-shrink-0 self-center">
                    {isDE ? "Runbook →" : "Runbook →"}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Wie benutze ich die CVE Datenbank?" : "How do I use the CVE database?"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: "1", t: isDE ? "Betroffene Version prüfen" : "Check affected version", d: isDE ? "Vergleiche die betroffenen Versionen mit deinen installierten Paketen. Jedes Runbook enthält konkrete Prüfbefehle." : "Compare affected versions with your installed packages. Every runbook includes concrete check commands." },
              { step: "2", t: isDE ? "Fix anwenden" : "Apply the fix", d: isDE ? "Führe die Schritt-für-Schritt-Anleitungen aus. Befehle sind copy-paste-ready für Debian/Ubuntu, RHEL und Docker." : "Execute the step-by-step instructions. Commands are copy-paste-ready for Debian/Ubuntu, RHEL and Docker." },
              { step: "3", t: isDE ? "Detection prüfen" : "Verify detection", d: isDE ? "Nutze die IoC-Checks in jedem Runbook um sicherzustellen, dass keine Ausnutzung stattgefunden hat." : "Use the IoC checks in every runbook to ensure no exploitation has occurred." },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</div>
                <div><div className="font-semibold text-gray-100 mb-1">{s.t}</div><div className="text-sm text-gray-300">{s.d}</div></div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Weiterführende Ressourcen" : "Further Resources"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/academy/cve-feed`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">CVE Feed</div>
              <div className="text-sm text-gray-300">{isDE ? "Alle CVEs nach Schweregrad sortiert" : "All CVEs sorted by severity"}</div>
            </a>
            <a href={`/${locale}/neuro`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Stack MRI</div>
              <div className="text-sm text-gray-300">{isDE ? "CVEs in deiner Infrastruktur erkennen" : "Detect CVEs in your infrastructure"}</div>
            </a>
            <a href={`/${locale}/academy`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Academy</div>
              <div className="text-sm text-gray-300">{isDE ? "Alle Security-Kurse und Tracks" : "All security courses and tracks"}</div>
            </a>
            <a href={`/${locale}/moltbot/real-time-cve-feed`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Echtzeit CVE-Monitoring" : "Real-Time CVE Monitoring"}</div>
              <div className="text-sm text-gray-300">{isDE ? "CVE-Feed mit Moltbot automatisieren" : "Automate CVE feed with Moltbot"}</div>
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
