// ═══════════════════════════════════════════════════════════════
// 🖼️ Gallery API - Complete CRUD
// /app/api/admin/gallery/route.js
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// ═══════════════════════════════════════════════════════════════
// GET - Fetch all gallery images (Admin)
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')

    const where = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { titleAr: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        category && category !== 'all' ? { category } : {},
        isActive !== null && isActive !== 'all' ? { isActive: isActive === 'true' } : {}
      ]
    }

    const [images, total] = await Promise.all([
      prisma.galleryImage.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.galleryImage.count({ where })
    ])

    console.log(`✅ [Gallery] Found ${images.length} images`)

    return NextResponse.json({
      success: true,
      data: {
        images,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('❌ [Gallery] GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch gallery images',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════
// POST - Create new gallery image
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const {
      title,
      titleAr,
      description,
      descriptionAr,
      url,
      thumbnail,
      category,
      tags,
      width,
      height,
      featured,
      isActive
    } = body

    // Validation
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      )
    }

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category is required' },
        { status: 400 }
      )
    }

    // Create image
    const image = await prisma.galleryImage.create({
      data: {
        title: title || null,
        titleAr: titleAr || null,
        description: description || null,
        descriptionAr: descriptionAr || null,
        url,
        thumbnail: thumbnail || url,
        category,
        tags: tags || [],
        width: width || null,
        height: height || null,
        featured: featured || false,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    console.log(`✅ [Gallery] Image created: ${image.id}`)

    return NextResponse.json({
      success: true,
      message: 'Gallery image created successfully',
      data: { image }
    })

  } catch (error) {
    console.error('❌ [Gallery] POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create gallery image',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update gallery image
// ═══════════════════════════════════════════════════════════════

export async function PUT(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // Check if image exists
    const existingImage = await prisma.galleryImage.findUnique({
      where: { id }
    })

    if (!existingImage) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      )
    }

    // Clean update data (remove undefined values)
    const cleanData = Object.entries(updateData).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {})

    // Update image
    const image = await prisma.galleryImage.update({
      where: { id },
      data: cleanData
    })

    console.log(`✅ [Gallery] Image updated: ${image.id}`)

    return NextResponse.json({
      success: true,
      message: 'Gallery image updated successfully',
      data: { image }
    })

  } catch (error) {
    console.error('❌ [Gallery] PUT error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update gallery image',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Delete gallery image
// ═══════════════════════════════════════════════════════════════

export async function DELETE(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // Check if image exists
    const existingImage = await prisma.galleryImage.findUnique({
      where: { id }
    })

    if (!existingImage) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      )
    }

    // Delete image
    await prisma.galleryImage.delete({
      where: { id }
    })

    console.log(`✅ [Gallery] Image deleted: ${id}`)

    return NextResponse.json({
      success: true,
      message: 'Gallery image deleted successfully'
    })

  } catch (error) {
    console.error('❌ [Gallery] DELETE error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete gallery image',
        details: error.message
      },
      { status: 500 }
    )
  }
}
