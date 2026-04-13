import { prisma } from '@/lib/prisma'

export async function POST(request) {
    try {
        const { email } = await request.json()

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return Response.json({ success: false, error: 'Invalid email' }, { status: 400 })
        }

        // Here we would typically save to a database or mailing list provider
        // For now, we'll just log it and notify admin
        console.log(`📧 New Newsletter Subscriber: ${email}`)

        // Create Admin Notification
        try {
            if (prisma.notification) {
                await prisma.notification.create({
                    data: {
                        type: 'SYSTEM',
                        title: '📬 مشترك جديد في النشرة',
                        message: `اشتراك جديد بالبريد: ${email}`,
                        link: '#',
                        isRead: false
                    }
                })
            }
        } catch (e) {
            console.error('Failed to create notification for newsletter:', e)
        }

        return Response.json({ success: true, message: 'Subscribed successfully' })
    } catch (error) {
        console.error('Newsletter subscription error:', error)
        return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
