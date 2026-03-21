# Live Feature Preview Cards (Summon, Oracle, Neuro, Mycelium)

Diese README beschreibt Struktur, Design und Performance der neuen Live‑Preview‑Karten.

## Struktur
- components/FeaturePreviewCard.tsx: Basiskomponente (Glassmorphismus + Neon‑Akzente, CTA‑Link, Slot für Inhalt)
- components/SummonPreviewCard.tsx: Debounced Query → GET /api/summon
- components/OraclePreviewCard.tsx: Scope‑Select → GET /api/oracle
- components/NeuroPreviewCard.tsx: Tag‑Picker → GET /api/neuro
- components/MyceliumPreviewCard.tsx: Leichter SVG‑Graph → GET /api/mycelium
- components/FeatureShowcase.tsx: Ordnet die vier Karten in ein 1/2‑Spalten‑Grid
- components/ui/Skeleton.tsx: Einfache Skelett‑Loader
- app/page.tsx: Bindet FeatureShowcase dynamisch (ssr:false) ein
- app/api/mycelium/route.ts: Liefert einen kleinen Graph‑Ausschnitt für die Mycelium‑Karte

## Design
- Glassmorphismus: bg-white/5, backdrop-blur-md, border-white/10, shadow-2xl
- Neon‑Akzente: Cyan (#00ff9d) und Violett (#8b5cf6)
- Micro‑Interactions: Hover‑Scale, weiche Übergänge, Live‑Indikator/Glows
- Responsiv: grid grid-cols-1 md:grid-cols-2 gap-6

## Interaktivität & UX
- Summon: Texteingabe mit 500ms Debounce, Top‑Runbooks + Confidence + Tags
- Oracle: Scope‑Dropdown (Alle/AWS/GCP/Azure), 3 kritischste Risiken + Balken + Timeline
- Neuro: Tag‑Picker mit Chips, relevante Runbooks + Plan + Zeit
- Mycelium: SVG‑Graph mit animiertem „Atmen“, klickbare Knoten → /runbooks/[slug]

## Performance
- Lazy‑Loading pro Karte via IntersectionObserver (eigener Hook)
- Debounce (Summon: 500ms, Neuro: 400ms)
- Schlanke Skeleton‑Loader, keine großen 3D‑Engines
- Server‑Antworten mit Cache‑Headern (s‑maxage, stale‑while‑revalidate)

## Barrierefreiheit
- Fokusierbare Controls (input, select, button)
- Lesbare Kontraste (WCAG‑nah), kein reiner Farbcode zur Bedeutung

## Integration
- Auf der Startseite früh platziert, dynamisch importiert (ssr: false)
- Keine zusätzlichen externen Dependencies erforderlich

## Erweiterungen
- Animierte Hintergrundmuster/Orbs pro Karte
- Erweiterte Filter/Facetten für Neuro und Oracle
- Persistenter Client‑Cache (z. B. SWR) bei Bedarf
