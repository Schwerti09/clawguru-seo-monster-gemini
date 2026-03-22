"use client"

import React from "react"

export default function IntelHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 text-center px-4">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true"
           style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,255,157,0.10) 0%, transparent 70%)" }} />
      {/* Radar Pulses */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full border border-emerald-400/20 animate-ping" />
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[26rem] rounded-full border border-cyan-400/20 animate-pulse" />
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[14rem] h-[14rem] rounded-full border border-emerald-400/30" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] px-4 py-1 rounded-full border mb-4"
             style={{ borderColor: "rgba(0,255,157,0.35)", color: "#00ff9d", background: "rgba(0,255,157,0.06)" }}>
          Intel · Live CVE + Runbooks
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white">Intel – Das Mycelial Threat Intelligence Center</h1>
        <p className="mt-3 text-gray-400 text-lg">
          Echtzeit‑CVE‑Feeds, KI‑gestützte Risikoanalyse und direkte Runbook‑Empfehlungen. Bleib immer einen Schritt voraus.
        </p>
        <div className="mt-6">
          <a href="/daypass" className="inline-flex items-center px-6 py-3 rounded-2xl font-black text-black"
             style={{ background: "linear-gradient(135deg,#00e6a0,#00b8ff)" }}>
            Jetzt Daypass kaufen
          </a>
        </div>
      </div>
    </section>
  )
}
