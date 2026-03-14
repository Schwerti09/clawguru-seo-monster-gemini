"use client"

import { useEffect, useState } from "react"
import { useI18n } from "@/components/i18n/I18nProvider"

/**
 * MonetizationBanner – Dynamic FOMO overlay for high-traffic pages.
 *
 * Displays a "Limited Time Offer" banner promoting the Premium Runbook.
 * Automatically hides after dismissal (stored in sessionStorage).
 */
export default function MonetizationBanner() {
  const { locale } = useI18n()
  const prefix = `/${locale}`
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("clawguru_fomo_dismissed")) return
    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setVisible(false)
    sessionStorage.setItem("clawguru_fomo_dismissed", "1")
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-2xl rounded-2xl border border-cyan-700/50 bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 shadow-2xl shadow-cyan-900/30 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              ⏳ Limited Time Offer
            </p>
            <p className="mt-1 text-sm font-black text-white leading-snug">
              Unlock the Premium Security Runbook — 1,000+ automated
              fix-playbooks for every CVE.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a
                href={`${prefix}/pricing`}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-black text-sm bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 text-white"
              >
                Grab the Deal →
              </a>
              <button
                onClick={dismiss}
                className="px-4 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-gray-200 border border-gray-700 hover:border-gray-500"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={dismiss}
            aria-label="Close"
            className="shrink-0 text-gray-500 hover:text-gray-300 text-xl leading-none"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
