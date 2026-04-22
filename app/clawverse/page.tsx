// CLAWVERSE 2050 – Quantum Void Elegance – ClawGuru GENESIS PROTOKOLL
// Server entry: exports SEO metadata, renders the interactive client component.

import type { Metadata } from "next"
import ClawVersePage from "./ClawVersePage"
import { BASE_URL } from "@/lib/config"

export const metadata: Metadata = {
  title: "ClawVerse — Universal Security Intelligence Engine | ClawGuru",
  description:
    "ClawGuru ist die KI-gestützte SecOps-Plattform mit über 4,2 Millionen ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden. ClawVerse verbindet alle operativen Wissensdimensionen.",
  keywords: [
    "clawverse",
    "security intelligence engine",
    "ai security operations",
    "incident response automation",
    "security runbooks",
    "temporal intelligence",
    "swarm operations",
    "cosmic oracle",
    "provenance chain",
    "neural security",
    "clawlink connector",
  ],
  openGraph: {
    title: "ClawVerse — Universal Security Intelligence Engine | ClawGuru",
    description: "ClawGuru ist die KI-gestützte SecOps-Plattform mit über 4,2 Millionen ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.",
    type: "website",
    url: `${BASE_URL}/clawverse`,
    images: [{
      url: `${BASE_URL}/og/clawverse.png`,
      width: 1200,
      height: 630,
      alt: "ClawGuru ClawVerse — Universal Security Intelligence Engine"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawVerse — Universal Security Intelligence Engine | ClawGuru",
    description: "ClawGuru ist die KI-gestützte SecOps-Plattform mit über 4,2 Millionen ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.",
    images: [`${BASE_URL}/og/clawverse.png`]
  },
  alternates: { canonical: "/clawverse" },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ClawGuru",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon-512.png`,
  foundingDate: "2024",
  description: "ClawGuru ist die KI-gestützte SecOps-Plattform mit über 4,2 Millionen ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.",
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
      <ClawVersePage />
    </>
  )
}
