// ═══════════════════════════════════════════════════════════════
// 💾 Database Export Script
// سكريبت تصدير قاعدة البيانات كـ Backup
// ═══════════════════════════════════════════════════════════════

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function exportDatabase() {
  console.log('🔄 Starting database export...\n')

  const backup = {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    data: {}
  }

  try {
    // Export all tables
    console.log('📦 Exporting Quick Tips...')
    backup.data.quickTips = await prisma.quickTip.findMany()

    console.log('📦 Exporting Visa Requirements...')
    backup.data.visaRequirements = await prisma.visaRequirement.findMany()

    console.log('📦 Exporting Flight Routes...')
    backup.data.flightRoutes = await prisma.flightRoute.findMany()

    console.log('📦 Exporting Local Transport...')
    backup.data.localTransport = await prisma.localTransport.findMany()

    console.log('📦 Exporting Accommodation Types...')
    backup.data.accommodationTypes = await prisma.accommodationType.findMany()

    console.log('📦 Exporting Safety Categories...')
    backup.data.safetyCategories = await prisma.safetyCategory.findMany()

    console.log('📦 Exporting Emergency Contacts...')
    backup.data.emergencyContacts = await prisma.emergencyContact.findMany()

    console.log('📦 Exporting Packing Categories...')
    backup.data.packingCategories = await prisma.packingCategory.findMany()

    console.log('📦 Exporting Travel Guide Settings...')
    backup.data.travelGuideSettings = await prisma.travelGuideSetting.findMany()

    console.log('📦 Exporting Gallery Images...')
    backup.data.galleryImages = await prisma.galleryImage.findMany()

    console.log('📦 Exporting Gallery Videos...')
    backup.data.galleryVideos = await prisma.galleryVideo.findMany()

    console.log('📦 Exporting Virtual Tours...')
    backup.data.virtualTours = await prisma.virtualTour.findMany()

    console.log('📦 Exporting Instagram Posts...')
    backup.data.instagramPosts = await prisma.instagramPost.findMany()

    console.log('📦 Exporting Gallery Settings...')
    backup.data.gallerySettings = await prisma.gallerySetting.findMany()

    console.log('📦 Exporting Tours...')
    backup.data.tours = await prisma.tour.findMany()

    console.log('📦 Exporting Destinations...')
    backup.data.destinations = await prisma.destination.findMany()

    console.log('📦 Exporting News...')
    backup.data.news = await prisma.news.findMany()

    console.log('📦 Exporting Users (without passwords)...')
    const users = await prisma.user.findMany()
    backup.data.users = users.map(user => ({
      ...user,
      password: '[REDACTED]' // Don't export passwords
    }))

    console.log('📦 Exporting Bookings...')
    backup.data.bookings = await prisma.booking.findMany()

    console.log('📦 Exporting Messages...')
    backup.data.messages = await prisma.message.findMany()

    // Calculate statistics
    backup.statistics = {
      quickTips: backup.data.quickTips.length,
      visaRequirements: backup.data.visaRequirements.length,
      flightRoutes: backup.data.flightRoutes.length,
      localTransport: backup.data.localTransport.length,
      accommodationTypes: backup.data.accommodationTypes.length,
      safetyCategories: backup.data.safetyCategories.length,
      emergencyContacts: backup.data.emergencyContacts.length,
      packingCategories: backup.data.packingCategories.length,
      galleryImages: backup.data.galleryImages.length,
      galleryVideos: backup.data.galleryVideos.length,
      virtualTours: backup.data.virtualTours.length,
      instagramPosts: backup.data.instagramPosts.length,
      tours: backup.data.tours.length,
      destinations: backup.data.destinations.length,
      news: backup.data.news.length,
      users: backup.data.users.length,
      bookings: backup.data.bookings.length,
      messages: backup.data.messages.length
    }

    // Save to file
    const backupDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir)
    }

    const filename = `database-backup-${new Date().toISOString().split('T')[0]}.json`
    const filepath = path.join(backupDir, filename)

    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2))

    console.log('\n✅ Database export completed!')
    console.log(`📁 File saved: ${filepath}`)
    console.log('\n📊 Statistics:')
    Object.entries(backup.statistics).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`)
    })

  } catch (error) {
    console.error('❌ Error exporting database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

exportDatabase()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
