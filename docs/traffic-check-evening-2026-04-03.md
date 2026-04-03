# Traffic Check - Evening Report (03 Apr 2026)

Use this at 20:00 local time for launch validation.

## Scope

- Primary paths:
  - `/roast-my-moltbot`
  - `/check`
  - `/openclaw`
- Attribution:
  - `utm_source=community-launch`

## GA4 custom exploration setup

1. Open GA4 -> Explore -> Free form.
2. Date range: Today.
3. Add dimensions:
   - `Page path + query string`
   - `Session source / medium`
   - `Country`
4. Add metrics:
   - `Users`
   - `Sessions`
   - `Views`
   - `Engaged sessions`
   - `Conversions` (or key event: `check_start`)
5. Add filter:
   - Include `Page path + query string` matches regex:
     - `^/(de|en)?/?(roast-my-moltbot|check|openclaw).*`
6. Secondary filter:
   - Include `Session source / medium` contains `community-launch` (optional split view).

## Vercel Analytics quick board

1. Vercel -> Project -> Analytics.
2. Date range: Last 24h.
3. Filter pages:
   - `/roast-my-moltbot`
   - `/check`
   - `/openclaw`
4. Export screenshot + key numbers to AGENTS report section.

## Report template (copy/paste)

```text
Traffic-Check 20:00
- Views total (3 pages):
- Users total:
- check_start events:
- Top source/medium:
- Best page by engaged sessions:
- Geo signal (top 3 countries):
- Action for tomorrow:
```

