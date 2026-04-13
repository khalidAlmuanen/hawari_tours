const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const models = [
  'payment',
  'booking',
  'review',
  'message',
  'comment',
  'blog',
  'blogTag',
  'blogAuthor',
  'tourDate',
  'tour',
  'travelPackage',
  'destination',
  'news',
  'galleryImage',
  'galleryVideo',
  'virtualTour',
  'instagramPost',
  'testimonial',
  'analytics',
  'quickTip',
  'visaRequirement',
  'notification',
  'flightRoute',
  'localTransport',
  'accommodationType',
  'safetyTip',
  'safetyCategory',
  'timelineEvent',
  'archaeologicalSite',
  'historicalEvent',
  'historicalEra',
  'historicalSection',
  'historyPageSetting',
  'emergencyContact',
  'packingCategory',
  'travelGuideSection',
  'travelGuideSetting',
  'destinationsPageSetting',
  'aboutSection',
  'endemicSpecies',
  'culturalElement',
  'uniqueFeature',
  'uniqueFeaturesPageSetting',
  'heroSlide',
  'quickStat',
  'welcomeMessage',
  'whyChooseUs',
  'settings',
  'gallerySetting',
  'contactInfo',
  'fAQ',
  'blogSetting',
  'aboutPageSettings',
  'toursPageSetting',
  'report',
  'reportCategory',
  'reportStat',
  'reportsPageSetting',
  'reportsUnescoSection',
  'reportsCtaSection'
]

const main = async () => {
  for (const model of models) {
    if (!prisma[model]) {
      console.error('Unknown model:', model)
      throw new Error(`Unknown model: ${model}`)
    }
    console.log('Deleting', model)
    await prisma[model].deleteMany()
  }

  await prisma.user.deleteMany({
    where: { role: { notIn: ['ADMIN', 'SUPER_ADMIN'] } }
  })

  const admins = await prisma.user.count({
    where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } }
  })

  const remaining = {
    tours: await prisma.tour.count(),
    packages: await prisma.travelPackage.count(),
    destinations: await prisma.destination.count(),
    blogs: await prisma.blog.count(),
    messages: await prisma.message.count()
  }

  console.log('Admins remaining:', admins)
  console.log('Remaining counts:', remaining)
}

main()
  .then(() => {
    console.log('Database cleared')
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
