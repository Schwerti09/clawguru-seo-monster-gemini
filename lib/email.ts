type SendArgs = {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail(args: SendArgs): Promise<{ id?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  console.log(`[email] RESEND_API_KEY present: ${apiKey ? `yes (length: ${apiKey.length})` : "no"}`)
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY")
  }

  const from = process.env.RESEND_FROM || process.env.EMAIL_FROM || "ClawGuru <noreply@clawguru.org>"

  console.log("[email] Resend send attempt started")
  console.log(`[email] From: ${from} → To: ${args.to} | Subject: ${args.subject}`)

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: args.to,
      subject: args.subject,
      html: args.html,
      reply_to: args.replyTo || process.env.EMAIL_REPLY_TO || undefined,
    }),
  })

  const responseText = await res.text().catch(() => "")

  if (!res.ok) {
    console.error(`[email] Resend error ${res.status}: ${responseText}`)
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
