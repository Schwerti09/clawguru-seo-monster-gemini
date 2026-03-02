// WORLD BEAST FINAL LAUNCH: lib/analytics.ts
// Umami privacy-first analytics — client-side event tracking helper.
// Works with the Umami script injected in app/layout.tsx.

export type UmamiEventName =
  | "security_check_started"
  | "runbook_viewed"
  | "share_button_clicked"
  | "conversion_daypass"
  | "conversion_pro"
  | "upsell_modal_shown"
  | "upsell_modal_clicked"
  | "launch_button_clicked"
  | "email_onboarding_triggered"

const SHADOW_STORAGE_KEY = "cg_shadow_id"

function hashString(input: string): string {
  let hash = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16)
}

export function getShadowId(): string | null {
  if (typeof window === "undefined") return null
  const cached = localStorage.getItem(SHADOW_STORAGE_KEY)
  if (cached) return cached
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    String(screen.width),
    String(screen.height),
    String(screen.colorDepth),
    String(navigator.hardwareConcurrency || ""),
    Intl.DateTimeFormat().resolvedOptions().timeZone || "",
  ]
    .filter(Boolean)
    .join("|")
  const shadowId = hashString(fingerprint)
  localStorage.setItem(SHADOW_STORAGE_KEY, shadowId)
  return shadowId
}

/**
 * WORLD BEAST FINAL LAUNCH: Track an event via Umami.
 * Safe to call on the client — no-ops if umami is not available.
 */
export function trackEvent(
  eventName: UmamiEventName,
  data?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return
  // umami is injected by the Umami script as a global
  const u = (window as unknown as { umami?: { track: (n: string, d?: unknown) => void } }).umami
  if (!u?.track) return
  try {
    const shadowId = getShadowId()
    u.track(eventName, shadowId ? { ...data, shadow_id: shadowId } : data)
  } catch {
    // WORLD BEAST FINAL LAUNCH: tracking is non-critical — swallow errors
  }
}

// WORLD BEAST FINAL LAUNCH: localStorage key for check counting
const STORAGE_KEY = "cg_check_count"

/**
 * WORLD BEAST FINAL LAUNCH: Increment the security-check counter in localStorage.
 * Returns the new count.
 */
export function incrementCheckCount(): number {
  if (typeof window === "undefined") return 0
  const prev = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10)
  const next = prev + 1
  localStorage.setItem(STORAGE_KEY, String(next))
  return next
}

/**
 * WORLD BEAST FINAL LAUNCH: Get current check count from localStorage.
 */
export function getCheckCount(): number {
  if (typeof window === "undefined") return 0
  return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10)
}
