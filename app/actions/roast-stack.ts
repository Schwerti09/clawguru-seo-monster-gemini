"use server"

import { z } from "zod"
import { headers } from "next/headers"
import { generateOrdered } from "@/lib/ai/providers"
import type { Locale } from "@/lib/i18n"
import { SUPPORTED_LOCALES } from "@/lib/i18n"
import { buildRoastUserPrompt, type RoastLevel } from "@/lib/roast/prompt"
import { checkRoastServerRateLimit } from "@/lib/roast/server-rate-limit"

const roastLevelSchema = z.enum(["mild", "medium", "spicy"])

const payloadSchema = z.object({
  roast_text: z.string().min(40).max(12_000),
  score: z.number().int().min(0).max(100),
  top_roasts: z.tuple([z.string(), z.string(), z.string()]),
  weaknesses: z.array(z.string()).min(2).max(8),
  fixes: z.array(z.string()).min(2).max(8),
  roast_level: roastLevelSchema,
})

export type RoastStackResult = z.infer<typeof payloadSchema> & {
  stack_summary: string
}

function normalizeLocale(raw: string): Locale {
  const v = raw as Locale
  return SUPPORTED_LOCALES.includes(v) ? v : "en"
}

export type RoastStackActionState =
  | { ok: true; data: RoastStackResult }
  | { ok: false; error: string }

function clientKeyFromHeaders(): string {
  const h = headers()
  const fwd = h.get("x-forwarded-for")?.split(",")[0]?.trim()
  const real = h.get("x-real-ip")?.trim()
  return fwd || real || "unknown"
}

export async function roastMyStackAction(form: {
  input: string
  roastLevel: RoastLevel
  locale: string
}): Promise<RoastStackActionState> {
  const trimmed = form.input.trim()
  if (!trimmed) {
    return { ok: false, error: "empty_input" }
  }
  if (trimmed.length > 400) {
    return { ok: false, error: "input_too_long" }
  }

  const levelParsed = roastLevelSchema.safeParse(form.roastLevel)
  if (!levelParsed.success) {
    return { ok: false, error: "invalid_level" }
  }

  const rl = checkRoastServerRateLimit(clientKeyFromHeaders())
  if (!rl.ok) {
    return { ok: false, error: "rate_limited" }
  }

  const locale = normalizeLocale(form.locale)
  const prompt = buildRoastUserPrompt({
    locale,
    stackInput: trimmed,
    roastLevel: levelParsed.data,
  })

  const { parsed } = await generateOrdered(prompt)

  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "ai_unavailable" }
  }

  const validated = payloadSchema.safeParse(parsed)
  if (!validated.success) {
    return { ok: false, error: "parse_error" }
  }

  const data = validated.data

  return {
    ok: true,
    data: {
      ...data,
      roast_level: levelParsed.data,
      stack_summary: trimmed.length > 80 ? `${trimmed.slice(0, 77)}…` : trimmed,
    },
  }
}
