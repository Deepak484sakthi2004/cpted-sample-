import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudflare R2 public bucket URL (covers both r2.dev preview URLs and custom CDN domains)
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "pub-*.r2.dev" },
      // Add your custom CDN domain here once configured, e.g.:
      // { protocol: "https", hostname: "cdn.cptedindia.com" },

      // Allow any other HTTPS source for course thumbnails set by admin
      { protocol: "https", hostname: "**" },
    ],
    // Local /public/uploads/ is served as static — no remotePattern needed
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
