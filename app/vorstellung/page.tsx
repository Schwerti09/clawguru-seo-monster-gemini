import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Vorstellung • ClawGuru",
  description: "Die ClawGuru Plattform erklärt – Mycelium, Copilot, Vault, Ops‑Intel, Mission Control. Modern, schnell, visuell.",
  alternates: { canonical: "/vorstellung" },
}

export default function VorstellungPage() {
  redirect("/de/vorstellung")
}
