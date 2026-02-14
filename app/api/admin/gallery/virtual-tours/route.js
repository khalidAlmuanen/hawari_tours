// ═══════════════════════════════════════════════════════════════
// 🌐 Virtual Tours 360° Management API - ADMIN ONLY
// إدارة الجولات الافتراضية بشكل احترافي
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import prisma from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// GET - Fetch All Virtual Tours (Admin)
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
    const limit = parseInt(searchParams.get('limit') || '20')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const isActive = searchParams.get('isActive')

    // Build filters
    const where = {}
    
    if (featured === 'true') where.featured = true
    if (isActive === 'true') where.isActive = true
    if (isActive === 'false') where.isActive = false
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleAr: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { locationAr: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Count total
    const total = await prisma.virtualTour.count({ where })

    // Fetch tours
    const tours = await prisma.virtualTour.findMany({
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
      total: await prisma.virtualTour.count(),
      active: await prisma.virtualTour.count({ where: { isActive: true } }),
      featured: await prisma.virtualTour.count({ where: { featured: true } })
    }

    return NextResponse.json({
      success: true,
      data: {
        tours,
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
    console.error('Virtual Tours GET Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tours',
      details: error.message
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// POST - Create New Virtual Tour
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
      location,
      locationAr,
      tourUrl,
      icon,
      gradient,
      featured,
      isActive,
      order
    } = body

    // Validation
    if (!title || !titleAr || !location || !locationAr || !tourUrl) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, titleAr, location, locationAr, tourUrl'
      }, { status: 400 })
    }

    // Create tour
    const tour = await prisma.virtualTour.create({
      data: {
        title,
        titleAr,
        description,
        descriptionAr,
        location,
        locationAr,
        tourUrl,
        icon: icon || '🌐',
        gradient: gradient || 'from-blue-500 to-cyan-600',
        featured: featured || false,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Virtual tour created successfully',
      data: tour
    }, { status: 201 })

  } catch (error) {
    console.error('Virtual Tours POST Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create tour',
      details: error.message
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update Virtual Tour
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
        error: 'Tour ID is required'
      }, { status: 400 })
    }

    // Check if tour exists
    const existingTour = await prisma.virtualTour.findUnique({
      where: { id }
    })

    if (!existingTour) {
      return NextResponse.json({
        success: false,
        error: 'Tour not found'
      }, { status: 404 })
    }

    // Update tour
    const tour = await prisma.virtualTour.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'Virtual tour updated successfully',
      data: tour
    })

  } catch (error) {
    console.error('Virtual Tours PUT Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update tour',
      details: error.message
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Delete Virtual Tour
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
        error: 'Tour ID is required'
      }, { status: 400 })
    }

    // Check if tour exists
    const tour = await prisma.virtualTour.findUnique({
      where: { id }
    })

    if (!tour) {
      return NextResponse.json({
        success: false,
        error: 'Tour not found'
      }, { status: 404 })
    }

    // Delete tour
    await prisma.virtualTour.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Virtual tour deleted successfully'
    })

  } catch (error) {
    console.error('Virtual Tours DELETE Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete tour',
      details: error.message
    }, { status: 500 })
  }
}
