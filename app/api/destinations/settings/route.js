import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// GET - Fetch page settings (Public)
export async function GET() {
    try {
        let settings = await prisma.destinationsPageSetting.findFirst()

        // Create default if not exists
        if (!settings) {
            settings = await prisma.destinationsPageSetting.create({
                data: {
                    heroImage: '/img/destinations/socotra-hero.jpg',
                    heroTitleEn: 'Tourist Destinations',
                    heroTitleAr: 'المعالم السياحية',
                    heroSubtitleEn: 'Explore over 50 unique tourist destinations in Socotra Island',
                    heroSubtitleAr: 'استكشف أكثر من 50 معلماً سياحياً فريداً في جزيرة سقطرى'
                }
            })
        }

        return NextResponse.json({
            success: true,
            data: settings
        })
    } catch (error) {
        console.error('Failed to fetch settings:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 })
    }
}

// POST - Update page settings (Admin only)
export async function POST(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const body = await request.json()
        const { heroImage, heroTitleEn, heroTitleAr, heroSubtitleEn, heroSubtitleAr } = body

        let settings = await prisma.destinationsPageSetting.findFirst()

        if (settings) {
            settings = await prisma.destinationsPageSetting.update({
                where: { id: settings.id },
                data: {
                    heroImage,
                    heroTitleEn,
                    heroTitleAr,
                    heroSubtitleEn,
                    heroSubtitleAr
                }
            })
        } else {
            settings = await prisma.destinationsPageSetting.create({
                data: {
                    heroImage,
                    heroTitleEn,
                    heroTitleAr,
                    heroSubtitleEn,
                    heroSubtitleAr
                }
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        })
    } catch (error) {
        console.error('Failed to update settings:', error)
        return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 })
    }
}
