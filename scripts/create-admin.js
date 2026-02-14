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

    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!')
      console.log('\n📧 Email:', adminData.email)
      console.log('🔑 You may need to reset the password\n')
      return
    }

    // Hash password
    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash(adminData.password, 10)

    // Create admin user
    console.log('📝 Creating admin user in database...')
    const admin = await prisma.user.create({
      data: {
        email: adminData.email,
        password: hashedPassword,
        name: adminData.name,
        role: adminData.role
      }
    })

    console.log('\n✅ Admin account created successfully!\n')
    console.log('═══════════════════════════════════════')
    console.log('📧 Email:    ', adminData.email)
    console.log('🔑 Password: ', adminData.password)
    console.log('👤 Name:     ', adminData.name)
    console.log('🎖️  Role:     ', adminData.role)
    console.log('═══════════════════════════════════════')
    console.log('\n✨ You can now login at: /admin/login\n')

    // Save credentials to file
    const fs = require('fs')
    const credentialsFile = 'ADMIN_CREDENTIALS.txt'
    const credentials = `
═══════════════════════════════════════════════════════════
🎉 ADMIN ACCOUNT CREATED SUCCESSFULLY
═══════════════════════════════════════════════════════════

📧 Email:    ${adminData.email}
🔑 Password: ${adminData.password}
👤 Name:     ${adminData.name}
🎖️  Role:     ${adminData.role}

🔗 Login URL: https://your-domain.vercel.app/admin/login

⚠️  IMPORTANT: Keep this file secure and delete it after saving credentials!

Created: ${new Date().toISOString()}
═══════════════════════════════════════════════════════════
`

    fs.writeFileSync(credentialsFile, credentials)
    console.log(`💾 Credentials saved to: ${credentialsFile}`)
    console.log('⚠️  Remember to delete this file after saving the credentials!\n')

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
