'use client'

import { usePathname } from 'next/navigation'
import Container from "@/components/shared/Container"
import { COMMUNITY } from "@/lib/constants"
import { SUPPORTED_LOCALES, type Locale, t } from "@/lib/i18n"

export default function Footer() {
  const pathname = usePathname()
  const firstSegment = pathname.split("/").filter(Boolean)[0] as Locale
  const locale: Locale = SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : "de"

  return (
    <footer role="contentinfo" className="mt-20 py-10 pb-24 lg:pb-10 border-t" style={{ borderColor: "rgba(212,175,55,0.1)", background: "var(--surface-1)" }}>
      <Container>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-400">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-black"
                style={{ background: "linear-gradient(135deg, #d4af37, #e8cc6a, #a8872a)", boxShadow: "0 0 12px rgba(212,175,55,0.3)" }}
                aria-hidden="true"
              >CG</div>
              <div className="font-black text-white">ClawGuru</div>
            </div>
            <p>
              {t(locale, 'footerDescription')}
            </p>
            <div className="mt-4 text-xs text-gray-500">
              {t(locale, 'footerDisclaimer')}
            </div>
          </div>
          <nav aria-label="Seiten-Navigation">
            <div className="font-black mb-2" style={{ color: "#d4af37" }}>{t(locale, 'footerHubs')}</div>
            <ul className="space-y-1">
              <li><a href="/clawverse" className="hover:text-white transition-colors">ClawVerse</a></li>
              <li><a href="/check" className="hover:text-white transition-colors">{t(locale, 'navSecurityCheck')}</a></li>
              <li><a href="/copilot" className="hover:text-white transition-colors">{t(locale, 'navCopilot')}</a></li>
              <li><a href="/intel" className="hover:text-white transition-colors">{t(locale, 'navIntelFeed')}</a></li>
              <li><a href="/academy" className="hover:text-white transition-colors">{t(locale, 'navAcademy')}</a></li>
              <li><a href="/vault" className="hover:text-white transition-colors">{t(locale, 'navVault')}</a></li>
              <li><a href="/pricing" className="hover:text-white transition-colors">{t(locale, 'navPricing')}</a></li>
              <li><a href="/downloads" className="hover:text-white transition-colors">{t(locale, 'navDownloads')}</a></li>
              <li><a href="/case-studies" className="hover:text-white transition-colors">{t(locale, 'navCases')}</a></li>
              <li><a href="/ueber-uns" className="hover:text-white transition-colors">{t(locale, 'navAbout')}</a></li>
            </ul>
          </nav>
          <nav aria-label="Rechtliche Links">
            <div className="font-black mb-2" style={{ color: "#d4af37" }}>{t(locale, 'footerLegal')}</div>
            <ul className="space-y-1">
              <li><a href="/impressum" className="hover:text-white transition-colors">{t(locale, 'footerImprint')}</a></li>
              <li><a href="/datenschutz" className="hover:text-white transition-colors">{t(locale, 'footerPrivacy')}</a></li>
              <li><a href="/agb" className="hover:text-white transition-colors">{t(locale, 'footerTerms')}</a></li>
              <li><a href="/trust-security" className="hover:text-white transition-colors">{t(locale, 'footerTrustCenter')}</a></li>
            </ul>
            <div className="mt-4">
              <a
                className="inline-flex px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                style={{ border: "1px solid rgba(212,175,55,0.2)", color: "#d4af37" }}
                href={COMMUNITY.discordInvite}
                target="_blank"
                rel="noreferrer noopener"
              >
                {t(locale, 'footerDiscord')}
              </a>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              {t(locale, 'footerAffiliate')}
            </div>
          </nav>
        </div>
        {/* Gold divider */}
        <div className="mt-8 pt-6 text-center text-xs text-gray-600" style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}>
          <span style={{ color: "rgba(212,175,55,0.4)" }}>ClawGuru · Mycelial Singularity Engine v3.0</span>
        </div>
      </Container>
    </footer>
  )
}
