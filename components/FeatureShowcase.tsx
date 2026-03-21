"use client"

import dynamic from "next/dynamic"
import React from "react"

const SummonPreviewCard = dynamic<{ prefix?: string }>(() => import("./SummonPreviewCard"), {
  ssr: false,
  loading: () => <div className="h-96 bg-white/5 rounded-2xl animate-pulse border border-white/10" />,
})
const OraclePreviewCard = dynamic<{ prefix?: string }>(() => import("./OraclePreviewCard"), {
  ssr: false,
  loading: () => <div className="h-96 bg-white/5 rounded-2xl animate-pulse border border-white/10" />,
})
const NeuroPreviewCard = dynamic<{ prefix?: string }>(() => import("./NeuroPreviewCard"), {
  ssr: false,
  loading: () => <div className="h-96 bg-white/5 rounded-2xl animate-pulse border border-white/10" />,
})
const MyceliumPreviewCard = dynamic<{ prefix?: string }>(() => import("./MyceliumPreviewCard"), {
  ssr: false,
  loading: () => <div className="h-96 bg-white/5 rounded-2xl animate-pulse border border-white/10" />,
})

type Props = { prefix?: string }

export default function FeatureShowcase({ prefix = "" }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SummonPreviewCard prefix={prefix} />
      <OraclePreviewCard prefix={prefix} />
      <NeuroPreviewCard prefix={prefix} />
      <MyceliumPreviewCard prefix={prefix} />
    </div>
  )
}
