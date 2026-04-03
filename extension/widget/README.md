# clawguru-moltbot-hardener

Embeddable one-click widget that links operators to ClawGuru's Moltbot roast/check flow.

## Install

```bash
npm install clawguru-moltbot-hardener
```

## One-line embed (CDN)

```html
<script src="https://unpkg.com/clawguru-moltbot-hardener/index.js"></script>
```

Then place a target node anywhere:

```html
<div data-clawguru-moltbot-widget data-locale="en"></div>
```

Optional attributes:
- `data-base-url` (default `https://clawguru.org`)
- `data-locale` (default `en`)
- `data-title`
- `data-subtitle`
- `data-cta`
- `data-badge`

## Programmatic mount

```html
<div id="cg-hardener"></div>
<script src="https://unpkg.com/clawguru-moltbot-hardener/index.js"></script>
<script>
  window.ClawGuruMoltbotHardener.mount("#cg-hardener", {
    locale: "de",
    cta: "Kostenlosen Check starten"
  })
</script>
```
