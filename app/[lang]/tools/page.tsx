import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { TOOLS } from "@/lib/tools"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export const revalidate = 3600
export const dynamic = "force-static"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/tools`
  const title = "The Arsenal — 15 free security tools | ClawGuru"
  const description = "Inline security tools for self-hosters: header doctor, TLS x-ray, prompt injection sandbox, and more. No signup, no data retention."

  const imageObjectJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: `${SITE_URL}/og/tools.png`,
    description: "ClawGuru The Arsenal - 15 Free Security Tools - Header Doctor, TLS Xray, Prompt Injection Sandbox",
    author: {
      "@type": "Organization",
      name: "ClawGuru",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    width: 1200,
    height: 630,
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      images: [{
        url: `${SITE_URL}/og/tools.png`,
        width: 1200,
        height: 630,
        alt: "ClawGuru The Arsenal - 15 Free Security Tools - Header Doctor, TLS Xray, Prompt Injection Sandbox"
      }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og/tools.png`]
    },
    alternates: buildLocalizedAlternates(locale, "/tools"),
    robots: "index, follow",
    other: {
      "application/ld+json": JSON.stringify(imageObjectJsonLd),
    },
  }
}

const ACCENT: Record<string, string> = {
  emerald: "border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300",
  cyan:    "border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300",
  violet:  "border-violet-500/30 hover:border-violet-400/60 text-violet-300",
  amber:   "border-amber-500/30 hover:border-amber-400/60 text-amber-300",
  red:     "border-red-500/30 hover:border-red-400/60 text-red-300",
  blue:    "border-blue-500/30 hover:border-blue-400/60 text-blue-300",
  pink:    "border-pink-500/30 hover:border-pink-400/60 text-pink-300",
  lime:    "border-lime-500/30 hover:border-lime-400/60 text-lime-300",
}

export default function ToolsHubPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const prefix = `/${locale}`

  return (
    <div className="min-h-screen bg-[#05070a] text-gray-100">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.1),_transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "80px 80px" }} aria-hidden />

        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <Link href={`${prefix}/academy`} className="text-xs text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-6">← Academy</Link>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-300 text-[10px] font-mono tracking-[0.25em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              THE ARSENAL
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5 tracking-tight">
              Fifteen tools.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-violet-400">Zero signups.</span>
            </h1>
            <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Every inline security tool you wish existed in one place. Nothing is stored. Nothing is tracked. Paste, run, copy the fix.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {TOOLS.map((t) => (
              <Link
                key={t.slug}
                href={`${prefix}/tools/${t.slug}`}
                className={`group block p-5 rounded-xl border bg-white/[0.02] transition-all ${ACCENT[t.accent]} ${t.status === "soon" ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{t.icon}</div>
                  <span className="text-[10px] font-mono tracking-widest opacity-80">
                    {t.status === "live" ? "LIVE" : "SOON"}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-100 mb-1 group-hover:opacity-100">{t.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{t.tagline}</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">{t.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
