import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clawguru.org';

  const slugs = ['ssh-hardening', 'nginx-security', 'docker-firewall', 'fail2ban-setup', 'prometheus-rate-limit-baseline'];

  const locales = ['de', 'en', 'fr', 'es', 'it', 'nl', 'pl', 'ru', 'zh', 'ja'];

  const entries = locales.flatMap(locale =>
    slugs.map(slug => ({
      url: `${baseUrl}/${locale}/runbook/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
