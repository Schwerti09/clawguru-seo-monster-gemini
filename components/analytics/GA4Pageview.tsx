"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

const GA_IDS = ["G-1BHBS4FG2Y"]

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export default function GA4Pageview() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!window.gtag || !pathname) return
    const page_location = typeof window !== "undefined" ? window.location.href : undefined
    const page_path = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`
    const debug_mode = typeof window !== "undefined" && window.location.hostname !== "clawguru.org"
    for (const id of GA_IDS) {
      window.gtag("config", id, {
        page_path,
        page_location,
        debug_mode,
      })
    }
  }, [pathname, searchParams])

  return null
}
