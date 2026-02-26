/** @type {import('next').NextConfig} */

// 100/100 OPTIMIZATION 2026: Security headers for Best Practices score
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://generativelanguage.googleapis.com https://api.stripe.com https://checkout.stripe.com",
      "frame-src https://checkout.stripe.com https://js.stripe.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
]

const nextConfig = {
  reactStrictMode: true,
  // 100/100 OPTIMIZATION 2026: Security & performance headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/sitemaps/:name.xml",
        destination: "/sitemaps/:name",
      },
    ]
  },
}
module.exports = nextConfig
