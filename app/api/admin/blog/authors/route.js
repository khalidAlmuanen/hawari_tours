
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// ═══════════════════════════════════════════════════════════════
// 👥 BLOG AUTHORS API
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
    try {
        const authors = await prisma.blogAuthor.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { blogs: true } } }
        })
        return NextResponse.json({ success: true, data: authors })
    } catch (error) {
        console.error('Error fetching authors:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch authors' },
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
        if (!data.nameAr || !data.nameEn) {
            return NextResponse.json(
                { success: false, error: 'Name (AR & EN) is required' },
                { status: 400 }
            )
        }

        const author = await prisma.blogAuthor.create({
            data: {
                nameAr: data.nameAr,
                nameEn: data.nameEn,
                titleAr: data.titleAr,
                titleEn: data.titleEn,
                bioAr: data.bioAr,
                bioEn: data.bioEn,
                avatar: data.avatar,
                socials: data.socials || {}
            }
        })

        return NextResponse.json({ success: true, data: author })
    } catch (error) {
        console.error('Error creating author:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create author' },
            { status: 500 }
        )
    }
}

export async function PUT(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const data = await request.json()

        if (!data.id) {
            return NextResponse.json(
                { success: false, error: 'Author ID is required' },
                { status: 400 }
            )
        }

        const author = await prisma.blogAuthor.update({
            where: { id: data.id },
            data: {
                nameAr: data.nameAr,
                nameEn: data.nameEn,
                titleAr: data.titleAr,
                titleEn: data.titleEn,
                bioAr: data.bioAr,
                bioEn: data.bioEn,
                avatar: data.avatar,
                socials: data.socials || {}
            }
        })

        return NextResponse.json({ success: true, data: author })
    } catch (error) {
        console.error('Error updating author:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update author' },
            { status: 500 }
        )
    }
}

export async function DELETE(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Author ID is required' },
                { status: 400 }
            )
        }

        // Check if author has blogs
        const author = await prisma.blogAuthor.findUnique({
            where: { id },
            include: { _count: { select: { blogs: true } } }
        })

        if (author && author._count.blogs > 0) {
            return NextResponse.json(
                { success: false, error: 'Cannot delete author with associated blogs' },
                { status: 400 }
            )
        }

        await prisma.blogAuthor.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting author:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete author' },
            { status: 500 }
        )
    }
}
