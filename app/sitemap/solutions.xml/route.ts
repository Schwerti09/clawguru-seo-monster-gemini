import { NextResponse } from 'next/server';

import { BASE_URL } from '@/lib/config';
import { KNOWN_CVES } from '@/lib/cve-pseo';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

const SITEMAP_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600',
} as const;

export async function GET() {
  const lastmodFallback = isoDate();

  const urls = SUPPORTED_LOCALES.flatMap((locale) =>
    KNOWN_CVES.map((cve) => ({
      loc: `${BASE_URL}/${locale}/solutions/fix-${cve.cveId}`,
      lastmod: cve.publishedDate || lastmodFallback,
    }))
  );

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n` +
          `    <loc>${u.loc}</loc>\n` +
          `    <lastmod>${u.lastmod}</lastmod>\n` +
          `  </url>`
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new NextResponse(xml, {
    status: 200,
    headers: SITEMAP_HEADERS,
  });
}
