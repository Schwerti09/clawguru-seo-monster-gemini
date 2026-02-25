// WORLD BEAST UPGRADE: app/fix/[slug]/page.tsx
// Automated Fix Pull Request Generator – generates ready-to-use code (Docker, nginx, Terraform etc.)
// and prepares a GitHub PR description with one-click copy.

import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import { generateFixCode } from "@/lib/agents/fix-agent"
import FixPageClient from "./FixPageClient"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = params.slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `Fix: ${title} | ClawGuru`,
    description: `Auto-generated fix code and GitHub PR for ${title}. Docker, nginx, Terraform and more.`,
    alternates: { canonical: `/fix/${params.slug}` },
  }
}

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function FixPage({ params }: Props) {
  const { slug } = params

  // WORLD BEAST UPGRADE: Generate fix code server-side with Gemini
  const fixData = await generateFixCode(slug).catch(() => null)

  return (
    <Container>
      <div className="py-12 max-w-4xl mx-auto">
        {/* WORLD BEAST UPGRADE: Header */}
        <div className="mb-2 text-xs uppercase tracking-widest" style={{ color: "#00b8ff" }}>
          ▸ Auto-Fix Generator · WorldBeast 2026
        </div>
        <h1 className="text-3xl font-black font-heading mb-2">
          🔧 Fix Generator
        </h1>
        <div className="font-mono text-sm text-gray-400 mb-6">
          <span style={{ color: "#00ff9d" }}>$</span> clawguru fix --slug {slug}
        </div>

        {/* WORLD BEAST UPGRADE: Fix content (client component for copy/PR actions) */}
        <FixPageClient slug={slug} fixData={fixData} />

        {/* WORLD BEAST UPGRADE: Related runbook link */}
        <div className="mt-8 p-5 rounded-2xl glass-panel flex items-center justify-between">
          <div>
            <div className="font-black">📚 Vollständiges Runbook</div>
            <div className="text-sm text-gray-400 mt-0.5">
              Schritt-für-Schritt Anleitung mit Kontext und Erklärungen.
            </div>
          </div>
          <a
            href={`/runbook/${slug}`}
            className="px-5 py-2.5 rounded-xl font-bold text-sm border border-white/10 hover:border-white/20 text-gray-200 transition-all duration-300 whitespace-nowrap"
          >
            Runbook öffnen →
          </a>
        </div>
      </div>
    </Container>
  )
}
