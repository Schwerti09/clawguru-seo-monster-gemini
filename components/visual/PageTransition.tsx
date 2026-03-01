"use client"
// VISUAL UPGRADE 2026: Framer Motion page transition wrapper.
// Applies fade + slide-up animation on every page mount for smooth transitions.
// FIX: initial={false} on AnimatePresence prevents the first render from using
// opacity:0 as SSR output – content is immediately visible on initial load and
// subsequent route-change transitions still animate normally.

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
