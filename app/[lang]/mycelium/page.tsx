import type { Metadata } from "next"
import NextDynamic from "next/dynamic"

import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import Container from "@/components/shared/Container"
import MyceliumShareCard from "@/components/share/MyceliumShareCard"
import { getDictionary } from "@/lib/dictionary"
import MyceliumHero from "@/components/mycelium/MyceliumHero"
import ExampleNodes from "@/components/mycelium/ExampleNodes"

const MyceliumVisualizationWrapper = NextDynamic(() => import("@/components/mycelium/MyceliumVisualizationWrapper"))

export const dynamic = "force-static"
export const revalidate = 3600
export const dynamicParams = false
export const runtime = "nodejs"
export const maxDuration = 180

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return {
    alternates: buildLocalizedAlternates(locale, "/mycelium")
  }
}

export default async function LocaleMyceliumPage(props: { params: { lang: string } }) {
  const lang = props?.params?.lang
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : DEFAULT_LOCALE) as Locale
  const dict = await getDictionary(locale)
  const prefix = `/${locale}`

  return (
    <>
      <MyceliumHero prefix={prefix} dict={dict?.mycelium} />

      <section className="container mx-auto px-4 py-12">
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <MyceliumVisualizationWrapper />
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">{dict?.mycelium?.how_title || "Wie Mycelium funktioniert"}</h2>
            <p className="mt-4 text-gray-300">{dict?.mycelium?.how_text || "Jeder Knoten im Netzwerk ist ein Runbook, jede Verbindung zeigt gemeinsame Tags, betroffene Services oder CVEs. So erkennst du auf einen Blick, welche Sicherheitslücken zusammenhängen und in welcher Reihenfolge du sie beheben solltest."}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="text-cyan-400 text-2xl mb-2">{dict?.mycelium?.pro_tip_title || "🔍 Pro‑Tipp"}</div>
            <p className="text-gray-300">{dict?.mycelium?.pro_tip_text || "Klicke auf einen Knoten, um zum Runbook zu gelangen. Mit einem Daypass kannst du den gesamten Graphen als interaktives HTML exportieren und in dein Team teilen."}</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <h3 className="text-xl font-semibold text-center text-white mb-4">{dict?.mycelium?.popular_nodes_title || "Beliebte Runbooks im Netzwerk"}</h3>
        <ExampleNodes prefix={prefix} />
      </section>

      <div className="py-8 border-t border-white/5">
        <Container>
          <MyceliumShareCard locale={locale} title="Live Ops Wall · ClawGuru" pageUrl={`${prefix}/mycelium`} className="max-w-2xl" />
        </Container>
      </div>
    </>
  )
}
