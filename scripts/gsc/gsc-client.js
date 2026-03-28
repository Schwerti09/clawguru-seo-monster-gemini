const {google} = require('googleapis');

async function createAuth(serviceAccountJson) {
  const key = typeof serviceAccountJson === 'string' ? JSON.parse(serviceAccountJson) : serviceAccountJson;
  const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/webmasters.readonly']
  );
  await jwtClient.authorize();
  return jwtClient;
}

async function fetchQueryMetrics({ serviceAccountJson, siteUrl, startDate, endDate, rowLimit = 25000 }) {
  const auth = await createAuth(serviceAccountJson);
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const body = {
    startDate,
    endDate,
    dimensions: ['query'],
    rowLimit,
  };

  const res = await searchconsole.searchanalytics.query({ siteUrl, requestBody: body });
  const rows = (res.data && res.data.rows) || [];
  return rows.map(r => ({
    keys: r.keys || [],
    clicks: r.clicks || 0,
    impressions: r.impressions || 0,
    ctr: r.ctr || 0,
    position: r.position || 0,
  }));
}

module.exports = { fetchQueryMetrics };
