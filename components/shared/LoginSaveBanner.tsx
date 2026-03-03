"use client"

import { useState } from "react"
import Link from "next/link"

/**
 * Displayed in Copilot and Live-Check pages when the user is not logged in.
 * Prompts them to log in so their check results can be saved to their account.
 */
export default function LoginSaveBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-[#c9a84c]/30 bg-[#c9a84c]/5 mb-6">
      <div className="flex items-center gap-3">
        <span className="text-[#c9a84c] text-base" aria-hidden>
          🔐
        </span>
        <span className="text-sm text-gray-300">
          <Link
            href="/account"
            className="text-[#c9a84c] font-semibold hover:underline"
          >
            Einloggen
          </Link>{" "}
          um diesen Check zu speichern &amp; deinen persönlichen Feed zu sehen.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Banner schließen"
        className="text-gray-600 hover:text-gray-400 text-xs font-mono shrink-0"
      >
        ✕
      </button>
    </div>
  )
}
