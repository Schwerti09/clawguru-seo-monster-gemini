// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// Page: /summon – The interdimensional portal to the OpenAI Core

import type { Metadata } from "next";
import CosmicSummon from "@/components/visual/CosmicSummon";

export const metadata: Metadata = {
  title: "COSMIC INTER-AI SUMMON | ClawGuru",
  description:
    "Open a direct line to the OpenAI Core. Powered by ClawGuru's Mycelium Network and Gemini AI. Theatrical simulation. OpenAI will not actually call you… or will they?",
  alternates: { canonical: "/summon" },
  robots: { index: false, follow: false },
};

// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// No ISR needed – fully interactive client component
export default function SummonPage() {
  return <CosmicSummon />;
}
