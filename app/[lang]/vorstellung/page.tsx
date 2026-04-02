import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"
import VorstellungClient from "@/components/vorstellung/VorstellungClient"

export const revalidate = 60
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const dynamicParams = false

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return {
    alternates: buildLocalizedAlternates(locale, "/vorstellung")
  }
}

export default async function LocaleVorstellungPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const dict = await getDictionary(locale)
  const v = (dict?.vorstellung || null) as unknown as Record<string, unknown> | null
  return <VorstellungClient dict={v as any} />
}
