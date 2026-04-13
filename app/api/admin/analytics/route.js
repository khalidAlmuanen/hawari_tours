// ═══════════════════════════════════════════════════════════════
// 📊 ANALYTICS API - Dashboard Statistics
// مسار API لإحصائيات لوحة التحكم
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// ═══════════════════════════════════════════════════════════════
// GET - Fetch Analytics Data
// ═══════════════════════════════════════════════════════════════
export async function GET(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') // overview / bookings / revenue / users / tours
        const period = searchParams.get('period') || '30days' // 7days, 30days, 90days, 12months

        // Helper to get date range
        const getDateRange = (period) => {
            const now = new Date()
            const start = new Date()

            switch (period) {
                case '7days':
                    start.setDate(now.getDate() - 7)
                    break
                case '90days':
                    start.setDate(now.getDate() - 90)
                    break
                case '12months':
                    start.setFullYear(now.getFullYear(), now.getMonth() - 11, 1)
                    break
                case '30days':
                default:
                    start.setDate(now.getDate() - 30)
                    break
            }
            start.setHours(0, 0, 0, 0)
            return { start, end: now }
        }

        const { start: startDate, end: endDate } = getDateRange(period)
        const rangeMs = endDate.getTime() - startDate.getTime()
        const prevStartDate = new Date(startDate.getTime() - rangeMs)
        const prevEndDate = new Date(startDate.getTime())

        const calcGrowth = (current, previous) => {
            if (previous === 0) return current === 0 ? 0 : 100
            return ((current - previous) / previous) * 100
        }

        // ═══════════════════════════════════════════════════════════════
        // 📈 OVERVIEW STATISTICS
        // ═══════════════════════════════════════════════════════════════
        if (type === 'overview' || !type) {
            // 1. Calculate Revenue & Growth
            const currentRevenue = await prisma.booking.aggregate({
                _sum: { totalPrice: true },
                where: {
                    status: { in: ['CONFIRMED', 'COMPLETED'] },
                    createdAt: { gte: startDate }
                }
            })

            const prevRevenue = await prisma.booking.aggregate({
                _sum: { totalPrice: true },
                where: {
                    status: { in: ['CONFIRMED', 'COMPLETED'] },
                    createdAt: { gte: prevStartDate, lt: prevEndDate }
                }
            })

            const revenueValue = currentRevenue._sum.totalPrice || 0
            const prevRevenueValue = prevRevenue._sum.totalPrice || 0
            const revenueGrowth = calcGrowth(revenueValue, prevRevenueValue)

            // 2. Calculate Bookings & Growth
            const currentBookings = await prisma.booking.count({
                where: { createdAt: { gte: startDate } }
            })
            const prevBookings = await prisma.booking.count({
                where: { createdAt: { gte: prevStartDate, lt: prevEndDate } }
            })
            const bookingsGrowth = calcGrowth(currentBookings, prevBookings)

            // 3. New Users & Growth
            const currentUsers = await prisma.user.count({
                where: { createdAt: { gte: startDate } }
            })
            const prevUsers = await prisma.user.count({
                where: { createdAt: { gte: prevStartDate, lt: prevEndDate } }
            })
            const usersGrowth = calcGrowth(currentUsers, prevUsers)

            // 4. Active Tours
            const activeTours = await prisma.tour.count({
                where: { isActive: true }
            })

            // 5. Recent Activity Feed (Merged from Bookings, Reviews, Users)
            const recentBookings = await prisma.booking.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true, avatar: true } } }
            })

            const recentReviews = await prisma.review.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true, avatar: true } }, tour: { select: { title: true, titleAr: true } } }
            })

            const newUsersList = await prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, email: true, avatar: true, createdAt: true }
            })

            // Merge and sort
            const recentActivity = [
                ...recentBookings.map(b => ({ type: 'booking', data: b, date: b.createdAt })),
                ...recentReviews.map(r => ({ type: 'review', data: r, date: r.createdAt })),
                ...newUsersList.map(u => ({ type: 'user', data: u, date: u.createdAt }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)

            return NextResponse.json({
                success: true,
                data: {
                    overview: {
                        revenue: { value: revenueValue, growth: revenueGrowth },
                        bookings: { value: currentBookings, growth: bookingsGrowth },
                        users: { value: currentUsers, growth: usersGrowth },
                        activeTours,
                        totalBookings: await prisma.booking.count(),
                        totalRevenue: (await prisma.booking.aggregate({
                            _sum: { totalPrice: true },
                            where: { status: { in: ['CONFIRMED', 'COMPLETED'] } }
                        }))._sum.totalPrice || 0,
                    },
                    recentActivity
                }
            })
        }

        // ═══════════════════════════════════════════════════════════════
        // 📅 CHARTS DATA (Bookings & Revenue)
        // ═══════════════════════════════════════════════════════════════
        if (type === 'charts') {
            const bookings = await prisma.booking.findMany({
                where: { createdAt: { gte: startDate } },
                select: { createdAt: true, totalPrice: true, status: true }
            })

            // Group by day or month based on period
            const isDaily = period !== '12months'
            const chartData = {}
            const getDailyKey = (date) => {
                const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
                return utc.toISOString().split('T')[0]
            }
            const getMonthlyKey = (date) => {
                const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1))
                return utc.toISOString().substring(0, 7)
            }

            bookings.forEach(booking => {
                const key = isDaily
                    ? getDailyKey(booking.createdAt)
                    : getMonthlyKey(booking.createdAt)

                if (!chartData[key]) {
                    chartData[key] = {
                        date: key,
                        bookings: 0,
                        revenue: 0,
                        confirmed: 0
                    }
                }

                chartData[key].bookings++
                if (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') {
                    chartData[key].revenue += booking.totalPrice
                    chartData[key].confirmed++
                }
            })

            // Fill missing dates
            const filledData = []
            let currentDate = new Date(startDate)
            if (!isDaily) {
                currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
            }
            while (currentDate <= endDate) {
                const key = isDaily
                    ? getDailyKey(currentDate)
                    : getMonthlyKey(currentDate)

                if (chartData[key]) {
                    filledData.push(chartData[key])
                } else {
                    filledData.push({
                        date: key,
                        bookings: 0,
                        revenue: 0,
                        confirmed: 0
                    })
                }

                if (isDaily) currentDate.setDate(currentDate.getDate() + 1)
                else currentDate.setMonth(currentDate.getMonth() + 1)
            }

            return NextResponse.json({
                success: true,
                data: filledData
            })
        }

        // ═══════════════════════════════════════════════════════════════
        // 🏆 TOP PERFORMERS (Tours & Customers)
        // ═══════════════════════════════════════════════════════════════
        if (type === 'leaders') {
            // Top Tours
            const topTours = await prisma.tour.findMany({
                take: 5,
                orderBy: { bookingsCount: 'desc' },
                select: {
                    id: true,
                    title: true,
                    titleAr: true,
                    bookingsCount: true,
                    reviewsCount: true,
                    rating: true,
                    price: true,
                    coverImage: true
                }
            })

            // Top Customers (Most spending)
            // Note: Prisma doesn't support complex aggregations with relations easily, 
            // so we might need raw query or processing in JS for complex metrics.
            // For now, let's fetch top bookers by count which is supported
            const topBookers = await prisma.booking.groupBy({
                by: ['userId'],
                _count: { userId: true },
                _sum: { totalPrice: true },
                where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
                orderBy: { _sum: { totalPrice: 'desc' } },
                take: 5
            })

            // Hydrate user details
            const hydratedBookers = await Promise.all(topBookers.map(async (booker) => {
                const user = await prisma.user.findUnique({
                    where: { id: booker.userId },
                    select: { name: true, email: true, avatar: true }
                })
                return {
                    ...booker,
                    user
                }
            }))

            return NextResponse.json({
                success: true,
                data: {
                    topTours,
                    topCustomers: hydratedBookers
                }
            })
        }

        // ═══════════════════════════════════════════════════════════════
        // 🍩 DEMOGRAPHICS & STATUS
        // ═══════════════════════════════════════════════════════════════
        if (type === 'demographics') {
            const statusBreakdown = await prisma.booking.groupBy({
                by: ['status'],
                _count: { status: true }
            })

            const categoryBreakdown = await prisma.tour.groupBy({
                by: ['category'],
                _count: { category: true }
            })

            // Mock device data since we don't track it yet in schema fully populated
            // In real scenario, fetch from Analytics model
            const deviceData = [
                { name: 'Desktop', value: 65, color: '#10b981' },
                { name: 'Mobile', value: 25, color: '#3b82f6' },
                { name: 'Tablet', value: 10, color: '#f59e0b' }
            ]

            return NextResponse.json({
                success: true,
                data: {
                    statusData: statusBreakdown.map(s => ({ name: s.status, value: s._count.status })),
                    categoryData: categoryBreakdown.map(c => ({ name: c.category, value: c._count.category })),
                    deviceData
                }
            })
        }

        return NextResponse.json(
            { success: false, error: 'Invalid type parameter' },
            { status: 400 }
        )

    } catch (error) {
        console.error('❌ Error fetching analytics:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch analytics data' },
            { status: 500 }
        )
    }
}
