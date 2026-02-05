import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.kzero.com",
      },
    ],
  },
};

export default nextConfig;
