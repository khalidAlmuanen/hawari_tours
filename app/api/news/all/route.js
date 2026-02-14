// ═══════════════════════════════════════════════════════════════
// 📰 Public News API - Get all published news
// /app/api/news/all/route.js
// ✅ جلب جميع الأخبار المنشورة (للصفحة العامة)
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '100')

    console.log('🔍 [API] Fetching published news')

    const where = {
      published: true,
      ...(category && category !== 'all' ? { category } : {}),
      ...(featured === 'true' ? { featured: true } : {})
    }

    const news = await prisma.news.findMany({
      where,
      take: limit,
      orderBy: [
        { featured: 'desc' },
        { breaking: 'desc' },
        { publishedAt: 'desc' }
      ]
    })

    console.log(`✅ [API] Found ${news.length} published news`)

    return NextResponse.json({
      success: true,
      data: news
    })

  } catch (error) {
    console.error('❌ [API] News fetch error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news',
        details: error.message
      },
      { status: 500 }
    )
  }
}
