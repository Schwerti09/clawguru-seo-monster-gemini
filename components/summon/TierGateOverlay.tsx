"use client"

import BuyButton from "@/components/commerce/BuyButton"

export default function TierGateOverlay({ allowed, needed }: { allowed: boolean; needed: "daypass" | "pro" | "team" }) {
  if (allowed) return null
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-20">
      <div className="p-6 rounded-3xl border text-center max-w-md w-[92%]"
           style={{ borderColor: "rgba(212,175,55,0.25)", background: "rgba(0,0,0,0.65)", boxShadow: "0 0 60px rgba(0,255,157,0.06) inset" }}>
        <div className="text-[11px] font-mono uppercase tracking-[0.25em] mb-2" style={{ color: "#d4af37" }}>Premium Access</div>
        <div className="text-lg md:text-xl font-black text-white">Vollständiges Runbook + History + Predictive freischalten?</div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <BuyButton product="daypass" label="Daypass 9 €" className="px-4 py-3 rounded-2xl font-black text-black"
                     style={{ background: "linear-gradient(135deg,#ff0033,#ff7a00)" }} />
          <BuyButton product="pro" label="Pro 49 € / Monat" className="px-4 py-3 rounded-2xl font-black text-black"
                     style={{ background: "linear-gradient(135deg,#a78bfa,#00ff9d)" }} />
        </div>
        <div className="mt-3 text-xs text-gray-400">Daypass: 24h Zugriff — Pro: dauerhaft mit History, Export & Oracle</div>
      </div>
    </div>
  )
}
