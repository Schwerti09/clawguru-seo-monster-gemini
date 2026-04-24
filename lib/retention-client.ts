const RETENTION_KEY = "cg_retention_checkout"
const RETENTION_NUDGE_KEY = "cg_retention_nudge"
const NUDGE_COOLDOWN_MS = 12 * 60 * 60 * 1000

type RetentionLocal = {
  checkoutStarts: number
  checkoutRedirects: number
  checkoutErrors: number
}

type RetentionNudgeState = {
  dismissedUntilMs: number
}

export type RetentionNudge = {
  level: "watch" | "critical"
  message: string
  ctaLabel: string
  ctaPath: string
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

function readNudgeState(): RetentionNudgeState {
  if (typeof window === "undefined") return { dismissedUntilMs: 0 }
  try {
    const raw = localStorage.getItem(RETENTION_NUDGE_KEY)
    if (!raw) return { dismissedUntilMs: 0 }
    const parsed = JSON.parse(raw) as Partial<RetentionNudgeState>
    return {
      dismissedUntilMs: Number(parsed.dismissedUntilMs ?? 0),
    }
  } catch {
    return { dismissedUntilMs: 0 }
  }
}

function writeNudgeState(state: RetentionNudgeState) {
  if (typeof window === "undefined") return
  localStorage.setItem(RETENTION_NUDGE_KEY, JSON.stringify(state))
}

export function dismissRetentionNudge() {
  writeNudgeState({ dismissedUntilMs: Date.now() + NUDGE_COOLDOWN_MS })
}

export function getRetentionNudge(locale: string): RetentionNudge | null {
  const nudgeState = readNudgeState()
  if (Date.now() < nudgeState.dismissedUntilMs) return null

  const snapshot = getCheckoutRetentionSnapshot()
  const isDe = locale === "de"

  if (snapshot.checkoutErrors >= 2) {
    return {
      level: "critical",
      message: isDe
        ? "Mehrere Checkout-Fehler erkannt. Starte mit dem kürzesten Plan und upgrade danach im Dashboard."
        : "Multiple checkout errors detected. Start with the shortest plan and upgrade inside the dashboard.",
      ctaLabel: isDe ? "Sicheren Einstieg wählen" : "Choose safer entry plan",
      ctaPath: "/pricing",
    }
  }

  if (snapshot.checkoutStarts >= 3 && snapshot.checkoutRedirects === 0) {
    return {
      level: "watch",
      message: isDe
        ? "Du hast den Checkout mehrfach gestartet, aber nicht abgeschlossen. Ein kleinerer Einstieg reduziert Risiko."
        : "You started checkout multiple times without finishing. A smaller first step reduces commitment risk.",
      ctaLabel: isDe ? "Starter zuerst testen" : "Try Starter first",
      ctaPath: "/pricing",
    }
  }

  return null
}
