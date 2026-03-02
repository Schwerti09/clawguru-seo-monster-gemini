"use client"

import { useEffect } from "react"

const STORAGE_KEY = "affiliate_ref"
const COOKIE_NAME = "affiliate_ref"
const MAX_AGE = 60 * 60 * 24 * 30
const MAX_LENGTH = 64
let storageErrorLogged = false

function readCookie(name: string) {
  if (typeof document === "undefined") return null
  const value = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
  return value ? decodeURIComponent(value.split("=")[1] || "") : null
}

function writeCookie(value: string) {
  if (typeof document === "undefined") return
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; max-age=${MAX_AGE}; path=/; samesite=lax`
}

function normalizeRef(value: string | null) {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, MAX_LENGTH)
}

export default function AffiliateRefTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    // Priority order: URL params override stored values; localStorage/cookie is used only
    // when no URL param is present. URL param order: affiliate_ref → ref → utm_campaign.
    const fromParams = normalizeRef(
      params.get("affiliate_ref") || params.get("ref") || params.get("utm_campaign")
    )
    const fromStorage = normalizeRef(localStorage.getItem(STORAGE_KEY))
    const fromCookie = normalizeRef(readCookie(COOKIE_NAME))
    const nextValue = fromParams || fromStorage || fromCookie

    if (nextValue) {
      try {
        localStorage.setItem(STORAGE_KEY, nextValue)
      } catch (error) {
        if (!storageErrorLogged) {
          storageErrorLogged = true
          console.warn("[affiliate-ref] localStorage unavailable", error)
        }
      }
      if (!fromCookie || fromCookie !== nextValue) {
        writeCookie(nextValue)
      }
    }
  }, [])

  return null
}
