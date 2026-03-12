"use client"
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { kb } from "@/lib/kb"
import { useMemo, useState } from "react"

export default function Vault() {
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim()
    return kb.filter((k: unknown) => {
      if (!t) return true
      if (!k || typeof k !== "object") return false
      const kObj = k as { title?: unknown; excerpt?: unknown; tags?: unknown }
      const title = typeof kObj.title === "string" ? kObj.title : ""
      const excerpt = typeof kObj.excerpt === "string" ? kObj.excerpt : ""
      const tags = Array.isArray(kObj.tags) ? kObj.tags.filter((x) => typeof x === "string") : []
      const hay = (title + " " + excerpt + " " + tags.join(" ")).toLowerCase()
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
        {filtered.map((k: unknown, i: number) => {
          const kObj = (k && typeof k === "object" ? (k as { title?: unknown; excerpt?: unknown; tags?: unknown }) : {})
          const title = typeof kObj.title === "string" ? kObj.title : ""
          const excerpt = typeof kObj.excerpt === "string" ? kObj.excerpt : ""
          const tags = Array.isArray(kObj.tags) ? kObj.tags.filter((x) => typeof x === "string") : []

          return (
            <div key={i} className="border border-gray-700 p-4 rounded-lg">
              <h3 className="text-white text-lg">{title}</h3>
              <div className="text-gray-300 mt-2">{excerpt}</div>

              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 rounded-full border border-gray-700 bg-black/30 text-xs text-gray-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}