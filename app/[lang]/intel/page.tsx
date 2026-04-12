import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"
import IntelHero from "@/components/intel/IntelHero"
import LiveThreatFeed from "@/components/intel/LiveThreatFeed"
import CveAnalyzer from "@/components/intel/CveAnalyzer"
import StatsDashboard from "@/components/intel/StatsDashboard"
import UpgradeCTA from "@/components/shared/UpgradeCTA"
import IntelFaq from "@/components/intel/IntelFaq"

const PredictiveRadar = dynamic(() => import("@/components/intel/PredictiveRadar"), {
  loading: () => <div className="h-72 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />,
})

const MyceliumPreview = dynamic(() => import("@/components/intel/MyceliumPreview"), {
  loading: () => <div className="h-72 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />,
})

export const revalidate = 300

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return { alternates: buildLocalizedAlternates(locale, "/intel") }
}

export default async function LocaleIntelPage(props: { params: { lang: string } }) {
  const lang = props?.params?.lang
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  const prefix = `/${locale}`
  const dict = await getDictionary(locale)
  const intel = dict.intel || {}
  return (
    <main className="min-h-screen bg-[#05060A]">
      <IntelHero dict={intel} />
      <section className="container mx-auto px-4 py-12 space-y-16">
        <div className="grid md:grid-cols-2 gap-8">
          <LiveThreatFeed prefix={prefix} dict={intel} />
          <CveAnalyzer prefix={prefix} dict={intel} />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <PredictiveRadar prefix={prefix} dict={intel} />
          <MyceliumPreview prefix={prefix} dict={intel} />
        </div>
        <StatsDashboard dict={intel} />
        <IntelFaq dict={intel} />
      </section>
      <UpgradeCTA prefix={prefix} dict={intel} variant="intel" />
    </main>
  )
}
