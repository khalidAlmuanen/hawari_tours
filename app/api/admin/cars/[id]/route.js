import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// ═══════════════════════════════════════════════════════════════
// GET - Get single car for admin area
// ═══════════════════════════════════════════════════════════════

export async function GET(request, { params }) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const { id } = await params
        
        const car = await prisma.car.findUnique({
            where: { id }
        })

        if (!car) {
            return NextResponse.json(
                { success: false, error: 'Car not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: car
        })

    } catch (error) {
        console.error('Admin Car GET error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch car', details: error.message },
            { status: 500 }
        )
    }
}
