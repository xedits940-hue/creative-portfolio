import type { NextConfig } from "next";

export default function nextConfig(): NextConfig {
  return {
    devIndicators: false,
    compress: true,
    poweredByHeader: false,
    httpAgentOptions: {
      keepAlive: true,
    },
    images: {
      formats: ["image/avif", "image/webp"],
      minimumCacheTTL: 31536000,
      remotePatterns: [
        {
          protocol: "https",
          hostname: "images.unsplash.com",
        },
        {
          protocol: "https",
          hostname: "framerusercontent.com",
        },
        {
          protocol: "https",
          hostname: "avatar.vercel.sh",
        },
        {
          protocol: "https",
          hostname: "vumbnail.com",
        },
        {
          protocol: "https",
          hostname: "media.giphy.com",
        },
        {
          protocol: "https",
          hostname: "picsum.photos",
        },
        {
          protocol: "https",
          hostname: "ik.imagekit.io",
        },
        {
          protocol: "https",
          hostname: "images.higgs.ai",
        },
        {
          protocol: "https",
          hostname: "d8j0ntlcm91z4.cloudfront.net",
        },
      ],
    },
    async headers() {
      return [
        {
          source: "/:all*(svg|jpg|png|webp|avif|mp4|ttf|woff2)",
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: "*",
            },
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        {
          source: "/:path*",
          headers: [
            {
              key: "X-DNS-Prefetch-Control",
              value: "on",
            },
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "X-XSS-Protection",
              value: "1; mode=block",
            },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
            {
              key: "Permissions-Policy",
              value: "camera=(), microphone=(), geolocation=()",
            },
          ],
        },
      ];
    },
  };
}
