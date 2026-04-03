/* clawguru-moltbot-hardener widget */
(function () {
  function hardenUrl(baseUrl, locale) {
    var safeBase = (baseUrl || "https://clawguru.org").replace(/\/+$/, "")
    var safeLocale = (locale || "en").toLowerCase()
    return safeBase + "/" + safeLocale + "/roast-my-moltbot"
  }

  function render(container, opts) {
    var href = hardenUrl(opts.baseUrl, opts.locale)
    var title = opts.title || "Moltbot Security Check in 30 seconds"
    var subtitle =
      opts.subtitle ||
      "Run a fast ClawGuru signal check and jump to fix-ready runbooks."
    var cta = opts.cta || "Run free check"
    var badge = opts.badge || "Secured by ClawGuru"

    container.innerHTML =
      '<div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;border:1px solid rgba(255,255,255,.2);border-radius:14px;padding:16px;max-width:420px;background:linear-gradient(135deg,#04121d,#0b1f2a);color:#e8f1f7">' +
      '<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6ee7ff;font-weight:700;margin-bottom:8px">' +
      badge +
      "</div>" +
      '<div style="font-size:18px;line-height:1.3;font-weight:800;margin-bottom:8px">' +
      title +
      "</div>" +
      '<div style="font-size:13px;line-height:1.5;color:#c6d6e2;margin-bottom:14px">' +
      subtitle +
      "</div>" +
      '<a href="' +
      href +
      '" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#22d3ee;color:#001018;text-decoration:none;font-weight:800;font-size:13px;padding:10px 14px;border-radius:10px">' +
      cta +
      "</a>" +
      "</div>"
  }

  function mount(selector, options) {
    var target =
      typeof selector === "string" ? document.querySelector(selector) : selector
    if (!target) return false
    render(target, options || {})
    return true
  }

  function autoInit() {
    var nodes = document.querySelectorAll("[data-clawguru-moltbot-widget]")
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i]
      render(node, {
        baseUrl: node.getAttribute("data-base-url") || undefined,
        locale: node.getAttribute("data-locale") || undefined,
        title: node.getAttribute("data-title") || undefined,
        subtitle: node.getAttribute("data-subtitle") || undefined,
        cta: node.getAttribute("data-cta") || undefined,
        badge: node.getAttribute("data-badge") || undefined
      })
    }
  }

  if (typeof window !== "undefined") {
    window.ClawGuruMoltbotHardener = { mount: mount }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", autoInit)
    } else {
      autoInit()
    }
  }
})()
