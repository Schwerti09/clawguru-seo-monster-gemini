/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deine bestehenden Einstellungen (z.B. reactStrictMode, images, etc.)
  productionBrowserSourceMaps: true, // Erzwingt Source Maps für den Client
  experimental: {
    serverSourceMaps: true, // Erzwingt Source Maps für Server/Edge
  },
  // Webpack-Konfiguration für Edge-Funktionen (Middleware)
  webpack: (config, { isServer, dev }) => {
    // Nur für Produktions-Builds und nicht für den Server (betrifft Edge)
    if (!dev && !isServer) {
      config.devtool = 'source-map';
    }
    return config;
  },
};

module.exports = nextConfig;