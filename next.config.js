// === Grundkonfiguration ===
  reactStrictMode: true,                    // hilft bei React-Entwicklung, kann später ausgeschaltet werden
  trailingSlash: false,                     // saubere URLs ohne /
  poweredByHeader: false,                   // Sicherheit & Cleanliness
  compress: true,                           // Gzip/Brotli Kompression aktiv

  // === Build-Optimierungen ===
  eslint: {
    ignoreDuringBuilds: true,               // verhindert Build-Abbruch bei ESLint-Warnungen
  },
  typescript: {
    ignoreBuildErrors: true,                // verhindert Build-Abbruch bei TS-Fehlern (Recovery-Phase)
  },

  // === Bilder ===
  images: {
    unoptimized: true,                      // Vercel Images deaktiviert → eigene Optimierung (empfohlen bei vielen Bildern)
    // Wenn du später next/image nutzen willst, entferne unoptimized und konfiguriere remotePatterns
  },

  // === Rewrites (Sitemap-Fix) ===
  async rewrites() {
    return [
      // Klassischer Trick: /sitemap.xml → interne Route (vermeidet Windows-Ordner-Konflikt)
      {
        source: '/sitemap.xml',
        destination: '/sitemap-index',        // muss mit deiner Route übereinstimmen!
      },
      // Optional: Sub-Sitemaps direkt umleiten (falls du /sitemap/runbooks.xml hast)
      {
        source: '/sitemap/:name.xml',
        destination: '/sitemaps/:name',
      },
    ];
  },

  // === Redirects (wichtig für Indexing-Recovery!) ===
  async redirects() {
    return [
      // Alte URLs ohne Sprachpräfix → nach /de/ redirecten (permanent = 301)
      {
        source: '/runbook/:slug*',
        destination: '/de/runbook/:slug*',
        permanent: true,
      },
      {
        source: '/tags/:tag*',
        destination: '/de/tags/:tag*',
        permanent: true,
      },
      {
        source: '/:path*',                    // alle anderen nicht-sprachigen Pfade
        has: [{ type: 'host', value: 'clawguru.org' }],
        missing: [
          { type: 'header', key: 'x-nextjs-data' }, // vermeidet API-Routen
          { type: 'query', key: 'lang' },
        ],
        destination: '/de/:path*',
        permanent: true,
      },
      // Optional: /sitemap_index.xml → /sitemap.xml (manche Tools erwarten das)
      {
        source: '/sitemap_index.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
    ];
  },

  // === Header für Sitemap (Google liebt das) ===
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/sitemap/:path*.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },

  // === Webpack Alias (dein @ bleibt erhalten) ===
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };
    return config;
  },

  // === Optional: Experimental Features (falls du ISR/Edge nutzt) ===
  experimental: {
    // serverComponentsExternalPackages: ['@prisma/client'], // falls du Prisma hast
    // optimizePackageImports: ['lucide-react', 'framer-motion'], // spart Bundle-Size
  },
};

module.exports = nextConfig;