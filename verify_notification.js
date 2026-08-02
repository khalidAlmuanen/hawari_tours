
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
    try {
        const booking = await prisma.booking.findFirst({
            orderBy: { createdAt: 'desc' },
            include: { tour: true }
        })

        if (booking) {
            console.log('✅ Booking found:', booking.bookingNumber)
            console.log('   Customer:', booking.customerName)
            console.log('   Tour:', booking.tour?.title)
        } else {
            console.log('❌ No booking found')
        }

        const notification = await prisma.notification.findFirst({
            orderBy: { createdAt: 'desc' }
        })

        if (notification) {
            console.log('✅ Notification found:', notification.title)
            console.log('   Message:', notification.message)
            console.log('   Type:', notification.type)
        } else {
            console.log('❌ No notification found')
        }
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

check()
