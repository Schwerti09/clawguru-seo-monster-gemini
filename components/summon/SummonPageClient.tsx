"use client"

import { useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import SummonSearch from "./SummonSearch"
import ExampleQueries from "./ExampleQueries"

function useLocalePrefix() {
  const pathname = usePathname()
  return useMemo(() => {
    if (!pathname) return ""
    const seg = pathname.split("/").filter(Boolean)[0]
    if (!seg) return ""
    if (seg.length <= 5) return `/${seg}`
    return ""
  }, [pathname])
}

export default function SummonPageClient({ dict }: { dict?: any }) {
  const prefix = useLocalePrefix()
  const [prefill, setPrefill] = useState("")

  return (
    <div className="space-y-8">
      <SummonSearch initialQuery={prefill} dict={dict} />
      <ExampleQueries onSelect={(q) => setPrefill(q)} dict={dict} />
    </div>
  )
}
