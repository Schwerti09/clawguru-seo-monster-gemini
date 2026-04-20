// Public Score Store (Phase A1 - Viral Loop)
// Persists shareable security check results. Uses Postgres if DATABASE_URL is set,
// otherwise falls back to an in-memory Map (for local dev / build-time).

import { dbQuery } from "@/lib/db"

export interface PublicScore {
  token: string
  target: string
  score: number
  vulnerable: boolean
  top_risks: any[]
  recommendations: any[]
  locale: string
  view_count: number
  created_at: string
}

declare global {
  // eslint-disable-next-line no-var
  var __claw_public_scores: Map<string, PublicScore> | undefined
}

function memStore(): Map<string, PublicScore> {
  if (!global.__claw_public_scores) global.__claw_public_scores = new Map()
  return global.__claw_public_scores
}

function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

export function generateToken(): string {
  const bytes = new Uint8Array(12)
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256)
  }
  return Array.from(bytes).map((b) => b.toString(36).padStart(2, "0")).join("").slice(0, 16)
}

export async function createPublicScore(input: Omit<PublicScore, "token" | "view_count" | "created_at">): Promise<PublicScore> {
  const token = generateToken()
  const record: PublicScore = {
    ...input,
    token,
    view_count: 0,
    created_at: new Date().toISOString(),
  }
  if (hasDb()) {
    try {
      await dbQuery(
        `INSERT INTO public_scores (token, target, score, vulnerable, top_risks, recommendations, locale)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7)`,
        [
          token,
          record.target,
          record.score,
          record.vulnerable,
          JSON.stringify(record.top_risks),
          JSON.stringify(record.recommendations),
          record.locale,
        ],
      )
      return record
    } catch (e) {
      // fall through to memory
    }
  }
  memStore().set(token, record)
  return record
}

export async function getPublicScore(token: string): Promise<PublicScore | null> {
  if (hasDb()) {
    try {
      const r = await dbQuery<PublicScore>(
        `UPDATE public_scores SET view_count = view_count + 1 WHERE token = $1
         RETURNING token, target, score, vulnerable, top_risks, recommendations, locale, view_count, created_at`,
        [token],
      )
      if (r.rows[0]) return r.rows[0]
    } catch (e) {
      // fall through to memory
    }
  }
  return memStore().get(token) ?? null
}
