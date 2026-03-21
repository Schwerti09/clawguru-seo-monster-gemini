"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"

const PreviewField = dynamic(() => import("@/components/home/PreviewField"), { ssr: false, loading: () => null })

export default function HeroPreview() {
  const [showCanvas, setShowCanvas] = useState(false)

  useEffect(() => {
    try {
      const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const isMd = typeof window !== "undefined" ? window.innerWidth >= 768 : false
      setShowCanvas(isMd && !prefersReduced)
    } catch {
      setShowCanvas(false)
    }
  }, [])

  const tickerItems = [
    "Intel(HIGH): Exposed Gateway → Token Leakage",
    "Intel(HIGH): WebSocket Origin wildcard",
    "Runbook: Docker Secrets Best Practices",
    "Runbook: Nginx 502 Gateway Timeout",
    "Intel(MED): Debug endpoints in production",
  ]

  return (
    <div className="mt-10 mx-auto max-w-5xl">
      <div className="relative rounded-[24px] border border-white/10 bg-black/40 p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="relative rounded-[18px] overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {showCanvas ? <PreviewField /> : null}

          {/* ambient gradient */}
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(0,184,255,0.08), transparent 60%)",
            maskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent)",
          }} />

          {/* Dashboard preview content */}
          <div className="absolute inset-0 p-4 sm:p-6">
            {/* Top metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { v: "21.4K", l: "Instanzen" },
                { v: "94", l: "ClawScore" },
                { v: "3.4M", l: "Runbooks" },
                { v: "99.98%", l: "Uptime" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-white/10 bg-black/50 p-3">
                  <div className="text-base sm:text-lg font-black text-white">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Runbook grid */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { t: "Nginx 502: Fix", c: "#00b8ff" },
                { t: "Docker Secrets", c: "#00ff9d" },
                { t: "Stripe Webhooks", c: "#d4af37" },
                { t: "CORS Preflight", c: "#00b8ff" },
                { t: "K8s CrashLoop", c: "#00ff9d" },
                { t: "OAuth Callback", c: "#d4af37" },
              ].map((r, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-black/60 p-3 hover:bg-white/[0.03] transition-colors">
                  <div className="text-xs text-gray-300">Runbook</div>
                  <div className="text-sm font-semibold text-white line-clamp-1">{r.t}</div>
                  <div className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block" style={{ color: r.c, border: `1px solid ${r.c}55`, background: `${r.c}18` }}>ClawScore 92</div>
                </div>
              ))}
            </div>

            {/* Live intel ticker */}
            <div className="mt-4 rounded-xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 overflow-hidden">
              <div className="animate-[marquee_25s_linear_infinite] whitespace-nowrap py-2 px-3 text-xs sm:text-sm">
                {tickerItems.concat(tickerItems).map((s, i) => (
                  <span key={i} className="mx-6 text-gray-300">• {s}</span>
                ))}
              </div>
            </div>

            {/* Copilot teaser */}
            <div className="mt-4 rounded-xl border border-white/10 bg-black/60 p-3 sm:p-4">
              <div className="text-xs text-gray-300 mb-2">Copilot</div>
              <div className="flex items-center gap-2">
                <input className="flex-1 rounded-lg bg-black/50 border border-white/10 px-3 py-2 text-sm text-gray-200" placeholder="Frag den ClawGuru Copilot…" disabled />
                <button className="px-3 py-2 rounded-lg text-xs font-bold border border-white/15 bg-black/40 text-gray-200">Demo</button>
              </div>
            </div>

            {/* Key features */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-[11px] text-gray-300">
              {["Mycelium", "3,4 Mio Runbooks", "Live‑Intel", "Copilot", "Quantum‑Resistant"].map((k, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-center">{k}</div>
              ))}
            </div>

          </div>

          <style>{`@keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
        </div>
      </div>
    </div>
  )
}
