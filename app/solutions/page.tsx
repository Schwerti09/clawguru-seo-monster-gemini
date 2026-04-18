// app/solutions/page.tsx
// Landing page listing all CVE solution pages.

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { KNOWN_CVES } from "@/lib/cve-pseo"
import { BASE_URL } from "@/lib/config"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const dynamicParams = true

export async function generateMetadata(): Promise<Metadata> {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  return {
    title: "Infrastructure Hardening & Compliance Guides 2026 | ClawGuru",
    description:
      "InfluxDB HIPAA, ISO 27001 on Google Cloud, RabbitMQ Audit, Terraform Canary Deployments, GitHub Actions on bare metal. Step-by-step guides with security checklists.",
    alternates: { canonical: `/${locale}/solutions` },
    openGraph: {
      title: "Infrastructure Hardening & Compliance | ClawGuru",
      description: "Security hardening, compliance (HIPAA, ISO 27001, PCI-DSS), and deployment best practices for AWS, GCP, Azure.",
      type: "website",
    },
  }
}

function severityColor(severity: string) {
  if (severity === "critical") return { text: "#ff3b5c", bg: "rgba(255,59,92,0.1)", border: "rgba(255,59,92,0.3)" }
  if (severity === "high") return { text: "#ff6b35", bg: "rgba(255,107,53,0.1)", border: "rgba(255,107,53,0.3)" }
  if (severity === "medium") return { text: "#ffcc00", bg: "rgba(255,204,0,0.1)", border: "rgba(255,204,0,0.3)" }
  return { text: "#00ff9d", bg: "rgba(0,255,157,0.1)", border: "rgba(0,255,157,0.3)" }
}

export default function SolutionsPage({ searchParams }: { searchParams?: { q?: string } }) {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const prefix = `/${locale}`
  const query = searchParams?.q?.trim().toUpperCase() ?? ""

  // If ?q=CVE-XXXX-YYYY exactly matches a known CVE, show a single-result redirect hint
  const exactMatch = query ? KNOWN_CVES.find(c => c.cveId.toUpperCase() === query) : null

  const sorted = [...KNOWN_CVES]
    .filter(c => {
      if (!query) return true
      const q = query.toLowerCase()
      return (
        c.cveId.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.affectedSoftware.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => b.cvssScore - a.cvssScore)

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ClawGuru CVE Fix Solutions",
    description: "Step-by-step CVE remediation guides with AI-generated unique content.",
    numberOfItems: sorted.length,
    itemListElement: sorted.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/${locale}/solutions/fix-${c.cveId}`,
      name: `How to fix ${c.cveId} – ${c.name}`,
    })),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Was sind ClawGuru CVE Solutions?', acceptedAnswer: { '@type': 'Answer', text: 'ClawGuru CVE Solutions sind schrittweise Anleitungen zur Behebung bekannter CVEs (Common Vulnerabilities and Exposures) in Self-Hosted und Cloud-Infrastruktur. Jede Solution enthält: betroffene Komponenten, CVSS-Score, Patch-Anleitung, Workarounds falls kein Patch verfügbar, Verifikationsschritte. Alle Solutions sind für Produktionsumgebungen optimiert.' } },
      { '@type': 'Question', name: 'Wie finde ich die richtige CVE Solution für mein System?', acceptedAnswer: { '@type': 'Answer', text: 'CVE Solution finden: Suche nach CVE-ID (z.B. CVE-2024-12345), Komponentenname (z.B. "nginx", "docker") oder Schweregrad (Critical, High). ClawGuru Security Check identifiziert automatisch relevante CVEs für deine Domain. Alternativ: SBOM deines Systems mit Moltbot generieren und gegen NVD-Datenbank matchen — zeigt alle betroffenen Komponenten.' } },
      { '@type': 'Question', name: 'Wie dringend muss ich Critical CVEs patchen?', acceptedAnswer: { '@type': 'Answer', text: 'CVE-Patch-SLAs nach Schweregrad: Critical (CVSS 9.0-10.0): innerhalb 24 Stunden bei aktiven Exploits (CISA KEV), sonst 7 Tage. High (7.0-8.9): 7-14 Tage. Medium (4.0-6.9): 30 Tage. Low (0.1-3.9): 90 Tage oder nächstes Maintenance Window. Bei CISA Known Exploited Vulnerabilities (KEV): immer sofortige Aktion, unabhängig vom CVSS-Score.' } },
      { '@type': 'Question', name: 'Was tue ich wenn kein Patch für eine CVE verfügbar ist?', acceptedAnswer: { '@type': 'Answer', text: 'CVE ohne Patch — Workaround-Strategie: 1) Betroffene Komponente vom Internet isolieren (nur interner Zugriff). 2) WAF-Regel für bekannte Exploit-Patterns. 3) Virtual Patching via ModSecurity/Nginx-Config. 4) Alternativen evaluieren (andere Komponente ohne CVE). 5) Vendor für Patch-Timeline kontaktieren. 6) CVSS Environmental Score anpassen (reduzierter Scope = niedrigeres effektives Risiko). ClawGuru Solutions dokumentieren verfügbare Workarounds.' } },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="py-16 max-w-6xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href="/" className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li className="text-gray-300">Solutions</li>
          </ol>
        </nav>

        <SectionTitle
          kicker="Programmatic SEO · CVE Fix Library"
          title="CVE Fix Solutions"
          subtitle="Step-by-step guides to fix critical vulnerabilities in your infrastructure. AI-generated unique content per CVE, with verification commands and security best practices."
        />

        {/* Search bar */}
        <form method="GET" action="" className="mt-6 flex gap-2">
          <input
            name="q"
            defaultValue={searchParams?.q ?? ""}
            placeholder="CVE-ID oder Stichwort suchen, z.B. CVE-2024-3094"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
          <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">Suchen</button>
          {query && <a href="?" className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-4 py-2 rounded-lg transition-colors">Reset</a>}
        </form>

        {/* Exact match: direct link banner */}
        {exactMatch && (
          <div className="mt-4 bg-green-900 border border-green-700 rounded-lg p-4 flex items-center justify-between">
            <div>
              <span className="text-green-300 font-bold">{exactMatch.cveId}</span>
              <span className="text-green-200 text-sm ml-2">— {exactMatch.name}</span>
            </div>
            <a href={`${prefix}/solutions/fix-${exactMatch.cveId}`} className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
              Fix Guide öffnen →
            </a>
          </div>
        )}

        {/* No results */}
        {query && sorted.length === 0 && (
          <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg p-6 text-center text-gray-400">
            <p className="mb-2">Keine CVEs für <strong className="text-gray-200">{searchParams?.q}</strong> gefunden.</p>
            <p className="text-sm">Direkt zur Fix-Seite: <a href={`${prefix}/solutions/fix-${searchParams?.q}`} className="text-cyan-400 hover:underline">/solutions/fix-{searchParams?.q}</a></p>
          </div>
        )}

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((cve) => {
            const colors = severityColor(cve.severity)
            return (
              <a
                key={cve.cveId}
                href={`${prefix}/solutions/fix-${cve.cveId}`}
                className="p-5 rounded-3xl border border-gray-800 bg-black/25 hover:bg-black/35 transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-black px-2 py-1 rounded-full uppercase tracking-wider"
                    style={{ color: colors.text, background: colors.bg, border: `1px solid ${colors.border}` }}
                  >
                    {cve.severity}
                  </span>
                  <span className="text-xs font-mono text-gray-500">CVSS {cve.cvssScore}</span>
                </div>
                <div className="font-black text-sm mb-1 group-hover:text-cyan-300 transition-colors">
                  {cve.cveId}
                </div>
                <div className="text-xs text-gray-400 mb-2 font-medium">{cve.name}</div>
                <div className="text-xs text-gray-500 line-clamp-2">{cve.description}</div>
                <div className="mt-3 text-xs text-gray-600">
                  Affects: <span className="text-gray-400">{cve.affectedSoftware}</span>
                </div>
                <div className="mt-3 text-xs text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  View fix guide →
                </div>
              </a>
            )
          })}
        </div>

        <div className="mt-12 p-6 rounded-3xl border border-gray-800 bg-black/20 text-sm text-gray-400">
          <p className="mb-2">
            <strong className="text-gray-200">How it works:</strong> Each CVE page is generated dynamically from
            curated vulnerability data and enhanced with Gemini AI for unique, SEO-optimized content.
            Routes follow the pattern: <code className="font-mono text-cyan-400">/solutions/fix-CVE-YYYY-NNNNN</code>
          </p>
          <p>
            Missing a CVE? Navigate directly to{" "}
            <code className="font-mono text-cyan-400">/solutions/fix-CVE-YYYY-NNNNN</code>{" "}
            for any valid CVE ID to get an auto-generated fix guide.
          </p>
        </div>

        {/* AGGRESSIVE INTERNAL LINKING - Total War Round 6 */}
        <div className="mt-16 py-12 bg-gray-900/50 rounded-2xl border border-gray-800">
          <h3 className="text-2xl font-bold text-gray-100 mb-6 text-center">
            {locale === "de" ? "Mycelium Kreislauf — Interne Verlinkungen" : "Mycelium Circle — Internal Links"}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto px-4">
            <a
              href={`${prefix}/roast-my-moltbot`}
              className="group bg-gradient-to-br from-red-900/30 to-[#0a0a0a] p-4 rounded-xl border border-red-700/50 hover:border-red-500 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔥</span>
                <h4 className="text-lg font-bold text-red-400 group-hover:text-red-300 transition-colors">
                  {locale === "de" ? "Roast My Moltbot" : "Roast My Moltbot"}
                </h4>
              </div>
              <p className="text-gray-400 text-xs">
                {locale === "de" ? "Kostenloser Security-Roast in 30 Sekunden" : "Free security roast in 30 seconds"}
              </p>
            </a>
            <a
              href={`${prefix}/check`}
              className="group bg-gradient-to-br from-cyan-900/30 to-[#0a0a0a] p-4 rounded-xl border border-cyan-700/50 hover:border-cyan-500 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🛡️</span>
                <h4 className="text-lg font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  {locale === "de" ? "Security Check" : "Security Check"}
                </h4>
              </div>
              <p className="text-gray-400 text-xs">
                {locale === "de" ? "Claw Score & Risiken in 30 Sekunden" : "Claw Score & risks in 30 seconds"}
              </p>
            </a>
            <a
              href={`${prefix}/runbooks`}
              className="group bg-gradient-to-br from-purple-900/30 to-[#0a0a0a] p-4 rounded-xl border border-purple-700/50 hover:border-purple-500 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📚</span>
                <h4 className="text-lg font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                  {locale === "de" ? "Security Runbooks" : "Security Runbooks"}
                </h4>
              </div>
              <p className="text-gray-400 text-xs">
                {locale === "de" ? "1,000+ fix runbooks für jede Situation" : "1,000+ fix runbooks for every situation"}
              </p>
            </a>
            <a
              href={`${prefix}/academy`}
              className="group bg-gradient-to-br from-green-900/30 to-[#0a0a0a] p-4 rounded-xl border border-green-700/50 hover:border-green-500 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎓</span>
                <h4 className="text-lg font-bold text-green-400 group-hover:text-green-300 transition-colors">
                  {locale === "de" ? "Academy" : "Academy"}
                </h4>
              </div>
              <p className="text-gray-400 text-xs">
                {locale === "de" ? "Kurse & Zertifizierung" : "Courses & Certification"}
              </p>
            </a>
          </div>
        </div>

        {/* AGGRESSIVE CTA SECTION - Total War Round 6 */}
        <div className="mt-16 py-12 bg-gradient-to-br from-cyan-900/30 via-[#0a0a0a] to-purple-900/30 rounded-2xl border border-gray-800">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-gray-100 mb-4">
              {locale === "de" ? "🎯 Starte jetzt" : "🎯 Get Started Now"}
            </h3>
            <p className="text-gray-400 mb-8">
              {locale === "de" ? "Prüfe deinen Stack in 30 Sekunden oder lass ihn roasten" : "Check your stack in 30 seconds or get it roasted"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={`${prefix}/check`}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
              >
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  {locale === "de" ? "JETZT" : "NOW"}
                </span>
                <span className="flex items-center gap-2">
                  🛡️ {locale === "de" ? "Security Check" : "Security Check"}
                </span>
              </a>
              <a
                href={`${prefix}/roast-my-moltbot`}
                className="group px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold text-lg rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
              >
                <span className="flex items-center gap-2">
                  🔥 {locale === "de" ? "Roast My Moltbot" : "Roast My Moltbot"}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
