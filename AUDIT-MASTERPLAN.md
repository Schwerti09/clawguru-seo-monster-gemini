# ClawGuru Full Audit & Executable Master-Plan
> Erstellt: 14.04.2026 | Auditor: Cascade Senior Architect
> Repository: Schwerti09/clawguru-seo-monster-gemini (PRIVATE)

---

## EXECUTIVE SUMMARY

**Gesamtbewertung: 62/100** — Solide Feature-Breite, aber kritische Lücken in Security, Hygiene und Architektur.

### Top 10 Kritischste Punkte (Priorität)

| # | Severity | Problem | Status |
|---|----------|---------|--------|
| 1 | 💀 P0 | Secrets in Git-History (netlify.env.production, netlify.env.import) | Files entfernt, **Keys müssen rotiert werden** |
| 2 | 🔴 P1 | `app/lib` — leere Datei (0 bytes) im Git tracked, kein Ordner | Fix nötig |
| 3 | 🔴 P1 | `/neuro` und `/oracle` nicht unter `[lang]/` → kein i18n, kein `buildLocalizedAlternates` (AGENTS.md Rule 2+3 Verstoß) | Fix nötig |
| 4 | 🔴 P1 | Build-Fehler: `SyntaxError: Unexpected end of JSON input` in `collect-build-traces.js` | Root cause: vermutlich `app/lib` (leere Datei) |
| 5 | 🟠 P2 | `node: 24.x` in package.json, aber Netlify nutzt `NODE_VERSION=20` → Version-Mismatch | Fix nötig |
| 6 | 🟠 P2 | `tsconfig.json` hat `strict: false` aber einzelne strict-Flags an — inkonsistent | Cleanup |
| 7 | 🟠 P2 | `@types/*` Pakete in `dependencies` statt `devDependencies` (Railway-Workaround) — verschmutzt Production Bundle | |
| 8 | 🟡 P3 | Demo-Videos (4MB) im Git — sollten in CDN/public | Cleanup |
| 9 | 🟡 P3 | Junk-Dateien tracked: `no_desc_count.txt`, `no_desc_pages.txt`, `og_samples.txt` | Cleanup |
| 10 | 🟡 P3 | Neuro Threat Correlation statisch hardcoded trotz API vorhanden (vorheriger Fix teilweise) | Verify |

---

## KAPITEL 1: PRIORISIERTE FEHLERBEHEBUNG

### 1.1 [P0] Secret Rotation (MANUELL — User muss das tun)
**ALLE folgenden Secrets müssen SOFORT rotiert werden:**
- [ ] Neon PostgreSQL Passwort ändern (DATABASE_URL)
- [ ] DeepSeek API Key neu generieren
- [ ] Gemini API Key neu generieren
- [ ] OpenAI API Key neu generieren
- [ ] Stripe Secret Key rotieren
- [ ] Resend API Key rotieren
- [ ] Redis Passwort ändern
- [ ] Admin-Passwort ändern (nicht mehr `Schwerti123456!`)
- [ ] Session Secrets neu generieren (ACCESS_TOKEN_SECRET, NEXTAUTH_SECRET, SESSION_SECRET, ADMIN_SESSION_SECRET)
- [ ] NVD API Key rotieren
- [ ] CRON_SECRET ändern
- [ ] Alle GEO_*_SECRET Werte ändern
- [ ] Danach in Netlify/Vercel/Railway Dashboard die neuen Werte eintragen

### 1.2 [P0] Git-History bereinigen (optional aber empfohlen)
```bash
# Option A: BFG Repo Cleaner (schneller)
bfg --delete-files "netlify.env.production" --delete-files "netlify.env.import" --delete-files "netlify.env.clean"
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force

# Option B: git filter-repo
pip install git-filter-repo
git filter-repo --path netlify.env.production --path netlify.env.import --path netlify.env.clean --invert-paths
git push --force
```

### 1.3 [P1] `app/lib` leere Datei entfernen
```bash
git rm app/lib
git commit -m "fix: remove empty app/lib file (breaks build traces)"
```
**Dies ist wahrscheinlich der Root-Cause für den `collect-build-traces.js` SyntaxError.**

### 1.4 [P1] Junk-Dateien aus Git entfernen
```bash
git rm no_desc_count.txt no_desc_pages.txt og_samples.txt
git commit -m "chore: remove debug/junk files from tracking"
```

### 1.5 [P2] Node.js Version-Mismatch fixen
In `package.json`: `"node": "24.x"` → aber Netlify hat `NODE_VERSION = "20"`.
**Fix:** Entweder package.json auf `"20.x"` setzen ODER Netlify auf 24 updaten.
Empfehlung: `"node": ">=20"` in package.json, da Railway/Netlify/Vercel alle LTS 20 nutzen.

---

## KAPITEL 2: ARCHITEKTUR-VERBESSERUNGEN

### 2.1 `/neuro` und `/oracle` unter `[lang]/` bringen
Aktuell: `app/neuro/page.tsx`, `app/oracle/page.tsx` — diese existieren AUSSERHALB des `[lang]/` Routings.

**Probleme:**
- Kein `buildLocalizedAlternates()` → AGENTS.md Rule 3 Verstoß
- Kein `openGraph.url` mit Locale → AGENTS.md Rule 2 Verstoß
- Keine hreflang Tags → Google sieht keine Sprachversionen
- Keine Sitemap-Integration

**Plan:**
1. `app/[lang]/neuro/page.tsx` erstellen (server-side mit generateMetadata)
2. `app/[lang]/oracle/page.tsx` erstellen (server-side mit generateMetadata)
3. Client-Komponenten in `components/neuro/` und `components/oracle/` verschieben
4. Alte `app/neuro/` und `app/oracle/` als Redirect-Stubs behalten (308 → `/de/neuro`)
5. Slugs zu Sitemap hinzufügen (AGENTS.md Rule 4)

### 2.2 `tsconfig.json` aufräumen
`strict: false` ist gesetzt, aber gleichzeitig sind `strictNullChecks`, `strictFunctionTypes` etc. einzeln auf `true`. Empfehlung: `strict: true` setzen und die einzelnen Flags entfernen.

### 2.3 `@types/*` zurück in devDependencies
Der Railway-Workaround (types in dependencies) ist technische Schuld. Besser: `nixpacks.toml` oder `railway.json` so konfigurieren, dass devDependencies installiert werden:
```toml
# nixpacks.toml
[phases.install]
cmds = ["npm install --include=dev"]
```

---

## KAPITEL 3: SEO & INDEXING OPTIMIERUNG

### 3.1 Neuro/Oracle fehlen in Sitemap
Prüfen ob `/neuro` und `/oracle` in der Sitemap sind. Falls nicht → hinzufügen.

### 3.2 Neuro/Oracle JSON-LD FAQ Schema
- Neuro: ✅ FAQ vorhanden und aktualisiert
- Oracle: Prüfen ob FAQ Schema existiert

### 3.3 Canonical/hreflang für Root-Level-Seiten
Alle Seiten unter `app/` (nicht `app/[lang]/`) die nicht API/Admin sind, brauchen entweder:
- Migration unter `[lang]/`
- Oder explizite canonical + hreflang Tags

### 3.4 `robots.txt` — OK
- ✅ Allow: /sitemaps/
- ✅ Disallow: /admin/, /api/, /dashboard/
- ✅ Sitemap referenziert

---

## KAPITEL 4: PERFORMANCE & CACHING

### 4.1 Gut
- ✅ Static assets: `max-age=31536000, immutable`
- ✅ Image optimization: avif + webp
- ✅ `compress: true`
- ✅ Dynamic imports für schwere Komponenten (Three.js, NeonCursor, etc.)
- ✅ `cpus: 2` für Build-Memory-Limiting

### 4.2 Verbesserungspotenzial
- Tag/Runbook CDN-Cache nur 600s → könnte 3600s sein für statischen Content
- Demo-Videos (4MB) sollten in CDN (Cloudflare R2 / S3) statt Git

---

## KAPITEL 5: SECURITY HARDENING

### 5.1 [ERLEDIGT] Secrets aus Git entfernt
### 5.2 [TODO] Secret Rotation (siehe 1.1)
### 5.3 Middleware Rate-Limiting
- Rate-Limiting ist vorhanden aber env-gated (`MW_RL_ENABLED=1`)
- Empfehlung: Default ON in Production
### 5.4 Admin-Passwort
- `Schwerti123456!` ist ein schwaches Passwort — muss geändert werden
- Empfehlung: 20+ Zeichen, Zufallsstring
### 5.5 `poweredByHeader: false` ✅
### 5.6 CSP Headers fehlen
Keine Content-Security-Policy im `next.config.js` headers() — sollte ergänzt werden.

---

## KAPITEL 6: DEPLOYMENT & CI/CD

### 6.1 Triple-Deploy (Vercel + Netlify + Railway)
Das Projekt deployed auf 3 Plattformen gleichzeitig. Das ist komplex aber funktioniert.
- `vercel.json` ✅
- `netlify.toml` ✅
- `railway.json` ✅

### 6.2 Node Version Sync
Alle 3 Plattformen müssen die gleiche Node-Version nutzen.

### 6.3 Build-Test vor Push
AGENTS.md Rule 1 ist korrekt — `npm run build` muss grün sein.
Aktuell: Build hat `collect-build-traces` Error — muss gefixt werden.

---

## KAPITEL 7: CONTENT- & TRAFFIC-STRATEGIE (30 Tage)

### Woche 1-2: Fundament
- Secret Rotation abschließen
- Build-Fehler fixen
- Neuro/Oracle unter [lang]/ migrieren
- Alle Junk-Dateien entfernen

### Woche 2-3: SEO Push
- Neuro + Oracle in alle 15 Sprach-Sitemaps
- FAQ Rich Snippets für beide Seiten
- Internal Links von Moltbot-Seiten zu Neuro Stack MRI

### Woche 3-4: Feature Polish
- Stack MRI mit echten NVD-Daten (statt Mock)
- Oracle Antwort-Qualität verbessern
- Voice Control deutsch + englisch

---

## KAPITEL 8: AGENTS.md BEWERTUNG

### Aktueller Zustand: 7/10
**Stärken:**
- Klare 6 Non-Negotiables
- Dark Theme Design System detailliert
- Sitemap/robots.txt Regeln

**Schwächen:**
- AGENTS.md ist 51KB — zu lang, wird nicht komplett gelesen
- Session Log Sektion am Ende wird immer länger
- Einige Regeln widersprechen dem aktuellen Code (Eye-Tracking References)
- Fehlende Regel: "Keine Secrets in Git committed files"

### Empfohlene Änderungen:
1. Session Log in separate Datei auslagern (`SESSION-LOG.md`)
2. Security-Regel hinzufügen: "Never commit .env files or secrets"
3. Neuro-Sektion aktualisieren (v5.0 Stack MRI statt Eye-Tracking)
4. Max 20KB Ziel für AGENTS.md
