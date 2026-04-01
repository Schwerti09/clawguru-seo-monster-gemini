"use client"

import dynamic from "next/dynamic"
import React from "react"

const SummonPreviewCard = dynamic<{ prefix?: string; dict?: Record<string, string> }>(() => import("./SummonPreviewCard"), {
  ssr: false,
  loading: () => <div className="h-96 bg-white/5 rounded-2xl animate-pulse border border-white/10" />,
})
const OraclePreviewCard = dynamic<{ prefix?: string; dict?: Record<string, string> }>(() => import("./OraclePreviewCard"), {
  ssr: false,
  loading: () => <div className="h-96 bg-white/5 rounded-2xl animate-pulse border border-white/10" />,
})
const NeuroPreviewCard = dynamic<{ prefix?: string; dict?: Record<string, string> }>(() => import("./NeuroPreviewCard"), {
  ssr: false,
  loading: () => <div className="h-96 bg-white/5 rounded-2xl animate-pulse border border-white/10" />,
})
const MyceliumPreviewCard = dynamic<{ prefix?: string; dict?: Record<string, string> }>(() => import("./MyceliumPreviewCard"), {
  ssr: false,
  loading: () => <div className="h-96 bg-white/5 rounded-2xl animate-pulse border border-white/10" />,
})

type Props = { prefix?: string; dict?: Record<string, string> }

export default function FeatureShowcase({ prefix = "", dict = {} }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SummonPreviewCard prefix={prefix} dict={dict} />
      <OraclePreviewCard prefix={prefix} dict={dict} />
      <NeuroPreviewCard prefix={prefix} dict={dict} />
      <MyceliumPreviewCard prefix={prefix} dict={dict} />
    </div>
  )
}
