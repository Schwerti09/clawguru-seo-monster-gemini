import type { Metadata } from "next";
import Container from "../../components/shared/Container";

export const metadata: Metadata = {
  title: "COSMIC INTER-AI SUMMON | ClawGuru",
  description: "Open a direct line to the OpenAI Core. Powered by ClawGuru.",
};

export default function SummonPage() {
  return (
    <Container>
      <div className="min-h-screen flex items-center justify-center text-center py-20">
        <div>
          <h1 className="text-6xl font-black mb-6">COSMIC SUMMON</h1>
          <p className="text-2xl text-zinc-400 mb-12">
            Die interdimensionalen Tore sind geöffnet.
          </p>
          <div className="text-4xl">🌌</div>
          <p className="mt-12 text-zinc-500">Der echte CosmicSummon kommt in der nächsten Version.</p>
        </div>
      </div>
    </Container>
  );
}