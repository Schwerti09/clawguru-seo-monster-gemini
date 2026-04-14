// ---------------------------------------------------------------------------
// Build-time environment defaults — keeps Netlify Functions under 4 KB env
// limit by inlining non-secret config values into the webpack bundle.
// Platform env vars (Vercel / Netlify dashboard) always take precedence.
// At runtime, instrumentation.ts patches process.env with the same defaults.
// ---------------------------------------------------------------------------
const envDefaults = require("./config/env-defaults.json");

/** Build the `env` map: for each default, use the current process.env value
 *  if set (so platform overrides work), otherwise use the coded default. */
const envMap = {};
for (const [key, value] of Object.entries(envDefaults)) {
  if (key.startsWith("_")) continue; // skip JSON comments
  envMap[key] = process.env[key] || value;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Inline non-secret defaults at build time (DefinePlugin).
  // Secrets are NOT listed here — they come from runtime env vars only.
  env: envMap,
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
    const securityHeaders = [
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data:",
          "connect-src 'self' https: wss:",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; "),
      },
    ]
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ]
  },
  experimental: {
    // Enable instrumentation.ts for runtime env-default patching.
    // Stable in Next.js 14.0+; the flag is a no-op there but harmless.
    instrumentationHook: true,
    // Limit parallel page generation to reduce peak memory usage during build.
    // Vercel/Netlify have ~8GB available.
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
