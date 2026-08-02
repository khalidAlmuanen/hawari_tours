
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('📊 Seeding Analytics & Bookings for Dashboard...')

    // 1. Get a user and a tour to link bookings to
    const user = await prisma.user.findFirst({ where: { role: 'USER' } })
    const tour = await prisma.tour.findFirst({ where: { isActive: true } })

    if (!user || !tour) {
        console.log('❌ No user or tour found. Please run main seed first.')
        return
    }

    // 2. Create Dummy Bookings (Last 6 Months)
    console.log('📅 Creating dummy bookings...')
    const statuses = ['CONFIRMED', 'COMPLETED', 'PENDING', 'CANCELLED']

    for (let i = 0; i < 20; i++) {
        const daysAgo = Math.floor(Math.random() * 180)
        const date = new Date()
        date.setDate(date.getDate() - daysAgo)

        await prisma.booking.create({
            data: {
                bookingNumber: `BK-${Date.now()}-${i}`,
                userId: user.id,
                tourId: tour.id,
                startDate: new Date(date.getTime() + 86400000 * 10), // +10 days
                endDate: new Date(date.getTime() + 86400000 * 15), // +15 days
                numberOfPeople: Math.floor(Math.random() * 5) + 1,
                totalPrice: tour.price * (Math.floor(Math.random() * 5) + 1),
                paidAmount: tour.price, // Partial or full
                status: statuses[Math.floor(Math.random() * statuses.length)],
                paymentStatus: 'PAID',
                customerName: user.name || 'Test User',
                customerEmail: user.email,
                customerPhone: user.phone || '',
                createdAt: date,
                updatedAt: date
            }
        })
    }
    console.log('  ✅ Created 20 dummy bookings')

    // 3. Create Analytics Data (Traffic Sources)
    console.log('📈 Creating analytics data...')

    // Check if we have analytics for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existing = await prisma.analytics.findUnique({
        where: { date: today }
    })

    if (!existing) {
        await prisma.analytics.create({
            data: {
                date: today,
                pageViews: 156,
                uniqueVisitors: 89,
                bookings: 2,
                revenue: 2500,
                directTraffic: 45,
                organicSearch: 30,
                socialMedia: 20,
                referral: 5,
                desktop: 60,
                mobile: 35,
                tablet: 5
            }
        })
        console.log('  ✅ Created analytics for today')
    } else {
        console.log('  ⚠️ Analytics for today already exist')
    }

    console.log('🎉 Analytics seeding finished!')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
