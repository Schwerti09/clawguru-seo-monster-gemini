# Off-Page Playbook 2026

Purpose: drive qualified traffic from community channels without spam patterns or policy violations.

## Core Rules

- Help-first: answer the concrete user problem before posting any link.
- Maximum one link per post/reply unless the channel explicitly allows more.
- If affiliation is relevant, disclose transparently ("we build ClawGuru").
- No fake urgency, no unverified CVEs, no fearbait.
- Prefer runbook/check utility over generic product pitch.

## Weekly Cadence

- Reddit: 3 high-quality replies in relevant threads.
- X: 1 educational thread + 2 short clips/snippets.
- GitHub: 2 useful comments in issues/discussions where security guidance helps.
- Discord/Communities: 3 direct help replies (no DM spam).

## Channel Templates

### Reddit Reply Template

1. Context mirror (1 sentence)
2. Practical checklist (3-5 bullets)
3. Optional one-link resource
4. Transparent disclosure (when needed)

Example:

> If your OpenClaw gateway is exposed, start with three fast checks:
> - Restrict public ingress and verify allowed origins
> - Rotate API keys and remove plaintext secrets from logs
> - Add auth fail monitoring plus rate limits
>
> If useful, this checklist maps directly to a step path: `https://clawguru.org/de/openclaw-security-check`
> (we build ClawGuru; sharing because it matches your setup)

### X Thread Template

- Post 1: problem + clear outcome
- Post 2-4: concrete misconfig patterns
- Post 5: "what to do in 30 minutes"
- Post 6: optional CTA to `/check` or LP

Hook examples:

- "Most self-hosted incidents are not zero-days. They are exposed defaults."
- "From exposed stack to verified fix in under 30 seconds: the practical path."

### GitHub Discussion Reply Template

- Quote the exact failing behavior.
- Propose minimal reproducible hardening path.
- Link one runbook/check page if it directly solves the issue.
- Keep tone technical and neutral.

### Discord Reply Template

- Ask one clarifying question max.
- Give immediate safe baseline actions.
- Share one concise resource only when asked or clearly useful.

## Link Strategy

- Primary intent pages:
  - `/openclaw`
  - `/openclaw-security-check`
  - `/moltbot-hardening`
  - `/ai-agent-security`
- Utility pages:
  - `/check`
  - `/methodik`
  - targeted runbook hubs

## Tracking and Feedback Loop

- Track with UTM tags per channel/campaign.
- Weekly review:
  - referral sessions
  - check starts
  - check->runbook transitions
  - assisted conversions
- Keep only formats with signal quality (not just clicks).

## Red Flags (Auto-Reject)

- More than one link in first-touch reply where not requested.
- Generic copy-paste text across channels.
- Claims without source or data proof.
- "DM me" style lead capture in support communities.
