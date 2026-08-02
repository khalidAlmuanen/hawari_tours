
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
    try {
        console.log('🔍 Checking for verification message...')

        // Find the message we just sent
        const message = await prisma.message.findFirst({
            where: { email: 'bot@verification.com' },
            orderBy: { createdAt: 'desc' }
        })

        if (message) {
            console.log(`✅ Message found: ${message.id} - ${message.subject}`)

            // Check for notification
            const notification = await prisma.notification.findFirst({
                where: { messageId: message.id }
            })

            if (notification) {
                console.log(`✅ Notification found: ${notification.id}`)
                console.log(`   Title: ${notification.title}`)
                console.log(`   Link: ${notification.link}`)
            } else {
                console.log('❌ No notification found for this message!')

                // Debug: Check if ANY notifications exist
                const count = await prisma.notification.count()
                console.log(`   (Total notifications in DB: ${count})`)
            }
        } else {
            console.log('❌ Message not found. API might have failed.')
        }
    } catch (e) {
        console.error('Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

check()
