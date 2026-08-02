// ═══════════════════════════════════════════════════════════════
// 🎯 Single Tour API - Get tour by slug
// app/api/tours/[slug]/route.js
// ✅ جلب جولة واحدة بالـ slug (للصفحة العامة)
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// GET - Get single tour by slug (Public - No Auth Required)
// ═══════════════════════════════════════════════════════════════

export async function GET(request, { params }) {
  try {
    // ✅ Resolve params (Next.js 15+ params are async Promise)
    const resolvedParams = await params
    const { slug } = resolvedParams

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug is required'
        },
        { status: 400 }
      )
    }

    console.log(`🔍 [API] Fetching tour with slug: ${slug}`)

    // Fetch tour from database
    const tour = await prisma.tour.findFirst({
      where: {
        slug: slug,
        isActive: true // Only active tours
      },
      include: {
        bookings: {
          where: {
            status: {
              in: ['CONFIRMED', 'COMPLETED']
            }
          },
          select: {
            id: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        },
        reviews: {
          where: {
            approved: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5, // Limit to 5 recent reviews for now, maybe add logic to load more later
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    })

    if (!tour) {
      console.log(`❌ [API] Tour not found: ${slug}`)
      return NextResponse.json(
        {
          success: false,
          error: 'Tour not found'
        },
        { status: 404 }
      )
    }

    // Calculate actual bookings count
    const bookingsCount = tour.bookings?.length || 0

    // Remove the bookings array from response (we only need the count)
    const { bookings, _count, ...tourData } = tour

    console.log(`✅ [API] Tour found: ${tour.title} (${bookingsCount} bookings)`)

    return NextResponse.json({
      success: true,
      data: {
        ...tourData,
        bookingsCount
      }
    })

  } catch (error) {
    console.error('❌ [API] Single tour fetch error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tour',
        details: error.message
      },
      { status: 500 }
    )
  }
}
