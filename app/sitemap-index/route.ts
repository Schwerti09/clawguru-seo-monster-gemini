import { NextResponse } from 'next/server';

const BASE_URL = 'https://clawguru.org';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const subSitemaps = [
    { loc: `${BASE_URL}/sitemap/runbooks.xml`, lastmod: today },
    { loc: `${BASE_URL}/sitemap/providers.xml`, lastmod: today },
    { loc: `${BASE_URL}/sitemap/tags.xml`, lastmod: today },
    { loc: `${BASE_URL}/sitemap/solutions.xml`, lastmod: today },
    { loc: `${BASE_URL}/sitemap/cves.xml`, lastmod: today },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${subSitemaps.map(s => `
    <sitemap>
      <loc>${s.loc}</loc>
      <lastmod>${s.lastmod}</lastmod>
    </sitemap>
  `).join('')}
</sitemapindex>`;

  return new NextResponse(xml.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
