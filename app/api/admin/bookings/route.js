// ═══════════════════════════════════════════════════════════════
// 📅 Bookings API - Complete CRUD (Protected)
// /app/api/admin/bookings/route.js
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// ═══════════════════════════════════════════════════════════════
// GET - Get all bookings with filters
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  // التحقق من المصادقة والصلاحيات
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  // المستخدم مصادق ولديه الصلاحيات
  const user = auth.user

  try {
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Filters
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const search = searchParams.get('search')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where = {
      AND: [
        // Search by booking number, customer name, email
        search
          ? {
              OR: [
                { bookingNumber: { contains: search, mode: 'insensitive' } },
                { customerName: { contains: search, mode: 'insensitive' } },
                { customerEmail: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {},

        // Status filter
        status && status !== 'all' ? { status } : {},

        // Payment status filter
        paymentStatus && paymentStatus !== 'all' ? { paymentStatus } : {},

        // Date range filter
        startDate ? { createdAt: { gte: new Date(startDate) } } : {},
        endDate ? { createdAt: { lte: new Date(endDate) } } : {}
      ]
    }

    // Execute queries in parallel
    const [bookings, total, stats] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          tour: {
            select: {
              id: true,
              title: true,
              titleAr: true,
              price: true,
              duration: true
            }
          },
          payments: true
        }
      }),

      prisma.booking.count({ where }),

      // Get stats
      prisma.booking.groupBy({
        by: ['status'],
        _count: { status: true },
        _sum: { totalPrice: true }
      })
    ])

    // Format stats
    const statusStats = {
      PENDING: { count: 0, revenue: 0 },
      CONFIRMED: { count: 0, revenue: 0 },
      CANCELLED: { count: 0, revenue: 0 },
      COMPLETED: { count: 0, revenue: 0 }
    }

    stats.forEach((stat) => {
      statusStats[stat.status] = {
        count: stat._count.status,
        revenue: stat._sum.totalPrice || 0
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        bookings,
        stats: statusStats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total
        }
      }
    })
  } catch (error) {
    console.error('Bookings GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings', details: error.message },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════
// POST - Create new booking
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error
  const user = auth.user

  try {
    const body = await request.json()

    // Validate required fields
    const required = [
      'userId',
      'tourId',
      'startDate',
      'endDate',
      'numberOfPeople',
      'totalPrice',
      'customerName',
      'customerEmail',
      'customerPhone'
    ]
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Generate unique booking number
    const bookingNumber = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Check tour availability
    const tour = await prisma.tour.findUnique({
      where: { id: body.tourId },
      select: { maxPeople: true, isActive: true }
    })

    if (!tour) {
      return NextResponse.json({ success: false, error: 'Tour not found' }, { status: 404 })
    }

    if (!tour.isActive) {
      return NextResponse.json({ success: false, error: 'Tour is not active' }, { status: 400 })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        userId: body.userId,
        tourId: body.tourId,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        numberOfPeople: parseInt(body.numberOfPeople),
        totalPrice: parseFloat(body.totalPrice),
        paidAmount: body.paidAmount ? parseFloat(body.paidAmount) : 0,
        status: body.status || 'PENDING',
        paymentStatus: body.paymentStatus || 'PENDING',
        paymentMethod: body.paymentMethod || null,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        specialRequests: body.specialRequests || null,
        notes: body.notes || null
      },
      include: {
        user: true,
        tour: true
      }
    })

    // Update tour bookings count
    await prisma.tour.update({
      where: { id: body.tourId },
      data: { bookingsCount: { increment: 1 } }
    })

    return NextResponse.json({ success: true, message: 'Booking created successfully', data: booking }, { status: 201 })
  } catch (error) {
    console.error('Bookings POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create booking', details: error.message },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update booking status
// ═══════════════════════════════════════════════════════════════

export async function PUT(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error
  const user = auth.user

  try {
    const body = await request.json()
    const { id, status, paymentStatus, notes } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Booking ID is required' }, { status: 400 })
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({ where: { id } })
    if (!existingBooking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData = {}

    if (status) {
      updateData.status = status

      // Update timestamps based on status
      if (status === 'CONFIRMED' && !existingBooking.confirmedAt) {
        updateData.confirmedAt = new Date()
      } else if (status === 'CANCELLED' && !existingBooking.cancelledAt) {
        updateData.cancelledAt = new Date()
      } else if (status === 'COMPLETED' && !existingBooking.completedAt) {
        updateData.completedAt = new Date()
      }
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    // Update booking
    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        tour: true,
        payments: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    })
  } catch (error) {
    console.error('Bookings PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update booking', details: error.message },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Cancel/Delete booking
// ═══════════════════════════════════════════════════════════════

export async function DELETE(request) {
  const auth = await requireAuth(request, ['SUPER_ADMIN']) // Super Admin فقط
  if (auth.error) return auth.error
  const user = auth.user

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action') || 'cancel' // 'cancel' or 'delete'

    if (!id) {
      return NextResponse.json({ success: false, error: 'Booking ID is required' }, { status: 400 })
    }

    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { payments: true }
    })

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 })
    }

    if (action === 'cancel') {
      // Cancel booking (soft delete)
      await prisma.booking.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date()
        }
      })

      // Update tour bookings count
      await prisma.tour.update({
        where: { id: booking.tourId },
        data: { bookingsCount: { decrement: 1 } }
      })

      return NextResponse.json({
        success: true,
        message: 'Booking cancelled successfully'
      })
    } else {
      // Delete booking (hard delete)
      // Check if has payments
      if (booking.payments.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cannot delete booking with payments',
            suggestion: 'Consider cancelling instead'
          },
          { status: 409 }
        )
      }

      await prisma.booking.delete({ where: { id } })

      // Update tour bookings count
      await prisma.tour.update({
        where: { id: booking.tourId },
        data: { bookingsCount: { decrement: 1 } }
      })

      return NextResponse.json({
        success: true,
        message: 'Booking deleted successfully'
      })
    }
  } catch (error) {
    console.error('Bookings DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process booking', details: error.message },
      { status: 500 }
    )
  }
}
