# ClawGuru SEO Monster – AGENTS.md (Traffic-Max Version – 05.04.2026)

## 1. Projekt-Überblick & North-Star
ClawGuru ist das führende AI-powered SecOps Tool mit executable Runbooks für Self-Hosting, OpenClaw, Moltbot und AI-Agents.  
**Ziel:** Massiver organischer Traffic + hohe Conversion durch lokale Geo-Pages (DACH + EU + CEE) mit starkem "Not a Pentest" Trust-Anchor und City-Aware Compliance.

**North-Star (bis Ende 2026):**  
Top-3 Google-Sichtbarkeit für alle kauf- und intent-starken SecOps-Queries + >10.000 monatliche Check-Starts aus organischen Geo-Suchen.

**Kern-Claim:** "From problem to fix in under 30 seconds" – heuristisch, verifizierbar, kein Pentest.

## 2. Technischer Umsetzungsstand (Stand 05.04.2026)
- D4 (12 CEE/Balkan-Städte) in finaler Aktivierungsphase
- Legacy Runbook-URLs per 301 auf kanonische City-Pages umgeleitet (middleware live)
- Killermachine v3 voll aktiv (automatisierte Wave Processing)
- 15 Locales, Next.js App Router, perfekte Canonicals + hreflang
- Geo-Living Matrix + Canary-to-Stable Prozess
- SEO-Guardrails (`check:seo-canonicals`, sitemap-guardrail)
- Ready for traffic: GSC + Community + erste Live-Promotions

## 3. Killermachine v3 – Automated Wave Processing (Standard ab sofort)

**Regel:**  
Alle Wellen ab D5 laufen **vollautomatisch**. Manuelle §-Blöcke sind **deprecated**.

### Automatischer Ablauf pro Welle
1. Matrix Enrichment + Coverage Check
2. Seed Dry-Run (`geo-batch-seed-by-quality --mode=dry-run`)
3. **Automatischer Seed-Commit** bei `eligible_count > 0` + allen Self-Healing Checks grün
4. Ranking-Sync + Canary-Dry-Runs
5. Human-Gate **nur** für finale Canary → Stable Promotion (§46-GO)

### Self-Healing Checks (müssen alle grün sein)
- Legacy Redirect → 301 auf kanonische City-URL
- Runbook URL Health → 200 OK auf Stichprobe
- Canonical + hreflang Consistency
- Trust-Anchor Framing ("Kein Pentest / Not a pentest" konsistent)
- City-Aware Compliance-Signale vorhanden

### Täglicher Report + Alerts
- Automatischer Report mit eligible_count, coverage, self-healing status
- Rote Checks → Auto-Alert + Root-Cause
- Grüne Checks → automatischer Vorschlag für §46-GO

**Deprecation Notice:**  
Manual §-blocks end here. From D5+ only Killermachine v3.

## 4. §106 – FINAL MANUAL D4 DECISION BLOCK (letzter manueller Block)

[Hier kommt dein letzter Decision-Block mit den T24-Zahlen und NO-GO rein – einfach einfügen oder aktualisieren]

**Aktueller Status:** D4 ist bereit für finalen Commit + erste Promotion.

## 5. Traffic-Max Plan (heute + nächste 10 Tage)

**Heute (05.04.2026):**
1. D4-Matrix committen + Seed-Commit
2. Canary-Dry-Runs prüfen
3. Bei grün → §46-GO → erste Live-Promotion (DE + EN)
4. GSC: Alle Sitemaps neu einreichen + Top-URLs "request indexing"
5. Community-Launch: Reddit + X + Discord Posts mit UTM

**Nächste 10 Tage (automatisiert über Killermachine v3):**
- Täglich neue Wellen (D5, D6, …) automatisch anreichern + seeden
- Wöchentliche große Promotion-Wellen (20–50 Städte)
- Laufendes 24h Monitoring + Auto-Reports
- Laufende GSC-Optimierung + interne Verlinkung
- Content-Erweiterung: 2–3 neue indexierbare Seiten pro Woche

**Ziel bis Ende April:**  
> 5.000 monatliche organische Sessions aus Geo-Pages + steigende Check-Start-Rate.

## 5.1 Vollautomatische D5+ Wellen-Strategie (keine Rückfragen nötig)

### Quality-Floor Abstufung pro Welle
- **D5**: Quality ≥82 (ca. 20-30 Städte)
- **D6**: Quality ≥80 (ca. 30-50 Städte)
- **D7**: Quality ≥78 (ca. 50-80 Städte)
- **D8**: Quality ≥75 (alle verbleibenden Städte)

### Automatischer Ablauf pro Welle (kein Human-Gate nötig)
1. **Killermachine v3 starten**: `npm run killermachine:v3`
2. **Seed-Commit bei eligible_count > 0**: Automatisch bei `--with-seed-live`
3. **Sitemap-Guardrail erweitern**: `npm run geo:sitemap-guardrail:live` (falls cityLimit < 50)
4. **Auto-Promotion mit hohem Limit**: `npm run geo:ops-cycle:live` (maxPromotions=100)
5. **Finaler Status-Check**: `npm run check:geo-rollout-status -- --verbose`

### Forced Activation Commands (falls Städte als "skippedStable" hängen)
```bash
# Sitemap-Limit temporär erweitern
node scripts/trigger-geo-sitemap-guardrail.js --mode=live --action=expand --cityLimit=48

# Auto-Promotion mit maximalem Limit
node scripts/trigger-geo-auto-promotion.js --mode=live --locale=de --slug=openclaw-risk-2026 --minRankingScore=60 --maxPromotions=100
node scripts/trigger-geo-auto-promotion.js --mode=live --locale=en --slug=openclaw-exposed --minRankingScore=60 --maxPromotions=100

# Ops-Zyklus durchlaufen
npm run geo:ops-cycle:live

# Finaler Status
npm run check:geo-rollout-status -- --verbose
```

### GSC + Indexing pro Welle
```bash
# Vor jeder Welle
npm run check:seo-canonicals
npm run check:sitemap-redirects -- https://clawguru.org
npm run check:prod-smoke -- --base=https://clawguru.org

# Nach jeder Welle
npm run gsc:index-priority:live  # 32 URLs (D4+Core)
npm run gsc:fetch-daily-metrics  # Daily Metrics (wenn Credentials da)
```

### Wellen-Status (aktuell)
- **D4**: 12 Städte (CEE/Balkan) – aktiv, Indexing API fulfilled
- **D3**: 12 Städte (Südeuropa) – im System, Promotion pending
- **D5**: Nächste Welle – Quality ≥82, ca. 20-30 Städte
- **D6+**: Folgewellen – Quality ≥80/78/75, Rest-Städte

### Agent-Kommandos (immer verfügbar)
```bash
# Killermachine v3 (vollautomatisch)
npm run killermachine:v3

# Forced Seed (wenn nötig)
node scripts/killermachine-auto-scale-v3.js --with-seed-live

# Live-Guard (finaler Check)
npm run geo:ops-live-guard

# GSC-Operativ
npm run gsc:index-priority:dry-run
npm run gsc:index-priority:live
```

## 6. Agent Instructions für Windsurf / Cursor (ab sofort)

Du bist jetzt der **Mycelium Traffic Killermachine Agent v3**.

**Deine Aufgaben:**
- Automatisch neue Wellen (D5+) anlegen und ausführen (Matrix → Coverage → Seed → Report)
- Bei grünen Self-Healing Checks automatisch seeden
- Nur bei Promotion Human-Gate anfordern (§46-GO)
- Täglich Report erstellen und Vorschläge für nächste Promotion machen
- Traffic-Maßnahmen priorisieren (GSC, interne Links, Community)
- AGENTS.md **nie wieder** mit manuellen §-Blöcken aufblasen

**Verboten:**  
Endlosschleifen mit neuen §-Blöcken. Alles läuft über Killermachine v3.

---

**Manual §-blocks end here. From now on: Killermachine v3.**
Letzte manuelle Aktualisierung: 05.04.2026

