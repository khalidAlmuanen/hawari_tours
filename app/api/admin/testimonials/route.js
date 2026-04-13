// ═══════════════════════════════════════════════════════════════
// 💬 TESTIMONIALS API - Admin Management
// مسار API لإدارة آراء العملاء
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


// ═══════════════════════════════════════════════════════════════
// GET - Fetch all testimonials with filters
// جلب جميع الشهادات مع الفلاتر
// ═══════════════════════════════════════════════════════════════
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const rating = searchParams.get('rating')
        const country = searchParams.get('country')
        const published = searchParams.get('published')
        const featured = searchParams.get('featured')
        const verified = searchParams.get('verified')

        // Build query filters
        const where = {}

        if (rating && rating !== 'all') {
            where.rating = parseInt(rating)
        }

        if (country && country !== 'all') {
            where.country = country
        }

        if (published && published !== 'all') {
            where.published = published === 'true'
        }

        if (featured && featured !== 'all') {
            where.featured = featured === 'true'
        }

        if (verified && verified !== 'all') {
            where.verified = verified === 'true'
        }

        const testimonials = await prisma.testimonial.findMany({
            where,
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' }
            ]
        })

        return NextResponse.json({
            success: true,
            data: testimonials,
            count: testimonials.length
        })

    } catch (error) {
        console.error('❌ Error fetching testimonials:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch testimonials' },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// POST - Create new testimonial
// إنشاء شهادة جديدة
// ═══════════════════════════════════════════════════════════════
export async function POST(request) {
    try {
        const body = await request.json()

        const testimonial = await prisma.testimonial.create({
            data: {
                customerName: body.customerName,
                customerNameAr: body.customerNameAr || null,
                customerEmail: body.customerEmail || null,
                customerImage: body.customerImage || null,
                country: body.country,
                countryAr: body.countryAr || null,
                countryCode: body.countryCode,
                content: body.content,
                contentAr: body.contentAr || null,
                rating: parseInt(body.rating),
                tourName: body.tourName || null,
                tourNameAr: body.tourNameAr || null,
                hasVideo: body.hasVideo || false,
                videoUrl: body.videoUrl || null,
                date: body.date ? new Date(body.date) : new Date(),
                featured: body.featured || false,
                verified: body.verified || false,
                published: body.published || false
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Testimonial created successfully',
            data: testimonial
        })

    } catch (error) {
        console.error('❌ Error creating testimonial:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create testimonial' },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update existing testimonial
// تحديث شهادة موجودة
// ═══════════════════════════════════════════════════════════════
export async function PUT(request) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Testimonial ID is required' },
                { status: 400 }
            )
        }

        // Prepare update data
        const data = {
            customerName: updateData.customerName,
            customerNameAr: updateData.customerNameAr || null,
            customerEmail: updateData.customerEmail || null,
            customerImage: updateData.customerImage || null,
            country: updateData.country,
            countryAr: updateData.countryAr || null,
            countryCode: updateData.countryCode,
            content: updateData.content,
            contentAr: updateData.contentAr || null,
            rating: parseInt(updateData.rating),
            tourName: updateData.tourName || null,
            tourNameAr: updateData.tourNameAr || null,
            hasVideo: updateData.hasVideo || false,
            videoUrl: updateData.videoUrl || null,
            featured: updateData.featured || false,
            verified: updateData.verified || false,
            published: updateData.published || false
        }

        if (updateData.date) {
            data.date = new Date(updateData.date)
        }

        const testimonial = await prisma.testimonial.update({
            where: { id },
            data
        })

        return NextResponse.json({
            success: true,
            message: 'Testimonial updated successfully',
            data: testimonial
        })

    } catch (error) {
        console.error('❌ Error updating testimonial:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update testimonial' },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Remove testimonial
// حذف شهادة
// ═══════════════════════════════════════════════════════════════
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Testimonial ID is required' },
                { status: 400 }
            )
        }

        await prisma.testimonial.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Testimonial deleted successfully'
        })

    } catch (error) {
        console.error('❌ Error deleting testimonial:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete testimonial' },
            { status: 500 }
        )
    }
}
