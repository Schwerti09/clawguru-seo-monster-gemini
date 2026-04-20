---
issue: 4
subject: "Redis without AUTH on 6379: the free ransomware starter kit"
cta_label: "Check your Redis exposure"
cta_url: "https://clawguru.org/check"
---

# Redis without AUTH on 6379: the free ransomware starter kit

Hey,

Redis ships with no authentication and binds to all interfaces by default in many distros. Attackers love it so much they have a script literally called `redis-rogue-server` that drops a shell via the module-load attack. It runs in under a second.

## The Risk

An unauth'd Redis on port 6379 lets anyone:
- Dump all keys (`KEYS *`) — session tokens, API keys, user data
- Overwrite `~/.ssh/authorized_keys` via `CONFIG SET dir` + `BGSAVE`
- Load a malicious module and pop a shell as the redis user

We still see this weekly. **It's the #2 most common misconfig after exposed Docker sockets.**

## The Fix (4 steps)

**1. Bind to localhost:**
```conf
# /etc/redis/redis.conf
bind 127.0.0.1 ::1
protected-mode yes
```

**2. Set a strong password:**
```conf
requirepass $(openssl rand -base64 32)
```

**3. Rename dangerous commands:**
```conf
rename-command FLUSHALL ""
rename-command CONFIG   "CONFIG_a7f2k9"
rename-command MODULE   ""
```

**4. Restart & verify:**
```bash
systemctl restart redis
redis-cli ping   # should ask for AUTH
```

## The Pro-Tip

Behind a firewall is not enough — internal attackers pivot. Use ACLs (Redis 6+):
```conf
user app on >strongpass ~app:* +@read +@write -@admin
```

## Full Redis hardening runbook

TLS setup, ACL templates, Sentinel/Cluster auth, monitoring with redis-cli slowlog:
→ https://clawguru.org/check

— Stay sharp,
ClawGuru
