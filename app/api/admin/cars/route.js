import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// ═══════════════════════════════════════════════════════════════
// GET - Get all cars with filters, search, pagination
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const { searchParams } = new URL(request.url)

        // Pagination
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        // Filters
        const type = searchParams.get('type')
        const featured = searchParams.get('featured')
        const search = searchParams.get('search')
        const sortBy = searchParams.get('sortBy') || 'createdAt'
        const sortOrder = searchParams.get('sortOrder') || 'desc'

        // Build where clause
        const where = {
            AND: [
                search ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { nameAr: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } }
                    ]
                } : {},
                type && type !== 'all' ? { type } : {},
                featured !== null && featured !== '' ? { featured: featured === 'true' } : {}
            ]
        }

        // Execute queries
        const [cars, total] = await Promise.all([
            prisma.car.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    _count: {
                        select: {
                            bookings: true
                        }
                    }
                }
            }),
            prisma.car.count({ where })
        ])

        return NextResponse.json({
            success: true,
            data: {
                cars,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasMore: page * limit < total
                }
            }
        })

    } catch (error) {
        console.error('Cars GET error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch cars', details: error.message },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// POST - Create new car
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const body = await request.json()

        // Validate required fields
        const required = ['name', 'nameAr', 'description', 'descriptionAr', 'pricePerDay', 'type']
        for (const field of required) {
            if (!body[field]) {
                return NextResponse.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                )
            }
        }

        const slug = body.slug || body.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        const car = await prisma.car.create({
            data: {
                name: body.name,
                nameAr: body.nameAr,
                slug,
                description: body.description,
                descriptionAr: body.descriptionAr,
                brand: body.brand || null,
                type: body.type,
                year: body.year ? parseInt(body.year) : null,
                pricePerDay: parseFloat(body.pricePerDay),
                discount: body.discount ? parseFloat(body.discount) : 0,
                seats: body.seats ? parseInt(body.seats) : 4,
                doors: body.doors ? parseInt(body.doors) : 4,
                transmission: body.transmission || 'Automatic',
                fuelType: body.fuelType || null,
                featured: body.featured || false,
                status: body.status || 'ACTIVE',

                // Media
                coverImage: body.coverImage || '',
                images: body.images || [],
                videoUrl: body.videoUrl || null,

                // Features
                features: body.features || [],
                featuresAr: body.featuresAr || [],

                // Professional Rental Details
                insurance: body.insurance || 'Basic',
                insuranceAr: body.insuranceAr || 'تأمين أساسي',
                mileage: body.mileage || 'Unlimited',
                mileageAr: body.mileageAr || 'غير محدود',
                color: body.color || null,
                colorAr: body.colorAr || null,
                minAge: body.minAge ? parseInt(body.minAge) : 21,
                deposit: body.deposit ? parseFloat(body.deposit) : 0,
                luggage: body.luggage ? parseInt(body.luggage) : 2,

                // SEO
                metaTitle: body.metaTitle || null,
                metaDescription: body.metaDescription || null,
                keywords: body.keywords || []
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Car created successfully',
            data: car
        }, { status: 201 })

    } catch (error) {
        console.error('Cars POST error:', error)
        if (error.code === 'P2002') {
            return NextResponse.json(
                { success: false, error: 'Car with this slug already exists' },
                { status: 409 }
            )
        }
        return NextResponse.json(
            { success: false, error: 'DB Error: ' + error.message, details: error.message },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update car
// ═══════════════════════════════════════════════════════════════

export async function PUT(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const body = await request.json()
        const { id } = body

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Car ID is required' },
                { status: 400 }
            )
        }

        // Check if car exists
        const existingCar = await prisma.car.findUnique({ where: { id } })
        if (!existingCar) {
            return NextResponse.json(
                { success: false, error: 'Car not found' },
                { status: 404 }
            )
        }

        const car = await prisma.car.update({
            where: { id },
            data: {
                ...(body.name && { name: body.name }),
                ...(body.nameAr && { nameAr: body.nameAr }),
                ...(body.slug && { slug: body.slug }),
                ...(body.description && { description: body.description }),
                ...(body.descriptionAr && { descriptionAr: body.descriptionAr }),
                ...(body.brand !== undefined && { brand: body.brand }),
                ...(body.type && { type: body.type }),
                ...(body.year !== undefined && { year: body.year ? parseInt(body.year) : null }),
                ...(body.pricePerDay !== undefined && { pricePerDay: parseFloat(body.pricePerDay) }),
                ...(body.discount !== undefined && { discount: parseFloat(body.discount) }),
                ...(body.seats !== undefined && { seats: parseInt(body.seats) }),
                ...(body.doors !== undefined && { doors: parseInt(body.doors) }),
                ...(body.transmission && { transmission: body.transmission }),
                ...(body.fuelType !== undefined && { fuelType: body.fuelType }),
                ...(body.featured !== undefined && { featured: body.featured }),
                ...(body.status && { status: body.status }),

                ...(body.coverImage && { coverImage: body.coverImage }),
                ...(body.images && { images: body.images }),
                ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),

                ...(body.features && { features: body.features }),
                ...(body.featuresAr && { featuresAr: body.featuresAr }),

                // Professional Rental Details
                ...(body.insurance !== undefined && { insurance: body.insurance }),
                ...(body.insuranceAr !== undefined && { insuranceAr: body.insuranceAr }),
                ...(body.mileage !== undefined && { mileage: body.mileage }),
                ...(body.mileageAr !== undefined && { mileageAr: body.mileageAr }),
                ...(body.color !== undefined && { color: body.color }),
                ...(body.colorAr !== undefined && { colorAr: body.colorAr }),
                ...(body.minAge !== undefined && { minAge: parseInt(body.minAge) }),
                ...(body.deposit !== undefined && { deposit: parseFloat(body.deposit) }),
                ...(body.luggage !== undefined && { luggage: parseInt(body.luggage) }),

                ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle }),
                ...(body.metaDescription !== undefined && { metaDescription: body.metaDescription }),
                ...(body.keywords && { keywords: body.keywords })
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Car updated successfully',
            data: car
        })

    } catch (error) {
        console.error('Cars PUT error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update car', details: error.message },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Delete car
// ═══════════════════════════════════════════════════════════════

export async function DELETE(request) {
    const auth = await requireAuth(request, ['SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Car ID is required' },
                { status: 400 }
            )
        }

        // Check if car exists & has bookings
        const car = await prisma.car.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { bookings: true }
                }
            }
        })

        if (!car) {
            return NextResponse.json(
                { success: false, error: 'Car not found' },
                { status: 404 }
            )
        }

        if (car._count.bookings > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Cannot delete car with existing bookings',
                    suggestion: 'Consider deactivating instead'
                },
                { status: 409 }
            )
        }

        await prisma.car.delete({ where: { id } })

        return NextResponse.json({
            success: true,
            message: 'Car deleted successfully'
        })

    } catch (error) {
        console.error('Cars DELETE error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete car', details: error.message },
            { status: 500 }
        )
    }
}
