// WORLD BEAST FINAL LAUNCH: app/api/email/onboarding/route.ts
// 3-email onboarding sequence via Resend: Welcome → Value → Special Offer

import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export const runtime = "nodejs"

type SequenceStep = "welcome" | "value" | "offer"

const EMAILS: Record<SequenceStep, { subject: string; html: (name?: string) => string }> = {
  welcome: {
    subject: "🐾 Willkommen bei ClawGuru — dein Claw Score wartet",
    html: (name = "Operator") => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#e5e7eb;padding:32px;border-radius:16px">
        <div style="font-size:32px;margin-bottom:8px">🐾</div>
        <h1 style="color:#fff;font-size:24px;font-weight:900;margin-bottom:8px">Hey ${name}, willkommen bei ClawGuru!</h1>
        <p style="color:#9ca3af;margin-bottom:24px">Du hast gerade den ersten Schritt zu einer sicheren Ops-Infrastruktur gemacht. Respekt.</p>
        <p style="margin-bottom:16px">Was du jetzt tun kannst:</p>
        <ol style="color:#d1d5db;margin-bottom:24px;padding-left:20px">
          <li style="margin-bottom:8px">🔍 <a href="https://clawguru.org/check" style="color:#22d3ee">Security-Check starten</a> — kostenlos, 30 Sekunden</li>
          <li style="margin-bottom:8px">📚 <a href="https://clawguru.org/runbooks" style="color:#22d3ee">Runbooks durchsuchen</a> — 10.000+ sofort verfügbar</li>
          <li style="margin-bottom:8px">💬 <a href="https://clawguru.org/copilot" style="color:#22d3ee">Copilot fragen</a> — dein KI-SRE, 24/7</li>
        </ol>
        <a href="https://clawguru.org/check" style="display:inline-block;background:linear-gradient(to right,#22d3ee,#8b5cf6);color:#fff;font-weight:900;padding:12px 24px;border-radius:12px;text-decoration:none">
          Jetzt Security-Check starten →
        </a>
        <p style="margin-top:32px;color:#6b7280;font-size:12px">ClawGuru · clawguru.org · <a href="https://clawguru.org/datenschutz" style="color:#6b7280">Datenschutz</a></p>
      </div>
    `,
  },
  value: {
    subject: "⚡ 3 Dinge, die deine Infrastruktur heute sicherer machen",
    html: (name = "Operator") => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#e5e7eb;padding:32px;border-radius:16px">
        <h1 style="color:#fff;font-size:22px;font-weight:900;margin-bottom:16px">⚡ Hey ${name}, 3 Quick Wins für heute</h1>
        <p style="color:#9ca3af;margin-bottom:24px">Ops-Security muss nicht komplex sein. Hier sind 3 Dinge, die du heute in unter 30 Minuten umsetzen kannst:</p>
        <div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:16px;margin-bottom:16px">
          <div style="font-weight:900;color:#22d3ee;margin-bottom:4px">1. SSH-Keys rotieren</div>
          <p style="color:#d1d5db;font-size:14px;margin:0">Wann hast du das zuletzt gemacht? Alte Keys sind dein größtes Risiko. <a href="https://clawguru.org/runbook/ssh-key-rotation" style="color:#22d3ee">Runbook →</a></p>
        </div>
        <div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:16px;margin-bottom:16px">
          <div style="font-weight:900;color:#10b981;margin-bottom:4px">2. Firewall-Rules auditieren</div>
          <p style="color:#d1d5db;font-size:14px;margin:0">Port 22 offen? 0.0.0.0/0? Das muss weg. <a href="https://clawguru.org/runbook/firewall-hardening" style="color:#22d3ee">Runbook →</a></p>
        </div>
        <div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:16px;margin-bottom:24px">
          <div style="font-weight:900;color:#f59e0b;margin-bottom:4px">3. Container-Images updaten</div>
          <p style="color:#d1d5db;font-size:14px;margin:0">Veraltete Base-Images = bekannte CVEs. <a href="https://clawguru.org/runbook/container-security" style="color:#22d3ee">Runbook →</a></p>
        </div>
        <a href="https://clawguru.org/runbooks" style="display:inline-block;background:linear-gradient(to right,#22d3ee,#8b5cf6);color:#fff;font-weight:900;padding:12px 24px;border-radius:12px;text-decoration:none">
          Alle 10.000+ Runbooks ansehen →
        </a>
        <p style="margin-top:32px;color:#6b7280;font-size:12px">ClawGuru · clawguru.org · <a href="https://clawguru.org/datenschutz" style="color:#6b7280">Datenschutz</a></p>
      </div>
    `,
  },
  offer: {
    subject: "🔓 Exklusiv für dich: Pro für 1. Monat 50% günstiger",
    html: (name = "Operator") => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#e5e7eb;padding:32px;border-radius:16px">
        <div style="background:linear-gradient(135deg,#0c4a6e22,#4c1d9522);border:1px solid #22d3ee33;border-radius:16px;padding:24px;margin-bottom:24px">
          <div style="font-size:24px;margin-bottom:8px">🎯</div>
          <h1 style="color:#fff;font-size:22px;font-weight:900;margin-bottom:8px">Special Offer: Pro für €4.50 im 1. Monat</h1>
          <p style="color:#22d3ee;font-size:14px;margin:0">Nur für neue Nutzer · Gültig 48 Stunden</p>
        </div>
        <p style="color:#d1d5db;margin-bottom:16px">Hey ${name}, du hast den Security-Check schon ausprobiert. Jetzt ist es Zeit, das volle Potenzial zu nutzen:</p>
        <ul style="color:#d1d5db;margin-bottom:24px;padding-left:20px">
          <li style="margin-bottom:8px">✅ 10.000+ Runbooks — sofortiger Zugriff</li>
          <li style="margin-bottom:8px">🤖 AI-Copilot — dein persönlicher SRE</li>
          <li style="margin-bottom:8px">📊 Score-History — Fortschritt tracken</li>
          <li style="margin-bottom:8px">📬 Weekly Digest — automatische Lageberichte</li>
          <li style="margin-bottom:8px">🔧 Self-Healing Alerts — bevor du gerufen wirst</li>
        </ul>
        <a href="https://clawguru.org/pricing?offer=launch50" style="display:inline-block;background:linear-gradient(to right,#22d3ee,#8b5cf6);color:#fff;font-weight:900;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:16px">
          🔓 Jetzt Pro für €4.50 freischalten →
        </a>
        <p style="margin-top:16px;color:#6b7280;font-size:13px">Oder starte mit dem <a href="https://clawguru.org/pricing?product=daypass" style="color:#22d3ee">Day Pass für €4.99</a> — 24h volles Pro-Erlebnis.</p>
        <p style="margin-top:32px;color:#6b7280;font-size:12px">ClawGuru · clawguru.org · <a href="https://clawguru.org/datenschutz" style="color:#6b7280">Datenschutz</a> · <a href="https://clawguru.org/abmelden" style="color:#6b7280">Abmelden</a></p>
      </div>
    `,
  },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email: string; name?: string; step?: SequenceStep }
    const { email, name, step = "welcome" } = body

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const template = EMAILS[step]
    if (!template) {
      return NextResponse.json({ error: "Unknown step" }, { status: 400 })
    }

    // WORLD BEAST FINAL LAUNCH: send via Resend through the existing email helper
    await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html(name),
    })

    return NextResponse.json({ ok: true, step })
  } catch (err) {
    // WORLD BEAST FINAL LAUNCH: return 200 even on send failure to avoid leaking errors
    console.error("[email/onboarding]", err)
    return NextResponse.json({ ok: false, error: "Send failed" }, { status: 500 })
  }
}
