// ═══════════════════════════════════════════════════════════════
// 👤 Create Admin Account Script
// سكريبت إنشاء حساب مدير
// ═══════════════════════════════════════════════════════════════

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  console.log('👤 Creating Admin Account...\n')

  try {
    // Admin details
    const adminData = {
      email: 'admin@hawaritours.com',
      password: 'HawariAdmin2026!',
      name: 'Hawari Tours Admin',
      role: 'SUPER_ADMIN'
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email }
    })

    // Hash password
    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash(adminData.password, 10)

    if (existingAdmin) {
      console.log('🔁 Admin account exists. Updating credentials...')
      await prisma.user.update({
        where: { email: adminData.email },
        data: {
          password: hashedPassword,
          name: adminData.name,
          role: adminData.role
        }
      })
    } else {
      // Create admin user
      console.log('📝 Creating admin user in database...')
      await prisma.user.create({
        data: {
          email: adminData.email,
          password: hashedPassword,
          name: adminData.name,
          role: adminData.role
        }
      })
    }

    console.log('\n✅ Admin credentials are ready!\n')
    console.log('═══════════════════════════════════════')
    console.log('📧 Email:    ', adminData.email)
    console.log('🔑 Password: ', adminData.password)
    console.log('👤 Name:     ', adminData.name)
    console.log('🎖️  Role:     ', adminData.role)
    console.log('═══════════════════════════════════════')
    console.log('\n✨ You can now login at: /admin/login\n')

  } catch (error) {
    console.error('❌ Error creating admin:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
