// TEMPORAL MYCELIUM v3.1 – UNIVERSE HUB – Overlord AI
// Server entry: exports SEO metadata, renders the interactive Zeitreise-Slider client component.

import type { Metadata } from "next"
import TemporalPage from "./TemporalPage"
import { BASE_URL } from "@/lib/config"
import { RUNBOOK_COUNT_LONG_DE } from "@/lib/stats"

export const metadata: Metadata = {
  title: "Temporal Mycelium — Time-Travel Security Intelligence | ClawGuru",
  description:
    `ClawGuru ist die KI-gestützte SecOps-Plattform mit über ${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden. Temporal Mycelium – Traverse security intelligence across all epochs.`,
  keywords: [
    "temporal mycelium",
    "time-travel security",
    "security intelligence",
    "incident response timeline",
    "cve evolution",
    "threat timeline",
    "security history",
    "epoch analysis",
  ],
  openGraph: {
    title: "Temporal Mycelium — Time-Travel Security Intelligence | ClawGuru",
    description: `ClawGuru ist die KI-gestützte SecOps-Plattform mit über ${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.`,
    type: "website",
    url: `${BASE_URL}/temporal`,
    images: [{
      url: `${BASE_URL}/og/temporal.png`,
      width: 1200,
      height: 630,
      alt: "ClawGuru Temporal Mycelium — Time-Travel Security Intelligence"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Temporal Mycelium — Time-Travel Security Intelligence | ClawGuru",
    description: `ClawGuru ist die KI-gestützte SecOps-Plattform mit über ${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.`,
    images: [`${BASE_URL}/og/temporal.png`]
  },
  alternates: { canonical: "/temporal" },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ClawGuru",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon-512.png`,
  foundingDate: "2024",
  description: `ClawGuru ist die KI-gestützte SecOps-Plattform mit über ${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.`,
  sameAs: [
    "https://github.com/clawguru",
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <TemporalPage />
    </>
  )
}
