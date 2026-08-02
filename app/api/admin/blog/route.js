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
            orderBy: { createdAt: 'desc' },
            include: {
                BlogToBlogTag: {
                    include: { blog_tags: true }
                },
                author: true
            }
        })

        // Map tags for frontend
        const mapped = blogs.map(b => ({
            ...b,
            tags: b.BlogToBlogTag?.map(bt => bt.blog_tags) || []
        }))

        return NextResponse.json({ success: true, data: mapped })
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
                { success: false, error: 'Required fields missing: titleEn, titleAr, contentEn, contentAr' },
                { status: 400 }
            )
        }

        // Generate slug from English title
        let slug = data.titleEn.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 100)

        if (!slug) slug = 'blog-' + Date.now()

        // Ensure slug uniqueness
        let uniqueSlug = slug
        let counter = 1
        while (await prisma.blog.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${counter}`
            counter++
        }

        // Create blog WITHOUT tags first
        const blog = await prisma.blog.create({
            data: {
                titleEn: data.titleEn.trim(),
                titleAr: data.titleAr.trim(),
                slug: uniqueSlug,
                excerptEn: (data.excerptEn || '').trim(),
                excerptAr: (data.excerptAr || '').trim(),
                contentEn: data.contentEn,
                contentAr: data.contentAr,
                coverImage: data.coverImage || null,
                category: data.category || 'CULTURE',
                // Author relation (optional)
                ...(data.authorId && data.authorId !== ''
                    ? { author: { connect: { id: data.authorId } } }
                    : {}),
                metaTitle: data.metaTitle || null,
                metaDescription: data.metaDescription || null,
                keywords: data.keywords || [],
                published: data.published || false,
                featured: data.featured || false,
                publishedAt: data.published ? new Date() : null
            }
        })

        // Handle tags separately via BlogToBlogTag junction table
        const selectedTags = data.selectedTags || []
        if (selectedTags.length > 0) {
            await prisma.blogToBlogTag.createMany({
                data: selectedTags.map(tagId => ({
                    A: blog.id,
                    B: tagId
                })),
                skipDuplicates: true
            })
        }

        return NextResponse.json({ success: true, data: blog })
    } catch (error) {
        console.error('Error creating blog - Full details:', {
            message: error.message,
            code: error.code,
            meta: error.meta
        })
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create blog',
                details: error.message,
                code: error.code
            },
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

        // Update blog WITHOUT tags
        const blog = await prisma.blog.update({
            where: { id },
            data: {
                titleEn: data.titleEn,
                titleAr: data.titleAr,
                excerptEn: (data.excerptEn || '').trim(),
                excerptAr: (data.excerptAr || '').trim(),
                contentEn: data.contentEn,
                contentAr: data.contentAr,
                coverImage: data.coverImage || null,
                category: data.category,
                // Author relation
                ...(data.authorId && data.authorId !== ''
                    ? { author: { connect: { id: data.authorId } } }
                    : { author: { disconnect: true } }),
                metaTitle: data.metaTitle || null,
                metaDescription: data.metaDescription || null,
                keywords: data.keywords || [],
                published: data.published,
                featured: data.featured,
                publishedAt: data.published ? new Date() : null
            }
        })

        // Update tags: delete old ones, insert new ones
        const selectedTags = data.selectedTags || []
        await prisma.blogToBlogTag.deleteMany({ where: { A: id } })
        if (selectedTags.length > 0) {
            await prisma.blogToBlogTag.createMany({
                data: selectedTags.map(tagId => ({
                    A: id,
                    B: tagId
                })),
                skipDuplicates: true
            })
        }

        return NextResponse.json({ success: true, data: blog })
    } catch (error) {
        console.error('Error updating blog:', {
            message: error.message,
            code: error.code,
            meta: error.meta
        })
        return NextResponse.json(
            { success: false, error: 'Failed to update blog', details: error.message },
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

        // Delete tags first (junction table)
        await prisma.blogToBlogTag.deleteMany({ where: { A: id } })

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
