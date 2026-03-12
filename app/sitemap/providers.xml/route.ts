import { NextResponse } from 'next/server';

import { BASE_URL } from '@/lib/config';
import { allProviders } from '@/lib/pseo';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

const SITEMAP_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600',
} as const;

export async function GET() {
  const lastmod = isoDate();
  const providers = allProviders();

  const urls = SUPPORTED_LOCALES.flatMap((locale) =>
    providers.map((p) => ({
      loc: `${BASE_URL}/${locale}/provider/${p.slug}`,
      lastmod,
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
