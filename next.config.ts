import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Dev server only: lets other devices on the local network (and ngrok tunnels)
  // load hot-reload and dev scripts. Has no effect on the production build.
  allowedDevOrigins: ["192.168.*.*", "*.ngrok-free.app"],
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Public "media" bucket in Supabase Storage (CMS images)
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  // Routes from the first version of the site
  async redirects() {
    return [
      { source: "/cookie-policy", destination: "/cookies", permanent: true },
      { source: "/refund-policy", destination: "/refunds", permanent: true },
      { source: "/library", destination: "/templates", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
