type SendArgs = {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

/** Timeout for Resend API calls in milliseconds. */
const RESEND_TIMEOUT_MS = 10_000

export async function sendEmail(args: SendArgs): Promise<{ id?: string }> {
  if (process.env.RESEND_DISABLED === "1" || process.env.RESEND_DISABLED === "true") {
    console.warn("[email] RESEND_DISABLED is set – skipping email send", {
      to: Array.isArray(args.to) ? args.to : [args.to],
      subject: args.subject,
    })
    return {}
  }
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY missing – email sending not possible")
    throw new Error("Missing RESEND_API_KEY")
  }

  // Sender: allow override via env; default to clawguru.org
  const from = process.env.RESEND_FROM && process.env.RESEND_FROM.trim().length > 0
    ? process.env.RESEND_FROM
    : "ClawGuru <noreply@clawguru.org>"

  // Resend REST API requires `to` to be an array of strings
  const toArray = Array.isArray(args.to) ? args.to : [args.to]

  console.log("[email] Resend send attempt started")
  console.log(`[email] From: ${from} → To: ${toArray.join(", ")} | Subject: ${args.subject}`)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), RESEND_TIMEOUT_MS)

  let res: Response
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: toArray,
        subject: args.subject,
        html: args.html,
        reply_to: args.replyTo || "support@clawguru.org",
      }),
      signal: controller.signal,
    })
  } catch (fetchErr) {
    clearTimeout(timeoutId)
    const isTimeout = fetchErr instanceof Error && fetchErr.name === "AbortError"
    const message = isTimeout
      ? `Resend API request timed out after ${RESEND_TIMEOUT_MS / 1000}s`
      : `Resend fetch error: ${String(fetchErr)}`
    console.error(`[email] Fetch error: ${message}`, fetchErr)
    throw new Error(message)
  }

  let responseText = ""
  try {
    responseText = await res.text()
  } finally {
    clearTimeout(timeoutId)
  }

  console.log(`[email] Resend HTTP status: ${res.status}`)

  if (!res.ok) {
    console.error(`[email] Resend error ${res.status}: ${responseText}`)
    if (res.status === 403 && /domain is not verified/i.test(responseText)) {
      throw new Error(`Email send failed (403): Domain not verified at Resend. Verify your sending domain or set RESEND_FROM to a verified domain.`)
    }
    throw new Error(`Email send failed (${res.status}): ${responseText}`)
  }

  let data: { id?: string } = {}
  try {
    data = JSON.parse(responseText)
  } catch {
    // ignore parse errors on success response
  }

  console.log(`[email] E-Mail erfolgreich gesendet → Message ID: ${data.id ?? "(unknown)"}`)
  return data
}

/** Generates a polished HTML body for Magic Link emails. */
export function buildMagicLinkHtml(magicLink: string, lifetimeMinutes = 60): string {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,sans-serif;color:#e5e5e5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#111;border:1px solid #1f1f1f;border-radius:16px;padding:40px 32px;">
        <tr><td>
          <p style="margin:0 0 4px;font-size:11px;font-family:monospace;letter-spacing:.15em;text-transform:uppercase;color:#c9a84c;">ClawGuru</p>
          <h1 style="margin:0 0 24px;font-size:24px;font-weight:900;color:#fff;">Dein Login-Link 🔐</h1>
          <p style="margin:0 0 32px;font-size:15px;color:#aaa;line-height:1.6;">
            Klick den Button unten, um dich bei ClawGuru einzuloggen.<br>
            <strong style="color:#e5e5e5;">Der Link ist ${lifetimeMinutes} Minuten gültig.</strong>
          </p>
          <a href="${magicLink}"
             style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#c9a84c 0%,#e8c96a 100%);
                    color:#000;font-size:15px;font-weight:900;border-radius:12px;text-decoration:none;
                    letter-spacing:.03em;">
            Bei ClawGuru einloggen →
          </a>
          <p style="margin:32px 0 0;font-size:12px;color:#555;line-height:1.6;">
            Falls du diesen Link nicht angefordert hast, kannst du diese E-Mail ignorieren.<br>
            Bei Fragen: <a href="mailto:support@clawguru.org" style="color:#c9a84c;">support@clawguru.org</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
