type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const ENDPOINT = "/api/analytics/check"

export function trackEvent(event: string, data: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") return

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, data)
    }
  } catch {}

  try {
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data }),
      keepalive: true,
    })
  } catch {}
}

export function incrementCheckCount(): number {
  if (typeof window === "undefined") return 0
  const current = Number.parseInt(localStorage.getItem("cg_check_count") ?? "0", 10) || 0
  const next = current + 1
  localStorage.setItem("cg_check_count", String(next))
  return next
}

export function getCheckCount(): number {
  if (typeof window === "undefined") return 0
  return Number.parseInt(localStorage.getItem("cg_check_count") ?? "0", 10) || 0
}

const analytics = { trackEvent, incrementCheckCount, getCheckCount }
export default analytics
