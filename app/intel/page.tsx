"use client"

import React, { Suspense } from "react"
import dynamic from "next/dynamic"

const IntelNexusClient = dynamic(() => import("@/components/intel/IntelNexusClient"))

class IntelErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return (
        <section className="px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6">
            <div className="h-6 w-48 bg-white/10 rounded animate-pulse mb-3" />
            <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
          </div>
        </section>
      )
    }
    return this.props.children as any
  }
}

// metadata removed in client component to satisfy Next.js constraints

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
      <Suspense
        fallback={
          <div className="min-h-screen bg-black flex items-center justify-center">Lade Mycelium...</div>
        }
      >
        <IntelErrorBoundary>
          <IntelNexusClient />
        </IntelErrorBoundary>
      </Suspense>
    </>
  )
}
