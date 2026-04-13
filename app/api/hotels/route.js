import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minRating = searchParams.get('minRating')

    const where = {
      status: 'ACTIVE',
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
        featured === 'true' ? { featured: true } : {},
        minPrice || maxPrice
          ? {
            pricePerNight: {
              ...(minPrice && { gte: parseFloat(minPrice) }),
              ...(maxPrice && { lte: parseFloat(maxPrice) })
            }
          }
          : {},
        minRating ? { rating: { gte: parseFloat(minRating) } } : {}
      ]
    }

    const hotels = await prisma.hotel.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        nameAr: true,
        slug: true,
        shortDescription: true,
        shortDescriptionAr: true,
        pricePerNight: true,
        discount: true,
        rating: true,
        reviewsCount: true,
        roomsCount: true,
        featured: true,
        coverImage: true,
        images: true,
        location: true,
        locationAr: true,
        amenities: true,
        amenitiesAr: true,
        highlights: true,
        highlightsAr: true
      }
    })

    return NextResponse.json(
      { success: true, data: hotels, count: hotels.length }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hotels', details: error.message, data: [] },
      { status: 500 }
    )
  }
}
