# Runbook Indexierung & Qualität — Enterprise SEO Plan (2026-04-26)

## Ziel

ClawGuru indexiert 4,2 M+ Runbooks. Damit Google und Nutzer diese Qualität erleben, braucht es ein skalierbares, hochwertiges Sitemap- und Indexierungs-System.

---

## 1. Feingranulare Buckets (2-Buchstaben-Präfix)
- Statt 5 Buckets (a-f, g-l, ...) → 2-Buchstaben-Buckets: aa–af, ag–al, ..., zz.
- Jede Sitemap bleibt <5.000 URLs, Google kann alles sauber crawlen.
- Umsetzung: Bucket-Logik in `app/sitemaps/[name]/route.ts` anpassen.

## 2. Dynamische Rotation
- Bei jedem Build werden pro Bucket andere 5.000 Runbooks ausgewählt (nach Last-Modified, Popularität, Zufall).
- Über Wochen/Monate werden alle Runbooks einmal in der Sitemap gelistet.
- Vorteil: Google bekommt immer frische URLs, langfristig werden alle indexiert.

## 3. Priorisierung nach Qualität & Nachfrage
- Die wichtigsten/aktuellsten Runbooks (echte Zugriffe, hohe Bewertung, neue CVEs) immer in die Sitemaps nehmen.
- Weniger relevante Runbooks rotieren oder werden nur intern verlinkt.

## 4. Interne Verlinkung & Landingpages
- Für jede wichtige Kategorie/Tag/Technologie eine eigene Landingpage mit Links auf die besten Runbooks.
- So werden auch tieferliegende Runbooks von Google gefunden (Crawl-Depth reduzieren).

## 5. Hochwertige Indexierungsstrategie kommunizieren
- Im Footer, auf der Sitemap-Index-Seite und in der GSC-Dokumentation erklären:
  "ClawGuru indexiert 4,2 M+ Runbooks, Google sieht pro Tag/Woche eine dynamische Auswahl der wichtigsten und aktuellsten Runbooks. So bleibt der Index frisch und relevant."

## 6. Monitoring & Reporting
- Automatisiertes Reporting: Welche Runbooks sind indexiert? Welche fehlen? Wo gibt es Crawl-Fehler?
- GSC-API oder eigene Tools nutzen, um Indexierungsstatus zu überwachen.

---

## Umsetzungsschritte (Sprint-Plan)

1. Bucket-Logik auf 2-Buchstaben-Präfix umstellen
2. Dynamische Rotation pro Build implementieren
3. Priorisierung nach Zugriffen/Bewertung/CVE einbauen
4. Kategorie-Landingpages mit starker interner Verlinkung bauen
5. Footer/Sitemap-Index mit Indexierungsstrategie-Text ergänzen
6. Monitoring/Reporting automatisieren
7. Doku (diese Datei) bei jedem Architektur-Change updaten

---

**Qualitätsziel:**
- Jede Runbook-URL, die Google sieht, ist hochwertig, relevant und intern verlinkt.
- Kein Thin/Duplicate Content, keine leeren Sitemaps, keine Crawl-Budget-Verschwendung.
- Transparenz für Nutzer und Suchmaschinen.

---

*Letzte Änderung: 2026-04-26 — Plan von Copilot eingetragen, Umsetzung startet jetzt.*
