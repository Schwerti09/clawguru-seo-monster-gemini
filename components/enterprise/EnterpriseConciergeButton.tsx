"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

const SovereignConciergeBot = dynamic(
  () => import("@/components/enterprise/SovereignConciergeBot"),
  { ssr: false }
)

export default function EnterpriseConciergeButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 w-full text-center py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, #ffaa00 0%, #ff5000 100%)",
          boxShadow: "0 0 30px rgba(255,165,0,0.3)",
        }}
      >
        ✦ Enterprise Concierge starten
      </button>
      <SovereignConciergeBot open={open} onClose={() => setOpen(false)} />
    </>
  )
}
