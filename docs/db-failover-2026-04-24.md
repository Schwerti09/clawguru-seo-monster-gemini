# Database Failover Runbook

**Shipped:** 2026-04-24 · commit `a8d68d99`
**Scope:** `lib/db.ts` — primary + optional secondary Neon Pool with automatic fail-over
**Reason:** primary Neon project hit the compute-time quota during Vercel static build → 7 consecutive deploys (Vercel + Railway) failed with unhandled WebSocket errors bubbling out of `@neondatabase/serverless`.

---

## How it works

```
                         ┌────────────────────┐
   dbQuery(...)   ───▶   │  Pool (primary)    │  ← DATABASE_URL
                         └────────────────────┘
                                   │
                       ╔═══════════╧════════════╗
                       ║ Is the error a real    ║
                       ║ Postgres error (5-char ║
                       ║ code like "23505")?    ║
                       ╚═══════════╦════════════╝
                        yes │          │ no (conn / quota / ws)
                            ▼          ▼
                       bubble up    flip global flag
                                    `__claw_db_primary_disabled`
                                           │
                                           ▼
                         ┌────────────────────┐
                         │  Pool (secondary)  │  ← DATABASE_URL_2
                         └────────────────────┘
                                           │
                                           ▼
                                     rerun query
```

Failover is **sticky per Node process**. Once primary fails it is not retried until the process restarts (redeploy, cold start, or local `npm run dev` restart). This is intentional — retrying a dead Neon compute on every query adds latency and noise.

---

## Required env

| Var | Required | Purpose |
|-----|:--------:|---------|
| `DATABASE_URL` | yes for normal operation | Primary Neon project |
| `DATABASE_URL_2` | **only needed if primary is at risk** | Secondary Neon project (used when primary fails) |

Both must be valid Postgres/Neon connection strings. Any `sslmode` query param is stripped automatically — Neon serverless handles SSL internally.

---

## What bubbles up vs. what fails over

| Error | Example `.code` | Failover? | Rationale |
|-------|-----------------|:---------:|-----------|
| Unique violation | `23505` | ❌ | Your schema/bug, not a connectivity issue |
| Syntax error | `42601` | ❌ | Your query |
| Missing table | `42P01` | ❌ | Your migration |
| Permission denied | `42501` | ❌ | Auth config |
| **Neon quota exceeded** | **`XX000`** + message | **✅** | Explicit retryable code |
| **Too many connections** | **`53300`** | **✅** | Real Postgres overload → try secondary |
| **Admin shutdown / crash / cancel** | **`57P01`/`57P02`/`57P03`** | **✅** | Instance went away |
| ECONNREFUSED / network | (no code, or ECONN*) | ✅ | Primary unreachable |
| WebSocket close / unhandled | (no 5-char code) | ✅ | Neon serverless WebSocket died |
| Any message matching quota patterns | any | ✅ | "compute time", "quota exceeded", "limit reached", "too many connections" in `err.message` |

### Classifier (current — updated 2026-04-24 evening)

```ts
// Always failover on explicit retryable Postgres codes
RETRYABLE_CODES = { XX000, 53300, 57P01, 57P02, 57P03 }

// Always failover on quota/availability phrases in message
QUOTA_PATTERNS = [
  /compute[- _]?time/i,
  /quota\s*(exceeded|exhausted)/i,
  /limit\s*(exceeded|reached)/i,
  /plan.*(exceed|limit|upgrade)/i,
  /connection.*rejected|refused/i,
  /too\s*many\s*connections/i,
]

// Standard 5-char Postgres code (NOT in RETRYABLE_CODES) → real SQL error, don't mask
```

**Why the original classifier was wrong:** Neon returns compute-time-quota-exceeded with code `XX000` (internal_error) — a valid-looking 5-char code. The first version of `shouldFailover()` treated any 5-char code as "real SQL error, don't failover" → never tried `DATABASE_URL_2` when it mattered most. Fixed in the same commit that landed the DB-heavy-route fixes (`77d615d5`).

---

## Observability

On failover Node logs once per process:

```
[db] primary pool failed, failing over to DATABASE_URL_2 for the rest of this process: <message>
```

Grep deployment logs for `primary pool failed` to see when failover engaged.

---

## When to act

| Situation | Action |
|-----------|--------|
| Deploy logs show failover once per cold start | Primary is saturated — raise plan, check usage dashboard, or keep secondary as production |
| Failover on every request | Primary is dead — make secondary the new primary (swap envs), create a fresh secondary |
| Neither works | Both projects down or quota-exhausted — emergency: provision a third Neon project, set as `DATABASE_URL`, keep current secondary as `DATABASE_URL_2` |
| `DATABASE_URL_2` missing and primary fails | Behaviour regresses to current "deploy fails" state — add URL_2 immediately |

**Preventive:** monitor Neon compute-time in the Neon console for both projects. If primary is at >80 % of quota mid-cycle, pre-emptively rotate — don't wait for the red deploy.

---

## How to add a third DB URL

If you ever need three Neons in rotation, the design is easy to extend:

1. Add `DATABASE_URL_3` env
2. In `lib/db.ts`, add `getTertiary()` mirroring `getSecondary()`
3. Extend `dbQuery()` with a second failover stage after secondary
4. Add a `__claw_db_secondary_disabled` flag analogous to the primary one

The current classifier stays unchanged.

---

## How to force production onto the secondary

If primary is permanently dead and you need the secondary to be the default without waiting for a first-query failover:

**Option A — swap envs:**
```
# In Vercel / Railway / Netlify env settings:
DATABASE_URL = <old DATABASE_URL_2 value>
DATABASE_URL_2 = <old DATABASE_URL value>  (or leave unset)
```
Redeploy. Zero code change.

**Option B — set the kill switch at process start:**
Add `DATABASE_PRIMARY_DISABLED=1` support (not yet wired — do this if you need it). Then the pool skips primary entirely.

---

## Related code

- [`docs/testing.md`](./testing.md) — CI order, `check:static-db`, roast API build notes
- [`lib/db.ts`](../lib/db.ts) — pool definition, failover, query entry point
- [`lib/roast-stats-errors.ts`](../lib/roast-stats-errors.ts) — quota / `XX000` detection for roast statistics fallbacks
- [`lib/ai/providers.ts`](../lib/ai/providers.ts) — same pattern for LLM providers (Gemini → DeepSeek → OpenAI → OpenRouter — pre-existing)
- [`scripts/polish-via-gemini.js`](../scripts/polish-via-gemini.js) — multi-key rotation pattern that would transfer 1:1 to a multi-URL DB rotation
