const fs = require('fs');
const path = require('path');
const { fetchQueryMetrics } = require('./gsc-client');

async function main() {
  const siteUrl = process.env.GSC_SITE_URL || process.env.SITE_URL || 'https://clawguru.org';
  const serviceAccountJson = process.env.INDEXAPI_SERVICE_ACCOUNT || process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    console.error('Missing service account JSON. Set INDEXAPI_SERVICE_ACCOUNT or GSC_SERVICE_ACCOUNT_JSON in secrets.');
    process.exit(2);
  }

  const dt = new Date();
  dt.setUTCDate(dt.getUTCDate() - 1);
  const yyyy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  const date = `${yyyy}-${mm}-${dd}`;

  console.log(`Fetching GSC metrics for ${siteUrl} ${date}`);
  try {
    const rows = await fetchQueryMetrics({ serviceAccountJson, siteUrl, startDate: date, endDate: date });
    const outDir = path.join(process.cwd(), 'data', 'gsc-metrics');
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${date}.json`);
    fs.writeFileSync(outPath, JSON.stringify({ siteUrl, date, rows }, null, 2));
    console.log(`Wrote ${rows.length} rows to ${outPath}`);
  } catch (err) {
    console.error('Fetch error', err);
    process.exit(3);
  }
}

if (require.main === module) main();
