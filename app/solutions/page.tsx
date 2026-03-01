// app/solutions/page.tsx
// Landing page listing all CVE solution pages.

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { KNOWN_CVES } from "@/lib/cve-pseo"
import { BASE_URL } from "@/lib/config"

export const dynamic = "force-static"

export const metadata = {
  title: "CVE Fix Solutions | ClawGuru",
  description:
    "Step-by-step guides to fix critical CVEs: OpenSSH regreSSHion, XZ Utils backdoor, runc container escape, Next.js middleware bypass, and 1,000+ more. Actionable mitigation with verification commands.",
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: "CVE Fix Solutions | ClawGuru",
    description: "Programmatic CVE fix guides with Gemini-generated unique content per vulnerability.",
    type: "website",
  },
}

function severityColor(severity: string) {
  if (severity === "critical") return { text: "#ff3b5c", bg: "rgba(255,59,92,0.1)", border: "rgba(255,59,92,0.3)" }
  if (severity === "high") return { text: "#ff6b35", bg: "rgba(255,107,53,0.1)", border: "rgba(255,107,53,0.3)" }
  if (severity === "medium") return { text: "#ffcc00", bg: "rgba(255,204,0,0.1)", border: "rgba(255,204,0,0.3)" }
  return { text: "#00ff9d", bg: "rgba(0,255,157,0.1)", border: "rgba(0,255,157,0.3)" }
}

export default function SolutionsPage() {
  const sorted = [...KNOWN_CVES].sort((a, b) => b.cvssScore - a.cvssScore)

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ClawGuru CVE Fix Solutions",
    description: "Step-by-step CVE remediation guides with AI-generated unique content.",
    numberOfItems: sorted.length,
    itemListElement: sorted.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/solutions/fix-${c.cveId}`,
      name: `How to fix ${c.cveId} – ${c.name}`,
    })),
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
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

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((cve) => {
            const colors = severityColor(cve.severity)
            return (
              <a
                key={cve.cveId}
                href={`/solutions/fix-${cve.cveId}`}
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

        <div className="mt-6 text-sm text-gray-500">
          <a href="/runbooks" className="hover:text-cyan-400">Runbook Library</a> ·{" "}
          <a href="/tools" className="hover:text-cyan-400">Security Tools</a> ·{" "}
          <a href="/check" className="hover:text-cyan-400">Security Check</a>
        </div>
      </div>
    </Container>
  )
}
