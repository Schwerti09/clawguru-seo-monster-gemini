"""security package – exposes the public API of the detection engine."""

from .self_defending_api import (
    inspect_request,
    add_to_whitelist,
    remove_from_whitelist,
    is_whitelisted,
    is_blocked,
    unblock,
    check_burst,
    check_auth_fail,
    record_anomaly_item,
)

__all__ = [
    "inspect_request",
    "add_to_whitelist",
    "remove_from_whitelist",
    "is_whitelisted",
    "is_blocked",
    "unblock",
    "check_burst",
    "check_auth_fail",
    "record_anomaly_item",
]
