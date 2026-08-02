import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// 📖 ABOUT PAGE API (Read-Only) - For Public Frontend
// ═══════════════════════════════════════════════════════════════

export async function GET() {
    try {
        const [sections, species, cultural, settings] = await Promise.all([
            prisma.aboutSection.findMany({
                where: { isActive: true },
                orderBy: { order: 'asc' }
            }),
            prisma.endemicSpecies.findMany({
                where: { isActive: true },
                orderBy: { nameEn: 'asc' }
            }),
            prisma.culturalElement.findMany({
                where: { isActive: true },
                orderBy: { order: 'asc' }
            }),
            prisma.aboutPageSettings.findFirst()
        ])

        return NextResponse.json({
            success: true,
            data: { sections, species, cultural, settings: settings || {} }
        })
    } catch (error) {
        console.error('Error fetching about data:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch about data' },
            { status: 500 }
        )
    }
}
