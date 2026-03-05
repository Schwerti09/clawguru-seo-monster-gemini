// In-memory counter for security checks (survives across requests in the same process).
let _checkCount = 0

export const trackEvent = (_event: string, _data?: Record<string, unknown>) => {}

export function incrementCheckCount(): number {
  if (typeof window !== "undefined") {
    const current = parseInt(localStorage.getItem("cg_check_count") ?? "0", 10)
    const next = current + 1
    localStorage.setItem("cg_check_count", String(next))
    return next
  }
  return ++_checkCount
}

export function getCheckCount(): number {
  if (typeof window !== "undefined") {
    return parseInt(localStorage.getItem("cg_check_count") ?? "0", 10)
  }
  return _checkCount
}

export default { trackEvent, incrementCheckCount, getCheckCount }
