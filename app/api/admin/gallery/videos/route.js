// ═══════════════════════════════════════════════════════════════
// 🎬 Gallery Videos Management API - ADMIN ONLY
// إدارة فيديوهات المعرض بشكل احترافي
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import prisma from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// GET - Fetch All Videos (Admin)
// ═══════════════════════════════════════════════════════════════
export async function GET(request) {
  try {
    // Verify admin auth
    const authResult = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (authResult.error) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const isActive = searchParams.get('isActive')

    // Build filters
    const where = {}
    
    if (category) where.category = category
    if (featured === 'true') where.featured = true
    if (isActive === 'true') where.isActive = true
    if (isActive === 'false') where.isActive = false
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleAr: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Count total
    const total = await prisma.galleryVideo.count({ where })

    // Fetch videos
    const videos = await prisma.galleryVideo.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * limit,
      take: limit
    })

    // Calculate stats
    const stats = {
      total: await prisma.galleryVideo.count(),
      active: await prisma.galleryVideo.count({ where: { isActive: true } }),
      featured: await prisma.galleryVideo.count({ where: { featured: true } }),
      byCategory: await prisma.galleryVideo.groupBy({
        by: ['category'],
        _count: true
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        videos,
        stats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Gallery Videos GET Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch videos',
      details: error.message
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// POST - Create New Video
// ═══════════════════════════════════════════════════════════════
export async function POST(request) {
  try {
    // Verify admin auth
    const authResult = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (authResult.error) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      titleAr,
      description,
      descriptionAr,
      videoUrl,
      thumbnail,
      duration,
      category,
      featured,
      isActive,
      order
    } = body

    // Validation
    if (!title || !titleAr || !videoUrl || !category) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, titleAr, videoUrl, category'
      }, { status: 400 })
    }

    // Create video
    const video = await prisma.galleryVideo.create({
      data: {
        title,
        titleAr,
        description,
        descriptionAr,
        videoUrl,
        thumbnail,
        duration,
        category,
        featured: featured || false,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Video created successfully',
      data: video
    }, { status: 201 })

  } catch (error) {
    console.error('Gallery Videos POST Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create video',
      details: error.message
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update Video
// ═══════════════════════════════════════════════════════════════
export async function PUT(request) {
  try {
    // Verify admin auth
    const authResult = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (authResult.error) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Video ID is required'
      }, { status: 400 })
    }

    // Check if video exists
    const existingVideo = await prisma.galleryVideo.findUnique({
      where: { id }
    })

    if (!existingVideo) {
      return NextResponse.json({
        success: false,
        error: 'Video not found'
      }, { status: 404 })
    }

    // Update video
    const video = await prisma.galleryVideo.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'Video updated successfully',
      data: video
    })

  } catch (error) {
    console.error('Gallery Videos PUT Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update video',
      details: error.message
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Delete Video
// ═══════════════════════════════════════════════════════════════
export async function DELETE(request) {
  try {
    // Verify admin auth
    const authResult = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (authResult.error) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Video ID is required'
      }, { status: 400 })
    }

    // Check if video exists
    const video = await prisma.galleryVideo.findUnique({
      where: { id }
    })

    if (!video) {
      return NextResponse.json({
        success: false,
        error: 'Video not found'
      }, { status: 404 })
    }

    // Delete video
    await prisma.galleryVideo.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    })

  } catch (error) {
    console.error('Gallery Videos DELETE Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete video',
      details: error.message
    }, { status: 500 })
  }
}
