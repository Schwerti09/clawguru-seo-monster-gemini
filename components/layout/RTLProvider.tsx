'use client'

// NEXT-LEVEL UPGRADE 2026: RTL Direction Provider
// Client component that sets the document dir attribute based on the current URL locale.
// This handles Arabic (ar) and future RTL languages.

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { SUPPORTED_LOCALES, isRTL, type Locale } from "@/lib/i18n"

export default function RTLProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean)
    const firstSegment = segments[0] as Locale
    const locale = SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : "de"
    const dir = isRTL(locale) ? "rtl" : "ltr"

    // Update the html element's dir and lang attributes dynamically
    document.documentElement.setAttribute("dir", dir)
    document.documentElement.setAttribute("lang", locale)
  }, [pathname])

  return <>{children}</>
}
