import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// ⚠️ TEMPORARY CLEANUP ENDPOINT - حذف بيانات blogs القديمة
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
    try {
        console.log('🗑️  Starting blog data cleanup...')

        // حذف comments أولاً (foreign key)
        const deletedComments = await prisma.$executeRawUnsafe('DELETE FROM "comments"')
        console.log(`✅ Deleted ${deletedComments} comments`)

        // حذف blogs
        const deletedBlogs = await prisma.$executeRawUnsafe('DELETE FROM "blogs"')
        console.log(`✅ Deleted ${deletedBlogs} blogs`)

        return NextResponse.json({
            success: true,
            message: 'Cleanup completed successfully',
            deleted: {
                comments: deletedComments,
                blogs: deletedBlogs
            }
        })
    } catch (error) {
        console.error('❌ Error during cleanup:', error)

        // حاول الطريقة البديلة
        try {
            const c = await prisma.comment.deleteMany({})
            const b = await prisma.blog.deleteMany({})

            return NextResponse.json({
                success: true,
                message: 'Cleanup completed with alternative method',
                deleted: {
                    comments: c.count,
                    blogs: b.count
                }
            })
        } catch (altError) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Cleanup failed',
                    details: altError.message
                },
                { status: 500 }
            )
        }
    }
}
