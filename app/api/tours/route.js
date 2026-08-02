// ═══════════════════════════════════════════════════════════════
// 🎯 Tours Public API - Fetch from Database
// app/api/tours/route.js
// ✅ جلب الرحلات من قاعدة البيانات (للصفحة العامة)
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// GET - Get all active tours (Public - No Auth Required)
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // Filters
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const difficulty = searchParams.get('difficulty')
    const maxDuration = searchParams.get('maxDuration')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    // Build where clause
    const where = {
      isActive: true, // Only active tours
      AND: [
        // Category filter
        category && category !== 'all'
          ? { category: category.toUpperCase() }
          : {},

        // Price range
        minPrice || maxPrice
          ? {
            price: {
              ...(minPrice && { gte: parseFloat(minPrice) }),
              ...(maxPrice && { lte: parseFloat(maxPrice) })
            }
          }
          : {},

        // Difficulty
        difficulty && difficulty !== 'all'
          ? { difficulty: difficulty.toUpperCase() }
          : {},

        // Duration
        maxDuration && maxDuration !== 'all'
          ? { duration: { lte: parseInt(maxDuration) } }
          : {},

        // Featured
        featured === 'true'
          ? { featured: true }
          : {},

        // Search
        search
          ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { titleAr: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } }
            ]
          }
          : {}
      ]
    }

    // Fetch tours
    const tours = await prisma.tour.findMany({
      where,
      orderBy: [
        { featured: 'desc' },  // Featured first
        { rating: 'desc' },    // Then by rating
        { createdAt: 'desc' }  // Then newest
      ],
      select: {
        id: true,
        title: true,
        titleAr: true,
        slug: true,
        description: true,
        descriptionAr: true,
        price: true,
        discount: true,
        duration: true,
        maxPeople: true,
        difficulty: true,
        category: true,
        featured: true,
        featured: true,
        coverImage: true,
        cardImage: true,
        images: true,
        location: true,
        locationAr: true,
        includes: true,
        excludes: true,
        rating: true,
        reviewsCount: true,
        bookingsCount: true,
        viewsCount: true
      }
    })

    console.log(`✅ [PUBLIC API] Fetched ${tours.length} tours from database`)

    return NextResponse.json({
      success: true,
      data: tours,
      count: tours.length
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })

  } catch (error) {
    console.error('❌ [PUBLIC API] Tours fetch error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tours',
        details: error.message,
        data: []
      },
      { status: 500 }
    )
  }
}