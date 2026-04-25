# i18n Pipeline — Stand & Sortierung 2026-04-25

**Zweck dieses Dokuments:** Wo stehen wir, was hängt, was sind die schnelleren Lösungen, was wird wann committed.

---

## 1. Wo wir gerade stehen (HEAD = `05b799db`)

### Was läuft / gelaufen ist
- ✅ **Polish-Run abgeschlossen** (24.04. 12:10): 30 Sprachen × 462 Keys, alle 462/462 grün via `polish-via-gemini.js`. Logs in [logs/polish-run-2026-04-24-v2.log](../logs/polish-run-2026-04-24-v2.log) — noch untracked.
- ✅ **Codemod gemerged** (commit `bfce8a4b`): 6117 hardcodierte Ternaries → `pick(locale, "de", "en")` in 275 Dateien.
- ✅ **Harvest-Lauf gelaufen**: [scripts/i18n-harvest-pick-sources.js](../scripts/i18n-harvest-pick-sources.js) → [lib/i18n-pick-sources.json](../lib/i18n-pick-sources.json) (865 KB, **4706 unique EN-Strings** aus 6227 pick()-Calls in 276 Dateien).

### Was hängt
- 🔴 **Autotranslate-Lauf via Gemini gestrandet** (24.04. 23:28 → 25.04. 01:06): [scripts/i18n-build-autotranslate.js](../scripts/i18n-build-autotranslate.js) hat ab batch 19 dauerhaft `HTTP 429 quota exceeded` zurückbekommen — alle 3 rotierten `GEMINI_API_KEY[1..3]` haben Free-Tier-Tageslimit ausgeschöpft. Output [lib/i18n-autotranslate.ts](../lib/i18n-autotranslate.ts) **wurde nie geschrieben**, Checkpoint-Dir [lib/i18n-autotranslate/](../lib/i18n-autotranslate/) ist leer.
- 🟡 **Page-Rewrite uncommittet**: [app/\[lang\]/moltbot/ai-agent-security/page.tsx](../app/[lang]/moltbot/ai-agent-security/page.tsx) +425/−41.
- 🟡 **7 untracked Files** (siehe §4 Commit-Plan).

---

## 2. Die Wurzel des Problems: Zwei Pipelines, eine davon ohne Ollama-Pfad

ClawGuru hat **zwei parallele Übersetzungs-Pipelines** für historisch gewachsene Gründe:

| Pipeline | Speicher | Konsumiert von | Skripte | Gemini? | Ollama? |
|---|---|---|---|---|---|
| **A — Dictionary** | `dictionaries/<lang>.json` (32 Dateien) | `getDictionary()` | `translate-all.js`, `translate-missing.js`, `translate-via-aya.js`, `polish-via-gemini.js` | ✅ (polish) | ✅ (`translate-via-aya.js`) |
| **B — pick() inline** | `lib/i18n-autotranslate.ts` (auto-generiert) | `lib/i18n-pick.ts` | `i18n-harvest-pick-sources.js`, `i18n-build-autotranslate.js` | ✅ (only) | ❌ **fehlt** |

**Pipeline A ist robust:** Bulk-Übersetzung läuft via Ollama (kein Quota), Polish via Gemini.
**Pipeline B ist fragil:** 4706 Strings × 28 Locales = **131.768 Übersetzungen** — viel zu viel für Free-Tier-Gemini in einem Tag, auch mit 3 Keys.

**→ Die fehlende Komponente: ein Ollama-backed Equivalent zu `i18n-build-autotranslate.js`.**

---

## 3. Lokale Ollama-Realität (verifiziert 25.04.)

`curl http://localhost:11434/api/tags`:
| Model | Size | Status |
|---|---|---|
| `aya-expanse:8b` | 5.0 GB | ✅ einsatzbereit |
| `llama3.2:3b` | 2.0 GB | ✅ |
| `qwen2.5:3b` | 1.9 GB | ✅ |
| `aya-expanse:32b` | — | ❌ **nicht gepullt** (Memory sagt "wird gepullt", Pull nie abgeschlossen) |

**Empfehlung:** `aya-expanse:8b` ist gut genug für 1st-Pass. 32b lohnt nur, wenn 8b qualitativ enttäuscht. Kein Grund, jetzt darauf zu warten.

---

## 4. Sharp-Plan — was als nächstes

### Phase 0 — Commit-Safety-Net (zuerst, bevor irgendwas anderes passiert)
Aktuell hängen 4 unabhängige Threads im Working Directory zusammen. Vor jeder weiteren Aktion in **3 saubere Commits** trennen:

1. **`feat(i18n): harvest+autotranslate pipeline scaffolding for pick()`**
   - `scripts/i18n-harvest-pick-sources.js` (neu)
   - `scripts/i18n-build-autotranslate.js` (neu)
   - `lib/i18n-pick-sources.json` (neu, 865 KB — generated artifact, aber committen weil Source of Truth)
2. **`feat(moltbot): expand ai-agent-security landing page`**
   - `app/[lang]/moltbot/ai-agent-security/page.tsx` (M, +425/−41)
3. **`docs+content: viral-pages template & docker-nonroot mission`**
   - `docs/viral-pages-template.md` (neu)
   - `viral-pages-urls.txt` (neu — falls relevant; sonst .gitignore)
   - `lib/academy/missions/docker-nonroot.ts` (neu)

Logs (`logs/*.log`) → in `.gitignore` aufnehmen, nicht committen.

### Phase 1 — Ollama-Pfad für Pipeline B (Hauptarbeit)
Neues Skript **`scripts/i18n-build-autotranslate-via-aya.js`** — Klon von `i18n-build-autotranslate.js`, aber:
- Backend: `POST http://127.0.0.1:11434/api/generate` mit `model=aya-expanse:8b`, `format=json`, `stream=false`.
- Gleiches Checkpoint-Format (`lib/i18n-autotranslate/<locale>.json`) → die beiden Skripte sind **interchangeable**: man kann mit Gemini anfangen und mit Ollama fortsetzen oder umgekehrt.
- Kein `INTER_BATCH_MS` (lokal, kein Rate Limit) — direkt next batch.
- Kleinere `BATCH_SIZE` (z.B. 30 statt 100), weil 8b-Modell sonst Token-Budget sprengt oder JSON kaputt parsed.
- Selber Output: `lib/i18n-autotranslate.ts`.

**ETA grob:** 4706 Strings × 28 Locales bei ~6 sek/batch à 30 strings = ~25h auf RTX-Niveau. **Akzeptabel — über Nacht laufen lassen.**

### Phase 2 — Optional: Gemini-Polish-Pass über Pipeline-B-Output
Sobald `lib/i18n-autotranslate.ts` aus Ollama steht: separates Skript `polish-pick-via-gemini.js` (Klon von `polish-via-gemini.js`, andere Quelle/Senke). Frische Quota nutzen für Qualitäts-Pass auf den ~131k Strings, **nicht alle**, sondern stichprobenartig oder nur Top-N most-used pick()-Strings (Source-File hat `fileCount` pro Pair → priorisierbar).

### Phase 3 — Konsolidierung der Pipelines
**Mittelfristig (nicht heute):** Pipeline A und B teilen 90% der Logik (Sprachen, Prompt-Aufbau, Checkpoint-Strategie, Gemini/Ollama-Backend). Refactor zu einer gemeinsamen `lib/translate-runner.js` mit zwei Producern (dict-source vs. pick-source) und zwei Consumers (Ollama vs. Gemini). **Erst nachdem beide Pipelines stabil laufen.**

---

## 5. Schnellere/bessere Lösungen, die wir nicht nehmen — und warum

| Idee | Warum nicht |
|---|---|
| Mehr Gemini-Keys hinzufügen | Quota ist *projektweit* auf Free Tier, nicht per-Key. 4./5. Key bringt nichts. |
| Auf Gemini Paid Tier upgraden | Kostet Geld; wir haben Ollama lokal stehen. Dafür ist das Setup da. |
| `aya-expanse:32b` warten/pullen | 8b reicht für Bulk-Pass; 32b nur wenn Qualität enttäuscht. Pull blockiert Tage. |
| DeepL/Azure parallel verkabeln | Mehr Provider = mehr Bruchstellen. Ollama+Gemini ist genug. |
| Top-1000-Strings priorisieren, Rest later | Kein Gewinn — Ollama läuft eh über Nacht durch. |

---

## 6. Konkrete Schritte ab jetzt (Reihenfolge)

1. ☐ `.gitignore` um `logs/*.log` erweitern.
2. ☐ Drei Commits aus §4 Phase 0 schreiben.
3. ☐ `scripts/i18n-build-autotranslate-via-aya.js` schreiben (~1h).
4. ☐ Smoke-Test: 1 Locale (z.B. `sv`), 5 Strings, Output prüfen.
5. ☐ Full Run starten, ins Log schreiben, schlafen gehen.
6. ☐ Morgen: Output sichten, ggf. Polish-Pass anstoßen, `lib/i18n-autotranslate.ts` committen.

---

---

## 7. Was in dieser Session gebaut/geändert wurde (25.04.2026)

### Neu
- **[scripts/i18n-build-autotranslate-via-aya.js](../scripts/i18n-build-autotranslate-via-aya.js)** (neu) — Ollama-Twin von `i18n-build-autotranslate.js`. Backend: `POST http://127.0.0.1:11434/api/generate` mit `format=json`. Selber Prompt, selber Checkpoint-Pfad (`lib/i18n-autotranslate/<locale>.json`), selber Output (`lib/i18n-autotranslate.ts`) → die zwei Skripte sind interchangeable, Resume funktioniert backend-übergreifend.
- **[docs/i18n-pipeline-state-2026-04-25.md](i18n-pipeline-state-2026-04-25.md)** (dieses Dokument).

### Geändert
- **[.gitignore](../.gitignore)** — Zeile `logs/*.log` ergänzt; `logs/translate-run-2026-04-23.log` aus dem Index entfernt (`git rm --cached`).
- **AGENTS.md** — Documentation Map erweitert + "Step 7 / Parallel workstream"-Block auf aktuellen Stand gebracht.

### In flight
- **Background-Run** `bm1l0vl36`: `node scripts/i18n-build-autotranslate-via-aya.js` ohne Argumente → alle 30 Locales × 4706 Strings.
  - Log: [logs/aya-autotranslate-2026-04-25.log](../logs/aya-autotranslate-2026-04-25.log) (gitignored).
  - ETA: 8–10 h (gemessen 7 s/batch nach Model-Load × 157 batches × 28 fehlende locales).
  - Resume-safe: jeder erfolgreiche Batch schreibt Checkpoint sofort weg.

### Memory-Drift korrigiert
- `memory/project_llama_setup.md` sagte `pulling aya-expanse:32b` — Realität: Pull abgebrochen, nur 8b läuft. Eintrag und MEMORY.md-Index aktualisiert.

### Bewusst NICHT gemacht
- WIP-Commits. `git status` zeigt 30+ modifizierte Dateien (Tests, Autopilot-Lib, Pricing, Admin-Dashboard, API-Routes) jenseits des i18n-Scopes. Diff-Survey + saubere Gruppierung → eigene Session, nicht im Vorbeigehen.

---

## 8. Runbook — Pipeline B (pick()-basiert)

### Voraussetzungen
- Ollama läuft auf `localhost:11434` (`curl http://localhost:11434/api/tags` listet `aya-expanse:8b`).
- Optional: `GEMINI_API_KEY` (+ `GEMINI_API_KEY2/3`) in `.env.local` für Polish-Pass.

### End-to-End-Flow
```bash
# 1. Harvest: alle pick()-Calls aus app/+components/ einsammeln
node scripts/i18n-harvest-pick-sources.js
# → lib/i18n-pick-sources.json  (4706 unique EN strings)

# 2a. Bulk-Übersetzung via Ollama (free, lokal, langsam, unbounded)
node scripts/i18n-build-autotranslate-via-aya.js
# → lib/i18n-autotranslate/<locale>.json (28 checkpoints) + lib/i18n-autotranslate.ts

# 2b. ALTERNATIV: dieselbe Pipeline via Gemini (free-tier-quota-limitiert)
node --env-file=.env.local scripts/i18n-build-autotranslate.js
# Funktioniert nur, wenn Tagesquota frei ist. Schreibt in dieselben Checkpoints.

# 3. Polish (geplant, noch nicht gebaut): scripts/polish-pick-via-gemini.js
# Klon von polish-via-gemini.js, Source = lib/i18n-autotranslate.ts.
```

### Smoke-Test
```bash
LIMIT=5 node scripts/i18n-build-autotranslate-via-aya.js sv
# 5 Strings auf Schwedisch, ~35s inkl. Model-Load.
cat lib/i18n-autotranslate/sv.json
```

### Resume nach Crash / Abbruch
Einfach erneut starten — `RESUME=1` ist Default. Jeder bereits übersetzte Key wird übersprungen.

### Backend wechseln mid-run
Funktioniert: Checkpoint-Format ist identisch. Beispiel:
```bash
# Erst Ollama (langsam aber free)
node scripts/i18n-build-autotranslate-via-aya.js sv fi th
# Dann Rest mit Gemini (quota nutzen für eilige Locales)
node --env-file=.env.local scripts/i18n-build-autotranslate.js es fr de
```

### Tuning-Knöpfe
| Variable | Default | Wann ändern |
|---|---|---|
| `OLLAMA_MODEL` | `aya-expanse:8b` | Falls 32b irgendwann gepullt → quality-bump testen |
| `BATCH_SIZE` | `30` | 8b verträgt nicht mehr stabil JSON-mäßig; bei 32b auf 50–80 hochziehen |
| `LIMIT` | unset | Smoke-Tests / Teilläufe |
| `RESUME` | `1` | Auf `0` setzen, um Checkpoints zu ignorieren (volle Neuübersetzung) |

---

## 9. Offene Punkte (Backlog)

- ☐ `scripts/polish-pick-via-gemini.js` schreiben (Klon von `polish-via-gemini.js`, Quelle = `lib/i18n-autotranslate.ts`).
- ☐ WIP-Commit-Sortierung: ~30 modifizierte Dateien jenseits i18n-Scope inspizieren und in logische Commits gruppieren.
- ☐ Pipeline-Konsolidierung A+B → gemeinsame `lib/translate-runner.js` (siehe §4 Phase 3, mittelfristig).
- ☐ Eintrag in `lib/i18n-pick.ts` validieren — liest die `i18n-autotranslate.ts` korrekt, sobald sie befüllt ist.

---

**Owner:** Schwerti (rolli.peter123@gmail.com)
**Doc:** `docs/i18n-pipeline-state-2026-04-25.md`
**Verwandte Docs:** [i18n-state-2026-04-23.md](i18n-state-2026-04-23.md), [i18n-100-languages-plan-2026-04-23.md](i18n-100-languages-plan-2026-04-23.md), [i18n-roadmap-2026-04-22.md](i18n-roadmap-2026-04-22.md).
