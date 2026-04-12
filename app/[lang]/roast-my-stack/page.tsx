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
      </Container>
    </main>
  )
}
