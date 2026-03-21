// Mission Control – Analyse (2026-03)
// Sichtbare Elemente & Struktur:
// - Diese Seite ist derzeit eine statische Erläuterung (Definition, 3 Info-Karten).
// - Kein Tab/Sidebar‑Gerüst, keine API‑Anbindung.
// Verwandte Seiten:
// - app/dashboard/page.tsx rendert <DashboardClient/> mit modularen Tiles (Gating, Buttons).
//   Datenverbindungen: Stripe‑Checkout, Live‑Wall, Tier‑Abfrage (/api/auth/tier), diverse Platzhalter.
//   Layout: Tailwind, Kartenraster, Glassmorphism.
// - app/admin/dashboard/page.tsx lädt <UniverseDashboard/> (Admin‑Cockpit)
//   Datenverbindungen: Admin‑Cookie, Stripe/Gemini/Index‑Status u.a. im Client; modulare Cards/Drawer.
// Fazit:
// - Für das zentrale Command Center ist eine neue Seite mit Tabs/Sidebar sinnvoll.
//   Die existierende Mission‑Control‑Seite bleibt als Intro bestehen.

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"

export default function MissionControl() {
  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        <SectionTitle
          kicker="Definition"
          title="Mission Control"
          subtitle="Die operative Schicht zwischen Code und Produktion: Security, Monitoring, Governance, Kostenkontrolle."
        />

        <div className="space-y-6">
          {[
            ["Warum es nötig ist", "OpenClaw ist mächtig. Production ist brutal. Ohne Sichtbarkeit = Incident."],
            ["Was wir liefern", "Tools, Runbooks, Intel, Sprints – alles auf Handlung optimiert."],
            ["Wie du es nutzt", "Copilot → Sprint → Vault → Lagebericht. Wiederkehr statt einmal lesen."]
          ].map(([t, d]) => (
            <div key={t} className="p-6 rounded-2xl border border-gray-800 bg-black/30">
              <div className="font-black text-xl mb-2">{t}</div>
              <div className="text-gray-300">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
