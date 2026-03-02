/**
 * Circuit Breaker – graceful degradation for third-party service calls
 *
 * States:
 *   CLOSED    – normal operation; calls pass through.
 *   OPEN      – too many failures detected; calls are blocked immediately and
 *               a fallback / cached response is returned instead.
 *   HALF_OPEN – recovery probe: after `recoveryTimeoutMs` one call is allowed
 *               through to test whether the downstream service has recovered.
 *
 * Usage:
 *   const breaker = getCircuitBreaker("gemini-api")
 *   if (!breaker.isCallAllowed()) {
 *     return cachedOrDegradedResponse()
 *   }
 *   try {
 *     const result = await callGemini(...)
 *     breaker.recordSuccess()
 *     return result
 *   } catch (err) {
 *     breaker.recordFailure()
 *     throw err
 *   }
 */

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN"

export interface CircuitBreakerOptions {
  /** Number of consecutive failures before opening the circuit (default: 5) */
  failureThreshold?: number
  /** Milliseconds to wait in OPEN state before probing again (default: 30 000) */
  recoveryTimeoutMs?: number
  /** Consecutive successes in HALF_OPEN needed to close the circuit (default: 2) */
  successThreshold?: number
}

export class CircuitBreaker {
  private state: CircuitState = "CLOSED"
  private failures = 0
  private successes = 0
  private openedAt = 0

  private readonly failureThreshold: number
  private readonly recoveryTimeoutMs: number
  private readonly successThreshold: number

  constructor(
    public readonly name: string,
    options: CircuitBreakerOptions = {}
  ) {
    this.failureThreshold = options.failureThreshold ?? 5
    this.recoveryTimeoutMs = options.recoveryTimeoutMs ?? 30_000
    this.successThreshold = options.successThreshold ?? 2
  }

  /** Returns the current circuit state. */
  getState(): CircuitState {
    return this.state
  }

  /**
   * Whether the next call should be allowed through.
   * Also transitions OPEN → HALF_OPEN when the recovery timeout has elapsed.
   */
  isCallAllowed(): boolean {
    if (this.state === "CLOSED") return true

    if (this.state === "OPEN") {
      if (Date.now() - this.openedAt >= this.recoveryTimeoutMs) {
        this.state = "HALF_OPEN"
        this.successes = 0
        return true // allow the probe call
      }
      return false
    }

    // HALF_OPEN: only allow one probe at a time
    return true
  }

  /** Record a successful call. May close the circuit from HALF_OPEN. */
  recordSuccess(): void {
    if (this.state === "HALF_OPEN") {
      this.successes += 1
      if (this.successes >= this.successThreshold) {
        this.reset()
      }
    } else if (this.state === "CLOSED") {
      // Reset failure counter on success in CLOSED state
      this.failures = 0
    }
  }

  /** Record a failed call. May open the circuit from CLOSED / HALF_OPEN. */
  recordFailure(): void {
    if (this.state === "HALF_OPEN") {
      // Probe failed – go back to OPEN
      this.trip()
      return
    }
    this.failures += 1
    if (this.failures >= this.failureThreshold) {
      this.trip()
    }
  }

  /** Manually open the circuit (e.g. on a health-check alert). */
  trip(): void {
    this.state = "OPEN"
    this.openedAt = Date.now()
    this.successes = 0
  }

  /** Manually close the circuit and reset all counters. */
  reset(): void {
    this.state = "CLOSED"
    this.failures = 0
    this.successes = 0
    this.openedAt = 0
  }

  /** Serialisable status snapshot for health/monitoring endpoints. */
  status(): { name: string; state: CircuitState; failures: number; openedAt: number | null } {
    return {
      name: this.name,
      state: this.state,
      failures: this.failures,
      openedAt: this.openedAt > 0 ? this.openedAt : null,
    }
  }
}

// ── Registry ──────────────────────────────────────────────────────────────────
// One singleton breaker per named service so the state is shared across requests
// within the same Node.js process.

const registry = new Map<string, CircuitBreaker>()

/**
 * Get (or create) a named circuit breaker.
 * Options are only applied when the breaker is first created.
 */
export function getCircuitBreaker(name: string, options?: CircuitBreakerOptions): CircuitBreaker {
  if (!registry.has(name)) {
    registry.set(name, new CircuitBreaker(name, options))
  }
  return registry.get(name)!
}

/** List all registered circuit breakers (for a health/status endpoint). */
export function listCircuitBreakers(): ReturnType<CircuitBreaker["status"]>[] {
  return Array.from(registry.values()).map((b) => b.status())
}
