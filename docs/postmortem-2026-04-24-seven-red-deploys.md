# Post-mortem — 7 red deploys before resolution

**Incident window:** 2026-04-24 afternoon–evening
**Platforms:** Vercel + Railway
**Resolution commit:** `77d615d5`
**Related docs:** [`db-failover-2026-04-24.md`](./db-failover-2026-04-24.md), [`testing.md`](./testing.md) (CI gates + `check:static-db` + roast-statistics resilience)

---

## Summary

Seven consecutive deploys failed with noisy unhandled WebSocket errors. The real failure was **Neon's primary project hit its compute-time quota**, but the error surfaced through several layers of indirection that made diagnosis slow:

1. Pages doing DB queries at **build time** (static prerender with `generateStaticParams` across 30 locales)
2. Neon-serverless threw `Error: Unhandled error.` from its WebSocket stack → thousands of log lines before the real SQL error
3. Next.js absorbed the async error and exited the build worker with a generic code

Fixing needed **three separate changes** landing together: DB pool failover, classifier bugfix, and marking DB-heavy routes as `force-dynamic`.

---

## Timeline (condensed)

| Time | Event |
|------|-------|
| 16:00 | User reports "7 deploys rot, auch deiner failed" |
| 16:05 | First diagnosis: extracted dynamic-usage-stack from Vercel log → `/leaderboard couldn't be rendered statically because it used headers` |
| 16:10 | User surfaces root cause: `DATABASE_URL_2` added to env because primary Neon ran into quota |
| 16:20 | **Commit `a8d68d99`** — primary→secondary failover in `lib/db.ts` with generic classifier |
| 16:30 | Redeploy → still red. Error this time: `Module not found: Can't resolve '@/lib/i18n-autotranslate'` (webpack static analysis) + `/leaderboard` static-render still failing |
| 17:15 | **Commit `2df66fe5`** — removed dynamic `require()` from `i18n-pick.ts`; marked leaderboard `force-dynamic` |
| 21:45 | Redeploy → still red. Error: `Your account or project has exceeded the compute time quota` (code `XX000`) → classifier in `a8d68d99` misclassified as "real SQL error", never failed over |
| 22:00 | **Commit `77d615d5`** — fixed classifier to recognize `XX000` + quota phrases; marked `/research`, `/moltbot/identity-governance-iam`, `/security-report-2026` `force-dynamic` |
| 22:10 | Deploy green |

---

## Root cause tree

```
Red deploys
└─ Neon WebSocket threw "Unhandled error" during static prerender
   ├─ Static prerender was running DB queries it shouldn't
   │  └─ Pages queried Neon inside server components with
   │     generateStaticParams spanning 30 locales → 30 DB hits per page per build
   │     FIX: force-dynamic on DB-heavy routes
   ├─ Primary Neon project was out of compute-time quota
   │  └─ Thousands of locale × route prerenders since weeks burned the free tier
   │     FIX: secondary Neon project (user action) + automatic failover
   └─ First failover attempt didn't engage
      └─ Neon wraps quota errors in valid-looking Postgres code XX000
         FIX: added XX000 + common quota phrases to failover classifier
```

---

## What worked

- Vercel deploy log had the full error chain including `dynamicUsageStack`; grepping the log for `Error:` + `dynamicUsageDescription` surfaced the real cause fast.
- `gh api ...commits/main/status` gave both Vercel and Railway states with one call (including `vercel inspect --logs` command ready to run).
- Incremental commits per fix kept the blame surface clean — reverting one is easy.

## What didn't work

- The first classifier assumed 5-char `.code` = real SQL error. That's almost-always true but wrong for the one case that matters (Neon's `XX000` quota wrapper).
- Dynamic `require()` with try/catch works at runtime but fails at webpack static-analysis time. Never use it for conditional module loading in Next.js; use a flipped-import pattern or `const undefined` placeholder.
- Marking ONE leaderboard page `force-dynamic` didn't find the three other DB-heavy routes. Grep for `dbQuery(` / `@/lib/db` **across all routes** the first time you touch any DB issue — saves a redeploy.

---

## Lessons / runbook additions

1. **Any page importing `@/lib/db` in `app/[lang]/` must be `force-dynamic` unless it is read-once cached.** Otherwise every build runs N locales × the DB call = guaranteed quota burn.
2. **Classifier for external-service failover must always include the service's documented quota/throttle error codes.** Neon: `XX000`. Supabase: `P0001` with specific messages. Stripe: `402` HTTP.
3. **Webpack at Next.js build time is not Node runtime.** `require()` inside try/catch is NOT safe when the module might not exist. Use a static import with a placeholder file or a build-time script that generates the file.
4. **First question when a deploy goes red: "did someone blow their quota?"** Check provider dashboards before chasing config bugs.

---

## Preventive follow-ups (future work)

- [x] Add `scripts/check-static-db-usage.js` — fail CI if a route in `app/[lang]/**` imports `@/lib/db` without `export const dynamic = "force-dynamic"` (wired as `npm run check:static-db` in the `unit-tests` CI job; see [`docs/testing.md`](./testing.md))
- [ ] Instrument `dbQuery()` to emit a metric when failover engages (Grafana / Vercel analytics) so quota near-misses show up before they hit
- [ ] Monitor Neon compute-time in both projects; rotate preemptively at 80 % instead of reactively at 100 %
- [ ] Build a small `lib/i18n-autotranslate.ts` placeholder that exports `{ default: undefined }` — then `i18n-pick` can use a real static import and we retire the inline `const undefined`
