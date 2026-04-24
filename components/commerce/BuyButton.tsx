"use client"

import { useState } from "react"
import { trackEvent } from "@/lib/analytics"
import { COUPON_SESSION_KEY } from "@/components/marketing/CouponBanner"
import { suggestAutopilotPlan, type UpgradeSignals } from "@/lib/autopilot-offering"
import { markCheckoutError, markCheckoutRedirect, markCheckoutStart } from "@/lib/retention-client"

function mapAutopilotPlanToProduct(plan: ReturnType<typeof suggestAutopilotPlan>): "daypass" | "pro" | "team" {
  if (plan === "scale") return "team"
  if (plan === "pro") return "pro"
  return "daypass"
}

export default function BuyButton({
  product,
  label,
  className,
  style,
  analyticsSource,
  annual,
  autoRecommend,
  upgradeSignals,
}: {
  product: "daypass" | "pro" | "team" | "msp"
  label: string
  className?: string
  style?: React.CSSProperties
  analyticsSource?: string
  annual?: boolean
  autoRecommend?: boolean
  upgradeSignals?: UpgradeSignals
}) {
  const [loading, setLoading] = useState(false)

  async function go() {
    const recommendedPlan = autoRecommend && upgradeSignals
      ? suggestAutopilotPlan(upgradeSignals)
      : undefined
    const resolvedProduct = recommendedPlan
      ? mapAutopilotPlanToProduct(recommendedPlan)
      : product

    const normalizedSignals = upgradeSignals
      ? {
          workspaces: Math.max(1, Math.min(999, Math.floor(upgradeSignals.workspaces))),
          needsApiExports: !!upgradeSignals.needsApiExports,
          needsPolicyControls: !!upgradeSignals.needsPolicyControls,
        }
      : undefined

    trackEvent("pricing_click", {
      product: resolvedProduct,
      source: analyticsSource ?? "buy_button",
      annual: !!annual,
      recommended_plan: recommendedPlan ?? null,
      upgrade_signals: normalizedSignals ? JSON.stringify(normalizedSignals) : null,
    })
    trackEvent("checkout_start", {
      source: analyticsSource ?? "buy_button",
      product: resolvedProduct,
      annual: !!annual,
      recommended_plan: recommendedPlan ?? null,
      upgrade_signals: normalizedSignals ? JSON.stringify(normalizedSignals) : null,
    })
    markCheckoutStart()
    setLoading(true)
    const coupon = typeof window !== "undefined"
      ? (sessionStorage.getItem(COUPON_SESSION_KEY) ?? undefined)
      : undefined
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: resolvedProduct,
          annual: !!annual,
          coupon_code: coupon ?? undefined,
          recommended_plan: recommendedPlan ?? undefined,
          upgrade_signals: normalizedSignals,
        }),
      })

      const text = await res.text()
      console.log("[BuyButton] status:", res.status)
      console.log("[BuyButton] raw response:", text)

      let data: unknown = null
      try {
        data = JSON.parse(text) as unknown
      } catch {
        alert("Checkout antwortet nicht als JSON:\n" + text)
        return
      }

      const dataObj = (data && typeof data === "object" ? (data as { error?: unknown; url?: unknown }) : {})

      if (!res.ok) {
        alert(
          "Checkout-Fehler:\n" +
            (typeof dataObj.error === "string" ? dataObj.error : `HTTP ${res.status}`)
        )
        return
      }

      if (typeof dataObj.url !== "string" || !dataObj.url) {
        alert("Keine Checkout-URL erhalten.\nResponse:\n" + JSON.stringify(data, null, 2))
        return
      }

      trackEvent("checkout_redirect", {
        source: analyticsSource ?? "buy_button",
        product: resolvedProduct,
        recommended_plan: recommendedPlan ?? null,
      })
      markCheckoutRedirect()
      window.location.href = dataObj.url
    } catch (err) {
      console.error("[BuyButton] fetch failed:", err)
      trackEvent("checkout_error", {
        source: analyticsSource ?? "buy_button",
        product: resolvedProduct,
      })
      markCheckoutError()
      alert("Checkout-Request fehlgeschlagen. Details in der Browser-Konsole.")
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
      {loading ? "…" : label}
    </button>
  )
}