// ═══════════════════════════════════════════════════════════════
// 📰 Single News API - Get news article by slug
// app/api/news/[slug]/route.js
// ✅ جلب خبر واحد بالـ slug (للصفحة العامة)
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// GET - Get single news article by slug (Public - No Auth Required)
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

    console.log(`🔍 [API] Fetching news with slug: ${slug}`)

    // Fetch news from database
    const news = await prisma.news.findFirst({
      where: {
        slug: slug,
        published: true // Only published news
      }
    })

    if (!news) {
      console.log(`❌ [API] News not found: ${slug}`)
      return NextResponse.json(
        {
          success: false,
          error: 'News not found'
        },
        { status: 404 }
      )
    }

    // Increment views count
    await prisma.news.update({
      where: { id: news.id },
      data: { viewsCount: { increment: 1 } }
    })

    console.log(`✅ [API] News found: ${news.title}`)

    return NextResponse.json({
      success: true,
      data: news
    })

  } catch (error) {
    console.error('❌ [API] Single news fetch error:', error)
    
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
