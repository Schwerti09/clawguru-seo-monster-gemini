/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ]
  },
  experimental: {
    // Limit parallel page generation to reduce peak memory usage during build.
    // Cloudflare Pages has ~4GB available; Vercel/Netlify have ~8GB.
    // Set to 2 for safer builds on constrained environments.
    cpus: 2,
    outputFileTracingIncludes: {
      '/api/runbooks/search': ['./public/runbooks.json'],
      '/runbooks': ['./public/runbooks.json'],
      '/\\[lang\\]/runbooks': ['./public/runbooks.json'],
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": require("path").resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;
