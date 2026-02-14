// ═══════════════════════════════════════════════════════════════
// 📰 News API - Complete CRUD (Protected)
// /app/api/admin/news/route.js
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// GET - Get all news
export async function GET(request) {
  // التحقق من المصادقة والصلاحيات
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  // المستخدم مصادق ولديه الصلاحيات
  const user = auth.user

  try {
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const category = searchParams.get('category')
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    const where = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { titleAr: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {},
        category && category !== 'all' ? { category } : {},
        published !== null && published !== 'all' ? { published: published === 'true' } : {},
        featured !== null && featured !== 'all' ? { featured: featured === 'true' } : {}
      ]
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.news.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        news,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('News GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch news' }, { status: 500 })
  }
}

// POST - Create news
export async function POST(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error
  const user = auth.user

  try {
    const body = await request.json()

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const news = await prisma.news.create({
      data: {
        title: body.title,
        titleAr: body.titleAr,
        slug,
        excerpt: body.excerpt,
        excerptAr: body.excerptAr,
        content: body.content,
        contentAr: body.contentAr,
        coverImage: body.coverImage || '',
        images: body.images || [],
        category: body.category,
        tags: body.tags || [],
        featured: body.featured || false,
        breaking: body.breaking || false,
        trending: body.trending || false,
        published: body.published || false,
        publishedAt: body.published ? new Date() : null,
        authorName: body.authorName || null,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'News created successfully',
        data: news
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('News POST error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create news' }, { status: 500 })
  }
}

// PUT - Update news
export async function PUT(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error
  const user = auth.user

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'News ID is required' }, { status: 400 })
    }

    const news = await prisma.news.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.titleAr && { titleAr: body.titleAr }),
        ...(body.slug && { slug: body.slug }),
        ...(body.excerpt && { excerpt: body.excerpt }),
        ...(body.excerptAr && { excerptAr: body.excerptAr }),
        ...(body.content && { content: body.content }),
        ...(body.contentAr && { contentAr: body.contentAr }),
        ...(body.coverImage && { coverImage: body.coverImage }),
        ...(body.images && { images: body.images }),
        ...(body.category && { category: body.category }),
        ...(body.tags && { tags: body.tags }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.breaking !== undefined && { breaking: body.breaking }),
        ...(body.trending !== undefined && { trending: body.trending }),
        ...(body.published !== undefined && {
          published: body.published,
          publishedAt: body.published && !body.publishedAt ? new Date() : body.publishedAt
        }),
        ...(body.authorName && { authorName: body.authorName }),
        ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle }),
        ...(body.metaDescription !== undefined && { metaDescription: body.metaDescription })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'News updated successfully',
      data: news
    })
  } catch (error) {
    console.error('News PUT error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update news' }, { status: 500 })
  }
}

// DELETE - Delete news
export async function DELETE(request) {
  const auth = await requireAuth(request, ['SUPER_ADMIN']) // Super Admin فقط
  if (auth.error) return auth.error
  const user = auth.user

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'News ID is required' }, { status: 400 })
    }

    await prisma.news.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'News deleted successfully'
    })
  } catch (error) {
    console.error('News DELETE error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete news' }, { status: 500 })
  }
}
