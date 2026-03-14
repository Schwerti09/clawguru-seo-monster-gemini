# Ransomware Response Runbook

## Objective
Contain ransomware impact, preserve evidence, restore operations safely, and prevent re-infection.

## Do NOT
- Do not immediately wipe systems before evidence collection.
- Do not pay ransom without exec/legal decision process.
- Do not reconnect infected hosts to the network.

## Severity
Treat as **SEV-0** if production or identity systems are impacted.

## Immediate actions (first 15 minutes)
1. **Declare incident** and open an incident bridge.
2. **Isolate impacted hosts** (pull network cable / disable switch port / quarantine VLAN).
3. **Disable lateral movement**:
   - block SMB/RDP where possible
   - restrict east-west traffic
4. **Preserve volatile evidence**:
   - running processes
   - network connections
   - logged-in users

## Containment

### 1) Scope impact
- Identify encrypted hosts, file shares, backups, hypervisors, AD.
- Check for:
  - unusual admin logins
  - new scheduled tasks
  - suspicious GPO changes

### 2) Secure identity systems
- If AD/IdP suspected:
  - disable new OAuth apps
  - rotate privileged credentials
  - enforce MFA for admins

## Eradication
- Identify initial access vector (phishing, exposed RDP/VPN, vulnerable service).
- Patch/close the vector.
- Rebuild compromised hosts from golden images.

## Recovery
1. Validate backup integrity (offline / immutable).
2. Restore in stages:
   - identity
   - core infra (DNS, DHCP, logging)
   - business apps
3. Monitor for re-infection indicators.

## Communication
- Internal status every 30 minutes.
- Notify legal/compliance early.
- Prepare customer comms only with verified facts.

## Evidence to collect
- ransomware note(s)
- suspicious binaries + hashes
- event logs, auth logs
- firewall logs
- backup logs

## Post-incident
- root cause analysis
- harden privileged access
- implement immutable backups
- tabletop exercise within 2 weeks
