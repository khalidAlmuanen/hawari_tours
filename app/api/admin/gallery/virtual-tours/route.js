
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

export async function GET(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const virtualTours = await prisma.virtualTour.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: { virtualTours }
    })
  } catch (error) {
    console.error('Virtual Tours GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch virtual tours' }, { status: 500 })
  }
}

export async function POST(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()

    if (!body.title || !body.tourUrl) {
      return NextResponse.json({ success: false, error: 'Title and Tour URL are required' }, { status: 400 })
    }

    const virtualTour = await prisma.virtualTour.create({
      data: {
        title: body.title,
        titleAr: body.titleAr || body.title,
        tourUrl: body.tourUrl,
        location: body.location || '',
        locationAr: body.locationAr || '',
        featured: body.featured || false,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Virtual Tour added successfully',
      data: virtualTour
    })
  } catch (error) {
    console.error('Virtual Tours POST error:', error)
    return NextResponse.json({ success: false, error: 'Failed to add virtual tour' }, { status: 500 })
  }
}

export async function PUT(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Virtual tour ID is required' }, { status: 400 })
    }

    const existingTour = await prisma.virtualTour.findUnique({
      where: { id }
    })

    if (!existingTour) {
      return NextResponse.json({ success: false, error: 'Virtual tour not found' }, { status: 404 })
    }

    const cleanData = Object.entries(updateData).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value
      return acc
    }, {})

    const virtualTour = await prisma.virtualTour.update({
      where: { id },
      data: cleanData
    })

    return NextResponse.json({
      success: true,
      message: 'Virtual tour updated successfully',
      data: virtualTour
    })
  } catch (error) {
    console.error('Virtual Tours PUT error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update virtual tour' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    await prisma.virtualTour.delete({
      where: { id: body.id }
    })

    return NextResponse.json({ success: true, message: 'Virtual Tour deleted' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete virtual tour' }, { status: 500 })
  }
}
