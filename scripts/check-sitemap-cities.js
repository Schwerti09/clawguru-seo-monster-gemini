const https = require('https');
https.request({
  hostname: 'clawguru.org',
  path: '/sitemaps/geo-runbooks-de',
  method: 'GET', timeout: 20000
}, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const matches = (data.match(/runbook\/[^<"]+/g) || []).filter((v,i,a) => a.indexOf(v)===i);
    const cities = ['beijing','shanghai','losangeles','chicago','mumbai','delhi','moscow','bangalore','guangzhou','shenzhen'];
    const found = cities.filter(c => data.includes(c));
    const notFound = cities.filter(c => !data.includes(c));
    console.log('Total unique URLs:', matches.length);
    console.log('New cities FOUND:', found.join(', ') || 'NONE');
    console.log('New cities MISSING:', notFound.join(', ') || 'NONE');
    console.log('Sample:', matches.slice(0,2).join(' | '));
  });
}).on('error', e => console.log('ERR:', e.message)).end();
