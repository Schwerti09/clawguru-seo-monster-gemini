import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/soc2-type-ii-automation"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "SOC 2 Type II Automation for Self-Hosted Infrastructure | ClawGuru"
  const description = "Automate SOC 2 Type II compliance for self-hosted infrastructure: Trust Service Criteria mapping, continuous monitoring, evidence collection, audit logging and access control with Moltbot."
  return {
    title, description,
    keywords: ["soc2 type ii", "soc 2 automation", "soc2 self-hosted", "soc2 compliance automation", "trust service criteria", "soc2 audit evidence"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const TSC = [
  { id: "CC1", name: "Control Environment", desc: "Management commitment, board oversight, organizational structure, competence, accountability.", controls: ["Security policy documented and approved", "Roles and responsibilities defined", "Security training program", "Background checks for privileged roles"], auto: false },
  { id: "CC2", name: "Communication & Information", desc: "Internal and external communication of security policies and obligations.", controls: ["Security policy communicated to all staff", "Vendor contracts include security requirements", "Incident communication procedures"], auto: false },
  { id: "CC3", name: "Risk Assessment", desc: "Risk identification, analysis and response.", controls: ["Annual risk assessment documented", "Vulnerability scanning continuous", "Penetration testing annual", "Risk register maintained"], auto: true },
  { id: "CC4", name: "Monitoring Activities", desc: "Ongoing evaluation of controls effectiveness.", controls: ["Continuous monitoring via SIEM", "Alert on control failures", "Quarterly control reviews", "Anomaly detection active"], auto: true },
  { id: "CC5", name: "Control Activities", desc: "Policies and procedures to ensure controls are carried out.", controls: ["Change management process", "Incident response procedures", "Patch management SLA enforced", "Access review quarterly"], auto: true },
  { id: "CC6", name: "Logical & Physical Access", desc: "Restrict access to authorized users.", controls: ["MFA on all systems", "Least-privilege access enforcement", "Privileged access management (PAM)", "Access deprovisioning < 24h on offboarding"], auto: true },
  { id: "CC7", name: "System Operations", desc: "Detect and mitigate software failures and security incidents.", controls: ["24/7 monitoring and alerting", "Incident response plan tested", "Backup and recovery tested", "Capacity monitoring"], auto: true },
  { id: "CC8", name: "Change Management", desc: "Manage system changes to prevent security degradation.", controls: ["Code review required for all changes", "Staging environment before production", "Automated security scanning in CI/CD", "Rollback procedures documented"], auto: true },
  { id: "CC9", name: "Risk Mitigation", desc: "Identify, select and develop risk mitigation activities.", controls: ["Business continuity plan", "Vendor risk assessments", "Insurance coverage reviewed", "Incident post-mortems documented"], auto: false },
  { id: "A1", name: "Availability", desc: "System available for operation and use as committed.", controls: ["SLA monitoring (99.9%+)", "Redundancy and failover", "DDoS protection", "Capacity planning"], auto: true },
]

const FAQ = [
  { q: "What is the difference between SOC 2 Type I and Type II?", a: "SOC 2 Type I: point-in-time assessment — auditor verifies controls are designed adequately at a specific date. SOC 2 Type II: period-based assessment (typically 6-12 months) — auditor verifies controls operated effectively throughout the entire period. Type II is significantly more valuable for enterprise customers because it proves sustained compliance, not just a snapshot. For self-hosted infrastructure, Type II requires continuous evidence collection throughout the audit period." },
  { q: "Which SOC 2 Trust Service Criteria are mandatory?", a: "Only Security (CC1-CC9) is mandatory. The other four criteria are optional: Availability (A1), Processing Integrity (PI1), Confidentiality (C1), Privacy (P1-P8). Most B2B SaaS companies pursue Security + Availability + Confidentiality. For AI/ML systems handling sensitive data, Privacy criteria are increasingly expected. Choose based on what your customers require." },
  { q: "How does Moltbot help automate SOC 2 compliance?", a: "Moltbot automates evidence collection for 6 of 10 Trust Service Criteria: CC3 (vulnerability scans, risk register), CC4 (SIEM alerts, control failure notifications), CC5 (patch management enforcement, access reviews), CC6 (MFA enforcement, access audit logs), CC7 (incident detection, backup testing), CC8 (CI/CD security scanning). Manual work remains for CC1, CC2, CC9 (governance/organizational) and audit preparation." },
  { q: "What evidence do I need for a SOC 2 Type II audit?", a: "Auditors sample evidence across the audit period. Required evidence typically includes: access control logs (who accessed what, when), change logs (all system changes with approvals), security alert logs (incidents detected and responded to), vulnerability scan reports (showing issues were addressed within SLA), backup test results (proving recovery works), training completion records, vendor assessment records, and incident postmortem documents. Moltbot provides structured, tamper-evident logs for all technical evidence." },
]

export default function Soc2TypeIiAutomationPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "SOC 2 Type II", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "HowTo", name: "Automate SOC 2 Type II Compliance", totalTime: "PT160H", step: [
      { "@type": "HowToStep", name: "Define scope and Trust Service Criteria", text: "Choose which TSC to include. Map systems in scope. Define audit period start date." },
      { "@type": "HowToStep", name: "Implement CC6: Access controls", text: "MFA everywhere, least-privilege, PAM, quarterly access reviews with documented approval." },
      { "@type": "HowToStep", name: "Configure CC4+CC7: Continuous monitoring", text: "Deploy SIEM. Configure alerts for all control failures. 24/7 monitoring coverage." },
      { "@type": "HowToStep", name: "Enforce CC5+CC8: Change and patch management", text: "Automate patch SLA enforcement. Require code review + security scan in CI/CD." },
      { "@type": "HowToStep", name: "Collect and retain evidence", text: "All logs structured and retained for audit period + 1 year. Tamper-evident storage." },
      { "@type": "HowToStep", name: "Engage SOC 2 auditor", text: "Select AICPA-qualified auditor. Provide evidence package. Address findings." },
    ]},
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: Compliance guide for your own infrastructure. Not a substitute for a qualified SOC 2 auditor.
        </div>

        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · SOC 2 Type II</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">SOC 2 Type II Automation for Self-Hosted Infrastructure</h1>
        <p className="text-lg text-gray-300 mb-6">SOC 2 Type II proves your controls worked over an entire audit period — not just on audit day. For self-hosted infrastructure this means 6-12 months of continuous, structured evidence collection. Moltbot automates 6 of 10 Trust Service Criteria out of the box.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[{ value: "10", label: "Trust Service Criteria" }, { value: "6/10", label: "Automatable with Moltbot" }, { value: "1 Year", label: "Log retention required" }, { value: "Type II", label: "Period-based (not snapshot)" }].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Trust Service Criteria Mapping</h2>
          <div className="space-y-3">
            {TSC.map((t) => (
              <div key={t.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{t.id}</span>
                    <span className="font-semibold text-gray-100">{t.name}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${t.auto ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-400"}`}>
                    {t.auto ? "Automated" : "Manual"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{t.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {t.controls.map((c) => (
                    <span key={c} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Evidence Collection Runbook</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`# Moltbot SOC 2 evidence collection — automated daily
moltbot audit collect \\
  --criteria CC3,CC4,CC5,CC6,CC7,CC8 \\
  --output /audit/evidence/$(date +%Y-%m-%d)/ \\
  --format structured-json \\
  --tamper-hash sha256

# Evidence collected:
# - Access logs: who accessed what, timestamp, action
# - Change logs: all deployments with approver
# - Alert logs: security events and response times  
# - Scan reports: vulnerability findings + remediation dates
# - Backup tests: recovery test results with RTO/RPO
# - Patch compliance: systems × CVE × patch date

# Review evidence dashboard
moltbot audit dashboard --period 2025-01-01/2025-12-31`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Frequently Asked Questions</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/solutions/nist-csf-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">NIST CSF 2.0</div>
              <div className="text-sm text-gray-300">Maps well to SOC 2 TSC</div>
            </a>
            <a href={`/${locale}/solutions/dsgvo-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">GDPR / DSGVO</div>
              <div className="text-sm text-gray-300">SOC 2 Privacy + GDPR overlap</div>
            </a>
            <a href={`/${locale}/moltbot/ai-red-teaming`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Red Teaming</div>
              <div className="text-sm text-gray-300">CC3 — penetration testing evidence</div>
            </a>
            <a href={`/${locale}/academy/cve-feed`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">CVE Feed</div>
              <div className="text-sm text-gray-300">CC5 — patch management evidence</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
