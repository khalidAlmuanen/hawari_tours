// ═══════════════════════════════════════════════════════════════
// 💬 REVIEWS MANAGEMENT API - Admin
// مسار API لإدارة تقييمات الرحلات
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


// ═══════════════════════════════════════════════════════════════
// GET - Fetch Reviews with Filters
// ═══════════════════════════════════════════════════════════════
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const approved = searchParams.get('approved') // 'true' / 'false' / null (all)
        const rating = searchParams.get('rating') // '1' through '5'
        const tourId = searchParams.get('tourId')
        const search = searchParams.get('search')

        // Build where clause
        const where = {}

        if (approved !== null && approved !== 'all') {
            where.approved = approved === 'true'
        }

        if (rating) {
            where.rating = parseInt(rating)
        }

        if (tourId) {
            where.tourId = tourId
        }

        if (search) {
            where.OR = [
                { comment: { contains: search, mode: 'insensitive' } },
                { title: { contains: search, mode: 'insensitive' } },
                { user: { name: { contains: search, mode: 'insensitive' } } }
            ]
        }

        // Fetch reviews with relations
        const reviews = await prisma.review.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                tour: {
                    select: {
                        id: true,
                        title: true,
                        titleAr: true,
                        slug: true,
                        coverImage: true
                    }
                }
            },
            orderBy: [
                { createdAt: 'desc' }
            ]
        })

        // Get stats
        const totalReviews = await prisma.review.count()
        const approvedReviews = await prisma.review.count({ where: { approved: true } })
        const pendingReviews = await prisma.review.count({ where: { approved: false } })

        const avgRating = await prisma.review.aggregate({
            _avg: { rating: true }
        })

        const ratingDistribution = await prisma.review.groupBy({
            by: ['rating'],
            _count: { rating: true }
        })

        return NextResponse.json({
            success: true,
            data: reviews,
            stats: {
                total: totalReviews,
                approved: approvedReviews,
                pending: pendingReviews,
                avgRating: avgRating._avg.rating || 0,
                ratingDistribution
            },
            count: reviews.length
        })

    } catch (error) {
        console.error('❌ Error fetching reviews:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch reviews' },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// POST - Create New Review (Admin can create on behalf)
// ═══════════════════════════════════════════════════════════════
export async function POST(request) {
    try {
        const body = await request.json()
        const { userId, tourId, rating, title, comment, approved } = body

        // Validation
        if (!userId || !tourId || !rating || !comment) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { success: false, error: 'Rating must be between 1 and 5' },
                { status: 400 }
            )
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                userId,
                tourId,
                rating,
                title: title || null,
                comment,
                approved: approved || false
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                tour: {
                    select: {
                        id: true,
                        title: true,
                        titleAr: true
                    }
                }
            }
        })

        // Update tour rating statistics
        await updateTourRating(tourId)

        return NextResponse.json({
            success: true,
            message: 'Review created successfully',
            data: review
        })

    } catch (error) {
        console.error('❌ Error creating review:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create review' },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update Review (Approve/Reject or Edit)
// ═══════════════════════════════════════════════════════════════
export async function PUT(request) {
    try {
        const body = await request.json()
        const { id, approved, rating, title, comment, helpfulCount } = body

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Review ID is required' },
                { status: 400 }
            )
        }

        // Build update data
        const updateData = {}

        if (approved !== undefined) updateData.approved = approved
        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return NextResponse.json(
                    { success: false, error: 'Rating must be between 1 and 5' },
                    { status: 400 }
                )
            }
            updateData.rating = rating
        }
        if (title !== undefined) updateData.title = title
        if (comment !== undefined) updateData.comment = comment
        if (helpfulCount !== undefined) updateData.helpfulCount = helpfulCount

        const review = await prisma.review.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                tour: {
                    select: {
                        id: true,
                        title: true,
                        titleAr: true
                    }
                }
            }
        })

        // Update tour rating if rating changed
        if (rating !== undefined) {
            await updateTourRating(review.tourId)
        }

        return NextResponse.json({
            success: true,
            message: 'Review updated successfully',
            data: review
        })

    } catch (error) {
        console.error('❌ Error updating review:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update review' },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Delete Review
// ═══════════════════════════════════════════════════════════════
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Review ID is required' },
                { status: 400 }
            )
        }

        // Get review to know tourId before deletion
        const review = await prisma.review.findUnique({
            where: { id },
            select: { tourId: true }
        })

        if (!review) {
            return NextResponse.json(
                { success: false, error: 'Review not found' },
                { status: 404 }
            )
        }

        await prisma.review.delete({
            where: { id }
        })

        // Update tour rating
        await updateTourRating(review.tourId)

        return NextResponse.json({
            success: true,
            message: 'Review deleted successfully'
        })

    } catch (error) {
        console.error('❌ Error deleting review:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete review' },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Update Tour Rating Statistics
// ═══════════════════════════════════════════════════════════════
async function updateTourRating(tourId) {
    try {
        // Calculate average rating from approved reviews only
        const stats = await prisma.review.aggregate({
            where: {
                tourId,
                approved: true
            },
            _avg: { rating: true },
            _count: { rating: true }
        })

        await prisma.tour.update({
            where: { id: tourId },
            data: {
                rating: stats._avg.rating || 0,
                reviewsCount: stats._count.rating || 0
            }
        })
    } catch (error) {
        console.error('Error updating tour rating:', error)
    }
}
