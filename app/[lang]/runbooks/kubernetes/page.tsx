// Hub page: /[lang]/runbooks/kubernetes
// Strong hub for Kubernetes runbooks

import Container from "@/components/shared/Container"
import { RUNBOOKS } from "@/lib/pseo"
import { type Locale, SUPPORTED_LOCALES } from "@/lib/i18n"
import Link from "next/link"

export const revalidate = 60 * 60 * 24

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return {
    title: `Kubernetes Runbooks – RBAC, Networking, Security 2026 | ClawGuru`,
    description: `Alle ClawGuru Kubernetes-Runbooks: RBAC, NetworkPolicy, Pod Security, Incident Response, Monitoring. Ops-Guides für K8s 2026.`,
    alternates: { canonical: `/${locale}/runbooks/kubernetes` },
  }
}

export default function KubernetesHubPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  const k8sRunbooks = RUNBOOKS.filter(
    (r) => r.tags.includes("provider:kubernetes") || r.tags.includes("kubernetes")
  ).slice(0, 80)

  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kubernetes Runbooks – ClawGuru",
    description: "Kubernetes Security, Networking und Ops-Runbooks",
    url: `/${locale}/runbooks/kubernetes`,
    hasPart: k8sRunbooks.slice(0, 20).map((r) => ({
      "@type": "HowTo",
      name: r.title,
      url: `/${locale}/runbook/${r.slug}`,
    })),
  }

  return (
    <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema) }}
      />
      <div className="py-16 max-w-5xl mx-auto">
        <div className="mb-2 text-xs text-gray-500 uppercase tracking-widest">Hub · Kubernetes</div>
        <h1 className="text-3xl md:text-4xl font-black mb-4">⎈ Kubernetes Runbooks</h1>
        <p id="direct-answer" className="text-gray-300 text-lg mb-10 max-w-2xl border-l-4 border-brand-cyan pl-4">
          RBAC, NetworkPolicy, PodSecurity, Incident Response und Monitoring für Kubernetes – praxiserprobte Runbooks für Cluster-Admins und Ops-Teams in 2026.
        </p>

        {/* Hub navigation */}
        <div className="flex gap-3 mb-10 flex-wrap">
          <Link href={`/${locale}/runbooks/cloud`} className="px-4 py-2 rounded-xl border border-gray-700 text-sm hover:border-brand-cyan/50">Cloud</Link>
          <Link href={`/${locale}/runbooks/docker`} className="px-4 py-2 rounded-xl border border-gray-700 text-sm hover:border-brand-cyan/50">Docker</Link>
          <Link href={`/${locale}/runbooks/security`} className="px-4 py-2 rounded-xl border border-gray-700 text-sm hover:border-brand-cyan/50">Security</Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {k8sRunbooks.map((r) => (
            <Link
              key={r.slug}
              href={`/${locale}/runbook/${r.slug}`}
              className="p-4 rounded-xl border border-gray-800 hover:border-brand-cyan/40 text-sm"
            >
              <div className="font-bold text-white mb-1">{r.title}</div>
              <div className="text-gray-500 text-xs line-clamp-2">{r.summary}</div>
              <div className="mt-2 text-xs text-brand-cyan">Score: {r.clawScore}</div>
            </Link>
          ))}
        </div>

        {k8sRunbooks.length === 0 && (
          <p className="text-gray-500">Keine Kubernetes-Runbooks gefunden.</p>
        )}
      </div>
    </Container>
  )
}
