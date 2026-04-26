// Google Search Console Reporting Script
// Holt indexierte Runbooks + Traffic-Daten und speichert sie als JSON
// Voraussetzungen: Service Account JSON, Zugriff auf GSC API, Node.js >=18

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// === KONFIGURATION ===
const SITE_URL = 'https://clawguru.org'; // Property in GSC
const START_DATE = '2026-04-01'; // Startdatum für den Report
const END_DATE = new Date().toISOString().slice(0, 10); // Heute
const OUTPUT_PATH = path.join(__dirname, '../data/gsc-runbook-report.json');
const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];
const KEYFILE = process.env.GSC_KEYFILE || path.join(__dirname, '../gsc-service-account.json');

async function main() {
  // Authentifizierung
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILE,
    scopes: SCOPES,
  });
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  // Query: Alle Seiten mit /runbook/ im Pfad
  const request = {
    siteUrl: SITE_URL,
    requestBody: {
      startDate: START_DATE,
      endDate: END_DATE,
      dimensions: ['page'],
      dimensionFilterGroups: [{
        filters: [{
          dimension: 'page',
          operator: 'contains',
          expression: '/runbook/'
        }]
      }],
      rowLimit: 5000,
    },
  };

  const res = await searchconsole.searchanalytics.query(request);
  const rows = res.data.rows || [];
  const result = rows.map(r => ({
    url: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify({
    generated: new Date().toISOString(),
    site: SITE_URL,
    start: START_DATE,
    end: END_DATE,
    count: result.length,
    runbooks: result,
  }, null, 2));
  console.log(`GSC-Report gespeichert: ${OUTPUT_PATH} (${result.length} Runbooks)`);
}

main().catch(e => {
  console.error('Fehler beim Abrufen der GSC-Daten:', e.message);
  process.exit(1);
});
