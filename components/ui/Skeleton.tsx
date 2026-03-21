"use client"

import React from "react"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className = "", ...rest }: SkeletonProps) {
  return (
    <div
      {...rest}
      className={`rounded-md bg-white/10 animate-pulse ${className}`}
      aria-hidden
    />
  )
}

export default Skeleton
