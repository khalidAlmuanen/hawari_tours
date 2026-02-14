// ═══════════════════════════════════════════════════════════════
// 🌱 Database Seed - FIXED PASSWORD
// /prisma/seed.js
// ═══════════════════════════════════════════════════════════════

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...\n')

  // Clean existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.review.deleteMany().catch(() => {})
  await prisma.booking.deleteMany().catch(() => {})
  await prisma.tour.deleteMany().catch(() => {})
  await prisma.news.deleteMany().catch(() => {})
  await prisma.destination.deleteMany().catch(() => {})
  await prisma.user.deleteMany().catch(() => {})
  console.log('✅ Database cleaned\n')

  // Create users with CORRECT password
  console.log('👥 Creating users...')
  
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@hawarl.com',
      name: 'Super Admin',
      password: await bcrypt.hash('Admin@123', 10), // ✅ كلمة المرور الصحيحة
      role: 'SUPER_ADMIN',
      phone: '+967777000000',
      emailVerified: true,
      isActive: true,
      avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=6366f1&color=fff'
    }
  })
  console.log('  ✅ Super Admin:', superAdmin.email)
  console.log('  🔑 Password: Admin@123')

  const admin = await prisma.user.create({
    data: {
      email: 'manager@hawarl.com',
      name: 'Admin Manager',
      password: await bcrypt.hash('Admin@123', 10),
      role: 'ADMIN',
      phone: '+967777000001',
      emailVerified: true,
      isActive: true,
      avatar: 'https://ui-avatars.com/api/?name=Admin+Manager&background=8b5cf6&color=fff'
    }
  })
  console.log('  ✅ Admin:', admin.email)

  const user1 = await prisma.user.create({
    data: {
      email: 'ahmed.ali@example.com',
      name: 'Ahmed Ali',
      password: await bcrypt.hash('user123', 10),
      role: 'USER',
      phone: '+967777111222',
      emailVerified: true,
      isActive: true,
      avatar: 'https://ui-avatars.com/api/?name=Ahmed+Ali&background=10b981&color=fff'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'sarah.mohamed@example.com',
      name: 'Sarah Mohamed',
      password: await bcrypt.hash('user123', 10),
      role: 'USER',
      phone: '+967777333444',
      emailVerified: true,
      isActive: true,
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Mohamed&background=f59e0b&color=fff'
    }
  })
  console.log('  ✅ Created 2 regular users\n')

  // Create destinations
  console.log('🏛️ Creating destinations...')
  await prisma.destination.create({
    data: {
      name: 'Dixam Plateau',
      nameAr: 'هضبة ديكسم',
      slug: 'dixam-plateau',
      description: 'Home to Dragon Blood Trees',
      descriptionAr: 'موطن أشجار دم الأخوين',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      latitude: 12.5,
      longitude: 53.9,
      featured: true,
      isActive: true
    }
  })

  await prisma.destination.create({
    data: {
      name: 'Qalansiyah Beach',
      nameAr: 'شاطئ قلنسية',
      slug: 'qalansiyah-beach',
      description: 'Crystal clear waters',
      descriptionAr: 'مياه صافية',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      latitude: 12.68,
      longitude: 53.48,
      featured: true,
      isActive: true
    }
  })
  console.log('  ✅ Created 2 destinations\n')

  // Create tours
  console.log('✈️ Creating tours...')
  const tour1 = await prisma.tour.create({
    data: {
      title: 'Dragon Blood Tree Discovery',
      titleAr: 'اكتشاف شجرة دم الأخوين',
      slug: 'dragon-blood-tree-discovery',
      description: 'Explore the mystical trees',
      descriptionAr: 'استكشف الأشجار الغامضة',
      price: 2500,
      duration: 3,
      maxPeople: 8,
      difficulty: 'MODERATE',
      category: 'NATURE',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      location: 'Dixam Plateau',
      locationAr: 'هضبة ديكسم',
      latitude: 12.5,
      longitude: 53.9,
      includes: ['Guide', 'Transport', 'Meals'],
      excludes: ['Personal expenses'],
      rating: 4.9,
      reviewsCount: 67,
      featured: true,
      isActive: true
    }
  })
  console.log('  ✅ Created tours\n')

  // Create bookings
  console.log('📅 Creating bookings...')
  await prisma.booking.create({
    data: {
      bookingNumber: `BK-${Date.now()}-001`,
      userId: user1.id,
      tourId: tour1.id,
      startDate: new Date('2024-04-15'),
      endDate: new Date('2024-04-17'),
      numberOfPeople: 2,
      totalPrice: 4500,
      paidAmount: 4500,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: 'CREDIT_CARD',
      customerName: user1.name,
      customerEmail: user1.email,
      customerPhone: user1.phone
    }
  })
  console.log('  ✅ Created bookings\n')

  // Create news
  console.log('📰 Creating news...')
  await prisma.news.create({
    data: {
      title: 'Socotra Records 5,000 Tourists',
      titleAr: 'سقطرى تسجل 5000 سائح',
      slug: 'socotra-5000-tourists',
      excerpt: '40% increase in tourism',
      excerptAr: 'زيادة 40% في السياحة',
      content: 'Tourism is growing...',
      contentAr: 'السياحة في تزايد...',
      coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200',
      category: 'TOURISM',
      tags: ['tourism', 'growth'],
      featured: true,
      published: true,
      publishedAt: new Date(),
      authorName: superAdmin.name,
      viewsCount: 3421
    }
  })
  console.log('  ✅ Created news\n')

  console.log('═══════════════════════════════════════════════════════')
  console.log('🎉 Database seeding completed successfully!\n')
  console.log('🔑 Login Credentials:')
  console.log('   Email: admin@hawarl.com')
  console.log('   Password: Admin@123')
  console.log('═══════════════════════════════════════════════════════\n')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })