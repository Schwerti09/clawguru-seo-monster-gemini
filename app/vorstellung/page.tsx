import type { Metadata } from "next"
import VorstellungClient from "@/components/vorstellung/VorstellungClient"

export const metadata: Metadata = {
  title: "Vorstellung • ClawGuru",
  description: "Die ClawGuru Plattform erklärt – Mycelium, Copilot, Vault, Ops‑Intel, Mission Control. Modern, schnell, visuell.",
  alternates: { canonical: "/vorstellung" },
}

export default function VorstellungPage() {
  return <VorstellungClient />
}
