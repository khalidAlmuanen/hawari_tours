// ═══════════════════════════════════════════════════════════════
// 📊 Dashboard Stats API (PostgreSQL Compatible)
// /app/api/admin/stats/route.js
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

export async function GET(request) {
  // التحقق من المصادقة والصلاحيات
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  // المستخدم مصادق ولديه الصلاحيات
  const user = auth.user

  try {
    // Get query params for date range
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30' // days

    const daysAgo = parseInt(range, 10)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysAgo)

    const previousStartDate = new Date(startDate.getTime() - daysAgo * 24 * 60 * 60 * 1000)

    // Parallel queries
    const [
      // 1. Total counts
      totalTours,
      totalBookings,
      totalDestinations,
      totalNews,
      totalTestimonials,
      totalGalleryImages,
      activeUsers,

      // 2. Revenue stats
      revenueStats,
      previousRevenueStats,

      // 3. Bookings stats
      recentBookings,
      previousBookings,

      // 4. Recent data
      latestBookings,
      topTours,

      // 5. Traffic sources
      trafficData,

      // 6. Monthly data for charts (PostgreSQL)
      monthlyBookingsData,
      monthlyRevenueData
    ] = await prisma.$transaction([
      // 1. Total counts
      prisma.tour.count({ where: { isActive: true } }),
      prisma.booking.count(),
      prisma.destination.count({ where: { isActive: true } }),
      prisma.news.count({ where: { published: true } }),
      prisma.testimonial.count({ where: { published: true } }),

      // ✅ إذا موديلك ليس GalleryImage غيّره هنا
      prisma.galleryImage.count({ where: { isActive: true } }),

      prisma.user.count({ where: { isActive: true, role: 'USER' } }),

      // 2. Revenue - current period
      prisma.booking.aggregate({
        where: {
          createdAt: { gte: startDate },
          status: { in: ['CONFIRMED', 'COMPLETED'] }
        },
        _sum: { totalPrice: true }
      }),

      // Revenue - previous period
      prisma.booking.aggregate({
        where: {
          createdAt: { gte: previousStartDate, lt: startDate },
          status: { in: ['CONFIRMED', 'COMPLETED'] }
        },
        _sum: { totalPrice: true }
      }),

      // 3. Bookings - current period
      prisma.booking.count({
        where: { createdAt: { gte: startDate } }
      }),

      // Bookings - previous period
      prisma.booking.count({
        where: { createdAt: { gte: previousStartDate, lt: startDate } }
      }),

      // 4. Latest bookings (last 5)
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          tour: { select: { title: true, titleAr: true } }
        }
      }),

      // Top tours by bookingsCount
      prisma.tour.findMany({
        take: 5,
        orderBy: { bookingsCount: 'desc' },
        select: {
          id: true,
          title: true,
          titleAr: true,
          bookingsCount: true,
          price: true,
          rating: true
        }
      }),

      // 5. Traffic sources (latest analytics row)
      prisma.analytics.findFirst({
        orderBy: { date: 'desc' },
        select: {
          directTraffic: true,
          organicSearch: true,
          socialMedia: true,
          referral: true
        }
      }),

      // 6. Monthly bookings (PostgreSQL)
      prisma.$queryRaw`
        SELECT 
          to_char(date_trunc('month', "createdAt"), 'YYYY-MM') as month,
          COUNT(*)::int as count
        FROM "bookings"
        WHERE "createdAt" >= (NOW() - INTERVAL '12 months')
        GROUP BY month
        ORDER BY month ASC
      `,

      // Monthly revenue (PostgreSQL)
      prisma.$queryRaw`
        SELECT 
          to_char(date_trunc('month', "createdAt"), 'YYYY-MM') as month,
          COALESCE(SUM("totalPrice"), 0)::float8 as revenue
        FROM "bookings"
        WHERE "createdAt" >= (NOW() - INTERVAL '12 months')
          AND "status" IN ('CONFIRMED', 'COMPLETED')
        GROUP BY month
        ORDER BY month ASC
      `
    ])

    // Growth helper
    const calculateGrowth = (current, previous) => {
      const c = Number(current || 0)
      const p = Number(previous || 0)
      if (!p || p === 0) return 0
      return Number((((c - p) / p) * 100).toFixed(1))
    }

    // ✅ تحويل Decimal/BigInt إلى رقم عادي
    const currentRevenue = Number(revenueStats?._sum?.totalPrice || 0)
    const previousRevenue = Number(previousRevenueStats?._sum?.totalPrice || 0)

    const revenueGrowth = calculateGrowth(currentRevenue, previousRevenue)
    const bookingsGrowth = calculateGrowth(recentBookings, previousBookings)

    // Traffic sources
    const direct = Number(trafficData?.directTraffic || 0)
    const organic = Number(trafficData?.organicSearch || 0)
    const social = Number(trafficData?.socialMedia || 0)
    const referral = Number(trafficData?.referral || 0)

    const totalTraffic = direct + organic + social + referral || 1

    const trafficSources = trafficData
      ? [
          { source: 'Direct', visitors: direct, percentage: Math.round((direct / totalTraffic) * 100) },
          { source: 'Google', visitors: organic, percentage: Math.round((organic / totalTraffic) * 100) },
          { source: 'Social Media', visitors: social, percentage: Math.round((social / totalTraffic) * 100) },
          { source: 'Referral', visitors: referral, percentage: Math.round((referral / totalTraffic) * 100) }
        ]
      : []

    // Process monthly data -> arrays of length 12
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()

    const last12Months = []
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      last12Months.push(monthNames[monthIndex])
    }

    const monthlyBookings = last12Months.map((month) => {
      const data = monthlyBookingsData.find((d) => {
        const dataMonth = new Date(`${d.month}-01`).getMonth()
        return monthNames[dataMonth] === month
      })
      return data ? Number(data.count) : 0
    })

    const monthlyRevenue = last12Months.map((month) => {
      const data = monthlyRevenueData.find((d) => {
        const dataMonth = new Date(`${d.month}-01`).getMonth()
        return monthNames[dataMonth] === month
      })
      return data ? Number(data.revenue) : 0
    })

    // Format recent bookings
    const formattedBookings = latestBookings.map((booking) => ({
      id: booking.id,
      tour: booking.tour?.title || '',
      tourAr: booking.tour?.titleAr || '',
      customer: booking.customerName || booking.user?.name || 'Guest',
      amount: Number(booking.totalPrice || 0),
      status: String(booking.status || '').toLowerCase(),
      date: booking.createdAt.toISOString().split('T')[0]
    }))

    // Format top tours
    const formattedTopTours = topTours.map((tour) => {
      const revenue = Number(tour.bookingsCount || 0) * Number(tour.price || 0)
      return {
        name: tour.title,
        nameAr: tour.titleAr,
        bookings: Number(tour.bookingsCount || 0),
        revenue: Number(revenue || 0),
        growth: 0
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        // Main stats
        totalTours,
        totalBookings,
        totalRevenue: currentRevenue,
        activeUsers,
        totalDestinations,
        totalNews,
        totalTestimonials,
        totalGalleryImages,

        // Growth
        toursGrowth: 12.5, // (ثابت الآن)
        bookingsGrowth,
        revenueGrowth,
        usersGrowth: 15.2, // (ثابت الآن)

        // Charts (last 12 months)
        monthlyBookings,
        monthlyRevenue,
        monthlyLabels: last12Months,

        // Recent activity
        recentBookings: formattedBookings,
        topTours: formattedTopTours,

        // Traffic
        trafficSources,

        lastUpdate: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard stats',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════
// 📈 Real-time Stats (for live updates)
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  // التحقق من المصادقة والصلاحيات
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  const user = auth.user

  try {
    const body = await request.json()
    const { type } = body

    if (type === 'realtime') {
      const [todayBookings, todayRevenue, activeNow] = await prisma.$transaction([
        prisma.booking.count({
          where: {
            createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
          }
        }),

        prisma.booking.aggregate({
          where: {
            createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            status: { in: ['CONFIRMED', 'COMPLETED'] }
          },
          _sum: { totalPrice: true }
        }),

        prisma.user.count({
          where: {
            lastLogin: { gte: new Date(Date.now() - 60 * 60 * 1000) }
          }
        })
      ])

      return NextResponse.json({
        success: true,
        data: {
          activeUsers: activeNow,
          todayBookings,
          revenue: Number(todayRevenue?._sum?.totalPrice || 0),
          timestamp: new Date().toISOString()
        }
      })
    }

    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Realtime stats error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch realtime stats' }, { status: 500 })
  }
}
