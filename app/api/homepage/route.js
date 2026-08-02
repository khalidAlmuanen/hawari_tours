import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const [heroSlides, quickStats, welcomeMessages, whyChooseUs] = await Promise.all([
            prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
            prisma.quickStat.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
            prisma.welcomeMessage.findMany({ where: { isActive: true }, orderBy: { updatedAt: 'desc' } }),
            prisma.whyChooseUs.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } })
        ])

        return NextResponse.json({
            success: true,
            data: { heroSlides, quickStats, welcomeMessages, whyChooseUs }
        })
    } catch (error) {
        console.error('Failed to fetch homepage content:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch homepage content' }, { status: 500 })
    }
}
