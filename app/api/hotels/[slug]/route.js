import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params
    const slug = resolvedParams?.slug || request.nextUrl?.pathname?.split('/').pop()

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Hotel slug is required' }, { status: 400 })
    }

    const hotel = await prisma.hotel.findUnique({
      where: { slug }
    })

    if (!hotel || hotel.status !== 'ACTIVE') {
      return NextResponse.json({ success: false, error: 'Hotel not found' }, { status: 404 })
    }

    let viewsCount = hotel.viewsCount
    try {
      const updatedHotel = await prisma.hotel.update({
        where: { id: hotel.id },
        data: { viewsCount: { increment: 1 } }
      })
      viewsCount = updatedHotel.viewsCount
    } catch {
      viewsCount = hotel.viewsCount
    }

    return NextResponse.json({ success: true, data: { ...hotel, viewsCount } })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hotel details', details: error.message },
      { status: 500 }
    )
  }
}
