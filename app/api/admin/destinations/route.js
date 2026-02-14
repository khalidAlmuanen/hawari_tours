// ═══════════════════════════════════════════════════════════════
// 🏛️ Destinations API - Complete CRUD (Protected)
// /app/api/admin/destinations/route.js
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

export async function GET(request) {
  // التحقق من المصادقة والصلاحيات
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  // المستخدم مصادق ولديه الصلاحيات
  const user = auth.user

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    const where = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { nameAr: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {},
        featured !== null && featured !== 'all' ? { featured: featured === 'true' } : {}
      ]
    }

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.destination.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        destinations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Destinations GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch destinations' }, { status: 500 })
  }
}

export async function POST(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error
  const user = auth.user

  try {
    const body = await request.json()

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const destination = await prisma.destination.create({
      data: {
        name: body.name,
        nameAr: body.nameAr,
        slug,
        description: body.description,
        descriptionAr: body.descriptionAr,
        image: body.image || null,
        coverImage: body.coverImage || null,
        gallery: body.gallery || [],
        images: body.images || [],
        latitude: body.latitude,
        longitude: body.longitude,
        region: body.region || null,
        category: body.category || 'NATURE',
        highlights: body.highlights || [],
        activities: body.activities || [],
        bestTimeToVisit: body.bestTimeToVisit || null,
        unesco: body.unesco || false,
        featured: body.featured || false,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Destination created successfully',
        data: destination
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Destinations POST error:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Destination with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json({ success: false, error: 'Failed to create destination' }, { status: 500 })
  }
}

export async function PUT(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error
  const user = auth.user

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Destination ID is required' }, { status: 400 })
    }

    const destination = await prisma.destination.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.nameAr && { nameAr: body.nameAr }),
        ...(body.description && { description: body.description }),
        ...(body.descriptionAr && { descriptionAr: body.descriptionAr }),
        ...(body.image && { image: body.image }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.gallery && { gallery: body.gallery }),
        ...(body.images !== undefined && { images: body.images }),
        ...(body.latitude !== undefined && { latitude: body.latitude }),
        ...(body.longitude !== undefined && { longitude: body.longitude }),
        ...(body.region !== undefined && { region: body.region }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.highlights !== undefined && { highlights: body.highlights }),
        ...(body.activities !== undefined && { activities: body.activities }),
        ...(body.bestTimeToVisit !== undefined && { bestTimeToVisit: body.bestTimeToVisit }),
        ...(body.unesco !== undefined && { unesco: body.unesco }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.isActive !== undefined && { isActive: body.isActive })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Destination updated successfully',
      data: destination
    })
  } catch (error) {
    console.error('Destinations PUT error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update destination' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const auth = await requireAuth(request, ['SUPER_ADMIN']) // Super Admin فقط
  if (auth.error) return auth.error
  const user = auth.user

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Destination ID is required' }, { status: 400 })
    }

    await prisma.destination.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Destination deleted successfully'
    })
  } catch (error) {
    console.error('Destinations DELETE error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete destination' }, { status: 500 })
  }
}
