// UNIVERSE 2050 – FINAL – ClawVerse Core – ClawGuru GENESIS PROTOKOLL
// Server entry: exports SEO metadata, renders the interactive client component.

import type { Metadata } from "next"
import UniversePage from "./UniversePage"

export const metadata: Metadata = {
  title: "Universe | ClawGuru",
  description:
    "Universe – The ClawVerse Core Interface. One living mycelium connecting all operational knowledge across time, space, and realities. Quantum Void Elegance 2050 · Final Release.",
  alternates: { canonical: "/universe" },
}

export default function Page() {
  return <UniversePage />
}
