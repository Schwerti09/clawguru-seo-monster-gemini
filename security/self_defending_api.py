"""
Self-Defending API – Automated Redis Blacklist Engine
=====================================================
Protects ClawGuru.org API endpoints from:
  • Burst attacks   – >50 requests / second from one IP
  • Auth-Fail spam  – >10 bad API-key attempts within 60 s
  • Scraping / anomaly – >500 unique hashes or IPs queried within 5 min

All blocks expire after 1 hour (SETEX cool-down).
Whitelisted IPs / keys are never blocked.
"""

from __future__ import annotations

import time
import os
import logging
import requests as http_requests
from typing import Optional

import redis

# ---------------------------------------------------------------------------
# Configuration (override via environment variables)
# ---------------------------------------------------------------------------

REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Thresholds
BURST_LIMIT: int = int(os.getenv("BURST_LIMIT", "50"))          # req/s per IP
AUTH_FAIL_LIMIT: int = int(os.getenv("AUTH_FAIL_LIMIT", "10"))  # fails/min
ANOMALY_LIMIT: int = int(os.getenv("ANOMALY_LIMIT", "500"))     # unique items/5 min

# TTLs (seconds)
BURST_WINDOW: int = 1          # 1 second sliding window
AUTH_FAIL_WINDOW: int = 60     # 1 minute
ANOMALY_WINDOW: int = 300      # 5 minutes
BLOCK_DURATION: int = int(os.getenv("BLOCK_DURATION", "3600"))  # 1 hour

# Redis key prefixes
PREFIX_BLACKLIST_IP: str = "blacklist:ip:"
PREFIX_BLACKLIST_KEY: str = "blacklist:key:"
PREFIX_BURST: str = "rate:burst:"
PREFIX_AUTH_FAIL: str = "rate:authfail:"
PREFIX_ANOMALY: str = "rate:anomaly:"
PREFIX_WHITELIST_IP: str = "whitelist:ip:"
PREFIX_WHITELIST_KEY: str = "whitelist:key:"

# Webhook URL for block notifications (optional)
WEBHOOK_URL: Optional[str] = os.getenv("SECURITY_WEBHOOK_URL")

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s – %(message)s",
)
logger = logging.getLogger("self_defending_api")


def _notify(message: str) -> None:
    """Log and optionally POST a notification to a webhook."""
    logger.warning(message)
    if WEBHOOK_URL:
        try:
            http_requests.post(
                WEBHOOK_URL,
                json={"text": message},
                timeout=5,
            )
        except Exception as exc:  # noqa: BLE001
            logger.error("Webhook delivery failed: %s", exc)


# ---------------------------------------------------------------------------
# Redis client (lazy singleton)
# ---------------------------------------------------------------------------

_redis_client: Optional[redis.Redis] = None


def get_redis() -> redis.Redis:
    """Return a shared Redis client, creating it on first call."""
    global _redis_client  # noqa: PLW0603
    if _redis_client is None:
        _redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    return _redis_client


# ---------------------------------------------------------------------------
# Whitelist helpers
# ---------------------------------------------------------------------------


def add_to_whitelist(identifier: str, is_key: bool = False) -> None:
    """Permanently whitelist an IP address or API key."""
    r = get_redis()
    prefix = PREFIX_WHITELIST_KEY if is_key else PREFIX_WHITELIST_IP
    r.set(f"{prefix}{identifier}", "1")
    logger.info("Whitelisted %s '%s'", "key" if is_key else "IP", identifier)


def remove_from_whitelist(identifier: str, is_key: bool = False) -> None:
    """Remove an IP address or API key from the whitelist."""
    r = get_redis()
    prefix = PREFIX_WHITELIST_KEY if is_key else PREFIX_WHITELIST_IP
    r.delete(f"{prefix}{identifier}")


def is_whitelisted(identifier: str, is_key: bool = False) -> bool:
    """Return True if the identifier is on the whitelist."""
    r = get_redis()
    prefix = PREFIX_WHITELIST_KEY if is_key else PREFIX_WHITELIST_IP
    return r.exists(f"{prefix}{identifier}") > 0


# ---------------------------------------------------------------------------
# Blacklist helpers
# ---------------------------------------------------------------------------


def _block(identifier: str, is_key: bool, reason: str) -> None:
    """Write a SETEX blacklist entry and send a notification."""
    r = get_redis()
    prefix = PREFIX_BLACKLIST_KEY if is_key else PREFIX_BLACKLIST_IP
    r.setex(f"{prefix}{identifier}", BLOCK_DURATION, reason)
    _notify(
        f"🚨 Security Block activated | {'API-Key' if is_key else 'IP'}: {identifier} "
        f"| Reason: {reason} | Duration: {BLOCK_DURATION}s"
    )


def is_blocked(identifier: str, is_key: bool = False) -> bool:
    """Return True if the identifier is currently blacklisted."""
    r = get_redis()
    prefix = PREFIX_BLACKLIST_KEY if is_key else PREFIX_BLACKLIST_IP
    return r.exists(f"{prefix}{identifier}") > 0


def unblock(identifier: str, is_key: bool = False) -> None:
    """Manually remove a blacklist entry before it expires."""
    r = get_redis()
    prefix = PREFIX_BLACKLIST_KEY if is_key else PREFIX_BLACKLIST_IP
    r.delete(f"{prefix}{identifier}")
    logger.info("Manually unblocked %s '%s'", "key" if is_key else "IP", identifier)


# ---------------------------------------------------------------------------
# Detection logic
# ---------------------------------------------------------------------------


def check_burst(ip: str) -> bool:
    """
    Burst-Protection: block if more than BURST_LIMIT requests arrive
    within a 1-second window from the same IP.
    Returns True if the IP was (just) blocked.
    """
    if is_whitelisted(ip):
        return False

    r = get_redis()
    key = f"{PREFIX_BURST}{ip}"
    pipe = r.pipeline()
    pipe.incr(key)
    pipe.expire(key, BURST_WINDOW)
    count, _ = pipe.execute()

    if count > BURST_LIMIT:
        _block(ip, is_key=False, reason=f"Burst: {count} req/s (limit {BURST_LIMIT})")
        return True
    return False


def check_auth_fail(ip: str, api_key: Optional[str] = None) -> bool:
    """
    Auth-Fail-Trigger: block IP (and key if provided) after AUTH_FAIL_LIMIT
    invalid API-key attempts within AUTH_FAIL_WINDOW seconds.
    Returns True if a block was applied.
    """
    blocked = False

    for identifier, use_key in ((ip, False), (api_key, True)):
        if identifier is None:
            continue
        if is_whitelisted(identifier, is_key=use_key):
            continue

        r = get_redis()
        prefix = PREFIX_BLACKLIST_KEY if use_key else PREFIX_BLACKLIST_IP
        if r.exists(f"{prefix}{identifier}"):
            # Already blocked – skip counter increment
            continue

        fail_key = f"{PREFIX_AUTH_FAIL}{'key:' if use_key else 'ip:'}{identifier}"
        pipe = r.pipeline()
        pipe.incr(fail_key)
        pipe.expire(fail_key, AUTH_FAIL_WINDOW)
        count, _ = pipe.execute()

        if count > AUTH_FAIL_LIMIT:
            _block(
                identifier,
                is_key=use_key,
                reason=f"Auth-Fail: {count} bad attempts in {AUTH_FAIL_WINDOW}s (limit {AUTH_FAIL_LIMIT})",
            )
            blocked = True

    return blocked


def record_anomaly_item(identifier: str, item: str, is_key: bool = False) -> bool:
    """
    Anomaly-Detection: track unique hashes/IPs queried by an identifier.
    Block if more than ANOMALY_LIMIT unique items are seen in ANOMALY_WINDOW seconds.
    Returns True if a block was applied.
    """
    if is_whitelisted(identifier, is_key=is_key):
        return False

    r = get_redis()
    ts_bucket = int(time.time()) // ANOMALY_WINDOW  # coarse time-bucket
    anomaly_key = f"{PREFIX_ANOMALY}{'key:' if is_key else 'ip:'}{identifier}:{ts_bucket}"

    pipe = r.pipeline()
    pipe.sadd(anomaly_key, item)
    pipe.expire(anomaly_key, ANOMALY_WINDOW * 2)  # keep slightly longer for overlap
    cardinality, _ = pipe.execute()

    unique_count = r.scard(anomaly_key)

    if unique_count > ANOMALY_LIMIT:
        _block(
            identifier,
            is_key=is_key,
            reason=(
                f"Anomaly: {unique_count} unique items in {ANOMALY_WINDOW}s "
                f"(limit {ANOMALY_LIMIT})"
            ),
        )
        return True
    return False


# ---------------------------------------------------------------------------
# Combined entry-point used by the middleware / log watcher
# ---------------------------------------------------------------------------


def inspect_request(
    ip: str,
    api_key: Optional[str] = None,
    query_item: Optional[str] = None,
    auth_failed: bool = False,
) -> Optional[str]:
    """
    Central inspection function.  Call once per incoming request.

    Parameters
    ----------
    ip          : Remote IP address.
    api_key     : API key extracted from the request (if any).
    query_item  : A file hash or target IP being queried (for anomaly tracking).
    auth_failed : Set to True when the API key check failed.

    Returns
    -------
    Reason string if the request should be blocked, else None.
    """
    r = get_redis()

    # --- 1. Already on blacklist? ---
    for identifier, use_key in ((ip, False), (api_key, True)):
        if identifier is None:
            continue
        bl_prefix = PREFIX_BLACKLIST_KEY if use_key else PREFIX_BLACKLIST_IP
        reason = r.get(f"{bl_prefix}{identifier}")
        if reason:
            return reason

    # --- 2. Burst check ---
    if check_burst(ip):
        return r.get(f"{PREFIX_BLACKLIST_IP}{ip}") or "Burst limit exceeded"

    # --- 3. Auth-fail check ---
    if auth_failed:
        if check_auth_fail(ip, api_key):
            bl_key = f"{PREFIX_BLACKLIST_IP}{ip}"
            return r.get(bl_key) or "Auth-fail limit exceeded"

    # --- 4. Anomaly check ---
    if query_item:
        for identifier, use_key in ((api_key, True), (ip, False)):
            if identifier is None:
                continue
            if record_anomaly_item(identifier, query_item, is_key=use_key):
                bl_prefix = PREFIX_BLACKLIST_KEY if use_key else PREFIX_BLACKLIST_IP
                return r.get(f"{bl_prefix}{identifier}") or "Anomaly limit exceeded"

    return None
