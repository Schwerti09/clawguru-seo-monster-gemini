// TEMPORAL MYCELIUM v3.1 – UNIVERSE HUB – Overlord AI
// Server entry: exports SEO metadata, renders the interactive Zeitreise-Slider client component.

import type { Metadata } from "next"
import TemporalPage from "./TemporalPage"

export const metadata: Metadata = {
  title: "Temporal Mycelium | ClawGuru",
  description:
    "Temporal Mycelium – Traverse security intelligence across all epochs. Zeitreise-Slider for time-travel through 1M+ security events and mutations.",
  alternates: { canonical: "/temporal" },
}

export default function Page() {
  return <TemporalPage />
}
