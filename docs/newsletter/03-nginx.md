---
issue: 3
subject: "Nginx autoindex: the one-line config that leaks your backups"
cta_label: "Audit your Nginx configs"
cta_url: "https://clawguru.org/check"
---

# Nginx autoindex: the one-line config that leaks your backups

Hey,

If you've ever seen a URL like `https://example.com/backups/` show a file listing — that's `autoindex on;`. Great for dev. Catastrophic in prod. We find this weekly on customer audits.

## The Risk

With autoindex on, anyone can browse every file in a directory. Common accidental exposures:
- `.env`, `.git/`, `.sql` dumps
- Old backups (`backup-2024.tar.gz`)
- Log files with session tokens

Google indexes these. `inurl:backup.sql filetype:sql` returns tens of thousands of hits to this day.

## The Fix (3 steps)

**1. Find it:**
```bash
grep -r "autoindex on" /etc/nginx/
```

**2. Kill it globally in `http` block:**
```nginx
http {
    autoindex off;
    server_tokens off;
    # ...
}
```

**3. Block dotfiles and common leaks:**
```nginx
location ~ /\.(?!well-known) { deny all; return 404; }
location ~* \.(sql|bak|backup|log|env|old|swp)$ { deny all; return 404; }
```

Reload: `nginx -t && systemctl reload nginx`.

## The Pro-Tip

Use `curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/.env` from an external box. Anything other than `404` or `403` = vulnerable.

## Full hardening checklist

18-point Nginx production hardening runbook (TLS, headers, rate-limits, fail2ban):
→ https://clawguru.org/check

— Stay sharp,
ClawGuru
