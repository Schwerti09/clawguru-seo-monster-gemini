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
| ECONNREFUSED / network | (no code, or ECONN*) | ✅ | Primary unreachable |
| WebSocket close / unhandled | (no 5-char code) | ✅ | Neon serverless WebSocket died |
| `compute_time_quota_exceeded` | (string message) | ✅ | Primary quota hit |
| `too_many_connections` | `53300` | ❌ (rare) | Real Postgres overload — switch manually |

The classifier is dumb on purpose: `shouldFailover()` returns `true` unless the error has a 5-char uppercase/alphanumeric `.code` (Postgres SQLSTATE format).

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

- [`lib/db.ts`](../lib/db.ts) — pool definition, failover, query entry point
- [`lib/ai/providers.ts`](../lib/ai/providers.ts) — same pattern for LLM providers (Gemini → DeepSeek → OpenAI → OpenRouter — pre-existing)
- [`scripts/polish-via-gemini.js`](../scripts/polish-via-gemini.js) — multi-key rotation pattern that would transfer 1:1 to a multi-URL DB rotation
