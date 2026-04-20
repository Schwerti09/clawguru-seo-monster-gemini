import Container from "@/components/shared/Container"
import type { Locale } from "@/lib/i18n"
import { getHomepageCroCopy } from "@/lib/homepage-cro-i18n"
import { ArrowRight, Calendar, Shield } from "lucide-react"

type Props = { locale: Locale; prefix?: string; dict?: Record<string, string> }

/**
 * Hero — Awareness stage. Two parallel revenue tracks:
 *   Primary (Volume):     /check → Day Pass (€5) → Pro (€29/mo) → Team (€99/mo)
 *   Secondary (Ticket):   /consulting → Strategy Call → Enterprise Deal (€5–50k)
 * Single promise, single benefit line. Trust signals under CTAs (not above — pre-click).
 */
export default function HeroSection({ locale, prefix = "", dict = {} }: Props) {
  const cro = getHomepageCroCopy(locale)
  const isDE = locale === "de"
  const t = {
    badge: dict.hero_badge || (isDE
      ? "Security Intelligence Engine · 4.2M Runbooks · Expert-Reviewed"
      : "Security Intelligence Engine · 4.2M Runbooks · Expert-Reviewed"),
    title: dict.hero_title || cro.heroH1,
    sub: dict.hero_sub || cro.heroSubtitle,
    primary: dict.hero_primary || (isDE ? "Kostenloser Security Check" : "Free Security Check"),
    secondary: isDE ? "Strategy Call buchen" : "Book a Strategy Call",
    trust: dict.hero_note || cro.heroTrustLine,
  }
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--surface-0)" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 0%, rgba(0,255,157,0.08), transparent 45%), radial-gradient(ellipse at 80% 0%, rgba(139,92,246,0.08), transparent 45%)",
          maskImage: "radial-gradient(80% 80% at 50% 40%, black, transparent)",
          opacity: 0.7,
        }}
      />
      <Container>
        <div className="relative z-10 py-16 sm:py-24 text-center max-w-4xl mx-auto">
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-semibold border border-white/10 bg-white/5 text-gray-300 tracking-wide">
            {t.badge}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black leading-tight text-white">{t.title}</h1>
          <p className="mt-5 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">{t.sub}</p>

          {/* Two parallel revenue tracks */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`${prefix}/check`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
              data-track="hero_primary_check"
            >
              <Shield className="h-4 w-4" aria-hidden />
              {t.primary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href={`${prefix}/consulting`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-white/15 hover:border-cyan-400/40 font-bold text-gray-200 transition-all duration-300"
              data-track="hero_secondary_strategy_call"
            >
              <Calendar className="h-4 w-4" aria-hidden />
              {t.secondary}
            </a>
          </div>

          {/* Trust signals below CTAs (post-click-decision reinforcement) */}
          <p className="mt-5 text-xs text-gray-400">
            {t.trust}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-gray-500">
            <span>✓ {isDE ? "Keine Kreditkarte" : "No credit card"}</span>
            <span>✓ {isDE ? "In 30 Sekunden" : "Takes 30 seconds"}</span>
            <span>✓ {isDE ? "DSGVO / EU-Hosting" : "GDPR / EU-hosted"}</span>
            <span>✓ {isDE ? "Von SecOps-Experten geprüft" : "Reviewed by SecOps experts"}</span>
          </div>
        </div>
      </Container>
    </section>
  )
}
