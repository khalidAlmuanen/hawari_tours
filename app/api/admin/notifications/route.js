
import { NextResponse } from 'next/server'
import { prisma, withRetry } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// ═══════════════════════════════════════════════════════════════
// 🔔 Notifications API
// /app/api/admin/notifications/route.js
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '20')
        const unreadOnly = searchParams.get('unreadOnly') === 'true'

        const where = unreadOnly ? { isRead: false } : {}

        // Safety check for stale Prisma Client (requires server restart)
        if (!prisma.notification) {
            console.warn('⚠️ Notification model missing. Restart server.')
            return NextResponse.json({
                success: true,
                data: { notifications: [], unreadCount: 0 }
            })
        }

        const [notifications, unreadCount] = await withRetry(() =>
            Promise.all([
                prisma.notification.findMany({
                    where,
                    orderBy: { createdAt: 'desc' },
                    take: limit
                }),
                prisma.notification.count({
                    where: { isRead: false }
                })
            ])
        )

        return NextResponse.json({
            success: true,
            data: {
                notifications,
                unreadCount
            }
        }, {
            headers: {
                'Cache-Control': 'no-store'
            }
        })
    } catch (error) {
        console.error('Notifications GET error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch notifications' },
            { status: 500 }
        )
    }
}

export async function PUT(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const body = await request.json()
        const { id, markAllRead } = body

        if (markAllRead) {
            await prisma.notification.updateMany({
                where: { isRead: false },
                data: { isRead: true }
            })

            return NextResponse.json({
                success: true,
                message: 'All notifications marked as read'
            })
        }

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Notification ID required' },
                { status: 400 }
            )
        }

        if (!prisma.notification) {
            return NextResponse.json({ success: false, error: 'Server restart required' }, { status: 503 })
        }

        const notification = await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        })

        return NextResponse.json({
            success: true,
            data: notification
        })
    } catch (error) {
        console.error('Notifications PUT error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update notification' },
            { status: 500 }
        )
    }
}
