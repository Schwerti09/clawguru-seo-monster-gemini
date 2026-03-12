const HEADER_NAME = "x-request-id"

export function generateRequestId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID()
    }
  } catch {
    // fall through to weak fallback
  }
  return `${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`
}

export function getRequestId(headers: Headers) {
  return headers.get(HEADER_NAME) ?? generateRequestId()
}

export function getRequestIdHeaderName() {
  return HEADER_NAME
}
