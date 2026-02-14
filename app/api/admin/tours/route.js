// ═══════════════════════════════════════════════════════════════
// ✈️ Tours API - Complete CRUD
// /app/api/admin/tours/route.js
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// ═══════════════════════════════════════════════════════════════
// GET - Get all tours with filters, search, pagination
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  // التحقق من المصادقة والصلاحيات
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  // المستخدم مصادق ولديه الصلاحيات
  const user = auth.user

  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Filters
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where = {
      AND: [
        // Search
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { titleAr: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        
        // Category filter
        category && category !== 'all' ? { category } : {},
        
        // Difficulty filter
        difficulty && difficulty !== 'all' ? { difficulty } : {},
        
        // Featured filter
        featured !== null ? { featured: featured === 'true' } : {}
      ]
    }

    // Execute queries in parallel
    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              bookings: true,
              reviews: true
            }
          }
        }
      }),
      prisma.tour.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        tours,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total
        }
      }
    })

  } catch (error) {
    console.error('Tours GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tours', details: error.message },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════
// POST - Create new tour
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  const user = auth.user

  try {
    const body = await request.json()

    // Validate required fields
    const required = ['title', 'titleAr', 'description', 'descriptionAr', 'price', 'duration', 'maxPeople', 'category']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Generate slug from title
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create tour
    const tour = await prisma.tour.create({
      data: {
        title: body.title,
        titleAr: body.titleAr,
        slug,
        description: body.description,
        descriptionAr: body.descriptionAr,
        price: parseFloat(body.price),
        discount: body.discount ? parseFloat(body.discount) : 0,
        duration: parseInt(body.duration),
        maxPeople: parseInt(body.maxPeople),
        difficulty: body.difficulty || 'MODERATE',
        category: body.category,
        featured: body.featured || false,
        isActive: body.isActive !== undefined ? body.isActive : true,
        
        // Media
        coverImage: body.coverImage || '',
        images: body.images || [],
        videoUrl: body.videoUrl || null,
        
        // Location
        location: body.location || '',
        locationAr: body.locationAr || '',
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        
        // Itinerary
        itinerary: body.itinerary || null,
        
        // Includes/Excludes
        includes: body.includes || [],
        excludes: body.excludes || [],
        
        // SEO
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        keywords: body.keywords || []
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Tour created successfully',
      data: tour
    }, { status: 201 })

  } catch (error) {
    console.error('Tours POST error:', error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Tour with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create tour', details: error.message },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update tour
// ═══════════════════════════════════════════════════════════════

export async function PUT(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  const user = auth.user

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tour ID is required' },
        { status: 400 }
      )
    }

    // Check if tour exists
    const existingTour = await prisma.tour.findUnique({ where: { id } })
    if (!existingTour) {
      return NextResponse.json(
        { success: false, error: 'Tour not found' },
        { status: 404 }
      )
    }

    // Update tour
    const tour = await prisma.tour.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.titleAr && { titleAr: body.titleAr }),
        ...(body.slug && { slug: body.slug }),
        ...(body.description && { description: body.description }),
        ...(body.descriptionAr && { descriptionAr: body.descriptionAr }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.discount !== undefined && { discount: parseFloat(body.discount) }),
        ...(body.duration !== undefined && { duration: parseInt(body.duration) }),
        ...(body.maxPeople !== undefined && { maxPeople: parseInt(body.maxPeople) }),
        ...(body.difficulty && { difficulty: body.difficulty }),
        ...(body.category && { category: body.category }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        
        // Media
        ...(body.coverImage && { coverImage: body.coverImage }),
        ...(body.images && { images: body.images }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
        
        // Location
        ...(body.location && { location: body.location }),
        ...(body.locationAr && { locationAr: body.locationAr }),
        ...(body.latitude !== undefined && { latitude: body.latitude ? parseFloat(body.latitude) : null }),
        ...(body.longitude !== undefined && { longitude: body.longitude ? parseFloat(body.longitude) : null }),
        
        // Itinerary
        ...(body.itinerary !== undefined && { itinerary: body.itinerary }),
        
        // Includes/Excludes
        ...(body.includes && { includes: body.includes }),
        ...(body.excludes && { excludes: body.excludes }),
        
        // SEO
        ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle }),
        ...(body.metaDescription !== undefined && { metaDescription: body.metaDescription }),
        ...(body.keywords && { keywords: body.keywords })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Tour updated successfully',
      data: tour
    })

  } catch (error) {
    console.error('Tours PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update tour', details: error.message },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Delete tour
// ═══════════════════════════════════════════════════════════════

export async function DELETE(request) {
  const auth = await requireAuth(request, ['SUPER_ADMIN']) // Super Admin فقط
  if (auth.error) return auth.error

  const user = auth.user

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tour ID is required' },
        { status: 400 }
      )
    }

    // Check if tour exists
    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    })

    if (!tour) {
      return NextResponse.json(
        { success: false, error: 'Tour not found' },
        { status: 404 }
      )
    }

    // Check if tour has bookings
    if (tour._count.bookings > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete tour with existing bookings',
          suggestion: 'Consider deactivating instead'
        },
        { status: 409 }
      )
    }

    // Delete tour
    await prisma.tour.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Tour deleted successfully'
    })

  } catch (error) {
    console.error('Tours DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete tour', details: error.message },
      { status: 500 }
    )
  }
}
