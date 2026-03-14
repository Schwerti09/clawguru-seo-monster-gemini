# Suspicious Network Traffic Response

## Goal
Identify malicious communications, block exfiltration, and determine impacted assets.

## Triage
- Source host(s)
- Destination (IP/domain/ASN)
- Protocol/port
- Volume and timing

## Containment
- Block egress to known bad destinations.
- Isolate suspected hosts.

## Investigation
- DNS logs
- proxy logs
- packet captures (targeted)

## Remediation
- Remove malware/persistence.
- Rotate credentials.
- Improve egress filtering.
