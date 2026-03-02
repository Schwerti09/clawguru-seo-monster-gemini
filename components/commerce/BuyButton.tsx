"use client"

import { useState } from "react"

export default function BuyButton({
  product,
  label,
  className,
  style
}: {
  product: "daypass" | "pro" | "team" | "msp"
  label: string
  className?: string
  style?: React.CSSProperties
}) {
  const [loading, setLoading] = useState(false)

  function readCookie(name: string) {
    return document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`))
      ?.split("=")[1]
  }

  function getAffiliateRef() {
    if (typeof window === "undefined") return undefined
    const stored = localStorage.getItem("affiliate_ref")
    if (stored) return stored
    const cookieValue = readCookie("affiliate_ref")
    return cookieValue ? decodeURIComponent(cookieValue) : undefined
  }

  async function go() {
    setLoading(true)
    try {
      const affiliateRef = getAffiliateRef()
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, affiliate_ref: affiliateRef })
      })
      const data = await res.json()
      if (data?.url) window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={go}
      disabled={loading}
      className={
        className ||
        "px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 disabled:opacity-60"
      }
      style={style}
    >
      {loading ? "Weiter…" : label}
    </button>
  )
}
