// Centralized description of the ClawGuru production stack. The Lacework
// and Falco comparison pages used to claim "PostgreSQL + Supabase backend"
// — that was wrong (real stack is Neon + Netlify Functions). Per Kimi 2.5
// audit (docs/audit-response-kimi-2026-04-25.md, Critical #3), every surface
// that names the stack must read from this single source.

export type StackVariant = "bullets" | "inline" | "compact"

export const STACK_ITEMS = {
  frontend:    { de: "Next.js 14 (App Router)",                 en: "Next.js 14 (App Router)" },
  backend:     { de: "Neon Postgres (Serverless, EU)",          en: "Neon Postgres (serverless, EU region)" },
  failover:    { de: "Auto-Failover auf zweite Neon-Instanz",   en: "Auto-failover to a second Neon instance" },
  hosting:     { de: "Netlify (Edge + Functions)",              en: "Netlify (Edge + Functions)" },
  data:        { de: "Mycelium Knowledge Graph (Runbook-KG)",   en: "Mycelium Knowledge Graph (runbook KG)" },
  ai:          { de: "Sentinel AI (lokal Ollama, Cloud Gemini)", en: "Sentinel AI (local Ollama, Gemini fallback)" },
  billing:     { de: "Stripe (EU-Steuersätze)",                 en: "Stripe (EU tax rates)" },
  cspm:        { de: "Custom Rule Engine",                       en: "Custom rule engine" },
} as const

export type StackKey = keyof typeof STACK_ITEMS

const DEFAULT_KEYS: StackKey[] = ["frontend", "backend", "failover", "hosting", "data", "ai", "billing", "cspm"]

interface Props {
  locale?: "de" | "en"
  variant?: StackVariant
  keys?: StackKey[]
  className?: string
}

export default function StackDescription({
  locale = "de",
  variant = "bullets",
  keys = DEFAULT_KEYS,
  className = "",
}: Props) {
  const items = keys.map((k) => STACK_ITEMS[k][locale])

  if (variant === "inline") {
    return <span className={className}>{items.join(" · ")}</span>
  }
  if (variant === "compact") {
    return <span className={className}>{items.slice(0, 4).join(" · ")}</span>
  }
  return (
    <ul className={className || "list-disc pl-5 space-y-1 text-sm text-gray-300"}>
      {items.map((label, i) => (
        <li key={i}>{label}</li>
      ))}
    </ul>
  )
}
