---
issue: 6
subject: "SSH password auth is 2005 tech. Stop using it."
cta_label: "Lock down your SSH"
cta_url: "https://clawguru.org/check"
---

# SSH password auth is 2005 tech. Stop using it.

Hey,

Your SSH server gets brute-forced thousands of times a day. Check `/var/log/auth.log` — I'll wait. If `PasswordAuthentication yes` is set, you're one leaked password (or a weak one) away from being owned.

## The Risk

- Shodan: ~20M SSH servers on port 22, most with passwords still enabled
- Average time-to-compromise for a weak root password: **under 4 minutes**
- Modern botnets try 50k+ passwords/hour per target

## The Fix (4 steps)

**1. Generate an ed25519 key** on your laptop:
```bash
ssh-keygen -t ed25519 -C "your-name@laptop"
ssh-copy-id user@server
```

**2. Harden `/etc/ssh/sshd_config`:**
```
PasswordAuthentication no
PermitRootLogin no
PubkeyAuthentication yes
KbdInteractiveAuthentication no
MaxAuthTries 3
LoginGraceTime 20
AllowUsers deploy admin
```

**3. Test BEFORE closing the old session:**
```bash
sshd -t && systemctl reload sshd
# In a NEW terminal, confirm key login works. Keep old session open as fallback.
```

**4. Install fail2ban:**
```bash
apt install fail2ban
systemctl enable --now fail2ban
```

## The Pro-Tip

Move SSH off port 22. It doesn't stop targeted attacks but cuts log noise by 95% and kills 99% of automated scanners. Combine with `iptables` rate-limit on the new port.

## Full SSH bastion runbook

WireGuard + SSH-only-via-VPN pattern, CA-signed certificates, audit logging:
→ https://clawguru.org/check

— Stay sharp,
ClawGuru
