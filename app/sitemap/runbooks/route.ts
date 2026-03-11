import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clawguru.org';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/de/runbook/ssh-hardening</loc><lastmod>2026-03-11</lastmod></url>
  <url><loc>${baseUrl}/de/runbook/nginx-security</loc><lastmod>2026-03-11</lastmod></url>
  <url><loc>${baseUrl}/de/runbook/docker-firewall</loc><lastmod>2026-03-11</lastmod></url>
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
