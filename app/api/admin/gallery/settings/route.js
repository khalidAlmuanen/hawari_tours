
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

export async function GET(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    let settings = await prisma.gallerySetting.findFirst({
      orderBy: { updatedAt: 'desc' }
    })

    // Create default if not exists
    if (!settings) {
      settings = await prisma.gallerySetting.create({
        data: {
          heroTitle: 'Explore Socotra',
          heroTitleAr: 'استكشف سقطرى',
          heroImage: null,
          instagramUsername: '@HawariTours'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Gallery Settings GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { id, createdAt, updatedAt, ...data } = body

    const updated = await prisma.gallerySetting.update({
      where: { id },
      data
    })

    return NextResponse.json({
      success: true,
      message: 'Gallery settings updated',
      data: updated
    })
  } catch (error) {
    console.error('Gallery Settings PUT error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 })
  }
}
