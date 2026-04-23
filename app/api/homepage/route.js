import { NextResponse } from 'next/server'
import prisma, { withRetry } from '@/lib/prisma'

// ───────────────────────────────────────────────────────────────
// Runtime: Node.js (Prisma requires it).
// Revalidate every 60s — content is edge-cached for snappy loads,
// and refreshed in the background by Next's ISR.
// ───────────────────────────────────────────────────────────────
export const runtime = 'nodejs'
export const revalidate = 60

export async function GET() {
    try {
        const [heroSlides, quickStats, welcomeMessages, whyChooseUs] =
            await withRetry(() =>
                Promise.all([
                    prisma.heroSlide.findMany({
                        where: { isActive: true },
                        orderBy: { order: 'asc' },
                    }),
                    prisma.quickStat.findMany({
                        where: { isActive: true },
                        orderBy: { order: 'asc' },
                    }),
                    prisma.welcomeMessage.findMany({
                        where: { isActive: true },
                        orderBy: { updatedAt: 'desc' },
                    }),
                    prisma.whyChooseUs.findMany({
                        where: { isActive: true },
                        orderBy: { order: 'asc' },
                    }),
                ])
            )

        return NextResponse.json(
            {
                success: true,
                data: { heroSlides, quickStats, welcomeMessages, whyChooseUs },
            },
            {
                headers: {
                    // CDN caches for 60s, serves stale up to 5 min while revalidating.
                    'Cache-Control':
                        'public, s-maxage=60, stale-while-revalidate=300',
                },
            }
        )
    } catch (error) {
        console.error('[/api/homepage] Failed to fetch homepage content:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch homepage content',
                // Surface the root cause in non-production for quick debugging.
                details:
                    process.env.NODE_ENV === 'production'
                        ? undefined
                        : error?.message,
            },
            { status: 500 }
        )
    }
}
