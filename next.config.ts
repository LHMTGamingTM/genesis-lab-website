import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["26.190.235.61"], // Mở khóa cho IP mạng ảo của bạn

  // Không để lỗi cấu hình ESLint chặn việc deploy (trang web vẫn được kiểm tra kiểu TypeScript)
  eslint: { ignoreDuringBuilds: true },

  async headers() {
    return [
      {
        source: "/models/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;