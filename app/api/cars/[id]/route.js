import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        const car = await prisma.car.findFirst({
            where: {
                OR: [
                    { id: id },
                    { slug: id }
                ]
            }
        });

        if (!car) {
            return NextResponse.json(
                { error: 'Car not found' },
                { status: 404 }
            );
        }

        // Increment view count if it's a GET request without auth check
        await prisma.car.update({
            where: { id: car.id },
            data: { viewsCount: { increment: 1 } },
        });

        return NextResponse.json({ success: true, data: car });
    } catch (error) {
        console.error('Car fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch car' },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        const authHeader = req.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }
        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)
        if (!decoded || !decoded.userId || decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params;
        const data = await req.json();

        const updateData = {
            name: data.name,
            nameAr: data.nameAr,
            slug: data.slug,
            description: data.description,
            descriptionAr: data.descriptionAr,
            brand: data.brand,
            type: data.type,
            year: data.year ? parseInt(data.year) : null,
            pricePerDay: parseFloat(data.pricePerDay),
            discount: data.discount ? parseFloat(data.discount) : 0,
            seats: parseInt(data.seats),
            doors: parseInt(data.doors),
            transmission: data.transmission,
            fuelType: data.fuelType,
            status: data.status,
            featured: data.featured,
            coverImage: data.coverImage,
            images: data.images,
            videoUrl: data.videoUrl,
            features: data.features,
            featuresAr: data.featuresAr,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            keywords: data.keywords,
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(
            key => updateData[key] === undefined && delete updateData[key]
        );

        const updatedCar = await prisma.car.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ success: true, data: updatedCar });
    } catch (error) {
        console.error('Car update error:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Car not found' },
                { status: 404 }
            );
        }
        if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
            return NextResponse.json(
                { error: 'A car with this slug already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to update car' },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        const authHeader = req.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }
        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)
        if (!decoded || !decoded.userId || (decoded.role !== 'SUPER_ADMIN' && decoded.role !== 'ADMIN')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params;

        await prisma.car.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Car delete error:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Car not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to delete car' },
            { status: 500 }
        );
    }
}
