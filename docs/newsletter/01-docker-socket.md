---
issue: 1
subject: "Your Docker socket is probably exposed (and that's game over)"
cta_label: "Check your Docker setup in 60s"
cta_url: "https://clawguru.org/check"
---

# Your Docker socket is probably exposed (and that's game over)

Hey,

Quick one today. If you mount `/var/run/docker.sock` into any container, you've effectively given that container **root access to your host**. No exploit needed — just the socket.

## The Risk

A Censys scan last year found **~240,000 exposed Docker daemons** on port 2375 and thousands more with mounted sockets in misconfigured containers. Attackers spawn a new privileged container, mount `/`, and walk out with everything. Cryptominers. Ransomware. Pivot to cloud creds. Game over.

## The Fix (3 steps)

**1. Never bind Docker API to TCP without TLS.** If `/etc/docker/daemon.json` has `"hosts": ["tcp://0.0.0.0:2375"]` — delete it today.

**2. Audit socket mounts:**
```bash
docker ps --format '{{.Names}}' | xargs -I{} docker inspect {} \
  --format '{{.Name}}: {{range .Mounts}}{{.Source}} {{end}}' | grep docker.sock
```

**3. If a container truly needs Docker access** (CI, Portainer), use a socket proxy like `tecnativa/docker-socket-proxy` that whitelists only the API endpoints you actually need.

## The Pro-Tip

Run `docker run --rm -it --net host nicolaka/netshoot ss -tlnp | grep 2375` from inside your network to confirm nothing is listening. Internal exposure is still exposure.

## Fix it step-by-step

Full hardening runbook (firewall rules, TLS certs, socket proxy config):
→ https://clawguru.org/check

— Stay sharp,
ClawGuru
