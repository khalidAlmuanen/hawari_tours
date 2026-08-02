
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

export async function GET(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        let settings = await prisma.settings.findFirst()

        // If no settings exist, create default
        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    siteName: 'Hawari Tours',
                    siteNameAr: 'رحلات الحواري',
                    emailEnabled: false,
                    maintenanceMode: false
                }
            })
        }

        return NextResponse.json({
            success: true,
            data: settings
        })
    } catch (error) {
        console.error('Settings GET error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch settings' },
            { status: 500 }
        )
    }
}

export async function PUT(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const body = await request.json()

        // Remove id from body if present to avoid errors
        const { id, createdAt, updatedAt, ...updateData } = body

        // Check if settings exist
        const existingSettings = await prisma.settings.findFirst()

        let settings
        if (existingSettings) {
            settings = await prisma.settings.update({
                where: { id: existingSettings.id },
                data: updateData
            })
        } else {
            settings = await prisma.settings.create({
                data: updateData
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        })
    } catch (error) {
        console.error('Settings PUT error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update settings' },
            { status: 500 }
        )
    }
}
