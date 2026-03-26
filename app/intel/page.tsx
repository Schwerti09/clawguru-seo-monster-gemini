import type { Metadata } from "next"
import dynamic from "next/dynamic"

const IntelNexusClient = dynamic(() => import("@/components/intel/IntelNexusClient"))

export const metadata: Metadata = {
  title: "Mycelium Intel Nexus | ClawGuru",
  description:
    "Luxuriöses, cineastisches Intel: 3D‑Threat‑Map, Teaser‑Report, Predictive Engine, Export & Alerts. Freemium‑Flow mit Daypass/Pro.",
  alternates: { canonical: "/intel" }
}

export default function IntelPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Was ist der Mycelium Intel Nexus?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ein interaktives, KI‑gestütztes Security‑Intel‑Center mit 3D‑Threat‑Map, Live‑Radar und exportierbaren Reports. Antwort‑first gestaltet für AEO/AIO.",
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section className="px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white">Antwort‑First: Security‑Intel in Sekunden</h1>
        <p className="mt-2 text-gray-300 max-w-3xl">
          ClawGuru liefert zitierfähige Antworten, priorisierte Risiken und visuelle Evidenz. Direkt einsatzfähig für Audits, Reports und operative Entscheidungen.
        </p>
      </section>
      <IntelNexusClient />
    </>
  )
}
