# Self-Defending API – Automated Redis Blacklist Engine

Automatic protection for [ClawGuru.org](https://clawguru.org) API endpoints against burst attacks, credential-stuffing, and scraping.

## Features

| Threat | Trigger | Block duration |
|---|---|---|
| **Burst-Protection** | > 50 req/s from one IP | 1 hour |
| **Auth-Fail** | > 10 bad API-key attempts / 60 s | 1 hour |
| **Anomaly / Scraping** | > 500 unique hashes or IPs queried / 5 min | 1 hour |

- All blocks use **Redis SETEX** and expire automatically after 1 hour (configurable).
- IPs and API-keys can be permanently **whitelisted** (own monitoring tools, partner IPs).
- Block events are **logged** and optionally sent to a **webhook** (Slack/Discord/custom).

---

## Installation

```bash
pip install -r security/requirements.txt
```

A running Redis instance is required. Set `REDIS_URL` if it is not on `localhost:6379`.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `REDIS_URL` | `redis://localhost:6379/0` | Redis connection URL |
| `BURST_LIMIT` | `50` | Max requests per second per IP |
| `AUTH_FAIL_LIMIT` | `10` | Max auth failures per 60 s |
| `ANOMALY_LIMIT` | `500` | Max unique items per 5 min |
| `BLOCK_DURATION` | `3600` | Block TTL in seconds |
| `SECURITY_WEBHOOK_URL` | *(unset)* | POST target for block notifications |

---

## Using the detection engine directly

```python
from security.self_defending_api import inspect_request, add_to_whitelist

# Whitelist your monitoring IP permanently
add_to_whitelist("203.0.113.5")

# Call once per incoming request
block_reason = inspect_request(
    ip="198.51.100.42",
    api_key="key_abc123",
    query_item="sha256:deadbeef...",  # hash or target IP being queried
    auth_failed=False,
)

if block_reason:
    # Return 403 to caller
    print(f"BLOCKED: {block_reason}")
```

---

## FastAPI integration

```python
from fastapi import FastAPI
from security.fastapi_middleware import RedisBlacklistMiddleware

app = FastAPI()
app.add_middleware(RedisBlacklistMiddleware)

@app.get("/api/scan")
async def scan():
    return {"status": "ok"}
```

A blocked request receives:

```json
{
  "error": "Rate Limit Exceeded - Security Block",
  "status": 403,
  "detail": "Burst: 87 req/s (limit 50)"
}
```

---

## Logging & Notifications

Every new block is logged at `WARNING` level:

```
2026-03-01 22:05:00 [WARNING] self_defending_api – 🚨 Security Block activated | IP: 198.51.100.42 | Reason: Burst: 87 req/s (limit 50) | Duration: 3600s
```

Set `SECURITY_WEBHOOK_URL` to receive the same message as an HTTP POST (compatible with Slack incoming webhooks, Discord webhooks, and any custom endpoint):

```bash
export SECURITY_WEBHOOK_URL="https://hooks.slack.com/services/..."
```

---

## Manual management

```python
from security.self_defending_api import unblock, add_to_whitelist

# Lift a block early
unblock("198.51.100.42")

# Whitelist an API key
add_to_whitelist("key_monitoring_prod", is_key=True)
```
