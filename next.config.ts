import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function nextConfig(phase: string): NextConfig {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    distDir: isDev ? ".next-dev" : ".next",
    images: {
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
  };
}
