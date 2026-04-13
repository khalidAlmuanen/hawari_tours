
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// ═══════════════════════════════════════════════════════════════
// ⚙️ BLOG SETTINGS API
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
    try {
        const settings = await prisma.blogSetting.findFirst()
        let data = settings || {}

        if (data && data.heroImage === undefined) {
            try {
                const result = await prisma.$queryRaw`SELECT "heroImage" FROM "blog_settings" LIMIT 1`
                const heroImage = Array.isArray(result) && result[0] ? result[0].heroImage : null
                data = { ...data, heroImage: heroImage ?? null }
            } catch (e) {
                data = { ...data, heroImage: null }
            }
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Error fetching blog settings:', error)
        return NextResponse.json(
            { success: false, error: 'فشل تحميل الإعدادات' },
            { status: 500 }
        )
    }
}

export async function PUT(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    const upsertSettings = async (data) => {
        const existing = await prisma.blogSetting.findFirst()
        if (existing) {
            return prisma.blogSetting.update({
                where: { id: existing.id },
                data
            })
        }
        return prisma.blogSetting.create({ data })
    }

    let data
    try {
        data = await request.json()

        // Ensure stats is an array
        const validStats = Array.isArray(data.stats) ? data.stats : []

        const heroImage = typeof data.heroImage === 'string' ? data.heroImage : null
        const settingsData = {
            heroImage,
            heroTitleAr: data.heroTitleAr,
            heroTitleEn: data.heroTitleEn,
            heroSubtitleAr: data.heroSubtitleAr,
            heroSubtitleEn: data.heroSubtitleEn,
            stats: validStats,
            newsletterTitleAr: data.newsletterTitleAr,
            newsletterTitleEn: data.newsletterTitleEn,
            newsletterTextAr: data.newsletterTextAr,
            newsletterTextEn: data.newsletterTextEn,
            writeTitleAr: data.writeTitleAr,
            writeTitleEn: data.writeTitleEn,
            writeTextAr: data.writeTextAr,
            writeTextEn: data.writeTextEn
        }

        try {
            const result = await upsertSettings(settingsData)
            return NextResponse.json({ success: true, data: result })
        } catch (innerError) {
            const innerMessage = String(innerError?.message || '')
            if (innerMessage.includes('Unknown argument `heroImage`')) {
                const { heroImage: _heroImage, ...fallbackData } = settingsData
                const result = await upsertSettings(fallbackData)
                if (heroImage) {
                    await prisma.$executeRaw`UPDATE "blog_settings" SET "heroImage" = ${heroImage} WHERE "id" = ${result.id}`
                } else {
                    await prisma.$executeRaw`UPDATE "blog_settings" SET "heroImage" = NULL WHERE "id" = ${result.id}`
                }
                return NextResponse.json({ success: true, data: result })
            }
            throw innerError
        }
    } catch (error) {
        const message = String(error?.message || '')
        const code = error?.code
        if ((message.includes('heroImage') && message.includes('column') && message.includes('does not exist')) || code === 'P2022') {
            try {
                await prisma.$executeRawUnsafe('ALTER TABLE "blog_settings" ADD COLUMN IF NOT EXISTS "heroImage" TEXT')
                const validStats = Array.isArray(data.stats) ? data.stats : []
                const settingsData = {
                    heroImage: typeof data.heroImage === 'string' ? data.heroImage : null,
                    heroTitleAr: data.heroTitleAr,
                    heroTitleEn: data.heroTitleEn,
                    heroSubtitleAr: data.heroSubtitleAr,
                    heroSubtitleEn: data.heroSubtitleEn,
                    stats: validStats,
                    newsletterTitleAr: data.newsletterTitleAr,
                    newsletterTitleEn: data.newsletterTitleEn,
                    newsletterTextAr: data.newsletterTextAr,
                    newsletterTextEn: data.newsletterTextEn,
                    writeTitleAr: data.writeTitleAr,
                    writeTitleEn: data.writeTitleEn,
                    writeTextAr: data.writeTextAr,
                    writeTextEn: data.writeTextEn
                }
                const result = await upsertSettings(settingsData)
                return NextResponse.json({ success: true, data: result })
            } catch (migrationError) {
                console.error('Error updating blog settings:', migrationError)
            }
        } else {
            console.error('Error updating blog settings:', error)
        }
        return NextResponse.json(
            { success: false, error: 'تعذر حفظ الإعدادات' },
            { status: 500 }
        )
    }
}
