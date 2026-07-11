import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NEXT_PUBLIC_BACKEND_URL and NEXT_PUBLIC_APP_URL are set per-environment:
  // - Development: .env.local (http://localhost:5000)
  // - Production:  Vercel environment variables dashboard
  // Do NOT hardcode them here — next.config.ts env overrides ALL .env files.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;

