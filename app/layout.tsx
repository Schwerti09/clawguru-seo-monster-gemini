import type { Metadata, Viewport } from "next"
import "./globals.css"
import TrustBadge from "@/components/layout/TrustBadge"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ActionDock from "@/components/layout/ActionDock"
// WORLD BEAST FINAL LAUNCH: Umami privacy-first analytics
import UmamiAnalytics from "@/components/analytics/UmamiAnalytics"
// VISUAL BEAST 2026: Custom neon cursor
import NeonCursor from "@/components/visual/NeonCursor"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://clawguru.org'),
  title: "ClawGuru | Institutional OpenClaw Security & Ops 2026",
  description:
    "ClawGuru: Copilot, Intel Feed, Academy, Vault und ein lebender Lagebericht für OpenClaw/Moltbot Security & Betrieb.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://clawguru.org",
    title: "ClawGuru | Institutional Ops Intelligence",
    description: "Konversation → Runbooks. Tools, Intel, Academy, Vault.",
    images: ["/og-image.png"]
  },
  twitter: { card: "summary_large_image", creator: "@clawguru" },
  verification: { google: "b629ac432cdf0f21" }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        {/* WORLD BEAST FINAL LAUNCH: Umami analytics */}
        <UmamiAnalytics />
        {/* VISUAL BEAST 2026: Inter + Space Grotesk font import */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      {/* VISUAL BEAST 2026: noise-overlay + neon-cursor class on body */}
      <body className="min-h-screen noise-overlay neon-cursor">
        <TrustBadge />
        <Header />
        <main className="pt-28 pb-20 lg:pb-0">{children}</main>
        <Footer />
        <ActionDock />
        {/* VISUAL BEAST 2026: Custom neon cursor dot */}
        <NeonCursor />
      </body>
    </html>
  )
}
