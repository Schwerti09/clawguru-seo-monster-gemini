// Hub page: /[lang]/runbooks/cloud
// Strong hub for cloud provider runbooks – internal linking anchor

import Container from "@/components/shared/Container"
import { RUNBOOKS } from "@/lib/pseo"
import { type Locale, SUPPORTED_LOCALES } from "@/lib/i18n"
import Link from "next/link"

export const revalidate = 60 * 60 * 24

const CLOUD_PROVIDERS = [
  "hetzner", "digitalocean", "aws", "lightsail", "gcp", "azure",
  "linode", "scaleway", "ovhcloud", "vultr", "contabo", "oracle-cloud",
  "hetzner-nbg1", "hetzner-fsn1", "hetzner-hel1",
  "digitalocean-nyc3", "digitalocean-fra1", "digitalocean-sgp1",
  "aws-eu-west-1", "aws-us-east-1", "aws-ap-southeast-1",
  "azure-vm", "gcp-compute",
]

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return {
    title: `Cloud Runbooks – Hetzner, AWS, GCP, Azure & mehr | ClawGuru`,
    description: `Alle ClawGuru Cloud-Runbooks: Firewall, SSH, Sicherheits-Härtung für Hetzner, DigitalOcean, AWS, GCP, Azure und mehr. Ops-Guides für 2026.`,
    alternates: { canonical: `/${locale}/runbooks/cloud` },
  }
}

export default function CloudHubPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  const cloudRunbooks = RUNBOOKS.filter((r) =>
    CLOUD_PROVIDERS.some((p) => r.tags.includes("provider:" + p))
  ).slice(0, 120)

  const grouped = CLOUD_PROVIDERS.map((provider) => ({
    provider,
    runbooks: cloudRunbooks.filter((r) => r.tags.includes("provider:" + provider)).slice(0, 8),
  })).filter((g) => g.runbooks.length > 0)

  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cloud Runbooks – ClawGuru",
    description: "Ops- und Security-Runbooks für alle großen Cloud-Provider",
    url: `/${locale}/runbooks/cloud`,
    hasPart: cloudRunbooks.slice(0, 20).map((r) => ({
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
        <div className="mb-2 text-xs text-gray-500 uppercase tracking-widest">Hub · Cloud</div>
        <h1 className="text-3xl md:text-4xl font-black mb-4">☁️ Cloud Runbooks</h1>
        <p id="direct-answer" className="text-gray-300 text-lg mb-10 max-w-2xl border-l-4 border-brand-cyan pl-4">
          Alle Ops- und Security-Runbooks für Cloud-Provider: Hetzner, AWS, GCP, Azure, DigitalOcean und mehr – Firewall, SSH, TLS, Backups, Incident Response.
        </p>

        {/* Hub navigation */}
        <div className="flex gap-3 mb-10 flex-wrap">
          <Link href={`/${locale}/runbooks/docker`} className="px-4 py-2 rounded-xl border border-gray-700 text-sm hover:border-brand-cyan/50">Docker</Link>
          <Link href={`/${locale}/runbooks/kubernetes`} className="px-4 py-2 rounded-xl border border-gray-700 text-sm hover:border-brand-cyan/50">Kubernetes</Link>
          <Link href={`/${locale}/runbooks/security`} className="px-4 py-2 rounded-xl border border-gray-700 text-sm hover:border-brand-cyan/50">Security</Link>
        </div>

        {grouped.map(({ provider, runbooks }) => (
          <div key={provider} className="mb-10">
            <h2 className="text-xl font-black mb-4 capitalize">{provider.replace(/-/g, " ")}</h2>
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
