// NEURO v5.0 — Predictive Security Cortex with Stack MRI
// Server-side entry with full metadata, schema markup, and client interactivity

import type { Metadata } from "next"
import NeuroClient from "./NeuroClient-v5"

const SITE_URL = "https://clawguru.org"
const PAGE_TITLE = "Stack MRI | ClawGuru Predictive Security Cortex"
const PAGE_DESC = "Scan your tech stack for vulnerabilities, CVEs, and security issues. Live threat intelligence with automated runbook recommendations."

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}/neuro` },
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
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
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
        "text": "Stack MRI is ClawGuru's predictive security scanner. It analyzes your technology stack (AWS, Kubernetes, PostgreSQL, etc.) and identifies vulnerabilities, CVEs, and security misconfigurations in real-time."
      }
    },
    {
      "@type": "Question",
      "name": "How does eye-tracking work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Neuro uses WebGazer.js for client-side eye-tracking. Look at a thought card for 3 seconds to select it. All processing happens locally in your browser — no camera data is stored or transmitted."
      }
    },
    {
      "@type": "Question",
      "name": "Is eye-tracking mandatory?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Eye-tracking is completely optional. You can click on thought cards manually or type your question directly in the text input field."
      }
    },
    {
      "@type": "Question",
      "name": "What EEG devices are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Neuro supports Bluetooth EEG devices like Muse and Emotiv via Web Bluetooth API. EEG data enhances query relevance by detecting your focus state."
      }
    },
    {
      "@type": "Question",
      "name": "Is my biometric data secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. Eye-tracking and EEG data are processed entirely client-side. No biometric data leaves your device. Only the selected question (anonymized) is sent to the Oracle."
      }
    },
    {
      "@type": "Question",
      "name": "What languages does Neuro support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Neuro supports all 15 ClawGuru languages. The interface adapts to your browser language automatically."
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

export default function NeuroPage() {
  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(neuroFAQ) }}
      />
      
      <NeuroClient />
    </>
  )
}
