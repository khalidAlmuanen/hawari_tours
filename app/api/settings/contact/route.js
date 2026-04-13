// ═══════════════════════════════════════════════════════════════
// 📞 CONTACT SETTINGS - Public API
// يجلب إعدادات التواصل العامة من قاعدة البيانات
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const defaultSettings = {
    company: {
        nameEn: 'Hawari Tours',
        nameAr: 'هواري تورز',
        heroTitleEn: 'Get in Touch',
        heroTitleAr: 'تواصل معنا',
        heroSubtitleEn: "We're available to answer your questions",
        heroSubtitleAr: 'نحن متواجدون للإجابة على استفساراتك',
        logo: ''
    },
    contact: {
        emails: { info: '', support: '', booking: '' },
        phones: { primary: '', secondary: '', whatsapp: '' },
        addresses: []
    },
    workingHours: {
        weekdays: { openEn: '', openAr: '', daysEn: '', daysAr: '' },
        weekend: { openEn: '', openAr: '', daysEn: '', daysAr: '' },
        closedEn: '',
        closedAr: ''
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

export async function GET() {
    try {
        const record = await prisma.contactSetting.findFirst()
        const settings = record ? record.data : defaultSettings

        return NextResponse.json(
            { success: true, data: settings },
            { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
        )
    } catch (error) {
        console.error('❌ Error fetching public contact settings:', error)
        return NextResponse.json(
            { success: false, error: 'فشل في جلب بيانات التواصل' },
            { status: 500 }
        )
    }
}
