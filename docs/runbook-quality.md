# Runbook Quality Scoring & Premium Content Quick Wins

This document summarizes the initial implementation for runbook quality scoring and premium-quality snippets, and outlines how to extend the system.

## Quality Score (clawScore)

Each runbook can be assigned a quality score from 0–100.

Current data sources:
- public/runbooks.json: The generator computes a deterministic quality score per entry at build time. It considers:
  - Base score from slug (stable hashing for determinism)
  - Text length of title/summary (approx. substance)
  - Issue/service weighting (e.g., hardening, CSP; nginx, ssh)
  - Freshness (build-time regeneration)

Search API supports filtering by minimum score:
- Parameter: `min_clawScore` (integer 0..100)
- Example: `/api/runbooks/search-index?q=ssh&min_clawScore=80`

Planned for next step (server-side runbook objects):
- Compute `clawScore` from full content in `lib/pseo.ts` based on:
  - Number of steps and code blocks
  - Presence of rollback instructions
  - Variants (provider/service/issue/year tags)
  - Sources listed on the runbook/author
  - Freshness (lastmod)

## High-Quality Snippets

- SSH Hardening (AWS/Linux, Ubuntu/Debian compatible):
  - Hardened `sshd_config` block (Pubkey-only, strong KEX/MAC/Ciphers)
  - Live validation (`sshd -t`, service reload)
  - Negative test (password login must fail)
  - Audit & Monitoring (journalctl, fail2ban, optional CloudWatch agent)
  - Rollback steps

- Nginx CSP:
  - Strict vs. relaxed policy variants
  - HSTS, X-Content-Type-Options, X-Frame-Options
  - Validation and reload commands
  - Quick header verification via `curl -I`

Note: For 100k slugs (provider-service-issue-year) these snippets will be added in `lib/pseo.ts` programmatic generator (next patch). For provider/topic/year pages, rich blocks are already present.

## How to add premium snippets to other runbooks

1. Identify the topic slug or generator branch in `lib/pseo.ts`:
   - Provider-topic: `topic:<slug>` in tags; extend `buildBlocks()` for that `topicSlug`.
   - Programmatic 100k: Edit `_buildFixCode100k()` per `(service, issue)` pair.
2. Add blocks in this order for clarity and verification:
   - `h2`: Konfiguration/Implementierung
   - `code`: Copy/paste config/commands
   - `h2`: Validierung (tests, curl, linters)
   - `h2`: Rollback (backup/restore)
   - Optional: Audit/Monitoring hooks
3. Keep steps atomic and verifiable. Always include a validation command after each risky change.

## Phase 2 – Next Steps

- Compute server-side `clawScore` for all materialized runbooks after building `blocks` (ensures depth is reflected in score).
- Enhance 100k generator for SSH/NGINX CSP and other high-intent pairs (RBAC, WAF, HSTS, Rate Limiting).
- Add source references per runbook (CIS/NIST/OWASP/NVD links) and count into scoring.
- Add variant coverage scoring for distro/cloud flavors.
- Expose `clawScore` in UI badges and allow sorting by quality.
- Add CI checks for minimal quality thresholds per new/edited runbooks.
