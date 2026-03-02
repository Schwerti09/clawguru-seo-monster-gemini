"""
Unit tests for security/self_defending_api.py
Uses fakeredis so no live Redis instance is required.
Run: python -m pytest security/tests/ -v
"""

from __future__ import annotations

import sys
import os
import unittest
from unittest.mock import patch

import fakeredis

# Ensure the repo root is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

import security.self_defending_api as sda


def _fake_redis() -> fakeredis.FakeRedis:
    return fakeredis.FakeRedis(decode_responses=True)


class BaseTest(unittest.TestCase):
    """Patch get_redis() with a fresh in-memory instance for each test."""

    def setUp(self) -> None:
        self.r = _fake_redis()
        self.patcher = patch.object(sda, "get_redis", return_value=self.r)
        self.patcher.start()
        # Reset the module-level singleton so each test starts clean
        sda._redis_client = None

    def tearDown(self) -> None:
        self.patcher.stop()


# ---------------------------------------------------------------------------
# Whitelist tests
# ---------------------------------------------------------------------------

class TestWhitelist(BaseTest):

    def test_add_and_check_ip(self):
        sda.add_to_whitelist("10.0.0.1")
        self.assertTrue(sda.is_whitelisted("10.0.0.1"))

    def test_add_and_check_key(self):
        sda.add_to_whitelist("key_partner", is_key=True)
        self.assertTrue(sda.is_whitelisted("key_partner", is_key=True))

    def test_remove_ip(self):
        sda.add_to_whitelist("10.0.0.2")
        sda.remove_from_whitelist("10.0.0.2")
        self.assertFalse(sda.is_whitelisted("10.0.0.2"))

    def test_unknown_not_whitelisted(self):
        self.assertFalse(sda.is_whitelisted("1.2.3.4"))


# ---------------------------------------------------------------------------
# Blacklist helpers
# ---------------------------------------------------------------------------

class TestBlacklist(BaseTest):

    def test_block_and_check_ip(self):
        sda._block("1.2.3.4", is_key=False, reason="test block")
        self.assertTrue(sda.is_blocked("1.2.3.4"))

    def test_block_and_check_key(self):
        sda._block("bad_key", is_key=True, reason="test block key")
        self.assertTrue(sda.is_blocked("bad_key", is_key=True))

    def test_unblock(self):
        sda._block("5.5.5.5", is_key=False, reason="manual test")
        sda.unblock("5.5.5.5")
        self.assertFalse(sda.is_blocked("5.5.5.5"))


# ---------------------------------------------------------------------------
# Burst detection
# ---------------------------------------------------------------------------

class TestBurst(BaseTest):

    def test_under_limit_not_blocked(self):
        for _ in range(sda.BURST_LIMIT):
            blocked = sda.check_burst("2.2.2.2")
        self.assertFalse(blocked)
        self.assertFalse(sda.is_blocked("2.2.2.2"))

    def test_over_limit_gets_blocked(self):
        for _ in range(sda.BURST_LIMIT + 1):
            sda.check_burst("3.3.3.3")
        self.assertTrue(sda.is_blocked("3.3.3.3"))

    def test_whitelisted_ip_never_blocked(self):
        sda.add_to_whitelist("4.4.4.4")
        for _ in range(sda.BURST_LIMIT + 10):
            blocked = sda.check_burst("4.4.4.4")
        self.assertFalse(blocked)
        self.assertFalse(sda.is_blocked("4.4.4.4"))


# ---------------------------------------------------------------------------
# Auth-fail detection
# ---------------------------------------------------------------------------

class TestAuthFail(BaseTest):

    def test_under_limit_not_blocked(self):
        for _ in range(sda.AUTH_FAIL_LIMIT):
            sda.check_auth_fail("6.6.6.6", "keyA")
        self.assertFalse(sda.is_blocked("6.6.6.6"))

    def test_over_limit_ip_blocked(self):
        for _ in range(sda.AUTH_FAIL_LIMIT + 1):
            sda.check_auth_fail("7.7.7.7")
        self.assertTrue(sda.is_blocked("7.7.7.7"))

    def test_over_limit_key_blocked(self):
        for _ in range(sda.AUTH_FAIL_LIMIT + 1):
            sda.check_auth_fail("8.8.8.8", "evil_key")
        self.assertTrue(sda.is_blocked("evil_key", is_key=True))

    def test_whitelisted_key_never_blocked(self):
        sda.add_to_whitelist("safe_key", is_key=True)
        for _ in range(sda.AUTH_FAIL_LIMIT + 5):
            sda.check_auth_fail("9.9.9.9", "safe_key")
        self.assertFalse(sda.is_blocked("safe_key", is_key=True))


# ---------------------------------------------------------------------------
# Anomaly detection
# ---------------------------------------------------------------------------

class TestAnomaly(BaseTest):

    def test_under_limit_not_blocked(self):
        for i in range(sda.ANOMALY_LIMIT):
            sda.record_anomaly_item("11.11.11.11", f"hash_{i}")
        self.assertFalse(sda.is_blocked("11.11.11.11"))

    def test_over_limit_gets_blocked(self):
        for i in range(sda.ANOMALY_LIMIT + 1):
            sda.record_anomaly_item("12.12.12.12", f"hash_{i}")
        self.assertTrue(sda.is_blocked("12.12.12.12"))

    def test_duplicate_items_do_not_count_multiple_times(self):
        # Sending the same item ANOMALY_LIMIT+100 times should NOT trigger a block
        for _ in range(sda.ANOMALY_LIMIT + 100):
            sda.record_anomaly_item("13.13.13.13", "same_hash")
        self.assertFalse(sda.is_blocked("13.13.13.13"))


# ---------------------------------------------------------------------------
# inspect_request – combined entry-point
# ---------------------------------------------------------------------------

class TestInspectRequest(BaseTest):

    def test_clean_request_passes(self):
        result = sda.inspect_request(ip="20.20.20.20", api_key="valid_key")
        self.assertIsNone(result)

    def test_already_blocked_ip_returns_reason(self):
        sda._block("21.21.21.21", is_key=False, reason="pre-blocked")
        result = sda.inspect_request(ip="21.21.21.21")
        self.assertIsNotNone(result)
        self.assertIn("pre-blocked", result)

    def test_already_blocked_key_returns_reason(self):
        sda._block("blocked_key", is_key=True, reason="key pre-blocked")
        result = sda.inspect_request(ip="22.22.22.22", api_key="blocked_key")
        self.assertIsNotNone(result)

    def test_burst_via_inspect_request(self):
        result = None
        for _ in range(sda.BURST_LIMIT + 2):
            result = sda.inspect_request(ip="23.23.23.23")
        self.assertIsNotNone(result)

    def test_auth_fail_via_inspect_request(self):
        result = None
        for _ in range(sda.AUTH_FAIL_LIMIT + 2):
            result = sda.inspect_request(ip="24.24.24.24", auth_failed=True)
        self.assertIsNotNone(result)

    def test_anomaly_via_inspect_request(self):
        result = None
        for i in range(sda.ANOMALY_LIMIT + 2):
            result = sda.inspect_request(
                ip="25.25.25.25",
                api_key="scraper_key",
                query_item=f"hash_{i}",
            )
        self.assertIsNotNone(result)


if __name__ == "__main__":
    unittest.main()
