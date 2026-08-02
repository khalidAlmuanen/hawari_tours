import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// GET: Fetch all packages (Admin)
export async function GET(request) {
    try {
        // await requireAuth(request) // Uncomment if auth is needed

        const packages = await prisma.travelPackage.findMany({
            orderBy: { order: 'asc' }
        })

        return NextResponse.json({ success: true, data: packages })
    } catch (error) {
        console.error('Error fetching packages:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch packages' },
            { status: 500 }
        )
    }
}

// POST: Create a new package
export async function POST(request) {
    try {
        await requireAuth(request)

        const body = await request.json()

        // Validation
        if (!body.title || !body.price || !body.duration) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const newPackage = await prisma.travelPackage.create({
            data: {
                title: body.title,
                titleAr: body.titleAr || body.title,
                price: parseFloat(body.price),
                duration: body.duration,
                durationAr: body.durationAr || body.duration,
                features: body.features || [],
                featuresAr: body.featuresAr || [],
                gradient: body.gradient || 'from-gray-500 to-gray-700',
                isPopular: body.isPopular || false,
                isFeatured: body.isFeatured || false,
                isActive: body.isActive !== undefined ? body.isActive : true,
                order: body.order || 0
            }
        })

        return NextResponse.json({ success: true, data: newPackage })
    } catch (error) {
        console.error('Error creating package:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create package' },
            { status: 500 }
        )
    }
}

// PUT: Update a package
export async function PUT(request) {
    try {
        await requireAuth(request)

        const body = await request.json()

        if (!body.id) {
            return NextResponse.json(
                { success: false, error: 'Package ID is required' },
                { status: 400 }
            )
        }

        const updatedPackage = await prisma.travelPackage.update({
            where: { id: body.id },
            data: {
                title: body.title,
                titleAr: body.titleAr,
                price: body.price ? parseFloat(body.price) : undefined,
                duration: body.duration,
                durationAr: body.durationAr,
                features: body.features,
                featuresAr: body.featuresAr,
                gradient: body.gradient,
                isPopular: body.isPopular,
                isFeatured: body.isFeatured,
                isActive: body.isActive,
                order: body.order
            }
        })

        return NextResponse.json({ success: true, data: updatedPackage })
    } catch (error) {
        console.error('Error updating package:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update package' },
            { status: 500 }
        )
    }
}

// DELETE: Delete a package
export async function DELETE(request) {
    try {
        await requireAuth(request)

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Package ID is required' },
                { status: 400 }
            )
        }

        await prisma.travelPackage.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: 'Package deleted successfully' })
    } catch (error) {
        console.error('Error deleting package:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete package' },
            { status: 500 }
        )
    }
}
