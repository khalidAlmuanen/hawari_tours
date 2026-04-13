// ═══════════════════════════════════════════════════════════════
// 🧳 Travel Guide - Data Seed Script
// إدراج كل بيانات دليل السفر الموجودة في الصفحة الحالية
// ═══════════════════════════════════════════════════════════════

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Travel Guide Seed...')

  // ═══════════════════════════════════════════════════════════════
  // 1. Quick Tips (النصائح السريعة)
  // ═══════════════════════════════════════════════════════════════
  console.log('📌 Seeding Quick Tips...')
  
  const quickTips = [
    {
      icon: '🛂',
      title: 'Visa on Arrival',
      titleAr: 'تأشيرة عند الوصول',
      description: 'For most nationalities',
      descriptionAr: 'لمعظم الجنسيات',
      gradient: 'from-blue-500 to-cyan-600',
      order: 1
    },
    {
      icon: '✈️',
      title: 'Direct Flights',
      titleAr: 'رحلات مباشرة',
      description: 'From Mukalla & Abu Dhabi',
      descriptionAr: 'من المكلا وأبوظبي',
      gradient: 'from-purple-500 to-pink-600',
      order: 2
    },
    {
      icon: '🌡️',
      title: 'Best Time',
      titleAr: 'أفضل وقت',
      description: 'October - April',
      descriptionAr: 'أكتوبر - أبريل',
      gradient: 'from-orange-500 to-red-600',
      order: 3
    },
    {
      icon: '💰',
      title: 'Currency',
      titleAr: 'العملة',
      description: 'Yemeni Rial (YER)',
      descriptionAr: 'ريال يمني (YER)',
      gradient: 'from-green-500 to-emerald-600',
      order: 4
    }
  ]

  for (const tip of quickTips) {
    await prisma.quickTip.upsert({
      where: { id: `quick-tip-${tip.order}` },
      update: tip,
      create: { id: `quick-tip-${tip.order}`, ...tip }
    })
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. Visa Requirements (المستندات المطلوبة)
  // ═══════════════════════════════════════════════════════════════
  console.log('📋 Seeding Visa Requirements...')
  
  const visaRequirements = [
    { itemAr: 'جواز سفر صالح لمدة 6 أشهر', itemEn: 'Valid passport for 6 months', icon: '📘', order: 1 },
    { itemAr: 'صورة شخصية حديثة', itemEn: 'Recent passport photo', icon: '📸', order: 2 },
    { itemAr: 'حجز فندقي أو خطاب دعوة', itemEn: 'Hotel booking or invitation letter', icon: '🏨', order: 3 },
    { itemAr: 'تذكرة طيران ذهاب وعودة', itemEn: 'Round-trip flight ticket', icon: '✈️', order: 4 },
    { itemAr: 'تأمين سفر (موصى به بشدة)', itemEn: 'Travel insurance (highly recommended)', icon: '🛡️', order: 5 },
    { itemAr: 'رسوم التأشيرة نقداً (دولار أمريكي)', itemEn: 'Visa fee in cash (USD)', icon: '💵', order: 6 }
  ]

  for (const req of visaRequirements) {
    await prisma.visaRequirement.upsert({
      where: { id: `visa-req-${req.order}` },
      update: req,
      create: { id: `visa-req-${req.order}`, ...req }
    })
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. Flight Routes (خطوط الطيران)
  // ═══════════════════════════════════════════════════════════════
  console.log('✈️ Seeding Flight Routes...')
  
  const flightRoutes = [
    {
      fromAr: 'المكلا، اليمن',
      fromEn: 'Mukalla, Yemen',
      airline: 'Yemenia',
      duration: '1h 30m',
      frequencyAr: '3-4 رحلات أسبوعياً',
      frequencyEn: '3-4 flights weekly',
      price: '$150-250',
      icon: '🇾🇪',
      gradient: 'from-red-500 to-red-700',
      order: 1
    },
    {
      fromAr: 'أبوظبي، الإمارات',
      fromEn: 'Abu Dhabi, UAE',
      airline: 'Felix Airways',
      duration: '2h 15m',
      frequencyAr: 'رحلتان أسبوعياً',
      frequencyEn: '2 flights weekly',
      price: '$300-450',
      icon: '🇦🇪',
      gradient: 'from-blue-500 to-indigo-600',
      order: 2
    },
    {
      fromAr: 'القاهرة، مصر',
      fromEn: 'Cairo, Egypt',
      airline: 'Charter Flights',
      duration: '3h 30m',
      frequencyAr: 'موسمية',
      frequencyEn: 'Seasonal',
      price: '$400-600',
      icon: '🇪🇬',
      gradient: 'from-yellow-500 to-orange-600',
      order: 3
    }
  ]

  for (const route of flightRoutes) {
    await prisma.flightRoute.upsert({
      where: { id: `flight-route-${route.order}` },
      update: route,
      create: { id: `flight-route-${route.order}`, ...route }
    })
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. Local Transportation (النقل المحلي)
  // ═══════════════════════════════════════════════════════════════
  console.log('🚙 Seeding Local Transportation...')
  
  const localTransport = [
    {
      typeAr: 'سيارات دفع رباعي مع سائق',
      typeEn: '4x4 Vehicle with Driver',
      descriptionAr: 'الخيار الأفضل والأكثر أماناً. معظم الطرق وعرة وتحتاج سائق خبير محلي',
      descriptionEn: 'Best and safest option. Most roads are rough and need experienced local driver',
      priceAr: '80-120 دولار/يوم',
      priceEn: '$80-120/day',
      icon: '🚙',
      gradient: 'from-green-500 to-emerald-600',
      features: [
        JSON.stringify({ ar: 'سائق محلي خبير', en: 'Expert local driver' }),
        JSON.stringify({ ar: 'معرفة بالطرق الوعرة', en: 'Knowledge of rough roads' }),
        JSON.stringify({ ar: 'وقود مشمول عادةً', en: 'Fuel usually included' }),
        JSON.stringify({ ar: 'مرن ومريح', en: 'Flexible and comfortable' })
      ],
      order: 1
    },
    {
      typeAr: 'تاكسي محلي',
      typeEn: 'Local Taxi',
      descriptionAr: 'متاح في حديبو والمدن الرئيسية للمسافات القصيرة فقط',
      descriptionEn: 'Available in Hadiboh and main towns for short distances only',
      priceAr: '5-20 دولار',
      priceEn: '$5-20',
      icon: '🚕',
      gradient: 'from-yellow-500 to-orange-600',
      features: [
        JSON.stringify({ ar: 'للمسافات القصيرة', en: 'For short distances' }),
        JSON.stringify({ ar: 'داخل المدن فقط', en: 'Within cities only' }),
        JSON.stringify({ ar: 'اقتصادي', en: 'Economical' }),
        JSON.stringify({ ar: 'متوفر عند الطلب', en: 'Available on demand' })
      ],
      order: 2
    },
    {
      typeAr: 'دراجات نارية',
      typeEn: 'Motorcycles',
      descriptionAr: 'للمغامرين ذوي الخبرة - الطرق صعبة وخطيرة',
      descriptionEn: 'For experienced adventurers - roads are difficult and dangerous',
      priceAr: '30-50 دولار/يوم',
      priceEn: '$30-50/day',
      icon: '🏍️',
      gradient: 'from-red-500 to-rose-600',
      features: [
        JSON.stringify({ ar: 'خبرة قيادة مطلوبة', en: 'Driving experience required' }),
        JSON.stringify({ ar: 'خطر على الطرق الوعرة', en: 'Risky on rough roads' }),
        JSON.stringify({ ar: 'حرية التنقل', en: 'Freedom of movement' }),
        JSON.stringify({ ar: 'غير موصى للمبتدئين', en: 'Not for beginners' })
      ],
      order: 3
    },
    {
      typeAr: 'قوارب',
      typeEn: 'Boats',
      descriptionAr: 'للوصول إلى الشواطئ البعيدة والجزر الصغيرة',
      descriptionEn: 'To reach remote beaches and small islands',
      priceAr: '100-250 دولار/رحلة',
      priceEn: '$100-250/trip',
      icon: '⛵',
      gradient: 'from-blue-500 to-cyan-600',
      features: [
        JSON.stringify({ ar: 'للمواقع الساحلية', en: 'For coastal locations' }),
        JSON.stringify({ ar: 'رحلات منظمة', en: 'Organized trips' }),
        JSON.stringify({ ar: 'مرشد بحري', en: 'Marine guide' }),
        JSON.stringify({ ar: 'حسب الطقس', en: 'Weather dependent' })
      ],
      order: 4
    }
  ]

  for (const transport of localTransport) {
    await prisma.localTransport.upsert({
      where: { id: `local-transport-${transport.order}` },
      update: transport,
      create: { id: `local-transport-${transport.order}`, ...transport }
    })
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. Accommodation Types (أنواع الإقامة)
  // ═══════════════════════════════════════════════════════════════
  console.log('🏨 Seeding Accommodation Types...')
  
  const accommodationTypes = [
    {
      typeAr: 'فنادق',
      typeEn: 'Hotels',
      descriptionAr: 'فنادق ونزل في حديبو والمدن الرئيسية مع خدمات أساسية',
      descriptionEn: 'Hotels and inns in Hadiboh and main towns with basic services',
      priceAr: '50-120 دولار/ليلة',
      priceEn: '$50-120/night',
      icon: '🏨',
      rating: 3,
      gradient: 'from-blue-500 to-indigo-600',
      features: [
        JSON.stringify({ ar: 'غرف مكيفة', en: 'Air-conditioned rooms', icon: '❄️' }),
        JSON.stringify({ ar: 'واي فاي (محدود)', en: 'WiFi (limited)', icon: '📶' }),
        JSON.stringify({ ar: 'مطعم', en: 'Restaurant', icon: '🍽️' }),
        JSON.stringify({ ar: 'موقف سيارات', en: 'Parking', icon: '🅿️' }),
        JSON.stringify({ ar: 'ماء ساخن', en: 'Hot water', icon: '🚿' })
      ],
      examples: [
        JSON.stringify({ name: 'Socotra Hotel', location: 'Hadiboh', stars: 3 }),
        JSON.stringify({ name: 'Hadiboh Hotel', location: 'Hadiboh', stars: 3 }),
        JSON.stringify({ name: 'Summerland Hotel', location: 'Hadiboh', stars: 2 })
      ],
      order: 1
    },
    {
      typeAr: 'نزل بيئية',
      typeEn: 'Eco-Lodges',
      descriptionAr: 'إقامة صديقة للبيئة في مواقع طبيعية خلابة بعيداً عن المدن',
      descriptionEn: 'Eco-friendly accommodation in stunning natural locations away from towns',
      priceAr: '70-150 دولار/ليلة',
      priceEn: '$70-150/night',
      icon: '🏡',
      rating: 4,
      gradient: 'from-green-500 to-emerald-600',
      features: [
        JSON.stringify({ ar: 'تصميم بيئي مستدام', en: 'Sustainable eco-design', icon: '🌿' }),
        JSON.stringify({ ar: 'إطلالات طبيعية رائعة', en: 'Amazing nature views', icon: '🏞️' }),
        JSON.stringify({ ar: 'طعام محلي عضوي', en: 'Local organic food', icon: '🥗' }),
        JSON.stringify({ ar: 'أنشطة بيئية', en: 'Eco activities', icon: '🎯' }),
        JSON.stringify({ ar: 'طاقة شمسية', en: 'Solar power', icon: '☀️' })
      ],
      examples: [
        JSON.stringify({ name: 'Dihamri Marine Lodge', location: 'Dihamri', stars: 4 }),
        JSON.stringify({ name: 'Qalansiyah Beach Lodge', location: 'Qalansiyah', stars: 3 })
      ],
      order: 2
    },
    {
      typeAr: 'بيوت ضيافة محلية',
      typeEn: 'Local Guesthouses',
      descriptionAr: 'إقامة بسيطة مع عائلات محلية - تجربة ثقافية أصيلة',
      descriptionEn: 'Simple stay with local families - authentic cultural experience',
      priceAr: '20-40 دولار/ليلة',
      priceEn: '$20-40/night',
      icon: '🏠',
      rating: 2,
      gradient: 'from-orange-500 to-red-600',
      features: [
        JSON.stringify({ ar: 'تجربة محلية حقيقية', en: 'Authentic local experience', icon: '🤝' }),
        JSON.stringify({ ar: 'وجبات منزلية', en: 'Home-cooked meals', icon: '🍲' }),
        JSON.stringify({ ar: 'ضيافة سقطرية', en: 'Socotri hospitality', icon: '💚' }),
        JSON.stringify({ ar: 'اقتصادي جداً', en: 'Very economical', icon: '💰' }),
        JSON.stringify({ ar: 'تعلم اللغة المحلية', en: 'Learn local language', icon: '🗣️' })
      ],
      examples: [
        JSON.stringify({ name: 'Family Guesthouses', location: 'Various villages', stars: 2 }),
        JSON.stringify({ name: 'Community Houses', location: 'Rural areas', stars: 2 })
      ],
      order: 3
    },
    {
      typeAr: 'تخييم بيئي',
      typeEn: 'Eco-Camping',
      descriptionAr: 'تخييم منظم في مواقع طبيعية مع معدات ومرشدين - مغامرة حقيقية',
      descriptionEn: 'Organized camping in natural sites with equipment and guides - true adventure',
      priceAr: '30-70 دولار/ليلة',
      priceEn: '$30-70/night',
      icon: '⛺',
      rating: 4,
      gradient: 'from-purple-500 to-pink-600',
      features: [
        JSON.stringify({ ar: 'نوم تحت النجوم', en: 'Sleep under stars', icon: '⭐' }),
        JSON.stringify({ ar: 'معدات تخييم كاملة', en: 'Full camping equipment', icon: '🎒' }),
        JSON.stringify({ ar: 'مرشد محلي خبير', en: 'Expert local guide', icon: '🧭' }),
        JSON.stringify({ ar: 'مواقع آمنة ومحمية', en: 'Safe protected locations', icon: '🛡️' }),
        JSON.stringify({ ar: 'طعام مطبوخ على النار', en: 'Fire-cooked food', icon: '🔥' })
      ],
      examples: [
        JSON.stringify({ name: 'Beach Camping', location: 'Various beaches', stars: null }),
        JSON.stringify({ name: 'Mountain Camping', location: 'Haggier Mountains', stars: null }),
        JSON.stringify({ name: 'Desert Camping', location: 'Sand dunes', stars: null })
      ],
      order: 4
    }
  ]

  for (const type of accommodationTypes) {
    await prisma.accommodationType.upsert({
      where: { id: `accommodation-type-${type.order}` },
      update: type,
      create: { id: `accommodation-type-${type.order}`, ...type }
    })
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. Safety Categories (نصائح السلامة)
  // ═══════════════════════════════════════════════════════════════
  console.log('🛡️ Seeding Safety Categories...')
  
  const safetyCategories = [
    {
      categoryAr: 'الصحة والنظافة',
      categoryEn: 'Health & Hygiene',
      icon: '🏥',
      gradient: 'from-red-500 to-rose-600',
      tips: [
        JSON.stringify({ ar: 'احصل على تأمين صحي شامل قبل السفر', en: 'Get comprehensive health insurance before travel' }),
        JSON.stringify({ ar: 'أحضر صيدلية سفر كاملة وأدويتك الشخصية', en: 'Bring complete travel pharmacy and personal medications' }),
        JSON.stringify({ ar: 'اشرب مياه معبأة فقط - لا تشرب ماء الصنبور', en: 'Drink bottled water only - no tap water' }),
        JSON.stringify({ ar: 'استخدم واقي شمس قوي SPF 50+', en: 'Use strong sunscreen SPF 50+' }),
        JSON.stringify({ ar: 'ارتدِ قبعة ونظارة شمسية', en: 'Wear hat and sunglasses' })
      ],
      order: 1
    },
    {
      categoryAr: 'الأمان الشخصي',
      categoryEn: 'Personal Security',
      icon: '🔒',
      gradient: 'from-blue-500 to-indigo-600',
      tips: [
        JSON.stringify({ ar: 'احتفظ بنسخ من جواز سفرك ووثائقك', en: 'Keep copies of passport and documents' }),
        JSON.stringify({ ar: 'لا تسافر بمفردك في الليل', en: "Don't travel alone at night" }),
        JSON.stringify({ ar: 'استخدم مرشد محلي موثوق', en: 'Use trusted local guide' }),
        JSON.stringify({ ar: 'أبلغ الفندق بخطط سفرك اليومية', en: 'Inform hotel of daily travel plans' }),
        JSON.stringify({ ar: 'احمل هاتفك محمولاً دائماً', en: 'Keep phone charged always' })
      ],
      order: 2
    },
    {
      categoryAr: 'البيئة والطبيعة',
      categoryEn: 'Environment & Nature',
      icon: '🌿',
      gradient: 'from-green-500 to-emerald-600',
      tips: [
        JSON.stringify({ ar: 'لا تلمس النباتات النادرة أو دم الأخوين', en: "Don't touch rare plants or dragon blood trees" }),
        JSON.stringify({ ar: 'خذ قمامتك معك - حافظ على نظافة البيئة', en: 'Take trash with you - keep environment clean' }),
        JSON.stringify({ ar: 'ابقَ على الممرات المحددة', en: 'Stay on marked paths' }),
        JSON.stringify({ ar: 'لا تطعم الحيوانات البرية', en: "Don't feed wild animals" }),
        JSON.stringify({ ar: 'احترم المحميات الطبيعية', en: 'Respect nature reserves' })
      ],
      order: 3
    },
    {
      categoryAr: 'الثقافة والعادات',
      categoryEn: 'Culture & Customs',
      icon: '🕌',
      gradient: 'from-purple-500 to-pink-600',
      tips: [
        JSON.stringify({ ar: 'احترم العادات والتقاليد المحلية', en: 'Respect local customs and traditions' }),
        JSON.stringify({ ar: 'البس ملابس محتشمة خاصة في القرى', en: 'Dress modestly especially in villages' }),
        JSON.stringify({ ar: 'اطلب إذناً قبل تصوير الأشخاص', en: 'Ask permission before photographing people' }),
        JSON.stringify({ ar: 'تعلم بعض الكلمات السقطرية الأساسية', en: 'Learn basic Soqotri words' }),
        JSON.stringify({ ar: 'كن صبوراً ومهذباً', en: 'Be patient and polite' })
      ],
      order: 4
    }
  ]

  for (const cat of safetyCategories) {
    await prisma.safetyCategory.upsert({
      where: { id: `safety-cat-${cat.order}` },
      update: cat,
      create: { id: `safety-cat-${cat.order}`, ...cat }
    })
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. Emergency Contacts (جهات الاتصال)
  // ═══════════════════════════════════════════════════════════════
  console.log('🚨 Seeding Emergency Contacts...')
  
  const emergencyContacts = [
    { nameAr: 'الشرطة', nameEn: 'Police', number: '199', icon: '👮', order: 1 },
    { nameAr: 'الإسعاف', nameEn: 'Ambulance', number: '191', icon: '🚑', order: 2 },
    { nameAr: 'Hawari Tours', nameEn: 'Hawari Tours', number: '+967 772 371 581', icon: '📞', order: 3 }
  ]

  for (const contact of emergencyContacts) {
    await prisma.emergencyContact.upsert({
      where: { id: `emergency-contact-${contact.order}` },
      update: contact,
      create: { id: `emergency-contact-${contact.order}`, ...contact }
    })
  }

  // ═══════════════════════════════════════════════════════════════
  // 8. Packing Categories (قائمة الأمتعة)
  // ═══════════════════════════════════════════════════════════════
  console.log('🎒 Seeding Packing Categories...')
  
  const packingCategories = [
    {
      categoryAr: 'الملابس',
      categoryEn: 'Clothing',
      icon: '👕',
      items: [
        JSON.stringify({ ar: 'ملابس خفيفة', en: 'Light clothes' }),
        JSON.stringify({ ar: 'سترة للمساء', en: 'Evening jacket' }),
        JSON.stringify({ ar: 'حذاء مشي', en: 'Walking shoes' }),
        JSON.stringify({ ar: 'قبعة', en: 'Hat' })
      ],
      order: 1
    },
    {
      categoryAr: 'المستلزمات',
      categoryEn: 'Essentials',
      icon: '🎒',
      items: [
        JSON.stringify({ ar: 'واقي شمس', en: 'Sunscreen' }),
        JSON.stringify({ ar: 'نظارة شمسية', en: 'Sunglasses' }),
        JSON.stringify({ ar: 'كاميرا', en: 'Camera' }),
        JSON.stringify({ ar: 'باور بانك', en: 'Power bank' })
      ],
      order: 2
    },
    {
      categoryAr: 'الصحة',
      categoryEn: 'Health',
      icon: '💊',
      items: [
        JSON.stringify({ ar: 'أدوية شخصية', en: 'Personal meds' }),
        JSON.stringify({ ar: 'مسكنات', en: 'Pain relievers' }),
        JSON.stringify({ ar: 'مطهر', en: 'Antiseptic' }),
        JSON.stringify({ ar: 'لاصقات جروح', en: 'Band-aids' })
      ],
      order: 3
    },
    {
      categoryAr: 'إلكترونيات',
      categoryEn: 'Electronics',
      icon: '📱',
      items: [
        JSON.stringify({ ar: 'هاتف محمول', en: 'Phone' }),
        JSON.stringify({ ar: 'شاحن', en: 'Charger' }),
        JSON.stringify({ ar: 'محول كهرباء', en: 'Power adapter' }),
        JSON.stringify({ ar: 'سماعات', en: 'Headphones' })
      ],
      order: 4
    }
  ]

  for (const cat of packingCategories) {
    await prisma.packingCategory.upsert({
      where: { id: `packing-cat-${cat.order}` },
      update: cat,
      create: { id: `packing-cat-${cat.order}`, ...cat }
    })
  }

  // ═══════════════════════════════════════════════════════════════
  // 9. Travel Guide Settings
  // ═══════════════════════════════════════════════════════════════
  console.log('⚙️ Seeding Travel Guide Settings...')
  
  await prisma.travelGuideSetting.upsert({
    where: { id: 'default-travel-settings' },
    update: {},
    create: { id: 'default-travel-settings' }
  })

  console.log('✅ Travel Guide Seed Completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
