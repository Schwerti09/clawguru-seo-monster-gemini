import type { Metadata } from "next"
import dynamic from "next/dynamic"
import SummonLiveOverview from "@/components/summon/SummonLiveOverview"

export const metadata: Metadata = {
  title: "Claw Swarm Oracle – Summon | ClawGuru",
  description: "Summon your Army: 4 Swarm‑Typen, Live‑Intel, Top‑Runbooks, Vorhersage & One‑Click‑Fix.",
}

const SummonRealClient = dynamic(() => import("@/components/summon/SummonRealClient"))

export default function SummonPage() {
  return (
    <div className="space-y-10">
      <SummonLiveOverview />
      <SummonRealClient />
    </div>
  )
}
