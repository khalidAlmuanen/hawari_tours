/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ═══════════════════════════════════════════════════════════════
  // Image Optimization Configuration
  // ═══════════════════════════════════════════════════════════════
  images: {
    // Allowed domains for external images
    domains: [
      'images.unsplash.com',
      'images.pexels.com',
      'cdn.pixabay.com',
      'img.youtube.com', // For YouTube thumbnails
    ],

    // Modern image formats
    formats: ['image/webp', 'image/avif'],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for srcset
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Image quality settings
    minimumCacheTTL: 60,
    
    // Disable static imports if needed
    // dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ═══════════════════════════════════════════════════════════════
  // Security Headers
  // ═══════════════════════════════════════════════════════════════
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // Trailing Slash (optional)
  // ═══════════════════════════════════════════════════════════════
  // trailingSlash: false,

  // ═══════════════════════════════════════════════════════════════
  // Environment Variables (if needed)
  // ═══════════════════════════════════════════════════════════════
  // env: {
  //   NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  // },
}

module.exports = nextConfig