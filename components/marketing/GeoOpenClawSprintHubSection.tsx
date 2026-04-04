import Link from "next/link"

import { geoOpenClawSprintNavLinks } from "@/lib/geo-openclaw-city-sprint"
import type { Locale } from "@/lib/i18n"

type Props = {
  locale: Locale
  prefix: string
}

export default function GeoOpenClawSprintHubSection({ locale, prefix }: Props) {
  const links = geoOpenClawSprintNavLinks(locale)
  if (links.length === 0) return null

  const isDe = locale === "de"
  const title = isDe ? "Geo: OpenClaw-Risiko nach Stadt" : "Geo: OpenClaw risk by city"
  const sub = isDe
    ? "Indexierbare Stadt-Seiten mit Check-CTA und Fix-Pfaden (DE/EN) — stärkt Crawl-Pfade von der Homepage zu den Geo-LPs."
    : "Indexable city pages with check CTAs and fix paths (DE/EN) — strengthens crawl paths from the homepage to geo landing pages."

  return (
    <section className="rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-6">
      <h2 className="text-xl font-black text-white mb-2">{title}</h2>
      <p className="text-sm text-zinc-400 mb-4">{sub}</p>
      <div className="flex flex-wrap gap-2">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-cyan-400/50 hover:text-cyan-200"
          >
            {label}
          </Link>
        ))}
      </div>
      <p className="mt-4 text-xs text-zinc-500">
        <Link href={`${prefix}/openclaw`} className="text-cyan-300/90 hover:text-cyan-200 underline-offset-2 hover:underline">
          {isDe ? "OpenClaw-Hub →" : "OpenClaw hub →"}
        </Link>
      </p>
    </section>
  )
}
