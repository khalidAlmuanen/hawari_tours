const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hawari.tours'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/login', '/register', '/profile', '/maintenance']
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  }
}
