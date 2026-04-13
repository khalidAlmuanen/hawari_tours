
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// ═══════════════════════════════════════════════════════════════
// 🏷️ BLOG TAGS API
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
    try {
        const tags = await prisma.blogTag.findMany({
            orderBy: { nameEn: 'asc' },
            include: { _count: { select: { blogs: true } } }
        })
        return NextResponse.json({ success: true, data: tags })
    } catch (error) {
        console.error('Error fetching tags:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tags' },
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
        if (!data.nameAr || !data.nameEn || !data.slug) {
            return NextResponse.json(
                { success: false, error: 'Name (AR & EN) and Slug are required' },
                { status: 400 }
            )
        }

        const tag = await prisma.blogTag.create({
            data: {
                nameAr: data.nameAr,
                nameEn: data.nameEn,
                slug: data.slug
            }
        })

        return NextResponse.json({ success: true, data: tag })
    } catch (error) {
        console.error('Error creating tag:', error)
        // Handle unique constraint violation for slug
        if (error.code === 'P2002') {
            return NextResponse.json(
                { success: false, error: 'Slug must be unique' },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { success: false, error: 'Failed to create tag' },
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
                { success: false, error: 'Tag ID is required' },
                { status: 400 }
            )
        }

        const tag = await prisma.blogTag.update({
            where: { id: data.id },
            data: {
                nameAr: data.nameAr,
                nameEn: data.nameEn,
                slug: data.slug
            }
        })

        return NextResponse.json({ success: true, data: tag })
    } catch (error) {
        console.error('Error updating tag:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update tag' },
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
                { success: false, error: 'Tag ID is required' },
                { status: 400 }
            )
        }

        await prisma.blogTag.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting tag:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete tag' },
            { status: 500 }
        )
    }
}
