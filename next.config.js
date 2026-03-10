/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    isrFlushToDisk: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
module.exports = {
  // ... andere Konfigurationen
  productionBrowserSourceMaps: true, // für Client-seitigen Code (optional)
  experimental: {
    serverSourceMaps: true, // **wichtig**: aktiviert Source Maps für Server/Edge-Funktionen
  },
}