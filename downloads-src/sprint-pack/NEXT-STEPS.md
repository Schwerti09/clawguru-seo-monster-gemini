# Next Steps (Sprint Pack)

## 1) Run your first security audit (30–60 min)

- Run `scripts/server-security-audit.sh` on a target host.
- Capture output into a timestamped file.
- Create a backlog of findings (high/medium/low) and assign owners.

## 2) Deploy scripts safely

- Run scripts in **staging first**.
- Prefer **read-only checks** before applying changes.
- When applying hardening changes:
  - Ensure you have console access (IPMI/serial/VM console).
  - Keep a rollback plan.

## 3) Integrate into SOC workflows

- Turn each runbook into:
  - an alert playbook step
  - a ticket template
  - a post-incident review checklist
- Standardize evidence collection and timeline tracking.

## 4) Use ClawGuru modules

- Dashboard: https://clawguru.org/dashboard
- Runbooks: https://clawguru.org/runbooks
- Re-check: https://clawguru.org/check

## Recommended order

1. `runbooks/ssh-hardening-linux.md`
2. `runbooks/nginx-security-hardening.md`
3. `runbooks/docker-security-baseline.md`
4. `runbooks/fail2ban-setup.md`
5. Incident flows: `runbooks/brute-force-response.md`, `runbooks/ransomware-response.md`
