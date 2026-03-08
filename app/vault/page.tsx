"use client"
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { kb } from "@/lib/kb"
import { useMemo, useState } from "react"

export default function Vault() {
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim()
    return kb.filter((k: any) => {
      if (!t) return true
      const hay = (k.title + " " + k.excerpt + " " + (k.tags || []).join(" ")).toLowerCase()
      return hay.includes(t)
    })
  }, [q])

  return (
    <Container>
      <SectionTitle>Vault</SectionTitle>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search..."
        className="w-full mb-6 p-2 bg-black border border-gray-700 text-white"
      />

      <div className="space-y-6">
        {filtered.map((k: any, i: number) => (
          <div key={i} className="border border-gray-700 p-4 rounded-lg">
            <h3 className="text-white text-lg">{k.title}</h3>
            <div className="text-gray-300 mt-2">{k.excerpt}</div>

            <div className="mt-3 flex flex-wrap gap-2">
              {(k.tags || []).map((t: string) => (
                <span
                  key={t}
                  className="px-2 py-1 rounded-full border border-gray-700 bg-black/30 text-xs text-gray-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}