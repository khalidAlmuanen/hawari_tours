
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

export async function GET(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    const category = searchParams.get('category')

    const where = {
      ...(category && category !== 'all' ? { category } : {})
    }

    const [videos, total] = await Promise.all([
      prisma.galleryVideo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: 'asc' }
      }),
      prisma.galleryVideo.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        videos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Videos GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch videos' }, { status: 500 })
  }
}

export async function POST(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()

    // Extract ID from YouTube URL if needed
    // For now assuming full URL or ID is handled by frontend or simple storage

    const video = await prisma.galleryVideo.create({
      data: {
        title: body.title,
        titleAr: body.titleAr || body.title,
        videoUrl: body.videoUrl,
        thumbnail: body.thumbnail,
        category: body.category || 'NATURE',
        featured: body.featured || false,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Video added successfully',
      data: video
    })
  } catch (error) {
    console.error('Videos POST error:', error)
    return NextResponse.json({ success: false, error: 'Failed to add video' }, { status: 500 })
  }
}

export async function PUT(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Video ID is required' }, { status: 400 })
    }

    const existingVideo = await prisma.galleryVideo.findUnique({
      where: { id }
    })

    if (!existingVideo) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 })
    }

    const cleanData = Object.entries(updateData).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value
      return acc
    }, {})

    const video = await prisma.galleryVideo.update({
      where: { id },
      data: cleanData
    })

    return NextResponse.json({
      success: true,
      message: 'Video updated successfully',
      data: video
    })
  } catch (error) {
    console.error('Videos PUT error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update video' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    await prisma.galleryVideo.delete({
      where: { id: body.id }
    })

    return NextResponse.json({ success: true, message: 'Video deleted' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete video' }, { status: 500 })
  }
}
