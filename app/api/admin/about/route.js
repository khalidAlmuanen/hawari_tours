// ═══════════════════════════════════════════════════════════════
// 📖 About Page Admin API - Main Route
// واجهة برمجة التطبيقات لإدارة صفحة من نحن - لوحة التحكم
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// GET - جلب جميع أقسام صفحة من نحن
export async function GET(request) {
    // التحقق من الصلاحيات (اختياري للـ GET إذا كان عام، لكن هنا للوحة التحكم)
    // const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    // if (auth.error) return auth.error

    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const active = searchParams.get('active')

        // بناء شروط البحث
        const where = {}
        if (type) where.type = type
        if (active === 'true') where.isActive = true

        // جلب البيانات بشكل متوازي لتحسين الأداء
        const [aboutSections, endemicSpecies, culturalElements, settings] = await Promise.all([
            prisma.aboutSection.findMany({
                where,
                orderBy: { order: 'asc' }
            }),
            prisma.endemicSpecies.findMany({
                where: active === 'true' ? { isActive: true } : {},
                orderBy: { order: 'asc' }
            }),
            prisma.culturalElement.findMany({
                where: active === 'true' ? { isActive: true } : {},
                orderBy: { order: 'asc' }
            }),
            prisma.aboutPageSettings.findFirst()
        ])

        return NextResponse.json({
            success: true,
            data: {
                sections: aboutSections,
                species: endemicSpecies,
                cultural: culturalElements,
                settings: settings || {} // Return empty object if no settings yet
            }
        })
    } catch (error) {
        console.error('Error fetching about content:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch about content', details: error.message },
            { status: 500 }
        )
    }
}

// POST - إضافة محتوى جديد
export async function POST(request) {
    // التحقق من الصلاحيات
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const body = await request.json()
        const { contentType, data } = body

        if (!contentType || !data) {
            return NextResponse.json(
                { success: false, error: 'Missing contentType or data' },
                { status: 400 }
            )
        }

        let result
        const defaultData = {
            isActive: true,
            order: 0,
            ...data
        }

        switch (contentType) {
            case 'section':
                result = await prisma.aboutSection.create({ data: defaultData })
                break
            case 'species':
                // التأكد من أن facts مصفوفة
                if (defaultData.facts && !Array.isArray(defaultData.facts)) {
                    defaultData.facts = []
                }
                result = await prisma.endemicSpecies.create({ data: defaultData })
                break
            case 'cultural':
                result = await prisma.culturalElement.create({ data: defaultData })
                break
            case 'settings':
                // Check if settings exist, if so update, else create
                const existingSettings = await prisma.aboutPageSettings.findFirst()

                // Sanitize data (remove system fields)
                const settingsData = { ...data }
                delete settingsData.id
                delete settingsData.createdAt
                delete settingsData.updatedAt

                if (existingSettings) {
                    result = await prisma.aboutPageSettings.update({
                        where: { id: existingSettings.id },
                        data: settingsData
                    })
                } else {
                    result = await prisma.aboutPageSettings.create({ data: settingsData })
                }
                break
            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid content type' },
                    { status: 400 }
                )
        }

        return NextResponse.json({
            success: true,
            data: result,
            message: 'تم الحفظ بنجاح' // 'Saved successfully'
        })
    } catch (error) {
        console.error('Error creating about content:', error)

        // تحسين رسائل الخطأ
        let errorMessage = 'Failed to create content'
        if (error.code === 'P2002') {
            errorMessage = 'A record with this unique field already exists'
        }

        return NextResponse.json(
            { success: false, error: errorMessage, details: error.message },
            { status: 500 }
        )
    }
}

// PUT - تحديث محتوى موجود
export async function PUT(request) {
    // التحقق من الصلاحيات
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const body = await request.json()
        const { contentType, id, data } = body

        if (!id || !contentType || !data) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields (id, contentType, or data)' },
                { status: 400 }
            )
        }

        let result

        // إزالة الحقول التي لا يجب تحديثها (مثل id, createdAt)
        const updateData = { ...data }
        delete updateData.id
        delete updateData.createdAt
        delete updateData.updatedAt

        switch (contentType) {
            case 'section':
                result = await prisma.aboutSection.update({
                    where: { id },
                    data: updateData
                })
                break
            case 'species':
                if (updateData.facts && !Array.isArray(updateData.facts)) {
                    // إذا لم تكن مصفوفة، تجاهلها أو حولها
                    delete updateData.facts
                }
                result = await prisma.endemicSpecies.update({
                    where: { id },
                    data: updateData
                })
                break
            case 'cultural':
                result = await prisma.culturalElement.update({
                    where: { id },
                    data: updateData
                })
                break
            case 'settings':
                const existingSettings = await prisma.aboutPageSettings.findFirst()
                if (existingSettings) {
                    result = await prisma.aboutPageSettings.update({
                        where: { id: existingSettings.id },
                        data: updateData
                    })
                } else {
                    result = await prisma.aboutPageSettings.create({ data: updateData })
                }
                break
            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid content type' },
                    { status: 400 }
                )
        }

        return NextResponse.json({
            success: true,
            data: result,
            message: 'تم تحديث المحتوى بنجاح' // 'Content updated successfully'
        })
    } catch (error) {
        console.error('Error updating about content:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update content', details: error.message },
            { status: 500 }
        )
    }
}

// DELETE - حذف محتوى
export async function DELETE(request) {
    // التحقق من الصلاحيات
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const { searchParams } = new URL(request.url)
        const contentType = searchParams.get('contentType')
        const id = searchParams.get('id')

        if (!id || !contentType) {
            return NextResponse.json(
                { success: false, error: 'Missing required parameters (contentType, id)' },
                { status: 400 }
            )
        }

        switch (contentType) {
            case 'section':
                await prisma.aboutSection.delete({ where: { id } })
                break
            case 'species':
                await prisma.endemicSpecies.delete({ where: { id } })
                break
            case 'cultural':
                await prisma.culturalElement.delete({ where: { id } })
                break
            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid content type' },
                    { status: 400 }
                )
        }

        return NextResponse.json({
            success: true,
            message: 'تم حذف المحتوى بنجاح' // 'Content deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting about content:', error)

        if (error.code === 'P2025') {
            return NextResponse.json(
                { success: false, error: 'Record not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { success: false, error: 'Failed to delete content', details: error.message },
            { status: 500 }
        )
    }
}
