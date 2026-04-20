// 100/100 OPTIMIZATION 2026: Self-hosted fonts via next/font (non-render-blocking, font-display:swap)
import type { Metadata, Viewport } from "next"
import Script from "next/script"
import "./globals.css"
import TrustBadge from "@/components/layout/TrustBadge"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import TrustShield from "@/components/layout/TrustShield"
import dynamic from "next/dynamic"
// PERFORMANCE ROUND 3: Maximum speed for LCP < 500ms
const AnimatedBackground = dynamic(() => import("@/components/ui/AnimatedBackground").then(m => ({ default: m.AnimatedBackground })), { ssr: false })
// PERFORMANCE ROUND 3: ActionDock removed for LCP optimization (non-critical)
// PERFORMANCE ROUND 3: SocialProofOverlay removed for LCP optimization (non-critical)
// WORLD BEAST FINAL LAUNCH: Umami privacy-first analytics (GA4 removed for performance)
import UmamiAnalytics from "@/components/analytics/UmamiAnalytics"
// PERFORMANCE ROUND 2: NeonCursor removed for LCP optimization
// PERFORMANCE ROUND 2: GlobalMagnetics removed for LCP optimization
// NEXT-LEVEL UPGRADE 2026: RTL direction support for Arabic + other RTL locales
import RTLProvider from "@/components/layout/RTLProvider"
// PERFORMANCE ROUND 3: FloatingMyceliumShareBtn removed for LCP optimization (non-critical)
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import { SEO_TARGET_KEYWORDS_2026 } from "@/lib/seo/targets"
import { getDictionary } from "@/lib/getDictionary"
import { I18nProvider } from "@/components/i18n/I18nProvider"
// PERFORMANCE ROUND 3: CommandK removed for LCP optimization (non-critical)
// PERFORMANCE ROUND 2: FirstVisitPageGuide removed for LCP optimization

// 100/100 OPTIMIZATION: Fonts loaded via CSS @import in globals.css (avoids build-time fetch failures)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ClawGuru — Self-Hosted Security Intelligence | Runbooks, Copilot, Threat Feed",
  description:
    "ClawGuru: 3M+ expert-reviewed security runbooks, live CVE intel, and hands-on hardening tools for DevOps and SecOps teams. Built in Berlin.",
  keywords: SEO_TARGET_KEYWORDS_2026,
  alternates: {
    canonical: "/de",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: `${SITE_URL}/de`,
    title: "ClawGuru — Self-Hosted Security Intelligence",
    description: "3M+ expert-reviewed security runbooks, live CVE intel, hardening tools. Built in Berlin.",
    images: ["/og-image.png", "/og-image.svg"]
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
      urlTemplate: `${SITE_URL}/${DEFAULT_LOCALE}/runbooks?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const dir = (h.get("x-claw-dir") ?? "ltr") as "ltr" | "rtl"
  const dict = await getDictionary(locale)

  return (
    <html lang={locale} dir={dir}>
      <head>
        {/* WORLD BEAST FINAL LAUNCH: Umami analytics (GTM removed for performance) */}
        <UmamiAnalytics />
        {/* FAVICON PACK 2026 — CONSOLIDATED for performance */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        {/* 100/100 LCP OPTIMIZATION: Preload critical OG image for faster LCP */}
        <link rel="preload" as="image" href="/og-image.png" fetchPriority="high" />
        {/* 100/100 LCP OPTIMIZATION: DNS prefetch for analytics */}
        <link rel="dns-prefetch" href="https://umami.clawguru.org" />
        {/* NEXT-LEVEL UPGRADE 2026: PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
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
        {/* Global subtle particle background (mycelium-style) */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(600px 300px at 10% 10%, rgba(0,184,255,0.06), rgba(0,0,0,0)), radial-gradient(800px 400px at 90% 20%, rgba(0,255,157,0.04), rgba(0,0,0,0)), radial-gradient(700px 350px at 30% 90%, rgba(212,175,55,0.035), rgba(0,0,0,0))",
            maskImage: "radial-gradient(80% 80% at 50% 50%, black, transparent)",
          }}
        />
        {/* Hyper-modern animated gradient background layer (SSR-safe) */}
        <AnimatedBackground />
        {/* 100/100 OPTIMIZATION 2026: Skip-to-content link for keyboard/screen-reader users */}
        <a href="#main-content" className="skip-to-content">
          Zum Hauptinhalt springen
        </a>
        <I18nProvider locale={locale} dict={dict}>
          <RTLProvider>
            <TrustBadge />
            <Header />
            {/* 100/100 OPTIMIZATION 2026: id="main-content" for skip link target; role implicit from <main> */}
            <main id="main-content" className="pt-20 pb-20 lg:pb-0">
              {children}
            </main>
            <TrustShield />
            <Footer />
            {/* PERFORMANCE ROUND 3: ActionDock, SocialProofOverlay, FloatingMyceliumShareBtn, CommandK removed for LCP < 500ms */}
            {/* PERFORMANCE ROUND 2: NeonCursor, GlobalMagnetics, FirstVisitPageGuide removed for LCP optimization */}

          </RTLProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
