# Fail2ban Setup (SSH + Nginx)

## Goal
Automatically block brute-force attempts using iptables/nftables.

## Install
Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y fail2ban
```

## SSH jail
Create `/etc/fail2ban/jail.d/sshd.local`:
```ini
[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
maxretry = 5
findtime = 10m
bantime = 1h
```

## Nginx auth/basic or 404 abuse (optional)
Example for aggressive 404 scanners:
```ini
[nginx-botsearch]
enabled = true
port = http,https
filter = nginx-botsearch
logpath = /var/log/nginx/access.log
maxretry = 10
findtime = 10m
bantime = 2h
```

## Apply
```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

## Validation
- Simulate failed logins (careful)
- Ensure you can still access via your IP range

## Ops notes
- Use allowlists for office/VPN IPs.
- Monitor bans (too many false positives indicates poor tuning).
