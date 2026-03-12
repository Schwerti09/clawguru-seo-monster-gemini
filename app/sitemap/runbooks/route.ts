import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clawguru.org';
  const lastmod = new Date().toISOString().slice(0, 10);

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <sitemap>\n` +
    `    <loc>${baseUrl}/sitemap/runbooks.xml</loc>\n` +
    `    <lastmod>${lastmod}</lastmod>\n` +
    `  </sitemap>\n` +
    `</sitemapindex>\n`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
