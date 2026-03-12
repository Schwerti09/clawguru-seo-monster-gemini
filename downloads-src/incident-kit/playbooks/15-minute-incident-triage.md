# 15-Minute Incident Triage (SEV-0/1)

## Goal
In the first 15 minutes, your job is not to be perfect—it’s to **stop the bleeding**, prevent spread, and establish a reliable picture.

## Minute 0–3: Declare + stabilize
- Create an incident channel/bridge.
- Assign roles:
  - Incident Commander (IC)
  - Ops Lead
  - Comms Lead
  - Scribe
- Confirm severity (SEV-0/1/2) and affected service(s).

## Minute 3–7: Containment first
- Identify likely blast radius.
- Apply immediate containment controls:
  - block abusive IPs at WAF/CDN
  - disable suspicious accounts/tokens
  - quarantine impacted hosts
  - restrict east-west traffic if lateral movement suspected

## Minute 7–12: Evidence + signals
- Preserve volatile data on key hosts:
  - process list, network connections, logged-in users
- Snapshot logs:
  - auth logs
  - WAF/CDN logs
  - cloud audit logs

## Minute 12–15: Decide next action
- Choose ONE primary objective:
  - restore availability (DDoS)
  - stop unauthorized access (breach)
  - isolate compromised hosts (malware)
- Create a short action plan for the next 60 minutes.

## Output (required)
- A single source-of-truth timeline doc
- A list of containment actions applied
- A list of systems/accounts in scope
