# Evidence Collection Guide

## Goal
Collect enough evidence to understand the incident and support legal/compliance needs, without destroying data.

## Priority order
1. Volatile data (processes, connections, memory if available)
2. Logs (auth, app, WAF/CDN, cloud audit)
3. Disk images / snapshots

## Chain of custody
- Record who collected what, when, and where it is stored.
- Hash files when possible (SHA256).

## What to collect
- Host snapshot:
  - `ps auxfww`
  - `ss -tupn` / `netstat`
  - `last`
- Logs:
  - `/var/log/auth.log`
  - webserver logs
  - cloud audit logs
- Artifacts:
  - suspicious binaries
  - cron/systemd persistence

## Storage
- Store evidence in a restricted bucket/folder.
- Ensure retention policy meets requirements.
