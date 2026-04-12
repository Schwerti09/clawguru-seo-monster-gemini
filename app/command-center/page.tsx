"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import Container from "@/components/shared/Container"
import { useSearchParams, useRouter } from "next/navigation"

const SummonPanel = dynamic(() => import("@/components/command-center/SummonPanel"), { ssr: false, loading: () => <div className="p-6 rounded-2xl border border-white/10 bg-black/30 text-sm text-gray-400">Lade Summon…</div> })
const OraclePanel = dynamic(() => import("@/components/command-center/OraclePanel"), { ssr: false, loading: () => <div className="p-6 rounded-2xl border border-white/10 bg-black/30 text-sm text-gray-400">Lade Oracle…</div> })
const NeuroPanel = dynamic(() => import("@/components/command-center/NeuroPanel"), { ssr: false, loading: () => <div className="p-6 rounded-2xl border border-white/10 bg-black/30 text-sm text-gray-400">Lade Neuro…</div> })
const MyceliumPanel = dynamic(() => import("@/components/command-center/MyceliumPanel"), { ssr: false, loading: () => <div className="p-6 rounded-2xl border border-white/10 bg-black/30 text-sm text-gray-400">Lade Mycelium…</div> })

function TabButton({ id, current, onClick, label }: { id: string; current: string; onClick: (id: string) => void; label: string }) {
  const active = current === id
  return (
    <button onClick={() => onClick(id)} className={`px-3 py-2 rounded-xl text-sm font-bold border transition-colors ${active ? "bg-cyan-600/30 border-cyan-500/50 text-cyan-200" : "bg-black/30 border-white/10 text-gray-300 hover:bg-black/40"}`}>
      {label}
    </button>
  )
}

export default function CommandCenterPage() {
  const sp = useSearchParams()
  const router = useRouter()
  const initial = sp.get("tab") || "summon"
  const [tab, setTab] = useState(initial)
  useEffect(() => {
    const cur = sp.get("tab") || "summon"
    if (cur !== tab) setTab(cur)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp])
  const onTab = (id: string) => {
    const u = new URL(window.location.href)
    u.searchParams.set("tab", id)
    router.push(u.pathname + "?" + u.searchParams.toString())
    setTab(id)
  }

  const Panel = useMemo(() => {
    switch (tab) {
      case "oracle":
        return <OraclePanel />
      case "neuro":
        return <NeuroPanel />
      case "mycelium":
        return <MyceliumPanel />
      case "summon":
      default:
        return <SummonPanel />
    }
  }, [tab])

  return (
    <div className="py-10">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-mono tracking-widest uppercase text-[#00ff9d]">Command Center</div>
              <h1 className="text-3xl md:text-4xl font-black">Mission Control</h1>
            </div>
            <div className="flex gap-2">
              <TabButton id="summon" current={tab} onClick={onTab} label="Summon" />
              <TabButton id="oracle" current={tab} onClick={onTab} label="Oracle" />
              <TabButton id="neuro" current={tab} onClick={onTab} label="Neuro" />
              <TabButton id="mycelium" current={tab} onClick={onTab} label="Mycelium" />
            </div>
          </div>
          <div className="min-h-[480px]">{Panel}</div>
        </div>
      </Container>
    </div>
  )
}
