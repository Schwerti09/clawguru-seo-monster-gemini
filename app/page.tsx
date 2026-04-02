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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

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
                { href: `${prefix}/openclaw`, title: hp.lp_openclaw_title || cro.lpOpenclawTitle, desc: hp.lp_openclaw_desc || cro.lpOpenclawDesc },
                { href: `${prefix}/openclaw-security-check`, title: hp.lp_openclaw_check_title || cro.lpCheckTitle, desc: hp.lp_openclaw_check_desc || cro.lpCheckDesc },
                { href: `${prefix}/moltbot-hardening`, title: hp.lp_moltbot_title || cro.lpMoltbotTitle, desc: hp.lp_moltbot_desc || cro.lpMoltbotDesc },
                { href: `${prefix}/ai-agent-security`, title: hp.lp_ai_title || cro.lpAiTitle, desc: hp.lp_ai_desc || cro.lpAiDesc },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-cyan-400/40 transition-colors"
                >
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">{item.desc}</p>
                </a>
              ))}
            </div>
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
          <TrustSection prefix={prefix} dict={hp} />
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
    </>
  )
}
