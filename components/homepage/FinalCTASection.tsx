import type { Locale } from "@/lib/i18n"
import { getHomepageCroCopy } from "@/lib/homepage-cro-i18n"

type Props = { locale: Locale; prefix?: string; dict?: Record<string, string> }

export default function FinalCTASection({ locale, prefix = "", dict = {} }: Props) {
  const cro = getHomepageCroCopy(locale)
  return (
    <section className="py-20" style={{ background: "var(--surface-0)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
          {dict.final_cta_title || cro.finalTitle}
        </h2>
        <p className="text-lg text-gray-400 mb-8">
          {dict.final_cta_sub || cro.finalSub}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`${prefix}/check`}
            className="px-8 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 text-white text-center"
          >
            {dict.final_cta_primary || cro.finalPrimary}
          </a>
          <a
            href={`${prefix}/openclaw`}
            className="px-8 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300"
          >
            {dict.final_cta_secondary || cro.finalSecondary}
          </a>
        </div>
      </div>
    </section>
  )
}