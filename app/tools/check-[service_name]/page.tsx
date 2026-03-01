// app/tools/check-[service_name]/page.tsx
// Programmatic SEO landing pages for service security check tools.
// Route: /tools/check-nginx, /tools/check-ssh, /tools/check-docker, etc.

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Container from "@/components/shared/Container"
import { getServiceCheck, SERVICE_CHECKS } from "@/lib/cve-pseo"
import { BASE_URL } from "@/lib/config"

interface Props {
  params: { service_name: string }
}

export const revalidate = 60 * 60 * 24 // 24h ISR
export const dynamicParams = true

export async function generateStaticParams() {
  return SERVICE_CHECKS.map((s) => ({ service_name: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeURIComponent(params.service_name).toLowerCase()
  const entry = getServiceCheck(slug)
  if (!entry) return {}
  return {
    title: `${entry.name} Security Check – Tools & Commands | ClawGuru`,
    description: `${entry.description} Check commands, common vulnerabilities, hardening tips, and related CVEs for ${entry.name}.`,
    alternates: { canonical: `/tools/check-${entry.slug}` },
    openGraph: {
      title: `${entry.name} Security Check | ClawGuru`,
      description: `Security check and hardening guide for ${entry.name} with copy-paste commands.`,
      type: "article",
    },
  }
}

export default function ServiceCheckPage({ params }: Props) {
  const slug = decodeURIComponent(params.service_name).toLowerCase()
  const entry = getServiceCheck(slug)
  if (!entry) return notFound()

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${BASE_URL}/tools` },
      { "@type": "ListItem", position: 3, name: `Check ${entry.name}`, item: `${BASE_URL}/tools/check-${entry.slug}` },
    ],
  }

  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to check ${entry.name} security`,
    description: entry.description,
    url: `${BASE_URL}/tools/check-${entry.slug}`,
    step: entry.checkCommands.map((cmd, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: cmd.label,
      text: cmd.command,
    })),
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do I check ${entry.name} security?`,
        acceptedAnswer: { "@type": "Answer", text: entry.description + " " + entry.checkCommands.map(c => c.label + ": " + c.command).join(". ") },
      },
      {
        "@type": "Question",
        name: `What are common vulnerabilities in ${entry.name}?`,
        acceptedAnswer: { "@type": "Answer", text: entry.commonVulnerabilities.join(". ") },
      },
      {
        "@type": "Question",
        name: `How do I harden ${entry.name}?`,
        acceptedAnswer: { "@type": "Answer", text: entry.hardeningTips.join(". ") },
      },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="py-16 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href="/" className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li><a href="/tools" className="hover:text-cyan-400">Tools</a></li>
            <li>/</li>
            <li className="text-gray-300">check-{entry.slug}</li>
          </ol>
        </nav>

        {/* Category badge */}
        <div className="mb-3">
          <span className="text-xs uppercase tracking-widest" style={{ color: "rgba(0,184,255,0.8)" }}>
            ▸ {entry.category} · Security Check Tool
          </span>
        </div>

        {/* H1 */}
        <h1 className="text-3xl md:text-4xl font-black font-heading mb-4 leading-tight">
          {entry.name} Security Check
        </h1>
        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          {entry.description}
        </p>

        {/* Check Commands */}
        <section className="mt-4">
          <h2 className="text-2xl font-black text-gray-100 mb-4">
            Security Check Commands
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Copy-paste ready commands to audit your {entry.name} installation. Run these on your server to detect misconfigurations and security issues.
          </p>
          <div className="space-y-4">
            {entry.checkCommands.map((cmd, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-gray-800 bg-black/30">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500">{cmd.lang}</span>
                    <span className="text-xs font-bold text-gray-300">{cmd.label}</span>
                  </div>
                </div>
                <pre className="p-4 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
                  <code>{cmd.command}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>

        {/* Common Vulnerabilities */}
        <section className="mt-10">
          <h2 className="text-2xl font-black text-gray-100 mb-4">
            Common {entry.name} Vulnerabilities
          </h2>
          <div className="p-6 rounded-3xl border border-red-500/20 bg-red-500/5">
            <ul className="space-y-2">
              {entry.commonVulnerabilities.map((vuln, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-200">
                  <span className="text-red-400 shrink-0 mt-0.5">⚠</span>
                  <span>{vuln}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Hardening Tips */}
        <section className="mt-10">
          <h3 className="text-xl font-black text-gray-100 mb-4">
            {entry.name} Hardening Checklist
          </h3>
          <div className="p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5">
            <ul className="space-y-2">
              {entry.hardeningTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-200">
                  <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Related CVEs */}
        {entry.relatedCves.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-black text-gray-100 mb-4">
              Related CVEs for {entry.name}
            </h2>
            <div className="flex flex-wrap gap-3">
              {entry.relatedCves.map((cveId) => (
                <a
                  key={cveId}
                  href={`/solutions/fix-${cveId}`}
                  className="px-4 py-2.5 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-black hover:border-red-500/60 hover:text-red-300 transition-colors"
                >
                  {cveId} →
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-lg border border-gray-800 bg-black/30 text-xs text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA row */}
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="/check"
            className="px-6 py-3 rounded-2xl font-black text-black transition-all duration-300 hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #00ff9d, #00b8ff)" }}
          >
            Run Full Security Check →
          </a>
          <a
            href="/runbooks"
            className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 transition-colors"
          >
            View Runbooks →
          </a>
          <a
            href="/solutions"
            className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 transition-colors"
          >
            CVE Solutions →
          </a>
        </div>

        {/* Other services */}
        <div className="mt-10">
          <h2 className="text-lg font-black text-gray-300 mb-4">Check Other Services</h2>
          <div className="flex flex-wrap gap-2">
            {SERVICE_CHECKS.filter((s) => s.slug !== entry.slug).map((s) => (
              <a
                key={s.slug}
                href={`/tools/check-${s.slug}`}
                className="px-3 py-1.5 rounded-xl border border-gray-800 bg-black/25 text-xs text-gray-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
