# Hacker News "Show HN" — 7 A/B Variants

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

## VARIANT 1 — Neutral, factual (SAFEST, recommended default)

**Title:**
```
Show HN: ClawGuru – 4.2M expert-reviewed security runbooks, free 30-sec scan
```
*79 chars — under HN's 80-char limit*

**URL:** `https://clawguru.org`

**First comment (paste immediately after submission):**
```
Hi HN, Schwerti (solo founder) here.

ClawGuru is a security runbook library + a free 30-second security check for
self-hosted infrastructure. I built it because every commercial security
platform I looked at was priced for Fortune-500 orgs (€50k+/year) and
designed for 20-person security teams. Most of us don't have that.

What's free:
 - /check — paste a domain/IP/URL, get a Claw Score (0-100) and top 3
   concrete risks in ~30 seconds. No signup.
 - Browse ~4.2M indexed, expert-reviewed runbooks (Linux hardening, K8s,
   Docker, Nginx, AWS IAM, Terraform, ...). Each page is static + copy-
   pasteable shell snippets.

What costs money:
 - Day Pass €5 (24h unlimited checks + full runbooks)
 - Pro €29/mo (Copilot AI, API access, incident templates)
 - Team/Enterprise — covers SOC 2 / DORA / GDPR readiness work

Tech stack (for the curious):
 - Next.js 14 (app dir) on Netlify edge + Postgres on Neon
 - Runbooks are static MDX + dynamic programmatic-SEO layer
 - Copilot: not an LLM wrapper — we embed our runbook corpus and rerank
   with a domain-tuned retriever; answers cite the specific runbook they
   quote so you can verify the source
 - EU-hosted, no third-party trackers, GDPR-first

What I'd love HN feedback on:
 1. Try the free /check on something you maintain. Is the Claw Score +
    top 3 risks actually useful, or generic?
 2. Open a runbook. Is it accurate? (I maintain them — if something's
    wrong I want to know.)
 3. Pricing — is €5 Day Pass sane for a dev who just wants to hunt one
    bug on one weekend?

I'll be in this thread all day (Berlin time 13:00-23:00 = EST 07:00-17:00).
Fire away.
```

---

## VARIANT 2 — Problem-framing (good if HN mood is anti-SaaS)

**Title:**
```
Show HN: ClawGuru – security tooling for solo devs, not Fortune 500 teams
```

**First comment opens:**
```
Every time I've looked at commercial security tools — Wiz, Snyk, CrowdStrike
— they start at $50k/year and assume you have a security team. I don't.
Most self-hosters don't. So I built the thing I wanted: /check for free,
runbooks free to read, €5 Day Pass if you need to dig deep on a specific
stack. [...then same content as variant 1]
```

---

## VARIANT 3 — Technical hook (good for weekday engineers audience)

**Title:**
```
Show HN: ClawGuru – runbook library + retriever-based security copilot
```

**First comment opens:**
```
Tech-first pitch: ClawGuru indexes 4.2M security runbooks and surfaces
them through a retriever + domain-tuned reranker instead of an LLM
wrapper. Answers cite the runbook that sourced them. Here's why that
matters when the bot tells you to `sudo rm -rf /var/lib/postgres` — you
can click through and see it was actually recommended for a specific
disaster-recovery scenario on a sacrificial volume, not production. [...]
```

---

## VARIANT 4 — "I built X because Y" (HN loves this pattern)

**Title:**
```
Show HN: ClawGuru – I built a security runbook library after failing SOC 2
```

**First comment opens:**
```
A year ago my startup tried to close an enterprise deal. Customer sent
a 200-question security questionnaire. I spent 3 weeks copy-pasting
from old notes. We still missed things. Deal died because we couldn't
produce a "Multi-tenant Isolation Policy" in time.

ClawGuru is the library I wish I'd had. 4.2M runbooks organized by
stack (K8s, Docker, AWS, ...) and by compliance framework (SOC 2,
GDPR, DORA). Free to read, free 30-sec check, €5/day if you need to
dig deep. [...]
```
*NOTE: only use this if the story is actually true. HN smells embellishment.*

---

## VARIANT 5 — Comparison hook (risky — can backfire if competitors are in thread)

**Title:**
```
Show HN: ClawGuru – self-hosted alternative to Wiz/Snyk for €5 a day
```
*Don't use unless you're ready for Wiz/Snyk reps in the thread. They WILL show up.*

---

## VARIANT 6 — Concrete number hook

**Title:**
```
Show HN: ClawGuru – avg user fixes 7 security issues in first 30 min
```
*Only use if the number is backed by real data from beta. HN will ask "how do you measure that" — have an answer.*

---

## VARIANT 7 — Open-source angle (best if we open-source any runbooks)

**Title:**
```
Show HN: ClawGuru – 4.2M security runbooks, 500 open-sourced on GitHub
```
*REQUIRES: create a public GitHub repo with 500 of our runbooks in Markdown FIRST. 10h of work. Biggest viral potential — GitHub readme badge embeds drive long-tail traffic.*

---

## WHICH VARIANT TO PICK

**Decision tree:**
1. Have we shipped GitHub repo with 500 open-sourced runbooks? → **Variant 7**
2. Do we have verified real user data like "avg fixes N issues"? → **Variant 6**
3. Is the founder-story (Variant 4) literally true? → **Variant 4**
4. Otherwise → **Variant 1** (safest, highest hit rate historically)

**NEVER use:** Variant 5 unless prepared for competitor ambush.

---

## Comment Response Playbook

### "Isn't this just [X]?" (will happen in first 30min)
```
Good question. The core difference: [X] is [priced/scoped] for [their
audience]. ClawGuru is priced for [solo devs / small teams]. Specific
comparison: [X] costs $Y/month minimum vs our €5 Day Pass; [X] runbooks
are [closed/limited/generic] vs ours are [open/specific to stack/daily-
updated]. If [X] works for you, stay with [X] — we're a different fit.
```

### "How do I know the runbooks are accurate?"
```
Three answers: (1) Every runbook has dateModified visible + git-tracked
edit history. (2) Each cites sources (vendor docs, CVEs, CIS benchmarks).
(3) Spot-check a few — DM me where you find errors and I'll fix within
24h. Accuracy is my reputation; I cannot afford to be wrong.
```

### "Your /check is just DNS + headers, that's trivial"
```
Fair. The check is intentionally shallow + fast (30s, no signup). It's
the hook. Depth lives in the runbooks + Copilot (paid). Think of /check
as a triage, not a pentest.
```

### "This is programmatic SEO spam, I can see you have /for-saas, /for-msps..."
```
Guilty of programmatic landing pages for ICP-specific verticals. Those
are sales pages, not content pages. The runbook library itself is 100%
written/reviewed, not generated. Judge the runbooks, not the verticals.
```

### "How are you solo — who writes the runbooks?"
```
Short answer: me + a small team of contracted ex-SRE/SecOps reviewers.
Long answer: initial drafts use structured templates with variable
substitution; human review + correction is mandatory before publish.
We reject ~15% in review. Labour-intensive but necessary.
```

### "Why no pentest?"
```
Different product. Pentest = one-time, deep, expensive (€10k+), finds
zero-days. ClawGuru = continuous, broad, cheap, finds config issues.
Most orgs need BOTH. We stay in our lane.
```

---

## IF POST GETS BURIED (doesn't hit front page in 2h)

- Don't repost within 24h (HN filter will kill it)
- Wait 3 days, post a follow-up "Show HN: ClawGuru Update — [specific thing]"
- Different framing, different variant, same URL OK

## IF POST GOES VIRAL (front page top 10)

- **Drop everything.** Stay in thread for 8+ hours answering EVERY comment.
- Monitor Netlify status — HN hugs of death happen
- Post milestone updates every 2 hours: "Hitting 200 comments, seeing themes: X, Y, Z"
- Tomorrow: publish a "What HN taught me" post with follow-ups to specific user feedback
