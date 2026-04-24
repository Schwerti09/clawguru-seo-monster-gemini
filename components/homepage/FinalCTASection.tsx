import type { Locale } from "@/lib/i18n"
import { getHomepageCroCopy } from "@/lib/homepage-cro-i18n"
import { ArrowRight, Calendar, Shield } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

type Props = { locale: Locale; prefix?: string; dict?: Record<string, string> }

/**
 * Final CTA — Action stage. Last chance to convert.
 * Same twin-track logic as Hero:
 *   Primary (Volume):   /check → Day Pass → Pro/Team MRR
 *   Secondary (Ticket): /consulting → Strategy Call → Enterprise Deal
 * All other homepage CTAs (tools, runbooks, academy) live in body sections.
 */
export default function FinalCTASection({ locale, prefix = "", dict = {} }: Props) {
  const cro = getHomepageCroCopy(locale)
  const isDE = locale === "de"
  const title = dict.final_cta_title || cro.finalTitle
  const sub = dict.final_cta_sub || cro.finalSub
  const primary = dict.final_cta_primary || (pick(isDE, "Kostenlosen Check starten", "Start free check"))
  const secondary = pick(isDE, "Strategy Call buchen", "Book a Strategy Call")

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: "var(--surface-0)" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 50%, rgba(0,255,157,0.06), transparent 60%)",
        }}
      />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
          {title}
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          {sub}
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          <a
            href={`${prefix}/check`}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            data-track="final_cta_primary_check"
          >
            <Shield className="h-4 w-4" aria-hidden />
            {primary}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href={`${prefix}/consulting`}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl border border-white/15 hover:border-cyan-400/40 font-bold text-gray-200 transition-all duration-300"
            data-track="final_cta_secondary_strategy_call"
          >
            <Calendar className="h-4 w-4" aria-hidden />
            {secondary}
          </a>
        </div>
        <p className="mt-5 text-xs text-gray-500">
          {pick(isDE, "Keine Kreditkarte · 30 Sekunden · DSGVO / EU-Hosting", "No credit card · 30 seconds · GDPR / EU-hosted")}
        </p>
      </div>
    </section>
  )
}
