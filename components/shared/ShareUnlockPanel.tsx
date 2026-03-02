"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { BASE_URL } from "@/lib/config"
import { DEFAULT_LOCALE, type Locale, t } from "@/lib/i18n"

type Props = {
  title: string
  slug: string
  items: string[]
  previewCount?: number
  locale?: Locale
}

const STORAGE_PREFIX = "clawguru-share-unlock"

export default function ShareUnlockPanel({ title, slug, items, previewCount = 3, locale }: Props) {
  const [unlocked, setUnlocked] = useState(false)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const activeLocale = locale ?? DEFAULT_LOCALE
  const storageKey = `${STORAGE_PREFIX}:${slug}`
  const shareUrl = `${BASE_URL}/runbook/${slug}`
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(`${title} – ClawGuru Runbook`)

  const previewItems = useMemo(() => items.slice(0, previewCount), [items, previewCount])
  const lockedItems = useMemo(() => items.slice(previewCount), [items, previewCount])
  const unlockTitle = useMemo(
    () => t(activeLocale, "shareUnlockTitle").replace("{count}", String(lockedItems.length)),
    [activeLocale, lockedItems.length]
  )

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem(storageKey)
    if (stored === "true") setUnlocked(true)
  }, [storageKey])

  function unlock() {
    setUnlocked(true)
    setStatus("success")
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, "true")
    }
  }

  function handleShare(url: string) {
    window.open(url, "_blank", "noopener,noreferrer")
    unlock()
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.includes("@")) {
      setStatus("error")
      return
    }
    setStatus("loading")
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: `runbook:${slug}` }),
    })
    if (!res.ok) {
      setStatus("error")
      return
    }
    unlock()
  }

  return (
    <div>
      <ol className="mt-4 list-decimal pl-6 space-y-3 text-gray-200">
        {previewItems.map((step, index) => (
          <li key={`preview-${index}`} className="leading-relaxed">
            {step}
          </li>
        ))}
        {!unlocked &&
          lockedItems.slice(0, 2).map((step, index) => (
            <li key={`locked-${index}`} className="leading-relaxed text-gray-500 blur-[1px] select-none">
              {step}
            </li>
          ))}
        {unlocked &&
          lockedItems.map((step, index) => (
            <li key={`full-${index}`} className="leading-relaxed">
              {step}
            </li>
          ))}
      </ol>
      {!unlocked && lockedItems.length > 0 && (
        <div className="mt-6 rounded-3xl border border-cyan-500/30 bg-cyan-500/10 p-5 space-y-4">
          <div className="text-sm text-cyan-200 font-bold">{unlockTitle}</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleShare(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`)}
              className="px-3 py-1.5 rounded-xl border border-gray-700 bg-black/40 text-xs text-gray-200 hover:border-sky-500 hover:text-sky-300 transition-colors"
              type="button"
            >
              {t(activeLocale, "shareUnlockShareX")}
            </button>
            <button
              onClick={() => handleShare(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedText}`)}
              className="px-3 py-1.5 rounded-xl border border-gray-700 bg-black/40 text-xs text-gray-200 hover:border-blue-500 hover:text-blue-300 transition-colors"
              type="button"
            >
              {t(activeLocale, "shareUnlockShareLinkedin")}
            </button>
          </div>
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t(activeLocale, "shareUnlockEmailPlaceholder")}
              className="flex-1 rounded-xl border border-gray-700 bg-black/50 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-400"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-400 text-black text-sm font-black hover:bg-cyan-300 transition-colors disabled:opacity-60"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? t(activeLocale, "shareUnlockLoading")
                : t(activeLocale, "shareUnlockEmailButton")}
            </button>
          </form>
          {status === "error" && (
            <div className="text-xs text-red-300">{t(activeLocale, "shareUnlockError")}</div>
          )}
          {status === "success" && (
            <div className="text-xs text-emerald-300">{t(activeLocale, "shareUnlockSuccess")}</div>
          )}
        </div>
      )}
    </div>
  )
}
