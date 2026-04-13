import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// 📝 BLOG API (Read-Only) - For Public Frontend
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const featured = searchParams.get('featured')

        const where = { published: true }

        if (category && category !== 'all') {
            where.category = category.toUpperCase()
        }

        if (featured === 'true') {
            where.featured = true
        }

        const blogs = await prisma.blog.findMany({
            where,
            orderBy: { publishedAt: 'desc' },
            select: {
                id: true,
                titleEn: true,
                titleAr: true,
                slug: true,
                excerptEn: true,
                excerptAr: true,
                contentEn: true,
                contentAr: true,
                coverImage: true,
                category: true,
                tags: true,
                featured: true,
                publishedAt: true,
                viewsCount: true,
                commentsCount: true,
                author: {
                    select: {
                        id: true,
                        nameAr: true,
                        nameEn: true,
                        avatar: true,
                        titleAr: true,
                        titleEn: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            data: blogs
        })
    } catch (error) {
        console.error('Error fetching blogs:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch blogs' },
            { status: 500 }
        )
    }
}
