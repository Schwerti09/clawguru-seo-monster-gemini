# Nginx Security Hardening

## Goal
Reduce attack surface of edge/reverse proxy systems and improve resilience against common web attacks.

## Baseline controls
- Keep Nginx updated
- Run with least privilege
- Enforce TLS and security headers
- Disable unnecessary modules
- Apply sane request limits
- Centralize logs and alerting

## Procedure

### 1) Validate current config
```bash
sudo nginx -t
```

### 2) Run as non-root worker
- Use systemd unit hardening and `user nginx;` (or `www-data`) in `nginx.conf`.
- Ensure only privileged port binding is done by master, workers drop privileges.

### 3) TLS configuration
- Prefer TLS 1.2/1.3.
- Disable weak ciphers.
- Enable HSTS.

Example (snippet):
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

### 4) Security headers (baseline)
```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "no-referrer" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### 5) Rate limiting + request limits
```nginx
client_max_body_size 10m;
client_body_timeout 10s;
client_header_timeout 10s;
keepalive_timeout 30s;

limit_req_zone $binary_remote_addr zone=login:10m rate=5r/s;
```

Apply to sensitive endpoints:
```nginx
location = /login {
  limit_req zone=login burst=10 nodelay;
}
```

### 6) Hide version and tighten errors
```nginx
server_tokens off;
```

### 7) Logging and detection
- Ensure access + error logs are enabled.
- Forward logs to SIEM.
- Alert on:
  - spikes in 4xx/5xx
  - repeated 401/403 on auth endpoints
  - unusual user agents, path traversal attempts

## Incident response
- Suspected exploitation:
  - snapshot config + logs
  - isolate host
  - rotate secrets
  - validate upstream integrity
