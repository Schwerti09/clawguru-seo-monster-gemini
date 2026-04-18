# SEO Fix — Google Search Console Anweisungen mit Kontrolle

**Datum:** 2026-04-17
**Problem:** 300k+ synthetische Seiten seit 25.3 führten zu Traffic-Einbruch (0 views, 0 clicks)
**Lösung:** Robots.txt Disallow + Google Search Console Maßnahmen

---

## Hintergrund

### Traffic-Einbruch Analyse
- **Vor 25.3:** ca. 95k Seiten, Traffic stieg stetig
- **Seit 25.3:** über 300k neue Seiten (synthetische Slugs)
- **Heute:** 0 views, 0 clicks
- **Google Stats:** 513.000 Seiten gecrawlt, nur 81% indexierwürdig (95k nicht indexiert)

### Ursache
Synthetische Slug-Generatoren (buildLightSlugs, genSeedList, buildMassiveSlugs) haben 100k+ synthetische Slug-Kombinationen erstellt (provider×service×issue×year), die zu thin/duplicate content führten und Google Rankings zerstörten.

### Bereits erledigte Fixes
1. **Sitemap-Route:** buildLightSlugs, genSeedList, buildMassiveSlugs entfernt
2. **Robots.txt:** Disallow für synthetische Pattern hinzugefügt
3. **Canonical Tags:** Alle neuen Pages haben korrekte openGraph.url

---

## Google Search Console Anweisungen

### Schritt 1: Sitemap neu einreichen
**Aktion:**
1. Öffne Google Search Console: https://search.google.com/search-console
2. Navigiere zu: Sitemaps → /sitemap.xml
3. Klicke auf "Neuer Sitemap einreichen"
4. Gib ein: `/sitemap.xml`
5. Klicke auf "Senden"

**Kontrolle:**
- Prüfe, ob Sitemap erfolgreich eingereicht wurde
- Prüfe "Gefundene URLs" (sollte ~5.000-6.000 sein, nicht 500k+)
- Prüfe "Gültige URLs" (sollte >95% sein)

### Schritt 2: URL Inspection Tool für synthetische URLs
**Aktion:**
1. Öffne URL Inspection Tool
2. Prüfe folgende synthetische URLs:
   - `https://clawguru.org/runbook100k-*`
   - `https://clawguru.org/de/provider-aws-service-nginx-issue-2026`
   - `https://clawguru.org/en/provider-gcp-service-kubernetes-year-2027`
3. Klicke auf "Indexierung anfordern"

**Kontrolle:**
- Prüfe, ob URLs als "Nicht gefunden" oder "Soft 404" markiert sind
- Prüfe, ob "Indexierung anfordern" erfolgreich war
- Prüfe, ob "Crawling gestattet" = "Nein" ist (wegen robots.txt Disallow)

### Schritt 3: Alle synthetischen URLs als "remove" markieren
**Aktion:**
1. Navigiere zu: Entfernung → Neue Anfrage
2. Wähle "Temporär entfernen"
3. Gib folgende Pattern ein:
   - `/runbook100k-*`
   - `/*-provider-*-service-*-issue-*`
   - `/*-provider-*-service-*-year-*`
   - `/*-provider-*-issue-*-year-*`
4. Klicke auf "Weiter"
5. Wähle "Diese URL entfernen"
6. Klicke auf "Senden"

**Kontrolle:**
- Prüfe, ob Anfragen erfolgreich eingereicht wurden
- Prüfe, ob Status = "In Bearbeitung" ist
- Prüfe, nach 24h Status = "Entfernt"

### Schritt 4: Crawl Stats überwachen
**Aktion:**
1. Navigiere zu: Einstellungen → Crawling-Statistiken
2. Prüfe folgende Metriken:
   - "Täglich gecrawlte Seiten" (sollte <10.000/Tag sein)
   - "Gesamt crawlen" (sollte stabil sein, nicht ansteigen)
   - "Crawl Budget" (sollte nicht durch synthetische URLs verschwendet werden)

**Kontrolle:**
- Prüfe, ob "Täglich gecrawlte Seiten" reduziert wurde
- Prüfe, ob Crawl Budget für gute Seiten verwendet wird
- Prüfe, ob Crawl Fehler reduziert wurden

### Schritt 5: Coverage Report überwachen
**Aktion:**
1. Navigiere zu: Index → Coverage
2. Prüfe folgende Kategorien:
   - "Erfolgreich: indexiert" (sollte ansteigen)
   - "Gecrawlt – derzeit nicht indexiert" (sollte von 95k auf <5k reduziert werden)
   - "Soft 404" (sollte reduziert werden)
   - "Nicht gefunden (404)" (sollte für synthetische URLs sein)

**Kontrolle:**
- Prüfe, ob "Gecrawlt – derzeit nicht indexiert" reduziert wurde
- Prüfe, ob "Erfolgreich: indexiert" angestiegen ist
- Prüfe, ob Soft 404s reduziert wurden

---

## Kontrolle-Mechanismen

### Tägliche Kontrolle (Wochen 1-2)
1. **Coverage Report:** Prüfen, ob "Gecrawlt – derzeit nicht indexiert" reduziert wird
2. **Crawl Stats:** Prüfen, ob "Täglich gecrawlte Seiten" <10.000 ist
3. **Performance Report:** Prüfen, ob Views/Clicks wieder ansteigen

### Wöchentliche Kontrolle (Monat 1)
1. **Sitemap Status:** Prüfen, ob Sitemap noch gültig ist
2. **URL Inspection:** Zufällige synthetische URLs prüfen
3. **Performance:** Traffic-Trend prüfen

### Monatliche Kontrolle (Monate 2-3)
1. **Overall Performance:** Traffic-Vergleich mit Vor-Monat
2. **Index Coverage:** Prüfen, ob Indexierung stabilisiert ist
3. **Crawl Budget:** Prüfen, ob Crawl Budget effizient genutzt wird

---

## Erfolgsindikatoren

### Kurzfristig (1-2 Wochen)
- "Gecrawlt – derzeit nicht indexiert" reduziert von 95k auf <10k
- "Täglich gecrawlte Seiten" reduziert auf <10.000
- Soft 404s reduziert auf <100

### Mittelfristig (1 Monat)
- Views/Clicks steigen wieder an
- "Erfolgreich: indexiert" angestiegen auf >90%
- Traffic stabilisiert sich

### Langfristig (3 Monate)
- Traffic wieder auf Vorkrisen-Niveau (oder höher)
- Indexierung stabil bei >95%
- Crawl Budget effizient genutzt

---

## Notfall-Plan

### Wenn Traffic nach 2 Wochen nicht ansteigt
1. **Robots.txt prüfen:** Disallow Pattern korrekt?
2. **Sitemap prüfen:** Sitemap noch gültig?
3. **Canonical Tags prüfen:** Alle Pages haben openGraph.url?
4. **Google Penalty prüfen:** Manual Actions in Search Console?

### Wenn Google Penalty auftritt
1. **Manual Actions:** Prüfen, ob Manual Action existiert
2. **Reconsideration Request:** Reconsideration Request einreichen
3. **Fix dokumentieren:** Alle Fixes dokumentieren und an Google senden

### Wenn Crawl Budget immer noch verschwendet wird
1. **Robots.txt erweitern:** Weitere Pattern hinzufügen
2. **Noindex setzen:** Auf alten synthetischen Pages noindex setzen
3. **Server-Logs prüfen:** Welche URLs werden gecrawlt?

---

## Zusammenfassung

### Bereits erledigte Fixes
1. ✅ Robots.txt Disallow für synthetische Pattern
2. ✅ Canonical Tags auf allen Pages
3. ✅ Synthetische Slugs aus Sitemap entfernt
4. ✅ Handler für synthetische Sitemaps entfernt

### Nächste Schritte (Google Search Console)
1. 📋 Sitemap neu einreichen
2. 📋 URL Inspection Tool für synthetische URLs
3. 📋 Alle synthetischen URLs als "remove" markieren
4. 📋 Crawl Stats überwachen
5. 📋 Coverage Report überwachen

### Kontrolle
- Tägliche Kontrolle (Wochen 1-2)
- Wöchentliche Kontrolle (Monat 1)
- Monatliche Kontrolle (Monate 2-3)

### Erfolgsindikatoren
- Kurzfristig (1-2 Wochen): "Gecrawlt – derzeit nicht indexiert" reduziert
- Mittelfristig (1 Monat): Views/Clicks steigen wieder an
- Langfristig (3 Monate): Traffic wieder auf Vorkrisen-Niveau
