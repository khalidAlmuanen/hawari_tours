import prisma from '@/lib/prisma'
import BlogPostClient from './BlogPostClient'
import { notFound } from 'next/navigation'

// ═══════════════════════════════════════════════════════════════
// 📄 BLOG POST PAGE (Server Component) - Ultra Professional
// صفحة المقال (سيرفر) - لتحسين محركات البحث SEO
// ═══════════════════════════════════════════════════════════════

async function getPost(slug) {
    const post = await prisma.blog.findUnique({
        where: { slug, published: true },
        include: {
            author: { select: { id: true, nameAr: true, nameEn: true, avatar: true, titleAr: true, titleEn: true, bioAr: true, bioEn: true } },
            tags: true
        }
    })

    if (!post) return null

    // Fetch related posts
    const related = await prisma.blog.findMany({
        where: {
            category: post.category,
            id: { not: post.id },
            published: true
        },
        take: 3,
        orderBy: { publishedAt: 'desc' },
        select: {
            id: true,
            titleEn: true,
            titleAr: true,
            slug: true,
            coverImage: true,
            publishedAt: true
        }
    })

    return { ...post, relatedPosts: related }
}

export async function generateMetadata({ params }) {
    const post = await getPost(params.slug)
    if (!post) return {}

    return {
        title: post.metaTitle || post.titleEn,
        description: post.metaDescription || post.excerptEn,
        openGraph: {
            title: post.metaTitle || post.titleEn,
            description: post.metaDescription || post.excerptEn,
            images: post.coverImage ? [post.coverImage] : [],
        },
        keywords: post.keywords
    }
}

export default async function Page({ params }) {
    const post = await getPost(params.slug)

    if (!post) {
        notFound()
    }

    return <BlogPostClient initialPost={post} />
}
