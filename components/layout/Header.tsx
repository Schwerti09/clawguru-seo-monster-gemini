"use client"
// VISUAL & PERFORMANCE POLISH 2026: Responsive header – max 6 desktop links + "More" dropdown + mobile hamburger
// NEXT-LEVEL UPGRADE 2026: Language switcher added for 10-language support

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Container from "@/components/shared/Container"
import LanguageSwitcher from "@/components/layout/LanguageSwitcher"
import { usePathname } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, t } from "@/lib/i18n"

type NavItem = { href: string; label: string }

export default function Header() {
  const [moreOpen, setMoreOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // NEXT-LEVEL UPGRADE 2026: Detect current locale from URL
  const firstSegment = pathname.split("/").filter(Boolean)[0] as Locale
  const currentLocale: Locale = SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : "de"

  // Primary nav items shown on desktop (max 6)
  const PRIMARY_NAV: NavItem[] = [
    { href: "/live", label: t(currentLocale, "navLive") },
    { href: "/check", label: t(currentLocale, "navSecurityCheck") },
    { href: "/copilot", label: t(currentLocale, "navCopilot") },
    { href: "/runbooks", label: t(currentLocale, "navRunbooks") },
    { href: "/intel", label: t(currentLocale, "navIntelFeed") },
    { href: "/pricing", label: t(currentLocale, "navPricing") },
  ]

  // Overflow items – visible in "More" dropdown on desktop and in mobile menu
  const MORE_NAV: NavItem[] = [
    { href: "/clawverse", label: t(currentLocale, "navClawVerse") },
    { href: "/summon", label: t(currentLocale, "navSummon") },
    { href: "/oracle", label: t(currentLocale, "navOracle") },
    { href: "/neuro", label: t(currentLocale, "navNeuro") },
    { href: "/mycelium", label: t(currentLocale, "navMycelium") },
    { href: "/tags", label: t(currentLocale, "navTags") },
    { href: "/academy", label: t(currentLocale, "navAcademy") },
    { href: "/vault", label: t(currentLocale, "navVault") },
    { href: "/openclaw-security-2026", label: t(currentLocale, "navReport") },
    { href: "/downloads", label: t(currentLocale, "navDownloads") },
    { href: "/case-studies", label: t(currentLocale, "navCases") },
    { href: "/hosting-kosten", label: t(currentLocale, "navCosts") },
    { href: "/ueber-uns", label: t(currentLocale, "navAbout") },
  ]

  const ALL_NAV = [...PRIMARY_NAV, ...MORE_NAV]

  // Close "More" dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Close mobile menu on route change (simple approach)
  useEffect(() => {
    setMobileOpen(false)
  }, [])

  return (
    <>
      <header role="banner" className="fixed top-10 left-0 right-0 z-40">
        <Container>
          <div className="flex items-center justify-between border border-gray-800 bg-gray-950/70 backdrop-blur rounded-2xl px-4 py-3 shadow-glow">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="ClawGuru – Startseite">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-cyan to-brand-violet shadow-glow2" aria-hidden="true" />
              <div className="leading-tight">
                <div className="font-black">ClawGuru</div>
                <div className="text-xs text-gray-400 hidden sm:block">Mycelial Singularity Engine v3.0</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Hauptnavigation" className="hidden lg:flex items-center gap-1">
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-xl hover:bg-gray-900/60 transition-colors text-sm"
                >
                  {item.label}
                </Link>
              ))}

              {/* "More" dropdown */}
              <div ref={moreRef} className="relative">
                <button
                  onClick={() => setMoreOpen((v) => !v)}
                  className="px-3 py-2 rounded-xl hover:bg-gray-900/60 transition-colors text-sm flex items-center gap-1"
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                >
                  {t(currentLocale, "navMore")}
                  <svg className={`w-3 h-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {moreOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-gray-800 bg-gray-950/95 backdrop-blur-xl shadow-xl py-2 z-50">
                    {MORE_NAV.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-900/60 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* CTA buttons + language switcher + mobile hamburger */}
            <div className="flex items-center gap-2">
              {/* NEXT-LEVEL UPGRADE 2026: Language switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher currentLocale={currentLocale} variant="compact" />
              </div>
              <Link
                href="/security/notfall-leitfaden"
                className="hidden sm:block px-3 py-2 rounded-xl bg-brand-red/90 hover:bg-brand-red font-black text-sm"
              >
                {t(currentLocale, "navEmergency")}
              </Link>
              <Link
                href="/pricing"
                className="hidden sm:block px-3 py-2 rounded-xl bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/30 font-bold text-sm"
              >
                {t(currentLocale, "navProKits")}
              </Link>

              {/* Hamburger button (mobile only) */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-900/60 transition-colors"
                aria-label="Navigation öffnen"
                aria-expanded={mobileOpen}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile slide-in menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        } border-l border-gray-800 bg-gray-950/95 backdrop-blur-xl shadow-2xl pt-24 pb-8 overflow-y-auto`}
        aria-hidden={!mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Menü"
      >
        <nav aria-label="Mobilnavigation" className="px-4 space-y-1">
          {ALL_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl hover:bg-gray-900/60 transition-colors text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/security/notfall-leitfaden"
              className="block px-4 py-3 rounded-xl bg-brand-red/90 hover:bg-brand-red font-black text-sm text-center"
              onClick={() => setMobileOpen(false)}
            >
              {t(currentLocale, "navEmergency")}
            </Link>
            <Link
              href="/pricing"
              className="block px-4 py-3 rounded-xl bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/30 font-bold text-sm text-center"
              onClick={() => setMobileOpen(false)}
            >
              {t(currentLocale, "navProKits")}
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}

