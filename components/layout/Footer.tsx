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
    <footer role="contentinfo" className="mt-20 border-t border-gray-800 py-10 pb-24 lg:pb-10">
      <Container>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-400">
          <div>
            <div className="font-black text-gray-200 mb-2">ClawGuru</div>
            <p>
              {t(locale, 'footerDescription')}
            </p>
            <div className="mt-4 text-xs text-gray-500">
              {t(locale, 'footerDisclaimer')}
            </div>
          </div>
          <nav aria-label="Seiten-Navigation">
            <div className="font-black text-gray-200 mb-2">{t(locale, 'footerHubs')}</div>
            <ul className="space-y-1">
              <li><a href="/clawverse">ClawVerse</a></li>
              <li><a href="/check">{t(locale, 'navSecurityCheck')}</a></li>
              <li><a href="/copilot">{t(locale, 'navCopilot')}</a></li>
              <li><a href="/intel">{t(locale, 'navIntelFeed')}</a></li>
              <li><a href="/academy">{t(locale, 'navAcademy')}</a></li>
              <li><a href="/vault">{t(locale, 'navVault')}</a></li>
              <li><a href="/pricing">{t(locale, 'navPricing')}</a></li>
              <li><a href="/downloads">{t(locale, 'navDownloads')}</a></li>
              <li><a href="/case-studies">{t(locale, 'navCases')}</a></li>
              <li><a href="/ueber-uns">{t(locale, 'navAbout')}</a></li>
            </ul>
          </nav>
          <nav aria-label="Rechtliche Links">
            <div className="font-black text-gray-200 mb-2">{t(locale, 'footerLegal')}</div>
            <ul className="space-y-1">
              <li><a href="/impressum">{t(locale, 'footerImprint')}</a></li>
              <li><a href="/datenschutz">{t(locale, 'footerPrivacy')}</a></li>
              <li><a href="/agb">{t(locale, 'footerTerms')}</a></li>
              <li><a href="/trust-security">{t(locale, 'footerTrustCenter')}</a></li>
            </ul>
            <div className="mt-4">
              <a className="inline-flex px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 text-gray-200" href={COMMUNITY.discordInvite} target="_blank" rel="noreferrer noopener">
                {t(locale, 'footerDiscord')}
              </a>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              {t(locale, 'footerAffiliate')}
            </div>
          </nav>
        </div>
      </Container>
    </footer>
  )
}
