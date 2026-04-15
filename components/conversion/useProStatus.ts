"use client"

import { useState, useEffect } from "react"

export function useProStatus() {
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for Pro status via customer entitlements
    const checkProStatus = async () => {
      try {
        const res = await fetch("/api/user/entitlements", {
          method: "GET",
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          // Check if user has "pro" or higher tier
          const hasPro = data.tier === "pro" || data.tier === "enterprise" || data.tier === "team"
          setIsPro(hasPro)
        }
      } catch (err) {
        // User not logged in or API error -> assume free tier
        setIsPro(false)
      } finally {
        setLoading(false)
      }
    }

    checkProStatus()
  }, [])

  return { isPro, loading }
}
