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
  transpilePackages: ['@prisma/client'],
};

export default nextConfig;
