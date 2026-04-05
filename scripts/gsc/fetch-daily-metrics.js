const fs = require('fs');
const path = require('path');
const { fetchQueryMetrics } = require('./gsc-client');

try {
  require('dotenv').config();
  require('dotenv').config({ path: '.env.local' });
} catch {}

async function main() {
  const siteUrl = process.env.GSC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://clawguru.org';
  let serviceAccountJson =
    process.env.INDEXAPI_SERVICE_ACCOUNT ||
    process.env.GSC_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_INDEXER_KEY;
  if (!serviceAccountJson && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    serviceAccountJson = fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8');
  }
  if (!serviceAccountJson) {
    console.error('Missing service account JSON. Set INDEXAPI_SERVICE_ACCOUNT, GSC_SERVICE_ACCOUNT_JSON, GOOGLE_INDEXER_KEY, or GOOGLE_APPLICATION_CREDENTIALS.');
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
