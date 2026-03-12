# Incident Response Checklist (Operator)

## 0) Declare
- [ ] Assign Incident Commander (IC)
- [ ] Open bridge + ticket + timeline doc
- [ ] Define severity (SEV-0/1/2)
- [ ] Identify affected services/tenants

## 1) Contain
- [ ] Isolate impacted hosts/accounts
- [ ] Block known bad IoCs (IPs/domains/hashes)
- [ ] Disable risky integrations / API tokens
- [ ] Enable heightened logging / retention

## 2) Preserve evidence
- [ ] Snapshot VM / disk image (if possible)
- [ ] Capture volatile data (processes, connections)
- [ ] Export auth logs, WAF logs, cloud audit logs
- [ ] Document chain-of-custody

## 3) Eradicate
- [ ] Patch vulnerable service / close exposed port
- [ ] Rotate credentials (priority: admin, CI/CD, cloud keys)
- [ ] Remove persistence (cron, startup scripts, IAM roles)

## 4) Recover
- [ ] Restore from known-good backups
- [ ] Validate integrity and monitor for recurrence
- [ ] Gradually re-enable traffic

## 5) Communicate
- [ ] Internal updates every 30–60 min
- [ ] Legal/compliance engaged (if breach suspected)
- [ ] Customer comms drafted with verified facts only

## 6) Post-incident
- [ ] Post-mortem within 48–72h
- [ ] Backlog + owners + deadlines
- [ ] Tabletop exercise schedule
