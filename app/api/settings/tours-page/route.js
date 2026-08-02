
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'  // Adjust based on your auth implementation

// ═══════════════════════════════════════════════════════════════
// GET - Get Tours Page Settings
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
    try {
        let settings = await prisma.toursPageSetting.findFirst()

        if (!settings) {
            settings = await prisma.toursPageSetting.create({
                data: {} // Use defaults
            })
        }

        return NextResponse.json({
            success: true,
            data: settings
        })
    } catch (error) {
        console.error('Tours Page Settings GET error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch settings' },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update Tours Page Settings
// ═══════════════════════════════════════════════════════════════

export async function PUT(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const body = await request.json()
        let settings = await prisma.toursPageSetting.findFirst()

        if (!settings) {
            settings = await prisma.toursPageSetting.create({
                data: {
                    heroTitleEn: body.heroTitleEn,
                    heroTitleAr: body.heroTitleAr,
                    heroSubtitleEn: body.heroSubtitleEn,
                    heroSubtitleAr: body.heroSubtitleAr,
                    heroImage: body.heroImage
                }
            })
        } else {
            settings = await prisma.toursPageSetting.update({
                where: { id: settings.id },
                data: {
                    heroTitleEn: body.heroTitleEn,
                    heroTitleAr: body.heroTitleAr,
                    heroSubtitleEn: body.heroSubtitleEn,
                    heroSubtitleAr: body.heroSubtitleAr,
                    heroImage: body.heroImage,
                    // New Fields
                    specialOffers: body.specialOffers || [],
                    categoriesTitleEn: body.categoriesTitleEn,
                    categoriesTitleAr: body.categoriesTitleAr,
                    categoriesSubtitleEn: body.categoriesSubtitleEn,
                    categoriesSubtitleAr: body.categoriesSubtitleAr
                }
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        })

    } catch (error) {
        console.error('Tours Page Settings PUT error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update settings' },
            { status: 500 }
        )
    }
}
