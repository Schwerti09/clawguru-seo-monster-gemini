'use client'

import { useI18n } from "@/components/i18n/I18nProvider"

export default function Footer() {
  const { locale } = useI18n()
  const prefix = `/${locale}`

  return (
    <footer className="bg-black border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-12 text-sm">
        <div>
          <div className="text-cyan-400 font-black text-2xl mb-4">CLAWGURU</div>
          <p className="opacity-60">A Living Cyber Nervous System</p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 opacity-70">
            <li><a href={`${prefix}/runbooks`}>Runbooks</a></li>
            <li><a href={`${prefix}/tags`}>Tags</a></li>
            <li><a href={`${prefix}/intel`}>Intel Feed</a></li>
            <li><a href={`${prefix}/copilot`}>Copilot</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Solutions</h4>
          <ul className="space-y-2 opacity-70">
            <li><a href={`${prefix}/solutions`}>Solutions</a></li>
            <li><a href={`${prefix}/emergency`}>Emergency</a></li>
            <li><a href={`${prefix}/check`}>Security-Check</a></li>
            <li><a href={`${prefix}/pricing`}>Pricing</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 opacity-70">
            <li><a href={`${prefix}/ueber-uns`}>Über uns</a></li>
            <li><a href={`${prefix}/case-studies`}>Case Studies</a></li>
            <li><a href={`${prefix}/support`}>Support</a></li>
            <li><a href={`${prefix}/downloads`}>Downloads</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 opacity-70">
            <li><a href={`${prefix}/impressum`}>Impressum</a></li>
            <li><a href={`${prefix}/datenschutz`}>Datenschutz</a></li>
            <li><a href={`${prefix}/agb`}>AGB</a></li>
            <li>Cookie-Einstellungen</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs opacity-50 mt-16">
        © 2026 ClawGuru Mycelium Security Intelligence GmbH • Berlin • All Rights Reserved
      </div>
    </footer>
  )
}
