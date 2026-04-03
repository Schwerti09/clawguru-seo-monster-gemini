# Moltbot Widget Distribution Kit

Purpose: ship the one-click Moltbot hardener widget to OpenClaw/Discord/community channels with consistent copy.

## 1) Official embed sources

- Local hosted script (immediate):
  - `https://clawguru.org/widgets/clawguru-moltbot-hardener.js`
- NPM CDN (after publish):
  - `https://unpkg.com/clawguru-moltbot-hardener/index.js`

## 2) One-line embed

```html
<script src="https://clawguru.org/widgets/clawguru-moltbot-hardener.js"></script><div data-clawguru-moltbot-widget data-locale="en"></div>
```

German variant:

```html
<script src="https://clawguru.org/widgets/clawguru-moltbot-hardener.js"></script><div data-clawguru-moltbot-widget data-locale="de" data-cta="Kostenlosen Check starten"></div>
```

## 3) OpenClaw README snippet

```md
## Security quick-check (ClawGuru)

<script src="https://clawguru.org/widgets/clawguru-moltbot-hardener.js"></script>
<div data-clawguru-moltbot-widget data-locale="en"></div>
```

## 4) Discord pin copy

```text
Free 30-second Moltbot security check:
https://clawguru.org/en/roast-my-moltbot

Embeddable one-click widget:
<script src="https://clawguru.org/widgets/clawguru-moltbot-hardener.js"></script><div data-clawguru-moltbot-widget data-locale="en"></div>
```

## 5) Skill registry entry template

```md
### ClawGuru Moltbot Hardener Widget
- Type: Embeddable security check widget
- Link: https://clawguru.org/en/roast-my-moltbot
- Embed: https://clawguru.org/widgets/clawguru-moltbot-hardener.js
- Outcome: fast signal + fix-ready runbook path in under 30 seconds
```

## 6) Publish checklist (npm)

1. `cd extension/widget`
2. `npm version patch`
3. `npm publish --access public`
4. Verify: `https://unpkg.com/clawguru-moltbot-hardener/index.js`
