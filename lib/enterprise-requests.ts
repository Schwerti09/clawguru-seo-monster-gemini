/**
 * Enterprise Request Store – in-memory log of enterprise contact form submissions.
 *
 * Entries survive for the lifetime of the server process.  On the next cold
 * start the list resets, which is fine for a lightweight internal inbox.
 *
 * In a production multi-instance deployment replace this with a persistent
 * store (e.g. a PostgreSQL table or a Redis list).
 */

export type EnterpriseRequest = {
  id: string
  createdAt: string
  name: string
  email: string
  company: string
  message: string
}

// Module-level singleton – persists across requests within the same process.
const requests: EnterpriseRequest[] = []

/** Append a new enterprise request and return the stored record. */
export function addEnterpriseRequest(
  data: Omit<EnterpriseRequest, "id" | "createdAt">
): EnterpriseRequest {
  const entry: EnterpriseRequest = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...data,
  }
  requests.unshift(entry) // newest first
  return entry
}

/** Return all stored enterprise requests (newest first). */
export function getEnterpriseRequests(): EnterpriseRequest[] {
  return [...requests]
}
