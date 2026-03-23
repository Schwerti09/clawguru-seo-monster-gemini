"use client"
// VISUAL & PERFORMANCE POLISH 2026: Responsive header â€“ max 6 desktop links + "More" dropdown + mobile hamburger
// NEXT-LEVEL UPGRADE 2026: Language switcher added for 10-language support

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { LogIn } from "lucide-react"
import Container from "@/components/shared/Container"
import LanguageSwitcher from "@/components/layout/LanguageSwitcher"
import { usePathname } from "next/navigation"
import { useI18n } from "@/components/i18n/I18nProvider"
import { SUPPORTED_LOCALES, type Locale, localizePath } from "@/lib/i18n"

type NavItem = { href: string; label: string }

export default function Header() {
  const [moreOpen, setMoreOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [promptVisible, setPromptVisible] = useState(false)
  const [suggestedLocale, setSuggestedLocale] = useState<Locale | null>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const { locale, dict } = useI18n()
  const prefix = `/${locale}`

  // Primary nav items shown on desktop (max 6)
  const PRIMARY_NAV: NavItem[] = [
    { href: `${prefix}/live`, label: dict.nav.live },
    { href: `${prefix}/check`, label: dict.nav.securityCheck },
    { href: `${prefix}/copilot`, label: dict.nav.copilot },
    { href: `${prefix}/runbooks`, label: dict.nav.runbooks },
    { href: `${prefix}/intel`, label: dict.nav.intelFeed },
    { href: `${prefix}/pricing`, label: dict.nav.pricing },
  ]

  // Overflow items â€“ visible in "More" dropdown on desktop and in mobile menu
  const MORE_NAV: NavItem[] = [
    { href: `${prefix}/clawverse`, label: dict.nav.clawVerse },
    { href: `${prefix}/summon`, label: dict.nav.summon },
    { href: `${prefix}/oracle`, label: dict.nav.oracle },
    { href: `${prefix}/neuro`, label: dict.nav.neuro },
    { href: `${prefix}/command-center`, label: (dict as any).nav?.command_center || "Command Center" },
    { href: `${prefix}/mycelium`, label: dict.nav.mycelium },
    { href: `${prefix}/tags`, label: dict.nav.tags },
    { href: `${prefix}/academy`, label: dict.nav.academy },
    { href: `${prefix}/vault`, label: dict.nav.vault },
    { href: `${prefix}/openclaw-security-2026`, label: dict.nav.report },
    { href: `${prefix}/downloads`, label: dict.nav.downloads },
    { href: `${prefix}/case-studies`, label: dict.nav.cases },
    { href: `${prefix}/hosting-kosten`, label: dict.nav.costs },
    { href: `${prefix}/ueber-uns`, label: dict.nav.about },
  ]

  const ALL_NAV = [...PRIMARY_NAV, ...MORE_NAV]

  const accountHref = hasAccess ? `${prefix}/dashboard` : `${prefix}/account`
  const accountLabel = hasAccess ? ((dict as any).common?.ctaDashboard || "Dashboard") : ((dict as any).nav?.account || "Account")

  const switchLocale = useCallback(
    (nextLocale: Locale) => {
      document.cookie = `cg_locale=${nextLocale}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`
      const nextPath = localizePath(nextLocale, pathname || "/")
      window.location.assign(nextPath)
    },
    [pathname]
  )

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

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!pathname) return

    const dismissed = window.localStorage.getItem("cg_lang_prompt_dismissed") === "1"
    if (dismissed) return

    const firstSegment = pathname.split("/").filter(Boolean)[0]?.toLowerCase()
    if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment as Locale)) {
      return
    }

    const browserCandidate =
      window.navigator.languages?.[0] ??
      window.navigator.language ??
      ""

    const browserLocale = browserCandidate.toLowerCase().split("-")[0] as Locale
    if (!SUPPORTED_LOCALES.includes(browserLocale)) return
    if (browserLocale === locale) return

    setSuggestedLocale(browserLocale)
    setPromptVisible(true)
  }, [locale, pathname])

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

  // Compact header share: Web Share API â†’ X intent fallback
  const handleHeaderShare = useCallback(() => {
    const url = typeof window !== "undefined" ? window.location.href : "https://clawguru.org"
    const text = dict.share.myceliumPost
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "ClawGuru Â· Mycelial Singularity Engine", text, url }).catch(() => {})
    } else {
      const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
      window.open(xUrl, "_blank", "noopener,noreferrer")
    }
  }, [dict.share.myceliumPost])

  const handleMobileShare = useCallback(() => {
    setMobileOpen(false)
    handleHeaderShare()
  }, [handleHeaderShare])

  const handlePromptDismiss = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cg_lang_prompt_dismissed", "1")
    }
    setPromptVisible(false)
  }, [])

  const handlePromptSwitch = useCallback(() => {
    if (!suggestedLocale) return
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cg_lang_prompt_dismissed", "1")
    }
    switchLocale(suggestedLocale)
  }, [suggestedLocale, switchLocale])

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
            <Link href={localizePath(locale, "/")} className="flex items-center gap-3 shrink-0" aria-label="ClawGuru â€“ Startseite">
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
                  {dict.nav.more}
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
                title={dict.share.myceliumBtn}
                aria-label={dict.share.myceliumBtn}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                style={{
                  background: "rgba(255,200,0,0.08)",
                  border: "1px solid rgba(255,200,0,0.18)",
                  color: "#ffc800",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffc800" aria-hidden>
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.02-4.11c.53.5 1.23.81 2.01.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.91 9.81A2.99 2.99 0 0 0 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.83 0 1.58-.34 2.12-.88l7.06 4.14c-.05.21-.08.43-.08.66 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                </svg>
                <span className="hidden md:inline text-xs font-mono tracking-wide">
                  {dict.share.myceliumXBtn}
                </span>
              </button>

              {/* Language switcher */}
              <div className="block">
                <LanguageSwitcher currentLocale={locale} variant="compact" />
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
                href={`${prefix}/emergency`}
                className="hidden sm:block px-3 py-2 rounded-xl font-black text-sm transition-all duration-200"
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
              >
                {dict.nav.emergency}
              </Link>

              <Link
                href={`${prefix}/pricing`}
                className="hidden sm:block px-4 py-2 rounded-xl font-black text-sm transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #d4af37 0%, #e8cc6a 50%, #a8872a 100%)",
                  color: "#0a0a0a",
                  boxShadow: "0 0 16px rgba(212,175,55,0.25)",
                }}
              >
                {dict.nav.proKits}
              </Link>

              {/* Hamburger button (mobile only) */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden p-2 rounded-xl transition-colors text-gray-300 hover:text-white"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.1)" }}
                aria-label="Navigation Ã¶ffnen"
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

      {promptVisible && suggestedLocale && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-xl rounded-2xl border border-[#d4af37]/25 bg-black/85 backdrop-blur-xl p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="text-sm text-gray-200">
              {((dict as any).common?.locale_detected || "We detected")} <span className="font-bold">{suggestedLocale.toUpperCase()}</span>. {((dict as any).common?.switch_language || "Switch language?")}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handlePromptDismiss}
                className="px-3 py-1.5 rounded-lg border border-white/15 text-xs text-gray-300 hover:text-white"
              >
                {((dict as any).common?.stay_here || "Stay here")}
              </button>
              <button
                onClick={handlePromptSwitch}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-black"
                style={{ background: "linear-gradient(135deg, #d4af37, #e8cc6a, #a8872a)" }}
              >
                {((dict as any).common?.switch || "Switch")}
              </button>
            </div>
          </div>
        </div>
      )}

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
        aria-label="Mobile MenÃ¼"
      >
        <nav aria-label="Mobilnavigation" className="px-4 space-y-0.5">
          <div className="pb-3">
            <LanguageSwitcher currentLocale={locale} variant="full" />
          </div>

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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffc800" aria-hidden style={{ marginRight: 6 }}>
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.02-4.11c.53.5 1.23.81 2.01.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.91 9.81A2.99 2.99 0 0 0 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.83 0 1.58-.34 2.12-.88l7.06 4.14c-.05.21-.08.43-.08.66 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
              </svg>
              {dict.share.myceliumBtn}
            </button>

            <Link
              href={`${prefix}/emergency`}
              className="block px-4 py-3 rounded-xl font-black text-sm text-center"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
              onClick={() => setMobileOpen(false)}
            >
              {dict.nav.emergency}
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
              href={`${prefix}/pricing`}
              className="block px-4 py-3 rounded-xl font-black text-sm text-center text-black"
              style={{ background: "linear-gradient(135deg, #d4af37, #e8cc6a, #a8872a)" }}
              onClick={() => setMobileOpen(false)}
            >
              {dict.nav.proKits}
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
