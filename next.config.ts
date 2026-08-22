import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  serverExternalPackages: ["sharp"],
  outputFileTracingIncludes: {
    "/api/download": [
      "./public/images/3cf63eb8-3338-46e3-9d8b-2d08d775ed4c.jpg",
      "./public/images/gen-41-yellow-34.jpg",
      "./public/images/gen-42-yellow-sit.jpg",
      "./public/images/gen-43-yellow-hip.jpg",
      "./public/images/gen-44-yellow-walk.jpg",
      "./public/images/gen-45-yellow-lookback.jpg",
    ],
  },
};

export default nextConfig;
