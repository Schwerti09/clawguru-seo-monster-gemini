// CLAWLINK MAGIC CONNECTOR v∞ – Overlord AI
// Server entry: exports SEO metadata, renders the interactive ClawLink client component.

import type { Metadata } from "next"
import ClawLinkPage from "./ClawLinkPage"

export const metadata: Metadata = {
  title: "ClawLink Magic Connector | ClawGuru",
  description:
    "ClawLink – One script tag to connect any external site to the living ClawGuru Mycelium. Real-time security intelligence, runbook suggestions, and provenance anchoring.",
  alternates: { canonical: "/clawlink" },
}

export default function Page() {
  return <ClawLinkPage />
}
