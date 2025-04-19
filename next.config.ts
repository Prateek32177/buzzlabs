import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' va.vercel-scripts.com; " +
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com fonts.gstatic.com; " +
              "img-src 'self' data: api.dicebear.com; " +
              "font-src 'self' fonts.gstatic.com; " +
              "object-src 'none'; " +
              "frame-ancestors 'none'; " +
              "base-uri 'self';",
          },
        ],
      },
    ];
  },
};
