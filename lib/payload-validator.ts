/**
 * Payload Validator – strict incoming JSON request guard
 *
 * Protects API routes from:
 *  - Oversized payloads (Large Payload Attacks)
 *  - Deeply nested objects (JSON Bomb / stack overflow attacks)
 *  - Suspicious injection patterns (NoSQL injection, path traversal, script tags)
 *  - Missing or wrong-type required fields
 *
 * Usage:
 *   const result = validatePayload(rawBody, {
 *     maxBytes: 8192,
 *     requiredFields: [{ name: "target", type: "string", maxLength: 253 }],
 *   })
 *   if (!result.ok) {
 *     return NextResponse.json({ error: result.error }, { status: result.status })
 *   }
 *   const { target } = result.data as { target: string }
 */

export interface FieldSchema {
  /** Field name (top-level key) */
  name: string
  /** Expected JS type */
  type: "string" | "number" | "boolean" | "array" | "object"
  /** Whether the field must be present (default: true) */
  required?: boolean
  /** Max string length (only for type: "string") */
  maxLength?: number
  /** Max array length (only for type: "array") */
  maxItems?: number
  /** Min value (only for type: "number") */
  min?: number
  /** Max value (only for type: "number") */
  max?: number
}

export interface PayloadValidatorOptions {
  /** Maximum allowed raw body size in bytes (default: 65 536 = 64 KB) */
  maxBytes?: number
  /** Maximum JSON nesting depth (default: 8) */
  maxDepth?: number
  /** Field-level schema constraints */
  requiredFields?: FieldSchema[]
  /** Whether to scan string values for known injection patterns (default: true) */
  scanInjections?: boolean
}

export type ValidationResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string; status: 400 | 413 | 422 }

// ── Injection patterns ─────────────────────────────────────────────────────────
// Covers: NoSQL operators, script tags, SQL fragments, path traversal
const INJECTION_PATTERNS: RegExp[] = [
  /\$where\b/i,          // MongoDB $where injection
  /\$\s*gt\b|\$\s*lt\b|\$\s*ne\b|\$\s*in\b|\$\s*regex\b/i, // MongoDB operators
  /<\s*script[\s>]/i,    // XSS – <script>
  /javascript\s*:/i,      // XSS – javascript:
  /on\w+\s*=/i,           // XSS – event handlers
  /union\s+select\b/i,   // SQL injection
  /insert\s+into\b/i,    // SQL injection
  /drop\s+table\b/i,     // SQL injection
  /;\s*--/,              // SQL comment injection
  /\.\.\//,              // Path traversal ../
  /\0/,                  // Null byte injection
]

function containsInjection(value: string): boolean {
  return INJECTION_PATTERNS.some((re) => re.test(value))
}

/** Recursively check nesting depth of a parsed JSON value. */
function measureDepth(value: unknown, current = 0, max = 8): boolean {
  if (current > max) return true // too deep
  if (Array.isArray(value)) {
    return value.some((item) => measureDepth(item, current + 1, max))
  }
  if (value !== null && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((v) => measureDepth(v, current + 1, max))
  }
  return false
}

/** Scan all string values in an object/array tree for injection patterns. */
function scanForInjections(value: unknown): boolean {
  if (typeof value === "string") {
    return containsInjection(value)
  }
  if (Array.isArray(value)) {
    return value.some((item) => scanForInjections(item))
  }
  if (value !== null && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((v) => scanForInjections(v))
  }
  return false
}

/**
 * Validate a raw JSON string (or parsed object) against the given options.
 *
 * @param body    Either the raw request body as a string, or an already-parsed object.
 * @param options Validation constraints.
 */
export function validatePayload(
  body: string | Record<string, unknown>,
  options: PayloadValidatorOptions = {}
): ValidationResult {
  const maxBytes = options.maxBytes ?? 65_536
  const maxDepth = options.maxDepth ?? 8
  const scanInjections = options.scanInjections !== false

  // ── Size check (only when given a raw string) ──────────────────────────────
  let parsed: Record<string, unknown>
  if (typeof body === "string") {
    const byteLen = Buffer.byteLength(body, "utf-8")
    if (byteLen > maxBytes) {
      return {
        ok: false,
        error: `Payload too large: ${byteLen} bytes (max ${maxBytes})`,
        status: 413,
      }
    }
    try {
      parsed = JSON.parse(body) as Record<string, unknown>
    } catch {
      return { ok: false, error: "Invalid JSON", status: 400 }
    }
  } else {
    parsed = body
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, error: "Request body must be a JSON object", status: 400 }
  }

  // ── Depth check ────────────────────────────────────────────────────────────
  if (measureDepth(parsed, 0, maxDepth)) {
    return { ok: false, error: `JSON nesting exceeds maximum depth of ${maxDepth}`, status: 422 }
  }

  // ── Injection scan ─────────────────────────────────────────────────────────
  if (scanInjections) {
    if (scanForInjections(parsed)) {
      // Log server-side only – never echo back the suspicious content to the caller
      console.warn("[payload-validator] Suspicious pattern detected in request")
      return { ok: false, error: "Suspicious pattern detected in request payload", status: 422 }
    }
  }

  // ── Field-level validation ─────────────────────────────────────────────────
  if (options.requiredFields) {
    for (const schema of options.requiredFields) {
      const val = parsed[schema.name]
      const isRequired = schema.required !== false

      if (val === undefined || val === null) {
        if (isRequired) {
          return { ok: false, error: `Missing required field: "${schema.name}"`, status: 400 }
        }
        continue
      }

      // Type check
      const actualType = Array.isArray(val) ? "array" : typeof val
      if (actualType !== schema.type) {
        return {
          ok: false,
          error: `Field "${schema.name}" must be of type ${schema.type}, got ${actualType}`,
          status: 422,
        }
      }

      // String constraints
      if (schema.type === "string" && typeof val === "string") {
        if (schema.maxLength !== undefined && val.length > schema.maxLength) {
          return {
            ok: false,
            error: `Field "${schema.name}" exceeds max length of ${schema.maxLength}`,
            status: 422,
          }
        }
      }

      // Number constraints
      if (schema.type === "number" && typeof val === "number") {
        if (schema.min !== undefined && val < schema.min) {
          return { ok: false, error: `Field "${schema.name}" must be ≥ ${schema.min}`, status: 422 }
        }
        if (schema.max !== undefined && val > schema.max) {
          return { ok: false, error: `Field "${schema.name}" must be ≤ ${schema.max}`, status: 422 }
        }
      }

      // Array constraints
      if (schema.type === "array" && Array.isArray(val)) {
        if (schema.maxItems !== undefined && val.length > schema.maxItems) {
          return {
            ok: false,
            error: `Field "${schema.name}" exceeds max items of ${schema.maxItems}`,
            status: 422,
          }
        }
      }
    }
  }

  return { ok: true, data: parsed }
}
