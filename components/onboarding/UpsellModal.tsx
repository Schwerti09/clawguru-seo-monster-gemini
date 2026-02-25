'use client'
// WORLD BEAST FINAL LAUNCH: components/onboarding/UpsellModal.tsx
// Shown after exactly 3 security checks. Displays personalized Claw Score + upsell CTA.

import { useEffect, useState } from "react"
import { trackEvent, getCheckCount } from "@/lib/analytics"

const UPSELL_SHOWN_KEY = "cg_upsell_shown"

type Props = {
  score?: number
}

export default function UpsellModal({ score }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const count = getCheckCount()
    const alreadyShown = localStorage.getItem(UPSELL_SHOWN_KEY) === "1"

    if (count >= 3 && !alreadyShown) {
      setOpen(true)
      localStorage.setItem(UPSELL_SHOWN_KEY, "1")
      // WORLD BEAST FINAL LAUNCH: track modal impression
      trackEvent("upsell_modal_shown", { score: score ?? 0, trigger_checks: count })
    }
  }, [score])

  if (!open) return null

  const displayScore = score ?? 64

  function handleCTA() {
    trackEvent("upsell_modal_clicked", { score: displayScore, cta: "pricing" })
    setOpen(false)
  }

  function handleDismiss() {
    setOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl border border-brand-cyan/30 bg-gray-950 shadow-2xl shadow-brand-cyan/10 p-7 z-10">
        {/* Close */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 text-xl font-bold"
          aria-label="Schließen"
        >
          ×
        </button>

        {/* Score bubble */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-cyan/20 to-brand-violet/20 border border-brand-cyan/30 flex items-center justify-center">
            <span className="text-2xl font-black text-brand-cyan">{displayScore}</span>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Dein Claw Score</div>
            <div className="text-xl font-black">
              {displayScore >= 75 ? "Solide – aber ausbaufähig" : "Handlungsbedarf erkannt"}
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-300 mb-6">
          Dein Claw Score ist <strong className="text-brand-cyan">{displayScore}</strong> – unlock
          10.000+ Runbooks, den AI-Copilot und automatisches Hardening für nur{" "}
          <strong className="text-white">€9/Monat</strong>.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/pricing"
            onClick={handleCTA}
            className="flex-1 text-center px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 transition-opacity"
          >
            Jetzt freischalten →
          </a>
          <a
            href="/pricing?product=daypass"
            onClick={handleCTA}
            className="flex-1 text-center px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 transition-colors"
          >
            Day Pass (€4.99)
          </a>
        </div>

        <p className="mt-4 text-xs text-gray-500 text-center">
          Kein Abo-Zwang. Kündigung jederzeit.
        </p>
      </div>
    </div>
  )
}
