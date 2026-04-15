"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Flame, Share2, ShieldCheck, Users, MessageCircle, Send, Mail, Trophy } from "lucide-react"
import type { RoastStackResult } from "@/app/actions/roast-stack"

export type RoastShareDict = {
  score_label: string
  score_hint: string
  top_roasts: string
  fix_cta: string
  share_x: string
  share_li: string
  share_wa: string
  share_tg: string
  share_mail: string
  copy_link: string
  copied: string
  challenge_title: string
  challenge_desc: string
  challenge_cta: string
}

type Props = {
  result: RoastStackResult
  dict: RoastShareDict
  prefix: string
  shareUrl: string
  onCopy: () => void
  copied: boolean
}

function scoreColor(score: number): string {
  if (score >= 70) return "#22d3ee"
  if (score >= 40) return "#eab308"
  return "#f87171"
}

function viralMessage(score: number, topRoast: string): string {
  if (score >= 80) return `My stack scored ${score}/100 on ClawGuru Roast. Think yours can beat it?`
  if (score >= 60) return `${score}/100 on ClawGuru Roast: "${topRoast}" — brutal but fair. Can you do better?`
  if (score >= 40) return `Got roasted: ${score}/100. "${topRoast}" — I need to fix this. How bad is YOUR stack?`
  return `${score}/100... my stack got DESTROYED by ClawGuru Roast. I dare you to try yours.`
}

function scoreEmoji(score: number): string {
  if (score >= 80) return "🛡️"
  if (score >= 60) return "⚠️"
  if (score >= 40) return "🔥"
  return "💥"
}

export function RoastShareCard({ result, dict, prefix, shareUrl, onCopy, copied }: Props) {
  const [badgeCopied, setBadgeCopied] = useState(false)
  const viral = viralMessage(result.score, result.top_roasts[0] ?? "")
  const emoji = scoreEmoji(result.score)
  const tweet = `${emoji} ${viral}\n`
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(shareUrl)}`
  const liHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  const waText = `${emoji} ${viral} ${shareUrl}`
  const waHref = `https://wa.me/?text=${encodeURIComponent(waText)}`
  const tgHref = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`${emoji} ${viral}`)}`
  const mailSubject = `ClawGuru Roast: ${result.score}/100`
  const mailBody = `${viral}\n\nTry it yourself: ${shareUrl}`
  const mailHref = `mailto:?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`
  const badgeSnippet = `<a href="${shareUrl}?utm_source=community-launch&utm_medium=badge&utm_campaign=secured-by-clawguru" class="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cyan-200"><span>Secured by ClawGuru</span></a>`

  async function copyBadgeSnippet() {
    try {
      await navigator.clipboard.writeText(badgeSnippet)
      setBadgeCopied(true)
      setTimeout(() => setBadgeCopied(false), 1800)
    } catch {
      setBadgeCopied(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-8"
      style={{
        background:
          "linear-gradient(145deg, rgba(8,8,12,0.95) 0%, rgba(18,14,8,0.92) 40%, rgba(6,10,14,0.96) 100%)",
        boxShadow:
          "0 0 0 1px rgba(234,179,8,0.12), 0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
      data-roast-card
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.35) 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(234,179,8,0.4) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <motion.div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border text-2xl font-black tabular-nums"
            style={{
              borderColor: `${scoreColor(result.score)}55`,
              color: scoreColor(result.score),
              background: "rgba(0,0,0,0.35)",
              boxShadow: `0 0 32px ${scoreColor(result.score)}22`,
            }}
            initial={{ scale: 0.85, rotate: -4 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            {result.score}
          </motion.div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/90">{dict.score_label}</p>
            <p className="mt-1 text-sm text-zinc-400">{dict.score_hint}</p>
            <p className="mt-3 max-w-md text-xs text-zinc-500 line-clamp-2">{result.stack_summary}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <a
            href={xHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
          >
            <Share2 className="h-4 w-4 text-cyan-300" />
            {dict.share_x}
          </a>
          <a
            href={liHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:border-amber-400/40 hover:bg-amber-500/10"
          >
            <Share2 className="h-4 w-4 text-amber-300" />
            {dict.share_li}
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:border-green-400/40 hover:bg-green-500/10"
          >
            <MessageCircle className="h-4 w-4 text-green-400" />
            {dict.share_wa}
          </a>
          <a
            href={tgHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:border-blue-400/40 hover:bg-blue-400/10"
          >
            <Send className="h-4 w-4 text-blue-400" />
            {dict.share_tg}
          </a>
          <a
            href={mailHref}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:border-purple-400/40 hover:bg-purple-400/10"
          >
            <Mail className="h-4 w-4 text-purple-400" />
            {dict.share_mail}
          </a>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-500/20"
          >
            {copied ? dict.copied : dict.copy_link}
          </button>
        </div>
      </div>

      <div className="relative mt-8 border-t border-white/10 pt-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <Flame className="h-4 w-4 text-orange-400" />
          {dict.top_roasts}
        </div>
        <ol className="space-y-2">
          {result.top_roasts.map((line, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="flex gap-3 text-sm text-zinc-300"
            >
              <span className="font-mono text-cyan-400/90">{i + 1}</span>
              <span>{line}</span>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="relative mt-8 flex flex-wrap gap-3">
        <Link
          href={`${prefix}/check`}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-amber-500/25 transition hover:from-amber-400 hover:to-amber-500"
        >
          {dict.fix_cta}
        </Link>
      </div>

      {/* Challenge a Friend — Viral Loop */}
      <div className="relative mt-6 rounded-xl border border-purple-500/25 p-5"
        style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(34,211,238,0.04) 100%)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15">
            <Trophy className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{dict.challenge_title}</p>
            <p className="text-xs text-zinc-400">{dict.challenge_desc}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-500 px-4 py-2.5 text-sm font-bold text-black transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            {dict.challenge_cta}
          </a>
          <a
            href={xHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <Users className="h-4 w-4 text-cyan-400" />
            {dict.share_x}
          </a>
        </div>
      </div>

      <div className="relative mt-6 rounded-xl border border-cyan-400/25 bg-cyan-500/5 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
          <ShieldCheck className="h-4 w-4" />
          Secured by ClawGuru
        </p>
        <p className="mt-2 text-xs text-zinc-400">
          Embed this trust-badge snippet in status pages, changelogs, or incident notes.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 text-[11px] text-zinc-300">
          {badgeSnippet}
        </pre>
        <button
          type="button"
          onClick={copyBadgeSnippet}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-cyan-400/35 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan-500/20"
        >
          {badgeCopied ? "Badge snippet copied" : "Copy badge snippet"}
        </button>
      </div>
    </motion.div>
  )
}
