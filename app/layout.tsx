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
      </head>
      {/* VISUAL UPGRADE 2026: scanline + noise overlays on body */}
      <body className="min-h-screen scanline-overlay noise-overlay neon-cursor">
        <TrustBadge />
        <Header />
        <main className="pt-28 pb-20 lg:pb-0">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <ActionDock />
        {/* VISUAL UPGRADE 2026: Custom neon cursor for desktop */}
        <NeonCursor />
      </body>
    </html>
  )
}
