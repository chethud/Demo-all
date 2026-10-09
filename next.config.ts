import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  // Hide the Next.js floating Dev Tools / portal overlay in local preview
  devIndicators: false,
};

export default nextConfig;
