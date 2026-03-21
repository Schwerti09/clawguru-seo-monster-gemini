import type { Metadata } from "next"
import dynamic from "next/dynamic"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import OracleHero from "@/components/oracle/OracleHero"
import HowItWorks from "@/components/oracle/HowItWorks"
import UpgradeCTA from "@/components/oracle/UpgradeCTA"

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

export default function LocaleOraclePage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const prefix = `/${locale}`
  return (
    <div className="space-y-6">
      <OracleHero prefix={prefix} />
      <section className="py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <OraclePageClient />
        </div>
      </section>
      <section className="py-4">
        <div className="px-4 sm:px-6 lg:px-8">
          <HowItWorks />
        </div>
      </section>
      <section className="py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <UpgradeCTA prefix={prefix} />
        </div>
      </section>
    </div>
  )
}
