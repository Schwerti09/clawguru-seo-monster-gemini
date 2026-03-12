# Next Steps (Incident Kit)

## 1) First security audit (immediately)

- Identify impacted identities and endpoints.
- Pull cloud audit logs (AWS CloudTrail / GCP Audit Logs / Azure Activity Logs).
- Validate whether any persistence exists.

## 2) Deploy scripts

- Run `scripts/quick-forensics.sh` on suspected hosts.
- Capture output into an incident evidence folder.

## 3) SOC workflow integration

- Convert playbooks into:
  - alert runbooks
  - ticket templates
  - response checklists
- Ensure your SOC has:
  - an incident bridge procedure
  - escalation rules
  - comms templates

## 4) ClawGuru modules

- Dashboard: https://clawguru.org/dashboard
- Runbooks: https://clawguru.org/runbooks
- Re-check: https://clawguru.org/check
