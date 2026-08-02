// ═══════════════════════════════════════════════════════════════
// 💓 Keep-Alive Ping Endpoint — prevents cold starts
// /app/api/ping/route.js
// Used by UptimeRobot or cron-job.org to keep functions warm
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Lightweight query to warm up Prisma + DB connection
        await prisma.$queryRaw`SELECT 1`

        return NextResponse.json(
            {
                status: 'ok',
                timestamp: new Date().toISOString(),
                message: 'Server is alive and DB is connected 🟢'
            },
            {
                headers: { 'Cache-Control': 'no-store' }
            }
        )
    } catch (error) {
        console.error('[Ping] DB connection failed:', error.message)
        return NextResponse.json(
            { status: 'error', message: error.message },
            { status: 503 }
        )
    }
}
