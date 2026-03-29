import type { Metadata } from "next"
import { BASE_URL } from "@/lib/config"

export const metadata: Metadata = {
  title: "Perfection Generator | Production‑Ready SEO Landingpages",
  description:
    "Generiere production‑ready Next.js Landingpages mit echten Code‑Beispielen, JSON‑LD, OpenGraph und zweisprachigem Content (DE/EN).",
  alternates: {
    canonical: "/perfection",
  },
  keywords: [
    "SEO Generator",
    "Landingpage Generator",
    "Next.js Seite generieren",
    "DevOps Security Content",
    "KI Content Generator",
    "Perfection Mode",
  ],
  openGraph: {
    title: "ClawGuru Perfection Generator",
    description:
      "Erzeuge hochwertige Landingpages inkl. Code‑Beispiele, Checklisten und JSON‑LD – sofort einsatzbereit für deine Website.",
    url: `${BASE_URL}/perfection`,
    type: "website",
  },
}
