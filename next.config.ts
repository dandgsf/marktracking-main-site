import type { NextConfig } from "next";

/**
 * MARKTRACKING — Next.js Config Hardened
 * Security-first configuration with enterprise-grade headers
 */

const nextConfig: NextConfig = {
  // ── Images ───────────────────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ── Headers ──────────────────────────────────────────────────────────────
  async headers() {
    const isProd = process.env.NODE_ENV === "production";

    const securityHeaders = [
      // Prevent clickjacking
      { key: "X-Frame-Options", value: "DENY" },
      // Prevent MIME type sniffing
      { key: "X-Content-Type-Options", value: "nosniff" },
      // XSS protection (legacy browsers)
      { key: "X-XSS-Protection", value: "1; mode=block" },
      // Referrer policy
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      // Permissions policy (restrict browser APIs)
      {
        key: "Permissions-Policy",
        value: [
          "accelerometer=()",
          "camera=()",
          "geolocation=()",
          "gyroscope=()",
          "magnetometer=()",
          "microphone=()",
          "payment=()",
          "usb=()",
          "interest-cohort=()",
        ].join(", "),
      },
      // HSTS (only in production)
      ...(isProd
        ? [
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
          ]
        : []),
      // Content Security Policy
      // Note: 'unsafe-eval' required for Three.js (wasm/GLSL compilation)
      // 'unsafe-inline' in style-src required for Tailwind v4 runtime
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
          "script-src-elem 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          "style-src-elem 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self'",
          "connect-src 'self'",
          "media-src 'self'",
          "object-src 'none'",
          "frame-src 'none'",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "upgrade-insecure-requests",
        ].join("; "),
      },
      // Cross-Origin policies
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
      { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
    ];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Cache static assets aggressively
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // ── Compression ──────────────────────────────────────────────────────────
  compress: true,

  // ── Powered by header ────────────────────────────────────────────────────
  poweredByHeader: false,

  // ── React Strict Mode ────────────────────────────────────────────────────
  reactStrictMode: true,

  // ── Experimental (Next.js 16) ────────────────────────────────────────────
  experimental: {
    // Optimize package imports for faster builds
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@react-three/fiber",
      "@react-three/drei",
    ],
    // Server Actions config
    serverActions: {
      bodySizeLimit: "1mb",
    },
  },
};

export default nextConfig;
