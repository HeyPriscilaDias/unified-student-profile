import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/student/:path*",
        destination: "/students/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
