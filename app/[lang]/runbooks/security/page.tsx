// Hub page: /[lang]/runbooks/security
// Strong hub for security topic runbooks

import Container from "@/components/shared/Container"
import { RUNBOOKS } from "@/lib/pseo"
import { type Locale, SUPPORTED_LOCALES } from "@/lib/i18n"
import Link from "next/link"

export const revalidate = 60 * 60 * 24

const SECURITY_TOPICS = [
  "firewall-baseline", "ssh-hardening", "security-headers-csp",
  "secrets-management", "zero-trust-network", "container-hardening",
  "supply-chain-security", "ci-cd-security", "tls-certificate-management",
  "api-key-rotation", "ws-origin-hardening",
]

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return {
    title: `Security Runbooks – Firewall, SSH, Secrets, Zero Trust 2026 | ClawGuru`,
    description: `Alle ClawGuru Security-Runbooks: SSH Hardening, Firewall, CSP, Secrets Management, Zero Trust, Container Security. Aktuell für 2026.`,
    alternates: { canonical: `/${locale}/runbooks/security` },
  }
}

export default function SecurityHubPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  const securityRunbooks = RUNBOOKS.filter((r) =>
    SECURITY_TOPICS.some((topic) => r.tags.includes("topic:" + topic))
  ).slice(0, 100)

  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Security Runbooks – ClawGuru",
    description: "Security-Hardening und Incident-Response Runbooks",
    url: `/${locale}/runbooks/security`,
    hasPart: securityRunbooks.slice(0, 20).map((r) => ({
      "@type": "HowTo",
      name: r.title,
      url: `/${locale}/runbook/${r.slug}`,
    })),
  }

  const grouped = SECURITY_TOPICS.map((topic) => ({
    topic,
    runbooks: securityRunbooks.filter((r) => r.tags.includes("topic:" + topic)).slice(0, 6),
  })).filter((g) => g.runbooks.length > 0)

  return (
    <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema) }}
      />
      <div className="py-16 max-w-5xl mx-auto">
        <div className="mb-2 text-xs text-gray-500 uppercase tracking-widest">Hub · Security</div>
        <h1 className="text-3xl md:text-4xl font-black mb-4">🔒 Security Runbooks</h1>
        <p id="direct-answer" className="text-gray-300 text-lg mb-10 max-w-2xl border-l-4 border-brand-cyan pl-4">
          Security-Hardening von SSH bis Zero Trust: praxiserprobte Runbooks für Firewall, TLS, Secrets, Container Security und CI/CD – für Ops-Engineers in 2026.
        </p>

        {/* Hub navigation */}
        <div className="flex gap-3 mb-10 flex-wrap">
          <Link href={`/${locale}/runbooks/cloud`} className="px-4 py-2 rounded-xl border border-gray-700 text-sm hover:border-brand-cyan/50">Cloud</Link>
          <Link href={`/${locale}/runbooks/docker`} className="px-4 py-2 rounded-xl border border-gray-700 text-sm hover:border-brand-cyan/50">Docker</Link>
          <Link href={`/${locale}/runbooks/kubernetes`} className="px-4 py-2 rounded-xl border border-gray-700 text-sm hover:border-brand-cyan/50">Kubernetes</Link>
        </div>

        {grouped.map(({ topic, runbooks }) => (
          <div key={topic} className="mb-10">
            <h2 className="text-xl font-black mb-4 capitalize">{topic.replace(/-/g, " ")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {runbooks.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${locale}/runbook/${r.slug}`}
                  className="p-4 rounded-xl border border-gray-800 hover:border-brand-cyan/40 text-sm"
                >
                  <div className="font-bold text-white mb-1">{r.title}</div>
                  <div className="text-gray-500 text-xs line-clamp-2">{r.summary}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
