const https = require('https');
const req = https.request({
  hostname: 'clawguru.org',
  path: '/api/geo/city-ranking?forceRefresh=1&limit=150',
  method: 'GET',
  timeout: 40000
}, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const json = JSON.parse(data);
    const all = json.cities || [];
    const healthy = all.filter(c => c.healthy).length;
    console.log('Total:', json.totalCities, '| Healthy:', healthy, '| durationMs:', json.durationMs);
    ['US','IN','RU','CN','DE'].forEach(cc => {
      const sub = all.filter(c => c.country_code === cc);
      const h = sub.filter(c => c.healthy).length;
      if (sub.length) console.log(cc + ':', sub.length, 'cities,', h, 'healthy');
    });
  });
});
req.on('error', e => console.log('ERR:', e.message));
req.end();
