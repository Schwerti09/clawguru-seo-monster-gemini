import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw/supply-chain-sbom-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "Supply Chain SBOM Security: Software Supply Chain SBOM Security | ClawGuru OpenClaw"
    : "Supply Chain SBOM Security: Software Supply Chain SBOM Security | ClawGuru OpenClaw"
  const description = isDE
    ? "Supply Chain SBOM Security: SBOM Generation, Vulnerability Scanning, License Compliance und Dependency Pinning für Software Supply Chain. Executable Runbooks für Self-Hosted Infrastruktur."
    : "Supply chain SBOM security: SBOM generation, vulnerability scanning, license compliance and dependency pinning for software supply chain. Executable runbooks for self-hosted infrastructure."
  return {
    title, description,
    keywords: ["supply chain sbom security", "sbom generation", "vulnerability scanning", "license compliance", "dependency pinning", "openclaw supply chain"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "SCS-1", title: "SBOM Generation", desc: "Generate Software Bill of Materials for all dependencies. Use SPDX, CycloneDX, or SWID formats.", code: `# OpenClaw SBOM Generation:
sbom_generation:
  enabled: true

  # Format Selection:
  format:
    enabled: true
    # Choose: SPDX, CycloneDX, SWID
    # SPDX: industry standard
    # CycloneDX: security-focused
    # SWID: ISO standard

  # Automated Generation:
  automated:
    enabled: true
    # Generate: on build
    # Tools: Syft, Trivy, SBOMerator
    # Store: in artifact registry
    # Version: with each release

  # SBOM Verification:
  verification:
    enabled: true
    # Verify: SBOM integrity
    # Method: hash verification
    # Sign: with digital signature
    # Prevents: SBOM tampering` },
  { id: "SCS-2", title: "Vulnerability Scanning", desc: "Scan SBOMs for vulnerabilities. Use multiple scanners and aggregate results.", code: `# OpenClaw Vulnerability Scanning:
vulnerability_scanning:
  enabled: true

  # Multi-Scanner Approach:
  multi_scanner:
    enabled: true
    # Use: multiple scanners
    # Tools: Trivy, Grype, Snyk
    # Aggregate: results for accuracy
    # Reduce: false positives

  # CVSS Analysis:
  cvss:
    enabled: true
    # Analyse: CVSS scores
    # Prioritise: high-severity vulnerabilities
    # Threshold: patch CVSS 7.0+
    # Monitor: for new vulnerabilities

  # Remediation Tracking:
  tracking:
    enabled: true
    # Track: vulnerability remediation
    # Assign: to owners
    # Monitor: remediation progress
    # Verify: patches applied` },
  { id: "SCS-3", title: "License Compliance", desc: "Check SBOMs for license compliance. Enforce license policies and track obligations.", code: `# OpenClaw License Compliance:
license_compliance:
  enabled: true

  # License Identification:
  identification:
    enabled: true
    # Identify: all licenses
    # Tools: FOSSA, LicenseFinder
    # Classify: by risk level
    # Alert: on non-compliant licenses

  # Policy Enforcement:
  policy:
    enabled: true
    # Define: allowed licenses
    # Enforce: license policies
    # Block: non-compliant dependencies
    # Approve: exceptions process

  # Obligation Tracking:
  obligations:
    enabled: true
    # Track: license obligations
    # Include: attribution, copyleft
    # Document: compliance actions
    # Review: quarterly` },
  { id: "SCS-4", title: "Dependency Pinning", desc: "Pin all dependencies to specific versions. Use lockfiles and verify integrity.", code: `# OpenClaw Dependency Pinning:
dependency_pinning:
  enabled: true

  # Lockfile Usage:
  lockfiles:
    enabled: true
    # Use: lockfiles (package-lock.json, yarn.lock)
    # Commit: to version control
    # Verify: lockfile integrity
    # Prevents: dependency confusion

  # Dependency Verification:
  verification:
    enabled: true
    # Verify: dependency integrity
    # Method: checksum verification
    # Use: subresource integrity (SRI)
    # Prevents: supply chain attacks

  # Automated Updates:
  updates:
    enabled: true
    # Update: dependencies automatically
    # Tools: Dependabot, Renovate
    # Review: security updates first
    # Test: before merging` },
]

const FAQ = [
  { q: "What is an SBOM and why is it important?", a: "An SBOM (Software Bill of Materials) is a comprehensive inventory of all software components, libraries, and dependencies in an application. It's important because it provides visibility into the software supply chain, enabling vulnerability management, license compliance, and incident response. SBOMs are becoming a regulatory requirement (e.g., US Executive Order 14028, EU Cyber Resilience Act). Without an SBOM, you cannot effectively manage software supply chain risk." },
  { q: "How do I choose the right SBOM format?", a: "Choose the SBOM format based on your use case: 1) SPDX — industry standard, widely supported, good for compliance. 2) CycloneDX — security-focused, supports vulnerability analysis, good for security teams. 3) SWID — ISO standard, good for enterprise environments. Many organisations use multiple formats to meet different requirements. Start with SPDX for compliance and add CycloneDX for security analysis." },
  { q: "How often should I scan my SBOMs for vulnerabilities?", a: "Scan SBOMs continuously or at least daily. New vulnerabilities are discovered regularly, and your dependencies may be affected. Automated scanning integrated into your CI/CD pipeline ensures that new vulnerabilities are detected before deployment. For high-risk applications, consider real-time scanning with tools like Dependabot or Snyk. Also scan your SBOMs when new CVEs are announced." },
  { q: "How does OpenClaw help with supply chain SBOM security?", a: "OpenClaw provides executable runbooks for supply chain SBOM security: 1) Automated SBOM generation with multiple formats. 2) Multi-scanner vulnerability scanning. 3) License compliance checking and policy enforcement. 4) Dependency pinning and verification. 5) Automated dependency updates with security prioritisation. 6) Comprehensive audit logging for compliance. OpenClaw reduces supply chain risk and ensures regulatory compliance." },
]

export default function SupplyChainSbomSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "OpenClaw", item: `${SITE_URL}/${locale}/openclaw` },
      { "@type": "ListItem", position: 3, name: "Supply Chain SBOM Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Supply-Chain-SBOM-Security-Guide für eigene Infrastruktur." : "Supply chain SBOM security guide for your own infrastructure."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">OpenClaw · Batch 8</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "Supply Chain SBOM Security" : "Supply Chain SBOM Security"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "SBOM Generation, Vulnerability Scanning, License Compliance und Dependency Pinning für Software Supply Chain."
            : "SBOM generation, vulnerability scanning, license compliance and dependency pinning for software supply chain."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Supply-Chain-Security-Kontrollen" : "4 Supply Chain Security Controls"}</h2>
          <div className="space-y-5">
            {CONTROLS.map((c) => (
              <div key={c.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{c.id}</span>
                  <span className="font-bold text-gray-100">{c.title}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-3">{c.desc}</p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto"><pre>{c.code}</pre></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Häufige Fragen" : "Frequently Asked Questions"}</h2>
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
            <a href={`/${locale}/openclaw/supply-chain-sbom-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw Supply Chain Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Supply-Chain-Overview" : "Supply chain overview"}</div>
            </a>
            <a href={`/${locale}/openclaw/openclaw-security-2026`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw Security 2026</div>
              <div className="text-sm text-gray-300">{isDE ? "OpenClaw-Framework" : "OpenClaw framework"}</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">All OpenClaw</div>
              <div className="text-sm text-gray-300">{isDE ? "OpenClaw-Übersicht" : "OpenClaw overview"}</div>
            </a>
            <a href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{isDE ? "Live-Check" : "Live check"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
