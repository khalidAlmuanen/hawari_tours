// ═══════════════════════════════════════════════════════════════
// 📅 Public Bookings API - Create booking (No Auth Required)
// /app/api/bookings/route.js
// ✅ للعملاء: إنشاء حجز من الموقع العام
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// ═══════════════════════════════════════════════════════════════
// POST - Create new booking (Public - No Auth Required)
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json()

    console.log('📅 [API] Creating new booking:', body)

    // Validation
    const required = ['tourId', 'customerName', 'customerEmail', 'customerPhone', 'tourDate', 'numberOfPeople']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate tour exists and is active
    const tour = await prisma.tour.findUnique({
      where: { id: body.tourId }
    })

    if (!tour) {
      return NextResponse.json(
        { success: false, error: 'Tour not found' },
        { status: 404 }
      )
    }

    if (!tour.isActive) {
      return NextResponse.json(
        { success: false, error: 'Tour is not available' },
        { status: 400 }
      )
    }

    // ✅ Calculate tour dates
    const startDate = new Date(body.tourDate)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + tour.duration)

    // Check if tour is full for this date
    const existingBookings = await prisma.booking.count({
      where: {
        tourId: body.tourId,
        startDate: startDate,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    })

    const totalPeople = await prisma.booking.aggregate({
      where: {
        tourId: body.tourId,
        startDate: startDate,
        status: { in: ['PENDING', 'CONFIRMED'] }
      },
      _sum: {
        numberOfPeople: true
      }
    })

    const currentBookedPeople = totalPeople._sum.numberOfPeople || 0
    const requestedPeople = parseInt(body.numberOfPeople)

    if (currentBookedPeople + requestedPeople > tour.maxPeople) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Only ${tour.maxPeople - currentBookedPeople} spots left for this date` 
        },
        { status: 400 }
      )
    }

    // Generate booking number
    const bookingNumber = `BK${Date.now().toString().slice(-8)}`

    // Calculate pricing
    const pricePerPerson = tour.discount > 0 
      ? tour.price * (1 - tour.discount / 100)
      : tour.price
    const totalAmount = pricePerPerson * requestedPeople

    // ✅ Get or create user for booking
    let user = await prisma.user.findUnique({
      where: { email: body.customerEmail }
    })
    
    // If user doesn't exist, create as guest
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) // Random password
      const hashedPassword = await bcrypt.hash(randomPassword, 10)
      
      user = await prisma.user.create({
        data: {
          email: body.customerEmail,
          name: body.customerName,
          phone: body.customerPhone,
          password: hashedPassword,
          role: 'USER',
          isActive: true
        }
      })
      
      console.log('✅ Created guest user:', user.email)
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        userId: user.id,
        tourId: body.tourId,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        numberOfPeople: requestedPeople,
        startDate: startDate,
        endDate: endDate,
        totalPrice: totalAmount,
        paidAmount: 0,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        specialRequests: body.specialRequests || null
      },
      include: {
        tour: {
          select: {
            title: true,
            titleAr: true,
            slug: true,
            coverImage: true
          }
        }
      }
    })

    console.log('✅ [API] Booking created:', bookingNumber)

    // TODO: Send confirmation email to customer
    // TODO: Send notification to admin

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    }, { status: 201 })

  } catch (error) {
    console.error('❌ [API] Booking creation error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create booking',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════
// GET - Get user's bookings (Optional - for future use)
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const bookingNumber = searchParams.get('bookingNumber')

    if (!email && !bookingNumber) {
      return NextResponse.json(
        { success: false, error: 'Email or booking number required' },
        { status: 400 }
      )
    }

    const where = bookingNumber
      ? { bookingNumber }
      : { customerEmail: email }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        tour: {
          select: {
            title: true,
            titleAr: true,
            slug: true,
            coverImage: true,
            duration: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: bookings
    })

  } catch (error) {
    console.error('❌ [API] Bookings fetch error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bookings'
      },
      { status: 500 }
    )
  }
}
