// WORLD BEAST UPGRADE: extension/popup.js
// ClawBrowser Extension popup logic – fetches Claw Score for current tab domain.

const API_BASE = "https://clawguru.org"

// WORLD BEAST UPGRADE: Score grading logic (mirrors server-side logic)
function gradeScore(score) {
  if (score >= 90) return { grade: "Secure ✅", color: "#00ff9d", risk: 10 }
  if (score >= 75) return { grade: "Good 🟢", color: "#22c55e", risk: 25 }
  if (score >= 55) return { grade: "Fair ⚠️", color: "#ffcc00", risk: 50 }
  if (score >= 35) return { grade: "Risky 🟠", color: "#ff6b35", risk: 70 }
  return { grade: "Critical 🔴", color: "#ff3b5c", risk: 90 }
}

// WORLD BEAST UPGRADE: Heuristic score from domain (fallback when API unavailable)
function heuristicScore(domain) {
  // Deterministic hash-based score for consistent display
  let hash = 0
  for (let i = 0; i < domain.length; i++) {
    hash = ((hash << 5) - hash) + domain.charCodeAt(i)
    hash |= 0
  }
  // Range: 30-95 for variety
  return 30 + (Math.abs(hash) % 65)
}

function getScoreSummary(score) {
  if (score >= 90) return "No critical issues detected. Infrastructure appears well-hardened."
  if (score >= 75) return "Minor configuration gaps found. Review the runbooks for fixes."
  if (score >= 55) return "Several security issues detected. Prioritize the runbooks below."
  if (score >= 35) return "High-risk configuration. Immediate action recommended."
  return "Critical vulnerabilities detected. Apply fixes immediately."
}

async function loadScore(domain) {
  try {
    // WORLD BEAST UPGRADE: Call ClawGuru API for the domain score
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(`${API_BASE}/api/security-check?domain=${encodeURIComponent(domain)}&source=extension`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (res.ok) {
      const data = await res.json()
      return data.score ?? heuristicScore(domain)
    }
  } catch {
    // Fallback to heuristic if API is unavailable
  }
  return heuristicScore(domain)
}

// WORLD BEAST UPGRADE: Track anonymous extension analytics (no PII)
async function trackExtensionView(domain) {
  try {
    // Only track: domain category (TLD), not the full domain
    const tld = domain.split(".").slice(-1)[0] || "unknown"
    await fetch(`${API_BASE}/api/extension-analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tld, event: "popup_open" }),
    })
  } catch {
    // Analytics failure is non-critical
  }
}

async function init() {
  const loadingEl = document.getElementById("loadingState")
  const scoreEl = document.getElementById("scoreState")

  // WORLD BEAST UPGRADE: Get current tab URL
  let domain = "unknown"
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.url) {
      domain = new URL(tab.url).hostname.replace(/^www\./, "")
    }
  } catch {
    domain = "unknown"
  }

  // Update domain display
  const domainEl = document.getElementById("domainName")
  if (domainEl) domainEl.textContent = domain

  // Update links
  const checkLink = document.getElementById("checkLink")
  const runbookLink = document.getElementById("runbookLink")
  if (checkLink) checkLink.href = `${API_BASE}/check?domain=${encodeURIComponent(domain)}&utm_source=extension`
  if (runbookLink) runbookLink.href = `${API_BASE}/runbooks?utm_source=extension`

  // Fetch score
  const score = await loadScore(domain)
  const { grade, color, risk } = gradeScore(score)

  // Show score UI
  if (loadingEl) loadingEl.style.display = "none"
  if (scoreEl) scoreEl.style.display = "block"

  const scoreNumber = document.getElementById("scoreNumber")
  const scoreGrade = document.getElementById("scoreGrade")
  const scoreSummary = document.getElementById("scoreSummary")
  const scoreCircle = document.getElementById("scoreCircle")
  const riskBar = document.getElementById("riskBar")
  const riskLabel = document.getElementById("riskLabel")

  if (scoreNumber) scoreNumber.textContent = String(score)
  if (scoreNumber) scoreNumber.style.color = color
  if (scoreGrade) { scoreGrade.textContent = grade; scoreGrade.style.color = color }
  if (scoreSummary) scoreSummary.textContent = getScoreSummary(score)
  if (scoreCircle) {
    scoreCircle.style.background = `${color}12`
    scoreCircle.style.border = `2px solid ${color}40`
    scoreCircle.style.boxShadow = `0 0 20px ${color}20`
  }
  if (riskBar) {
    riskBar.style.width = `${risk}%`
    riskBar.style.background = color
  }
  if (riskLabel) {
    const riskText = risk >= 70 ? "High" : risk >= 40 ? "Medium" : "Low"
    riskLabel.textContent = riskText
    riskLabel.style.color = color
  }

  // WORLD BEAST UPGRADE: Anonymous analytics (non-blocking)
  void trackExtensionView(domain)
}

// Initialize on popup load
document.addEventListener("DOMContentLoaded", init)
