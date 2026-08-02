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
    const required = ['customerName', 'customerEmail', 'customerPhone', 'numberOfPeople']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const isHotelBooking = !!body.hotelId
    const isTourBooking = !!body.tourId
    const isCarBooking = !!body.carId

    if (!isHotelBooking && !isTourBooking && !isCarBooking) {
      return NextResponse.json(
        { success: false, error: 'Either tourId, hotelId, or carId is required' },
        { status: 400 }
      )
    }

    let tour = null
    let hotel = null
    let car = null

    if (isTourBooking) {
      tour = await prisma.tour.findUnique({
        where: { id: body.tourId }
      })

      if (!tour) {
        return NextResponse.json({ success: false, error: 'Tour not found' }, { status: 404 })
      }
      if (!tour.isActive) {
        return NextResponse.json({ success: false, error: 'Tour is not available' }, { status: 400 })
      }
    }

    if (isHotelBooking) {
      hotel = await prisma.hotel.findUnique({
        where: { id: body.hotelId }
      })

      if (!hotel || hotel.status !== 'ACTIVE') {
        return NextResponse.json({ success: false, error: 'Hotel not found' }, { status: 404 })
      }
    }

    if (isCarBooking) {
      car = await prisma.car.findUnique({
        where: { id: body.carId }
      })

      if (!car) {
        return NextResponse.json({ success: false, error: 'Car not found' }, { status: 404 })
      }
      if (car.status !== 'ACTIVE') {
        return NextResponse.json({ success: false, error: 'Car is currently unavailable' }, { status: 400 })
      }
    }

    let startDate = null
    let endDate = null
    let numberOfRooms = 1

    const requestedPeople = parseInt(body.numberOfPeople) || 1

    if (isTourBooking) {
      startDate = new Date(body.tourDate)
      endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + (tour.duration || 1))

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

      if (currentBookedPeople + requestedPeople > tour.maxPeople) {
        return NextResponse.json(
          {
            success: false,
            error: `Only ${tour.maxPeople - currentBookedPeople} spots left for this date`
          },
          { status: 400 }
        )
      }
    } else {
      // Hotel or Car logic
      // Support both checkInDate/checkOutDate (Hotels) and startDate/endDate (Cars)
      const startInput = body.checkInDate || body.startDate
      const endInput = body.checkOutDate || body.endDate

      if (!startInput || !endInput) {
        return NextResponse.json(
          { success: false, error: 'Start and end dates are required' },
          { status: 400 }
        )
      }
      if (isHotelBooking) {
        numberOfRooms = parseInt(body.numberOfRooms || 1)
      }
      startDate = new Date(startInput)
      endDate = new Date(endInput)
    }

    // Generate booking number (CAR / HOT / TOU prefix)
    let bookingPrefix = 'BK'
    if (isCarBooking) bookingPrefix = 'CAR'
    if (isHotelBooking) bookingPrefix = 'HOT'
    if (isTourBooking) bookingPrefix = 'TOU'
    const bookingNumber = `${bookingPrefix}${Date.now().toString().slice(-8)}`

    let totalAmount = 0
    if (isTourBooking) {
      const pricePerPerson = tour.discount > 0 ? tour.price * (1 - tour.discount / 100) : tour.price
      totalAmount = pricePerPerson * requestedPeople
    } else if (isHotelBooking) {
      const nights = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)))
      const pricePerNight = hotel.discount > 0 ? hotel.pricePerNight * (1 - hotel.discount / 100) : hotel.pricePerNight
      totalAmount = pricePerNight * nights * numberOfRooms
    } else if (isCarBooking) {
      const rentalDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)))
      const pricePerDay = car.discount > 0 ? car.pricePerDay * (1 - car.discount / 100) : car.pricePerDay
      totalAmount = pricePerDay * rentalDays

      if (body.withDriver) {
        // Add driver cost (50 per day)
        totalAmount += 50 * rentalDays
      }
    }

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
    const bookingTypeEnum = isCarBooking ? 'CAR' : (isHotelBooking ? 'HOTEL' : 'TOUR')

    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        userId: user.id,
        tourId: isTourBooking ? body.tourId : null,
        hotelId: isHotelBooking ? body.hotelId : null,
        carId: isCarBooking ? body.carId : null,
        bookingType: bookingTypeEnum,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        numberOfPeople: requestedPeople,
        numberOfRooms: isHotelBooking ? numberOfRooms : null,
        startDate: startDate,
        endDate: endDate,
        totalPrice: totalAmount,
        paidAmount: 0,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        specialRequests: (isCarBooking && body.withDriver)
          ? (body.specialRequests ? `[With Driver] ${body.specialRequests}` : '[With Driver]')
          : (body.specialRequests || null),
        notes: body.notes || null
      },
      include: {
        tour: { select: { title: true, titleAr: true, slug: true, coverImage: true } },
        hotel: { select: { name: true, nameAr: true, slug: true, coverImage: true } },
        car: { select: { name: true, nameAr: true, coverImage: true } }
      }
    })

    // ✅ [API] Booking created
    console.log('✅ [API] Booking created:', bookingNumber)

    // ✅ Create Notification for Admin
    try {
      let notifTitle = '✈️ حجز جولة جديد!'
      let notifMessage = `حجز جديد (${bookingNumber}) من ${body.customerName} للجولة: ${tour?.titleAr || tour?.title}`
      
      if (isHotelBooking) {
        notifTitle = '🏨 طلب حجز فندقي جديد!'
        notifMessage = `طلب جديد (${bookingNumber}) من ${body.customerName} للفندق: ${hotel?.nameAr || hotel?.name}`
      } else if (isCarBooking) {
        notifTitle = '🚘 حجز سيارة جديد!'
        notifMessage = `طلب إيجار جديد (${bookingNumber}) من ${body.customerName} للسيارة: ${car?.nameAr || car?.name}`
      }

      await prisma.notification.create({
        data: {
          type: 'BOOKING',
          title: notifTitle,
          message: notifMessage,
          link: `/admin/bookings?highlight=${booking.id}`,
          bookingId: booking.id,
          isRead: false
        }
      })
    } catch (notifError) {
      console.error('Failed to create notification:', notifError)
    }

    // TODO: Send confirmation email to customer


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
