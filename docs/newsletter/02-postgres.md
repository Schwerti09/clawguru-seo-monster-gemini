---
issue: 2
subject: "PostgreSQL on port 5432? You're already on Shodan."
cta_label: "Scan your DB exposure"
cta_url: "https://clawguru.org/check"
---

# PostgreSQL on port 5432? You're already on Shodan.

Hey,

Shodan currently indexes **~820,000 PostgreSQL instances** reachable from the internet. A scary chunk of those accept `postgres/postgres` or empty passwords. If your prod DB has a public IP and default port, you're probably in there.

## The Risk

Three compounding mistakes we see every single week:
- Port 5432 open to `0.0.0.0`
- `listen_addresses = '*'` in `postgresql.conf`
- `pg_hba.conf` with `trust` or weak `md5` auth for remote hosts

Any two of these = breach waiting to happen.

## The Fix (4 steps)

**1. Bind to localhost unless you truly need remote access:**
```conf
# postgresql.conf
listen_addresses = 'localhost'
```

**2. If remote is required, use SCRAM + SSL only:**
```conf
# pg_hba.conf
hostssl all all 10.0.0.0/8 scram-sha-256
host    all all 0.0.0.0/0  reject
```

**3. Force SCRAM for new passwords:**
```sql
ALTER SYSTEM SET password_encryption = 'scram-sha-256';
SELECT pg_reload_conf();
```

**4. Firewall at the host level too** — never rely on Postgres config alone:
```bash
ufw deny 5432 && ufw allow from 10.0.0.0/8 to any port 5432
```

## The Pro-Tip

`SELECT usename, passwd FROM pg_shadow WHERE passwd LIKE 'md5%';` — any row returned = a user still on the old weak hash. Rotate those passwords.

## Lock it down in 5 minutes

Full Postgres hardening runbook with SSL cert setup and audit queries:
→ https://clawguru.org/check

— Stay sharp,
ClawGuru
