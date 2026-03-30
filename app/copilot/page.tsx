import type { Metadata } from "next"
import { headers } from "next/headers"
import Container from "@/components/shared/Container"
import CopilotChat from "@/components/copilot/CopilotChat"
import VoiceCopilot from "@/components/copilot/VoiceCopilot"
import LiveFixSandbox from "@/components/copilot/LiveFixSandbox"
import LoginSaveBanner from "@/components/shared/LoginSaveBanner"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"

export const metadata: Metadata = {
  title: "Prof. ClawGuru | ClawGuru",
  description:
    "OpenClaw/Moltbot Security Copilot: Problem beschreiben, Schritt-für-Schritt Runbook bekommen. Konversation → Prioritäten → Fix.",
  alternates: { canonical: "/copilot" }
}

export default async function CopilotPage(
  props: { searchParams?: Promise<Record<string, string | string[] | undefined>> }
) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams?.q === "string" ? searchParams?.q : ""

  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const dict = await getDictionary(locale)

  return (
    <Container>
      <div className="py-16">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Prof. ClawGuru</h1>
        <p className="text-gray-300 text-lg mb-8">
          {dict.copilot.pageSubtitle}
        </p>
        {/* CopilotChat supports manual input; prefill hint displayed below */}
        {q ? (
          <div className="mb-6 p-4 rounded-2xl border border-gray-800 bg-black/30 text-gray-300">
            {dict.copilot.prefillNote.replace("{q}", q)}
          </div>
        ) : null}
        <LoginSaveBanner />
        <CopilotChat />
        {/* NEXT-LEVEL UPGRADE 2026: Voice Copilot – speak your issue */}
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
            <h2 className="text-xl font-black text-[#00ff9d]">{dict.copilot.voiceTitle}</h2>
            {/* Feature gate nudge – Voice is limited on Day Pass */}
            <a
              href={`/${locale}/pricing#pro`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-opacity hover:opacity-80"
              style={{ borderColor: "rgba(139,92,246,0.4)", color: "#a78bfa", background: "rgba(139,92,246,0.07)" }}
            >
              {dict.copilot.voiceUpgrade}
            </a>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            {dict.copilot.voiceDesc}
          </p>
          <VoiceCopilot lang={locale} />
        </div>
        {/* NEXT-LEVEL UPGRADE 2026: Live Fix Sandbox – test configs in-browser */}
        <div className="mt-8">
          <h2 className="text-xl font-black mb-3 text-[#00b8ff]">{dict.copilot.sandboxTitle}</h2>
          <p className="text-gray-400 text-sm mb-4">
            {dict.copilot.sandboxDesc}
          </p>
          <LiveFixSandbox />
        </div>
      </div>
    </Container>
  )
}
