import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const [timelineEvents, archaeologicalSites, historicalSections, pageSettings] = await Promise.all([
            prisma.timelineEvent.findMany({
                where: { isActive: true },
                orderBy: { order: 'asc' }
            }),
            prisma.archaeologicalSite.findMany({
                where: { isActive: true },
                orderBy: { order: 'asc' }
            }),
            prisma.historicalSection.findMany({
                where: { isActive: true }
            }),
            prisma.historyPageSetting.findFirst()
        ])

        // Convert sections array to object keyed by slug
        const sectionsMap = historicalSections.reduce((acc, section) => {
            acc[section.slug] = section
            return acc
        }, {})

        return NextResponse.json({
            success: true,
            data: {
                timelineEvents,
                archaeologicalSites,
                historicalSections: sectionsMap,
                pageSettings: pageSettings || {}
            }
        })
    } catch (error) {
        console.error('Error fetching history data:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch history data' },
            { status: 500 }
        )
    }
}
