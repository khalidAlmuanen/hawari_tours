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
            orderBy: [
                { publishedAt: 'desc' },
                { createdAt: 'desc' }
            ],
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
                featured: true,
                publishedAt: true,
                createdAt: true,
                viewsCount: true,
                commentsCount: true,
                // ✅ Tags via correct junction table
                BlogToBlogTag: {
                    select: {
                        blog_tags: {
                            select: {
                                id: true,
                                nameEn: true,
                                nameAr: true,
                                slug: true
                            }
                        }
                    }
                },
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

        // Map tags for clean frontend response
        const mapped = blogs.map(b => ({
            ...b,
            tags: b.BlogToBlogTag?.map(bt => bt.blog_tags) || [],
            BlogToBlogTag: undefined
        }))

        return NextResponse.json({
            success: true,
            data: mapped
        })
    } catch (error) {
        console.error('Error fetching public blogs:', {
            message: error.message,
            code: error.code
        })
        return NextResponse.json(
            { success: false, error: 'Failed to fetch blogs', details: error.message },
            { status: 500 }
        )
    }
}
