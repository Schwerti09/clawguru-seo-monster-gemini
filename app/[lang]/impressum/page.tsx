import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { metadata as rootMetadata } from "@/app/impressum/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return { ...(rootMetadata as Metadata), alternates: buildLocalizedAlternates(locale, "/impressum") }
}

export default function LocaleImpressumPage() {
  return (
    <div className="min-h-screen bg-black text-white py-24 font-mono">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-black tracking-tighter mb-12 text-cyan-400">IMPRESSUM</h1>

        <div className="prose prose-invert max-w-none text-lg leading-relaxed">
          <p className="text-2xl font-light mb-10">
            <strong>ClawGuru Mycelium Security Intelligence</strong><br />
            Mycelium Tower • Karklandsweg 1 • 26553 Dornum • Germany
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-semibold mb-3 text-cyan-300">Founder & Full-Stack Developer</h2>
              <p className="text-xl">Rolf Schwertfechter</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 text-cyan-300">Kontakt</h2>
              <p className="text-xl">
                E-Mail: <a href="mailto:legal@clawguru.org" className="hover:text-cyan-400">legal@clawguru.org</a>
              </p>
            </div>
          </div>

          <div className="my-12 border-t border-white/10 pt-12">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Steuerangaben</h2>
            <p className="text-xl opacity-70">Ust.IdNr.DE275823159</p>
          </div>

          <div className="my-12 border-t border-white/10 pt-12 text-sm opacity-75">
            <p>
              Die auf dieser Plattform bereitgestellten Runbooks, Analysen und Threat-Intelligence-Daten dienen ausschließlich zu Informationszwecken und ersetzen keine professionelle Beratung. 
              ClawGuru Mycelium Security Intelligence übernimmt keine Haftung für Schäden, die aus der Nutzung der Inhalte entstehen könnten.
            </p>
            <p className="mt-6">© 2026 ClawGuru Mycelium Security Intelligence GmbH. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
