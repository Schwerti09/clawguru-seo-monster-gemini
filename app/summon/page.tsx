// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// Page: /summon – The interdimensional portal to the OpenAI Core

import type { Metadata } from "next";
import { cookies } from "next/headers";
import CosmicSummon from "@/components/visual/CosmicSummon";
import MyceliumShareCard from "@/components/share/MyceliumShareCard";
import Container from "@/components/shared/Container";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "COSMIC INTER-AI SUMMON | ClawGuru",
  description:
    "Open a direct line to the OpenAI Core. Powered by ClawGuru's Mycelium Network and Gemini AI. Theatrical simulation. OpenAI will not actually call you… or will they?",
  alternates: { canonical: "/summon" },
  robots: { index: false, follow: false },
};

// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// No ISR needed – fully interactive client component
export default async function SummonPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("cg_locale")?.value;
  const locale: Locale = SUPPORTED_LOCALES.includes(localeCookie as Locale)
    ? (localeCookie as Locale)
    : "de";

  return (
    <>
      <CosmicSummon />
      {/* Viral Share Card */}
      <div className="py-8 border-t border-white/5">
        <Container>
          <MyceliumShareCard
            locale={locale}
            title="Cosmic Inter-AI Summon · ClawGuru"
            pageUrl="/summon"
            className="max-w-2xl mx-auto"
          />
        </Container>
      </div>
    </>
  );
}
