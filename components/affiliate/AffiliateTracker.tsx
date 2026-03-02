"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { captureAffiliateFromParams } from "@/lib/affiliate-client"

export default function AffiliateTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!searchParams) return
    captureAffiliateFromParams(searchParams)
  }, [searchParams])

  return null
}
