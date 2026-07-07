import type { NextConfig } from "next";
import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  transpilePackages: ['recharts'],

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      {
        protocol: "http",
        hostname: "192.168.29.231",
        port: "3000",
        pathname: "/**",
      },
    ],
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
};

// ✅ PWA CONFIG (ONLY FOR PRODUCTION)
const pwa = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev, // 👈 important: disable in development
  buildExcludes: [/middleware-manifest\.json$/],
});

export default isDev
  ? nextConfig
  : (pwa(nextConfig as any) as NextConfig);
