import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"

export const revalidate = 60

export const metadata = {
  title: "Providers | ClawGuru",
  description: "Provider Hubs: AWS, Hetzner, Cloudflare & Co — Runbooks, Fixes und Baselines nach Plattform sortiert.",
  alternates: { canonical: "/providers" }
}

export default async function ProvidersPage() {
  const { allProviders, runbooksByProvider } = await import("@/lib/pseo")
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const prefix = `/${locale}`
  const providers = allProviders()
  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="SEO Hubs"
          title="Providers"
          subtitle="Jeder Provider ist ein eigener Einstiegspunkt — mit Cluster-Runbooks darunter."
        />

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((p) => {
            const count = runbooksByProvider(p.slug).length
            return (
              <a
                key={p.slug}
                href={`${prefix}/provider/${p.slug}`}
                className="p-6 rounded-3xl border border-gray-800 bg-black/25 hover:bg-black/35 transition-colors"
              >
                <div className="text-sm text-gray-500">Provider</div>
                <div className="text-xl font-extrabold mt-1">{p.name}</div>
                <div className="text-sm text-gray-400 mt-2">{count} Runbooks</div>
                <div className="mt-4 text-cyan-400 text-sm font-semibold">Open hub →</div>
              </a>
            )
          })}
        </div>

        <div className="mt-12 p-6 rounded-3xl border border-gray-800 bg-black/20 text-sm text-gray-400">
          Tipp: Diese Hubs ranken oft schneller als generische Landingpages, weil sie klare Suchintention abholen
          (&quot;ssh hardening hetzner&quot;, &quot;stripe webhook netlify&quot;, &quot;postgres backups aws&quot; etc.).
        </div>
      </div>
    </Container>
  )
}
