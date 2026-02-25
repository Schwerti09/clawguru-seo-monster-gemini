# ClawBrowser Extension — ClawGuru WorldBeast 2026

Official Chrome/Edge browser extension that displays your **Claw Security Score** on every website you visit.

## Features

- **Real-time Claw Score badge** on every tab (updates every 5 minutes)
- **Popup UI** with score details, risk level bar, and direct links to full scan + runbooks
- **Critical site indicator** — non-intrusive overlay for sites with score < 55
- **Anonymous analytics** — only collects TLD category, never personal data
- **Manifest V3** — compatible with Chrome 112+, Edge 112+, Brave

## Install (Developer Mode)

1. Download/clone this repository
2. Open Chrome → `chrome://extensions`
3. Enable **Developer Mode** (top right toggle)
4. Click **Load unpacked**
5. Select the `/extension` folder
6. The 🦞 ClawGuru icon appears in your toolbar

## Install (Web Store)

*Coming soon — submission in progress.*

## Privacy

- No personal data is collected
- No browsing history is stored
- Score lookups use only the domain name (hostname)
- Anonymous analytics only track TLD (e.g. `.de`, `.com`) — never the full domain
- All data stays on your device or goes to `clawguru.org` via HTTPS

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Manifest V3 definition |
| `popup.html` | Extension popup UI |
| `popup.js` | Popup logic — fetches and displays score |
| `background.js` | Service worker — updates badge on tab change |
| `content.js` | Content script — injects critical score indicator |
| `icons/` | Extension icons (16, 48, 128px) |

## API

The extension calls `https://clawguru.org/api/security-check?domain=<domain>&source=extension` to fetch the Claw Score. If the API is unavailable, a deterministic heuristic score is used as fallback.

## Icons

Place PNG icons in the `icons/` directory:
- `icon16.png` (16×16)
- `icon48.png` (48×48)  
- `icon128.png` (128×128)

---

Built by [ClawGuru WorldBeast](https://clawguru.org) 🦞
