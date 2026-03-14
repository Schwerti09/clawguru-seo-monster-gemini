'use client'

import Container from "@/components/shared/Container"
import { COMMUNITY } from "@/lib/constants"
import { useI18n } from "@/components/i18n/I18nProvider"

export default function Footer() {
  const { locale, dict } = useI18n()
  const prefix = `/${locale}`

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
              {dict.nav.footerDescription}
            </p>
            <div className="mt-4 text-xs text-gray-500">
              {dict.nav.footerDisclaimer}
            </div>
          </div>
          <nav aria-label="Seiten-Navigation">
            <div className="font-black mb-2" style={{ color: "#d4af37" }}>{dict.nav.footerHubs}</div>
            <ul className="space-y-1">
              <li><a href={`${prefix}/clawverse`} className="hover:text-white transition-colors">ClawVerse</a></li>
              <li><a href={`${prefix}/check`} className="hover:text-white transition-colors">{dict.nav.securityCheck}</a></li>
              <li><a href={`${prefix}/copilot`} className="hover:text-white transition-colors">{dict.nav.copilot}</a></li>
              <li><a href={`${prefix}/intel`} className="hover:text-white transition-colors">{dict.nav.intelFeed}</a></li>
              <li><a href={`${prefix}/academy`} className="hover:text-white transition-colors">{dict.nav.academy}</a></li>
              <li><a href={`${prefix}/vault`} className="hover:text-white transition-colors">{dict.nav.vault}</a></li>
              <li><a href={`${prefix}/pricing`} className="hover:text-white transition-colors">{dict.nav.pricing}</a></li>
              <li><a href={`${prefix}/downloads`} className="hover:text-white transition-colors">{dict.nav.downloads}</a></li>
              <li><a href={`${prefix}/case-studies`} className="hover:text-white transition-colors">{dict.nav.cases}</a></li>
              <li><a href={`${prefix}/ueber-uns`} className="hover:text-white transition-colors">{dict.nav.about}</a></li>
            </ul>
          </nav>
          <nav aria-label="Rechtliche Links">
            <div className="font-black mb-2" style={{ color: "#d4af37" }}>{dict.nav.footerLegal}</div>
            <ul className="space-y-1">
              <li><a href={`${prefix}/impressum`} className="hover:text-white transition-colors">{dict.nav.imprint}</a></li>
              <li><a href={`${prefix}/datenschutz`} className="hover:text-white transition-colors">{dict.nav.privacy}</a></li>
              <li><a href={`${prefix}/agb`} className="hover:text-white transition-colors">{dict.nav.terms}</a></li>
              <li><a href={`${prefix}/trust-security`} className="hover:text-white transition-colors">{dict.nav.trustCenter}</a></li>
            </ul>
            <div className="mt-4">
              <a
                className="inline-flex px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                style={{ border: "1px solid rgba(212,175,55,0.2)", color: "#d4af37" }}
                href={COMMUNITY.discordInvite}
                target="_blank"
                rel="noreferrer noopener"
              >
                {dict.nav.footerDiscord}
              </a>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              {dict.nav.footerAffiliate}
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
