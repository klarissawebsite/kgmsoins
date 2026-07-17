// Baseline security headers (the marketing site has no CSP nonce/middleware, so
// no strict CSP here — a CSP would risk breaking the Three.js/WebGL + inline
// styles. These headers are safe to cache statically).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  // Image Optimization server isn't needed (plain <img> / 3D canvases).
  images: { unoptimized: true },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // NOTE: previously `output: "export"` + `trailingSlash` (fully static, for
  // Cloudflare Pages). The per-prospect preview route /preview/[token] renders
  // on demand (server fetch + ISR), so the app now needs a Node/SSR host
  // (e.g. Vercel). The static marketing homepage is still statically generated.
};

export default nextConfig;
