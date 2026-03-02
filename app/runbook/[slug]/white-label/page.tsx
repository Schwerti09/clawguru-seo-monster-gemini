// White Label Runbook View – MSP branded variant
// Branding is passed via URL search params:
//   ?logo=https://...  (logo image URL)
//   ?company=MyMSP     (company display name)
//   ?accent=#hexcolor  (optional accent color, defaults to #00ff9d)
import { notFound } from "next/navigation"
import { getRunbook, RUNBOOKS } from "@/lib/pseo"
import { validateRunbook } from "@/lib/quality-gate"
import type { RunbookBlock, RunbookFaqEntry } from "@/lib/pseo"

export const dynamicParams = true

export async function generateStaticParams() {
  return RUNBOOKS.slice(0, 200).map((r) => ({ slug: r.slug }))
}

function sanitizeHex(value: string | undefined): string | undefined {
  if (!value) return undefined
  const clean = value.startsWith("#") ? value : `#${value}`
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean) ? clean : undefined
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.slice(1)
  const full = h.length === 3
    ? h.split("").map((c) => c + c).join("")
    : h
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function safeLogoUrl(value: string | undefined): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === "https:" ? value : null
  } catch {
    return null
  }
}

function BlockView({ b }: { b: RunbookBlock }) {
  if (b.kind === "h2") return <h2 className="mt-10 text-lg font-black text-gray-100">{b.text}</h2>
  if (b.kind === "h3") return <h3 className="mt-6 text-base font-bold text-gray-200">{b.text}</h3>
  if (b.kind === "h4") return <h4 className="mt-4 text-sm font-semibold text-gray-300 uppercase tracking-wide">{b.text}</h4>
  if (b.kind === "p") return <p className="mt-3 text-gray-200/90 leading-relaxed">{b.text}</p>
  if (b.kind === "ul")
    return (
      <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-200/90">
        {b.items.map((it, i) => (
          <li key={i} className="leading-relaxed">{it}</li>
        ))}
      </ul>
    )
  if (b.kind === "code")
    return (
      <pre className="mt-4 rounded-2xl border border-gray-800 bg-black/40 p-4 overflow-x-auto text-sm">
        <code>{b.code}</code>
      </pre>
    )
  if (b.kind === "callout")
    return (
      <div
        className={`mt-5 rounded-3xl border p-5 ${
          b.tone === "warn" ? "border-red-500/30 bg-red-500/10" : "border-emerald-500/30 bg-emerald-500/10"
        }`}
      >
        <div className="text-sm font-black tracking-wide text-gray-100">{b.title}</div>
        <div className="mt-2 text-gray-200/90 leading-relaxed">{b.text}</div>
      </div>
    )
  return null
}

function FaqSection({ faq }: { faq: RunbookFaqEntry[] }) {
  if (!faq?.length) return null
  return (
    <div className="mt-12">
      <h2 className="text-xl font-black mb-6 text-gray-100">Häufige Fragen (FAQ)</h2>
      <div className="space-y-4">
        {faq.map((entry, i) => (
          <details key={i} className="rounded-2xl border border-gray-800 bg-black/20 group">
            <summary className="px-5 py-4 cursor-pointer font-bold text-gray-200 list-none flex items-center justify-between">
              <span>{entry.q}</span>
              <span className="text-gray-500 group-open:rotate-180 transition-transform text-xs">▼</span>
            </summary>
            <div className="px-5 pb-4 text-gray-400 leading-relaxed text-sm">{entry.a}</div>
          </details>
        ))}
      </div>
    </div>
  )
}

export default function WhiteLabelRunbookPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { logo?: string; company?: string; accent?: string }
}) {
  const r = getRunbook(params.slug)
  if (!r) return notFound()

  const quality = validateRunbook(r)
  if (!quality.pass) return notFound()

  const company = typeof searchParams.company === "string" && searchParams.company.trim()
    ? searchParams.company.trim()
    : "MSP Partner"
  const logoUrl = safeLogoUrl(searchParams.logo)
  const accent = sanitizeHex(searchParams.accent) ?? "#00ff9d"

  return (
    <main className="min-h-screen bg-[#05060A]">
      {/* Branded header */}
      <header className="border-b border-gray-800 bg-black/40 px-6 py-4 flex items-center gap-4">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={`${company} Logo`} className="h-8 w-auto object-contain" />
        ) : (
          <div
            className="text-lg font-black"
            style={{ color: accent }}
          >
            {company}
          </div>
        )}
        {logoUrl && (
          <span className="font-black text-sm text-white">{company}</span>
        )}
        <span className="ml-auto text-xs text-gray-600">Powered by ClawGuru</span>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Kicker + title */}
        <div className="mb-2">
          <div
            className="text-xs uppercase tracking-widest font-mono mb-2"
            style={{ color: hexToRgba(accent, 0.7) }}
          >
            Runbook
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">{r.title}</h1>
          <p className="mt-3 text-gray-300 max-w-3xl">{r.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 mb-8">
          {r.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-1 rounded-lg border border-gray-800 bg-black/30 text-xs text-gray-300"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
          {/* Rich blocks */}
          {Array.isArray(r.blocks) && r.blocks.length > 0 ? (
            <div className="mb-10">
              {r.blocks.map((b: RunbookBlock, i: number) => (
                <BlockView key={i} b={b} />
              ))}
            </div>
          ) : null}

          <div className="text-xs uppercase tracking-widest text-gray-500">Schritt-für-Schritt</div>
          <ol className="mt-4 list-decimal pl-6 space-y-3 text-gray-200">
            {r.howto.steps.map((s, i) => (
              <li key={i} className="leading-relaxed">{s}</li>
            ))}
          </ol>
        </div>

        <FaqSection faq={r.faq} />

        {/* Footer note */}
        <div className="mt-12 p-5 rounded-3xl border border-gray-800 bg-black/20 text-xs text-gray-500">
          Dieses Runbook wird bereitgestellt von{" "}
          <span className="text-gray-300 font-semibold">{company}</span> · Inhalt lizenziert
          durch ClawGuru.
        </div>
      </div>
    </main>
  )
}
