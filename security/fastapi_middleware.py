"""
FastAPI Middleware – Redis Blacklist Gate
=========================================
Drop this middleware into any FastAPI application to enforce the
self-defending API blacklist managed by ``self_defending_api.py``.

Usage
-----
    from security.fastapi_middleware import RedisBlacklistMiddleware
    from fastapi import FastAPI

    app = FastAPI()
    app.add_middleware(RedisBlacklistMiddleware)

The middleware:
  1. Extracts the client IP and the ``X-API-Key`` header (if present).
  2. Calls ``inspect_request()`` from the detection engine.
  3. Returns **403 Forbidden** with a JSON body on any block, or
     passes the request through unchanged.

Environment variables
---------------------
See ``self_defending_api.py`` for the full list of tuneable parameters.
"""

from __future__ import annotations

from typing import Callable, Awaitable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from .self_defending_api import inspect_request

BLOCK_RESPONSE_BODY = {
    "error": "Rate Limit Exceeded - Security Block",
    "status": 403,
}


class RedisBlacklistMiddleware(BaseHTTPMiddleware):
    """Starlette/FastAPI middleware that enforces the Redis blacklist."""

    async def dispatch(
        self,
        request: Request,
        call_next: Callable[[Request], Awaitable[Response]],
    ) -> Response:
        ip = _extract_ip(request)
        api_key = request.headers.get("X-API-Key") or request.headers.get("x-api-key")

        # A blocked reason means the request should be denied immediately.
        block_reason = inspect_request(ip=ip, api_key=api_key)
        if block_reason:
            return JSONResponse(
                status_code=403,
                content={**BLOCK_RESPONSE_BODY, "detail": block_reason},
            )

        response = await call_next(request)

        # Post-response: detect auth failures based on 401 status.
        if response.status_code == 401:
            inspect_request(ip=ip, api_key=api_key, auth_failed=True)

        return response


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _extract_ip(request: Request) -> str:
    """
    Return the real client IP, respecting common reverse-proxy headers.
    Falls back to the direct connection address.
    """
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # The leftmost address is the original client.
        return forwarded_for.split(",")[0].strip()
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()
    if request.client:
        return request.client.host
    return "unknown"
