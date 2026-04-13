const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Starting admin account recovery...')

    try {
        // 1. Find all deactivated admins
        const deactivatedAdmins = await prisma.user.findMany({
            where: {
                role: { in: ['ADMIN', 'SUPER_ADMIN'] },
                isActive: false
            }
        })

        console.log(`Found ${deactivatedAdmins.length} deactivated admin(s).`)

        if (deactivatedAdmins.length === 0) {
            console.log('✅ No deactivated admins found. Checking all users...')
            // Fallback: Check if ANY user is deactivated just in case role was changed
            const deactivatedUsers = await prisma.user.findMany({
                where: { isActive: false }
            })
            console.log(`Found ${deactivatedUsers.length} total deactivated users.`)
        }

        // 2. Reactivate ALL admins/super_admins
        const updated = await prisma.user.updateMany({
            where: {
                role: { in: ['ADMIN', 'SUPER_ADMIN'] }
            },
            data: {
                isActive: true
            }
        })

        console.log(`✅ Successfully reactivated ${updated.count} admin accounts.`)

    } catch (error) {
        console.error('❌ Error during recovery:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
