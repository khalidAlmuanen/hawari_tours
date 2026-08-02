// ═══════════════════════════════════════════════════════════════
// 🏛️ Destinations API - Public Endpoint
// API للمعالم السياحية (عام)
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch all public destinations
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    // Build where clause
    const where = {
      isActive: true,
      ...(category && category !== 'all' && { category }),
      ...(featured === 'true' && { featured: true }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { nameAr: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { descriptionAr: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    // Fetch destinations
    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.destination.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: destinations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Destinations API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch destinations',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
