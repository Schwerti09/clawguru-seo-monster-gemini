import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
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
import FinalCTASection from "@/components/homepage/FinalCTASection"
import RoastMyStack from "@/components/roast/RoastMyStack"

interface HomeProps {
  dict?: Dictionary
  locale?: Locale
}

/**
 * Homepage — 9-Section Revenue Funnel (AIDA)
 *
 *  1. Hero                 AWARENESS   → 1 Promise, 2 parallel CTAs (Free Check / Book Call)
 *  2. Problem              INTEREST    → Name the pain
 *  3. Solution             INTEREST    → Show the relief
 *  4. RoastMyStack         DESIRE      → Interactive demo — the "GitHub-badge" viral hook
 *  5. Tools Ecosystem      DESIRE      → 6 consolidated tool tiles (ONE source of truth)
 *  6. HowItWorks           DESIRE      → 3 steps, reduce friction
 *  7. Trust                DESIRE      → Compliance, stats, social proof, AuthorBox
 *  8. Pricing              ACTION      → 3 tiers + Day Pass urgency
 *  9. FAQ + Transparency   ACTION      → Kill objections
 * 10. Final CTA            ACTION      → Last chance: Free Check OR Strategy Call
 *
 * Anything not in the above list lives on its own page (city pages, mycelium kreislauf,
 * landing-page hub) — linked from Footer, not Homepage. See USER-TODO.md + docs/seo/eeat-strategy.md.
 */
export default async function Home({ dict, locale }: HomeProps = {}) {
  const safeLocale = locale ?? DEFAULT_LOCALE
  const safeDict = dict ?? (await getDictionary(safeLocale))
  const prefix = `/${safeLocale}`
  const hp = (safeDict as any)?.homepage ?? {}
  const faq = (safeDict as any)?.faq ?? {
    kicker: "", title: "", subtitle: "",
    q1: "", a1: "", q2: "", a2: "", q3: "", a3: "", q4: "", a4: "",
  }

  // FAQ + Breadcrumb schema (E-E-A-T)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: faq.q1, acceptedAnswer: { "@type": "Answer", text: faq.a1 } },
      { "@type": "Question", name: faq.q2, acceptedAnswer: { "@type": "Answer", text: faq.a2 } },
      { "@type": "Question", name: faq.q3, acceptedAnswer: { "@type": "Answer", text: faq.a3 } },
      { "@type": "Question", name: faq.q4, acceptedAnswer: { "@type": "Answer", text: faq.a4 } },
    ],
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: safeLocale === "de" ? "Startseite" : "Home",
        item: `https://clawguru.org/${safeLocale}`,
      },
    ],
  }

  const combinedSchema = [faqJsonLd, breadcrumbJsonLd]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }} />

      {/* 1. AWARENESS — Hero */}
      <HeroSection locale={safeLocale} prefix={prefix} dict={hp} />

      {/* 2. INTEREST — Problem */}
      <ProblemSection dict={hp} />

      {/* 3. INTEREST — Solution */}
      <SolutionSection prefix={prefix} dict={hp} />

      {/* 4. DESIRE — Interactive Demo (Roast My Stack) */}
      <section id="roast-my-stack" className="relative py-16 border-y border-white/5" style={{ background: "var(--surface-0)" }}>
        <Container>
          <RoastMyStack
            locale={safeLocale}
            prefix={prefix}
            dict={(safeDict as { roast?: Record<string, string> } | undefined)?.roast}
          />
        </Container>
      </section>

      {/* 5. DESIRE — Tools Ecosystem (ONE consolidated section) */}
      <ToolsSection prefix={prefix} dict={hp} />

      {/* 6. DESIRE — How It Works */}
      <section className="py-14" style={{ background: "var(--surface-1)" }}>
        <Container>
          <HowItWorks dict={hp} />
        </Container>
      </section>

      {/* 7. DESIRE — Trust / Social Proof */}
      <section className="py-14" style={{ background: "var(--surface-0)" }}>
        <Container>
          <TrustSection locale={safeLocale} prefix={prefix} dict={hp} />
        </Container>
      </section>

      {/* 8. ACTION — Pricing */}
      <section className="py-14" style={{ background: "var(--surface-1)" }}>
        <Container>
          <PricingSection prefix={prefix} dict={hp} />
        </Container>
      </section>

      {/* 9. ACTION — FAQ + Transparency (objection removal) */}
      <section className="py-16" style={{ background: "var(--surface-0)" }}>
        <Container>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <SectionTitle kicker={faq.kicker} title={faq.title} subtitle={faq.subtitle} />
              <FAQ dict={faq} />
            </div>
            <div>
              <TransparencyWidget dict={hp} />
            </div>
          </div>
        </Container>
      </section>

      {/* 10. ACTION — Final CTA (parallel tracks: Low-Commit Free Check / High-Ticket Strategy Call) */}
      <FinalCTASection locale={safeLocale} prefix={prefix} dict={hp} />

      {/* Mobile sticky bottom CTA bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/80 px-3 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-2">
          <a
            href={`${prefix}/check`}
            className="flex-1 rounded-xl bg-cyan-500 px-4 py-2.5 text-center text-sm font-bold text-black"
          >
            {safeLocale === "de" ? "Kostenloser Check" : "Free Check"}
          </a>
          <a
            href={`${prefix}/consulting`}
            className="flex-1 rounded-xl border border-white/20 px-4 py-2.5 text-center text-sm font-semibold text-white"
          >
            {safeLocale === "de" ? "Strategy Call" : "Strategy Call"}
          </a>
        </div>
      </div>
    </>
  )
}
