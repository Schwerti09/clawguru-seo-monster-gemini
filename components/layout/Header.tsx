"use client"
// VISUAL & PERFORMANCE POLISH 2026: Responsive header – max 6 desktop links + "More" dropdown + mobile hamburger
// NEXT-LEVEL UPGRADE 2026: Language switcher added for 10-language support

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { LogIn } from "lucide-react"
import Container from "@/components/shared/Container"
import LanguageSwitcher from "@/components/layout/LanguageSwitcher"
import { usePathname } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, t } from "@/lib/i18n"

type NavItem = { href: string; label: string }

export default function Header() {
  const [moreOpen, setMoreOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
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

  const accountHref = hasAccess ? "/dashboard" : `/${currentLocale}/account`
  const accountLabel = hasAccess ? "Dashboard" : "Zugang"

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
  }, [pathname])

  // Check auth/access status client-side
  useEffect(() => {
    let cancelled = false

    async function checkAccess() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })
        if (!cancelled) {
          setHasAccess(res.ok)
        }
      } catch {
        if (!cancelled) {
          setHasAccess(false)
        }
      }
    }

    checkAccess()
    return () => {
      cancelled = true
    }
  }, [pathname])

  // Compact header share: Web Share API → X intent fallback
  const handleHeaderShare = useCallback(() => {
    const url = typeof window !== "undefined" ? window.location.href : "https://clawguru.org"
    const text = t(currentLocale, "shareMyceliumPost")
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "ClawGuru · Mycelial Singularity Engine", text, url }).catch(() => {})
    } else {
      const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
      window.open(xUrl, "_blank", "noopener,noreferrer")
    }
  }, [currentLocale])

  const handleMobileShare = useCallback(() => {
    setMobileOpen(false)
    handleHeaderShare()
  }, [handleHeaderShare])

  return (
    <>
      <header role="banner" className="fixed top-4 left-0 right-0 z-40">
        <Container>
          <div
            className="flex items-center justify-between px-4 py-3 rounded-2xl"
            style={{
              backdropFilter: "blur(24px) saturate(1.8)",
              WebkitBackdropFilter: "blur(24px) saturate(1.8)",
              background: "rgba(10,10,10,0.75)",
              border: "1px solid rgba(212,175,55,0.12)",
              boxShadow: "0 0 0 1px rgba(212,175,55,0.06), 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="ClawGuru – Startseite">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                aria-hidden="true"
                style={{
                  background: "linear-gradient(135deg, #d4af37 0%, #e8cc6a 50%, #a8872a 100%)",
                  boxShadow: "0 0 20px rgba(212,175,55,0.35)",
                }}
              >
                <span className="text-black font-black text-sm">CG</span>
              </div>
              <div className="leading-tight">
                <div className="font-black text-white tracking-tight">ClawGuru</div>
                <div className="text-xs hidden sm:block" style={{ color: "rgba(212,175,55,0.7)" }}>
                  Mycelial Singularity Engine v3.0
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Hauptnavigation" className="hidden lg:flex items-center gap-0.5">
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-xl text-sm text-gray-300 transition-colors hover:text-[#d4af37]"
                >
                  {item.label}
                </Link>
              ))}

              {/* "More" dropdown */}
              <div ref={moreRef} className="relative">
                <button
                  onClick={() => setMoreOpen((v) => !v)}
                  className="px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white flex items-center gap-1 transition-colors"
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                >
                  {t(currentLocale, "navMore")}
                  <svg className={`w-3 h-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {moreOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl py-2 z-50"
                    style={{
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      background: "rgba(10,10,10,0.92)",
                      border: "1px solid rgba(212,175,55,0.12)",
                      boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                    }}
                  >
                    {MORE_NAV.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-[#d4af37] transition-colors"
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
              {/* Mycelium share button */}
              <button
                onClick={handleHeaderShare}
                title={t(currentLocale, "shareMyceliumBtn")}
                aria-label={t(currentLocale, "shareMyceliumBtn")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                style={{
                  background: "rgba(255,200,0,0.08)",
                  border: "1px solid rgba(255,200,0,0.18)",
                  color: "#ffc800",
                }}
              >
                <span aria-hidden>🍄</span>
                <span className="hidden md:inline text-xs font-mono tracking-wide">
                  {t(currentLocale, "shareMyceliumXBtn")}
                </span>
              </button>

              {/* Language switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher currentLocale={currentLocale} variant="compact" />
              </div>

              {/* Access / Dashboard button */}
              <Link
                href={accountHref}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm transition-all duration-200 hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, #d4af37 0%, #e8cc6a 50%, #a8872a 100%)",
                  color: "#0a0a0a",
                  boxShadow: "0 0 16px rgba(212,175,55,0.25)",
                }}
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>{accountLabel}</span>
              </Link>

              <Link
                href="/security/notfall-leitfaden"
                className="hidden sm:block px-3 py-2 rounded-xl font-black text-sm transition-all duration-200"
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
              >
                {t(currentLocale, "navEmergency")}
              </Link>

              <Link
                href="/pricing"
                className="hidden sm:block px-4 py-2 rounded-xl font-black text-sm transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #d4af37 0%, #e8cc6a 50%, #a8872a 100%)",
                  color: "#0a0a0a",
                  boxShadow: "0 0 16px rgba(212,175,55,0.25)",
                }}
              >
                {t(currentLocale, "navProKits")}
              </Link>

              {/* Hamburger button (mobile only) */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden p-2 rounded-xl transition-colors text-gray-300 hover:text-white"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.1)" }}
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
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        } pt-20 pb-8 overflow-y-auto`}
        style={{
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          background: "rgba(8,8,10,0.96)",
          borderLeft: "1px solid rgba(212,175,55,0.12)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
        }}
        aria-hidden={!mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Menü"
      >
        <nav aria-label="Mobilnavigation" className="px-4 space-y-0.5">
          {ALL_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-4 flex flex-col gap-2">
            {/* Mycelium share button (mobile) */}
            <button
              onClick={handleMobileShare}
              className="block w-full px-4 py-3 rounded-xl font-bold text-sm text-center"
              style={{ background: "rgba(255,200,0,0.08)", border: "1px solid rgba(255,200,0,0.18)", color: "#ffc800" }}
            >
              🍄 {t(currentLocale, "shareMyceliumBtn")}
            </button>

            <Link
              href="/security/notfall-leitfaden"
              className="block px-4 py-3 rounded-xl font-black text-sm text-center"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
              onClick={() => setMobileOpen(false)}
            >
              {t(currentLocale, "navEmergency")}
            </Link>

            <Link
              href={accountHref}
              className="block px-4 py-3 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #d4af37 0%, #e8cc6a 50%, #a8872a 100%)",
                color: "#0a0a0a",
                boxShadow: "0 0 16px rgba(212,175,55,0.25)",
              }}
              onClick={() => setMobileOpen(false)}
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              {accountLabel}
            </Link>

            <Link
              href="/pricing"
              className="block px-4 py-3 rounded-xl font-black text-sm text-center text-black"
              style={{ background: "linear-gradient(135deg, #d4af37, #e8cc6a, #a8872a)" }}
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