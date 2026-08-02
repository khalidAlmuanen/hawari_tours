// ═══════════════════════════════════════════════════════════════
// 📸 Public Gallery API - Fetch Complete Gallery Content
// يجلب كل محتوى المعرض: صور، فيديوهات، جولات 360°، إنستغرام، إعدادات
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '100')

    // ═══════════════════════════════════════════════════════════
    // 1. Fetch Images
    // ═══════════════════════════════════════════════════════════
    const imagesWhere = {
      isActive: true,
      ...(category && category !== 'all' ? { category } : {}),
      ...(featured === 'true' ? { featured: true } : {})
    }

    const images = await prisma.galleryImage.findMany({
      where: imagesWhere,
      take: limit,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        titleAr: true,
        description: true,
        descriptionAr: true,
        url: true,
        thumbnail: true,
        category: true,
        tags: true,
        width: true,
        height: true,
        featured: true,
        createdAt: true
      }
    })

    // ═══════════════════════════════════════════════════════════
    // 2. Fetch Videos
    // ═══════════════════════════════════════════════════════════
    const videos = await prisma.galleryVideo.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        titleAr: true,
        description: true,
        descriptionAr: true,
        videoUrl: true,
        thumbnail: true,
        duration: true,
        category: true,
        featured: true
      },
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      take: 10
    })

    // ═══════════════════════════════════════════════════════════
    // 3. Fetch Virtual Tours 360°
    // ═══════════════════════════════════════════════════════════
    const virtualTours = await prisma.virtualTour.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        titleAr: true,
        description: true,
        descriptionAr: true,
        location: true,
        locationAr: true,
        tourUrl: true,
        icon: true,
        gradient: true,
        featured: true
      },
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' }
      ]
    })

    // ═══════════════════════════════════════════════════════════
    // 4. Fetch Instagram Posts
    // ═══════════════════════════════════════════════════════════
    const instagramPosts = await prisma.instagramPost.findMany({
      where: { isActive: true },
      select: {
        id: true,
        imageUrl: true,
        postUrl: true,
        likes: true,
        comments: true
      },
      orderBy: { order: 'asc' },
      take: 12
    })

    // ═══════════════════════════════════════════════════════════
    // 5. Fetch Gallery Settings
    // ═══════════════════════════════════════════════════════════
    let settings = await prisma.gallerySetting.findFirst({
      orderBy: { updatedAt: 'desc' }
    })

    // If no settings exist, use defaults
    if (!settings) {
      settings = {
        heroTitle: 'Explore Socotra',
        heroTitleAr: 'استكشف سقطرى',
        heroImage: null,
        instagramUsername: '@HawariTours',
        instagramUrl: 'https://instagram.com/hawaritours',
        downloadTitle: 'Want High-Resolution Copy?',
        downloadTitleAr: 'هل تريد نسخة عالية الجودة؟',
        ctaTitle: 'Liked the Photos? Visit Socotra Yourself!',
        ctaTitleAr: 'هل أعجبتك الصور؟ زر سقطرى بنفسك!',
        statsEnabled: true,
        virtualToursCount: '10+',
        highQualityLabel: '4K'
      }
    }

    // ═══════════════════════════════════════════════════════════
    // 6. Calculate Stats
    // ═══════════════════════════════════════════════════════════
    const stats = {
      images: {
        total: images.length,
        featured: images.filter(img => img.featured).length,
        byCategory: {}
      },
      videos: {
        total: videos.length,
        featured: videos.filter(v => v.featured).length
      },
      virtualTours: {
        total: virtualTours.length
      },
      instagram: {
        posts: instagramPosts.length,
        totalLikes: instagramPosts.reduce((sum, post) => sum + post.likes, 0),
        totalComments: instagramPosts.reduce((sum, post) => sum + post.comments, 0)
      }
    }

    // Count images by category
    images.forEach(img => {
      stats.images.byCategory[img.category] = (stats.images.byCategory[img.category] || 0) + 1
    })

    console.log(`✅ [Gallery API] Complete data: ${images.length} images, ${videos.length} videos, ${virtualTours.length} tours, ${instagramPosts.length} posts`)

    return NextResponse.json({
      success: true,
      data: {
        images,
        videos,
        virtualTours,
        instagramPosts,
        settings,
        stats
      }
    })

  } catch (error) {
    console.error('❌ [Gallery API] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch gallery content',
        details: error.message
      },
      { status: 500 }
    )
  }
}
