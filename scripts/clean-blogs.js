// Script لحذف جميع بيانات blogs و comments - مع تحميل .env يدوياً
require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🗑️  Starting cleanup...')
    console.log('📝 DATABASE_URL:', process.env.DATABASE_URL ? '✅ Found' : '❌ Missing')

    try {
        // حذف comments أولاً (لأن فيها foreign key)
        const deletedComments = await prisma.$executeRaw`DELETE FROM "comments"`
        console.log(`✅ Deleted ${deletedComments} comments`)

        // حذف blogs
        const deletedBlogs = await prisma.$executeRaw`DELETE FROM "blogs"`
        console.log(`✅ Deleted ${deletedBlogs} blogs`)

        console.log('🎉 Cleanup completed successfully!')
    } catch (error) {
        console.error('❌ Error during cleanup:', error.message)

        // حاول حذف باستخدام deleteMany كبديل
        try {
            console.log('\n🔄 Trying alternative method...')
            const c = await prisma.comment.deleteMany({})
            console.log(`✅ Deleted ${c.count} comments (alternative)`)

            const b = await prisma.blog.deleteMany({})
            console.log(`✅ Deleted ${b.count} blogs (alternative)`)

            console.log('🎉 Cleanup completed with alternative method!')
        } catch (altError) {
            console.error('❌ Alternative method also failed:', altError.message)
        }
    } finally {
        await prisma.$disconnect()
    }
}

main()
