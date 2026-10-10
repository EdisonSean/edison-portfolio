import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/p/bc",
        destination:
          "/api/track-click?campaign=buildersclub_20261010&recipient=BuildersClub&token=bc01&target=portfolio&url=https%3A%2F%2Fedisonfx.art%2F",
      },
      {
        source: "/p/t",
        destination:
          "/api/track-click?campaign=tendril_20261010&recipient=Tendril&token=td01&target=portfolio&url=https%3A%2F%2Fedisonfx.art%2F",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/works/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
      {
        source: "/lab/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
