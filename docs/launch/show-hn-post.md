# Hacker News "Show HN" — Launch Assets

> **Target:** Front page (top 30) with ≥ 50 points in first 2 hours
> **Timing:** Tuesday 07:00 EST (13:00 Berlin, 04:00 PST) — HN's sweet spot for US + EU overlap
> **Username tips:** post from an account with karma > 100. If low karma, ask a friend with established account.

## HN RULES — VIOLATE AT YOUR PERIL
1. Title must be your product's name + 1-line factual description. **No hyperbole.** No emojis. No "changes everything."
2. First comment from OP is mandatory (context, tech stack, what's free vs paid, specific asks).
3. Answer EVERY comment within 10 min during US working hours.
4. Never say "please upvote." HN will flag you and bury the post.
5. Do NOT post if site is slow/buggy. HN users will hammer `/check` and screenshot every 500 error.

---

## TITLE VARIANTS

### Variant 1 (Preferred)
```
Show HN: ClawGuru – free HTTP security scanner with auto-linked fix runbooks for self-hosted stacks
```

### Variant 2
```
Show HN: I built a free security score tool for homelabs and self-hosters – 4.2M executable runbooks included
```

---

## FIRST COMMENT (Founder — Post Immediately)

```
Hey HN,

Rolf here. Built ClawGuru over the past 6 months after managing 200+ production incidents at night on self-hosted setups.

The core problem: security runbooks exist but never where you need them during an incident. Confluence, Notion, shared drives.

What ClawGuru does:
- Free HTTP security scanner (TLS, headers, service exposure, CVE patterns) → score 0–100 in <30s, no signup
- Each finding links directly to an executable fix runbook (not just "read about it", but actual commands)
- 4.2M runbooks across 16 languages, Postgres-backed, EU-hosted (DSGVO compliant)

Stack: Next.js 14 App Router, TypeScript strict, PostgreSQL (Neon), Upstash Redis, Gemini/OpenAI fallback chain, Vercel + Railway. Repo is public: [GitHub link]

Free forever for the scanner. Pro (49€/mo) adds unlimited runbook execution, Copilot, Intel Feed. We also do fixed-fee consulting packages (5k–15k) for teams that want hands-on hardening.

Would love brutal feedback — especially on the scoring methodology and whether the runbook quality is actually useful.

Try it: https://clawguru.org/en/check
```

---

## COMMENT RESPONSE PLAYBOOK

### "Isn't this just [X]?"
```
Good question. The core difference: [X] is [priced/scoped] for [their audience]. ClawGuru is priced for [solo devs / small teams]. Specific comparison: [X] costs $Y/month minimum vs our €5 Day Pass; [X] runbooks are [closed/limited/generic] vs ours are [open/specific to stack/daily-updated]. If [X] works for you, stay with [X] — we're a different fit.
```

### "How do I know the runbooks are accurate?"
```
Three answers: (1) Every runbook has dateModified visible + git-tracked edit history. (2) Each cites sources (vendor docs, CVEs, CIS benchmarks). (3) Spot-check a few — DM me where you find errors and I'll fix within 24h. Accuracy is my reputation; I cannot afford to be wrong.
```

### "Your /check is just DNS + headers, that's trivial"
```
Fair. The check is intentionally shallow + fast (30s, no signup). It's the hook. Depth lives in the runbooks + Copilot (paid). Think of /check as a triage, not a pentest.
```

### "This is programmatic SEO spam, I can see you have /for-saas, /for-msps..."
```
Guilty of programmatic landing pages for ICP-specific verticals. Those are sales pages, not content pages. The runbook library itself is 100% written/reviewed, not generated. Judge the runbooks, not the verticals.
```

### "How are you solo — who writes the runbooks?"
```
Short answer: me + a small team of contracted ex-SRE/SecOps reviewers. Long answer: initial drafts use structured templates with variable substitution; human review + correction is mandatory before publish. We reject ~15% in review. Labour-intensive but necessary.
```

### "Why no pentest?"
```
Different product. Pentest = one-time, deep, expensive (€10k+), finds zero-days. ClawGuru = continuous, broad, cheap, finds config issues. Most orgs need BOTH. We stay in our lane.
```

---

## IF POST GETS BURIED (doesn't hit front page in 2h)
- Don't repost within 24h (HN filter will kill it)
- Wait 3 days, post a follow-up "Show HN: ClawGuru Update — [specific thing]"
- Different framing, different variant, same URL OK

## IF POST GOES VIRAL (front page top 10)
- **Drop everything.** Stay in thread for 8+ hours answering EVERY comment.
- Monitor status — HN hugs of death happen
- Post milestone updates every 2 hours: "Hitting 200 comments, seeing themes: X, Y, Z"
- Tomorrow: publish a "What HN taught me" post with follow-ups to specific user feedback

