import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import CopilotChat from "@/components/copilot/CopilotChat"
import VoiceCopilot from "@/components/copilot/VoiceCopilot"
import LiveFixSandbox from "@/components/copilot/LiveFixSandbox"
import LoginSaveBanner from "@/components/shared/LoginSaveBanner"

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
  return (
    <Container>
      <div className="py-16">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Prof. ClawGuru</h1>
        <p className="text-gray-300 text-lg mb-8">
          Das lebendige Universum der Runbooks
        </p>
        {/* CopilotChat supports manual input; prefill hint displayed below */}
        {q ? (
          <div className="mb-6 p-4 rounded-2xl border border-gray-800 bg-black/30 text-gray-300">
            Prefill: <span className="font-mono">{q}</span> — kopier das in den Input oder klick unten einen Followup.
          </div>
        ) : null}
        <LoginSaveBanner />
        <CopilotChat />
        {/* NEXT-LEVEL UPGRADE 2026: Voice Copilot – speak your issue */}
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
            <h2 className="text-xl font-black text-[#00ff9d]">🎤 Voice Copilot</h2>
            {/* Feature gate nudge – Voice is limited on Day Pass */}
            <a
              href="/pricing#pro"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-opacity hover:opacity-80"
              style={{ borderColor: "rgba(139,92,246,0.4)", color: "#a78bfa", background: "rgba(139,92,246,0.07)" }}
            >
              🔒 Unlimited Voice → Upgrade to Pro
            </a>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Sprich dein Problem ein – Web Speech API erkennt es, Gemini analysiert es und liest die Antwort vor.
          </p>
          <VoiceCopilot lang="de" />
        </div>
        {/* NEXT-LEVEL UPGRADE 2026: Live Fix Sandbox – test configs in-browser */}
        <div className="mt-8">
          <h2 className="text-xl font-black mb-3 text-[#00b8ff]">🧪 Live Fix Sandbox</h2>
          <p className="text-gray-400 text-sm mb-4">
            Config hier einfügen und sofort auf Sicherheitsprobleme analysieren lassen – nginx, Docker, Terraform, K8s.
          </p>
          <LiveFixSandbox />
        </div>
      </div>
    </Container>
  )
}
