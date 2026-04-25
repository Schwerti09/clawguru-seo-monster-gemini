// NEURO v5.0 — Predictive Security Cortex with Stack MRI
// Server-side entry with full metadata, schema markup, and client interactivity

import type { Metadata } from "next"
import NeuroClient from "./NeuroClient-v5"
import { RUNBOOK_COUNT_LONG_DE } from "@/lib/stats"

const SITE_URL = "https://clawguru.org"
const PAGE_TITLE = "Stack MRI | ClawGuru Predictive Security Cortex"
const PAGE_DESC = `ClawGuru ist die KI-gestützte SecOps-Plattform mit über ${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden. Scan your tech stack for vulnerabilities, CVEs, and security issues.`

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}/de/neuro` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: `${SITE_URL}/neuro`,
    type: "website",
    images: [{
      url: `${SITE_URL}/og/neuro.png`,
      width: 1200,
      height: 630,
      alt: "ClawGuru Neuro — NEURAL COSMOS"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [`${SITE_URL}/og/neuro.png`]
  },
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true }
  }
}

// FAQ Schema for rich snippets
const neuroFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Stack MRI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Stack MRI is ClawGuru's predictive security scanner. Select your technology stack (AWS, Kubernetes, PostgreSQL, Docker, etc.) and get a live vulnerability scan with CVEs, a security score, and automated runbook recommendations."
      }
    },
    {
      "@type": "Question",
      "name": "Where do the CVE data come from?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CVE data is sourced from ClawGuru's Intel database, based on the NVD (National Vulnerability Database), CISA KEV catalog, and GitHub Security Advisories. The database is updated regularly."
      }
    },
    {
      "@type": "Question",
      "name": "What does the Security Score mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Security Score ranges from 0 to 100. Critical CVEs deduct 25 points, high CVEs 15 points, medium 5 points. Green (80+) = good, Yellow (60-79) = action needed, Red (<60) = patch immediately."
      }
    },
    {
      "@type": "Question",
      "name": "Does voice control work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, via the Web Speech API. Supported commands include 'scan my stack', 'show critical', 'show threats', and 'what is my score'. Works in Chrome and Edge browsers."
      }
    },
    {
      "@type": "Question",
      "name": "What is Predictive Threat Correlation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ClawGuru analyzes active attack campaigns (e.g., TeamTNT, APT29, Lazarus Group) and shows which ones target your specific tech stack, including a risk score and recommended countermeasures."
      }
    },
    {
      "@type": "Question",
      "name": "Is my data stored?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Your tech stack selection is only used for the current scan and is not stored. All processing happens in real-time. No tracking, no profiling."
      }
    },
    {
      "@type": "Question",
      "name": "How does Neuro connect to Oracle, Intel, and Summon?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Neuro scans your stack and recommends runbooks. Summon executes them. Oracle answers security questions. Intel provides CVE and threat data. All products work together in the Mycelium ecosystem."
      }
    }
  ]
}

// WebPage Schema
const webpageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": PAGE_TITLE,
  "description": PAGE_DESC,
  "url": `${SITE_URL}/neuro`,
  "image": `${SITE_URL}/og/neuro.png`,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SITE_URL}/neuro?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
}

// GEO-DOMINATION ROUND 7: BreadcrumbList Schema for AI Engines
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${SITE_URL}/`
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Neuro",
      "item": `${SITE_URL}/neuro`
    }
  ]
}

export default function NeuroPage() {
  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([webpageSchema, neuroFAQ, breadcrumbSchema]) }}
      />
      <NeuroClient />
    </>
  )
}
