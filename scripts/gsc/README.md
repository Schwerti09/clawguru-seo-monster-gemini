GSC monitoring scaffold

How it works
- `fetch-daily-metrics.js` will call Google Search Console (Search Analytics API) for yesterday's data and write JSON to `data/gsc-metrics/YYYY-MM-DD.json`.
- It reads credentials from one of the following environment variables (set these as repository secrets / Vercel envs):
  - `INDEXAPI_SERVICE_ACCOUNT` (recommended — reuses existing secret)
  - `GSC_SERVICE_ACCOUNT_JSON`
  - `GOOGLE_INDEXER_KEY`

Set `GSC_SITE_URL` (e.g. `https://clawguru.org`) if different from default.

Useful commands
- `npm run gsc:fetch-daily-metrics`
- `npm run gsc:index-priority:dry-run`
- `npm run gsc:index-priority:live`

Priority indexing batch
- `submit-priority-indexing-batch.js` builds the current D4 canonical geo URLs (`de` + `en`) plus core funnel pages.
- Default batch size is 32 URLs (24 D4 geo pages + 8 core URLs).
- Live mode posts the batch to `/api/admin/index-urls` using `ADMIN_API_TOKEN`.

Next steps
- If you want DB ingest, we can add an ingest script that reads `data/gsc-metrics/*.json` and inserts into `gsc_metrics` table.
- To enable alerts, provide a Slack webhook URL via `GSC_ALERT_SLACK_WEBHOOK` and we can send daily diffs.
