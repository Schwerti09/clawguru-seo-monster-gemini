import { NextResponse } from "next/server";

export async function GET() {
  const base = "https://clawguru.org";
  const today = new Date().toISOString().split("T")[0];

  const sitemaps = [
    "main",
    "providers",
    "runbooks-a-f",
    "runbooks-g-l",
    "runbooks-m-r",
    "runbooks-s-z",
    "tags-a-f",
    "tags-g-l",
    "tags-m-r",
    "tags-s-z",
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(name => `  <sitemap>
    <loc>${base}/sitemaps/${name}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
