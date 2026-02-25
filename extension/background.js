// WORLD BEAST UPGRADE: extension/background.js
// ClawBrowser Extension Service Worker – handles badge updates and caching.

const API_BASE = "https://clawguru.org"
const CACHE_TTL_MS = 5 * 60 * 1000  // 5 minutes

// WORLD BEAST UPGRADE: In-memory score cache
const scoreCache = new Map()

// Score-to-badge color mapping
function badgeColor(score) {
  if (score >= 90) return "#00ff9d"
  if (score >= 75) return "#22c55e"
  if (score >= 55) return "#ffcc00"
  if (score >= 35) return "#ff6b35"
  return "#ff3b5c"
}

// WORLD BEAST UPGRADE: Update the extension badge for a tab
async function updateBadge(tabId, domain) {
  try {
    const cached = scoreCache.get(domain)
    let score

    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      score = cached.score
    } else {
      // Fetch score from ClawGuru API with timeout
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      try {
        const res = await fetch(
          `${API_BASE}/api/security-check?domain=${encodeURIComponent(domain)}&source=extension-bg`,
          { signal: controller.signal }
        )
        clearTimeout(timeout)
        if (res.ok) {
          const data = await res.json()
          score = data.score ?? null
        }
      } catch {
        clearTimeout(timeout)
      }

      if (score != null) {
        scoreCache.set(domain, { score, ts: Date.now() })
      }
    }

    if (score != null) {
      await chrome.action.setBadgeText({ text: String(score), tabId })
      await chrome.action.setBadgeBackgroundColor({ color: badgeColor(score), tabId })
      await chrome.action.setTitle({ title: `ClawGuru Score: ${score}/100 — ${domain}`, tabId })
    }
  } catch {
    // Badge update failure is non-critical
  }
}

// WORLD BEAST UPGRADE: Listen for tab updates to refresh badge
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    try {
      const domain = new URL(tab.url).hostname.replace(/^www\./, "")
      if (domain && !domain.startsWith("chrome") && !domain.startsWith("moz-extension")) {
        void updateBadge(tabId, domain)
      }
    } catch {
      // Invalid URL – ignore
    }
  }
})

// WORLD BEAST UPGRADE: Listen for tab activation to update badge
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId)
    if (tab.url) {
      const domain = new URL(tab.url).hostname.replace(/^www\./, "")
      if (domain && !domain.startsWith("chrome") && !domain.startsWith("moz-extension")) {
        void updateBadge(tabId, domain)
      }
    }
  } catch {
    // Ignore
  }
})
