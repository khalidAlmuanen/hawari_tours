const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const hotels = [
  {
    name: 'Ocean Crown Resort',
    nameAr: 'منتجع تاج المحيط',
    slug: 'ocean-crown-resort',
    description: 'Luxury resort with panoramic sea views, private suites, and signature services.',
    descriptionAr: 'منتجع فاخر بإطلالة بحرية بانورامية وأجنحة خاصة وخدمات مميزة.',
    shortDescription: 'Signature seaside resort with private suites.',
    shortDescriptionAr: 'منتجع توقيع على البحر بأجنحة خاصة.',
    pricePerNight: 280,
    discount: 10,
    rating: 4.9,
    reviewsCount: 214,
    roomsCount: 38,
    status: 'ACTIVE',
    featured: true,
    coverImage: '/img/hero/socotra-2.jpg',
    images: ['/img/hero/socotra-2.jpg', '/img/hero/socotra-3.jpg'],
    location: 'Hadiboh',
    locationAr: 'حديبو',
    amenities: ['sea', 'spa', 'butler', 'suite'],
    amenitiesAr: ['إطلالة بحرية', 'سبا فاخر', 'خادم خاص', 'أجنحة ملكية'],
    highlights: ['Private beach', 'Signature dining', 'Sunset lounge'],
    highlightsAr: ['شاطئ خاص', 'مطعم توقيع', 'لاونج الغروب'],
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation up to 48 hours before arrival.',
    cancellationPolicyAr: 'إلغاء مجاني قبل 48 ساعة من الوصول.',
    keywords: ['luxury', 'sea', 'spa']
  },
  {
    name: 'Lagoon Sky Suites',
    nameAr: 'أجنحة سماء اللاجون',
    slug: 'lagoon-sky-suites',
    description: 'Elegant lagoon suites designed for premium relaxation with private pools.',
    descriptionAr: 'أجنحة أنيقة على اللاجون مع مسابح خاصة للاسترخاء الفاخر.',
    shortDescription: 'Lagoon suites with private pools.',
    shortDescriptionAr: 'أجنحة لاجون بمسابح خاصة.',
    pricePerNight: 240,
    discount: 0,
    rating: 4.8,
    reviewsCount: 190,
    roomsCount: 30,
    status: 'ACTIVE',
    featured: true,
    coverImage: '/img/destinations/detwah.webp',
    images: ['/img/destinations/detwah.webp', '/img/hero/socotra-1.jpg'],
    location: 'Detwah Lagoon',
    locationAr: 'لاجون ديتواه',
    amenities: ['sea', 'private-pool', 'suite', 'spa'],
    amenitiesAr: ['إطلالة بحرية', 'مسبح خاص', 'أجنحة ملكية', 'سبا فاخر'],
    highlights: ['Lagoon view', 'Private terrace', 'Sunrise rituals'],
    highlightsAr: ['إطلالة لاجون', 'تراس خاص', 'طقوس شروق الشمس'],
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation up to 72 hours before arrival.',
    cancellationPolicyAr: 'إلغاء مجاني قبل 72 ساعة من الوصول.',
    keywords: ['lagoon', 'suite', 'private pool']
  },
  {
    name: 'Dragon Peak Villas',
    nameAr: 'فلل قمة التنين',
    slug: 'dragon-peak-villas',
    description: 'Mountain villas with spa services and curated adventure itineraries.',
    descriptionAr: 'فلل جبلية مع سبا وبرامج مغامرة مختارة.',
    shortDescription: 'Mountain villas with spa.',
    shortDescriptionAr: 'فلل جبلية بسبا.',
    pricePerNight: 220,
    discount: 5,
    rating: 4.7,
    reviewsCount: 168,
    roomsCount: 24,
    status: 'ACTIVE',
    featured: false,
    coverImage: '/img/destinations/diksam.webp',
    images: ['/img/destinations/diksam.webp'],
    location: 'Diksam',
    locationAr: 'ديكسم',
    amenities: ['spa', 'suite', 'adventure'],
    amenitiesAr: ['سبا فاخر', 'أجنحة ملكية', 'تجارب مغامرة'],
    highlights: ['Mountain view', 'Wellness spa', 'Guided hikes'],
    highlightsAr: ['إطلالة جبلية', 'سبا صحي', 'جولات مشي'],
    checkInTime: '3:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation up to 24 hours before arrival.',
    cancellationPolicyAr: 'إلغاء مجاني قبل 24 ساعة من الوصول.',
    keywords: ['mountain', 'spa', 'adventure']
  },
  {
    name: 'Coral Bay Retreat',
    nameAr: 'ملاذ خليج المرجان',
    slug: 'coral-bay-retreat',
    description: 'Seaside retreat with eco-luxury touches, spa rituals, and private terraces.',
    descriptionAr: 'ملاذ بحري بلمسات فاخرة بيئية، وطقوس سبا، وتراسات خاصة.',
    shortDescription: 'Eco-luxury by the sea.',
    shortDescriptionAr: 'فخامة بيئية على البحر.',
    pricePerNight: 195,
    discount: 0,
    rating: 4.6,
    reviewsCount: 132,
    roomsCount: 18,
    status: 'ACTIVE',
    featured: false,
    coverImage: '/img/destinations/arher.webp',
    images: ['/img/destinations/arher.webp', '/img/hero/socotra-1.jpg'],
    location: 'Shoab Beach',
    locationAr: 'شاطئ شوعب',
    amenities: ['sea', 'eco', 'spa', 'breakfast'],
    amenitiesAr: ['إطلالة بحرية', 'بيئي فاخر', 'سبا فاخر', 'فطور فاخر'],
    highlights: ['Eco suites', 'Morning yoga', 'Private dining'],
    highlightsAr: ['أجنحة بيئية', 'يوغا صباحية', 'عشاء خاص'],
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation up to 48 hours before arrival.',
    cancellationPolicyAr: 'إلغاء مجاني قبل 48 ساعة من الوصول.',
    keywords: ['eco', 'sea', 'spa']
  }
]

async function main() {
  for (const hotel of hotels) {
    await prisma.hotel.upsert({
      where: { slug: hotel.slug },
      update: hotel,
      create: hotel
    })
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
