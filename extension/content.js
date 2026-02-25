// WORLD BEAST UPGRADE: extension/content.js
// ClawBrowser Content Script – injects a minimal, dismissible Claw Score indicator
// on pages where the score is critical (< 40). No tracking. No PII.

(function () {
  "use strict"

  // WORLD BEAST UPGRADE: Only show indicator once per page load
  if (document.getElementById("clawguru-indicator")) return

  const domain = window.location.hostname.replace(/^www\./, "")

  // Request score from background service worker via chrome.storage
  chrome.storage.session.get([`score_${domain}`], (result) => {
    const score = result[`score_${domain}`]

    // WORLD BEAST UPGRADE: Only inject UI for critical/risky scores
    if (score == null || score >= 55) return

    const color = score < 35 ? "#ff3b5c" : "#ff6b35"
    const label = score < 35 ? "Critical" : "Risky"

    const el = document.createElement("div")
    el.id = "clawguru-indicator"
    el.setAttribute("style", [
      "position: fixed",
      "bottom: 16px",
      "right: 16px",
      "z-index: 2147483647",
      `background: ${color}18`,
      `border: 1px solid ${color}50`,
      "border-radius: 10px",
      "padding: 10px 14px",
      "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "font-size: 12px",
      "color: #fff",
      "display: flex",
      "align-items: center",
      "gap: 10px",
      "cursor: pointer",
      `box-shadow: 0 4px 20px ${color}20`,
      "backdrop-filter: blur(8px)",
    ].join(";"))

    el.innerHTML = `
      <span style="font-size:16px">🦞</span>
      <div>
        <div style="font-weight:700;font-size:11px;color:${color}">${label} — Score ${score}/100</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.5)">ClawGuru: ${domain}</div>
      </div>
      <a href="https://clawguru.org/check?domain=${encodeURIComponent(domain)}&utm_source=extension-content"
         target="_blank"
         style="font-size:10px;font-weight:700;color:${color};text-decoration:none;white-space:nowrap"
      >Fix →</a>
      <button id="clawguru-dismiss" style="background:none;border:none;color:rgba(255,255,255,0.3);font-size:14px;cursor:pointer;padding:0;line-height:1">×</button>
    `

    document.body.appendChild(el)

    document.getElementById("clawguru-dismiss")?.addEventListener("click", (e) => {
      e.stopPropagation()
      el.remove()
    })
  })
})()
