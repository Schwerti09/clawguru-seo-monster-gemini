# DDoS Response

## Goal
Maintain availability, protect origin infrastructure, and restore stable service.

## Immediate actions
- Enable/raise CDN/WAF protections.
- Rate limit by IP/ASN.
- Enable caching for static and semi-static endpoints.

## Triage
- Identify attack type: L3/L4 vs L7.
- Determine target paths and origin impact.

## Mitigation
- CDN: enable bot fight mode / managed challenge.
- Nginx: `limit_req` and `limit_conn`.
- Scale horizontally if possible.

## Recovery
- Roll back emergency rules carefully.
- Post-incident: add dashboards and alert thresholds.
