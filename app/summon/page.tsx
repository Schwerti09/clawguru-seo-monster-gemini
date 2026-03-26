import type { Metadata } from "next"
import dynamic from "next/dynamic"
import SummonLiveOverview from "@/components/summon/SummonLiveOverview"

export const metadata: Metadata = {
  title: "Claw Swarm Oracle – Summon | ClawGuru",
  description: "Summon your Army: 4 Swarm‑Typen, Live‑Intel, Top‑Runbooks, Vorhersage & One‑Click‑Fix.",
}

const SummonRealClient = dynamic(() => import("@/components/summon/SummonRealClient"))

export default function SummonPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Was ist Summon?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Summon orchestriert spezialisierte Agenten (Defense, Audit, Fix, Report), um aus einer Kurzbeschreibung sofort einen ausführbaren Fix‑Plan zu liefern.",
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section className="px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white">Antwort‑First: Von Problem zu Fix in Minuten</h1>
        <p className="mt-2 text-gray-300 max-w-3xl">Wähle Swarm‑Typ, beschreibe dein Problem und starte. Summon liefert priorisierte Schritte, Runbooks und Export – KI‑suchoptimiert.</p>
      </section>
      <div className="space-y-10">
        <SummonLiveOverview />
        <SummonRealClient />
      </div>
    </>
  )
}
