# ClawGuru Daily Security Brief — Newsletter Evergreen Stack

**Cadence:** Daily (7 AM CET / 1 AM EST) — Mon–Fri, plus weekend digest.
**Format:** 1 CVE + 1 Fix + 1 Tip (keep under 400 words per issue).
**Subject line rule:** `[YYYY-MM-DD] <CVE-ID or topic> — <short punchy hook>`
**CTA rule:** Every issue has exactly ONE primary CTA (Day Pass OR Pro upgrade OR Runbook link).

## Evergreen Stack (7 Issues — use while live CVE pipeline is not ready)

These 7 issues cover the most common self-hosted misconfigs. Send them in order during week 1 to new subscribers, then transition to live daily CVE briefs.

| # | Topic | Primary CTA | File |
|---|-------|-------------|------|
| 1 | Exposed Docker Sockets | `/runbook/docker-socket-hardening` | `01-docker-socket.md` |
| 2 | Default PostgreSQL port + weak auth | `/runbook/postgres-hardening` | `02-postgres.md` |
| 3 | Nginx misconfig → directory listing | `/runbook/nginx-directory-listing` | `03-nginx.md` |
| 4 | Outdated Redis with no AUTH | `/runbook/redis-auth` | `04-redis.md` |
| 5 | Open .env files via Git/Web | `/runbook/dotenv-leak` | `05-dotenv.md` |
| 6 | SSH password auth still enabled | `/runbook/ssh-key-only` | `06-ssh.md` |
| 7 | Kubernetes dashboard exposed | `/runbook/k8s-dashboard` | `07-k8s-dashboard.md` |

## Style Guide

- **Tone:** Direct, friendly, no hype. Think: senior engineer DMing a colleague.
- **Structure (fixed per issue):**
  1. **The Risk** (2–3 sentences, 1 stat if possible)
  2. **The Fix** (3–5 concrete steps with code snippet)
  3. **The Tip** (1 pro-tip, 1 sentence)
  4. **CTA** (single line + link)
- **Length target:** 300–400 words.
- **Code blocks:** Always fenced with language, always copy-pastable.
- **No images** (keeps emails out of spam).
