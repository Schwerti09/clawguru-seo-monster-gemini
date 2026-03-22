'use client'

import { useI18n } from "@/components/i18n/I18nProvider"

export default function Footer() {
  const { locale, dict } = useI18n()
  const prefix = `/${locale}`
  const nav = (dict as any)?.nav || {}
  const footer = (dict as any)?.footer || {}

  return (
    <footer className="bg-black border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-12 text-sm">
        <div>
          <div className="text-cyan-400 font-black text-2xl mb-4">CLAWGURU</div>
          <p className="opacity-60">{nav.footerDescription || "A Living Cyber Nervous System"}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{nav.footerHubs || "Platform"}</h4>
          <ul className="space-y-2 opacity-70">
            <li><a href={`${prefix}/runbooks`}>{nav.runbooks || "Runbooks"}</a></li>
            <li><a href={`${prefix}/tags`}>{nav.tags || "Tags"}</a></li>
            <li><a href={`${prefix}/intel`}>{nav.intelFeed || "Intel Feed"}</a></li>
            <li><a href={`${prefix}/copilot`}>{nav.copilot || "Copilot"}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{nav.solutions || footer.solutions_title || "Solutions"}</h4>
          <ul className="space-y-2 opacity-70">
            <li><a href={`${prefix}/solutions`}>Solutions</a></li>
            <li><a href={`${prefix}/emergency`}>{nav.emergency || "Emergency"}</a></li>
            <li><a href={`${prefix}/check`}>{nav.securityCheck || "Security-Check"}</a></li>
            <li><a href={`${prefix}/pricing`}>{nav.pricing || "Pricing"}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{nav.company || footer.company_title || "Company"}</h4>
          <ul className="space-y-2 opacity-70">
            <li><a href={`${prefix}/ueber-uns`}>{nav.about || "Über uns"}</a></li>
            <li><a href={`${prefix}/case-studies`}>{nav.cases || "Case Studies"}</a></li>
            <li><a href={`${prefix}/support`}>{nav.support || "Support"}</a></li>
            <li><a href={`${prefix}/downloads`}>{nav.downloads || "Downloads"}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{nav.footerLegal || footer.legal_title || "Legal"}</h4>
          <ul className="space-y-2 opacity-70">
            <li><a href={`${prefix}/impressum`}>{nav.imprint || "Impressum"}</a></li>
            <li><a href={`${prefix}/datenschutz`}>{nav.privacy || "Datenschutz"}</a></li>
            <li><a href={`${prefix}/agb`}>{nav.terms || "AGB"}</a></li>
            <li>{nav.footerDisclaimer || footer.disclaimer || "Cookie-Einstellungen"}</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs opacity-50 mt-16">
        © 2026 ClawGuru Mycelium Security Intelligence GmbH • Berlin • All Rights Reserved
      </div>
    </footer>
  )
}
