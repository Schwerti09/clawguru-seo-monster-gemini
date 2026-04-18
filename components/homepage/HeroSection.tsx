import Container from "@/components/shared/Container"
import type { Locale } from "@/lib/i18n"
import { getHomepageCroCopy } from "@/lib/homepage-cro-i18n"

type Props = { locale: Locale; prefix?: string; dict?: Record<string, string> }

export default function HeroSection({ locale, prefix = "", dict = {} }: Props) {
  const cro = getHomepageCroCopy(locale)
  const t = {
    badge: dict.hero_badge || "Mycelial Engine · 4.2 M Runbooks · Executable Security Content",
    title: dict.hero_title || cro.heroH1,
    sub: dict.hero_sub || cro.heroSubtitle,
    primary: dict.hero_primary || cro.heroPrimaryCta,
    secondary: dict.hero_secondary || cro.heroSecondaryCta,
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
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`${prefix}/check`}
              className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 text-white text-center"
            >
              {t.primary}
            </a>
            <a
              href={`${prefix}/roast-my-moltbot`}
              className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300"
            >
              {t.secondary}
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            {t.trust}
          </p>
        </div>
      </Container>
    </section>
  )
}
