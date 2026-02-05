/** @type {import('next').NextConfig} */
const nextConfig = {
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
