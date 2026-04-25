// CLAWLINK MAGIC CONNECTOR v∞ – Overlord AI
// Server entry: exports SEO metadata, renders the interactive ClawLink client component.

import type { Metadata } from "next"
import ClawLinkPage from "./ClawLinkPage"
import { BASE_URL } from "@/lib/config"
import { RUNBOOK_COUNT_LONG_DE } from "@/lib/stats"

export const metadata: Metadata = {
  title: "ClawLink Magic Connector — One Script Tag Security Intelligence | ClawGuru",
  description:
    `ClawGuru ist die KI-gestützte SecOps-Plattform mit über ${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden. ClawLink – One script tag to connect any external site to the living ClawGuru Mycelium.`,
  keywords: [
    "clawlink",
    "magic connector",
    "security intelligence",
    "script tag integration",
    "real-time security",
    "runbook suggestions",
    "provenance anchoring",
    "external site integration",
  ],
  openGraph: {
    title: "ClawLink Magic Connector — One Script Tag Security Intelligence | ClawGuru",
    description: `ClawGuru ist die KI-gestützte SecOps-Plattform mit über ${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.`,
    type: "website",
    url: `${BASE_URL}/clawlink`,
    images: [{
      url: `${BASE_URL}/og/clawlink.png`,
      width: 1200,
      height: 630,
      alt: "ClawGuru ClawLink Magic Connector — One Script Tag Security Intelligence"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawLink Magic Connector — One Script Tag Security Intelligence | ClawGuru",
    description: `ClawGuru ist die KI-gestützte SecOps-Plattform mit über ${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.`,
    images: [`${BASE_URL}/og/clawlink.png`]
  },
  alternates: { canonical: "/clawlink" },
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
      <ClawLinkPage />
    </>
  )
}
