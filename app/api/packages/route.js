import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const packages = await prisma.travelPackage.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        })

        return NextResponse.json({ success: true, data: packages }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
            }
        })
    } catch (error) {
        console.error('Error fetching public packages:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch packages' },
            { status: 500 }
        )
    }
}
