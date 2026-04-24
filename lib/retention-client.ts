const RETENTION_KEY = "cg_retention_checkout"

type RetentionLocal = {
  checkoutStarts: number
  checkoutRedirects: number
  checkoutErrors: number
}

function readState(): RetentionLocal {
  if (typeof window === "undefined") return { checkoutStarts: 0, checkoutRedirects: 0, checkoutErrors: 0 }
  try {
    const raw = localStorage.getItem(RETENTION_KEY)
    if (!raw) return { checkoutStarts: 0, checkoutRedirects: 0, checkoutErrors: 0 }
    const parsed = JSON.parse(raw) as Partial<RetentionLocal>
    return {
      checkoutStarts: Number(parsed.checkoutStarts ?? 0),
      checkoutRedirects: Number(parsed.checkoutRedirects ?? 0),
      checkoutErrors: Number(parsed.checkoutErrors ?? 0),
    }
  } catch {
    return { checkoutStarts: 0, checkoutRedirects: 0, checkoutErrors: 0 }
  }
}

function writeState(state: RetentionLocal) {
  if (typeof window === "undefined") return
  localStorage.setItem(RETENTION_KEY, JSON.stringify(state))
}

export function markCheckoutStart() {
  const state = readState()
  writeState({ ...state, checkoutStarts: state.checkoutStarts + 1 })
}

export function markCheckoutRedirect() {
  const state = readState()
  writeState({ ...state, checkoutRedirects: state.checkoutRedirects + 1 })
}

export function markCheckoutError() {
  const state = readState()
  writeState({ ...state, checkoutErrors: state.checkoutErrors + 1 })
}

export function getCheckoutRetentionSnapshot(): RetentionLocal {
  return readState()
}
