// ═══════════════════════════════════════════════════════════════
// 🏛️ Single Destination API - Get destination by slug
// app/api/destinations/[slug]/route.js
// ✅ جلب معلم واحد بالـ slug (للصفحة العامة)
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// GET - Get single destination by slug (Public - No Auth Required)
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

    console.log(`🔍 [API] Fetching destination with slug: ${slug}`)

    // Fetch destination from database
    const destination = await prisma.destination.findFirst({
      where: {
        slug: slug,
        isActive: true // Only active destinations
      }
    })

    if (!destination) {
      console.log(`❌ [API] Destination not found: ${slug}`)
      return NextResponse.json(
        {
          success: false,
          error: 'Destination not found'
        },
        { status: 404 }
      )
    }

    // Increment views count
    await prisma.destination.update({
      where: { id: destination.id },
      data: { viewsCount: { increment: 1 } }
    })

    console.log(`✅ [API] Destination found: ${destination.name}`)

    return NextResponse.json({
      success: true,
      data: destination
    })

  } catch (error) {
    console.error('❌ [API] Single destination fetch error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch destination',
        details: error.message
      },
      { status: 500 }
    )
  }
}
