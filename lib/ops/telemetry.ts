const OBS_ENABLED = (process.env.OBS_ENABLED ?? "0") === "1"
const SAMPLE_RATE = Math.min(1, mathParse(process.env.OBS_SAMPLE_RATE, 0.05))

function mathParse(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  if (Number.isFinite(parsed)) {
    return parsed
  }
  return fallback
}

function shouldSample() {
  if (!OBS_ENABLED) return false
  if (SAMPLE_RATE >= 1) return true
  return Math.random() < SAMPLE_RATE
}

function sanitize(obj: Record<string, unknown>) {
  const piiFields = ["email", "token", "session", "password", "accessToken"]
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, piiFields.includes(key) ? "[redacted]" : value])
  )
}

export function logTelemetry(event: string, payload: Record<string, unknown>) {
  if (!shouldSample()) return
  const sanitizedPayload = sanitize(payload)
  console.info("[TELEMETRY]", event, sanitizedPayload)
}
