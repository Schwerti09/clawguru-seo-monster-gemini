import Container from "@/components/shared/Container"
import dynamic from "next/dynamic"
import HeroSecurityCheck from "@/components/marketing/HeroSecurityCheck"
import SectionTitle from "@/components/shared/SectionTitle"
import LivePreview from "@/components/pages/LivePreview"
import FAQ from "@/components/marketing/FAQ"
import TransparencyWidget from "@/components/marketing/TransparencyWidget"
import type { Dictionary } from "@/lib/getDictionary"
import type { Locale } from "@/lib/i18n"
import HeroSection from "@/components/homepage/HeroSection"
import HowItWorks from "@/components/homepage/HowItWorks"
import TrustSection from "@/components/homepage/TrustSection"
import PricingSection from "@/components/homepage/PricingSection"

interface HomeProps {
  dict: Dictionary
  locale: Locale
}

export default function Home({ dict, locale }: HomeProps) {
  const prefix = `/${locale}`
  const faq = (dict as any)?.faq ?? {
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

      <HeroSection prefix={prefix} locale={locale} />

      <section id="live-previews" className="py-14" style={{ background: "var(--surface-0)" }}>
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Erlebe ClawGuru live – ohne Registrierung</h2>
            <p className="mt-2 text-gray-400">Teste die Kern‑Features direkt hier. Sieh, wie wir Probleme lösen, Risiken vorhersagen und Infrastruktur härten.</p>
          </div>
          <FeatureShowcase prefix={prefix} />
        </Container>
      </section>

      <section className="py-14" style={{ background: "var(--surface-1)" }}>
        <Container>
          <HowItWorks locale={locale} />
        </Container>
      </section>

      <section className="py-14" style={{ background: "var(--surface-0)" }}>
        <Container>
          <TrustSection prefix={prefix} locale={locale} />
        </Container>
      </section>

      <section className="py-14" style={{ background: "var(--surface-1)" }}>
        <Container>
          <PricingSection prefix={prefix} locale={locale} dict={(dict as any)?.pricing} />
        </Container>
      </section>


      {/* Security check – luxury glass card */}
      <section className="relative py-16 border-b border-white/5 overflow-hidden" style={{ background: "var(--surface-1)" }}>
        <div className="pointer-events-none absolute inset-0 bg-vault-gradient opacity-60" aria-hidden="true" />
        <Container>
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <HeroSecurityCheck />
            <LivePreview />
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
              <TransparencyWidget />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
