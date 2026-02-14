// ═══════════════════════════════════════════════════════════════
// 📱 Instagram Posts Management API - ADMIN ONLY
// إدارة منشورات إنستغرام بشكل احترافي
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import prisma from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// GET - Fetch All Instagram Posts (Admin)
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
    const limit = parseInt(searchParams.get('limit') || '12')
    const isActive = searchParams.get('isActive')

    // Build filters
    const where = {}
    
    if (isActive === 'true') where.isActive = true
    if (isActive === 'false') where.isActive = false

    // Count total
    const total = await prisma.instagramPost.count({ where })

    // Fetch posts
    const posts = await prisma.instagramPost.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * limit,
      take: limit
    })

    // Calculate stats
    const stats = {
      total: await prisma.instagramPost.count(),
      active: await prisma.instagramPost.count({ where: { isActive: true } }),
      totalLikes: (await prisma.instagramPost.aggregate({
        _sum: { likes: true }
      }))._sum.likes || 0,
      totalComments: (await prisma.instagramPost.aggregate({
        _sum: { comments: true }
      }))._sum.comments || 0
    }

    return NextResponse.json({
      success: true,
      data: {
        posts,
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
    console.error('Instagram Posts GET Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch posts',
      details: error.message
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// POST - Create New Instagram Post
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
      imageUrl,
      postUrl,
      likes,
      comments,
      isActive,
      order
    } = body

    // Validation
    if (!imageUrl) {
      return NextResponse.json({
        success: false,
        error: 'Image URL is required'
      }, { status: 400 })
    }

    // Create post
    const post = await prisma.instagramPost.create({
      data: {
        imageUrl,
        postUrl,
        likes: likes || 0,
        comments: comments || 0,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Instagram post created successfully',
      data: post
    }, { status: 201 })

  } catch (error) {
    console.error('Instagram Posts POST Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create post',
      details: error.message
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update Instagram Post
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
        error: 'Post ID is required'
      }, { status: 400 })
    }

    // Check if post exists
    const existingPost = await prisma.instagramPost.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 })
    }

    // Update post
    const post = await prisma.instagramPost.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'Instagram post updated successfully',
      data: post
    })

  } catch (error) {
    console.error('Instagram Posts PUT Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update post',
      details: error.message
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Delete Instagram Post
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
        error: 'Post ID is required'
      }, { status: 400 })
    }

    // Check if post exists
    const post = await prisma.instagramPost.findUnique({
      where: { id }
    })

    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 })
    }

    // Delete post
    await prisma.instagramPost.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Instagram post deleted successfully'
    })

  } catch (error) {
    console.error('Instagram Posts DELETE Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete post',
      details: error.message
    }, { status: 500 })
  }
}
