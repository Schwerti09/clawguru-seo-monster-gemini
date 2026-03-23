"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import Container from "@/components/shared/Container"
import SummonButton, { type SummonResult } from "@/components/summon/SummonButton"
import SwarmResults from "@/components/summon/SwarmResults"
import SummonHistory from "@/components/summon/SummonHistory"
import BuyButton from "@/components/commerce/BuyButton"

export default function SummonClient() {
  const pathname = usePathname()
  const prefix = useMemo(() => {
    const first = (pathname || "").split("/")[1] || ""
    const isLang = /^[a-z]{2}(-[A-Z]{2})?$/.test(first)
    return isLang ? `/${first}` : ""
  }, [pathname])
  const [allowed, setAllowed] = useState(false)
  const [permanent, setPermanent] = useState(false)
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<SummonResult | null>(null)
  const [history, setHistory] = useState<SummonResult[]>([])

  useEffect(() => {
    let stop = false
    async function fetchTier() {
      try {
        const res = await fetch("/api/auth/tier", { cache: "no-store" })
        const j = await res.json().catch(() => null)
        const tier = j?.tier as string | undefined
        if (!stop) {
          const ok = tier === "daypass" || tier === "pro" || tier === "enterprise"
          setAllowed(ok)
          setPermanent(tier === "pro" || tier === "enterprise")
          setLoading(false)
        }
      } catch {
        if (!stop) { setAllowed(false); setPermanent(false); setLoading(false) }
      }
    }
    async function fetchHistory() {
      try {
        const res = await fetch("/api/summon/history", { cache: "no-store" })
        const j = await res.json().catch(() => null)
        if (!stop && j?.items) setHistory(j.items as SummonResult[])
      } catch {}
    }
    fetchTier()
    fetchHistory()
    const id = window.setInterval(fetchTier, 20000)
    return () => { stop = true; window.clearInterval(id) }
  }, [])

  const showRetention = useMemo(() => allowed && !permanent && history.length > 0, [allowed, permanent, history])

  return (
    <div className="py-12">
      <Container>
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] px-4 py-1 rounded-full border mb-4"
               style={{ borderColor: "rgba(255,0,102,0.4)", color: "#ff3377", background: "rgba(255,0,102,0.08)" }}>
            Claw Swarm Oracle
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">Summon your Army</h1>
          <p className="mt-3 text-gray-400 text-lg">Neon‑roter Summon‑Button · 4 Swarm‑Typen · Ergebnis in &lt; 8 Sekunden</p>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/40 p-6">
          <div className="aspect-[16/9] rounded-2xl border border-white/10 bg-gradient-to-b from-red-500/10 to-cyan-500/10 grid place-items-center text-gray-400">
            Live Mycelium‑Graph & 3D‑Sporen
          </div>
          <div className="mt-8 grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <SummonButton
                allowed={!loading && allowed}
                onResult={async (r) => {
                  setResult(r)
                  setHistory((h) => [r, ...h].slice(0, 50))
                  try {
                    await fetch("/api/summon/history", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ item: r }) })
                  } catch {}
                }}
              />
              <div className="mt-6 grid grid-cols-3 gap-3">
                <BuyButton product="daypass" label="Daypass 9,99 € – 24h" className="px-4 py-3 rounded-2xl font-black text-black" style={{ background: "linear-gradient(135deg,#ff0066,#ff9900)" }} />
                <BuyButton product="pro" label="Pro 49 € / Monat" className="px-4 py-3 rounded-2xl font-black text-black" style={{ background: "linear-gradient(135deg,#a78bfa,#00ff9d)" }} />
                <BuyButton product="team" label="Team 89 € / Monat" className="px-4 py-3 rounded-2xl font-black text-white border" style={{ borderColor: "rgba(0,255,157,0.4)" }} />
              </div>
            </div>
            <div>
              {result ? <SwarmResults r={result} /> : <div className="text-sm text-gray-500">Ergebnis erscheint hier in Sekunden.</div>}
            </div>
          </div>
        </div>

        <SummonHistory items={history} permanent={permanent} />

        {showRetention && (
          <div className="fixed right-4 bottom-4 z-40 max-w-sm p-4 rounded-2xl border border-white/10 bg-black/80 text-gray-200">
            <div className="text-sm font-bold">Deine Swarm‑History geht verloren</div>
            <div className="text-xs text-gray-400 mt-1">Upgrade auf Pro für dauerhafte History & Oracle‑Modus.</div>
            <div className="mt-3 flex gap-2">
              <BuyButton product="pro" label="Pro 49 € / Monat" className="px-3 py-2 rounded-xl font-black text-black" style={{ background: "linear-gradient(135deg,#a78bfa,#00ff9d)" }} />
              <a href={`${prefix}/pricing`} className="px-3 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5">Mehr erfahren</a>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
