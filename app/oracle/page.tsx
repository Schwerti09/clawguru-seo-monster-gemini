// ORACLE v4.0 — Premium Experience with SEO + JSON-LD
// Server-side entry with full metadata, schema markup, and client interactivity

import type { Metadata } from "next"
import OracleClient from "./OracleClient"

const SITE_URL = "https://clawguru.org"
const PAGE_TITLE = "The Oracle | ClawGuru COSMIC INTELLIGENCE"
const PAGE_DESC = "Ask the Mycelium. Get answers from 1M+ nodes of collective security consciousness. AI-powered Oracle with RAG search across 600+ security runbooks."

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}/de/oracle` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: `${SITE_URL}/oracle`,
    type: "website",
    images: [{
      url: `${SITE_URL}/og/oracle.png`,
      width: 1200,
      height: 630,
      alt: "ClawGuru Oracle — COSMIC INTELLIGENCE"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [`${SITE_URL}/og/oracle.png`]
  },
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true }
  }
}

// FAQ Schema for rich snippets
const oracleFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is The Oracle?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Oracle is ClawGuru's AI-powered security intelligence engine. It uses RAG (Retrieval Augmented Generation) to search across 600+ security runbooks and provide contextual answers to your infrastructure questions."
      }
    },
    {
      "@type": "Question",
      "name": "How does the Oracle work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Oracle analyzes your question, searches the Mycelium knowledge graph for relevant runbooks and CVE data, then synthesizes an answer using advanced AI models. Every answer includes source links for verification."
      }
    },
    {
      "@type": "Question",
      "name": "Is the Oracle free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! The Oracle offers a daily free tier. You can ask a limited number of questions per day without any account. For unlimited access, premium plans are available."
      }
    },
    {
      "@type": "Question",
      "name": "What are the Oracle modes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pure Mycelium for direct knowledge queries, Temporal Oracle for time-evolution analysis, Swarm Oracle for remediation strategies, and Prophetic Mode for future threat prediction."
      }
    },
    {
      "@type": "Question",
      "name": "Where does the Oracle get its knowledge?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Oracle searches across ClawGuru's Mycelium — a living knowledge graph containing 600+ executable security runbooks, CVE databases, and real-time threat intelligence feeds."
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
  "url": `${SITE_URL}/oracle`,
  "image": `${SITE_URL}/og/oracle.png`,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SITE_URL}/oracle?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
}

export default function OraclePage() {
  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(oracleFAQ) }}
      />
      
      <OracleClient />
    </>
  )
}
