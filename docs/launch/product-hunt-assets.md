# Product Hunt Launch Assets — ClawGuru

> **Launch Day Target:** Tuesday 00:01 PST (Pacific — that's when PH resets)
> **Goal:** Top 5 Product of the Day, ≥ 500 upvotes, 50+ comments
> **Fallback if bumped:** Relaunch on next quiet Tuesday (avoid Apple/Google events)

---

## 1. Product Information

### Name
```
ClawGuru
```

### Tagline (max 60 chars — use ALL the space)
**Primary (recommended):**
```
4.2M expert-reviewed security runbooks for self-hosters
```
*59 chars — leaves no dead-space, concrete, specific number = trust signal*

### Alternatives (A/B in polls if time allows):
```
Your DevOps team's missing security playbook library
```
```
Fix security issues before auditors (or hackers) find them
```
```
Security runbooks + AI copilot for self-hosted stacks
```

### Description (max 260 chars)
```
ClawGuru is the security runbook library for self-hosted teams. 4.2M expert-reviewed playbooks covering Linux, K8s, Docker, cloud. Free 30-second check scores your stack. Pro unlocks copilot + incident response. GDPR/SOC2/DORA-ready templates. EU-hosted.
```
*258 chars*

### Categories
1. **Developer Tools** (primary)
2. **DevOps**
3. **SaaS**
4. **Tech** (broader reach)

### Topics (PH-tags, pick 5)
- security
- devops
- self-hosted
- open-source
- productivity

---

## 2. Gallery (this is 70% of conversion — do NOT phone it in)

> **Format:** 1270×760 PNG, ≤ 2MB each. Upload 5–8 total.

### Slide 1 — "The Hook" (most important — this is your thumbnail)
**Content:**
- Big headline: **"Fix your infra security in 30 seconds"**
- Subhead: "4.2M runbooks. AI copilot. Starts at €5."
- Visual: Screenshot of `/check` result showing Claw Score 73/100 + 3 critical issues highlighted
- Bottom-right badge: "🇪🇺 EU-hosted · GDPR-compliant"

### Slide 2 — "The Problem"
**Content:**
- Headline: "Security tools are built for Fortune 500. Not for you."
- Visual: Split-screen — left shows an overwhelming Wiz/CrowdStrike dashboard ("$50k/year"), right shows ClawGuru's clean `/check` input ("€5 Day Pass")

### Slide 3 — "The Solution (ROI)"
**Content:**
- Headline: "One scan. Ranked risks. Copy-paste fixes."
- Visual: Screenshot of a runbook page (e.g. `/runbook/kubernetes-rbac-hardening`) with code block + copy button visible

### Slide 4 — "Proof of Depth"
**Content:**
- Headline: "4.2M runbooks. Updated daily. Expert-reviewed."
- Visual: Grid of 12 logos/tech-names: Docker, Kubernetes, PostgreSQL, Nginx, AWS IAM, Terraform, NGINX, Redis, MongoDB, Ansible, GitHub Actions, Vault

### Slide 5 — "For Real Workflows"
**Content:**
- Headline: "Built into your incident workflow"
- Visual: Screenshot of copilot chat answering "How do I rotate PostgreSQL admin credentials without downtime?" with a referenced runbook

### Slide 6 — "Priced for Sanity"
**Content:**
- Headline: "€5 Day Pass. €29 Pro. €15k audit-ready package."
- Visual: 3-tier pricing grid from `/pricing` screenshot

### Slide 7 (OPTIONAL) — "Social Proof"
**Content:**
- Headline: "Ship hardening, not meetings"
- Visual: 3 testimonial quotes (even if beta — get real names + roles + companies FIRST)

---

## 3. First Comment (post this IMMEDIATELY when live)

> **This pins a founder voice at top of comments. Critical for conversion.**
> **Required tone:** personal, specific, invites conversation.

```
Hey Product Hunt 👋

Schwerti here, solo founder of ClawGuru.

I built this because every "enterprise security platform" I looked at cost €50k/year and was designed for Fortune 500 security teams with 20 analysts. That's not me. That's not any self-hosting dev I know.

ClawGuru is the opposite: one-person-friendly, priced for individuals (€5 Day Pass, €29/mo Pro), and laser-focused on the runbooks you actually need when something is on fire at 2am.

What's in the box today:
🛡️  4.2M expert-reviewed security runbooks (Linux, K8s, Docker, AWS, GCP, Azure, 40+ stacks)
🔍  30-second Free Security Check — enter your domain/IP, get a Claw Score + top 3 risks
🤖  AI Copilot trained on our runbook corpus — ask it anything about your stack
📊  Pro tier: incident response playbooks, API access, unlimited checks
🏢  Enterprise: SOC 2 + DORA + GDPR-ready consulting packages from €15k

What I need from you today:
1. Try the free check on a server/domain: clawguru.org/check
2. Tell me honestly — what's the first thing that looked wrong/missing/great?
3. Upvote if you think solo devs + small teams deserve real security tooling at human prices 🙏

I'm here all day answering every comment. Ask me anything — pricing, tech stack (Next.js + Postgres + a lot of custom NLP), roadmap (Beehiiv newsletter, White-Label for MSPs next), or just roast my landing page.

🇪🇺 EU-hosted. GDPR-first. No tracking trackers.

Special for PH: use code HUNTER50 for 50% off the first month of Pro (expires end of week).
```

### Follow-up comments to pre-write (post over the day)

**Hour 2:**
```
For anyone asking about the AI Copilot — it's not an LLM wrapper. We embed our runbook corpus (~2GB of expert-reviewed content) and re-rank with domain-tuned retrieval. Answers cite specific runbooks. No hallucinated `sudo rm -rf` 😅
```

**Hour 4 (if traction):**
```
2 hours in and we hit #X Product of the Day 🚀 Thank you! If you're finding ClawGuru useful, a quick upvote helps enormously. I'll match every upvote today with a free runbook request — DM me a stack + scenario and I'll write a custom runbook this weekend.
```

**Hour 8 — engagement booster:**
```
Fun numbers from today: 47 Day Passes sold, 212 free checks completed, avg Claw Score 61/100 (yikes). Top 3 issues we're seeing: missing HSTS headers, SSH password auth still enabled, outdated Kubernetes RBAC. If any of those apply to you, we have runbooks ready.
```

---

## 4. Pre-Launch Checklist (T-7 to T-0)

### T-7 days
- [ ] Book a PH Hunter with ≥ 500 followers (DM candidates: Chris Messina, Kevin William David — check PH leaderboards)
- [ ] Email 30 warmest contacts: "Launching ClawGuru on Product Hunt [day]. If you have 10 seconds, here's the link — [PH teaser link]"
- [ ] Prepare all 5–7 gallery images in Figma/Canva, export at 1270×760
- [ ] Write + schedule X-launch-thread (see `x-launch-thread.md`)
- [ ] Write + schedule HN "Show HN" (see `show-hn-post.md`)
- [ ] Draft + schedule Reddit posts for r/selfhosted, r/sysadmin, r/homelab (see `reddit-launch-posts.md`)
- [ ] Draft LinkedIn post from founder account

### T-3 days
- [ ] Create PH "Upcoming" teaser page — start collecting email subscribers
- [ ] Share teaser on X, LinkedIn, personal network
- [ ] Sanity-check that `HUNTER50` coupon actually works in Stripe
- [ ] Verify `/check` is fast (< 2s) and `/daypass` checkout works on mobile
- [ ] Test all links in gallery + first comment

### T-1 day (Monday night Europe / afternoon PST)
- [ ] Final screenshots + gallery upload
- [ ] Schedule launch for Tuesday 00:01 PST (PH reset)
- [ ] Send heads-up email to network: "Going live in 8 hours"
- [ ] Clear calendar for Tuesday — you'll be in comments ALL DAY

### T-0 (Launch Tuesday)
- [ ] 00:01 PST — PH goes live (timezone: your 09:01 Berlin time)
- [ ] 00:05 PST — post First Comment
- [ ] 00:10 PST — publish HN "Show HN" + Reddit posts + X thread simultaneously
- [ ] 01:00 PST — post on LinkedIn
- [ ] Every 30min until evening Pacific: answer EVERY comment, upvote replies
- [ ] EOD — post wrap-up thread "We made Top X today — here's what I learned"

---

## 5. Success Criteria

| Metric | Must-Hit | Nice-to-Have | Stretch |
|--------|----------|--------------|---------|
| PH Upvotes | 300 | 500 | 1000+ |
| PH Rank | Top 10 | Top 5 | #1 |
| Day Passes Sold | 30 | 75 | 200+ |
| Newsletter Subs | 100 | 300 | 1000+ |
| HN Points | 30 | 100 | Front page |
| Reddit Top Post | 1 sub | 2 subs | 3 subs |

## 6. Post-Launch (T+1 to T+7)

- [ ] Day 1 — publish "Launch day learnings" blog post; cross-post to HN + LI
- [ ] Day 3 — thank-you email to every Product Hunter who commented
- [ ] Day 7 — email all HUNTER50 users: "How was your first week? Reply = I reply personally"
- [ ] Week 2 — compile a public "post-mortem" doc with numbers, put on `/launch-results` (transparency = backlinks)
