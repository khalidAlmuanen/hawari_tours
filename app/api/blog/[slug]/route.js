import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// 📝 SINGLE BLOG API (Read-Only)
// ═══════════════════════════════════════════════════════════════

export async function GET(request, { params }) {
    try {
        const slug = params.slug

        if (!slug) {
            return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 })
        }

        // Increment view count (simple implementation, real-world would need IP check or similar)
        // We do this asynchronously without awaiting to not block the response
        prisma.blog.update({
            where: { slug },
            data: { viewsCount: { increment: 1 } }
        }).catch(e => console.error('Error incrementing view count:', e))

        const blog = await prisma.blog.findUnique({
            where: {
                slug,
                published: true
            },
            include: {
                author: {
                    select: {
                        id: true,
                        nameAr: true,
                        nameEn: true,
                        avatar: true,
                        titleAr: true,
                        titleEn: true,
                        bioAr: true,
                        bioEn: true
                    }
                },
                tags: true
            }
        })

        if (!blog) {
            return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 })
        }

        // Fetch related posts (same category, excluding current)
        const related = await prisma.blog.findMany({
            where: {
                category: blog.category,
                id: { not: blog.id },
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

        return NextResponse.json({
            success: true,
            data: {
                ...blog,
                relatedPosts: related
            }
        })
    } catch (error) {
        console.error('Error fetching blog post:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch blog post' },
            { status: 500 }
        )
    }
}
