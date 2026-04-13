import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// ═══════════════════════════════════════════════════════════════
// 📝 BLOG MANAGEMENT API - Full CRUD
// ═══════════════════════════════════════════════════════════════

// GET - Fetch all blog posts
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const published = searchParams.get('published')

        const where = {}
        if (category && category !== 'ALL') {
            where.category = category
        }
        if (published !== null && published !== undefined) {
            where.published = published === 'true'
        }

        const blogs = await prisma.blog.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ success: true, data: blogs })
    } catch (error) {
        console.error('Error fetching blogs:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch blogs' },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const data = await request.json()

        // Basic Validation
        if (!data.titleEn || !data.titleAr || !data.contentEn || !data.contentAr) {
            return NextResponse.json(
                { success: false, error: 'Required fields missing' },
                { status: 400 }
            )
        }

        // Generate slug from English title
        let slug = data.titleEn.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')

        // Ensure slug uniqueness
        let uniqueSlug = slug
        let counter = 1
        while (await prisma.blog.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${counter}`
            counter++
        }

        // Prepare Relations
        const tagsConnect = data.selectedTags?.map(id => ({ id })) || []

        const blog = await prisma.blog.create({
            data: {
                titleEn: data.titleEn,
                titleAr: data.titleAr,
                slug: uniqueSlug,
                excerptEn: data.excerptEn,
                excerptAr: data.excerptAr,
                contentEn: data.contentEn,
                contentAr: data.contentAr,
                coverImage: data.coverImage,
                category: data.category,
                // Relations
                author: data.authorId ? { connect: { id: data.authorId } } : undefined,
                tags: { connect: tagsConnect },

                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                keywords: data.keywords || [],
                published: data.published || false,
                featured: data.featured || false,
                publishedAt: data.published ? new Date() : null
            }
        })

        return NextResponse.json({ success: true, data: blog })
    } catch (error) {
        console.error('Error creating blog:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create blog' },
            { status: 500 }
        )
    }
}

export async function PUT(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const data = await request.json()

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Blog ID is required' },
                { status: 400 }
            )
        }

        // Prepare Relations
        const tagsConnect = data.selectedTags?.map(id => ({ id })) || []

        const blog = await prisma.blog.update({
            where: { id },
            data: {
                titleEn: data.titleEn,
                titleAr: data.titleAr,
                excerptEn: data.excerptEn,
                excerptAr: data.excerptAr,
                contentEn: data.contentEn,
                contentAr: data.contentAr,
                coverImage: data.coverImage,
                category: data.category,
                // Relations
                author: data.authorId ? { connect: { id: data.authorId } } : { disconnect: true },
                tags: { set: tagsConnect }, // Replace all tags

                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                keywords: data.keywords || [],
                published: data.published,
                featured: data.featured,
                // Update publishedAt if it's being published for the first time? 
                // Alternatively, just keep original date. Strict "publishedAt" usually implies first publish. 
                // We'll leave it as is for now unless explicitly requested.
            }
        })

        return NextResponse.json({ success: true, data: blog })
    } catch (error) {
        console.error('Error updating blog:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update blog' },
            { status: 500 }
        )
    }
}

// DELETE - Delete blog post
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Blog ID is required' },
                { status: 400 }
            )
        }

        await prisma.blog.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: 'Blog post deleted successfully' })
    } catch (error) {
        console.error('Error deleting blog:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete blog post' },
            { status: 500 }
        )
    }
}
