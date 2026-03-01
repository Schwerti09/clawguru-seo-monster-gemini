// app/solutions/fix-[cve_id]/page.tsx
// Programmatic SEO landing page for CVE fix solutions.
// Route: /solutions/fix-CVE-2024-6387 (and any valid CVE ID)
// H1: "How to fix [CVE-ID] – Step-by-Step Guide"
// H2: "What is [Vulnerability Name]?"
// H3: "Impact and Risks for your Infrastructure"

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Container from "@/components/shared/Container"
import { getCveEntry, KNOWN_CVES, parseCveId } from "@/lib/cve-pseo"
import { generateCveContent } from "@/lib/agents/cve-agent"
import { BASE_URL } from "@/lib/config"

interface Props {
  params: { cve_id: string }
}

export const revalidate = 60 * 60 * 24 // 24h ISR
export const dynamicParams = true

export async function generateStaticParams() {
  return KNOWN_CVES.map((c) => ({ cve_id: c.cveId }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cveId = parseCveId(decodeURIComponent(params.cve_id))
  if (!cveId) return {}
  const entry = getCveEntry(cveId)
  if (!entry) return {}
  return {
    title: `How to fix ${entry.cveId} (${entry.name}) – Step-by-Step Guide | ClawGuru`,
    description: `${entry.description} CVSS ${entry.cvssScore}. Affected: ${entry.affectedVersions}. Fixed: ${entry.fixedVersions}. Mitigation steps, verification commands, and security best practices.`,
    alternates: { canonical: `/solutions/fix-${entry.cveId}` },
    openGraph: {
      title: `How to fix ${entry.cveId} – ${entry.name} | ClawGuru`,
      description: entry.description,
      type: "article",
    },
  }
}

function severityColor(severity: string) {
  if (severity === "critical") return { text: "#ff3b5c", bg: "rgba(255,59,92,0.1)", border: "rgba(255,59,92,0.3)" }
  if (severity === "high") return { text: "#ff6b35", bg: "rgba(255,107,53,0.1)", border: "rgba(255,107,53,0.3)" }
  if (severity === "medium") return { text: "#ffcc00", bg: "rgba(255,204,0,0.1)", border: "rgba(255,204,0,0.3)" }
  return { text: "#00ff9d", bg: "rgba(0,255,157,0.1)", border: "rgba(0,255,157,0.3)" }
}

export default async function CveFixPage({ params }: Props) {
  const cveId = parseCveId(decodeURIComponent(params.cve_id))
  if (!cveId) return notFound()

  const entry = getCveEntry(cveId)
  if (!entry) return notFound()

  // AI-generated unique content via Gemini (with static fallback)
  const aiContent = await generateCveContent(entry).catch(() => null)
  const colors = severityColor(entry.severity)

  // Schema.org structured data
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to fix ${entry.cveId} – ${entry.name}`,
    description: entry.description,
    url: `${BASE_URL}/solutions/fix-${entry.cveId}`,
    step: entry.mitigationSteps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s,
      text: s,
    })),
  }

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `How to fix ${entry.cveId} – ${entry.name}`,
    description: entry.description,
    url: `${BASE_URL}/solutions/fix-${entry.cveId}`,
    datePublished: entry.publishedDate,
    dateModified: entry.publishedDate,
    author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
    publisher: {
      "@type": "Organization",
      name: "ClawGuru",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/og-image.png` },
    },
    about: {
      "@type": "SoftwareApplication",
      name: entry.affectedSoftware,
    },
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${BASE_URL}/solutions` },
      { "@type": "ListItem", position: 3, name: entry.cveId, item: `${BASE_URL}/solutions/fix-${entry.cveId}` },
    ],
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${entry.cveId}?`,
        acceptedAnswer: { "@type": "Answer", text: entry.description },
      },
      {
        "@type": "Question",
        name: `How do I fix ${entry.cveId}?`,
        acceptedAnswer: { "@type": "Answer", text: entry.mitigationSteps.join(" ") },
      },
      {
        "@type": "Question",
        name: `What is the CVSS score for ${entry.cveId}?`,
        acceptedAnswer: { "@type": "Answer", text: `${entry.cveId} has a CVSS score of ${entry.cvssScore}/10 (${entry.severity} severity).` },
      },
      {
        "@type": "Question",
        name: `Which versions are affected by ${entry.cveId}?`,
        acceptedAnswer: { "@type": "Answer", text: `Affected: ${entry.affectedVersions}. Fixed in: ${entry.fixedVersions}.` },
      },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="py-16 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href="/" className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li><a href="/solutions" className="hover:text-cyan-400">Solutions</a></li>
            <li>/</li>
            <li className="text-gray-300">{entry.cveId}</li>
          </ol>
        </nav>

        {/* Severity + meta bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className="text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider"
            style={{ color: colors.text, background: colors.bg, border: `1px solid ${colors.border}` }}
          >
            {entry.severity}
          </span>
          <span className="text-xs font-mono text-gray-400">
            CVSS <strong className="text-white">{entry.cvssScore}</strong>/10
          </span>
          <span className="text-xs text-gray-600">·</span>
          <span className="text-xs text-gray-500">Published: {entry.publishedDate}</span>
          <span className="text-xs text-gray-600">·</span>
          <span className="text-xs text-gray-500">{entry.affectedSoftware}</span>
        </div>

        {/* H1 – primary SEO target */}
        <h1 className="text-3xl md:text-4xl font-black font-heading mb-4 leading-tight">
          How to fix {entry.cveId} – Step-by-Step Guide
        </h1>

        {/* AI-generated intro */}
        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          {aiContent?.introHtml ?? entry.description}
        </p>

        {/* Quick stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { label: "CVE ID", value: entry.cveId },
            { label: "Severity", value: entry.severity.toUpperCase() },
            { label: "CVSS Score", value: `${entry.cvssScore}/10` },
            { label: "Affected", value: entry.affectedSoftware },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-2xl border border-gray-800 bg-black/25 text-center">
              <div className="text-xs text-gray-500 mb-1">{label}</div>
              <div className="text-sm font-black text-gray-100 truncate">{value}</div>
            </div>
          ))}
        </div>

        {/* H2 – What is this vulnerability? */}
        <section className="mt-10">
          <h2 className="text-2xl font-black text-gray-100 mb-4">
            What is {entry.name}?
          </h2>
          <div className="p-6 rounded-3xl border border-gray-800 bg-black/25 space-y-4">
            <p className="text-gray-200 leading-relaxed">
              {aiContent?.whatIsHtml ?? entry.description}
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Affected Versions</div>
                <div className="text-sm text-gray-300 font-mono">{entry.affectedVersions}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Fixed In</div>
                <div className="text-sm text-green-400 font-mono font-bold">{entry.fixedVersions}</div>
              </div>
            </div>
            {entry.references.length > 0 && (
              <div className="mt-2">
                <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Official References</div>
                <ul className="space-y-1">
                  {entry.references.map((ref) => (
                    <li key={ref}>
                      <a
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2 break-all"
                      >
                        {ref}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* H3 – Impact and Risks */}
        <section className="mt-10">
          <h3 className="text-xl font-black text-gray-100 mb-4">
            Impact and Risks for your Infrastructure
          </h3>
          <div
            className="p-6 rounded-3xl border"
            style={{ borderColor: colors.border, background: colors.bg }}
          >
            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.9)" }}>
              {aiContent?.impactHtml ?? entry.impactSummary}
            </p>
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-lg text-xs border border-gray-700 bg-black/30 text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Mitigation Steps – the "Step-by-Step Guide" */}
        <section className="mt-10">
          <h2 className="text-2xl font-black text-gray-100 mb-2">
            Step-by-Step Mitigation Guide
          </h2>
          {aiContent?.mitigationDetail && (
            <p className="text-gray-400 mb-4 text-sm">{aiContent.mitigationDetail}</p>
          )}
          <ol className="space-y-3">
            {entry.mitigationSteps.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 p-4 rounded-2xl border border-gray-800 bg-black/25"
              >
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                  style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                >
                  {i + 1}
                </span>
                <span className="text-gray-200 text-sm leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-xl font-black text-gray-100 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: `What is the CVSS score for ${entry.cveId}?`,
                a: `${entry.cveId} has a CVSS score of ${entry.cvssScore}/10 (${entry.severity} severity). This reflects ${entry.severity === "critical" ? "the most severe potential impact, requiring immediate remediation" : "a significant security risk that should be addressed promptly"}.`,
              },
              {
                q: `Which versions of ${entry.affectedSoftware} are affected?`,
                a: `Affected: ${entry.affectedVersions}. The vulnerability was fixed in: ${entry.fixedVersions}.`,
              },
              {
                q: `How long does it take to fix ${entry.cveId}?`,
                a: "For most teams: 15–60 minutes to apply the patch, plus 15 minutes of post-patch verification. Complex multi-service environments may require 2–4 hours including staging validation.",
              },
              {
                q: `Is ${entry.cveId} being actively exploited?`,
                a: `Check the NVD entry and CISA KEV catalog for exploitation status. As a ${entry.severity}-severity vulnerability, treat it as a priority remediation regardless of known exploitation status.`,
              },
            ].map((item, i) => (
              <details key={i} className="rounded-2xl border border-gray-800 bg-black/20 group">
                <summary className="px-5 py-4 cursor-pointer font-bold text-gray-200 list-none flex items-center justify-between">
                  <span>{item.q}</span>
                  <span className="text-gray-500 group-open:rotate-180 transition-transform text-xs">▼</span>
                </summary>
                <div className="px-5 pb-4 text-gray-400 leading-relaxed text-sm">{item.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA row */}
        <div className="mt-12 flex flex-wrap gap-3">
          <a
            href="/check"
            className="px-6 py-3 rounded-2xl font-black text-black transition-all duration-300 hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #00ff9d, #00b8ff)" }}
          >
            Run Security Check →
          </a>
          <a
            href="/runbooks"
            className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 transition-colors"
          >
            Browse Runbooks →
          </a>
          <a
            href="/solutions"
            className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 transition-colors"
          >
            ← All CVE Solutions
          </a>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 p-5 rounded-3xl border border-gray-800 bg-black/20 text-xs text-gray-500">
          This CVE fix guide is based on publicly available security advisories (NVD, vendor bulletins).
          Always test changes in a staging environment before applying to production. Verify against the
          official vendor advisory for the most up-to-date guidance.
        </div>
      </div>
    </Container>
  )
}
