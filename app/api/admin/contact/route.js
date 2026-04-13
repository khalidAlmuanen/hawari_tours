// ═══════════════════════════════════════════════════════════════
// 📞 CONTACT SETTINGS API - Admin Management
// مسار API لإدارة معلومات التواصل — يحفظ في قاعدة البيانات
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

const defaultSettings = {
    company: {
        nameEn: 'Hawari Tours',
        nameAr: 'هواري تورز',
        descriptionEn: 'Discover the wonders of Yemen',
        descriptionAr: 'اكتشف عجائب اليمن',
        heroTitleEn: 'Get in Touch',
        heroTitleAr: 'تواصل معنا',
        heroSubtitleEn: "We're available to answer your questions and help plan your perfect trip",
        heroSubtitleAr: 'نحن متواجدون للإجابة على استفساراتك ومساعدتك في التخطيط لرحلتك المثالية',
        logo: ''
    },
    contact: {
        emails: {
            info: 'info@hawaritours.com',
            support: 'support@hawaritours.com',
            booking: 'booking@hawaritours.com'
        },
        phones: {
            primary: '+967 1 234 567',
            secondary: '+967 7 890 123',
            whatsapp: '+967 777 123 456'
        },
        addresses: [
            {
                id: '1',
                titleEn: 'Main Office',
                titleAr: 'المكتب الرئيسي',
                addressEn: "Sana'a, Yemen",
                addressAr: 'صنعاء، اليمن',
                lat: '15.3694',
                lng: '44.1910',
                mapUrl: ''
            }
        ]
    },
    workingHours: {
        weekdays: {
            openEn: '9:00 AM - 6:00 PM',
            openAr: '9:00 ص - 6:00 م',
            daysEn: 'Sunday - Thursday',
            daysAr: 'الأحد - الخميس'
        },
        weekend: {
            openEn: '10:00 AM - 2:00 PM',
            openAr: '10:00 ص - 2:00 م',
            daysEn: 'Saturday',
            daysAr: 'السبت'
        },
        closedEn: 'Friday',
        closedAr: 'الجمعة'
    },
    socialMedia: {
        facebook: { url: '', followers: 0, active: true },
        instagram: { url: '', followers: 0, active: true },
        twitter: { url: '', followers: 0, active: true },
        youtube: { url: '', followers: 0, active: true },
        tiktok: { url: '', followers: 0, active: true },
        linkedin: { url: '', followers: 0, active: false }
    }
}

// ═══════════════════════════════════════════════════════════════
// GET — جلب إعدادات التواصل
// ═══════════════════════════════════════════════════════════════
export async function GET(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const record = await prisma.contactSetting.findFirst()
        const settings = record ? record.data : defaultSettings

        return NextResponse.json({ success: true, data: settings })
    } catch (error) {
        console.error('❌ Error fetching contact settings:', error)
        return NextResponse.json(
            { success: false, error: 'فشل في جلب إعدادات التواصل' },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// PUT — تحديث إعدادات التواصل
// ═══════════════════════════════════════════════════════════════
export async function PUT(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const body = await request.json()

        const existing = await prisma.contactSetting.findFirst()

        let record
        if (existing) {
            record = await prisma.contactSetting.update({
                where: { id: existing.id },
                data: { data: body }
            })
        } else {
            record = await prisma.contactSetting.create({
                data: { data: body }
            })
        }

        return NextResponse.json({
            success: true,
            message: 'تم حفظ إعدادات التواصل بنجاح ✅',
            data: record.data
        })
    } catch (error) {
        console.error('❌ Error updating contact settings:', error)
        return NextResponse.json(
            { success: false, error: 'فشل في حفظ إعدادات التواصل' },
            { status: 500 }
        )
    }
}
