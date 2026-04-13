import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const where = {
      AND: [
        search
          ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { nameAr: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } },
              { locationAr: { contains: search, mode: 'insensitive' } }
            ]
          }
          : {},
        status && status !== 'all' ? { status } : {},
        featured !== null && featured !== 'all' ? { featured: featured === 'true' } : {}
      ]
    }

    const [hotels, total] = await Promise.all([
      prisma.hotel.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.hotel.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        hotels,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch hotels' }, { status: 500 })
  }
}

export async function POST(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()

    const required = ['name', 'nameAr', 'description', 'descriptionAr', 'pricePerNight', 'location', 'locationAr', 'coverImage']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const slugSource = body.slug || body.name || body.nameAr || ''
    const normalizedSlug = slugSource
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const slug = normalizedSlug || `hotel-${Date.now()}`

    const hotel = await prisma.hotel.create({
      data: {
        name: body.name,
        nameAr: body.nameAr,
        slug,
        description: body.description,
        descriptionAr: body.descriptionAr,
        shortDescription: body.shortDescription || null,
        shortDescriptionAr: body.shortDescriptionAr || null,
        pricePerNight: parseFloat(body.pricePerNight),
        discount: body.discount ? parseFloat(body.discount) : 0,
        rating: body.rating ? parseFloat(body.rating) : 0,
        reviewsCount: body.reviewsCount ? parseInt(body.reviewsCount) : 0,
        roomsCount: body.roomsCount ? parseInt(body.roomsCount) : 0,
        status: body.status || 'ACTIVE',
        featured: body.featured || false,
        coverImage: body.coverImage,
        images: Array.isArray(body.images) ? body.images : [],
        videoUrl: body.videoUrl || null,
        location: body.location,
        locationAr: body.locationAr,
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        amenities: Array.isArray(body.amenities) ? body.amenities : [],
        amenitiesAr: Array.isArray(body.amenitiesAr) ? body.amenitiesAr : [],
        highlights: Array.isArray(body.highlights) ? body.highlights : [],
        highlightsAr: Array.isArray(body.highlightsAr) ? body.highlightsAr : [],
        checkInTime: body.checkInTime || null,
        checkOutTime: body.checkOutTime || null,
        cancellationPolicy: body.cancellationPolicy || null,
        cancellationPolicyAr: body.cancellationPolicyAr || null,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        keywords: Array.isArray(body.keywords) ? body.keywords : []
      }
    })

    return NextResponse.json({ success: true, data: hotel }, { status: 201 })
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Hotel with this slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: 'Failed to create hotel' }, { status: 500 })
  }
}

export async function PUT(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Hotel ID is required' }, { status: 400 })
    }

    const hotel = await prisma.hotel.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.nameAr !== undefined && { nameAr: body.nameAr }),
        ...(body.slug && { slug: body.slug }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.descriptionAr !== undefined && { descriptionAr: body.descriptionAr }),
        ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription }),
        ...(body.shortDescriptionAr !== undefined && { shortDescriptionAr: body.shortDescriptionAr }),
        ...(body.pricePerNight !== undefined && { pricePerNight: parseFloat(body.pricePerNight) }),
        ...(body.discount !== undefined && { discount: parseFloat(body.discount) }),
        ...(body.rating !== undefined && { rating: parseFloat(body.rating) }),
        ...(body.reviewsCount !== undefined && { reviewsCount: parseInt(body.reviewsCount) }),
        ...(body.roomsCount !== undefined && { roomsCount: parseInt(body.roomsCount) }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.images !== undefined && { images: body.images }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.locationAr !== undefined && { locationAr: body.locationAr }),
        ...(body.latitude !== undefined && { latitude: body.latitude }),
        ...(body.longitude !== undefined && { longitude: body.longitude }),
        ...(body.amenities !== undefined && { amenities: body.amenities }),
        ...(body.amenitiesAr !== undefined && { amenitiesAr: body.amenitiesAr }),
        ...(body.highlights !== undefined && { highlights: body.highlights }),
        ...(body.highlightsAr !== undefined && { highlightsAr: body.highlightsAr }),
        ...(body.checkInTime !== undefined && { checkInTime: body.checkInTime }),
        ...(body.checkOutTime !== undefined && { checkOutTime: body.checkOutTime }),
        ...(body.cancellationPolicy !== undefined && { cancellationPolicy: body.cancellationPolicy }),
        ...(body.cancellationPolicyAr !== undefined && { cancellationPolicyAr: body.cancellationPolicyAr }),
        ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle }),
        ...(body.metaDescription !== undefined && { metaDescription: body.metaDescription }),
        ...(body.keywords !== undefined && { keywords: body.keywords })
      }
    })

    return NextResponse.json({ success: true, data: hotel })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update hotel' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const auth = await requireAuth(request, ['SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Hotel ID is required' }, { status: 400 })
    }

    await prisma.hotel.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete hotel' }, { status: 500 })
  }
}
