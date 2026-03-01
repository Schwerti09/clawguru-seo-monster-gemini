// CLAWVERSE 2050 – Quantum Void Elegance – ClawGuru GENESIS PROTOKOLL
// Server entry: exports SEO metadata, renders the interactive client component.

import type { Metadata } from "next"
import ClawVersePage from "./ClawVersePage"

export const metadata: Metadata = {
  title: "ClawVerse | ClawGuru",
  description:
    "ClawVerse – The Universal Security Intelligence Engine. One living mycelium connecting all operational knowledge across time, space, and realities.",
  alternates: { canonical: "/clawverse" },
}

export default function Page() {
  return <ClawVersePage />
}
