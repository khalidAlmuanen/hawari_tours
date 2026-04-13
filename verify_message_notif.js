
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
    try {
        // 1. Simulate API call (since we can't fetch localhost easily from node without fetch polyfill in some envs, 
        // but here we can just use prisma to create message and see if logic works... 
        // Wait, the logic is in the API route, so I MUST call the API.
        // I'll use built-in fetch if available (Node 18+) or just assume I need to test via curl/powershell.
        // But I can check the DB after running the powershell command.

        // Check for latest message
        const message = await prisma.message.findFirst({
            orderBy: { createdAt: 'desc' }
        })

        if (message) {
            console.log('✅ Latest Message:', message.subject)

            // Check for notification linked to this message
            const notification = await prisma.notification.findFirst({
                where: { messageId: message.id }
            })

            if (notification) {
                console.log('✅ Notification found:', notification.title)
            } else {
                console.log('❌ No notification found for this message')
            }
        } else {
            console.log('❌ No messages found')
        }
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

check()
