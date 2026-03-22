import type { Metadata } from "next"
import dynamic from "next/dynamic"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"
import SummonHero from "@/components/summon/SummonHero"
import HowItWorks from "@/components/summon/HowItWorks"
import UpgradeCTA from "@/components/shared/UpgradeCTA"

const SummonRealClient = dynamic(() => import("@/components/summon/SummonRealClient"), { ssr: false })

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return {
    alternates: { canonical: `/${locale}/summon` },
  }
}

export default async function LocaleSummonPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const prefix = `/${locale}`
  const dict = await getDictionary(locale)
  const summon = dict.summon || {}
  const common = dict.common || {}
  return (
    <div className="space-y-6">
      <SummonHero prefix={prefix} dict={summon} />
      <section className="py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <SummonRealClient prefix={prefix} dict={summon} />
        </div>
      </section>
      <section className="py-4">
        <div className="px-4 sm:px-6 lg:px-8">
          <HowItWorks dict={summon} />
        </div>
      </section>
      <section className="py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <UpgradeCTA prefix={prefix} dict={summon} />
        </div>
      </section>
    </div>
  )
}
