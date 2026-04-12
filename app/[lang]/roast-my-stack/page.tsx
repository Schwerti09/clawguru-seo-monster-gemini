import type { Metadata } from "next"

import RoastMyStack from "@/components/roast/RoastMyStack"
import Container from "@/components/shared/Container"
import { getDictionary } from "@/lib/getDictionary"
import { SUPPORTED_LOCALES, buildLocalizedAlternates, type Locale } from "@/lib/i18n"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const dict = await getDictionary(locale)
  const r = (dict as { roast?: Record<string, string> }).roast ?? {}
  const title = r.meta_title || r.title || "Roast My Stack"
  const description = r.meta_description || r.subtitle || ""

  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, "/roast-my-stack"),
    openGraph: {
      images: ["/og-image.png"],
      title,
      description,
      url: `https://clawguru.org/${locale}/roast-my-stack`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function RoastMyStackPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const dict = await getDictionary(locale)
  const r = (dict as { roast?: Record<string, string> }).roast ?? {}
  const prefix = `/${locale}`

  return (
    <main className="py-14 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
      <Container>
        <header className="mx-auto max-w-3xl text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-cyan-300 bg-clip-text text-transparent">
              {r.title}
            </span>
          </h1>
          {r.page_intro ? (
            <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">{r.page_intro}</p>
          ) : null}
        </header>
        <RoastMyStack
          locale={locale}
          prefix={prefix}
          dict={r}
          showDedicatedPageLink={false}
          showTitleBlock={false}
        />

        {/* Example Stacks */}
        {r.examples_heading && (
          <section className="mt-14 max-w-3xl mx-auto">
            <h2 className="text-lg font-bold text-gray-100 mb-4">{r.examples_heading}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: r.example_1_label, stack: r.example_1_stack },
                { label: r.example_2_label, stack: r.example_2_stack },
                { label: r.example_3_label, stack: r.example_3_stack },
              ].map((ex) => (
                <div key={ex.label} className="rounded-xl border border-amber-900/30 bg-amber-950/10 p-4">
                  <p className="text-sm font-semibold text-amber-300 mb-2">{ex.label}</p>
                  <p className="text-xs text-gray-400 leading-relaxed font-mono">{ex.stack}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {r.faq_heading && (
          <section className="mt-12 max-w-3xl mx-auto">
            <h2 className="text-lg font-bold text-gray-100 mb-5">{r.faq_heading}</h2>
            <div className="space-y-3">
              {[
                { q: r.faq_q1, a: r.faq_a1 },
                { q: r.faq_q2, a: r.faq_a2 },
                { q: r.faq_q3, a: r.faq_a3 },
                { q: r.faq_q4, a: r.faq_a4 },
              ].filter(item => item.q).map((item) => (
                <div key={item.q} className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
                  <p className="font-semibold text-sm text-white mb-1">{item.q}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: [
                    { q: r.faq_q1, a: r.faq_a1 },
                    { q: r.faq_q2, a: r.faq_a2 },
                    { q: r.faq_q3, a: r.faq_a3 },
                    { q: r.faq_q4, a: r.faq_a4 },
                  ].filter(i => i.q).map(i => ({
                    "@type": "Question",
                    name: i.q,
                    acceptedAnswer: { "@type": "Answer", text: i.a },
                  })),
                }),
              }}
            />
          </section>
        )}
      </Container>
    </main>
  )
}
