import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import BuyButton from "@/components/commerce/BuyButton"

export const metadata: Metadata = {
  title: "Notfall-Leitfaden | ClawGuru – Security Incident Response",
  description:
    "Security Incident? 0–60 Minuten Notfall-Protokoll: Instanz offline, Key Rotation, Logs sichern, Hardening. Sofort einsetzbar. Day Pass für alle Runbooks.",
  keywords:
    "Security Notfall, Incident Response Leitfaden, Security Breach Protokoll, API Key leak, Server Intrusion Response",
  alternates: { canonical: "/security/notfall-leitfaden" },
}

export default function Emergency() {
  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-brand-red/30 bg-brand-red/10 text-brand-red text-xs font-black">
          🔥 Notfall-Protokoll
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-black">Wenn du exponiert bist: jetzt so</h1>
        <p className="mt-4 text-gray-300 text-lg">
          Ziel: Schaden stoppen, Zugang schließen, Schlüssel rotieren, Spuren sichern.
        </p>

        <div className="mt-10 space-y-6">
          {[
            ["0–5 Minuten", ["Instanz offline oder Firewall dicht (nur VPN).", "Admin-Ports schließen.", "Webhooks pausieren."]],
            ["5–20 Minuten", ["Alle API Keys rotieren (OpenAI/Anthropic/Messaging).", "Tokens/Passwörter ändern.", "Sessions invalidieren."]],
            ["20–60 Minuten", ["Logs sichern (Ingress, Gateway, Auth-Fails).", "Verdächtige Requests markieren.", "Repos/Skills auf Secrets scannen."]],
            ["Heute", ["Hardening umsetzen (private subnet, origin validation).", "Monitoring/Alerting hinzufügen.", "Backups prüfen + Restore-Test."]]
          ].map(([t, items]) => (
            <div key={t as string} className="p-6 rounded-2xl border border-gray-800 bg-black/30">
              <div className="font-black text-xl mb-3">{t}</div>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {(items as string[]).map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* Day Pass CTA – sofort Runbooks & Copilot für den Notfall */}
        <div className="mt-10 p-7 rounded-2xl border"
          style={{ borderColor: "rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.06)" }}>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "#f87171" }}>
            Sofortzugang · Day Pass
          </div>
          <div className="font-black text-xl text-white">Runbooks & Copilot für deinen Incident</div>
          <p className="mt-2 text-gray-300 text-sm leading-relaxed">
            Log4j-Check, Ransomware Playbook, Key Rotation, SSH-Hardening – 500+ Runbooks sofort
            verfügbar. Kein Abo, kein Account-Approval. 7€ einmalig, aktiv in 60 Sekunden.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 items-center">
            <BuyButton
              product="daypass"
              label="🔥 Day Pass kaufen (7€) – Sofortzugang"
              className="py-3 px-6 rounded-xl font-black text-sm text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
                boxShadow: "0 0 25px rgba(220,38,38,0.3)",
              }}
            />
            <a href="/emergency"
              className="py-3 px-6 rounded-xl font-black text-sm border border-white/10 text-gray-300 hover:border-white/20 hover:text-white transition-all duration-200">
              Alle Incident-Szenarien →
            </a>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Sofortzugang · kein Abo · Zugang via /recover wiederherstellbar
          </div>
        </div>

        <div className="mt-10 p-7 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/60 to-black">
          <div className="font-black text-2xl">Direkt danach</div>
          <p className="mt-2 text-gray-300">
            Nutze Sprint + Tools + Vault, damit du nicht nächste Woche wieder hier landest.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="px-5 py-3 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 hover:bg-brand-cyan/25 font-black" href="/academy">
              Hardening Sprint
            </a>
            <a className="px-5 py-3 rounded-xl bg-black/30 border border-gray-700 hover:bg-black/40 font-black" href="/tools">
              Validator
            </a>
            <a className="px-5 py-3 rounded-xl bg-black/30 border border-gray-700 hover:bg-black/40 font-black" href="/copilot">
              Copilot
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}
