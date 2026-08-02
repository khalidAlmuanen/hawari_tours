import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : undefined;
        const featured = searchParams.get('featured') === 'true';
        const status = searchParams.get('status') || 'ACTIVE';

        const where = {
            status
        };

        if (featured) {
            where.featured = true;
        }

        const cars = await prisma.car.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });

        return NextResponse.json({ success: true, data: cars });
    } catch (error) {
        console.error('Cars fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cars' },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const authHeader = req.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }
        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)
        if (!decoded || !decoded.userId || (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const data = await req.json();

        const newCar = await prisma.car.create({
            data: {
                name: data.name,
                nameAr: data.nameAr,
                slug: data.slug,
                description: data.description,
                descriptionAr: data.descriptionAr,
                brand: data.brand || null,
                type: data.type,
                year: data.year ? parseInt(data.year) : null,
                pricePerDay: parseFloat(data.pricePerDay),
                discount: data.discount ? parseFloat(data.discount) : 0,
                seats: parseInt(data.seats) || 4,
                doors: parseInt(data.doors) || 4,
                transmission: data.transmission || 'Automatic',
                fuelType: data.fuelType || null,
                status: data.status || 'ACTIVE',
                featured: data.featured || false,
                coverImage: data.coverImage,
                images: data.images || [],
                videoUrl: data.videoUrl || null,
                features: data.features || [],
                featuresAr: data.featuresAr || [],
                metaTitle: data.metaTitle || null,
                metaDescription: data.metaDescription || null,
                keywords: data.keywords || [],
            },
        });

        return NextResponse.json(newCar, { status: 201 });
    } catch (error) {
        console.error('Car creation error:', error);
        // Handle unique constraint violations
        if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
            return NextResponse.json(
                { error: 'A car with this slug already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create car' },
            { status: 500 }
        );
    }
}
