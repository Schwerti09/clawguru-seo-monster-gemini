import Container from "@/components/shared/Container"
import dynamic from "next/dynamic"
import HeroSecurityCheck from "@/components/marketing/HeroSecurityCheck"
import SectionTitle from "@/components/shared/SectionTitle"
import LivePreview from "@/components/pages/LivePreview"
import FAQ from "@/components/marketing/FAQ"
import TransparencyWidget from "@/components/marketing/TransparencyWidget"
import { getDictionary } from "@/lib/getDictionary"
import type { Dictionary } from "@/lib/getDictionary"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import HeroSection from "@/components/homepage/HeroSection"
import HowItWorks from "@/components/homepage/HowItWorks"
import TrustSection from "@/components/homepage/TrustSection"
import PricingSection from "@/components/homepage/PricingSection"
import ProblemSection from "@/components/homepage/ProblemSection"
import SolutionSection from "@/components/homepage/SolutionSection"
import ToolsSection from "@/components/homepage/ToolsSection"
import WhySection from "@/components/homepage/WhySection"
import FinalCTASection from "@/components/homepage/FinalCTASection"
import RoastMyStack from "@/components/roast/RoastMyStack"
import { getHomepageCroCopy } from "@/lib/homepage-cro-i18n"
import GeoOpenClawSprintHubSection from "@/components/marketing/GeoOpenClawSprintHubSection"

interface HomeProps {
  dict?: Dictionary
  locale?: Locale
}

export default async function Home({ dict, locale }: HomeProps = {}) {
  const safeLocale = locale ?? DEFAULT_LOCALE
  const safeDict = dict ?? (await getDictionary(safeLocale))
  const prefix = `/${safeLocale}`
  const hp = (safeDict as any)?.homepage ?? {}
  const cro = getHomepageCroCopy(safeLocale)
  const faq = (safeDict as any)?.faq ?? {
    kicker: "",
    title: "",
    subtitle: "",
    q1: "",
    a1: "",
    q2: "",
    a2: "",
    q3: "",
    a3: "",
    q4: "",
    a4: "",
  }

  const FeatureShowcase = dynamic(() => import("@/components/FeatureShowcase"), {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-96 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
        <div className="h-96 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
      </div>
    ),
  })

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: faq.q1,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a1,
        }
      },
      {
        "@type": "Question",
        name: faq.q2,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a2,
        }
      },
      {
        "@type": "Question",
        name: faq.q3,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a3,
        }
      },
      {
        "@type": "Question",
        name: faq.q4,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a4,
        },
      },
    ]
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: safeLocale === 'de' ? 'Startseite' : 'Home',
        item: `https://clawguru.org/${safeLocale}`,
      },
    ],
  }

  const combinedSchema = [faqJsonLd, breadcrumbJsonLd]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }} />

      <HeroSection locale={safeLocale} prefix={prefix} dict={hp} />

      <section className="py-12 border-b border-white/5" style={{ background: "var(--surface-1)" }}>
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {hp.lp_hub_title || cro.lpHubTitle}
              </h2>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                {hp.lp_hub_sub || cro.lpHubSub}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: `${prefix}/openclaw`, title: hp.lp_openclaw_title || cro.lpOpenclawTitle, desc: hp.lp_openclaw_desc || cro.lpOpenclawDesc, urgent: true },
                { href: `${prefix}/check`, title: hp.lp_openclaw_check_title || cro.lpCheckTitle, desc: hp.lp_openclaw_check_desc || cro.lpCheckDesc, urgent: true },
                { href: `${prefix}/moltbot-hardening`, title: hp.lp_moltbot_title || cro.lpMoltbotTitle, desc: hp.lp_moltbot_desc || cro.lpMoltbotDesc, urgent: false },
                { href: `${prefix}/ai-agent-security`, title: hp.lp_ai_title || cro.lpAiTitle, desc: hp.lp_ai_desc || cro.lpAiDesc, urgent: false },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-cyan-400/40 transition-colors relative ${item.urgent ? 'ring-1 ring-cyan-400/30' : ''}`}
                >
                  {item.urgent && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      {safeLocale === 'de' ? 'JETZT' : 'NOW'}
                    </div>
                  )}
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">{item.desc}</p>
                </a>
              ))}
            </div>
            {(safeLocale === "de" || safeLocale === "en") && (
              <div className="mt-10">
                <GeoOpenClawSprintHubSection locale={safeLocale} prefix={prefix} />
              </div>
            )}
          </div>
        </Container>
      </section>

      <section id="roast-my-stack" className="relative py-16 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
        <Container>
          <RoastMyStack locale={safeLocale} prefix={prefix} dict={(safeDict as { roast?: Record<string, string> } | undefined)?.roast} />
        </Container>
      </section>

      <ProblemSection dict={hp} />

      <SolutionSection prefix={prefix} dict={hp} />

      <ToolsSection prefix={prefix} dict={hp} />

      <WhySection dict={hp} />

      <section id="live-previews" className="py-14" style={{ background: "var(--surface-0)" }}>
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white">{hp.live_title || 'Experience ClawGuru live'}</h2>
            <p className="mt-2 text-gray-400">{hp.live_sub || ''}</p>
          </div>
          <FeatureShowcase prefix={prefix} dict={hp} />
        </Container>
      </section>

      <section className="py-14" style={{ background: "var(--surface-1)" }}>
        <Container>
          <HowItWorks dict={hp} />
        </Container>
      </section>

      <section className="py-14" style={{ background: "var(--surface-0)" }}>
        <Container>
          <TrustSection locale={safeLocale} prefix={prefix} dict={hp} />
        </Container>
      </section>

      <section className="py-14" style={{ background: "var(--surface-1)" }}>
        <Container>
          <PricingSection prefix={prefix} dict={hp} />
        </Container>
      </section>


      {/* Security check – luxury glass card */}
      <section className="relative py-16 border-b border-white/5 overflow-hidden" style={{ background: "var(--surface-1)" }}>
        <div className="pointer-events-none absolute inset-0 bg-vault-gradient opacity-60" aria-hidden="true" />
        <Container>
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <HeroSecurityCheck dict={hp} />
            <LivePreview dict={hp} />
          </div>
        </Container>
      </section>

      {/* TOTAL WAR ROUND 5: Aggressive Conversion Section */}
      <section className="py-16" style={{ background: "var(--surface-0)" }}>
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-xs font-mono uppercase tracking-widest mb-2 text-cyan-400">
                {safeLocale === 'de' ? '🎯 Starte jetzt' : '🎯 Get Started Now'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {safeLocale === 'de' ? 'Master AI Agent Security' : 'Master AI Agent Security'}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href={`${prefix}/academy`} className="block bg-gradient-to-r from-purple-600 to-purple-500 border border-purple-400 rounded-xl p-6 hover:from-purple-500 hover:to-purple-400 transition-all">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🎓</div>
                  <div>
                    <div className="font-bold text-white text-lg">{safeLocale === 'de' ? 'Academy' : 'Academy'}</div>
                    <div className="text-purple-100 text-sm">{safeLocale === 'de' ? 'Kurse & Zertifizierung' : 'Courses & Certification'}</div>
                  </div>
                </div>
              </a>
              <a href={`${prefix}/solutions`} className="block bg-gradient-to-r from-emerald-600 to-emerald-500 border border-emerald-400 rounded-xl p-6 hover:from-emerald-500 hover:to-emerald-400 transition-all">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🏢</div>
                  <div>
                    <div className="font-bold text-white text-lg">{safeLocale === 'de' ? 'Enterprise Solutions' : 'Enterprise Solutions'}</div>
                    <div className="text-emerald-100 text-sm">{safeLocale === 'de' ? 'Für Teams & Unternehmen' : 'For Teams & Enterprises'}</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* FINAL EXECUTION ROUND 10: Viral CTAs + Academy/Solutions */}
      <section className="py-16" style={{ background: "var(--surface-0)" }}>
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-xs font-mono uppercase tracking-widest mb-2 text-cyan-400">
                {safeLocale === 'de' ? ' Starte jetzt' : ' Get Started Now'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {safeLocale === 'de' ? 'Master AI Agent Security' : 'Master AI Agent Security'}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href={`${prefix}/roast-my-moltbot`} className="block bg-gradient-to-r from-red-600 to-red-500 border border-red-400 rounded-xl p-6 hover:from-red-500 hover:to-red-400 transition-all relative">
                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  {safeLocale === 'de' ? 'JETZT' : 'NOW'}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl"></div>
                  <div>
                    <div className="font-bold text-white text-lg">{safeLocale === 'de' ? 'Roast My Moltbot' : 'Roast My Moltbot'}</div>
                    <div className="text-red-100 text-sm">{safeLocale === 'de' ? 'Kostenloser Security-Roast' : 'Free security roast'}</div>
                  </div>
                </div>
              </a>
              <a href={`${prefix}/check`} className="block bg-gradient-to-r from-cyan-600 to-cyan-500 border border-cyan-400 rounded-xl p-6 hover:from-cyan-500 hover:to-cyan-400 transition-all relative">
                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  {safeLocale === 'de' ? 'JETZT' : 'NOW'}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl"></div>
                  <div>
                    <div className="font-bold text-white text-lg">{safeLocale === 'de' ? 'Security Check' : 'Security Check'}</div>
                    <div className="text-cyan-100 text-sm">{safeLocale === 'de' ? 'Claw Score in 30 Sekunden' : 'Claw Score in 30 seconds'}</div>
                  </div>
                </div>
              </a>
              <a href={`${prefix}/academy`} className="block bg-gradient-to-r from-purple-600 to-purple-500 border border-purple-400 rounded-xl p-6 hover:from-purple-500 hover:to-purple-400 transition-all">
                <div className="flex items-center gap-4">
                  <div className="text-4xl"></div>
                  <div>
                    <div className="font-bold text-white text-lg">{safeLocale === 'de' ? 'Academy' : 'Academy'}</div>
                    <div className="text-purple-100 text-sm">{safeLocale === 'de' ? 'Kurse & Zertifizierung' : 'Courses & Certification'}</div>
                  </div>
                </div>
              </a>
              <a href={`${prefix}/solutions`} className="block bg-gradient-to-r from-emerald-600 to-emerald-500 border border-emerald-400 rounded-xl p-6 hover:from-emerald-500 hover:to-emerald-400 transition-all">
                <div className="flex items-center gap-4">
                  <div className="text-4xl"></div>
                  <div>
                    <div className="font-bold text-white text-lg">{safeLocale === 'de' ? 'Enterprise Solutions' : 'Enterprise Solutions'}</div>
                    <div className="text-emerald-100 text-sm">{safeLocale === 'de' ? 'Für Teams & Unternehmen' : 'For Teams & Enterprises'}</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* FINAL EXECUTION ROUND 10: Mycelium Kreislauf */}
      <section className="py-16" style={{ background: "var(--surface-1)" }}>
        <Container>
          <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-lg font-bold text-white mb-4 text-center">
              {safeLocale === "de" ? "Mycelium Kreislauf" : "Mycelium Circle"}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href={`${prefix}/runbooks`} className="group bg-gradient-to-br from-cyan-900/30 to-[#0a0a0a] p-4 rounded-xl border border-cyan-700/50 hover:border-cyan-500 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl"></span>
                  <div>
                    <div className="font-semibold text-cyan-400 group-hover:text-cyan-300">{safeLocale === "de" ? "Security Runbooks" : "Security Runbooks"}</div>
                    <div className="text-xs text-gray-400">{safeLocale === "de" ? "1,000+ Fix-Runbooks" : "1,000+ fix runbooks"}</div>
                  </div>
                </div>
              </a>
              <a href={`${prefix}/openclaw`} className="group bg-gradient-to-br from-green-900/30 to-[#0a0a0a] p-4 rounded-xl border border-green-700/50 hover:border-green-500 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl"></span>
                  <div>
                    <div className="font-semibold text-green-400 group-hover:text-green-300">{safeLocale === "de" ? "OpenClaw" : "OpenClaw"}</div>
                    <div className="text-xs text-gray-400">{safeLocale === "de" ? "Self-Hosted Security" : "Self-hosted security"}</div>
                  </div>
                </div>
              </a>
              <a href={`/oracle`} className="group bg-gradient-to-br from-amber-900/30 to-[#0a0a0a] p-4 rounded-xl border border-amber-700/50 hover:border-amber-500 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl"></span>
                  <div>
                    <div className="font-semibold text-amber-400 group-hover:text-amber-300">{safeLocale === "de" ? "Oracle" : "Oracle"}</div>
                    <div className="text-xs text-gray-400">{safeLocale === "de" ? "KI-Intelligenz" : "AI Intelligence"}</div>
                  </div>
                </div>
              </a>
              <a href={`/neuro`} className="group bg-gradient-to-br from-purple-900/30 to-[#0a0a0a] p-4 rounded-xl border border-purple-700/50 hover:border-purple-500 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl"></span>
                  <div>
                    <div className="font-semibold text-purple-400 group-hover:text-purple-300">{safeLocale === "de" ? "Neuro" : "Neuro"}</div>
                    <div className="text-xs text-gray-400">{safeLocale === "de" ? "Predictive Security" : "Predictive security"}</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <SectionTitle
                kicker={faq.kicker}
                title={faq.title}
                subtitle={faq.subtitle}
              />
              <FAQ dict={faq} />
            </div>
            <div>
              <TransparencyWidget dict={hp} />
            </div>
          </div>
        </Container>
      </section>

      <FinalCTASection locale={safeLocale} prefix={prefix} dict={hp} />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/80 px-3 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-2">
          <a
            href={`${prefix}/check`}
            className="flex-1 rounded-xl bg-cyan-500 px-4 py-2.5 text-center text-sm font-bold text-black"
          >
            {hp.sticky_check_cta || cro.stickyCheckCta}
          </a>
          <a
            href={`${prefix}/runbooks`}
            className="flex-1 rounded-xl border border-white/20 px-4 py-2.5 text-center text-sm font-semibold text-white"
          >
            {hp.sticky_runbooks_cta || cro.stickyRunbooksCta}
          </a>
        </div>
      </div>
    </>
  )
}
