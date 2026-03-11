import { NextResponse } from 'next/server';

const BASE_URL = 'https://clawguru.org';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const testUrls = [
    { loc: `${BASE_URL}/`, lastmod: today, priority: '1.0' },
    { loc: `${BASE_URL}/de/runbook/ssh-hardening`, lastmod: today, priority: '0.9' },
    { loc: `${BASE_URL}/de/runbook/hetzner-firewall-baseline`, lastmod: today, priority: '0.8' },
    { loc: `${BASE_URL}/de/runbook/contabo-hardening`, lastmod: today, priority: '0.8' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${testUrls.map(u => `
    <url>
      <loc>${u.loc}</loc>
      <lastmod>${u.lastmod}</lastmod>
      <priority>${u.priority}</priority>
    </url>
  `).join('')}
</urlset>`;

  return new NextResponse(xml.trim(), {
    status: 200,
    headers: { 'Content-Type': 'application/xml' },
  });
}
