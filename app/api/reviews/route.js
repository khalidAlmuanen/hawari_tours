import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const body = await request.json()
    const tourId = typeof body.tourId === 'string' ? body.tourId.trim() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const comment = typeof body.comment === 'string' ? body.comment.trim() : ''
    const rating = Number(body.rating)
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (!tourId || !name || !email || !comment || !rating) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!emailValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email' },
        { status: 400 }
      )
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Invalid rating' },
        { status: 400 }
      )
    }

    const tour = await prisma.tour.findUnique({
      where: { id: tourId }
    })

    if (!tour || !tour.isActive) {
      return NextResponse.json(
        { success: false, error: 'Tour not found' },
        { status: 404 }
      )
    }

    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10)
      const hashedPassword = await bcrypt.hash(randomPassword, 10)
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'USER',
          isActive: true
        }
      })
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        tourId,
        rating,
        title: title || null,
        comment,
        approved: false
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: review.id
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}
