/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "sushivkus.ru", pathname: "/photo/**" },
      { protocol: "https", hostname: "api.sushivkus.ru", pathname: "/photo/**" },
    ],
    deviceSizes: [360, 640, 828, 1080, 1200, 1920],
    imageSizes: [96, 128, 169, 200, 256, 384],
    minimumCacheTTL: 86400,
  },
  compress: true,
};

module.exports = nextConfig;
