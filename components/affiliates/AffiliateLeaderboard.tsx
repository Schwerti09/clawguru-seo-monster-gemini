import Container from "@/components/shared/Container"
import { generateAffiliateLeaderboard } from "@/lib/affiliates"
import { type Locale, SUPPORTED_LOCALES, t, localeDir, LOCALE_HREFLANG } from "@/lib/i18n"

const LEADERBOARD = generateAffiliateLeaderboard(60)

function rankTone(rank: number) {
  if (rank === 1) return "text-yellow-400"
  if (rank <= 3) return "text-emerald-300"
  if (rank <= 10) return "text-brand-cyan"
  return "text-gray-400"
}

function formatPayout(value: number, locale: Locale) {
  const tag = LOCALE_HREFLANG[locale] ?? "de"
  return new Intl.NumberFormat(tag, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function AffiliateLeaderboard({ locale = "de" }: { locale?: Locale }) {
  const resolvedLocale: Locale = SUPPORTED_LOCALES.includes(locale) ? locale : "de"

  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto" dir={localeDir(resolvedLocale)}>
        <div className="mb-2 text-xs text-gray-500 uppercase tracking-widest">
          {t(resolvedLocale, "affiliateWarRoom")}
        </div>
        <h1 className="text-4xl font-black mb-2">
          {t(resolvedLocale, "affiliateTitle")}
        </h1>
        <p className="text-gray-400 mb-10">
          {t(resolvedLocale, "affiliateSubtitle")}
        </p>

        <div className="rounded-2xl border border-gray-800 overflow-hidden">
          <div className="grid grid-cols-[3rem_1fr_auto_auto_auto] gap-0 bg-gray-900/60 px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-wider">
            <span>{t(resolvedLocale, "affiliateRank")}</span>
            <span>{t(resolvedLocale, "affiliatePartner")}</span>
            <span className="text-right pr-6">{t(resolvedLocale, "affiliateReferrals")}</span>
            <span className="text-right pr-6">{t(resolvedLocale, "affiliateRegion")}</span>
            <span className="text-right">{t(resolvedLocale, "affiliatePayout")}</span>
          </div>
          {LEADERBOARD.map((entry) => (
            <div
              key={entry.rank}
              className="grid grid-cols-[3rem_1fr_auto_auto_auto] gap-0 px-4 py-3 border-t border-gray-800/50 hover:bg-white/2 text-sm"
            >
              <span className={`font-black ${rankTone(entry.rank)}`}>{entry.rank}</span>
              <span className="font-bold text-gray-200">{entry.handle}</span>
              <span className="text-right pr-6 text-gray-400">{entry.referrals}</span>
              <span className="text-right pr-6 text-gray-500">{entry.region}</span>
              <span className="text-right font-black text-emerald-300">
                {formatPayout(entry.payouts, resolvedLocale)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-2xl border border-gray-800 bg-black/30 text-center">
          <div className="font-black text-xl mb-2">
            {t(resolvedLocale, "affiliateCtaTitle")}
          </div>
          <p className="text-gray-400 mb-4 text-sm">
            {t(resolvedLocale, "affiliateCtaBody")}
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="/go/partner"
              className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90"
            >
              {t(resolvedLocale, "affiliateCtaButton")}
            </a>
            <a
              href="/dashboard"
              className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200"
            >
              {t(resolvedLocale, "affiliateCtaSecondary")}
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}
