import type { Metadata } from "next"
import dynamic from "next/dynamic"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionary"
import OracleHero from "@/components/oracle/OracleHero"
import HowItWorks from "@/components/oracle/HowItWorks"
import UpgradeCTA from "@/components/shared/UpgradeCTA"

const OraclePageClient = dynamic(() => import("@/components/oracle/OraclePageClient"), { ssr: false })

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return {
    alternates: { canonical: `/${locale}/oracle` },
  }
}

export default async function LocaleOraclePage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const prefix = `/${locale}`
  const dict = await getDictionary(locale)
  const oracle = dict.oracle || {}
  const common = dict.common || {}
  return (
    <div className="space-y-6">
      <OracleHero prefix={prefix} dict={oracle} />
      <section className="py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <OraclePageClient dict={oracle} />
        </div>
      </section>
      <section className="py-4">
        <div className="px-4 sm:px-6 lg:px-8">
          <HowItWorks dict={oracle} />
        </div>
      </section>
      <section className="py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <UpgradeCTA prefix={prefix} dict={oracle} />
        </div>
      </section>
    </div>
  )
}
