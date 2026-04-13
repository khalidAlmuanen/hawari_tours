import { prisma } from '@/lib/prisma'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hawari.tours'

const staticPaths = [
  '/',
  '/tours',
  '/destinations',
  '/travel-guide',
  '/gallery',
  '/news',
  '/blog',
  '/about',
  '/contact',
  '/history',
  '/packages',
  '/testimonials',
  '/unique-features',
  '/reports'
]

export default async function sitemap() {
  const now = new Date()
  const staticEntries = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7
  }))

  try {
    const [tours, destinations, news, blogs] = await Promise.all([
      prisma.tour.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.destination.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.news.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.blog.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })
    ])

    const tourEntries = tours.map((item) => ({
      url: `${siteUrl}/tours/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8
    }))

    const destinationEntries = destinations.map((item) => ({
      url: `${siteUrl}/destinations/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8
    }))

    const newsEntries = news.map((item) => ({
      url: `${siteUrl}/news/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6
    }))

    const blogEntries = blogs.map((item) => ({
      url: `${siteUrl}/blog/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6
    }))

    return [...staticEntries, ...tourEntries, ...destinationEntries, ...newsEntries, ...blogEntries]
  } catch {
    return staticEntries
  }
}
