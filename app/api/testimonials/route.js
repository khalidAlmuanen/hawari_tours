
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


// GET - Fetch published testimonials (Public)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : undefined
        const featured = searchParams.get('featured') // 'true' or null

        // Build filtering
        const where = {
            published: true // STRICTLY published only
        }

        if (featured === 'true') {
            where.featured = true
        }

        const testimonials = await prisma.testimonial.findMany({
            where,
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' }
            ],
            take: limit, // Optional limit
            select: {
                id: true,
                customerName: true,
                customerNameAr: true,
                customerImage: true,
                country: true,
                countryAr: true,
                countryCode: true,
                content: true,
                contentAr: true,
                rating: true,
                tourName: true,
                tourNameAr: true,
                hasVideo: true,
                videoUrl: true,
                date: true,
                featured: true,
                verified: true
            }
        })

        return NextResponse.json({
            success: true,
            data: testimonials,
            count: testimonials.length
        })

    } catch (error) {
        console.error('❌ Error fetching public testimonials:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch testimonials' },
            { status: 500 }
        )
    }
}

// POST - Submit a new testimonial (Public)
export async function POST(request) {
    try {
        const body = await request.json()

        // Validation
        const email = typeof body.customerEmail === 'string' ? body.customerEmail.trim() : ''
        const phone = typeof body.customerPhone === 'string' ? body.customerPhone.trim() : ''
        const videoUrl = typeof body.videoUrl === 'string' ? body.videoUrl.trim() : ''
        const hasVideo = Boolean(body.hasVideo) || videoUrl.length > 0
        const rating = Number(body.rating)
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        if (!body.customerName || !body.content || !body.rating || !body.country || !body.countryAr || !email || !isEmailValid || !phone) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }
        if (hasVideo) {
            try {
                new URL(videoUrl)
            } catch {
                return NextResponse.json(
                    { success: false, error: 'Invalid video URL' },
                    { status: 400 }
                )
            }
        }
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return NextResponse.json(
                { success: false, error: 'Invalid rating' },
                { status: 400 }
            )
        }

        const testimonial = await prisma.testimonial.create({
            data: {
                customerName: body.customerName,
                customerNameAr: body.customerNameAr || null,
                customerEmail: email || null,
                customerPhone: phone || null,
                content: body.content,
                contentAr: body.contentAr || null,
                rating,
                country: body.country || 'Unknown',
                countryAr: body.countryAr || null,
                countryCode: body.countryCode || '',
                hasVideo,
                videoUrl: hasVideo ? videoUrl : null,
                date: body.date ? new Date(body.date) : new Date(),
                published: false, // Pending approval
                verified: false,
                featured: false
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Testimonial submitted successfully',
            data: testimonial
        })

    } catch (error) {
        console.error('❌ Error submitting testimonial:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to submit testimonial' },
            { status: 500 }
        )
    }
}
