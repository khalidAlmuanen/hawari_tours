import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/apiAuth';

export async function GET() {
    try {
        let settings = await prisma.carsPageSetting.findFirst();

        if (!settings) {
            // Create default settings if none exist
            settings = await prisma.carsPageSetting.create({
                data: {},
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Cars settings fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        // Authenticate using the standard helper
        // This handles both cookies (admin panel) and bearer tokens (API)
        const auth = await requireAuth(req, ['ADMIN', 'SUPER_ADMIN']);
        if (auth.error) {
            return auth.error;
        }

        const data = await req.json();
        let settings = await prisma.carsPageSetting.findFirst();

        if (!settings) {
            settings = await prisma.carsPageSetting.create({
                data,
            });
        } else {
            settings = await prisma.carsPageSetting.update({
                where: { id: settings.id },
                data,
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Cars settings update error:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
