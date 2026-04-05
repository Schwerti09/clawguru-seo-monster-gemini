# ClawGuru SEO Monster – AGENTS.md (Clean Reset – 05.04.2026)

## 1. Projekt-Überblick
ClawGuru ist ein spezialisierter Security-Check + executable Runbook Tool für Self-Hosting / OpenClaw / Moltbot / AI-Agents.  
Ziel: Mega-Traffic über lokale Geo-Pages (DACH + EU + CEE) mit starkem "Not a Pentest" Trust-Anchor + City-Aware Compliance.

Aktueller Stand:
- D4 (12 CEE/Balkan-Städte) in finaler Aktivierungsphase
- Post-Promotion Lock (§46.8) aktiv
- Legacy Runbook-URLs werden per 301 auf kanonische City-Pages umgeleitet (middleware.ts fix deployed)
- Killermachine v3 ist der neue Standard

## 2. Technischer Umsetzungsstand
- D4 final activation complete
- Killermachine v3 active → automatische Wave-Verarbeitung
- Ready for traffic (GSC + Community + Canonical Routing)

## 3. Killermachine v3 – Automated Wave Processing (ab sofort Standard)

**Regeln:**
- Automatischer Seed-Commit, sobald `eligible_count > 0` UND alle Self-Healing Checks grün sind (Matrix-Qualität ≥85, Runbook-URLs 200 OK, Trust-Anchor + City-Aware Signale vorhanden).
- Human-Gate nur noch bei finaler Canary → Stable Promotion (neuer §46-GO).
- Täglicher Report + automatische Alerts bei roten Checks.
- Alle zukünftigen Wellen (D5+) laufen vollautomatisch. Manuelle §-Blöcke sind deprecated.

**Self-Healing Checks (v2):**
- Matrix-Qualität ≥85 für alle Städte der Welle
- Runbook-URLs geben 200 OK (kein 308/Redirect auf Search)
- "Not a Pentest" + Trust-Anchor Framing konsistent
- City-Aware Compliance-Signale (country_code) vorhanden

## 4. §106 – FINAL MANUAL D4 DECISION BLOCK (letzter manueller Block)

(Dein letzter ausgefüllter Decision-Block mit T24-Zahlen und NO-GO bleibt hier stehen – kopiere ihn einfach hierher, wenn du willst.)

**Entscheidung:** PROBLEM (Matrix noch nicht committed, einige URLs 308)

## 5. Nächste Schritte (heute)

1. D4-Matrix endlich committen (SQL aus §106/§104)
2. Coverage + Seed dry-run + commit
3. Canary-Dry-Runs prüfen
4. Bei grün → neuer §46-GO → Live-Promotion (Teilwellen)
5. GSC Sitemaps neu einreichen + wichtige URLs "request indexing"
6. Community-Posts (Reddit/X/Discord) mit UTM für schnellen Referral-Traffic

Manual §-blocks end here. From now on: Killermachine v3.

Letzte manuelle Änderung: 05.04.2026