import type { Metadata } from "next"
import dynamic from "next/dynamic"

const IntelNexusClient = dynamic(() => import("@/components/intel/IntelNexusClient"), { ssr: false })

export const metadata: Metadata = {
  title: "Mycelium Intel Nexus | ClawGuru",
  description:
    "Luxuriöses, cineastisches Intel: 3D‑Threat‑Map, Teaser‑Report, Predictive Engine, Export & Alerts. Freemium‑Flow mit Daypass/Pro.",
  alternates: { canonical: "/intel" }
}

export default function IntelPage() {
  return <IntelNexusClient />
}
