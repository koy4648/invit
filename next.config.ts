import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudflare R2 퍼블릭 도메인
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      // 커스텀 R2 도메인 (설정 시 아래 주석 해제)
      // {
      //   protocol: "https",
      //   hostname: "photos.yourdomain.com",
      // },
    ],
    // 이미지 최적화 포맷
    formats: ["image/avif", "image/webp"],
  },

  // 보안 헤더 설정
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // API Route 캐시 비활성화
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
