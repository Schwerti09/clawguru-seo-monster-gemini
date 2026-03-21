import type { Metadata } from "next"
import dynamic from "next/dynamic"
import SummonLiveOverview from "@/components/summon/SummonLiveOverview"

export const metadata: Metadata = {
  title: "Claw Swarm Oracle – Summon | ClawGuru",
  description: "Summon your Army: 4 Swarm‑Typen, Live‑Intel, Top‑Runbooks, Vorhersage & One‑Click‑Fix.",
}

const SummonFreemiumClient = dynamic(() => import("@/components/summon/SummonFreemiumClient"), { ssr: false })

export default function SummonPage() {
  return (
    <div className="space-y-10">
      <SummonLiveOverview />
      <SummonFreemiumClient />
    </div>
  )
}
