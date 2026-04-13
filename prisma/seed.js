// ═══════════════════════════════════════════════════════════════
// 🌱 HAWARI TOURS - COMPREHENSIVE PROFESSIONAL SEED FILE
// ═══════════════════════════════════════════════════════════════
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { part0 } from './seed-part0.js'
import { part2 } from './seed-part2.js'
import { part3 } from './seed-part3.js'
import { part4 } from './seed-part4.js'
import { part5 } from './seed-part5.js'

const prisma = new PrismaClient()

async function main() {
  console.log('\n🌱 ═══════════════════════════════════════════')
  console.log('   HAWARI TOURS - Full Database Seeding')
  console.log('═══════════════════════════════════════════\n')

  // ─── CLEAN ───────────────────────────────────────────────────
  console.log('🧹 Cleaning database...')
  await prisma.$transaction([
    prisma.comment.deleteMany(),
    prisma.review.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.tourDate.deleteMany(),
  ])
  await prisma.$transaction([
    prisma.report.deleteMany(),
    prisma.reportCategory.deleteMany(),
    prisma.reportStat.deleteMany(),
    prisma.reportsPageSetting.deleteMany(),
    prisma.reportsUnescoSection.deleteMany(),
    prisma.reportsCtaSection.deleteMany(),
  ])
  await prisma.$transaction([
    prisma.blog.deleteMany(),
    prisma.blogAuthor.deleteMany(),
    prisma.blogTag.deleteMany(),
    prisma.news.deleteMany(),
  ])
  await prisma.$transaction([
    prisma.fAQ.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.message.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.galleryImage.deleteMany(),
    prisma.galleryVideo.deleteMany(),
    prisma.virtualTour.deleteMany(),
  ])
  await prisma.$transaction([
    prisma.instagramPost.deleteMany(),
    prisma.heroSlide.deleteMany(),
    prisma.quickStat.deleteMany(),
    prisma.whyChooseUs.deleteMany(),
    prisma.welcomeMessage.deleteMany(),
    prisma.travelPackage.deleteMany(),
  ])
  await prisma.$transaction([
    prisma.quickTip.deleteMany(),
    prisma.visaRequirement.deleteMany(),
    prisma.flightRoute.deleteMany(),
    prisma.localTransport.deleteMany(),
    prisma.accommodationType.deleteMany(),
    prisma.safetyTip.deleteMany(),
    prisma.safetyCategory.deleteMany(),
    prisma.emergencyContact.deleteMany(),
    prisma.packingCategory.deleteMany(),
  ])
  await prisma.$transaction([
    prisma.historicalEvent.deleteMany(),
    prisma.historicalEra.deleteMany(),
    prisma.timelineEvent.deleteMany(),
    prisma.archaeologicalSite.deleteMany(),
    prisma.aboutSection.deleteMany(),
    prisma.endemicSpecies.deleteMany(),
    prisma.culturalElement.deleteMany(),
    prisma.uniqueFeature.deleteMany(),
  ])
  await prisma.$transaction([
    prisma.destination.deleteMany(),
    prisma.tour.deleteMany(),
    prisma.contactInfo.deleteMany(),
    prisma.settings.deleteMany(),
    prisma.user.deleteMany(),
  ])
  console.log('  ✅ Database cleaned\n')

  // ─── USERS ───────────────────────────────────────────────────
  console.log('👥 Creating users...')
  const adminPassword = await bcrypt.hash('Admin@123', 12)
  const userPassword = await bcrypt.hash('User@123', 12)

  await prisma.user.create({
    data: {
      email: 'admin@hawari.com', name: 'Hawari Admin',
      password: adminPassword, role: 'SUPER_ADMIN',
      isActive: true, emailVerified: true
    }
  })
  await prisma.user.create({
    data: {
      email: 'ahmed@example.com', name: 'Ahmed Al-Yemeni',
      password: userPassword, role: 'USER',
      phone: '+9671234567', isActive: true, emailVerified: true
    }
  })
  await prisma.user.create({
    data: {
      email: 'sarah@example.com', name: 'Sarah Johnson',
      password: userPassword, role: 'USER',
      phone: '+12125550100', isActive: true, emailVerified: true
    }
  })
  console.log('  ✅ Admin: admin@hawari.com / Admin@123')
  console.log('  ✅ Users created\n')

  // ─── SETTINGS ────────────────────────────────────────────────
  console.log('⚙️  Creating site settings...')
  await prisma.settings.create({
    data: {
      siteName: 'Hawari Tours', siteNameAr: 'رحلات الحواري',
      siteDescription: 'Your gateway to the enchanting Socotra Island – the Galapagos of the Indian Ocean.',
      siteDescriptionAr: 'بوابتك إلى جزيرة سقطرى الساحرة – جالاباغوس المحيط الهندي.',
      contactEmail: 'info@hawari-tours.com', contactPhone: '+967 777 123 456',
      contactAddress: 'Socotra Island, Hadibo, Yemen',
      contactAddressAr: 'جزيرة سقطرى، حديبو، اليمن',
      facebook: 'https://facebook.com/hawaritours',
      instagram: 'https://instagram.com/hawaritours',
      youtube: 'https://youtube.com/@hawaritours',
      whatsapp: '+967777123456',
      currency: 'USD', taxRate: 0, minimumBookingDays: 3, cancellationDays: 7,
      emailNotifications: true, bookingNotifications: true,
      messageNotifications: true, reviewNotifications: true
    }
  })
  console.log('  ✅ Settings created\n')

  // ─── CONTACT INFO ─────────────────────────────────────────────
  console.log('📞 Creating contact info...')
  await prisma.contactInfo.create({
    data: {
      email: 'info@hawari-tours.com', phone: '+967 777 123 456',
      whatsapp: '+967777123456',
      address: 'Hadibo City, Socotra Island, Yemen',
      addressAr: 'مدينة حديبو، جزيرة سقطرى، اليمن',
      hoursEn: 'Saturday – Thursday: 8:00 AM – 8:00 PM',
      hoursAr: 'السبت – الخميس: 8:00 صباحاً – 8:00 مساءً',
      facebook: 'https://facebook.com/hawaritours',
      instagram: 'https://instagram.com/hawaritours',
      youtube: 'https://youtube.com/@hawaritours',
      latitude: 12.6297, longitude: 54.0174
    }
  })
  console.log('  ✅ Contact info created\n')

  // ─── PART 0: Tours + Destinations ────────────────────────────
  const tours = await part0(prisma)

  // ─── PART 2: News + Testimonials + Gallery ───────────────────
  await part2(prisma, null)

  // ─── PART 3: Blogs + FAQs + Packages ─────────────────────────
  await part3(prisma)

  // ─── PART 4: Travel Guide + History + About + Unique Features ─
  await part4(prisma)

  // ─── PART 5: Homepage + Videos + Insta + Messages ────────────
  await part5(prisma, tours)

  // ─── DONE ─────────────────────────────────────────────────────
  console.log('\n🎉 ═══════════════════════════════════════════')
  console.log('   DATABASE SEEDING COMPLETED SUCCESSFULLY!')
  console.log('═══════════════════════════════════════════')
  console.log('\n📋 ADMIN LOGIN:')
  console.log('   Email:    admin@hawari.com')
  console.log('   Password: Admin@123')
  console.log('\n🌐 USER LOGINS:')
  console.log('   ahmed@example.com / User@123')
  console.log('   sarah@example.com / User@123\n')
}

main()
  .catch(e => {
    console.error('\n❌ SEEDING FAILED:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
