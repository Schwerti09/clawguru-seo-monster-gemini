---
issue: 5
subject: ".env files: the #1 credential leak on the internet"
cta_label: "Scan your .env exposure"
cta_url: "https://clawguru.org/check"
---

# .env files: the #1 credential leak on the internet

Hey,

GitGuardian detected **13+ million secrets** exposed in public Git repos last year. Most are .env files accidentally committed or served directly by web servers. It's embarrassing how easy it is.

## The Risk

Two leak vectors, both constantly exploited:

**1. Web-served:** `https://yoursite.com/.env` returns your DATABASE_URL, AWS keys, Stripe secrets. Scanners hit this path on every new IP, every day.

**2. Git-committed:** `.env` pushed to GitHub/GitLab. Even if you delete it later, it's in the history forever. Bots scan commits in real-time — credentials can be used within **60 seconds** of push.

## The Fix (4 steps)

**1. Block via web server** (Nginx):
```nginx
location ~ /\.env { deny all; return 404; }
```

**2. Always .gitignore:**
```gitignore
.env
.env.*
!.env.example
```

**3. Audit your git history right now:**
```bash
git log --all --full-history --source -- .env
git log -p --all -S "AWS_SECRET" -- .
```

**4. If leaked: rotate everything.** DB passwords, API keys, OAuth secrets, JWT signing keys. All of them. Today.

## The Pro-Tip

Install [gitleaks](https://github.com/gitleaks/gitleaks) as a pre-commit hook:
```bash
gitleaks protect --staged
```
It catches the leak before the push, not after.

## Full secret-hygiene runbook

Vault/SOPS setup, CI scanning, rotation automation, GitHub push protection config:
→ https://clawguru.org/check

— Stay sharp,
ClawGuru
