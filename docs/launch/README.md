# ClawGuru Launch Playbook — Phase B (Revenue War Plan)

> **Launch Window:** Week 3–4 of Revenue War Plan 2026 (03.05 → 17.05)
> **Goal:** Coordinated PH + HN + Reddit + X + LinkedIn launch.
> **Expected:** 50–100k visits in 48h · 500–1500 Day Passes sold in launch week.

## Launch Day Schedule (UTC+2 Berlin)

| Time | Channel | Action |
|------|---------|--------|
| 09:01 | Product Hunt | Go live (PH reset = 00:01 PST) |
| 09:05 | Product Hunt | Post First Comment |
| 13:00 | Hacker News | "Show HN" post (7am EST sweet spot) |
| 13:05 | Hacker News | Post first comment with context |
| 15:00 | X / Twitter | Publish 15-tweet launch thread |
| 16:00 | Reddit r/selfhosted | Value-first post (top-10 misconfigs) |
| 16:30 | Reddit r/homelab | "Jellyfin got wrecked" post |
| 17:00 | Reddit r/sysadmin | Post-mortem: 3 runbooks |
| 17:30 | Reddit r/devops | "Runbooks as code" post |
| 18:00 | LinkedIn | Founder launch post |
| 22:00 | All channels | End-of-day wrap tweets/comments |

## Assets in this Folder

| File | Purpose |
|------|---------|
| `product-hunt-assets.md` | Name, tagline, description, gallery brief, first comment, hourly comment schedule |
| `show-hn-post.md` | 7 A/B title variants + response playbook for common HN comment patterns |
| `reddit-launch-posts.md` | Full post bodies for 5 subreddits (value-first, non-promotional) |
| `x-launch-thread.md` | 15-tweet thread + alternative short-form versions + engagement playbook |

## LinkedIn Post (not yet in separate doc — included here because it's short)

```
I'm launching ClawGuru today.

After 6 months heads-down, I'm putting it in front of the world:
a security runbook library + 30-second free scan + AI copilot that
cites its sources, priced for solo devs and small teams.

Why this, why now:
 - Every "enterprise security" product is priced for Fortune 500.
   I can't afford $50k/year and neither can most people I know.
 - Self-hosted infra is having a renaissance. Solo devs, homelabs,
   bootstrapped startups. They all need security tooling that respects
   their scale + budget.
 - Compliance keeps getting harder (DORA, NIS2, SOC 2). Small teams
   can't dedicate an FTE to questionnaires. That's where we help.

What I'd love from my network today:

1. Try the 30-sec check: clawguru.org/check
   It's free, no signup. Run it on something you maintain and tell me
   if the result was useful or generic.

2. If you know a dev who would benefit — forward this to them.
   That's it, no "please share!!" — just if it's genuinely useful.

3. If you ARE at an enterprise thinking about SOC 2 / DORA / GDPR
   readiness — I have a consulting flow specifically for that.
   clawguru.org/consulting

Also live today: Product Hunt, Hacker News, and r/selfhosted.
Come say hi in any of those threads.

🇪🇺 EU-hosted. GDPR-first. No dark patterns.

Thanks for reading. Time to go answer a lot of comments.
```

## Press Outreach — Additional Targets

Tracked separately in `docs/press-pitch.md`. On launch day, send press releases to:
- TechCrunch (security@techcrunch.com)
- Heise (redaktion@heise.de — DACH market)
- The Register (tips@theregister.com — UK + enterprise)
- Bleeping Computer (tips@bleepingcomputer.com — security audience)

## Success Criteria (from AGENTS.md Revenue War Plan)

| Metric | Must-Hit | Nice-to-Have | Stretch |
|--------|----------|--------------|---------|
| 48h total visits | 20k | 50k | 100k |
| Newsletter subs gained | 300 | 1000 | 3000 |
| Day Passes sold | 100 | 500 | 1500 |
| PH Rank | Top 10 | Top 5 | #1 |
| HN Points | 30 | 100 | Front page |
| Press mentions | 1 | 3 | 5+ |

## Post-Launch (T+1 to T+7)

- **Day +1:** Publish `/launch-results` public post-mortem page (transparency = backlinks)
- **Day +1:** Thank-you email to every commenter on PH + HN + Reddit + X
- **Day +3:** Blog post "What launch day taught me" (numbers, surprises, what broke, what worked)
- **Day +7:** Retargeting email to `HUNTER50` and `SHOWHN50` coupon users: "How's your first week?"
- **Week +2:** Compile best feedback into roadmap update, publish publicly
- **Week +4:** Evaluate: hit targets? If yes, schedule second wave for a month later with learnings applied. If no, post-mortem what went wrong.

## Post-Launch Coupon Map

- `HUNTER50` — Product Hunt visitors, 50% off first month Pro, expires T+7
- `SHOWHN50` — Hacker News, 50% off first month Pro, expires T+7
- `REDDIT30` — Reddit launch posts, 30% off first month Pro, expires T+14
- `BIRDS25` — X thread readers, 25% off first month Pro, expires T+7
- `LINKEDIN25` — LinkedIn connections, 25% off first month Pro, expires T+14

All coupons must be pre-configured in Stripe before launch. Validate via test-checkout T-1 day.
