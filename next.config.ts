import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bake public (non-secret) URLs into the build so they work on Vercel
  // without needing manual environment variable configuration.
  env: {
    NEXT_PUBLIC_BACKEND_URL: "https://skillbridgebackend-production-19ba.up.railway.app",
    NEXT_PUBLIC_APP_URL: "https://skill-bridge-client-pi.vercel.app",
  },
};

export default nextConfig;
