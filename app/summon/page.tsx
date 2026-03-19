import type { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
  title: "Claw Swarm Oracle – Summon | ClawGuru",
  description: "Summon your Army: 4 Swarm‑Typen, Mycelium‑Graph, Vorhersage & One‑Click‑Fix.",
}

const SummonFreemiumClient = dynamic(() => import("@/components/summon/SummonFreemiumClient"), { ssr: false })

export default function SummonPage() {
  return <SummonFreemiumClient />
}
