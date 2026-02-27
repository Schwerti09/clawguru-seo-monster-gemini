// Hub page: /[lang]/runbooks/docker
// Strong hub for Docker runbooks

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
    title: `Docker Runbooks – Container Security & Ops 2026 | ClawGuru`,
    description: `Alle ClawGuru Docker-Runbooks: Container Hardening, Secrets, Compose, Registry, Netzwerk. Ops-Guides für Docker 2026.`,
    alternates: { canonical: `/${locale}/runbooks/docker` },
  }
}

export default function DockerHubPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  const dockerRunbooks = RUNBOOKS.filter(
    (r) => r.tags.includes("provider:docker") || r.tags.includes("docker")
  ).slice(0, 80)

  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Docker Runbooks – ClawGuru",
    description: "Container Security und Ops-Runbooks für Docker",
    url: `/${locale}/runbooks/docker`,
    hasPart: dockerRunbooks.slice(0, 20).map((r) => ({
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
        <div className="mb-2 text-xs text-gray-500 uppercase tracking-widest">Hub · Docker</div>
        <h1 className="text-3xl md:text-4xl font-black mb-4">🐳 Docker Runbooks</h1>
        <p id="direct-answer" className="text-gray-300 text-lg mb-10 max-w-2xl border-l-4 border-brand-cyan pl-4">
          Container-Hardening, Secrets-Management, Compose-Best-Practices und Incident-Response für Docker-Umgebungen – für 2026 aktualisiert.
        </p>

        {/* Hub navigation */}
        <div className="flex gap-3 mb-10 flex-wrap">
          <Link href={`/${locale}/runbooks/cloud`} className="px-4 py-2 rounded-xl border border-gray-700 text-sm hover:border-brand-cyan/50">Cloud</Link>
          <Link href={`/${locale}/runbooks/kubernetes`} className="px-4 py-2 rounded-xl border border-gray-700 text-sm hover:border-brand-cyan/50">Kubernetes</Link>
          <Link href={`/${locale}/runbooks/security`} className="px-4 py-2 rounded-xl border border-gray-700 text-sm hover:border-brand-cyan/50">Security</Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {dockerRunbooks.map((r) => (
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

        {dockerRunbooks.length === 0 && (
          <p className="text-gray-500">Keine Docker-Runbooks gefunden.</p>
        )}
      </div>
    </Container>
  )
}
