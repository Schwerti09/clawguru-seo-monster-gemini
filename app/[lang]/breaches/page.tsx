import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { SCENARIO_INDEX } from "@/lib/breaches"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export const revalidate = 3600
export const dynamic = "force-static"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/breaches`
  const title = "Attack Cinema — Interactive breach re-enactments | ClawGuru"
  const description = "Replay the biggest security breaches, step by step. Branch into 'what if' scenarios to see how simple defenses change the outcome."
  return {
    title,
    description,
    openGraph: { title, description, url: pageUrl, type: "website" },
    alternates: buildLocalizedAlternates(locale, "/breaches"),
    robots: "index, follow",
  }
}

const ACCENT: Record<string, string> = {
  red:     "border-red-500/30 hover:border-red-400/60 text-red-300",
  amber:   "border-amber-500/30 hover:border-amber-400/60 text-amber-300",
  violet:  "border-violet-500/30 hover:border-violet-400/60 text-violet-300",
  cyan:    "border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300",
  emerald: "border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300",
  pink:    "border-pink-500/30 hover:border-pink-400/60 text-pink-300",
}

export default function BreachesHubPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const prefix = `/${locale}`

  return (
    <div className="min-h-screen bg-[#05070a] text-gray-100">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(239,68,68,0.1),_transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 3px)" }}
          aria-hidden
        />

        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <Link href={`${prefix}/academy`} className="text-xs text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-6">← Academy</Link>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/5 text-red-300 text-[10px] font-mono tracking-[0.25em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              ATTACK CINEMA
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5 tracking-tight">
              Replay the biggest breaches.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-300 to-violet-400">Fork the outcome.</span>
            </h1>
            <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Step-by-step interactive re-enactments. At every critical moment, branch into &ldquo;what if&rdquo; — see how a single defense changes everything.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
            {SCENARIO_INDEX.map((s) => {
              const isLive = s.status === "live"
              return (
                <Link
                  key={s.slug}
                  href={`${prefix}/breaches/${s.slug}`}
                  className={`group block p-6 rounded-xl border bg-white/[0.02] transition-all ${ACCENT[s.accent]} ${!isLive ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-xs font-mono text-gray-500">{s.disclosed}</div>
                    <span className="text-[10px] font-mono tracking-widest opacity-80">
                      {isLive ? "LIVE" : "SOON"}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-100 mb-2 group-hover:opacity-100">{s.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{s.subtitle}</p>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-gray-500">
                    {s.cve && <span>{s.cve}</span>}
                    {s.cvss && <span className="text-red-300">CVSS {s.cvss}</span>}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
