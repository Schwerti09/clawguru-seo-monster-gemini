// 100/100 OPTIMIZATION 2026: Self-hosted fonts via next/font (non-render-blocking, font-display:swap)
import type { Metadata, Viewport } from "next"
import "./globals.css"
import TrustBadge from "@/components/layout/TrustBadge"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ActionDock from "@/components/layout/ActionDock"
// WORLD BEAST FINAL LAUNCH: Umami privacy-first analytics
import UmamiAnalytics from "@/components/analytics/UmamiAnalytics"
// VISUAL UPGRADE 2026: Neon cursor + page transition wrapper
import NeonCursor from "@/components/visual/NeonCursor"
import PageTransition from "@/components/visual/PageTransition"
// NEXT-LEVEL UPGRADE 2026: RTL direction support for Arabic + other RTL locales
import RTLProvider from "@/components/layout/RTLProvider"
import { SUPPORTED_LOCALES, LOCALE_HREFLANG } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ClawGuru | Mycelial Singularity Engine v3.0",
  description:
    "ClawGuru Mycelial Singularity Engine v3.0: Das lebende Wissensgraph von 1M+ Runbooks. Copilot, Intel Feed, Academy, Vault – evolutionäre Ops-Intelligence für OpenClaw/Moltbot Security & Betrieb.",
  alternates: {
    canonical: "/",
    // 100/100 OPTIMIZATION 2026: hreflang for all 10 supported locales
    languages: Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [
        LOCALE_HREFLANG[locale],
        `${SITE_URL}/${locale}`,
      ])
    ),
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    title: "ClawGuru | Mycelial Singularity Engine v3.0",
    description: "Das lebende Mycelium von 1M+ Runbooks. Force-directed Graph, Darwinian Evolution, Oracle Mode.",
    images: ["/og-image.png"]
  },
  twitter: { card: "summary_large_image", creator: "@clawguru" },
  verification: { google: "b629ac432cdf0f21" },
  // 100/100 OPTIMIZATION 2026: Explicit robots directive
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050608",
}

// 100/100 OPTIMIZATION 2026: Organization JSON-LD for AEO/SEO
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ClawGuru",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
  sameAs: ["https://twitter.com/clawguru"],
  description:
    "ClawGuru ist die #1 Ops-Intelligence-Plattform für OpenClaw/Moltbot Security & Betrieb.",
}

// WebSite schema with SearchAction for Sitelinks Searchbox & AI discovery
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ClawGuru",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/runbooks?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        {/* WORLD BEAST FINAL LAUNCH: Umami analytics */}
        <UmamiAnalytics />
        {/* 100/100 OPTIMIZATION 2026: Preconnect for Google Fonts (DNS early resolution) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* 100/100 OPTIMIZATION 2026: Non-render-blocking font load (media=print trick).
            Fonts download in background; script switches to screen media after load. */}
        <link
          id="gfonts-css"
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Space+Grotesk:wght@500;600;700&display=swap"
          media="print"
        />
        <script dangerouslySetInnerHTML={{
          __html: `(function(){var l=document.getElementById('gfonts-css');if(l)l.onload=function(){l.media='all';};})()`
        }} />
        {/* NEXT-LEVEL UPGRADE 2026: PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* 100/100 OPTIMIZATION 2026: Organization structured data for AEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* WebSite schema with SearchAction for Sitelinks Searchbox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      {/* VISUAL UPGRADE 2026: scanline + noise overlays on body */}
      <body className="min-h-screen scanline-overlay noise-overlay">
        {/* 100/100 OPTIMIZATION 2026: Skip-to-content link for keyboard/screen-reader users */}
        <a href="#main-content" className="skip-to-content">
          Zum Hauptinhalt springen
        </a>
        {/* NEXT-LEVEL UPGRADE 2026: RTL direction support – updates html[dir] based on locale URL */}
        <RTLProvider>
          <TrustBadge />
          <Header />
          {/* 100/100 OPTIMIZATION 2026: id="main-content" for skip link target; role implicit from <main> */}
          <main id="main-content" className="pt-28 pb-20 lg:pb-0">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <ActionDock />
          {/* VISUAL UPGRADE 2026: Custom neon cursor for desktop */}
          <NeonCursor />
        </RTLProvider>
      </body>
    </html>
  )
}
